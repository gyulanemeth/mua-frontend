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

    <v-dialog v-model="dialogShown" tabindex="-1"
        @keydown.enter="$emit('deleteEventHandler', { id: props.data._id, password, accountId: props.data.accountId }); resetForm()"
        @keydown.esc="resetForm">
        <template v-slot:activator="{ props }">
            <v-btn v-if="route.name !== 'accounts-settings'" color="error" data-test-id="open-deleteAccount-dialog"
                variant="text" v-bind="props">{{ $t('mua.userDeleteAccount.openBtn') }}</v-btn>
        </template>
        <v-card :width="!$vuetify.display.mdAndUp ? '100%' : '50%'" max-width="800" class="ma-auto">
            <v-container class="d-flex flex-column justify-center mb-5">
                <v-card-text align="start">
                    <v-col align="center">
                        <v-icon color="error" class="mb-5" size="180">mdi-delete-circle-outline</v-icon>
                        <v-toolbar-title class="font-weight-bold text-error">{{ $t('mua.userDeleteAccount.header') }}
                            “{{ props.data.name || props.data.email }}”?</v-toolbar-title>
                        <p class="text-body-1">{{ $t('mua.userDeleteAccount.subheader') }}</p>
                        <p class="font-weight-bold mt-3">{{ $t('mua.userDeleteAccount.passwordConfirmationHeader') }}
                        </p>
                        <v-text-field hide-details data-test-id="deleteAccount-passwordField" density="compact"
                            color="grey" class="rounded" variant="outlined" name="password" type="password"
                            prepend-inner-icon="mdi-lock" style="max-width: 400px;"
                            :placeholder="password || $t('mua.userDeleteAccount.passwordPlaceholder')" :value="password"
                            @update:modelValue="res => password = res.replace(/[^a-z0-9!@#$%^&* \.,_-]/gim, '')"
                            required />
                    </v-col>
                    <div class="d-flex flex-wrap justify-center align-center">
                        <v-btn color="grey" variant="outlined" class="mr-2" data-test-id="deleteAccount-submitBtn"
                            @click="resetForm">{{ $t('mua.userDeleteAccount.closeBtn') }}</v-btn>
                        <v-btn color="error" data-test-id="deleteAccount-cancelBtn"
                            @click="$emit('deleteEventHandler', { id: props.data._id, password, accountId: props.data.accountId }); resetForm()">{{
                                $t('mua.userDeleteAccount.submitBtn') }}</v-btn>
                    </div>
                </v-card-text>
            </v-container>
        </v-card>
    </v-dialog>

</template>
