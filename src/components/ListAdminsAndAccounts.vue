<script setup>
import { ref, watch, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useDebounceFn } from '@vueuse/core'
import Dialog from '../components/AdminCreateDialog.vue'
import DeleteMyAccount from './AdminDeleteAccount.vue'

const emit = defineEmits(['deleteEventHandler', 'inviteEventHandler', 'createEventHandler', 'loadPage', 'searchEvent', 'reSendInvitationEventHandler', 'detailsEventHandler'])
const props = defineProps({
  items: Array,
  btn: Object,
  numOfPages: Number,
  adminId: String
})

const route = useRoute()
const numOfPages = ref(props.numOfPages)

const filter = ref('')
const rows = ref(10)
const page = ref(1)
const loading = ref()
const createAccountDialog = ref()

const debouncedFn = useDebounceFn(() => {
  loading.value = true
  emit('searchEvent', filter.value, () => { loading.value = false })
}, 300)

function redirectDeleteEventHandler (data) {
  loading.value = true
  emit('deleteEventHandler', data, () => { loading.value = false })
}

function redirectInviteEventHandler (data, cb) {
  emit('inviteEventHandler', data, cb)
}

function redirectCreateEventHandler (data, cb) {
  emit('createEventHandler', data, cb)
}

function loadPage () {
  emit('loadPage', page.value, rows.value)
}

watch(rows, async () => {
  loadPage()
})

watch(() => route.name, async () => {
  filter.value = ''
  page.value = 1
  numOfPages.value = props.numOfPages
})

watchEffect(async () => {
  numOfPages.value = props.numOfPages
})

const appIcon = import.meta.env.VITE_APP_ICON

</script>

