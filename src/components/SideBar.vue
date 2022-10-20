<script setup>
import { useCurrentUserAndAccountStore } from '../stores/index.js'
import { useRouter } from 'vue-router'

const store = useCurrentUserAndAccountStore()
const router = useRouter()

function redirect (url) {
    const getToken = localStorage.getItem('accessToken')
    window.open(url({accountId: store.account._id, token: getToken  }), "_blank")
}

const sideBarIcons = window.config.sideBarIcons
</script>

<template>

<v-card class="elevation-4">

    <v-navigation-drawer color="grey-lighten-2" rail rail-width="60" permanent>

        <v-list bg-color="grey-lighten-2" density="compact" nav>
            <v-list-item class="justify-center align-center" active-class=" elevation-4 text-white bg-white">
              <v-tooltip
                  activator="parent"
                  location="end top" origin="start center"
                  >Admin Account</v-tooltip>
                <v-list-item-icon class="text-black">
                    mdi-shield-account-variant-outline
                </v-list-item-icon>
            </v-list-item>

            <v-list-item class="justify-center align-center" active active-class=" elevation-4 text-white bg-white">
              <v-tooltip
                  activator="parent"
                  location="end top" origin="start center"
                  >Account</v-tooltip>
                <v-list-item-icon class="text-black">
                    mdi-account-group-outline
                </v-list-item-icon>
            </v-list-item>

            <v-list-item v-for="(item, i) in sideBarIcons" :key="i" class="justify-center align-center" active-class=" elevation-4 text-white bg-white" @click="redirect(item.url)">
              <v-tooltip
                  activator="parent"
                  location="end top" origin="start center"
                  >{{item.name}}</v-tooltip>
                <v-list-item-icon class="text-black">
                    {{item.icon}}
                </v-list-item-icon>
            </v-list-item>

        </v-list>

    </v-navigation-drawer>

    <v-navigation-drawer class="elevation-2" permanent>
        <v-list>
            <v-list-item active-class="text-info" :title="$t('sideBar.me')" to="/me" />
            <v-list-item active-class="text-info" :title="$t('sideBar.account')" to="/account" />
            <v-list-item active-class="text-info" :title="$t('sideBar.users')" to="/users" />
        </v-list>
    </v-navigation-drawer>

</v-card>

</template>
