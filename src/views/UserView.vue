<script setup>
import { watchEffect, ref } from 'vue'
import { useRouter } from 'vue-router'

import UsersList from '../components/UsersList.vue'
import stores from '../stores/index.js'
import useSystemMessagesStore from '../stores/systemMessages.js'

const router = useRouter()

const data = ref()
const roles = ref()
let store

async function loadData () {
  const currentAccountStore = await stores().currentUserAndAccountStore()
  store = stores().usersStore()
  if (currentAccountStore.account === null) {
    useSystemMessagesStore().addError({ status: 404, name: 'NOT_FOUND', message: 'Account Id not found please login' })
    return router.push('/')
  }
  store.params = { accountId: currentAccountStore.account._id }
  await store.load()
  data.value = store.items
  const config = await store.config()
  roles.value = config.role
}

async function eventHandler (data) {
  if (data.operation === 'delete') {
    store.deleteOne(data.id)
  } else if (data.operation === 'updateRole') {
    store.patchRole(data.id, { role: data.role })
  }
}

async function searchBarHandler (filter) {
  if (filter === '') {
    store.filter = {}
  } else {
    store.filter = { $text: { $search: `"${filter}"` } }
  }
  await store.load()
  data.value = store.items
}

watchEffect(async () => {
  loadData()
})
</script>

<template>
  <UsersList :items="data" :roles="roles" @buttonEvent="eventHandler" @searchEvent="searchBarHandler" />

</template>
