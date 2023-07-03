<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useCurrentUserAndAccountStore, useAdminsStore } from '../stores/index.js'

const store = useCurrentUserAndAccountStore()
const adminsStore = useAdminsStore()
const route = useRoute()
const adminProfilePicture = ref()


const menuItems = computed(async () => {
  const urlFriendlyName = route.params.urlFriendlyName
  return [{
    title: 'Me',
    path: `/${urlFriendlyName}/me`
  }, {
    title: 'Account Settings',
    path: `/${urlFriendlyName}/account`
  }, {
    title: 'Account Users',
    path: `/${urlFriendlyName}/users`
  }]
})

const appName = window.config.appName
const appIcon = window.config.appIcon
</script>

<template>
  <v-app-bar v-if="store.user" height="100" class="elevation-0 pl-0 ml-0">
    <v-avatar size="60">
      <v-img :src="appIcon" cover></v-img>
    </v-avatar>

    <v-col cols="2">
      <span class="text-h4 mx-1 pt-0 "> {{ appName }} </span>
    </v-col>
    <span class="text-h4 ma-0 pt-0"> {{ route.name === "me" ? $t('navBar.title.me') : route.name === "users" ?
      $t('navBar.title.users') : route.name === "account" ? $t('navBar.title.account') : null }}
    </span>

    <v-spacer></v-spacer>

    <v-menu location="bottom " origin="end top">
      <template v-slot:activator="{ props }">
        <v-badge v-if="store.checkAdmin" color="error" bordered offset-x="10" offset-y="34"
          icon="mdi-shield-account-variant-outline">
          <v-avatar size="large" color="error">
            <v-img style="cursor: pointer;" v-if="adminsStore.admin && adminsStore.admin.profilePicture"
              :src="adminsStore.admin.profilePicture" v-bind="props" class="align-self-stretch" cover />
            <v-btn v-else data-test-id="navbarMenu" v-bind="props">
              {{ $t('navBar.picLabel') }}
            </v-btn>
          </v-avatar>
        </v-badge>
        <v-avatar v-else size="large" color="grey-darken-3">
          <v-img style="cursor: pointer;" v-if="store.user && store.user.profilePicture" :src="store.user.profilePicture"
            v-bind="props" class="align-self-stretch" cover />
          <v-btn v-else data-test-id="navbarMenu" v-bind="props">
            {{ $t('navBar.picLabel') }}
          </v-btn>
        </v-avatar>
      </template>
      <v-list>
        <v-list-item v-for="item in menuItems" :key="item.title" :to="item.path" :value="item.title">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
        <v-list-item data-test-id="navbarMenu-logout" @click="store.logout()">
          <v-list-item-title> {{ $t('navBar.logoutBtn') }} </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>
