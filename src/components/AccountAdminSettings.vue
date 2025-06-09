<script setup >
import { ref } from 'vue'
import DeleteMyAccount from './UserDeleteAccount.vue'
import { useAccountsStore } from '../stores/index.js'
import LinkToProvider from './LinkToProvider.vue'
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
  <v-layout style="z-index: 10;" :class="`d-flex flex-wrap ${!$vuetify.display.mdAndUp? 'w-100':'w-75'}`">
      <v-col class="pt-3">
              <LinkToProvider :accountId="props.data.accountId" :userId="props.data._id" />
            <p class="text-body-1 font-weight-bold text-error">{{ $t(`mua.accountAdminSettings.delete${props.data.role}Label`) }}</p>
            <v-divider color="error" />

                <v-banner color="error" class="text-error my-4">
                    <v-banner-text class="pa-0">
                       <p class="text-body-1 font-weight-bold">{{ $t('mua.accountAdminSettings.noteHeader') }}</p>
                        <v-list-item color="error">
                            <template v-slot:prepend>
                                <v-icon icon="mdi-circle-small"></v-icon>
                            </template>
                            <v-card-text class="pa-0 ma-0 text-body-1">{{ $t(`mua.accountAdminSettings.note${props.data.role}Point1`) }}</v-card-text>
                        </v-list-item>
                        <v-list-item color="error">
                            <template v-slot:prepend>
                                <v-icon icon="mdi-circle-small"></v-icon>
                            </template>
                            <v-card-text class="pa-0 ma-0 text-body-1">{{ $t(`mua.accountAdminSettings.note${props.data.role}Point2`) }}</v-card-text>
                        </v-list-item>
                        <v-list-item v-if="props.data.role=== 'admin'" color="error">
                            <template v-slot:prepend>
                                <v-icon icon="mdi-circle-small"></v-icon>
                            </template>
                            <v-card-text class="pa-0 ma-0 text-body-1">{{ $t(`mua.accountAdminSettings.note${props.data.role}Point3`) }}</v-card-text>
                        </v-list-item>
                        <v-list-item v-if="props.data.role=== 'admin'" color="error">
                            <template v-slot:prepend>
                                <v-icon icon="mdi-circle-small"></v-icon>
                            </template>
                            <v-card-text class="pa-0 ma-0 text-body-1">{{ $t(`mua.accountAdminSettings.note${props.data.role}Point4`) }}</v-card-text>
                        </v-list-item>
                        <p class="text-body-1 font-weight-bold">{{ $t(`mua.accountAdminSettings.noteFooter`) }}</p>
                </v-banner-text>
            </v-banner>
            <v-btn data-test-id="open-deleteAccount-dialog" color="error" variant="outlined" class="text-white" @click="deleteMyAccountDialog.show()">{{$t('mua.adminDeleteAccount.openBtn')}}</v-btn>
                <DeleteMyAccount ref="deleteMyAccountDialog" @deleteEventHandler="redirectDeleteHandler" :data="props.data" />
            </v-col>

        </v-layout>
</template>
