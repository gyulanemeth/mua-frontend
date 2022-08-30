<script setup>
import { watchEffect, ref } from 'vue'
import { useRouter } from 'vue-router'

import UsersList from '../components/UsersList.vue'
import { useCurrentUserAndAccountStore, useUsersStore } from '../stores/index.js'
import useSystemMessagesStore from '../stores/systemMessages.js'
import alerts from '../alerts/alert.js'

const currentUserAndAccountStore = await useCurrentUserAndAccountStore()
const router = useRouter()
const alert = alerts()

const data = ref()
const roles = ref()
const accountName = ref()
const currentUser = ref()

let store

async function loadData () {
  store = useUsersStore()
  if (currentUserAndAccountStore.account === null) {
    useSystemMessagesStore().addError({ status: 404, name: 'NOT_FOUND', message: 'Account Id not found please login' })
    return router.push('/')
  }

  if (!currentUserAndAccountStore.user.name) {
    await currentUserAndAccountStore.readOneUser()
    if (!currentUserAndAccountStore.user.name) {
      useSystemMessagesStore().addError({ status: 404, name: 'NOT_FOUND', message: 'User Id not found please login' })
      return router.push('/')
    }
  }
  accountName.value = currentUserAndAccountStore.account.name
  currentUser.value = currentUserAndAccountStore.user
  store.params = { accountId: currentUserAndAccountStore.account._id }
  await store.load()
  data.value = store.items
  if (currentUserAndAccountStore.user.role === 'admin') {
    const config = await store.config()
    roles.value = config.role
  }
}

async function handleUpdateRole (params) {
  const res = await store.patchRole(params.id, { role: params.role })
  if (!res.message) {
    alert.message('User role updated successfully')
  }
}

async function handleDeleteUser (params) {
  const res = await store.deleteOne(params.id)
  if (!res.message) {
    alert.message('Account Deleted successfully')
    if (currentUserAndAccountStore.user._id === params.id) {
      await currentUserAndAccountStore.logout()
    }
  }
}

async function handleInviteMember (params, statusCallBack) {
  const res = await currentUserAndAccountStore.sendInvitation(params.email)
  statusCallBack(!res.message)
}

async function searchBarHandler (filter) {
  if (filter === '') {
    store.filter = {}
  } else {
    store.filter = { $text: { $search: `"${filter}"` } }
  }
  await store.load()
  data.value = store.items
}

watchEffect(async () => {
  loadData()
})
</script>

  <template>
    <UsersList :items="data" :currentAccName="accountName" :currentUser="currentUser" :roles="roles" @inviteEventHandler="handleInviteMember" @updateRoleEventHandler="handleUpdateRole" @deleteEventHandler='handleDeleteUser' @searchEvent="searchBarHandler" />
  </template>
