<script setup>
import { ref } from 'vue'

const props = defineProps({
  name: String,
  roles: Array,
  permissions: Array,
  projects: Array
})

const processing = ref(false)
const dialogShown = ref(false)
const data = ref({
  name: props.name,
  projectsAccess: [{ projectId: '', permission: props.permissions[0] }]
})
const cb = ref()

const resetForm = () => {
  Object.keys(data.value).forEach(key => {
    data.value[key] = null
  })
  data.value = {
    name: props.name,
    projectsAccess: [{ projectId: '', permission: props.permissions[0] }]
  }
}

const getAvailableProjects = (rowIndex) => {
  const selectedIds = data.value.projectsAccess
    .map((item, i) => i !== rowIndex ? item.projectId : null)
    .filter(Boolean)

  return (props.projects || []).filter(project => !selectedIds.includes(project._id))
}

const show = () => {
  data.value = {
    name: props.name,
    projectsAccess: [{ projectId: '', permission: props.permissions[0] }]
  }
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
    <v-dialog v-model="dialogShown" tabindex="-1"
        @keydown.enter="processing = true; $emit('inviteEventHandler', data, (res) => { if (res) { cb = res } resetForm(); processing = false })"
        @keydown.esc="hide">
        <v-card :width="!$vuetify.display.mdAndUp ? '100%' : '50%'" max-width="800" class="ma-auto">
            <v-container class="d-flex flex-column justify-center">

                <v-toolbar color="white" align="center">
                    <v-toolbar-title class="font-weight-bold">{{ $t('mua.accountInviteMembers.header')
                        }}</v-toolbar-title>
                </v-toolbar>
                <v-card-text align="start">

                    <v-row align="center">
                        <v-col cols="12" md="4">
                            <p class="font-weight-bold">{{ $t('mua.accountInviteMembers.accountLabel') }}</p>
                        </v-col>
                        <v-col cols="12" md="8" align='center'>
                            <v-text-field hide-details density="compact" class="my-5 rounded" color="primary"
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
                                class="my-5 rounded" color="primary" variant="solo" name="email" type="email"
                                :placeholder="data.email || $t('mua.accountInviteMembers.emailPlaceHolder')"
                                :value="data.email"
                                @update:modelValue="res => data.email = res.replace(/[^a-z0-9+@ \.,_-]/gim, '')"
                                required />
                        </v-col>
                    </v-row>
                    <v-row align="center">
                        <v-col cols="12" md="4">
                            <p class="font-weight-bold">{{ $t('mua.accountInviteMembers.confirmEmailLabel') }}</p>
                        </v-col>
                        <v-col cols="12" md="8" align='center'>
                            <v-text-field hide-details density="compact" data-test-id="inviteMember-emailAgainField"
                                class="my-5 rounded" color="primary" variant="solo" name="confirmEmail" type="email"
                                :placeholder="data.confirmEmail || $t('mua.accountInviteMembers.confirmEmailPlaceHolder')"
                                :value="data.confirmEmail"
                                @update:modelValue="res => data.confirmEmail = res.replace(/[^a-z0-9+@ \.,_-]/gim, '')"
                                required />
                        </v-col>
                    </v-row>

                    <v-row align="center">
                        <v-col cols="12" md="4">
                            <p class="font-weight-bold">{{ $t('mua.accountInviteMembers.roleLabel') }}</p>
                        </v-col>
                        <v-col cols="12" md="8" align='center'>
                            <v-select hide-details data-test-id="userProfile-selectRole" v-model="data.role"
                                :disabled="!props.roles" density="compact" color="primary" class="my-5 rounded"
                                variant="solo" :items="props.roles" name="role" />
                        </v-col>
                    </v-row>

                    <div v-if="data.role === 'client'">
                        <v-row v-for="(item, i) in data.projectsAccess" :key="i"
                            class="justify-start align-center mt-2">
                            <v-col cols="5">
                                <p class="font-weight-bold">{{ $t('mua.accountInviteMembers.projectLabel') }}</p>
                                <v-select hide-details data-test-id="userProfile-selectRole" v-model="item.projectId"
                                    :disabled="!props.projects" density="compact" color="primary" class="my-5 rounded"
                                    item-title="name" item-value="_id" variant="solo" :items="getAvailableProjects(i)"
                                    name="projectId" />
                            </v-col>
                            <v-col>
                                <p class="font-weight-bold">{{ $t('mua.accountInviteMembers.permissionLabel') }}</p>
                                <v-select hide-details data-test-id="userProfile-selectRole" v-model="item.permission"
                                    :disabled="!props.permissions" density="compact" color="primary"
                                    class="my-5 rounded" variant="solo" :items="props.permissions" name="permission" />
                            </v-col>
                            <v-col cols="auto">
                                <div class="tooltip-container">
                                    <v-btn variant="text" class="mt-5" color="error"
                                        @click="data.projectsAccess.splice(i, 1)" icon="mdi-delete" />
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
                                        @click="data.projectsAccess.push({ projectId: '', permission: props.permissions[0] })" />
                                </template>
                                <span>{{ $t('mua.accountInviteMembers.addPermissionLabel') }}</span>
                            </v-tooltip>
                            <v-divider style="flex: 1; margin-left: 10px;"></v-divider>
                        </div>
                    </div>

                    <v-row v-if="cb" class="justify-center">
                        <p class="font-weight-bold" data-test-id="inviteMember-headerCb">{{
                            $t('mua.accountInviteMembers.cb.header') }}</p>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" data-test-id="inviteMember-cancelBtn"
                        @click="dialogShown = false; cb = undefined; resetForm()">{{
                            $t('mua.accountInviteMembers.closeBtn') }}</v-btn>
                    <v-btn color="primary" v-if="!cb" data-test-id="inviteMember-submitBtn"
                        @click="processing = true; $emit('inviteEventHandler', data, (res) => { if (res) { cb = res } resetForm(); processing = false })">
                        {{ !processing ? $t('mua.accountInviteMembers.submitBtn') : '' }}
                        <v-progress-circular v-if="processing" :size="20" indeterminate></v-progress-circular>{{
                            processing ? $t('mua.processing') : '' }}
                    </v-btn>
                    <v-btn color="primary" v-else data-test-id="inviteMember-resetFormBtn" @click="cb = null">{{
                        $t('mua.accountInviteMembers.cb.cbBtn') }}</v-btn>
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
