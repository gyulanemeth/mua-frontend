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
    store.skip = 0
    store.sort = localStorage.getItem('adminsSortBy') ? JSON.parse(localStorage.getItem('adminsSortBy')) : { updatedAt: -1 }
    await store.load()
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
    store.skip = 0
    store.sort = localStorage.getItem('accountsSortBy') ? JSON.parse(localStorage.getItem('accountsSortBy')) : { updatedAt: -1 }
    await store.load()
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
  const res = await store.sendInvitation(params.email, params.confirmEmail)
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

async function loadMore () {
  if (store.items.length !== store.count) {
    store.skip = store.skip + 10
    await store.loadMore()
    data.value = store.items
  }
}

async function handleSortEvent (sort, statusCallBack) {
  store.skip = 0
  store.sort = sort
  const key = route.name === 'system-admins' ? 'adminsSortBy' : 'accountsSortBy'
  localStorage.setItem(key, JSON.stringify(sort))
  await store.load()
  data.value = store.items
  statusCallBack()
}

async function searchBarHandler (filter, statusCallBack) {
  if (filter === '') {
    store.filter = {}
  } else if (route.name === 'system-admins') {
    store.filter = {
      $or: [
        { name: { $regex: filter, $options: 'i' } },
        { email: { $regex: filter, $options: 'i' } }
      ]
    }
  } else if (filter.includes('@')) {
    store.filter = { userEmail: filter }
  } else {
    const isValidObjectId = /^[a-fA-F0-9]{24}$/.test(filter)
    store.filter = {
      $or: [
        { name: { $regex: filter, $options: 'i' } },
        isValidObjectId ? { _id: filter } : { urlFriendlyName: { $regex: filter, $options: 'i' } }
      ]
    }
  }
  store.skip = 0
  await store.load()
  data.value = store.items
  statusCallBack()
}

watch(route, () => {
  loadData()
}, { immediate: true })

</script>

<template>
  <CardList v-if="data" :items="data" :btn="btn" :adminId="useAdminsStore().user?._id" :sort="route.name === 'system-admins' ? useAdminsStore().sort : useAccountsStore().sort" @sortEventHandler="handleSortEvent"
    @loadMore='loadMore' @reSendInvitationEventHandler="handleReInviteEvent" @detailsEventHandler="handleDetailsEvent"
    @deleteEventHandler="handleDeleteEvent" @inviteEventHandler="handleInviteEvent"
    @createEventHandler="handleCreateEvent" @searchEvent="searchBarHandler" />
</template>
