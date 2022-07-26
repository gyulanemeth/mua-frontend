<script setup>
import { watchEffect, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AccountDetails from '../components/AccountDetails.vue'
import useSystemMessagesStore from '../stores/systemMessages.js'
import EmailAndNameForm from '../components/EmailAndNameForm.vue'
import stores from '../stores/index.js'

const store = stores().currentUserAndAccountStore()
const route = useRoute()
const router = useRouter()

const formData = ref()

async function loadData () {
  if (route.name === 'account') {
    if (!store.account.name) {
      await store.readOne()
    }
    formData.value = store.account
  } else if (route.name === 'patchAccountName') {
    formData.value = { inputType: 'text', inputText: 'New Name', text: 'Update Name' }
  } else if (route.name === 'patchUrlFriendlyName') {
    formData.value = { inputType: 'text', inputText: 'New Url Friendly Name', text: 'Update Url Friendly Name' }
  } else {
    if (store.account === null) {
      useSystemMessagesStore().addError({ status: 404, name: 'NOT_FOUND', message: 'Account data not found please login' })
      return router.push('/')
    }
  }
}

async function eventHandler (data) {
  if (formData.value.text === 'Update Name') {
    await store.patchAccountName(data)
  } else if (formData.value.text === 'Update Url Friendly Name') {
    await store.patchUrlFriendlyName(data)
  }
}

watchEffect(async () => {
  loadData()
})
</script>

<template>
  <EmailAndNameForm v-if="route.name === 'patchAccountName'|| route.name === 'patchUrlFriendlyName' " :formData="formData" @buttonEvent="eventHandler" />
    <AccountDetails v-else-if="formData" :data="formData" />
</template>
