<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import Invite from '../components/InviteMembers.vue'
import DeleteUser from '../components/DeleteMyAccount.vue'
import UserProfile from '../components/UserProfile.vue'

const route = useRoute()

const emit = defineEmits(['deleteEventHandler', 'inviteEventHandler', 'createEventHandler', 'loadMore', 'searchEvent'])
const props = defineProps({
  items: Array,
  roles: Array,
  currentAccName: String,
  currentUser: Object
})

const filter = ref('')
const page = ref(0)

function redirectDeleteEventHandler (data) {
  emit('deleteEventHandler', data)
}

function redirectInviteEventHandler (data, cb) {
  emit('inviteEventHandler', data, cb)
}

function redirectUpdateRoleEventHandler (data) {
  emit('updateRoleEventHandler', data)
}

window.onscroll = () => {
  const bottomOfWindow = Math.trunc(document.documentElement.scrollTop + window.innerHeight) === document.documentElement.offsetHeight
  if (bottomOfWindow) {
    emit('loadMore', page.value + 1)
  }
}
const profilePicture = (item) => {
  return item.data.profilePicture || import.meta.env.BASE_URL + 'placeholder.jpg'
}
</script>

<template>
    <v-container class="mx-6 pt-0">
        <v-layout class="d-flex flex-wrap">
            <v-col cols="2" class="pt-3">
                <p class="text-h6">{{ props.currentAccName }} </p>
            </v-col>
            <v-spacer />
            <v-col cols="5">
                <v-text-field hide-details density="compact" data-test-id="userList-searchBar" label="Search"
                    variant="underlined" append-inner-icon="mdi-magnify" v-model.lazy="filter" color="primary"
                    @change="$emit('searchEvent', filter)"></v-text-field>
            </v-col>

            <v-col class="pt-3">
                <Invite :name="props.currentAccName" @inviteEventHandler='redirectInviteEventHandler' />
            </v-col>
            <v-divider />

        </v-layout>

        <v-layout class="d-flex flex-wrap">
            <v-card class="mx-2 my-5 align-self-start " min-width="275" v-for="item in props.items" :key="item._id">
                <v-card-title>
                    <p data-test-id="userList-card-0-name">{{ item.data.name }}<span
                            class="font-weight-light pl-2">{{ item.data.role }}</span></p>
                </v-card-title>
                <v-img :src="profilePicture(item)" height="150px" cover></v-img>
                <v-card-text class="pl-0">
                    <v-card-subtitle>
                        {{ item.data.email }}
                        <v-card-subtitle>
                            <span v-if="props.currentUser._id === item._id"> - Me -</span>
                        </v-card-subtitle>
                    </v-card-subtitle>

                </v-card-text>
                <v-card-actions data-test-id="userList-card-0-action"
                    v-if="props.currentUser._id !== item._id && props.currentUser.role === 'admin'">
                    <UserProfile @updateRoleEventHandler='redirectUpdateRoleEventHandler' :roles="props.roles"
                        :data="item.data" />

                    <v-spacer></v-spacer>
                    <DeleteUser @deleteEventHandler='redirectDeleteEventHandler' :data="item.data" />

                </v-card-actions>
                <v-card-actions v-if="props.currentUser._id === item._id">
                    <v-btn color="info" class="text-white" :to="`/${route.params.urlFriendlyName}/me`">{{ $t('userList.openBtn') }}</v-btn>
                </v-card-actions>

            </v-card>
        </v-layout>
    </v-container></template>
