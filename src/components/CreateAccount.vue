<script setup>
import { ref } from 'vue'

const data = ref({
  user: {},
  account: {}
})

const cb = ref()
const appIcon = window.config.appIcon
const title = window.config.title

const checkbox = ref()

</script>

<template>

<v-form v-if="!cb"  class="d-flex flex-column justify-center align-center h-screen">
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
      data-test-id="createAccount-accNameField"
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
      data-test-id="createAccount-urlFriendlyNameField"
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
             data-test-id="createAccount-emailField"
             :value="data.user.email"
             @update:modelValue="res => data.user.email = res.replace(/[^a-z0-9+@ \.,_-]/gim, '')"
             required />

            <v-text-field hide-details data-test-id="createAccount-userNameField" density="compact"  class=" elevation-2 my-5 pt-2 pl-3 rounded" color="info" variant="plain" placeholder="Your Name" name="name" label="Name" type="text" v-model="data.user.name" required />
            <v-text-field hide-details density="compact" class=" elevation-2 my-5 pt-2 pl-3 rounded" color="info" variant="plain"
            name="newPassword" data-test-id="createAccount-newPasswordField" :label="$t('createAccount.userSection.newPasswordLabel')" type="password"
            :placeholder="data.user.password ||$t('createAccount.userSection.newPasswordPlaceholder')"
            :value="data.user.password"
            @update:modelValue="res => data.user.password = res.replace(/[^a-z0-9!@#$%^&* \.,_-]/gim, '')"
            required />

            <v-text-field hide-details density="compact" class=" elevation-2 my-5 pt-2 pl-3 rounded" color="info" variant="plain"
            name="newPasswordAgain" data-test-id="createAccount-newPasswordAgainField" :label="$t('createAccount.userSection.confirmNewPasswordLabel')" type="password"
            :placeholder="data.user.newPasswordAgain ||$t('createAccount.userSection.confirmNewPasswordPlaceholder')"
            :value="data.user.newPasswordAgain"
            @update:modelValue="res => data.user.newPasswordAgain = res.replace(/[^a-z0-9!@#$%^&* \.,_-]/gim, '')"
            required/>
            <v-checkbox :label="$t('createAccount.checkboxLabel')" color="info" v-model="checkbox" hide-details></v-checkbox>
            <v-col>
                <v-btn color="info" :disabled="!checkbox" data-test-id="createAccount-submitBtn" @click="$emit('buttonEvent',data, (res)=>{cb = res})">
                    {{$t('createAccount.submitBtn')}}
                </v-btn>
                <button hidden :disabled="!checkbox" @click.enter.prevent="$emit('buttonEvent',data , (res)=>{cb = res})" />
            </v-col>
        </v-card-text>
    </v-card>
</v-form>

<v-form v-else class="d-flex flex-column justify-center align-center h-screen">

<v-card  class="  rounded-xl  elevation-2  d-flex flex-column justify-center align-right  " width="40%">
    <v-card-text align="center">
            <v-avatar size="80" >
              <v-img :src="appIcon" cover></v-img>
            </v-avatar>
        </v-card-text>
        <v-card-text align="left">
            <h4 class="text-h6 text-center text-green">{{$t('createAccount.cbHeader')}}</h4>

                <p class="mt-3 pa-2">{{$t('createAccount.cbMessagePart1')}}</p>
                <p class="pa-2">{{$t('createAccount.cbMessagePart2')}}</p>
                <p class="pa-2">{{$t('createAccount.cbMessagePart3', {name: data.account.urlFriendlyName})}}</p>
                <p class="pa-2 text-center ">{{$t('createAccount.cbMessagePart4')}}</p>
                <p class="text-center">{{$t('createAccount.loginMessage')}}
                    <router-link style="text-decoration: none; color: inherit;"
                        class="font-weight-bold"
                        :to="`/`">{{$t('createAccount.loginBtn')}}</router-link>
                </p>

        </v-card-text>
    </v-card>
    </v-form>

</template>
