<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import Invite from '../components/InviteMembers.vue'
import DeleteUser from '../components/DeleteMyAccount.vue'
import UserProfile from '../components/UserProfile.vue'
import { useDebounceFn } from '@vueuse/core'

const route = useRoute()

const emit = defineEmits(['deleteEventHandler', 'inviteEventHandler', 'createEventHandler', 'loadMore', 'searchEvent'])
const props = defineProps({
  items: Array,
  roles: Array,
  currentAccName: String,
  currentUser: Object
})

const filter = ref('')
const loading = ref()
const inviteMembersDialog = ref()

const debouncedFn = useDebounceFn(() => {
  emit('searchEvent', filter.value, () => { loading.value = false })
}, 500)

function redirectDeleteEventHandler (data) {
  emit('deleteEventHandler', data)
}

function redirectInviteEventHandler (data, cb) {
  emit('inviteEventHandler', data, cb)
}

function redirectUpdateRoleEventHandler (data) {
  emit('updateRoleEventHandler', data)
}

const profilePicture = (item) => {
  return item.data.profilePicture || import.meta.env.BASE_URL + 'placeholder.jpg'
}

async function visibilityChanged (isVisible) {
  if (isVisible) {
    emit('loadMore')
  }
}

const appIcon = window.config.appIcon
</script>

<template>
  <div class="mx-3 h-100">

        <v-layout class="d-flex flex-wrap my-n3 mx-0 pt-0">

            <v-col class="pt-3 d-flex align-end">
              <v-btn append-icon="mdi-account-plus" data-test-id="open-inviteDialog" size="small" variant="outlined" color="info"
            @click="inviteMembersDialog.show()">
            {{ $t('inviteMembers.openBtn') }}
        </v-btn>
                <Invite ref="inviteMembersDialog" :name="props.currentAccName" @inviteEventHandler='redirectInviteEventHandler' />
              </v-col>
              <v-spacer />
              <v-col cols="5" class="pt-1">
                <v-text-field hide-details density="compact" data-test-id="userList-searchBar" label="Search"
                variant="underlined" append-inner-icon="mdi-magnify" v-model.lazy="filter" color="info"
                @input="loading = true; debouncedFn()"></v-text-field>
              </v-col>
            </v-layout>
            <div v-if="filter.length === 0 && props.items.length === 0 && !loading">
            <v-col cols="5">
            <v-icon  class="ml-16" color="info" icon="mdi-arrow-up" size="x-large" />
          </v-col>
          <v-card-text class="pt-0">
            <p class="font-weight-medium" >{{ $t('emptyList.addFirstElement') }} </p>
          </v-card-text>
        </div>

        <v-layout v-if="loading" class="ma-auto d-flex flex-wrap pa-4 h-75">
          <v-card class="ma-auto align-self-start elevation-0 text-center" min-width="400">
            <v-progress-circular color="info" indeterminate :size="90"></v-progress-circular>
            <h4 class="mt-3" >{{ $t('loading') }}</h4>
          </v-card>
        </v-layout>

        <v-layout v-else-if="props.items.length === 0" :class="`ma-auto d-flex flex-wrap pa-4 ${filter.length > 0 ? 'h-75':'h-50'}`">
          <v-card class="ma-auto align-self-start elevation-0 text-center" :min-width="filter.length === 0 ? 220: 400">
            <v-avatar size="150">
            <v-img :src="appIcon" cover></v-img>
          </v-avatar>
            <v-row class="mt-2" >
               <v-col cols="2" class="pt-3 mr-0 pr-0">
                   <v-icon color="error" icon="mdi-cancel" size="x-large"></v-icon>
               </v-col>
               <v-col cols="10" class="pt-4 ml-0 pl-0">
                 <h3  v-if="filter.length === 0">{{$t('emptyList.addFirstElement')}}</h3>
                 <h3  v-else >{{$t('emptyList.searchNoResult')}}</h3>
                </v-col>
              </v-row>
              <h3 class="w-100" v-if="filter.length > 0" >{{ filter }}</h3>
          </v-card>
        </v-layout>
        <v-layout class="d-flex flex-wrap" v-else>
            <v-card class="mx-2 my-5 align-self-start " min-width="350" v-for="item in props.items" :key="item._id">
                <v-card-title>
                    <p data-test-id="userList-card-0-name">{{ item.data.name }}<span
                            class="font-weight-light pl-2">{{ item.data.role }}</span></p>
                </v-card-title>
                <v-img :src="profilePicture(item)" height="150px" cover></v-img>
                <v-row class="pa-3">
                    <v-card-text >
                    <v-card-subtitle>
                      {{ item.data.email }}
                      <v-card-subtitle>
                        <span v-if="props.currentUser._id === item._id"> - Me -</span>
                      </v-card-subtitle>
                    </v-card-subtitle>
                  </v-card-text>
                  <v-tooltip v-if="props.currentUser.role === 'admin'" :text="$t('userList.resendMessage')">
                            <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" color="grey" class="mt-2" v-if="!item.data.name"  variant="text" icon="mdi-email-sync" size="small" @click="$emit('reInviteEventHandler',{ email: item.data.email })" />
                            </template>
                        </v-tooltip>
                </v-row>
                <v-card-actions data-test-id="userList-card-0-action"
                    v-if="props.currentUser._id !== item._id ">
                    <UserProfile @updateRoleEventHandler='redirectUpdateRoleEventHandler' :roles="props.roles"
                        :data="item.data" />

                    <v-spacer></v-spacer>
                    <DeleteUser v-if="props.currentUser.role === 'admin'" @deleteEventHandler='redirectDeleteEventHandler' :data="item.data" />

                </v-card-actions>
                <v-card-actions v-if="props.currentUser._id === item._id">
                    <v-btn color="info" class="text-white" :to="`/system-accounts/${route.params.urlFriendlyName}/me`">{{ $t('userList.openBtn') }}</v-btn>
                </v-card-actions>

            </v-card>
            <div v-if="props.items.length" v-observe-visibility="visibilityChanged"></div>
        </v-layout>
      </div>
    </template>
