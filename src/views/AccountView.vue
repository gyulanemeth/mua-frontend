<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import AccountDetails from '../components/AccountDetails.vue'
import useSystemMessagesStore from '../stores/systemMessages.js'
import { useAccountsStore, useUsersStore } from '../stores/index.js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const accountsStore = useAccountsStore()
const usersStore = useUsersStore()
const router = useRouter()
const data = ref()
if (!usersStore.user || !usersStore.user.role) {
  usersStore.readOne()
}

if (!accountsStore.account || !accountsStore.account.name) {
  await accountsStore.readOne()
  if (!accountsStore.account) {
    useSystemMessagesStore().addError({
      status: 404,
      name: 'NOT_FOUND',
      message: 'Account data not found please login'
    })
    router.push('/accounts/')
  }
}
data.value = accountsStore.account
async function handleUpdateAccountName (params) {
  const res = await accountsStore.patchAccountName({ name: params, user: usersStore.user })
  if (!res.message) {
    useSystemMessagesStore().addSuccess({ message: t('muaAuth.accountView.updateAccountNameAlert') })
  }
}

async function handleUpdateUrlFriendlyName (params) {
  const res = await accountsStore.patchUrlFriendlyName(params)
  if (!res.message) {
    useSystemMessagesStore().addSuccess({ message: t('muaAuth.accountView.updateUrlFriendlyNameAlert') })
  }
}

async function handleUploadLogo (params, statusCallBack) {
  const res = await accountsStore.uploadLogo(params)
  statusCallBack(res.logo)
  data.value = accountsStore.account
  if (res) {
    useSystemMessagesStore().addSuccess({ message: t('muaAuth.accountView.uploadLogoAlert') })
  }
}

async function handleDeleteLogo (statusCallBack) {
  const res = await accountsStore.deleteLogo()
  statusCallBack(!res.message)
  data.value = accountsStore.account
  if (!res.message) {
    useSystemMessagesStore().addSuccess({ message: t('muaAuth.accountView.deleteLogoAlert') })
  }
}

</script>

<template>

<AccountDetails v-if="data" @uploadLogoHandler="handleUploadLogo" @deleteLogoHandler="handleDeleteLogo" @updateNameHandler='handleUpdateAccountName' @updateUrlFriendlyNameHandler='handleUpdateUrlFriendlyName' :role="usersStore.user && usersStore.user.role === 'admin'" :logo="data.logo" :name="data.name" :urlFriendlyName="data.urlFriendlyName" />

</template>
