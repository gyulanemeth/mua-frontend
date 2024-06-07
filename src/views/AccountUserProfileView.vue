<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import UserAccountDetails from '../components/UserAccountDetails.vue'
import { useAccountsStore, useUsersStore } from '../stores/index.js'
import useSystemMessagesStore from '../stores/systemMessages.js'

const accountsStore = useAccountsStore()
const usersStore = useUsersStore()
const route = useRoute()
const router = useRouter()
const { tm } = useI18n()

const data = ref()

if (route.name === 'accounts-verify-email') {
  const res = await usersStore.patchEmailConfirm(route.query.token)
  if (!res.message) {
    await accountsStore.readOne()
    useSystemMessagesStore().addSuccess({ message: tm('mua.userChangeEmail.verifyMessage') })
    router.push(`/accounts/${accountsStore.account.urlFriendlyName}/me`)
  }
} else if (!usersStore.user || !usersStore.user.name) {
  await usersStore.readOne()
  if (usersStore.user === null) {
    useSystemMessagesStore().addError({
      status: 404,
      name: 'NOT_FOUND',
      message: 'User data not found please login'
    })
    router.push('/accounts/')
  }
}
data.value = usersStore.user

async function handleUpdateUserName (params) {
  const res = await usersStore.patchUserName(params)
  if (!res.message) {
    useSystemMessagesStore().addSuccess({ message: tm('mua.AccountUserProfileView.updateNameAlert') })
  }
}

async function handleUpdatePassword (params, statusCallBack) {
  const res = await usersStore.patchPassword(params.oldPassword, params.newPassword, params.confirmNewPassword)
  statusCallBack(!res.message)
}
async function handleUpdateEmail (params, statusCallBack) {
  const res = await usersStore.patchEmail(params.newEmail, params.confirmNewEmail)
  statusCallBack(!res.message)
}
async function handleDeleteEvent (params) {
  const res = await usersStore.deleteOne(params)
  if (!res.message) {
    useSystemMessagesStore().addSuccess({ message: tm('mua.AccountUserProfileView.accountDeleteAlert') })
    await usersStore.logout()
  }
}

async function uploadProfilePicture (params, statusCallBack) {
  const res = await usersStore.uploadProfilePicture(params)
  data.value = usersStore.user
  statusCallBack(res.profilePicture)
}

async function deleteProfilePicture (statusCallBack) {
  const res = await usersStore.deleteProfilePicture()
  data.value = usersStore.user
  statusCallBack(res)
}

</script>

<template>

<UserAccountDetails v-if="data" :data="data" @deleteProfilePictureHandler="deleteProfilePicture" @uploadProfilePictureHandler="uploadProfilePicture" @updateNameHandler='handleUpdateUserName' @updatePasswordHandler='handleUpdatePassword' @updateEmailHandler='handleUpdateEmail' @deleteMyAccountHandler='handleDeleteEvent' />

</template>
