<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import AccountDetails from '../components/AccountDetails.vue'
import useSystemMessagesStore from '../stores/systemMessages.js'
import { useCurrentUserAndAccountStore } from '../stores/index.js'
import alerts from '../alerts/alert.js'

const alert = alerts()
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
    router.push('/')
  }
}
data.value = store.account

async function handleUpdateAccountName (params) {
  const res = await store.patchAccountName(params)
  if (!res.message) {
    await alert.message('Name updated successfully')
  }
}

async function handleUpdateUrlFriendlyName (params) {
  const res = await store.patchUrlFriendlyName(params)
  if (!res.message) {
    await alert.message('urlFriendlyName updated successfully')
  }
}

async function handleUploadLogo (params, statusCallBack) {
  const res = await store.uploadLogo(params)
  statusCallBack(res.logoPath)
  if (res) {
    await alert.message('Updated Successfully')
  }
}

async function handleDeleteLogo (statusCallBack) {
  const res = await store.deleteLogo()
  statusCallBack(!res.message)
  if (!res.message) {
    await alert.message('Updated Successfully')
  }
}

</script>

<template>

<AccountDetails v-if="data" @uploadLogoHandler="handleUploadLogo" @deleteLogoHandler="handleDeleteLogo" @updateNameHandler='handleUpdateAccountName' @updateUrlFriendlyNameHandler='handleUpdateUrlFriendlyName' :role="store.user && store.user.role === 'admin'" :logoPath="data.logoPath" :name="data.name" :urlFriendlyName="data.urlFriendlyName" />

</template>
