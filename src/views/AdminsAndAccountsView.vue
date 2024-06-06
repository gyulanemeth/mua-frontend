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
      header: tm('muaAuth.createAdminDialog.inviteHeader'),
      input: [{
        label: tm('muaAuth.createAdminDialog.emailLabel'),
        name: 'email',
        placeholder: tm('muaAuth.createAdminDialog.emailPlaceHolder'),
        type: 'email'
      }, {
        label: tm('muaAuth.createAdminDialog.confirmEmailLabel'),
        name: 'confirmEmail',
        placeholder: tm('muaAuth.createAdminDialog.confirmEmailPlaceHolder'),
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
      header: tm('muaAuth.createAdminDialog.detailsHeader'),
      input: [{
        label: tm('muaAuth.createAdminDialog.nameLabel'),
        name: 'name',
        placeholder: tm('muaAuth.createAdminDialog.namePlaceHolder'),
        type: 'text'
      }, {
        label: tm('muaAuth.createAdminDialog.urlFriendlyNameLabel'),
        name: 'urlFriendlyName',
        placeholder: tm('muaAuth.createAdminDialog.urlFriendlyNamePlaceHolder'),
        type: 'text'
      }, {
        label: tm('muaAuth.createAdminDialog.logoLabel'),
        name: 'pic',
        placeholder: tm('muaAuth.createAdminDialog.logoPlaceHolder'),
        type: 'file'
      }]
    }
  }
}

async function handleDetailsEvent (params) {
  localStorage.setItem('accountId', params.id)
  router.push(`/system-accounts/${params.urlFriendlyName}/users`)
}

async function handleDeleteEvent (params, statusCallBack) {
  const res = await store.deleteOne(params)
  statusCallBack(!res.message)
  if (!res.message) {
    loadData()
    useSystemMessagesStore().addSuccess({ message: tm('muaAuth.createAdminDialog.successfullyDeletedAlert') })
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
    useSystemMessagesStore().addSuccess({ message: tm('muaAuth.createAdminDialog.invitationAlert') })
  }
}

async function handleCreateEvent (params, statusCallBack) {
  const res = await store.createOneByAdmin(params)
  statusCallBack(!res.message)
  if (!res.message) {
    useSystemMessagesStore().addSuccess({ message: tm('muaAuth.createAdminDialog.createAlert') })
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
