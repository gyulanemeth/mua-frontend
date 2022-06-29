<script setup>
import { defineComponent, watchEffect, ref } from 'vue'
import List from '../components/List.vue'
import stores from '../stores/index.js'
import systemMessages from '../stores/systemMessages.js'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const data = ref()
const btn = ref()
let store
async function loadData () {
  const currentAccountStore = await stores().currentUserAndAccountStore()
  store = stores().usersStore()
  if (currentAccountStore.account === null) {
    systemMessages().addError({ status: 404, name: 'NOT_FOUND', message: 'Account Id not found please login' })
    return router.push('/login')
  }
  store.params = { accountId: currentAccountStore.account._id }
  await store.load()
  data.value = store.items
  btn.value = { text: 'Delete', color: 'red-lighten-2' }
}

async function eventHandler (id) {
  store.deleteOne(id)
}

async function searchBarHandler (filter) {
  if (filter === '') {
    store.filter = {}
  } else {
    store.filter = { $text: { $search: `"\" ${filter} "\"` } }
  }
  await store.load()
  data.value = store.items
}

watchEffect(async () => {
  loadData()
})
</script>

<template>
  <List :items="data" :btn="btn" @buttonEvent="eventHandler" @searchEvent="searchBarHandler" />
</template>
