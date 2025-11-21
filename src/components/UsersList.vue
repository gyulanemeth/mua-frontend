<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import Invite from './AccountInviteMembers.vue'
import DeleteUser from '../components/UserDeleteAccount.vue'
import UserCard from '../components/UserCard.vue'
import { useDebounceFn } from '@vueuse/core'

const route = useRoute()

const emit = defineEmits(['deleteEventHandler', 'inviteEventHandler', 'createEventHandler', 'loadMore', 'searchEvent', 'sortEventHandler'])
const props = defineProps({
  items: Array,
  roles: Array,
  projects: Array,
  permissions: Array,
  currentAccName: String,
  currentUser: Object
})

const filter = ref('')
const loading = ref()
const inviteMembersDialog = ref()
const sortBy = ref({ updatedAt: -1 })

const debouncedFn = useDebounceFn(() => {
  emit('searchEvent', filter.value, () => { loading.value = false })
}, 500)

function redirectSortEventHandler(params) {
  loading.value = true
  emit('sortEventHandler', params, () => { loading.value = false })
}

function redirectDeleteEventHandler(data) {
  emit('deleteEventHandler', data)
}

function redirectInviteEventHandler(data, cb) {
  emit('inviteEventHandler', data, cb)
}

function redirectUpdateRoleEventHandler(data) {
  emit('updateRoleEventHandler', data)
}

const profilePicture = (item) => {
  return item.data.profilePicture || import.meta.env.BASE_URL + 'placeholder.jpg'
}

async function visibilityChanged(isVisible) {
  if (isVisible) {
    emit('loadMore')
  }
}

const getProjectsAccessSummary = (projectsAccess) => {
  const res = projectsAccess.map(item => {
    const project = props.projects.find(p => p._id === item.projectId)
    return {
      name: project?.name || '(Unknown Project)',
      permission: item.permission
    }
  })
  console.log(res);

  return res
}

const appIcon = import.meta.env.VITE_APP_LOGO_URL
</script>

