<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

import NavBar from './components/NavBar.vue'
import SideBar from './components/SideBar.vue'
import ErrorMessage from './components/ErrorMessage.vue'
import { useCurrentUserAndAccountStore, useAdminsStore } from './stores/index.js'

const store = useCurrentUserAndAccountStore()
const adminsStore = useAdminsStore()
const route = useRoute()

onMounted(async () => {
    document.title = window.config.appTitle
    if (store.checkAdmin) {
         await adminsStore.readOne();
    }
})

</script>

<template>

<v-app>
    <div v-if="store.loggedIn && route.name !=='login' && route.name !=='loginWithUrlFriendlyName' && route.name !== 'forgot-password-reset' && route.name !== 'accept-invitation'">
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
