<script setup>
import { ref } from 'vue'

const props = defineProps({
  name: String
})

const processing = ref(false)
const dialogShown = ref(false)
const data = ref({
  name: props.name
})
const cb = ref()

const resetForm = () => {
  Object.keys(data.value).forEach(key => {
    data.value[key] = null
  })
}

const show = () => {
  dialogShown.value = true
}

const hide = () => {
  dialogShown.value = false
  cb.value = undefined
  resetForm()
}

defineExpose({
  show,
  hide
})

</script>

<template>
    <v-dialog v-model="dialogShown" tabindex="-1" @keydown.enter="processing = true; $emit('inviteEventHandler', data, (res) => { if(res){cb = res} resetForm(); processing = false })" @keydown.esc="hide">
            <v-card :width="$vuetify.display.mobile? '100%': '50%'" max-width="800" class="ma-auto">
        <v-container class="d-flex flex-column justify-center">

            <v-toolbar color="white" align="center">
                <v-toolbar-title class="font-weight-bold">{{ $t('mua.accountInviteMembers.header') }}</v-toolbar-title>
            </v-toolbar>
            <v-card-text align="start">

                <v-row align="center">
                    <v-col cols="12" md="4">
                        <p class="font-weight-bold">{{ $t('mua.accountInviteMembers.accountLabel') }}</p>
                    </v-col>
                    <v-col cols="12" md="8" align='center'>
                        <v-text-field hide-details density="compact" class="my-5 rounded" color="info"
                            variant="solo" placeholder="currentAccount" name="name" disabled v-model="data.name"
                            required />
                    </v-col>
                </v-row>
                <v-row align="center">
                    <v-col cols="12" md="4">
                        <p class="font-weight-bold">{{ $t('mua.accountInviteMembers.emailLabel') }}</p>
                    </v-col>
                    <v-col cols="12" md="8" align='center'>
                        <v-text-field hide-details data-test-id="inviteMember-emailField" density="compact"
                            class="my-5 rounded" color="info" variant="solo" name="email" type="email"
                            :placeholder="data.email || $t('mua.accountInviteMembers.emailPlaceHolder')" :value="data.email"
                            @update:modelValue="res => data.email = res.replace(/[^a-z0-9+@ \.,_-]/gim, '')" required />
                    </v-col>
                </v-row>
                <v-row align="center">
                    <v-col cols="12" md="4">
                        <p class="font-weight-bold">{{ $t('mua.accountInviteMembers.confirmEmailLabel') }}</p>
                    </v-col>
                    <v-col cols="12" md="8" align='center'>
                        <v-text-field hide-details density="compact" data-test-id="inviteMember-emailAgainField"
                            class="my-5 rounded" color="info" variant="solo" name="confirmEmail"
                            type="email" :placeholder="data.confirmEmail || $t('mua.accountInviteMembers.confirmEmailPlaceHolder')"
                            :value="data.confirmEmail"
                            @update:modelValue="res => data.confirmEmail = res.replace(/[^a-z0-9+@ \.,_-]/gim, '')"
                            required />
                    </v-col>
                </v-row>

                <v-row v-if="cb" class="justify-center">
                    <p class="font-weight-bold" data-test-id="inviteMember-headerCb">{{ $t('mua.accountInviteMembers.cb.header') }}</p>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-btn color="info" data-test-id="inviteMember-cancelBtn" @click="dialogShown = false; cb = undefined; resetForm()">{{ $t('mua.accountInviteMembers.closeBtn') }}</v-btn>
                <v-btn color="info" v-if="!cb" data-test-id="inviteMember-submitBtn"
                    @click="processing = true; $emit('inviteEventHandler', data, (res) => { if(res){cb = res} resetForm(); processing = false })">
                    {{ !processing ? $t('mua.accountInviteMembers.submitBtn') : '' }}
                    <v-progress-circular v-if="processing" :size="20"
                        indeterminate></v-progress-circular>{{ processing ? $t('mua.processing') : '' }}
                </v-btn>
                <v-btn color="info" v-else data-test-id="inviteMember-resetFormBtn" @click="cb = null">{{ $t('mua.accountInviteMembers.cb.cbBtn') }}</v-btn>
            </v-card-actions>
            </v-container>
        </v-card>
    </v-dialog>
</template>
