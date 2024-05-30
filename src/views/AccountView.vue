<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import AccountDetails from '../components/AccountDetails.vue'
import useSystemMessagesStore from '../stores/systemMessages.js'
import { useCurrentUserAndAccountStore } from '../stores/index.js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useCurrentUserAndAccountStore()
const router = useRouter()
const data = ref()
if (!store.user || !store.user.role) {
  store.readOneUser()
}

if (!store.account || !store.account.name) {
  await store.readOne()
  if (!store.account) {
    useSystemMessagesStore().addError({
      status: 404,
      name: 'NOT_FOUND',
      message: 'Account data not found please login'
    })
    router.push('/system-accounts/')
  }
}
data.value = store.account

async function handleUpdateAccountName (params) {
  const res = await store.patchAccountName(params)
  if (!res.message) {
    useSystemMessagesStore().addSuccess({ message: t('accountView.updateAccountNameAlert') })
  }
}

async function handleUpdateUrlFriendlyName (params) {
  const res = await store.patchUrlFriendlyName(params)
  if (!res.message) {
    useSystemMessagesStore().addSuccess({ message: t('accountView.updateUrlFriendlyNameAlert') })
  }
}

async function handleUploadLogo (params, statusCallBack) {
  const res = await store.uploadLogo(params)
  statusCallBack(res.logo)
  data.value = store.account
  if (res) {
    useSystemMessagesStore().addSuccess({ message: t('accountView.uploadLogoAlert') })
  }
}

async function handleDeleteLogo (statusCallBack) {
  const res = await store.deleteLogo()
  statusCallBack(!res.message)
  data.value = store.account
  if (!res.message) {
    useSystemMessagesStore().addSuccess({ message: t('accountView.deleteLogoAlert') })
  }
}

</script>

<template>

<AccountDetails v-if="data" @uploadLogoHandler="handleUploadLogo" @deleteLogoHandler="handleDeleteLogo" @updateNameHandler='handleUpdateAccountName' @updateUrlFriendlyNameHandler='handleUpdateUrlFriendlyName' :role="store.user && store.user.role === 'admin'" :logo="data.logo" :name="data.name" :urlFriendlyName="data.urlFriendlyName" />

</template>
