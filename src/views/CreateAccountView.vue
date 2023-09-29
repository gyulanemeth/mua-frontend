<script setup>
import CreateAccount from '../components/CreateAccount.vue'
import { useCurrentUserAndAccountStore } from '../stores/index.js'
import useSystemMessagesStore from '../stores/systemMessages.js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useCurrentUserAndAccountStore()

async function createEventHandler (data, statusCallBack) {
  const res = await store.createAccount(data)
  if (res.success) {
    statusCallBack(res)
  }
}

async function reSendFinalizeRegistrationEventHandler (params) {
  const res = await store.reSendFinalizeRegistration(params)
  if (res.success) {
    useSystemMessagesStore().addSuccess({ message: t('createAccountView.emailSentAlert') })
  }
}

</script>

<template>

<CreateAccount @buttonEvent="createEventHandler" @reSendFinalizeRegistrationEvent=" reSendFinalizeRegistrationEventHandler" />

</template>
