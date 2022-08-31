<script setup >
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import jwtDecode from 'jwt-decode'

const props = defineProps({
  formData: Object
})

const route = useRoute()

const tokenData = ref()
const data = ref({})
const cb = ref()
tokenData.value = jwtDecode(route.query.token)

const appIcon = window.config.appIcon
const title = window.config.title

</script>

<template>

<v-form class="d-flex flex-column justify-center align-center h-screen">
    <v-card elevation="0" class="w-25">
        <v-card-text align="center">
            <v-icon size="77" color="info" :icon="appIcon" />
        </v-card-text>
        <v-card-title class="justify-center py-0">
            <h4 class="text-h4"> {{title}} </h4>
        </v-card-title>
    </v-card>
    <v-card class="ma-2 pa-2  rounded-xl  elevation-2" width="30%">
        <v-card-text align="center" v-if="!cb">
            <h6 class="text-h6">{{props.formData.header}}</h6>

            <v-text-field hide-details density="compact" class=" elevation-2 my-5 pt-2 pl-3 rounded" color="info" variant="plain" name="email" type="text" :value="tokenData.user.email" :placeholder="tokenData.user.email" disabled required />

            <v-text-field hide-details density="compact" class=" elevation-2 my-5 pt-2 pl-3 rounded" color="info" variant="plain" name="name" type="text" :value="tokenData.account.urlFriendlyName" :placeholder="tokenData.account.urlFriendlyName" disabled required
            />

            <v-text-field hide-details density="compact" class=" elevation-2 my-5 pt-2 pl-3 rounded" color="info" variant="plain" placeholder="Your Name" name="name" label="Name" type="text" v-model="data.name" required />

            <v-text-field hide-details density="compact" class=" elevation-2 my-5 pt-2 pl-3 rounded" color="info" variant="plain" placeholder="********" name="newPassword" label="New Password" type="password" v-model="data.newPassword" required />

            <v-text-field hide-details density="compact" class=" elevation-2 my-5 pt-2 pl-3 rounded" color="info" variant="plain" placeholder="********" name="newPasswordAgain" label="Confirm New Password" type="password" v-model="data.newPasswordAgain" required
            />
            <v-checkbox label="I am human." color="info" value="I am human" hide-details></v-checkbox>
            <v-col>
                <v-btn color="info" @click="$emit('handleAcceptInvitationHandler',data)">{{props.formData.btnText}}</v-btn>
                <button hidden @click.enter.prevent="$emit('handleAcceptInvitationHandler',data)" />
            </v-col>
        </v-card-text>
        <v-card-text align="center" v-if="cb">

            <h2 class="mt-4">Password changed</h2>
            <p class="mt-4">Your password has been changed. You will be automatically logged in in 5 seconds. Please
                <router-link tag="span" style="text-decoration: none; color: inherit;" to="/me" class="font-weight-bold">click here</router-link> if you are not redirected.</p>

        </v-card-text>

    </v-card>
</v-form>

</template>
