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

const profilePicture = ref(props.data.profilePicture || import.meta.env.BASE_URL + 'placeholder.jpg')

const show = () => {
    dialogShown.value = true
}

defineExpose({
  show,
  hide: resetForm
})

</script>

<template>

<v-dialog v-model="dialogShown" tabindex="-1" @keydown.enter="$emit('deleteEventHandler',{id:props.data._id, password, accountId:props.data.accountId});resetForm()" @keydown.esc="resetForm">
    <template v-slot:activator="{ props }">
        <v-btn v-if="route.name !== 'settings'"  color="error" data-test-id="open-deleteAccount-dialog" variant="text" v-bind="props">{{$t('deleteMyAccount.openBtn')}}</v-btn>
    </template>
    <v-card width="50%" max-width="800" class="ma-auto">
        <v-container class="d-flex flex-column justify-center">

            <v-card-text align="start">

            <v-col align="center" class="pb-10">
                <v-toolbar-title class="font-weight-bold text-error">{{$t('deleteMyAccount.header')}} “{{props.data.name}}”?</v-toolbar-title>
                <v-toolbar-title class="text-error">{{$t('deleteMyAccount.subheader')}}</v-toolbar-title>
            </v-col>

            <v-row align="center" class="pb-10">
                <h3 class="font-weight-bold">{{$t('deleteMyAccount.overviewTitle')}}</h3>
                <v-divider />
            </v-row>

            <v-row align="center">
                <v-col>
                    <p class="font-weight-bold">{{$t('deleteMyAccount.nameLabel')}}</p>
                </v-col>
                <v-col cols="7">
                    <v-text-field hide-details density="compact" color="info" disabled class="my-5 rounded" variant="solo" :placeholder="props.data.name" name="name" :value="props.data.name" type="text" required />
                </v-col>

            </v-row>

            <v-row align="center">
                <v-col>
                    <p class="font-weight-bold">{{$t('deleteMyAccount.emailLabel')}}</p>
                </v-col>
                <v-col cols="7">
                    <v-text-field hide-details density="compact" color="info" disabled class=" my-5 rounded" variant="solo" :placeholder="props.data.email" name="email" :value="props.data.email" type="text" required />
                </v-col>

            </v-row>

            <v-row align="center">
                <v-col>
                    <p class="font-weight-bold">{{$t('deleteMyAccount.roleLabel')}}</p>
                </v-col>
                <v-col cols="7">
                    <v-select hide-details density="compact" color="info" disabled class=" my-5 rounded" variant="solo" name="role" :label="props.data.role" />
                </v-col>
            </v-row>

            <v-row align="center">
                <v-col>
                    <p class="font-weight-bold">{{$t('deleteMyAccount.picLabel')}}</p>
                </v-col>
                <v-col align="center">
                    <v-avatar class="elevation-3 " size="180">
                        <v-img :src="profilePicture" class="align-self-stretch" cover/>
                    </v-avatar>
                </v-col>
            </v-row>
            <v-col>
                <v-row align="center" class="py-10">
                    <h3 class="font-weight-bold">{{$t('deleteMyAccount.passwordConfirmationHeader')}}</h3>
                    <v-divider />
                </v-row>

                <v-row align="center">
                    <v-col>
                        <p class="font-weight-bold">{{$t('deleteMyAccount.passwordLabel')}}</p>
                    </v-col>
                    <v-text-field hide-details data-test-id="deleteAccount-passwordField" density="compact" color="info" class=" my-5 rounded" variant="solo"
                    name="password" type="password"
                    :placeholder="password ||$t('deleteMyAccount.passwordPlaceholder')"
                    :value="password"
                    @update:modelValue="res => password = res.replace(/[^a-z0-9!@#$%^&* \.,_-]/gim, '')"
                     required />
                </v-row>
            </v-col>

        </v-card-text>
        <v-card-actions>
            <v-btn color="error" data-test-id="deleteAccount-cancelBtn" @click="$emit('deleteEventHandler',{id:props.data._id, password, accountId:props.data.accountId});resetForm()">{{$t('deleteMyAccount.submitBtn')}}</v-btn>
            <v-spacer />
            <v-btn color="info" data-test-id="deleteAccount-submitBtn" @click="resetForm">{{$t('deleteMyAccount.closeBtn')}}</v-btn>
        </v-card-actions>
        </v-container>
    </v-card>
</v-dialog>

</template>
