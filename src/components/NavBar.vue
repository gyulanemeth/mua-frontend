<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useCurrentUserAndAccountStore, useAdminsStore } from '../stores/index.js'

const store = useCurrentUserAndAccountStore()
const adminsStore = useAdminsStore()
const route = useRoute()
const profilePicture = ref()

onMounted(async () => {
  if (store.checkAdmin && !adminsStore.admin) {
    await adminsStore.readOne()
    profilePicture.value = adminsStore.admin.profilePicture + '?' + Date.now()
  }
})

const menuItems = computed(() => {
  const urlFriendlyName = route.params.urlFriendlyName
  return [{
    title: 'My profile',
    path: `/${urlFriendlyName}/me`
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

    <v-col >
      <span class="text-h4 mx-1 pt-0 "> {{ appName }} | </span>

    <p v-if="route.name === 'me'" class="d-inline text-h4" data-test-id="meDetails-userName">{{store.user.name }}
      {{ $t('navBar.title.me') }}
      <span class="text-subtitle-1 font-weight-bold ">{{store.user.role}}</span>
    </p>
    <p v-else-if="route.name === 'users'" class="d-inline text-h4" data-test-id="meDetails-userName">{{store.account.name}}
      {{ $t('navBar.title.users') }}
    </p>
    <p v-else-if="route.name === 'account'" class="d-inline text-h4" data-test-id="meDetails-userName">{{store.account.name}}
      {{ $t('navBar.title.account') }}
    </p>
  </v-col>
    <v-spacer></v-spacer>

    <v-menu location="bottom " origin="end top">
      <template v-slot:activator="{ props }">
        <v-badge v-if="store.checkAdmin" color="error" bordered offset-x="10" offset-y="34"
          icon="mdi-shield-account-variant-outline">
          <v-avatar size="large" color="error">
            <v-img style="cursor: pointer;" v-if="profilePicture"
              :src="profilePicture" v-bind="props" class="align-self-stretch" cover />
            <v-btn v-else data-test-id="navbarMenu" v-bind="props">
              {{ $t('navBar.picLabel') }}
            </v-btn>
          </v-avatar>
        </v-badge>
        <v-avatar v-else size="large" color="grey-darken-3">
          <v-img style="cursor: pointer;" v-if="store.user && store.user.profilePicture" :src="store.user.profilePicture+ '?' +Date.now()" v-bind="props"
            class="align-self-stretch" cover />
          <v-btn v-else data-test-id="navbarMenu" v-bind="props">
            {{ $t('navBar.picLabel') }}
          </v-btn>
        </v-avatar>
      </template>
      <v-list>
        <div v-for="item in menuItems" :key="item.title" >
        <v-list-item :to="item.path" :value="item.title">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
</div>
        <v-list-item data-test-id="navbarMenu-logout" @click="store.logout()">
          <v-list-item-title> {{ $t('navBar.logoutBtn') }} </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>
