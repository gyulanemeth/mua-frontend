<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import CardList from '../components/ListAdminsAndAccounts.vue'
import useSystemMessagesStore from '../stores/systemMessages.js'
import { useAdminsStore, useAccountsStore } from '../stores/index.js'

import { useI18n } from 'vue-i18n'
const { tm } = useI18n()

const route = useRoute()
const router = useRouter()

const data = ref()
const numOfPages = ref()

const btn = ref()

let store

onMounted(async () => {
  if (!useAdminsStore().user.name) {
    await useAdminsStore().readOne()
  }
})

async function loadData () {
  if (route.name === 'system-admins') {
    store = useAdminsStore()
    store.filter = {}
    await store.loadPage(1)
    numOfPages.value = store.numOfPages
    data.value = store.items
    btn.value = {
      header: tm('mua.adminCreateDialog.inviteHeader'),
      input: [{
        label: tm('mua.adminCreateDialog.emailLabel'),
        name: 'email',
        placeholder: tm('mua.adminCreateDialog.emailPlaceHolder'),
        type: 'email'
      }, {
        label: tm('mua.adminCreateDialog.confirmEmailLabel'),
        name: 'confirmEmail',
        placeholder: tm('mua.adminCreateDialog.confirmEmailPlaceHolder'),
        type: 'email'
      }]
    }
  } else if (route.name === 'system-admins-accounts') {
    store = useAccountsStore()
    store.filter = {}
    await store.loadPage(1)
    numOfPages.value = store.numOfPages
    data.value = store.items
    btn.value = {
      header: tm('mua.adminCreateDialog.detailsHeader'),
      input: [{
        label: tm('mua.adminCreateDialog.nameLabel'),
        name: 'name',
        placeholder: tm('mua.adminCreateDialog.namePlaceHolder'),
        type: 'text'
      }, {
        label: tm('mua.adminCreateDialog.urlFriendlyNameLabel'),
        name: 'urlFriendlyName',
        placeholder: tm('mua.adminCreateDialog.urlFriendlyNamePlaceHolder'),
        type: 'text'
      }, {
        label: tm('mua.adminCreateDialog.logoLabel'),
        name: 'pic',
        placeholder: tm('mua.adminCreateDialog.logoPlaceHolder'),
        type: 'file'
      }]
    }
  }
}

async function handleDetailsEvent (params) {
  localStorage.setItem('accountId', params.id)
  router.push(`/accounts/${params.urlFriendlyName}/users`)
}

async function handleDeleteEvent (params, statusCallBack) {
  const res = await store.deleteOne(params)
  statusCallBack(!res.message)
  if (!res.message) {
    loadData()
    useSystemMessagesStore().addSuccess({ message: tm('mua.adminCreateDialog.successfullyDeletedAlert') })
  }
}

async function handleInviteEvent (params, statusCallBack) {
  store = useAdminsStore()
  const res = await store.sendInvitation(params.email)
  statusCallBack(!res.message)
  loadData()
}

async function handleReInviteEvent (params) {
  store = useAdminsStore()
  const res = await store.reSendInvitation(params.email)
  if (!res.message) {
    useSystemMessagesStore().addSuccess({ message: tm('mua.adminCreateDialog.invitationAlert') })
  }
}

async function handleCreateEvent (params, statusCallBack) {
  const res = await store.createOneByAdmin(params)
  statusCallBack(!res.message)
  if (!res.message) {
    useSystemMessagesStore().addSuccess({ message: tm('mua.adminCreateDialog.createAlert') })
    loadData()
  }
}

async function loadPage (page, rows) {
  store.itemsPerPage = rows
  await store.loadPage(page)
  numOfPages.value = store.numOfPages
  data.value = store.items
}

async function searchBarHandler (filter, statusCallBack) {
  const filterParam = route.name === 'system-admins' ? 'system-adminsemail' : 'system-admins-urlFriendlyName'
  if (filter === '') {
    store.filter = {}
  } else {
    store.filter = {
      $or: [{
        name: {
          $regex: filter,
          $options: 'i'
        }
      },
      {
        [filterParam]: {
          $regex: filter,
          $options: 'i'
        }
      }]
    }
  }
  await store.loadPage(1)
  data.value = store.items
  statusCallBack()
}

watch(route, () => {
  loadData()
}, { immediate: true })

</script>

<template>
  <CardList v-if="data" :items="data" :btn="btn" :numOfPages="numOfPages" @loadPage="loadPage"
    @reSendInvitationEventHandler="handleReInviteEvent" @detailsEventHandler="handleDetailsEvent" @deleteEventHandler="handleDeleteEvent"
    @inviteEventHandler="handleInviteEvent" @createEventHandler="handleCreateEvent" @searchEvent="searchBarHandler" />
</template>
