<script setup >
import { ref } from 'vue'

import Settings from './AdminSettings.vue'
import ChangeEmail from './AdminChangeEmail.vue'
import ChangePassword from './AdminChangePassword.vue'
import MyDetails from './AdminProfile.vue'

const emit = defineEmits(['updateNameHandler', 'deleteProfilePictureHandler', 'uploadProfilePictureHandler', 'updateEmailHandler', 'updatePasswordHandler', 'deleteEventHandler'])
const props = defineProps({
  data: Object
})

const changeTab = (tabId) => {
  tab.value = tabId
}

async function redirectDeleteProfilePictureHandler (cb) {
  emit('deleteProfilePictureHandler', cb)
}
async function redirectUploadProfilePictureHandler (data, cb) {
  emit('uploadProfilePictureHandler', data, cb)
}
async function redirectUpdateNameHandler (data) {
  emit('updateNameHandler', data)
}
async function redirectUpdateEmailHandler (data, cb) {
  emit('updateEmailHandler', data, cb)
}
async function redirectUpdatePasswordHandler (data, cb) {
  emit('updatePasswordHandler', data, cb)
}
async function redirectDeleteHandler (data) {
  emit('deleteEventHandler', data)
}

const tab = ref('me')

</script>

<template>

<v-container :class="`elevation-0 ${$vuetify.display.mobile? 'pa-0 ma-0':'pa-2'} rounded`">
    <v-layout class="d-flex flex-wrap align-end justify-end">

        <p class="text-h4 ml-4" data-test-id="meDetails-userName">{{props.data.name}}
          <span class="text-subtitle-1 font-weight-bold ">{{$t('mua.adminAccountDetails.header')}}</span>
        </p>

        <v-spacer />
    </v-layout>

    <v-layout class="d-flex flex-wrap">
        <v-card class="w-100">
            <v-tabs v-model="tab" >
                <v-tab value="me" to="/system-admins/me" :class="tab==='me'? 'font-weight-bold':''" color="info" data-test-id="meDetails-meTab" prepend-icon="mdi-account">{{$t('mua.adminAccountDetails.tabs.meLabel')}}</v-tab>
                <v-tab value="changePassword" :class="tab==='changePassword'? 'font-weight-bold':''"  to="/system-admins/change-password" data-test-id="meDetails-changePasswordTab" color="info" prepend-icon="mdi-lock">{{$t('mua.adminAccountDetails.tabs.changePasswordLabel')}}</v-tab>
                <v-tab value="changeEmail" :class="tab==='changeEmail'? 'font-weight-bold':''"  to="/system-admins/change-email" data-test-id="meDetails-changeEmailTab" color="info" prepend-icon="mdi-at">{{$t('mua.adminAccountDetails.tabs.changeEmailLabel')}}</v-tab>
                <v-tab value="settings" :class="tab==='settings'? 'font-weight-bold':''" to="/system-admins/settings" data-test-id="meDetails-settingsTab" color="info" prepend-icon="mdi-cog">{{$t('mua.adminAccountDetails.tabs.settingsLabel')}}</v-tab>
            </v-tabs>

            <v-card-text class="px-1">
                <v-window v-model="tab" >

                    <v-window-item value="me">
                        <MyDetails @updateNameHandler="redirectUpdateNameHandler" @deleteProfilePictureHandler="redirectDeleteProfilePictureHandler" @uploadProfilePictureHandler="redirectUploadProfilePictureHandler" @changeTab="changeTab" :email="props.data.email" :name="props.data.name" :profilePicture="props.data.profilePicture" />
                    </v-window-item>

                    <v-window-item value="changePassword">
                        <ChangePassword @updatePasswordHandler="redirectUpdatePasswordHandler" />
                    </v-window-item>

                    <v-window-item value="changeEmail">
                        <ChangeEmail @updateEmailHandler="redirectUpdateEmailHandler" :email="props.data.email" />
                    </v-window-item>

                    <v-window-item value="settings">
                        <Settings @deleteEventHandler="redirectDeleteHandler" :data="props.data" />
                    </v-window-item>
                </v-window>
            </v-card-text>
        </v-card>

    </v-layout>
</v-container>

</template>