<template>
  <div class="mx-0 h-100 pr-4">

    <v-layout style="z-index: 10;" class="d-flex flex-wrap mx-0 ">

      <v-col cols="12" md="auto" class="pt-3 d-flex align-end">
        <v-btn append-icon="mdi-account-plus" style="height: 40px;" block data-test-id="open-inviteDialog" size="small"
          variant="outlined" color="primary" @click="inviteMembersDialog.show()">
          {{ $t('mua.accountInviteMembers.openBtn') }}
        </v-btn>
        <Invite ref="inviteMembersDialog" :permissions="props.permissions" :projects="props.projects"
          :roles="props.roles" :name="props.currentAccName" @inviteEventHandler='redirectInviteEventHandler' />
      </v-col>
      <v-spacer />
      <v-col cols="12" md="4" class="pt-5">
        <v-text-field hide-details density="compact" data-test-id="userList-searchBar" label="Search"
          variant="underlined" append-inner-icon="mdi-magnify" v-model.lazy="filter" color="primary"
          @input="loading = true; debouncedFn()"></v-text-field>
      </v-col>
      <v-col cols="12" md="auto" class="d-flex align-end">
        <v-select @update:modelValue="(params) => redirectSortEventHandler(params)" v-model="sortBy" hide-details
          density="compact" item-name="name" item-value="value" :label="$t('mua.listAdminsAndAccounts.sortLabel')"
          base-color="primary" color="primary"
          :items="[{ name: $t('mua.listAdminsAndAccounts.sort.name'), value: { name: 1 } }, { name: $t('mua.listAdminsAndAccounts.sort.name'), value: { name: -1 } }, { name: $t('mua.listAdminsAndAccounts.sort.updated'), value: { updatedAt: 1 } }, { name: $t('mua.listAdminsAndAccounts.sort.updated'), value: { updatedAt: -1 } }, { name: $t('mua.listAdminsAndAccounts.sort.created'), value: { createdAt: 1 } }, { name: $t('mua.listAdminsAndAccounts.sort.created'), value: { createdAt: -1 } }]"
          variant="outlined">
          <template v-slot:selection="{ item }">
            <div>
              <span>{{ item.raw.name }}</span>
              <v-icon class="ml-md-3" size="small">
                {{ Object.values(item.raw.value)[0] === 1 ? "mdi-arrow-up" : "mdi-arrow-down" }}
              </v-icon>
            </div>
          </template>
          <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props" title="item.raw.name">
              <template v-slot:title>
                <div>
                  <span>{{ item.raw.name }}</span>
                  <v-icon class="ml-3" size="small">
                    {{ Object.values(item.raw.value)[0] === 1 ? "mdi-arrow-up" : "mdi-arrow-down" }}
                  </v-icon>
                </div>
              </template>
            </v-list-item>
          </template>
        </v-select>
      </v-col>
      <v-divider class="mx-3" />
    </v-layout>
    <div v-if="filter.length === 0 && props.items.length === 0 && !loading">
      <v-col cols="5">
        <v-icon class="ml-16" color="primary" icon="mdi-arrow-up" size="x-large" />
      </v-col>
      <v-card-text class="pt-0">
        <p class="font-weight-medium">{{ $t('mua.emptyList.addFirstElement') }} </p>
      </v-card-text>
    </div>

    <v-layout style="z-index: 10;" v-if="loading" class="ma-auto d-flex flex-wrap pa-4 h-75">
      <v-card class="ma-auto align-self-start elevation-0 text-center" min-width="400">
        <v-progress-circular color="primary" indeterminate :size="90"></v-progress-circular>
        <p class="mt-3 text-body-2 font-weight-bold">{{ $t('mua.loading') }}</p>
      </v-card>
    </v-layout>

    <v-layout style="z-index: 10;" v-else-if="props.items.length === 0"
      :class="`ma-auto d-flex flex-wrap pa-4 ${filter.length > 0 ? 'h-75' : 'h-50'}`">
      <v-card class="ma-auto align-self-start elevation-0 text-center" :min-width="filter.length === 0 ? 220 : 400">
        <v-avatar size="150">
          <v-img :src="appIcon" cover></v-img>
        </v-avatar>
        <v-row class="mt-2">
          <v-col cols="2" class="pt-3 mr-0 pr-0">
            <v-icon color="error" icon="mdi-cancel" size="x-large"></v-icon>
          </v-col>
          <v-col cols="10" class="pt-4 ml-0 pl-0">
            <p class="text-body-1 font-weight-bold" v-if="filter.length === 0">{{ $t('mua.emptyList.addFirstElement') }}
            </p>
            <p class="text-body-1 font-weight-bold" v-else>{{ $t('mua.emptyList.searchNoResult') }}</p>
          </v-col>
        </v-row>
        <p class="w-100 text-body-1 font-weight-bold" v-if="filter.length > 0">{{ filter }}</p>
      </v-card>
    </v-layout>
    <v-layout style="z-index: 10;" class="d-flex flex-wrap" v-else>
      <v-card :class="`mx-3 my-5 align-self-start`" min-width="350" v-for="item in props.items" :key="item._id">
        <v-card-title>
          <p data-test-id="userList-card-0-name">{{ item.data.name }}<span class="font-weight-light pl-2">{{
            item.data.role }}</span></p>
        </v-card-title>
        <v-img :src="profilePicture(item)" height="150px" cover></v-img>
        <v-row class="pa-3">
          <v-card-text>
            <v-card-subtitle class="px-0">
              {{ item.data.email }}
              <span class="ml-2" v-if="props.currentUser._id === item._id"> - Me -</span>
            </v-card-subtitle>
            <v-card-subtitle v-if="item.data.createdAt" class="px-0 mt-2">
              {{ $t('mua.userList.creationDateLabel') }}: {{ new
                Date(item.data.createdAt).toJSON().slice(0, 10) }}@{{ new
                Date(item.data.createdAt).toLocaleTimeString('en-US') }}
            </v-card-subtitle>
            <v-card-subtitle v-if="item.data.updatedAt" class="px-0 mt-2">
              {{ $t('mua.userList.lastEditedLabel') }}: {{ new
                Date(item.data.updatedAt).toJSON().slice(0, 10) }}@{{ new
                Date(item.data.updatedAt).toLocaleTimeString('en-US') }}

            </v-card-subtitle>

            <v-card-subtitle v-if="item.data.role === 'client'" class="px-0 mt-2">
              <span v-for="(item, i) in getProjectsAccessSummary(item.data?.projectsAccess || [])" :key="i">
                {{ item.name }} ({{ item.permission }})<span
                  v-if="item.data && i < item.data.projectsAccess.length - 1">,
                </span>
              </span>
            </v-card-subtitle>
          </v-card-text>
          <v-btn color="grey" class="mt-3" v-if="props.currentUser.role === 'admin' && !item.data.name" variant="text"
            size="small"
            @click="$emit('reInviteEventHandler', { email: item.data.email, role: item.data.role, projectId: item.data.projectId, permission: item.data.permission })">
            <v-tooltip activator="parent" location="top">{{ $t('mua.userList.resendMessage') }}</v-tooltip>
            <v-icon size="20">mdi-email-sync</v-icon>
          </v-btn>
        </v-row>
        <v-card-actions data-test-id="userList-card-0-action" v-if="props.currentUser._id !== item._id">
          <UserCard @updateRoleEventHandler='redirectUpdateRoleEventHandler' :permissions="props.permissions"
            :projects="props.projects" :roles="props.roles" :data="item.data" />

          <v-spacer></v-spacer>
          <DeleteUser v-if="props.currentUser.role === 'admin'" @deleteEventHandler='redirectDeleteEventHandler'
            :data="item.data" />

        </v-card-actions>
        <v-card-actions v-if="props.currentUser._id === item._id">
          <v-btn color="primary" class="text-white" :to="`/accounts/${route.params.urlFriendlyName}/me`">{{
            $t('mua.userList.openBtn') }}</v-btn>
        </v-card-actions>

      </v-card>
      <div v-if="props.items.length" v-observe-visibility="visibilityChanged"></div>
    </v-layout>
  </div>
</template>
