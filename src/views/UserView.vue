<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import UsersList from '../components/UsersList.vue'
import { useCurrentUserAndAccountStore, useUsersStore } from '../stores/index.js'
import useSystemMessagesStore from '../stores/systemMessages.js'
import { useI18n } from 'vue-i18n'

const { tm } = useI18n()
const currentUserAndAccountStore = await useCurrentUserAndAccountStore()
const router = useRouter()

const data = ref()
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
    router.push('/system-accounts/')
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
    router.push('/system-accounts/')
  }
}
accountName.value = currentUserAndAccountStore.account.name
currentUser.value = currentUserAndAccountStore.user
store.params = {
  accountId: currentUserAndAccountStore.account._id
}
await store.load()
data.value = store.items

async function handleUpdateRole (params) {
  const res = await store.patchRole(params.id, {
    role: params.role
  })
  if (!res.message) {
    useSystemMessagesStore().addSuccess({ message: tm('userView.roleUpdateAlert') })
    await store.load()
    data.value = store.items
  }
}

async function handleDeleteUser (params) {
  const res = await store.deleteOne(params)
  if (!res.message) {
    useSystemMessagesStore().addSuccess({ message: tm('userView.accountDeleteAlert') })
    await store.load()
    data.value = store.items
    if (currentUserAndAccountStore.user._id === params.id) {
      await currentUserAndAccountStore.logout()
    }
  }
}

async function handleInviteMember (params, statusCallBack) {
  const res = await currentUserAndAccountStore.sendInvitation(params.email)
  statusCallBack(!res.message)
  if (!res.message) {
    await store.load()
    data.value = store.items
  }
}

async function handleReInviteMember (params) {
  const res = await currentUserAndAccountStore.reSendInvitation(params.email)
  if (!res.message) {
    useSystemMessagesStore().addSuccess({ message: tm('userView.invitationSentAlert') })
  }
}

async function loadMore () {
  if (store.items.length !== store.count) {
    store.skip = store.skip + 10
    await store.loadMore()
    data.value = store.items
  }
}

async function searchBarHandler (filter, statusCallBack) {
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
  statusCallBack()
}

</script>

<template>

<UsersList :items="data" :currentAccName="accountName" :currentUser="currentUser" :roles="['admin', 'user']" @loadMore='loadMore' @inviteEventHandler="handleInviteMember" @reInviteEventHandler="handleReInviteMember"  @updateRoleEventHandler="handleUpdateRole" @deleteEventHandler='handleDeleteUser' @searchEvent="searchBarHandler" />

</template>
