<script setup >
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import jwtDecode from 'jwt-decode'

const props = defineProps({
  formData: Object
})

const route = useRoute()
const operation = computed(() => route.name === 'system-admins-accept-invitation' ? 'setPassword' : 'resetPassword')
const emit = defineEmits(['setPasswordEventHandler', 'resetPasswordEventHandler'])

const email = ref()
const data = ref({})
const cb = ref()
const checkbox = ref()
const processing = ref(false)

const appIcon = import.meta.env.VITE_APP_LOGO_URL
email.value = jwtDecode(route.query.token).user.email

function submitForm () {
  if (!checkbox.value) {
    return
  }
  processing.value = true
  if (operation.value === 'resetPassword') {
    emit('resetPasswordEventHandler', { token: route.query.token, ...data.value }, (res) => { if (res) { cb.value = res } processing.value = false })
  } else {
    emit('setPasswordEventHandler', { token: route.query.token, ...data.value })
    processing.value = false
  }
}

</script>

<template>
    <v-layout class="d-flex flex-column justify-center align-center h-100">
        <v-card elevation="0">
            <v-card-text align="center" class="loggedOutState">
                <v-avatar size="80">
                    <v-img :src="appIcon" cover></v-img>
                </v-avatar>
            </v-card-text>
        </v-card>
        <v-card class="ma-2 pa-2  rounded-xl  elevation-2" width="80%" max-width="600px">
            <v-card-text align="center" @keydown.enter="submitForm()" v-if="!cb">
                <p class="text-h6">{{ props.formData.text }}</p>

                <v-text-field v-if="operation === 'setPassword'" hide-details density="compact"
                    class=" my-5 rounded" color="primary" variant="solo" name="email" type="text"
                    :value="email" :placeholder="email" disabled required />

                <v-text-field v-if="operation === 'setPassword'" data-test-id="setAndRestPassword-nameField" hide-details
                    density="compact" class=" my-5 rounded" color="primary" variant="solo" name="name"
                    :label="$t('mua.adminSetAndReSetPassword.nameLabel')" type="text"
                    :placeholder="data.name || $t('mua.adminSetAndReSetPassword.namePlaceHolder')" :value="data.name"
                    @update:modelValue="res => data.name = res.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, '')" required />

                <v-text-field hide-details density="compact" class="my-5 rounded" color="primary"
                    variant="solo" name="newPassword" data-test-id="setAndRestPassword-newPasswordField"
                    :label="$t('mua.adminSetAndReSetPassword.newPasswordLabel')" type="password"
                    :placeholder="data.newPassword || $t('mua.adminSetAndReSetPassword.newPasswordPlaceholder')"
                    :value="data.newPassword"
                    @update:modelValue="res => data.newPassword = res.replace(/[^a-z0-9!@#$%^&* \.,_-]/gim, '')" required />

                <v-text-field hide-details density="compact" class=" my-5 rounded" color="primary"
                    variant="solo" name="newPasswordAgain" data-test-id="setAndRestPassword-newPasswordAgainField"
                    :label="$t('mua.adminSetAndReSetPassword.confirmNewPasswordLabel')" type="password"
                    :placeholder="data.newPasswordAgain || $t('mua.adminSetAndReSetPassword.confirmNewPasswordPlaceholder')"
                    :value="data.newPasswordAgain"
                    @update:modelValue="res => data.newPasswordAgain = res.replace(/[^a-z0-9!@#$%^&* \.,_-]/gim, '')"
                    required />

                <v-checkbox :label="$t('mua.adminSetAndReSetPassword.checkboxLabel')" color="primary" v-model="checkbox"
                    hide-details></v-checkbox>

                <v-col>
                    <v-btn color="primary" data-test-id="setAndRestPassword-submitBtn" :disabled="!checkbox"
                        @click="submitForm()">

                        {{ !processing ? props.formData.text : '' }}

                        <v-progress-circular v-if="processing" :size="20"
                            indeterminate></v-progress-circular>{{ processing ? $t('mua.processing') : '' }}

                    </v-btn>
                </v-col>
            </v-card-text>
            <v-card-text v-if="cb">

                <p style="color: #888888;" class="mt-4 text-h6 font-weight-bold">{{ $t('mua.adminSetAndReSetPassword.cb.header') }}</p>
                <p style="color: #888888;" class="mt-4">{{ $t('mua.adminSetAndReSetPassword.cb.message') }}
                    <router-link tag="span" data-test-id="setAndRestPassword-continueBtn"
                        style="text-decoration: none; color: #888888;" to="/system-admins/me" class="font-weight-bold">{{
                            $t('mua.adminSetAndReSetPassword.cb.cbBtn') }}</router-link>
                    {{ $t('mua.adminSetAndReSetPassword.cb.subMessage') }}
                </p>

            </v-card-text>

        </v-card>
    </v-layout>
</template>
