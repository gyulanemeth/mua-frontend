<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

import NavBar from './components/NavBar.vue'
import SideBar from './components/SideBar.vue'
import ErrorMessage from './components/ErrorMessage.vue'
import { useCurrentUserAndAccountStore } from './stores/index.js'

const store = useCurrentUserAndAccountStore()
const route = useRoute()

onMounted(() => {
  document.title = window.config.appTitle
})

</script>

<template>

<v-app>
    <div v-if="store.loggedIn && route.name !== 'forgot-password-reset' && route.name !== 'accept-invitation'">
        <NavBar  />
        <SideBar />
    </div>

    <v-main>
        <ErrorMessage/>
        <Suspense>
            <router-view/>
        </Suspense>
    </v-main>
</v-app>

</template>
