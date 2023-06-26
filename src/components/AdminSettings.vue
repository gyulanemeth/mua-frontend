<script setup >
import DeleteMyAccount from './DeleteMyAccount.vue'
import { useCurrentUserAndAccountStore } from '../stores/index.js'

const emit = defineEmits(['deleteEventHandler'])
const props = defineProps({
  data: Object
})
function redirectDeleteHandler (data) {
  emit('deleteEventHandler', data)
}

const store = useCurrentUserAndAccountStore()
await store.readOne()

</script>

<template >
  <v-layout class="d-flex flex-wrap w-75">
          <v-col class="pt-3">
            <h3 class="font-weight-bold text-error">{{ $t(`adminSettings.delete${props.data.role}Label`) }}</h3>
            <v-divider color="error" />

                <v-banner color="error" class="text-error my-4">
                    <v-banner-text>
                       <h3 class="font-weight-bold">{{ $t('adminSettings.noteHeader') }}</h3>
                        <v-list-item color="error">
                            <template v-slot:prepend>
                                <v-icon icon="mdi-circle-small"></v-icon>
                            </template>
                            <v-card-text class="pa-0 ma-0 text-body-1">{{ $t(`adminSettings.note${props.data.role}Point1`) }}</v-card-text>
                        </v-list-item>
                        <v-list-item color="error">
                            <template v-slot:prepend>
                                <v-icon icon="mdi-circle-small"></v-icon>
                            </template>
                            <v-card-text class="pa-0 ma-0 text-body-1">{{ $t(`adminSettings.note${props.data.role}Point2`) }}</v-card-text>
                        </v-list-item>
                        <v-list-item v-if="props.data.role=== 'admin'" color="error">
                            <template v-slot:prepend>
                                <v-icon icon="mdi-circle-small"></v-icon>
                            </template>
                            <v-card-text class="pa-0 ma-0 text-body-1">{{ $t(`adminSettings.note${props.data.role}Point3`) }}</v-card-text>
                        </v-list-item>
                        <v-list-item v-if="props.data.role=== 'admin'" color="error">
                            <template v-slot:prepend>
                                <v-icon icon="mdi-circle-small"></v-icon>
                            </template>
                            <v-card-text class="pa-0 ma-0 text-body-1">{{ $t(`adminSettings.note${props.data.role}Point4`) }}</v-card-text>
                        </v-list-item>
                        <h3 class="font-weight-bold">{{ $t(`adminSettings.noteFooter`) }}</h3>
                </v-banner-text>
            </v-banner>
                <DeleteMyAccount @deleteEventHandler="redirectDeleteHandler" :data="props.data" />
            </v-col>

        </v-layout>
</template>
