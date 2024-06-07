<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AdminAccountDetails from '../components/AdminAccountDetails.vue'

import useSystemMessagesStore from '../stores/systemMessages.js'
import { useAdminsStore } from '../stores/index.js'

const { tm } = useI18n()
const store = useAdminsStore()
const route = useRoute()
const router = useRouter()

const data = ref()

if (route.name === 'system-admins-verify-email') {
  const res = await store.patchEmailConfirm(route.query.token)
  if (!res.message) {
    await store.readOne()
    router.push('/system-admins/me')
  }
} else if (!store.user || !store.user.name) {
  await store.readOne()
}
data.value = store.user

async function handleUpdateNameEvent (params) {
  const res = await store.patchName(params)
  if (!res.message) {
    useSystemMessagesStore().addSuccess({ message: tm('mua.adminProfileView.nameUpdateAlert') })
  }
}

async function handleUpdatePasswordEvent (params, statusCallBack) {
  const res = await store.patchPassword(params.oldPassword, params.newPassword, params.confirmNewPassword)
  statusCallBack(!res.message)
}
async function handleUpdateEmailEvent (params, statusCallBack) {
  const res = await store.patchEmail(params.newEmail, params.confirmNewEmail)
  statusCallBack(!res.message)
}
async function handleDeleteEvent (params) {
  const res = await store.deleteOne(params)
  if (!res.message) {
    useSystemMessagesStore().addSuccess({ message: tm('mua.adminProfileView.deleteAccountAlert') })
    await store.logout()
  }
}

async function uploadProfilePicture (params, statusCallBack) {
  const res = await store.uploadProfilePicture(params)
  data.value = store.user
  statusCallBack(res.profilePicture)
}

async function deleteProfilePicture (statusCallBack) {
  const res = await store.deleteProfilePicture()
  data.value = store.user
  statusCallBack(res)
}

</script>

<template>

<AdminAccountDetails v-if='data' :data="data" @deleteProfilePictureHandler="deleteProfilePicture" @uploadProfilePictureHandler="uploadProfilePicture" @updateNameHandler='handleUpdateNameEvent' @updatePasswordHandler='handleUpdatePasswordEvent' @updateEmailHandler='handleUpdateEmailEvent' @deleteEventHandler='handleDeleteEvent' />

</template>
