<script setup >
import { ref } from 'vue'
import DeleteMyAccount from './DeleteUserAccount.vue'
import { useAccountsStore } from '../stores/index.js'

const emit = defineEmits(['deleteEventHandler'])
const props = defineProps({
  data: Object
})
function redirectDeleteHandler (data) {
  emit('deleteEventHandler', data)
}

const deleteMyAccountDialog = ref()
const store = useAccountsStore()
await store.readOne()

</script>

<template >
  <v-layout class="d-flex flex-wrap w-75">
          <v-col class="pt-3">
            <h3 class="font-weight-bold text-error">{{ $t(`AccountAdminSettings.delete${props.data.role}Label`) }}</h3>
            <v-divider color="error" />

                <v-banner color="error" class="text-error my-4">
                    <v-banner-text>
                       <h3 class="font-weight-bold">{{ $t('muaAuth.AccountAdminSettings.noteHeader') }}</h3>
                        <v-list-item color="error">
                            <template v-slot:prepend>
                                <v-icon icon="mdi-circle-small"></v-icon>
                            </template>
                            <v-card-text class="pa-0 ma-0 text-body-1">{{ $t(`AccountAdminSettings.note${props.data.role}Point1`) }}</v-card-text>
                        </v-list-item>
                        <v-list-item color="error">
                            <template v-slot:prepend>
                                <v-icon icon="mdi-circle-small"></v-icon>
                            </template>
                            <v-card-text class="pa-0 ma-0 text-body-1">{{ $t(`AccountAdminSettings.note${props.data.role}Point2`) }}</v-card-text>
                        </v-list-item>
                        <v-list-item v-if="props.data.role=== 'admin'" color="error">
                            <template v-slot:prepend>
                                <v-icon icon="mdi-circle-small"></v-icon>
                            </template>
                            <v-card-text class="pa-0 ma-0 text-body-1">{{ $t(`AccountAdminSettings.note${props.data.role}Point3`) }}</v-card-text>
                        </v-list-item>
                        <v-list-item v-if="props.data.role=== 'admin'" color="error">
                            <template v-slot:prepend>
                                <v-icon icon="mdi-circle-small"></v-icon>
                            </template>
                            <v-card-text class="pa-0 ma-0 text-body-1">{{ $t(`AccountAdminSettings.note${props.data.role}Point4`) }}</v-card-text>
                        </v-list-item>
                        <h3 class="font-weight-bold">{{ $t(`AccountAdminSettings.noteFooter`) }}</h3>
                </v-banner-text>
            </v-banner>
            <v-btn data-test-id="open-deleteAccount-dialog" color="error" variant="outlined" class="text-white" @click="deleteMyAccountDialog.show()">{{$t('muaAuth.deleteAdminAccount.openBtn')}}</v-btn>
                <DeleteMyAccount ref="deleteMyAccountDialog" @deleteEventHandler="redirectDeleteHandler" :data="props.data" />
            </v-col>

        </v-layout>
</template>
