<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import UsersList from '../components/UsersList.vue'
import { useAccountsStore, useUsersStore } from '../stores/index.js'
import useSystemMessagesStore from '../stores/systemMessages.js'
import { useI18n } from 'vue-i18n'

const { tm } = useI18n()
const accountsStore = useAccountsStore()
const usersStore = useUsersStore()
const router = useRouter()

const data = ref()
const accountName = ref()
const currentUser = ref()

await usersStore.readOne()
if (!usersStore.user.role) {
  if (!usersStore.user.role) {
    useSystemMessagesStore().addError({
      status: 404,
      name: 'NOT_FOUND',
      message: 'User Id not found please login'
    })
    router.push('/system-accounts/')
  }
}
if (!accountsStore.account || !accountsStore.account.name) {
  await accountsStore.readOne()
  if (!accountsStore.account.name) {
    useSystemMessagesStore().addError({
      status: 404,
      name: 'NOT_FOUND',
      message: 'Account Id not found please login'
    })
    router.push('/system-accounts/')
  }
}
accountName.value = accountsStore.account.name
currentUser.value = usersStore.user
usersStore.params = {
  accountId: accountsStore.account._id
}

await usersStore.load()
data.value = usersStore.items

async function handleUpdateRole (params) {
  const res = await usersStore.patchRole(params.id, {
    role: params.role
  })
  if (!res.message) {
    useSystemMessagesStore().addSuccess({ message: tm('muaAuth.userView.roleUpdateAlert') })
    await usersStore.load()
    data.value = usersStore.items
  }
}

async function handleDeleteUser (params) {
  const res = await usersStore.deleteOne(params)
  if (!res.message) {
    useSystemMessagesStore().addSuccess({ message: tm('muaAuth.userView.accountDeleteAlert') })
    await usersStore.load()
    data.value = usersStore.items
    if (usersStore.user._id === params.id) {
      await usersStore.logout()
    }
  }
}

async function handleInviteMember (params, statusCallBack) {
  const res = await usersStore.sendInvitation(params.email)
  statusCallBack(!res.message)
  if (!res.message) {
    await usersStore.load()
    data.value = usersStore.items
  }
}

async function handleReInviteMember (params) {
  const res = await usersStore.reSendInvitation(params.email)
  if (!res.message) {
    useSystemMessagesStore().addSuccess({ message: tm('muaAuth.userView.invitationSentAlert') })
  }
}

async function loadMore () {
  if (usersStore.items.length !== usersStore.count) {
    usersStore.skip = usersStore.skip + 10
    await usersStore.loadMore()
    data.value = usersStore.items
  }
}

async function searchBarHandler (filter, statusCallBack) {
  if (filter === '') {
    usersStore.filter = {}
  } else {
    usersStore.filter = {
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
  await usersStore.load()
  data.value = usersStore.items
  statusCallBack()
}

</script>

<template>

<UsersList :items="data" :currentAccName="accountName" :currentUser="currentUser" :roles="['admin', 'user']" @loadMore='loadMore' @inviteEventHandler="handleInviteMember" @reInviteEventHandler="handleReInviteMember"  @updateRoleEventHandler="handleUpdateRole" @deleteEventHandler='handleDeleteUser' @searchEvent="searchBarHandler" />

</template>
