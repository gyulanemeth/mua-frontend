<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useDebounceFn } from '@vueuse/core'
import Dialog from '../components/AdminCreateDialog.vue'
import DeleteMyAccount from './AdminDeleteAccount.vue'

const emit = defineEmits(['deleteEventHandler', 'inviteEventHandler', 'createEventHandler', 'loadMore', 'searchEvent', 'reSendInvitationEventHandler', 'detailsEventHandler'])
const props = defineProps({
  items: Array,
  btn: Object,
  adminId: String
})

const route = useRoute()

const filter = ref('')
const loading = ref()
const createAccountDialog = ref()

const debouncedFn = useDebounceFn(() => {
  loading.value = true
  emit('searchEvent', filter.value, () => { loading.value = false })
}, 300)

const profilePicture = (item) => {
  return item.data.profilePicture || import.meta.env.BASE_URL + 'placeholder.jpg'
}

function redirectDeleteEventHandler (data) {
  loading.value = true
  emit('deleteEventHandler', data, () => { loading.value = false })
}

function redirectInviteEventHandler (data, cb) {
  emit('inviteEventHandler', data, cb)
}

function redirectCreateEventHandler (data, cb) {
  emit('createEventHandler', data, cb)
}

async function visibilityChanged (isVisible) {
  if (isVisible) {
    emit('loadMore')
  }
}

const appIcon = import.meta.env.BASE_URL + 'bluefoxemail-logo.png'

</script>

<template>

  <div class="elevation-2 pa-3 pt-0 rounded">
    <v-layout class="d-flex flex-wrap">
      <v-col cols="12" md="2" class="d-flex align-end pt-1">
        <p class="text-h6">{{ route.name === 'system-admins' ? $t('mua.listAdminsAndAccounts.header.admin') :
          $t('mua.listAdminsAndAccounts.header.account') }} </p>
      </v-col>
      <v-spacer />
      <v-col cols="12" md="5" class="d-flex align-end mb-n5 pt-1">
        <v-text-field density="compact" label="Search" data-test-id="tableList-searchBar" variant="underlined"
          append-inner-icon="mdi-magnify" v-model.lazy="filter" color="info"
          @input="loading = true; debouncedFn()"></v-text-field>
      </v-col>
      <v-col cols="12" md="2" class="d-flex align-end  pt-1">
        <v-btn variant="outlined" block color="info" @click="createAccountDialog.show()">
          {{ route.name === 'system-admins' ? $t('mua.listAdminsAndAccounts.createAdminBtn') :
            $t('mua.listAdminsAndAccounts.createAccountBtn') }}
        </v-btn>
        <Dialog ref="createAccountDialog" :header="props.btn.header" @createEventHandler='redirectCreateEventHandler'
          @inviteEventHandler='redirectInviteEventHandler' :inputs="props.btn.input" />
      </v-col>
      <v-divider />
    </v-layout>
    <v-layout v-if="filter.length === 0 && props.items.length === 0 && !loading" class="d-flex flex-wrap ma-0 pa-0">
      <v-spacer />
      <v-col cols="2" class="d-flex align-center ma-0 pa-0">
        <div>
          <v-col cols="5">
            <v-icon class="ml-10" color="info" icon="mdi-arrow-up" size="x-large" />
          </v-col>
          <v-card-text class="pt-0">
            <p class="font-weight-medium">{{ route.name === 'system-admins' ? $t('mua.emptyList.inviteFirstAdmin') :
              $t('mua.emptyList.addFirstAccount') }} </p>
          </v-card-text>
        </div>
      </v-col>
    </v-layout>

    <v-layout v-if="loading" class="ma-auto d-flex flex-wrap pa-4 h-75">
      <v-card class="ma-auto align-self-start elevation-0 text-center" min-width="400">
        <v-progress-circular color="info" indeterminate :size="90"></v-progress-circular>
        <h4 class="mt-3">{{ $t('mua.loading') }}</h4>
      </v-card>
    </v-layout>

    <v-layout v-else-if="props.items.length === 0"
      :class="`ma-auto d-flex flex-wrap pa-4 ${filter.length > 0 ? 'h-75' : 'h-50'}`">
      <v-card class="ma-auto align-self-start elevation-0 text-center"
        :min-width="filter.length === 0 ? route.name === 'system-admins' ? 320 : 280 : 400">
        <v-avatar size="150">
          <v-img :src="appIcon" cover></v-img>
        </v-avatar>
        <v-row class="mt-2">
          <v-col cols="2" class="pt-3 mr-0 pr-0">
            <v-icon color="error" icon="mdi-cancel" size="x-large"></v-icon>
          </v-col>
          <v-col cols="10" class="pt-4 ml-0 pl-0">
            <h3 v-if="filter.length === 0">{{ $t('mua.emptyList.NoElementsYet', {
              name: route.name === 'system-admins' ?
                $t('mua.listAdminsAndAccounts.header.admin') : $t('mua.listAdminsAndAccounts.header.account')
            }) }}</h3>
            <h3 v-else>{{ $t('mua.emptyList.searchNoResult') }}</h3>
          </v-col>
        </v-row>
        <h3 class="w-100" v-if="filter.length > 0">{{ filter }}</h3>
      </v-card>
    </v-layout>

    <div v-else>
      <v-layout class="d-flex flex-wrap">
        <v-card :class="`${!$vuetify.display.mdAndUp ? 'mx-auto' :'mx-2'} my-5 align-self-start`" min-width="350"  height="320px" v-for="item in props.items"
          :key="item._id">
          <v-card-title>
            <p data-test-id="userList-card-0-name">{{ item.data.name ? item.data.name : 'Invited' }}</p>

          </v-card-title>
          <v-img :src="profilePicture(item)" height="150px" cover></v-img>
          <v-card-text>
            <v-card-subtitle class="px-0">
              {{ route.name === 'system-admins' ? item.data.email : item.data.urlFriendlyName }}
              <v-card-subtitle class="px-0">
                <span v-if="item._id === props.adminId"> - Me -</span>
              </v-card-subtitle>
            </v-card-subtitle>
          </v-card-text>
          <v-card-actions v-if="item._id !== props.adminId">
            <v-btn color="info" v-if="route.name === 'system-admins' && !item.data.name" variant="text" class="ma-2"
              size="small" @click="$emit('reSendInvitationEventHandler', { email: item.data.email })">{{
                $t('mua.listAdminsAndAccounts.resendMessage') }}
            </v-btn>
            <v-spacer />
            <DeleteMyAccount v-if="route.name === 'system-admins'" @deleteEventHandler='redirectDeleteEventHandler'
              :data="item.data" />
            <v-btn v-if="route.name !== 'system-admins'" color="info" variant="text" class="ma-2"
              append-icon="mdi-arrow-right" size="small"
              @click="$emit('detailsEventHandler', { id: item._id, urlFriendlyName: item.data.urlFriendlyName })">{{
                $t('mua.listAdminsAndAccounts.navigateToAccountBtn' && 'Navigate To Account') }}</v-btn>
          </v-card-actions>
        </v-card>
        <div v-if="props.items.length" v-observe-visibility="visibilityChanged"></div>
      </v-layout>
    </div>
  </div>
</template>
