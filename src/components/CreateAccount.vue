<script setup>
import { ref } from 'vue'

const data = ref({
  user: {},
  account: {}
})

const cb = ref()
const appIcon = import.meta.env.VITE_APP_ICON
const title = import.meta.env.VITE_APP_TITLE
const processing = ref(false)

const checkbox = ref()

</script>

<template>

<v-layout v-if="!cb"  class="d-flex flex-column justify-center align-center h-screen">
    <v-card elevation="0">
        <v-card-text align="center">
            <v-avatar size="80" >
              <v-img :src="appIcon" cover></v-img>
            </v-avatar>
        </v-card-text>
        <v-card-title class="justify-center py-0">
            <h4 class="text-h4">  {{title}} </h4>
        </v-card-title>
    </v-card>
    <v-card class="ma-2 pa-2  rounded-xl  elevation-2" width="80%" max-width="600px">
        <v-card-text align="center">
            <h6 class="text-h6">{{$t('mua.createAccount.header')}}</h6>
            <h4><v-divider />{{$t('mua.createAccount.accountSection.header')}}<v-divider  class=" mb-6"/></h4 >
      <v-text-field
      hide-details
      density="compact"
      data-test-id="createAccount-accNameField"
      class=" my-5 rounded"
      color="info"
      variant="solo"
      name="AccName"
      type="text"
      :label="$t('mua.createAccount.accountSection.nameLabel')"
      v-model="data.account.name"
      :placeholder="$t('mua.createAccount.accountSection.namePlaceholder')"
      required />

      <v-text-field
      hide-details
      density="compact"
      class="my-5 rounded"
      data-test-id="createAccount-urlFriendlyNameField"
      color="info"
      variant="solo"
      name="urlFriendlyName"
      type="text"
      :label="$t('mua.createAccount.accountSection.urlFriendlyNameLabel')"
      :placeholder="data.account.urlFriendlyName || $t('mua.createAccount.accountSection.urlFriendlyNamePlaceholder')"
      :value="data.account.urlFriendlyName"
      @update:modelValue="res => data.account.urlFriendlyName = res.replace(/[^a-z0-9/ \.,_-]/gim, '').replace(' ', '-').toLowerCase()"
      required />
      <h4><v-divider />{{$t('mua.createAccount.userSection.header')}}<v-divider  class=" mb-6"/></h4>

            <v-text-field hide-details density="compact" class="my-5 rounded" color="info" variant="solo" name="email" type="email" :label="$t('mua.createAccount.userSection.emailLabel')"
             :placeholder="data.user.email ||$t('mua.createAccount.userSection.emailPlaceHolder')"
             data-test-id="createAccount-emailField"
             :value="data.user.email"
             @update:modelValue="res => data.user.email = res.replace(/[^a-z0-9+@ \.,_-]/gim, '')"
             required />

            <v-text-field hide-details data-test-id="createAccount-userNameField" density="compact"  class="my-5 rounded" color="info" variant="solo" placeholder="Your Name" name="name" label="Name" type="text" v-model="data.user.name" required />
            <v-text-field hide-details density="compact" class="my-5 rounded" color="info" variant="solo"
            name="newPassword" data-test-id="createAccount-newPasswordField" :label="$t('mua.createAccount.userSection.newPasswordLabel')" type="password"
            :placeholder="data.user.password ||$t('mua.createAccount.userSection.newPasswordPlaceholder')"
            :value="data.user.password"
            @update:modelValue="res => data.user.password = res.replace(/[^a-z0-9!@#$%^&* \.,_-]/gim, '')"
            required />

            <v-text-field hide-details density="compact" class="my-5 rounded" color="info" variant="solo"
            name="newPasswordAgain" data-test-id="createAccount-newPasswordAgainField" :label="$t('mua.createAccount.userSection.confirmNewPasswordLabel')" type="password"
            :placeholder="data.user.newPasswordAgain ||$t('mua.createAccount.userSection.confirmNewPasswordPlaceholder')"
            :value="data.user.newPasswordAgain"
            @update:modelValue="res => data.user.newPasswordAgain = res.replace(/[^a-z0-9!@#$%^&* \.,_-]/gim, '')"
            required/>
            <v-checkbox :label="$t('mua.createAccount.checkboxLabel')" color="info" v-model="checkbox" hide-details></v-checkbox>
            <v-col>
                <v-btn color="info" data-test-id="createAccount-submitBtn" :disabled="!checkbox" @click="processing = true; $emit('buttonEvent',data, (res)=>{cb = res; processing = false})">

                        {{ !processing ? $t('mua.createAccount.submitBtn') : '' }}

                        <v-progress-circular v-if="processing" :size="20"
                            indeterminate></v-progress-circular>{{ processing ? $t('mua.processing') : '' }}

                </v-btn>
                <button hidden :disabled="!checkbox" @click.enter.prevent="processing = true; $emit('buttonEvent',data , (res)=>{cb = res; processing = false})" />
            </v-col>
            <p class="text-center">{{$t('mua.createAccount.redirectTologinMessage')}}
                    <router-link style="text-decoration: none; color: inherit;"
                        class="font-weight-bold"
                        :to="`/accounts/login`">{{$t('mua.createAccount.loginBtn')}}</router-link>
                </p>
        </v-card-text>
    </v-card>
</v-layout>

<v-layout v-else class="d-flex flex-column justify-center align-center h-screen">

<v-card  class="  rounded-xl  elevation-2  d-flex flex-column justify-center align-right  " width="40%">
    <v-card-text align="center">
            <v-avatar size="80" >
              <v-img :src="appIcon" cover></v-img>
            </v-avatar>
        </v-card-text>
        <v-card-text align="left">
            <h4 class="text-h6 text-center text-green">{{$t('mua.createAccount.cbHeader')}}</h4>

                <p class="mt-3 pa-2">{{$t('mua.createAccount.cbMessagePart1')}}</p>
                <p class="pa-2">{{$t('mua.createAccount.cbMessagePart2')}}</p>
                <p class="pa-2">{{$t('mua.createAccount.cbMessagePart3', {name: data.account.urlFriendlyName})}}</p>
                <p class="pa-2 text-center ">{{$t('mua.createAccount.cbMessagePart4')}}</p>
                <p class="text-center">{{$t('mua.createAccount.loginMessage')}}
                    <router-link style="text-decoration: none; color: inherit;"
                        class="font-weight-bold"
                        :to="`/accounts/login`">{{$t('mua.createAccount.loginBtn')}}</router-link>
                </p>
                <p class="text-center">{{$t('mua.createAccount.resendMessage')}}
                    <span style="text-decoration: none; cursor: pointer; color: inherit;"
                        class="font-weight-bold"
                        @click="$emit('reSendFinalizeRegistrationEvent', {accountId: cb.newAccount._id , userId: cb.newUser._id})">{{$t('mua.createAccount.resendBtn')}}</span>
                </p>
        </v-card-text>
    </v-card>
    </v-layout>

</template>
