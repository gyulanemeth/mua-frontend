<script setup>
import { useRoute } from 'vue-router'
import { useCurrentUserAndAccountStore } from '../stores/index.js'

const store = useCurrentUserAndAccountStore()
const route = useRoute()

const menuItems = [{
  title: 'Me',
  path: '/me'
}, {
  title: 'Account Settings',
  path: '/account'
}, {
  title: 'Account Users',
  path: '/users'
}]

const appName = window.config.appName
const appIcon = window.config.appIcon

</script>

<template>

<v-app-bar v-if="store.user" height="100" class="elevation-0 pl-0 ml-0">
    <v-app-bar-nav-icon size="60" color="info" :icon="appIcon" />
    <v-app-bar-title > <h4 class=" text-h4">
      <span class="mx-1 pt-0 "> {{appName}} </span>
      <span class="mx-7 pt-0 "> {{ route.name === "me"? "My Profile": route.name === "users"? "Account Users": route.name === "account" ? "Account Settings" : null }}
      </span>
      </h4>
    </v-app-bar-title>
    <v-spacer></v-spacer>

    <v-menu location="bottom " origin="end top">
        <template v-slot:activator="{ props }">
          <v-badge color="error" bordered offset-x="10" offset-y="34" icon="mdi-shield-account-variant-outline">
            <v-avatar size="large" color="error">
                <v-btn v-bind="props">
                    Pic
                </v-btn>
            </v-avatar>
          </v-badge>
        </template>
        <v-list>
            <v-list-item v-for="item in menuItems" :key="item.title" :to="item.path" :value="item.title">
                <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
            <v-list-item @click="store.logout()">
                <v-list-item-title> Logout </v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>
</v-app-bar>

</template>