<template>

  <div class="elevation-2 mx-10 pa-3 pt-0 rounded">
    <v-layout class="d-flex flex-wrap">
      <v-col cols="2" class="pt-3 d-flex align-center">
        <p class="text-h6">{{ route.name === 'system-admins' ? $t('mua.listAdminsAndAccounts.header.admin') :
          $t('mua.listAdminsAndAccounts.header.account')}} </p>
      </v-col>
      <v-spacer />
      <v-col cols="5" class="mt-3">
        <v-text-field density="compact" label="Search" data-test-id="tableList-searchBar" variant="underlined"
          append-inner-icon="mdi-magnify" v-model.lazy="filter" color="info"
          @input="loading = true; debouncedFn()"></v-text-field>
      </v-col>
      <v-col cols="2" class="pt-3 d-flex align-center">
        <v-btn variant="outlined" color="info" @click="createAccountDialog.show()">
          {{ route.name === 'system-admins' ? $t('mua.listAdminsAndAccounts.createAdminBtn') :
            $t('mua.listAdminsAndAccounts.createAccountBtn') }}
        </v-btn>
        <Dialog ref="createAccountDialog" :header="props.btn.header" @createEventHandler='redirectCreateEventHandler'
          @inviteEventHandler='redirectInviteEventHandler' :inputs="props.btn.input" />
      </v-col>
    </v-layout>
    <v-layout v-if="filter.length === 0 && props.items.length === 0 && !loading" class="d-flex flex-wrap ma-0 pa-0">
      <v-spacer />
      <v-col cols="2" class="d-flex align-center ma-0 pa-0">
        <div>
          <v-col cols="5">
            <v-icon class="ml-10" color="info" icon="mdi-arrow-up" size="x-large" />
          </v-col>
          <v-card-text class="pt-0">
            <p class="font-weight-medium">{{ route.name === 'system-admins' ? $t('mua.emptyList.inviteFirstAdmin') :
              $t('mua.emptyList.addFirstAccount')}} </p>
          </v-card-text>
        </div>
      </v-col>
    </v-layout>

    <v-layout v-if="loading" class="ma-auto d-flex flex-wrap pa-4 h-75">
      <v-card class="ma-auto align-self-start elevation-0 text-center" min-width="400">
        <v-progress-circular color="info" indeterminate :size="90"></v-progress-circular>
        <h4 class="mt-3">{{ $t('mua.loading') }}</h4>
      </v-card>
    </v-layout>

    <v-layout v-else-if="props.items.length === 0"
      :class="`ma-auto d-flex flex-wrap pa-4 ${filter.length > 0 ? 'h-75' : 'h-50'}`">
      <v-card class="ma-auto align-self-start elevation-0 text-center"
        :min-width="filter.length === 0 ? route.name === 'system-admins' ? 320 : 280 : 400">
        <v-avatar size="150">
          <v-img :src="appIcon" cover></v-img>
        </v-avatar>
        <v-row class="mt-2">
          <v-col cols="2" class="pt-3 mr-0 pr-0">
            <v-icon color="error" icon="mdi-cancel" size="x-large"></v-icon>
          </v-col>
          <v-col cols="10" class="pt-4 ml-0 pl-0">
            <h3 v-if="filter.length === 0">{{ $t('mua.emptyList.NoElementsYet', {
              name: route.name === 'system-admins' ?
                $t('mua.listAdminsAndAccounts.header.admin') : $t('mua.listAdminsAndAccounts.header.account')}) }}</h3>
            <h3 v-else>{{ $t('mua.emptyList.searchNoResult') }}</h3>
          </v-col>
        </v-row>
        <h3 class="w-100" v-if="filter.length > 0">{{ filter }}</h3>
      </v-card>
    </v-layout>

    <div v-else>
      <v-layout class="d-flex flex-wrap">
        <v-table fixed-header class="w-100">
          <thead>
            <tr>
              <th class="text-left">
                {{ $t('mua.listAdminsAndAccounts.tableHeader.nameLabel') }}
              </th>
              <th v-if="route.name === 'system-admins'" class="text-left">
                {{ $t('mua.listAdminsAndAccounts.tableHeader.emailLabel') }}
              </th>
              <th v-else class="text-left">
                {{ $t('mua.listAdminsAndAccounts.tableHeader.urlFriendlyName') }}
              </th>
              <th class="text-left">
                {{ $t('mua.listAdminsAndAccounts.tableHeader.lastEditedLabel') }}
              </th>
              <th class="text-left">
                {{ $t('mua.listAdminsAndAccounts.tableHeader.creationDateLabel') }}
              </th>
              <th>
              </th>
            </tr>
          </thead>
          <tbody>

            <tr v-for="(item, i) in props.items" :key="item._id">
              <td :data-test-id="`tableList-${i}-name`">{{ item.data.name }}</td>
              <td v-if="route.name === 'system-admins'">{{ item.data.email }}</td>
              <td v-else>{{ item.data.urlFriendlyName }}</td>
              <td>{{ new Date(item.data.createdAt).toLocaleDateString() }}</td>
              <td>{{ new Date(item.data.updatedAt).toLocaleDateString() }}</td>

              <td v-if="route.name === 'system-admins'" :data-test-id="`tableList-${i}-deleteBtn`" class="text-right">
                <v-tooltip :text="$t('mua.listAdminsAndAccounts.resendMessage')">
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" color="grey" v-if="!item.data.name" variant="text" class="ma-2"
                      icon="mdi-email-sync" size="small"
                      @click="$emit('reSendInvitationEventHandler', { email: item.data.email })" />
                  </template>
                </v-tooltip>
                <DeleteMyAccount v-if="item._id !== props.adminId" @deleteEventHandler='redirectDeleteEventHandler' :data="item.data" />
              </td>
              <td v-else class="text-right">
                <v-btn color="grey" variant="text" class="ma-2" icon="mdi-arrow-right" size="small"
                  @click="$emit('detailsEventHandler', { id: item._id, urlFriendlyName: item.data.urlFriendlyName })" />
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-layout>
      <v-divider />
      <v-layout class="d-flex flex-wrap justify-center align-center">
        <v-spacer />
        <p class="ma-2">
          {{ $t('mua.listAdminsAndAccounts.tableFooter.label') }}
        </p>
        <p class="ma-2">
          <v-select hide-details density="compact" variant="underlined" v-model="rows" :items="[5, 10, 15]" />
        </p>
        <p class="ma-2">{{ page }} of {{ numOfPages }} </p>
        <v-col cols="3">
          <v-btn color="grey" variant="text" class="ma-2" icon="mdi-chevron-left" :disabled="page === 1" size="small"
            @click="page = page - 1; loadPage()" />
          <v-btn color="grey" variant="text" class="ma-2" icon="mdi-chevron-right" :disabled="page === numOfPages"
            size="small" @click="page = page + 1; loadPage()" />
          <v-btn color="grey" variant="text" class="ma-2" icon="mdi-page-first" size="small"
            @click="page = 1; loadPage()" />
          <v-btn color="grey" variant="text" class="ma-2" icon="mdi-page-last" size="small"
            @click="page = numOfPages; loadPage()" />
        </v-col>
      </v-layout>
    </div>
  </div>

</template>
