<script setup>

import { useCurrentUserAndAccountStore } from '../stores/index.js'

const store = useCurrentUserAndAccountStore()

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
  <v-app-bar v-if="store.user" class="elevation-0">
    <v-app-bar-nav-icon size="60" color="info" :icon="appIcon" />
    <v-app-bar-title class=" text-h4" >{{appName}}</v-app-bar-title>
    <v-spacer></v-spacer>
    <v-btn icon>
      <v-icon>mdi-magnify</v-icon>
    </v-btn>

    <v-menu location="bottom " origin="end top">
        <template v-slot:activator="{ props }">
            <v-avatar  size="large" color="grey-darken-3">
              <v-btn v-bind="props" >
              Pic
            </v-btn>
            </v-avatar>
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
