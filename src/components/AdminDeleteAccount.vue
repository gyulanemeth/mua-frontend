<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  data: Object
})

const route = useRoute()

const password = ref()
const dialogShown = ref()

const resetForm = () => {
  password.value = null
  dialogShown.value = false
}

const show = () => {
  dialogShown.value = true
}

defineExpose({
  show,
  hide: resetForm
})
const profilePicture = ref(props.data.profilePicture || import.meta.env.BASE_URL + 'placeholder.jpg')

</script>

<template>

<v-dialog v-model="dialogShown" :fullscreen="$vuetify.display.mobile" scrollable tabindex="1" @keydown.esc="resetForm" @keydown.enter="$emit('deleteEventHandler',{id:props.data._id, password});resetForm()" >
    <template  v-slot:activator="{ props }">
        <v-btn v-if="route.name === 'system-admins'" color="grey" variant="text" data-test-id="open-deleteAccount-dialog" class="ma-2" icon="mdi-delete" size="small" v-bind="props" />
    </template>
    <v-card width="50%" max-width="800" class="ma-auto d-flex flex-column justify-center">

        <v-card-text align="start">
            <v-col align="center" class="pb-10">
                <v-toolbar-title class="font-weight-bold text-error">{{$t('mua.adminDeleteAccount.header')}} “{{props.data.name}}”?</v-toolbar-title>
                <v-toolbar-title class="text-error">{{$t('mua.adminDeleteAccount.subheader')}}</v-toolbar-title>
            </v-col>

            <v-row align="center" class="pb-10">
                <h3 class="font-weight-bold">{{$t('mua.adminDeleteAccount.overviewTitle')}}</h3>
                <v-divider />
            </v-row>

            <v-row align="center">
                <v-col>
                    <p class="font-weight-bold">{{$t('mua.adminDeleteAccount.nameLabel')}}</p>
                </v-col>
                <v-text-field hide-details density="compact" color="info" disabled class="my-5 rounded" variant="solo" :placeholder="props.data.name" name="name" :value="props.data.name" type="text" required />
            </v-row>

            <v-row align="center">
                <v-col>
                    <p class="font-weight-bold">{{$t('mua.adminDeleteAccount.emailLabel')}}</p>
                </v-col>
                <v-text-field hide-details density="compact" color="info" disabled class="my-5 rounded" variant="solo" :placeholder="props.data.email" name="email" :value="props.data.email" type="text" required />
            </v-row>
            <v-row align="center">
                <v-col>
                    <p class="font-weight-bold">{{$t('mua.adminDeleteAccount.picLabel')}}</p>
                </v-col>
                <v-col align="center">
                    <v-avatar class="elevation-3 " size="180">
                        <v-img :src="profilePicture" class="align-self-stretch" cover/>
                    </v-avatar>
                </v-col>
            </v-row>
            <v-col>
                <v-row align="center" class="py-10">
                    <h3 class="font-weight-bold">{{$t('mua.adminDeleteAccount.passwordConfirmationHeader')}}</h3>
                    <v-divider />
                </v-row>

                <v-row align="center">
                    <v-col>
                        <p class="font-weight-bold">{{$t('mua.adminDeleteAccount.passwordLabel')}}</p>
                    </v-col>
                    <v-text-field hide-details data-test-id="deleteAccount-passwordField" density="compact" color="info" class="my-5 rounded" variant="solo"
                    name="password" type="password"
                    :placeholder="password || $t('mua.adminDeleteAccount.passwordPlaceholder')"
                    :value="password"
                    @update:modelValue="res => password = res.replace(/[^a-z0-9!@#$%^&* \.,_-]/gim, '')"
                    required />
                </v-row>
            </v-col>
            <v-card-actions>
                <v-btn color="info" data-test-id="deleteAccount-cancelBtn" @click="resetForm">{{$t('mua.adminDeleteAccount.closeBtn')}}</v-btn>
                <v-spacer />
                <v-btn color="error" data-test-id="deleteAccount-submitBtn" @click="$emit('deleteEventHandler',{id:props.data._id, password});resetForm()">{{$t('mua.adminDeleteAccount.submitBtn')}}</v-btn>
            </v-card-actions>
        </v-card-text>
    </v-card>
</v-dialog>

</template>
