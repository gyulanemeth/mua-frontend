<script setup>
import { ref } from 'vue'

const props = defineProps({
  name: String
})

const dialog = ref(false)
const data = ref({
  name: props.name
})
const cb = ref()

const resetForm = () => {
  Object.keys(data.value).forEach(key => {
    data.value[key] = null
  })
}

</script>

<template>

<v-dialog v-model="dialog" persistent>
    <template v-slot:activator="{ props }">
        <v-btn prepend-icon="mdi-account-plus" variant="outlined" color="info" v-bind="props">
            Invite New Members
        </v-btn>
    </template>
    <v-card min-width="800" class="d-flex flex-column justify-center">
        <v-toolbar color="white" align="center">
            <v-toolbar-title class="font-weight-bold">Invite New Members</v-toolbar-title>
        </v-toolbar>
        <v-card-text align="start">

            <v-row align="center">
                <v-col cols="4">
                    <p class="font-weight-bold">Account</p>
                </v-col>
                <v-col cols="8" align='center'>
                    <v-text-field hide-details density="compact" class=" elevation-2 my-5 pl-3 rounded" color="info" variant="plain" placeholder="currentAccount" name="name" disabled v-model="data['name']" required />
                </v-col>
            </v-row>
            <v-row align="center">
                <v-col cols="4">
                    <p class="font-weight-bold">Email address</p>
                </v-col>
                <v-col cols="8" align='center'>
                    <v-text-field hide-details density="compact" class=" elevation-2 my-5 pl-3 rounded" color="info" variant="plain" placeholder="your@email.com" name="email" type="email" v-model="data['email']" required />
                </v-col>
            </v-row>
            <v-row align="center">
                <v-col cols="4">
                    <p class="font-weight-bold">Confirm e-mail address</p>
                </v-col>
                <v-col cols="8" align='center'>
                    <v-text-field hide-details density="compact" class=" elevation-2 my-5 pl-3 rounded" color="info" variant="plain" placeholder="your@email.com" name="confirmEmail" type="email" v-model="data['confirmEmail']" required />
                </v-col>
            </v-row>

            <v-row v-if="cb" class="justify-center">
                <p class="font-weight-bold">Invitation sent.</p>
            </v-row>
        </v-card-text>
        <v-card-actions>
            <v-btn color="info" v-if="!cb" @click="$emit('inviteEventHandler',data, (res)=>{cb = res; resetForm()})">Invite</v-btn>
            <v-btn color="info" v-else @click="cb=null">Invite ANOTHER</v-btn>
            <v-btn color="info" @click="dialog=false; resetForm()">close</v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>

</template>
