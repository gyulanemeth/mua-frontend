<script setup>
import { watchEffect, ref } from 'vue'
import { useRouter } from 'vue-router'

import AccountDetails from '../components/AccountDetails.vue'
import useSystemMessagesStore from '../stores/systemMessages.js'
import { useCurrentUserAndAccountStore } from '../stores/index.js'

const store = useCurrentUserAndAccountStore()
const router = useRouter()

const data = ref()

async function loadData () {
  if (!store.account.name) {
    await store.readOne()
  }
  data.value = store.account
  if (store.account === null) {
    useSystemMessagesStore().addError({
      status: 404,
      name: 'NOT_FOUND',
      message: 'Account data not found please login'
    })
    return router.push('/')
  }
}

async function handleUpdateAccountName (params) {
  const res = await store.patchAccountName(params)
  if (res) {
    await alert.message('Name updated successfully')
  }
}

async function handleUpdateUrlFriendlyName (params) {
  const res = await store.patchUrlFriendlyName(params)
  if (!res.message) {
    await alert.message('urlFriendlyName updated successfully')
  }
}

watchEffect(async () => {
  loadData()
})

</script>

<template>

<AccountDetails v-if="data" @updateNameHandler='handleUpdateAccountName' @updateUrlFriendlyNameHandler='handleUpdateUrlFriendlyName' :name="data.name" :urlFriendlyName="data.urlFriendlyName" />

</template>
