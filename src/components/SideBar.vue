<script setup>
import { computed, onMounted, ref } from 'vue'
import { useCurrentUserAndAccountStore } from '../stores/index.js'
import { useRoute } from 'vue-router'

const store = useCurrentUserAndAccountStore()
const route = useRoute()
const menu = ref(false)
function redirect (url, urlFriendlyName) {
  return url({ accountId: store.getAccountId, token: localStorage.getItem('accessToken'), urlFriendlyName })
}

const menuPaths = computed(() => {
  const account = store.account
  if (account && account.urlFriendlyName) {
    const urlFriendlyName = account.urlFriendlyName

    return {
      mePath: `/system-accounts/${urlFriendlyName}/me`,
      accountPath: `/system-accounts/${urlFriendlyName}/account`,
      usersPath: `/system-accounts/${urlFriendlyName}/users`
    }
  }
  return {
    mePath: '/system-accounts/default/me',
    accountPath: '/system-accounts/default/account',
    usersPath: '/system-accounts/default/users'
  }
})

onMounted(async () => {
  if (!store.account || !store.account.name) {
    await store.readOne()
  }
})

const adminUrl = window.config.appBaseUrl
const sideBarIcons = window.config.sideBarIcons
</script>

<template>
  <v-card class="elevation-4">

    <v-navigation-drawer color="grey-lighten-2" class="rounded-te-lg" rail rail-width="65" permanent>
      <v-list bg-color="grey-lighten-2" class="h-100 d-flex flex-column rounded-te-lg justify-center align-center" density="compact" nav>
        <v-list-item v-if="store.checkAdmin" class="justify-center align-center" width="36" height="36" :style="{ opacity: 0.5 }"
          active-class=" elevation-4 text-white bg-white" :href="adminUrl">
            <v-tooltip activator="parent" location="end top" origin="start center">Admin Account</v-tooltip>
            <v-icon class="text-black" size="20">
              mdi-shield-account-variant-outline
            </v-icon>
        </v-list-item>
        <v-list-item v-for="(item, i) in sideBarIcons" :key="i" :href="redirect(item.url, route.params.urlFriendlyName)" class="justify-center align-center" :style="{ opacity: 0.5 }"
          active-class=" elevation-4 text-white bg-white"  width="36" height="36" >
            <v-tooltip activator="parent" location="end top" origin="start center">{{ item.name }}</v-tooltip>
            <v-icon class="text-black" size="20">
              {{ item.icon }}
            </v-icon>
        </v-list-item>
        <v-spacer />
        <v-menu v-model="menu" location="top end" origin="bottom start">
      <template v-slot:activator="{ props }">

        <v-avatar v-bind="props" size="40" :style="{ border: '1px solid rgba(0, 0, 0, 0.22)'}" v-if="store.account && store.account.logo">
          <v-tooltip activator="parent" v-if="!menu" location="end top" origin="start center">Account</v-tooltip>
            <v-img style="cursor: pointer;"  :src="store.account.logo+ '?' +Date.now()" class="align-self-stretch" cover />
          </v-avatar>
          <v-list-item v-else v-bind="props" class="justify-center align-center" width="36" height="36" active active-class=" elevation-4 active-item text-white bg-white">
            <v-tooltip activator="parent" location="end top" origin="start center">Account</v-tooltip>
          <v-icon class="text-black" size="20">
            mdi-account-group-outline
          </v-icon>
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
<style>
.active-item {
  filter: drop-shadow(0px 2px 2px #999898)
}
</style>
