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
    <v-avatar size="60" >
      <v-img :src="appIcon" cover></v-img>
    </v-avatar>

   <v-col cols="2">
    <span class="text-h4 mx-1 pt-0 "> {{appName}} </span>
  </v-col>
  <span class="text-h4 ma-0 pt-0"> {{ route.name === "me"? "My Profile": route.name === "users"? "Account Users": route.name === "account" ? "Account Settings" : null }}
    </span>

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
