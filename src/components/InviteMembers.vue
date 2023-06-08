<script setup>
import { ref } from 'vue'

const props = defineProps({
  name: String
})

const processing = ref(false)
const dialog = ref(false)
const data = ref({
  name: props.name
})
const cb = ref()

const resetForm = () => {
  Object.keys(data.value).forEach(key => {
    data.value[key] = null
  })
}

</script>

<template>
    <v-dialog v-model="dialog" persistent>
        <template v-slot:activator="{ props }">
            <v-btn prepend-icon="mdi-account-plus" data-test-id="open-inviteDialog" variant="outlined" color="info"
                v-bind="props">
                {{ $t('inviteMembers.openBtn') }}
            </v-btn>
        </template>
        <v-card min-width="800" class="d-flex flex-column justify-center">
            <v-toolbar color="white" align="center">
                <v-toolbar-title class="font-weight-bold">{{ $t('inviteMembers.header') }}</v-toolbar-title>
            </v-toolbar>
            <v-card-text align="start">

                <v-row align="center">
                    <v-col cols="4">
                        <p class="font-weight-bold">{{ $t('inviteMembers.accountLabel') }}</p>
                    </v-col>
                    <v-col cols="8" align='center'>
                        <v-text-field hide-details density="compact" class=" elevation-2 my-5 pl-3 rounded" color="info"
                            variant="plain" placeholder="currentAccount" name="name" disabled v-model="data.name"
                            required />
                    </v-col>
                </v-row>
                <v-row align="center">
                    <v-col cols="4">
                        <p class="font-weight-bold">{{ $t('inviteMembers.emailLabel') }}</p>
                    </v-col>
                    <v-col cols="8" align='center'>
                        <v-text-field hide-details data-test-id="inviteMember-emailField" density="compact"
                            class=" elevation-2 my-5 pl-3 rounded" color="info" variant="plain" name="email" type="email"
                            :placeholder="data.email || $t('inviteMembers.emailPlaceHolder')" :value="data.email"
                            @update:modelValue="res => data.email = res.replace(/[^a-z0-9+@ \.,_-]/gim, '')" required />
                    </v-col>
                </v-row>
                <v-row align="center">
                    <v-col cols="4">
                        <p class="font-weight-bold">{{ $t('inviteMembers.confirmEmailLabel') }}</p>
                    </v-col>
                    <v-col cols="8" align='center'>
                        <v-text-field hide-details density="compact" data-test-id="inviteMember-emailAgainField"
                            class=" elevation-2 my-5 pl-3 rounded" color="info" variant="plain" name="confirmEmail"
                            type="email" :placeholder="data.confirmEmail || $t('inviteMembers.confirmEmailPlaceHolder')"
                            :value="data.confirmEmail"
                            @update:modelValue="res => data.confirmEmail = res.replace(/[^a-z0-9+@ \.,_-]/gim, '')"
                            required />
                    </v-col>
                </v-row>

                <v-row v-if="cb" class="justify-center">
                    <p class="font-weight-bold" data-test-id="inviteMember-headerCb">{{ $t('inviteMembers.cb.header') }}</p>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-btn color="info" v-if="!cb" data-test-id="inviteMember-submitBtn"
                    @click="processing = true; $emit('inviteEventHandler', data, (res) => { cb = res; resetForm(); processing = false })">
                    {{ !processing ? $t('inviteMembers.submitBtn') : '' }}
                    <v-progress-circular v-if="processing" :size="20" class="pa-3 ma-3"
                        indeterminate></v-progress-circular>{{ processing ? $t('processing') : '' }}
                </v-btn>
                <v-btn color="info" v-else data-test-id="inviteMember-resetFormBtn" @click="cb = null">{{ $t('inviteMembers.cb.cbBtn') }}</v-btn>
                <v-btn color="info" data-test-id="inviteMember-cancelBtn" @click="dialog = false; cb = undefined; resetForm()">{{ $t('inviteMembers.closeBtn') }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
