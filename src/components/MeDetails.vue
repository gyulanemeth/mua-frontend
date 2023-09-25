<script setup >
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import Settings from './AdminSettings.vue'
import ChangeEmail from './ChangeEmail.vue'
import ChangePassword from './ChangePassword.vue'
import MyDetails from './MyDetails.vue'

const emit = defineEmits(['updateNameHandler', 'deleteProfilePictureHandler', 'uploadProfilePictureHandler', 'updateEmailHandler', 'updatePasswordHandler', 'deleteMyAccountHandler'])
const props = defineProps({
  data: Object
})

const route = useRoute()

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
  emit('deleteMyAccountHandler', data)
}

const tab = ref('me')

</script>

<template>
  <div class="mx-3 elevation-0 rounded">
    <v-layout class="d-flex flex-wrap">
      <v-card class="w-100">
            <v-tabs v-model="tab">
              <v-tab value="me" :class="tab==='me'? 'font-weight-bold':''" :to="`/${route.params.urlFriendlyName}/me`" color="info" data-test-id="meDetails-meTab" prepend-icon="mdi-account">{{$t('meDetails.tabs.meLabel')}}</v-tab>
              <v-tab value="changePassword" :class="tab==='changePassword'? 'font-weight-bold':''"  :to="`/${route.params.urlFriendlyName}/change-password`" data-test-id="meDetails-changePasswordTab" color="info" prepend-icon="mdi-lock">{{$t('meDetails.tabs.changePasswordLabel')}}</v-tab>
              <v-tab value="changeEmail" :class="tab==='changeEmail'? 'font-weight-bold':''"  :to="`/${route.params.urlFriendlyName}/change-email`"  data-test-id="meDetails-changeEmailTab" color="info" prepend-icon="mdi-at">{{$t('meDetails.tabs.changeEmailLabel')}}</v-tab>
              <v-tab value="settings" :class="tab==='settings'? 'font-weight-bold':''"  :to="`/${route.params.urlFriendlyName}/settings`" data-test-id="meDetails-settingsTab" color="info" prepend-icon="mdi-cog">{{$t('meDetails.tabs.settingsLabel')}}</v-tab>
            </v-tabs>

            <v-card-text>
              <v-window v-model="tab">

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
  </div>
</template>
