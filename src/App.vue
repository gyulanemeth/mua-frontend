<script setup>
import NavBar from './components/NavBar.vue'
import SideBar from './components/SideBar.vue'
import ErrorMessage from './components/ErrorMessage.vue'
import { useCurrentUserAndAccountStore } from './stores/index.js'

const store = useCurrentUserAndAccountStore()
</script>
<template>
  <v-app>
    <NavBar v-if="store.loggedIn" />
    <SideBar v-if="store.loggedIn" />
    <v-main >
      <ErrorMessage/>
      <Suspense>
      <router-view/>
    </Suspense>
    </v-main>
  </v-app>
</template>
