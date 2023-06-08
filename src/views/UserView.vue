<script setup>
import { ref } from 'vue'
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

const store = useUsersStore()

if (!currentUserAndAccountStore.user.role) {
  await currentUserAndAccountStore.readOneUser()
  if (!currentUserAndAccountStore.user.role) {
    useSystemMessagesStore().addError({
      status: 404,
      name: 'NOT_FOUND',
      message: 'User Id not found please login'
    })
    router.push('/')
  }
}
if (!currentUserAndAccountStore.account || !currentUserAndAccountStore.account.name) {
  await currentUserAndAccountStore.readOne()
  if (!currentUserAndAccountStore.account.name) {
    useSystemMessagesStore().addError({
      status: 404,
      name: 'NOT_FOUND',
      message: 'Account Id not found please login'
    })
    router.push('/')
  }
}
accountName.value = currentUserAndAccountStore.account.name
currentUser.value = currentUserAndAccountStore.user
store.params = {
  accountId: currentUserAndAccountStore.account._id
}
await store.load()
data.value = store.items
if (currentUserAndAccountStore.user.role === 'admin') {
  const config = await store.config()
  roles.value = config.role
}

async function handleUpdateRole (params) {
  const res = await store.patchRole(params.id, {
    role: params.role
  })
  if (!res.message) {
    alert.message('User role updated successfully')
    await store.load()
    data.value = store.items
  }
}

async function handleDeleteUser (params) {
  const res = await store.deleteOne(params)
  if (!res.message) {
    alert.message('Account Deleted successfully')
    await store.load()
    data.value = store.items
    if (currentUserAndAccountStore.user._id === params.id) {
      await currentUserAndAccountStore.logout()
    }
  }
}

async function handleInviteMember (params, statusCallBack) {
  const res = await currentUserAndAccountStore.sendInvitation(params.email)
  if (!res.message) {
    await store.load()
    data.value = store.items
    statusCallBack(true)
  }
}

async function loadMore (params) {
  if (store.items.length !== store.count) {
    store.skip = params * 10
    await store.loadMore()
    data.value = store.items
  }
}

async function searchBarHandler (filter) {
  if (filter === '') {
    store.filter = {}
  } else {
    store.filter = {
      $or: [{
        name: {
          $regex: filter,
          $options: 'i'
        }
      },
      {
        email: {
          $regex: filter,
          $options: 'i'
        }
      }]
    }
  }
  await store.load()
  data.value = store.items
}

</script>

<template>

<UsersList :items="data" :currentAccName="accountName" :currentUser="currentUser" :roles="roles" @loadMore='loadMore' @inviteEventHandler="handleInviteMember" @updateRoleEventHandler="handleUpdateRole" @deleteEventHandler='handleDeleteUser' @searchEvent="searchBarHandler" />

</template>
