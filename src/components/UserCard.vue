<script setup>
import { ref } from 'vue'

const props = defineProps({
  data: Object,
  roles: Array
})

const role = ref(props.data.role)
const dialogShown = ref()
const profilePicture = ref(props.data.profilePicture || import.meta.env.BASE_URL + 'placeholder.jpg')

const show = () => {
  dialogShown.value = true
}

defineExpose({
  show,
  hide: () => { dialogShown.value = false; role.value = props.data.role }
})

</script>

<template>

<v-dialog v-model="dialogShown" tabindex="-1"   @keydown.enter="props.roles && $emit('updateRoleEventHandler',{id:props.data._id, role});dialogShown=false"  @keydown.esc="dialogShown=false; role= props.data.role">
    <template v-slot:activator="{ props }">
        <v-btn color="info" data-test-id="open-userProfile" class="text-white" v-bind="props">{{$t('mua.userCard.openBtn')}}</v-btn>
    </template>

        <v-card width="50%" max-width="800" class="ma-auto">
        <v-container class="d-flex flex-column justify-center">

        <v-card-text align="start">
            <v-col align="center" class="pb-10">
                <v-toolbar-title class="font-weight-bold">{{props.data.name}}</v-toolbar-title>
            </v-col>

            <v-row align="center" class="pb-10">
                <h3 class="font-weight-bold">{{$t('mua.userCard.overviewTitle')}}</h3>
                <v-divider />
            </v-row>

            <v-row align="center">
                <v-col>
                    <p class="font-weight-bold">{{$t('mua.userCard.nameLabel')}}</p>
                </v-col>
                <v-col cols="7">
                    <v-text-field hide-details density="compact" color="info" disabled class="my-5 rounded" variant="solo" :placeholder="props.data.name" name="name" :value="props.data.name" type="text" required />
                </v-col>

            </v-row>

            <v-row align="center">
                <v-col>
                    <p class="font-weight-bold">{{$t('mua.userCard.emailLabel')}}</p>
                </v-col>
                <v-col cols="7">
                    <v-text-field hide-details density="compact" color="info" disabled class="my-5 rounded" variant="solo" :placeholder="props.data.email" name="email" :value="props.data.email" type="text" required />
                </v-col>

            </v-row>

            <v-row align="center">
                <v-col>
                    <p class="font-weight-bold">{{$t('mua.userCard.roleLabel')}}</p>
                </v-col>
                <v-col cols="7">
                    <v-select hide-details data-test-id="userProfile-selectRole" v-model="role" :disabled="!props.roles" density="compact" color="info" class="my-5 rounded" variant="solo" :items="props.roles" name="role" />
                </v-col>
            </v-row>

            <v-row align="center">
                <v-col>
                    <p class="font-weight-bold">{{$t('mua.userCard.picLabel')}}</p>
                </v-col>
                <v-col align="center">
                    <v-avatar class="elevation-3 " size="180">
                        <v-img :src="profilePicture+ '?' +Date.now()" class="align-self-stretch" cover/>
                    </v-avatar>
                </v-col>
            </v-row>

        </v-card-text>
        <v-card-actions>
            <v-btn color="info" data-test-id="userProfile-cancelBtn" @click="dialogShown=false;role= props.data.role">{{$t('mua.userCard.closeBtn')}}</v-btn>
            <v-spacer />
            <v-btn color="info" v-if="props.roles" data-test-id="userProfile-submitBtn" @click="$emit('updateRoleEventHandler',{id:props.data._id, role});dialogShown=false">{{$t('mua.userCard.submitBtn')}}</v-btn>
        </v-card-actions>
        </v-container>
    </v-card>
</v-dialog>

</template>
