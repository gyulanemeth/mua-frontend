<script setup>
import { computed, onMounted } from 'vue'
import { useCurrentUserAndAccountStore } from '../stores/index.js'
import { useRoute } from 'vue-router'

const store = useCurrentUserAndAccountStore()
const route = useRoute()

function redirect (url, urlFriendlyName) {
  return url({ accountId: store.getAccountId, token: localStorage.getItem('accessToken'), urlFriendlyName })
}

const menuPaths = computed(() => {
  const account = store.account
  if (account && account.urlFriendlyName) {
    const urlFriendlyName = account.urlFriendlyName

    return {
      mePath: `/${urlFriendlyName}/me`,
      accountPath: `/${urlFriendlyName}/account`,
      usersPath: `/${urlFriendlyName}/users`
    }
  }
  return {
    mePath: '/default/me',
    accountPath: '/default/account',
    usersPath: '/default/users'
  }
})

onMounted(async () => {
  if (!store.account || !store.account.name) {
    await store.readOne()
  }
})

const adminUrl = window.config.adminsAppBaseUrl
const sideBarIcons = window.config.sideBarIcons
</script>

<template>
  <v-card class="elevation-4">

    <v-navigation-drawer color="grey-lighten-2" class="rounded-te-lg" rail rail-width="65" permanent>
      <v-list bg-color="grey-lighten-2" class="h-100 d-flex flex-column rounded-te-lg justify-center align-center" density="compact" nav>
        <v-list-item v-if="store.checkAdmin" class="justify-center align-center" width="36" height="36" :style="{ opacity: 0.5 }"
          active-class=" elevation-4 text-white bg-white">
          <a style="text-decoration: none;" :href="adminUrl">
            <v-tooltip activator="parent" location="end top" origin="start center">Admin Account</v-tooltip>
            <v-list-item-icon class="text-black">
              mdi-shield-account-variant-outline
            </v-list-item-icon>
          </a>
        </v-list-item>
        <v-list-item v-for="(item, i) in sideBarIcons" :key="i" class="justify-center align-center" :style="{ opacity: 0.5 }"
          active-class=" elevation-4 text-white bg-white"  width="36" height="36" >
          <v-btn class="bg-grey-lighten-2 elevation-0" :href="redirect(item.url, route.params.urlFriendlyName)">
            <v-tooltip activator="parent" location="end top" origin="start center">{{ item.name }}</v-tooltip>
            <v-list-item-icon style="font-size: 20px" class="text-black">
              {{ item.icon }}
            </v-list-item-icon>
          </v-btn>
        </v-list-item>
        <v-spacer />
        <v-menu location="bottom " origin="end top">
      <template v-slot:activator="{ props }">
        <v-avatar size="large" v-if="store.account && store.account.logo">
          <v-tooltip activator="parent" location="end top" origin="start center">Account</v-tooltip>
            <v-img style="cursor: pointer;" v-bind="props" :src="store.account.logo+ '?' +Date.now()" class="align-self-stretch" cover />
          </v-avatar>
          <v-list-item v-else class="justify-center align-center" style="filter: drop-shadow(0px 2px 2px #999898)" width="36" height="36" active active-class=" elevation-4 text-white bg-white">
            <v-tooltip activator="parent" location="end top" origin="start center">Account</v-tooltip>
            <v-list-item-icon v-bind="props"  class="text-black">
            mdi-account-group-outline
          </v-list-item-icon>
        </v-list-item>
      </template>
      <v-list>
        <v-list-item active-class="text-info" data-test-id="sideBar-accountTab" :title="$t('sideBar.account')"
          :to="menuPaths.accountPath" />
        <v-list-item active-class="text-info" data-test-id="sideBar-userTab" :title="$t('sideBar.users')"
          :to="menuPaths.usersPath" />
      </v-list>
    </v-menu>
  </v-list>
    </v-navigation-drawer>
  </v-card>
</template>
