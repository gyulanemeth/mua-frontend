<script setup>
import { useCurrentUserAndAccountStore } from '../stores/index.js'

const store = useCurrentUserAndAccountStore()

function redirect () {
  const getToken = localStorage.getItem('accessToken')
  window.location.href = `${window.config.appBaseUrl}account/${store.account._id}?token=${getToken}`
}

</script>

<template>
  <v-card class="elevation-4">

      <v-navigation-drawer color="grey-lighten-2" rail permanent >
        <v-list bg-color="grey-lighten-2" density="compact" nav>
          <v-list-item active-class="text-white"  prepend-icon="mdi-shield-account-variant-outline"  />

          <v-list-item  active-class="text-white" active prepend-icon="mdi-account-group-outline" />

          <v-list-item  active-class="text-white" prepend-icon="mdi-email-variant" @click="redirect" />
        </v-list>

      </v-navigation-drawer>

      <v-navigation-drawer class="elevation-2" permanent>
        <v-list>
          <v-list-item title="My Profile" to="/me" />
       <v-list-item title="Account Settings" to="/account" />
       <v-list-item title="Account Users" to="/users" />
        </v-list>
      </v-navigation-drawer>

  </v-card>
</template>
