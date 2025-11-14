<script setup>
import { ref } from 'vue'

const props = defineProps({
  data: Object,
  roles: Array,
  permissions: Array,
  projects: Array
})

const role = ref(props.data.role)
const projectsAccess = ref(props.data.projectsAccess || [])

const dialogShown = ref()
const profilePicture = ref(props.data.profilePicture || import.meta.env.BASE_URL + 'placeholder.jpg')

const show = () => {
  dialogShown.value = true
}

defineExpose({
  show,
  hide: () => { dialogShown.value = false; role.value = props.data.role; projectsAccess.value = props.data.projectsAccess || [] }
})

</script>

<template>

    <v-dialog v-model="dialogShown" tabindex="-1"
        @keydown.enter="props.roles && $emit('updateRoleEventHandler', { id: props.data._id, role, projectsAccess }); dialogShown = false"
        @keydown.esc="dialogShown = false; role = props.data.role">
        <template v-slot:activator="{ props }">
            <v-btn color="primary" data-test-id="open-userProfile" class="text-white" v-bind="props">{{
                $t('mua.userCard.openBtn') }}</v-btn>
        </template>

        <v-card :width="!$vuetify.display.mdAndUp ? '100%' : '50%'" max-width="800" class="ma-auto">
            <v-container class="d-flex flex-column justify-center">

                <v-card-text align="start">
                    <v-col align="center" class="pb-10">
                        <v-toolbar-title class="font-weight-bold">{{ props.data.name }}</v-toolbar-title>
                    </v-col>

                    <v-row align="center" class="pb-10">
                        <p class="text-body-1 font-weight-bold">{{ $t('mua.userCard.overviewTitle') }}</p>
                        <v-divider />
                    </v-row>

                    <v-row align="center">
                        <v-col>
                            <p class="font-weight-bold">{{ $t('mua.userCard.nameLabel') }}</p>
                        </v-col>
                        <v-col cols="7">
                            <v-text-field hide-details density="compact" color="primary" disabled class="my-5 rounded"
                                variant="solo" :placeholder="props.data.name" name="name" :value="props.data.name"
                                type="text" required />
                        </v-col>

                    </v-row>

                    <v-row align="center">
                        <v-col>
                            <p class="font-weight-bold">{{ $t('mua.userCard.emailLabel') }}</p>
                        </v-col>
                        <v-col cols="7">
                            <v-text-field hide-details density="compact" color="primary" disabled class="my-5 rounded"
                                variant="solo" :placeholder="props.data.email" name="email" :value="props.data.email"
                                type="text" required />
                        </v-col>

                    </v-row>

                    <v-row align="center">
                        <v-col>
                            <p class="font-weight-bold">{{ $t('mua.userCard.roleLabel') }}</p>
                        </v-col>
                        <v-col cols="7">
                            <v-select hide-details data-test-id="userProfile-selectRole" v-model="role"
                                :disabled="!props.roles" density="compact" color="primary" class="my-5 rounded"
                                variant="solo" :items="props.roles" name="role" />
                        </v-col>
                    </v-row>

                    <div v-if="role === 'client'">
                        <v-row v-for="(item, i) in projectsAccess" :key="i"
                            class="justify-start align-center mt-2">
                            <v-col cols="5">
                                <p class="font-weight-bold">{{ $t('mua.userCard.projectLabel') }}</p>
                                <v-select hide-details data-test-id="userProfile-selectRole" v-model="item.projectId"
                                    :disabled="!props.projects" density="compact" color="primary" class="my-5 rounded"
                                    item-title="name" item-value="_id" variant="solo" :items="props.projects"
                                    name="projectId" />
                            </v-col>
                            <v-col>
                                <p class="font-weight-bold">{{ $t('mua.userCard.permissionLabel') }}</p>
                                <v-select hide-details data-test-id="userProfile-selectRole" v-model="item.permission"
                                    :disabled="!props.permissions" density="compact" color="primary"
                                    class="my-5 rounded" variant="solo" :items="props.permissions" name="permission" />
                            </v-col>
                            <v-col cols="auto">
                                <div class="tooltip-container">
                                    <v-btn variant="text" class="mt-5" color="error"
                                        @click="projectsAccess.splice(i, 1)" icon="mdi-delete" />
                                    <span class="tooltip">{{ $t('mua.accountInviteMembers.removePermissionLabel')
                                        }}</span>
                                </div>
                            </v-col>
                        </v-row>
                        <div class="w-100 d-flex flex-wrap justify-center align-center text-center my-7">
                            <v-divider style="flex: 1; margin-right: 10px;"></v-divider>
                            <v-tooltip location="top">
                                <template v-slot:activator="{ props: tooltipProps }">
                                    <v-btn icon="mdi-plus" v-bind="tooltipProps"
                                        @click="projectsAccess.push({ projectId: '', permission: props.permissions[0] })" />
                                </template>
                                <span>{{ $t('mua.accountInviteMembers.addPermissionLabel') }}</span>
                            </v-tooltip>
                            <v-divider style="flex: 1; margin-left: 10px;"></v-divider>
                        </div>
                    </div>

                    <v-row align="center">
                        <v-col>
                            <p class="font-weight-bold">{{ $t('mua.userCard.picLabel') }}</p>
                        </v-col>
                        <v-col align="center">
                            <v-avatar class="elevation-3 " size="180">
                                <v-img :src="profilePicture + '?' + Date.now()" class="align-self-stretch" cover />
                            </v-avatar>
                        </v-col>
                    </v-row>

                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" data-test-id="userProfile-cancelBtn"
                        @click="dialogShown = false; role = props.data.role">{{ $t('mua.userCard.closeBtn') }}</v-btn>
                    <v-spacer />
                    <v-btn color="primary" v-if="props.roles" data-test-id="userProfile-submitBtn"
                        @click="$emit('updateRoleEventHandler', { id: props.data._id, role, projectsAccess }); dialogShown = false">{{
                            $t('mua.userCard.submitBtn') }}</v-btn>
                </v-card-actions>
            </v-container>
        </v-card>
    </v-dialog>

</template>
<style scoped>
.tooltip-container {
  position: relative;
  display: inline-block;
}

.tooltip {
  visibility: hidden;
  background-color: rgba(61, 61, 61, 0.911);
  color: #fff;
  text-align: center;
  border-radius: 5px;
  padding: 10px 10px;
  /* Added horizontal padding for better spacing */
  position: absolute;
  z-index: 5;
  bottom: 90%;
  left: 50%;
  /* Center the tooltip horizontally */
  transform: translateX(-50%);
  /* Adjust to center it */
  white-space: nowrap;
  /* Prevent text wrapping */
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip-container:hover .tooltip {
  visibility: visible;
  opacity: 1;
}
</style>
