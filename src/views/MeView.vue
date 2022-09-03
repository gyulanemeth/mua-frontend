<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import MeDetails from '../components/MeDetails.vue'
import { useCurrentUserAndAccountStore, useUsersStore } from '../stores/index.js'
import useSystemMessagesStore from '../stores/systemMessages.js'
import alerts from '../alerts/alert.js'

let store = useCurrentUserAndAccountStore()
const route = useRoute()
const router = useRouter()
const alert = alerts()

const data = ref()

if (route.name === 'verify-email') {
  const res = await store.patchEmailConfirm(route.query.token)
  if (!res.message) {
    router.push({
      path: '/me',
      query: {
        tab: 'changeEmail'
      }
    })
    await new Promise(resolve => setTimeout(resolve, 5000))
    router.push({
      path: '/me',
      query: {},
      replace: true
    })
  }
} else if (!store.user || !store.user.name) {
  await store.readOneUser()
  if (store.user === null) {
    useSystemMessagesStore().addError({
      status: 404,
      name: 'NOT_FOUND',
      message: 'User data not found please login'
    })
    router.push('/')
  }
}
data.value = store.user

async function handleUpdateUserName (params) {
  const res = await store.patchUserName(params)
  if (res) {
    await alert.message('Name updated successfully')
  }
}

async function handleUpdatePassword (params, statusCallBack) {
  const res = await store.patchPassword(params.oldPassword, params.newPassword, params.confirmNewPassword)
  if (!res.message) {
    await alert.message('Password updated successfully')
  }
}
async function handleUpdateEmail (params, statusCallBack) {
  const res = await store.patchEmail(params.newEmail, params.confirmNewEmail)
  statusCallBack(!res.message)
}
async function handleDeleteMyAccount (params) {
  store = useUsersStore()
  const res = await store.deleteMyAccount(params)
  if (!res.message) {
    alert.message('Account Deleted successfully')
    store = useCurrentUserAndAccountStore()
    await store.logout()
  }
}

</script>

<template>

<MeDetails v-if="data" :data="data" @updateNameHandler='handleUpdateUserName' @updatePasswordHandler='handleUpdatePassword' @updateEmailHandler='handleUpdateEmail' @deleteMyAccountHandler='handleDeleteMyAccount' />

</template>
