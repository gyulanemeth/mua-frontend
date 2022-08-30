<script setup>
import { ref } from 'vue'

const data = ref({
  user: {},
  account: {}
})

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
            <h4 class="text-h4">  {{title}} </h4>
        </v-card-title>
    </v-card>
    <v-card class="ma-2 pa-2  rounded-xl  elevation-2" width="30%">
        <v-card-text align="center">
            <h6 class="text-h6">Create New Account</h6>
            <h4><v-divider />Account Data:<v-divider  class=" mb-6"/></h4 >
      <v-text-field
      hide-details
      density="compact"
      class=" elevation-2 my-5 pt-2 pl-3 rounded"
      color="info"
      variant="plain"
      name="AccName"
      type="text"
      label="Account Name"
      v-model="data.account.name"
      placeholder="Account Name"
      required />

      <v-text-field
      hide-details
      density="compact"
      class=" elevation-2 my-5 pt-2 pl-3 rounded"
      color="info"
      variant="plain"
      name="urlFriendlyName"
      type="text"
      label="Url Friendly Name"
      v-model="data.account.urlFriendlyName"
      placeholder="./urlFriendlyName"
      required />
      <h4><v-divider />User Data:<v-divider  class=" mb-6"/></h4>

            <v-text-field hide-details density="compact" class=" elevation-2 my-5 pt-2 pl-3 rounded" color="info" variant="plain" name="email" type="email" label="Email" v-model="data.user.email" placeholder="your@email.com" required />

            <v-text-field hide-details density="compact" class=" elevation-2 my-5 pt-2 pl-3 rounded" color="info" variant="plain" placeholder="Your Name" name="name" label="Name" type="text" v-model="data.user.name" required />
            <v-text-field hide-details density="compact" class=" elevation-2 my-5 pt-2 pl-3 rounded" color="info" variant="plain" placeholder="********" name="newPassword" label="New Password" type="password" v-model="data.user.password" required />

            <v-text-field hide-details density="compact" class=" elevation-2 my-5 pt-2 pl-3 rounded" color="info" variant="plain" placeholder="********" name="newPasswordAgain" label="Confirm New Password" type="password" v-model="data.user.newPasswordAgain" required
            />
            <v-checkbox label="I am human." color="info" value="I am human" hide-details></v-checkbox>
            <v-col>
                <v-btn color="info" @click="$emit('buttonEvent',data)">Create</v-btn>
                <button hidden @click.enter.prevent="$emit('buttonEvent',data)" />
            </v-col>
        </v-card-text>
    </v-card>
</v-form>

</template>
