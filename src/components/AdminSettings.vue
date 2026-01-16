<script setup >
import { ref } from 'vue'
import DeleteMyAccount from './AdminDeleteAccount.vue'
import AdminLinkToProvider from './AdminLinkToProvider.vue'
import TwoFactorSetup from './TwoFactorSetup.vue'

const emit = defineEmits(['deleteEventHandler'])

const props = defineProps({
  data: Object
})
const deleteMyAccountDialog = ref()

function redirectDeleteHandler (data) {
  emit('deleteEventHandler', data)
}

</script>

<template >
    <v-layout style="z-index: 10;" :class="`d-flex flex-wrap ${!$vuetify.display.mdAndUp? 'w-100':'w-75'}`">
        <v-col class="pt-3">
            <AdminLinkToProvider :userId="props.data._id" />
            <TwoFactorSetup systemAdmin />
            <p class="text-body-1 font-weight-bold text-error">{{ $t('mua.adminSettings.deleteLabel') }}</p>
            <v-divider color="error" />

                <v-banner color="error" class="text-error my-4">
                    <v-banner-text class="pa-0">
                       <p class="text-body-1 font-weight-bold">{{ $t('mua.adminSettings.noteHeader') }}</p>
                        <v-list-item color="error">
                            <template v-slot:prepend>
                                <v-icon icon="mdi-circle-small"></v-icon>
                            </template>
                            <v-card-text class="pa-0 ma-0 text-body-1">{{ $t('mua.adminSettings.notePoint1') }}</v-card-text>
                        </v-list-item>
                        <v-list-item color="error">
                            <template v-slot:prepend>
                                <v-icon icon="mdi-circle-small"></v-icon>
                            </template>
                            <v-card-text class="pa-0 ma-0 text-body-1">{{ $t('mua.adminSettings.notePoint2') }}</v-card-text>
                        </v-list-item>
                        <v-list-item color="error">
                            <template v-slot:prepend>
                                <v-icon icon="mdi-circle-small"></v-icon>
                            </template>
                            <v-card-text class="pa-0 ma-0 text-body-1">{{ $t('mua.adminSettings.notePoint3') }}</v-card-text>
                        </v-list-item>
                        <v-list-item color="error">
                            <template v-slot:prepend>
                                <v-icon icon="mdi-circle-small"></v-icon>
                            </template>
                            <v-card-text class="pa-0 ma-0 text-body-1">{{ $t('mua.adminSettings.notePoint4') }}</v-card-text>
                        </v-list-item>
                        <p class="text-body-1 font-weight-bold">{{ $t('mua.adminSettings.noteFooter') }}</p>
                </v-banner-text>
            </v-banner>
                <v-btn data-test-id="open-deleteAccount-dialog" @click="deleteMyAccountDialog.show()" color="error" variant="outlined" class="text-white">{{$t('mua.adminDeleteAccount.openBtn')}}</v-btn>

                <DeleteMyAccount ref="deleteMyAccountDialog" @deleteEventHandler="redirectDeleteHandler" :data="props.data" />
            </v-col>

        </v-layout>
</template>
