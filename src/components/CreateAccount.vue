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
            <v-avatar size="80" >
              <v-img :src="appIcon" cover></v-img>
            </v-avatar>
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
      :placeholder="data.account.urlFriendlyName ||'./urlFriendlyName'"
      :value="data.account.urlFriendlyName"
      @update:modelValue="res => data.account.urlFriendlyName = res.replace(/[^a-z0-9/ \.,_-]/gim, '').replace(' ', '-').toLowerCase()"
      required />
      <h4><v-divider />User Data:<v-divider  class=" mb-6"/></h4>

            <v-text-field hide-details density="compact" class=" elevation-2 my-5 pt-2 pl-3 rounded" color="info" variant="plain" name="email" type="email" label="Email"
             :placeholder="data.user.email ||'your@email.com'"
             :value="data.user.email"
             @update:modelValue="res => data.user.email = res.replace(/[^a-z0-9@ \.,_-]/gim, '')"
             required />

            <v-text-field hide-details density="compact" class=" elevation-2 my-5 pt-2 pl-3 rounded" color="info" variant="plain" placeholder="Your Name" name="name" label="Name" type="text" v-model="data.user.name" required />
            <v-text-field hide-details density="compact" class=" elevation-2 my-5 pt-2 pl-3 rounded" color="info" variant="plain"
            name="newPassword" label="New Password" type="password"
            :placeholder="data.user.password ||'********'"
            :value="data.user.password"
            @update:modelValue="res => data.user.password = res.replace(/[^a-z0-9!@#$%^&* \.,_-]/gim, '')"
            required />

            <v-text-field hide-details density="compact" class=" elevation-2 my-5 pt-2 pl-3 rounded" color="info" variant="plain"
            name="newPasswordAgain" label="Confirm New Password" type="password"
            :placeholder="data.user.newPasswordAgain ||'********'"
            :value="data.user.newPasswordAgain"
            @update:modelValue="res => data.user.newPasswordAgain = res.replace(/[^a-z0-9!@#$%^&* \.,_-]/gim, '')"
            required/>
            <v-checkbox label="I am human." color="info" value="I am human" hide-details></v-checkbox>
            <v-col>
                <v-btn color="info" @click="$emit('buttonEvent',data)">Create</v-btn>
                <button hidden @click.enter.prevent="$emit('buttonEvent',data)" />
            </v-col>
        </v-card-text>
    </v-card>
</v-form>

</template>
