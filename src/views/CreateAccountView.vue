<script setup>
import { useRouter } from 'vue-router'
import CreateAccount from '../components/CreateAccount.vue'
import { useAccountsStore, useUsersStore } from '../stores/index.js'
import useSystemMessagesStore from '../stores/systemMessages.js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const accountsStore = useAccountsStore()
const usersStore = useUsersStore()
const router = useRouter()

async function createEventHandler (data, statusCallBack) {
  const res = await accountsStore.createAccount(data)
  if (res.loginToken) {
    localStorage.setItem('loginToken', res.loginToken)
    router.push(`/accounts/finalize-registration?token=${res.loginToken}`)
  } else {
    statusCallBack(res)
  }
}

async function reSendFinalizeRegistrationEventHandler (params) {
  const res = await usersStore.reSendFinalizeRegistration(params)
  if (res.success) {
    useSystemMessagesStore().addSuccess({ message: t('mua.createAccountView.emailSentAlert') })
  }
}

</script>

<template>

  <CreateAccount @buttonEvent="createEventHandler"
    @reSendFinalizeRegistrationEvent="reSendFinalizeRegistrationEventHandler" />

</template>
