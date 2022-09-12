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
            <h6 class="text-h6">{{$t('createAccount.header')}}</h6>
            <h4><v-divider />{{$t('createAccount.accountSection.header')}}<v-divider  class=" mb-6"/></h4 >
      <v-text-field
      hide-details
      density="compact"
      class=" elevation-2 my-5 pt-2 pl-3 rounded"
      color="info"
      variant="plain"
      name="AccName"
      type="text"
      :label="$t('createAccount.accountSection.nameLabel')"
      v-model="data.account.name"
      :placeholder="$t('createAccount.accountSection.namePlaceholder')"
      required />

      <v-text-field
      hide-details
      density="compact"
      class=" elevation-2 my-5 pt-2 pl-3 rounded"
      color="info"
      variant="plain"
      name="urlFriendlyName"
      type="text"
      :label="$t('createAccount.accountSection.urlFriendlyNameLabel')"
      :placeholder="data.account.urlFriendlyName || $t('createAccount.accountSection.urlFriendlyNamePlaceholder')"
      :value="data.account.urlFriendlyName"
      @update:modelValue="res => data.account.urlFriendlyName = res.replace(/[^a-z0-9/ \.,_-]/gim, '').replace(' ', '-').toLowerCase()"
      required />
      <h4><v-divider />{{$t('createAccount.userSection.header')}}<v-divider  class=" mb-6"/></h4>

            <v-text-field hide-details density="compact" class=" elevation-2 my-5 pt-2 pl-3 rounded" color="info" variant="plain" name="email" type="email" :label="$t('createAccount.userSection.emailLabel')"
             :placeholder="data.user.email ||$t('createAccount.userSection.emailPlaceHolder')"
             :value="data.user.email"
             @update:modelValue="res => data.user.email = res.replace(/[^a-z0-9@ \.,_-]/gim, '')"
             required />

            <v-text-field hide-details density="compact" class=" elevation-2 my-5 pt-2 pl-3 rounded" color="info" variant="plain" placeholder="Your Name" name="name" label="Name" type="text" v-model="data.user.name" required />
            <v-text-field hide-details density="compact" class=" elevation-2 my-5 pt-2 pl-3 rounded" color="info" variant="plain"
            name="newPassword" :label="$t('createAccount.userSection.newPasswordLabel')" type="password"
            :placeholder="data.user.password ||$t('createAccount.userSection.newPasswordPlaceholder')"
            :value="data.user.password"
            @update:modelValue="res => data.user.password = res.replace(/[^a-z0-9!@#$%^&* \.,_-]/gim, '')"
            required />

            <v-text-field hide-details density="compact" class=" elevation-2 my-5 pt-2 pl-3 rounded" color="info" variant="plain"
            name="newPasswordAgain" :label="$t('createAccount.userSection.confirmNewPasswordLabel')" type="password"
            :placeholder="data.user.newPasswordAgain ||$t('createAccount.userSection.confirmNewPasswordPlaceholder')"
            :value="data.user.newPasswordAgain"
            @update:modelValue="res => data.user.newPasswordAgain = res.replace(/[^a-z0-9!@#$%^&* \.,_-]/gim, '')"
            required/>
            <v-checkbox :label="$t('createAccount.checkboxLabel')" color="info" value="I am human" hide-details></v-checkbox>
            <v-col>
                <v-btn color="info" @click="$emit('buttonEvent',data)">{{$t('createAccount.submitBtn')}}</v-btn>
                <button hidden @click.enter.prevent="$emit('buttonEvent',data)" />
            </v-col>
        </v-card-text>
    </v-card>
</v-form>

</template>
