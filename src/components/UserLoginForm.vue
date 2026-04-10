<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUsersStore } from '../stores/index.js'
import LoginWithProvider from './LoginWithProvider.vue'
import ConfirmDialog from '../dialogs/ConfirmDialog.vue'

const emit = defineEmits(['handleGetLoginAccountsHandler', 'handleLoginHandler', 'handleSendMagicLinkHandler'])

const props = defineProps({
  tokenData: Object
})

const route = useRoute()
const router = useRouter()
const data = ref({})
const cb = ref(false)
const processing = ref(false)
const magicLinkProcessing = ref(false)
const magicLinkSent = ref(false)
const recentLogins = ref(await useUsersStore().getRecentLoginsAccounts())
const openRecentLogins = ref(recentLogins.value)
const confirmDialogRef = ref()

const defaultLogo = import.meta.env.BASE_URL + 'placeholder.jpg'

if (props.tokenData.user) {
  data.value.email = ref(props.tokenData.user.email)
}
if (props.tokenData.account) {
  data.value.account = ref(props.tokenData.account._id)
}

const appIcon = import.meta.env.VITE_APP_LOGO_URL

const selectedAccount = () => props.tokenData.accounts?.find(a => a._id === data.value.account)
function submitForm () {
  if (!props.tokenData.accounts && !cb.value) {
    processing.value = true
    return emit('handleGetLoginAccountsHandler', data.value.email, (res) => { res ? cb.value = res : processing.value = false })
  }
  if (props.tokenData.accounts && cb.value) {
    processing.value = true
    emit('handleLoginHandler', data.value, () => { processing.value = false })
  }
}

async function removeAccount (urlFriendlyName) {
  const res = await useUsersStore().removeRecentLoginAccount(urlFriendlyName)
  if (res.success) {
    recentLogins.value = await useUsersStore().getRecentLoginsAccounts()
    openRecentLogins.value = recentLogins.value
  }
}
</script>

<template>
    <v-layout style="z-index: 10;" class="d-flex flex-column justify-center align-center h-100">
        <ConfirmDialog ref="confirmDialogRef" :title="$t('mua.userLoginAndResetForm.confirmDialog.removeHeader')" icon="mdi-help-circle-outline"
            iconColor="error" :okBtnLabel="$t('mua.userLoginAndResetForm.confirmDialog.removeBtn')" okBtnColor="error"
            cancelBtnColor="primary"
            @okButtonPressed="(params)=>removeAccount(params)" />
        <v-card elevation="0">
            <v-card-text align="center" class="loggedOutState">
                <v-avatar size="80">
                    <v-img :src="appIcon" cover></v-img>
                </v-avatar>
            </v-card-text>
        </v-card>
        <v-card v-if="!props.tokenData.accounts && openRecentLogins"
            class="ma-2 pa-2 rounded-xl elevation-2" width="80%" max-width="600px">
            <v-card-text>
                <p class="text-h6 text-center mb-1">{{ $t('mua.userLoginAndResetForm.recentloginsHeader') }}</p>
                <p class="text-body-2 text-medium-emphasis text-center mb-4">{{ $t('mua.userLoginAndResetForm.recentloginsSubheader') }}</p>
                <div class="d-flex flex-column">
                    <v-card
                        v-for="(element, i) in recentLogins"
                        :key="i"
                        class="account-picker-card d-flex flex-row align-center rounded-xl elevation-0 px-3 py-2"
                        :class="i > 0 ? 'mt-3' : ''"
                        border
                        @click="router.push({ path: `/accounts/login/${element.urlFriendlyName}` })"
                        style="cursor: pointer;"
                    >
                        <v-avatar size="40" class="mr-3 flex-shrink-0">
                            <v-img :src="element.logo ? element.logo + '?' + Math.random().toString(36).substring(2, 7) : defaultLogo" cover />
                        </v-avatar>
                        <span class="text-body-2 font-weight-medium">{{ element.name }}</span>
                        <v-hover>
                            <template v-slot:default="{ isHovering, props: hoverProps }">
                                <v-icon v-bind="hoverProps" size="18" class="ml-auto pl-3"
                                    @click.stop="confirmDialogRef.show(element.urlFriendlyName)"
                                    :color="isHovering ? 'error' : 'medium-emphasis'"
                                    style="cursor: pointer;">mdi-close</v-icon>
                            </template>
                        </v-hover>
                    </v-card>
                </div>
            </v-card-text>
            <v-card-actions class="justify-center pb-3">
                <v-btn color="primary" append-icon="mdi-arrow-right" @click="openRecentLogins = false">
                    {{ $t('mua.userLoginAndResetForm.loginToAnotherAccount') }}
                </v-btn>
            </v-card-actions>
        </v-card>
        <v-card v-else class="ma-2 pa-2 rounded-xl elevation-2" width="80%" max-width="600px">

            <!-- Step 1: email entry -->
            <v-card-text v-if="!props.tokenData.accounts && !cb" align="center" @keydown.enter="submitForm">
                <p class="text-h6 mb-5">{{ $t('mua.userLoginAndResetForm.loginHeader') }}</p>
                <v-text-field hide-details data-test-id="loginAndResetForm-emailField" density="compact"
                    class="mb-5 rounded" color="primary" variant="solo"
                    type="email" name="email"
                    :placeholder="data.email || $t('mua.userLoginAndResetForm.emailPlaceHolder')" :value="data.email"
                    @update:modelValue="res => data.email = res.replace(/[^a-z0-9+@ \.,_-]/gim, '')" required />
                <v-btn color="primary" data-test-id="loginAndResetForm-getLoginAccountsBtn"
                    @click="processing = true; $emit('handleGetLoginAccountsHandler', data.email, (res) => { res ? cb = res : null; processing = false })">
                    {{ !processing ? $t('mua.userLoginAndResetForm.loginBtnText') : '' }}
                    <v-progress-circular v-if="processing" :size="20" indeterminate></v-progress-circular>{{
                        processing ? $t('mua.processing') : '' }}
                </v-btn>
            </v-card-text>

            <!-- Step 1 cb: magic link sent (single account) -->
            <v-card-text v-else-if="!props.tokenData.accounts && cb" align="center" class="py-6">
                <v-icon size="48" color="primary" class="mb-3">mdi-email-fast-outline</v-icon>
                <p class="text-h6 mb-2">{{ $t('mua.userLoginAndResetForm.magicLink.sentHeader') }}</p>
                <p class="text-body-2 text-medium-emphasis">{{ $t('mua.userLoginAndResetForm.cb.loginMessage') }}</p>
            </v-card-text>

            <!-- Step 2: account picker -->
            <v-card-text v-else-if="props.tokenData.accounts && !cb" align="center">
                <p class="text-h6 mb-1">{{ $t('mua.userLoginAndResetForm.loginHeader') }}</p>
                <p class="text-body-2 text-medium-emphasis mb-4">{{ data.email }}</p>
                <div class="d-flex flex-column">
                    <v-card
                        v-for="(acc, i) in props.tokenData.accounts"
                        :key="acc._id"
                        data-test-id="loginAndResetForm-accountCard"
                        class="account-picker-card d-flex flex-row align-center rounded-xl elevation-0 px-3 py-2"
                        :class="i > 0 ? 'mt-3' : ''"
                        border
                        @click="data.account = acc._id; cb = 'signIn'"
                        style="cursor: pointer;"
                    >
                        <v-avatar size="40" class="mr-3 flex-shrink-0">
                            <v-img :src="acc.logo ? acc.logo + '?' + Math.random().toString(36).substring(2, 7) : defaultLogo" cover />
                        </v-avatar>
                        <span class="text-body-2 font-weight-medium">{{ acc.name }}</span>
                        <v-icon class="ml-auto" size="18" color="medium-emphasis">mdi-chevron-right</v-icon>
                    </v-card>
                </div>
            </v-card-text>

            <!-- Step 3: password + magic link for selected account -->
            <template v-else-if="props.tokenData.accounts && cb">
                <v-card-text class="pb-0 pt-3">
                    <v-btn variant="text" size="small" color="medium-emphasis" prepend-icon="mdi-arrow-left"
                        @click="cb = false; magicLinkSent = false; data.password = ''">
                        {{ $t('mua.userLoginAndResetForm.backToAccountsBtn') }}
                    </v-btn>
                </v-card-text>
                <v-card-text align="center" @keydown.enter="submitForm">
                    <div v-if="!magicLinkSent">
                        <v-avatar size="52" class="mb-2">
                            <v-img :src="selectedAccount()?.logo ? selectedAccount().logo + '?' + Math.random().toString(36).substring(2, 7) : defaultLogo" cover />
                        </v-avatar>
                        <p class="text-h6 mb-1">{{ selectedAccount()?.name }}</p>
                        <p class="text-body-2 text-medium-emphasis mb-4">{{ data.email }}</p>
                        <v-text-field hide-details density="compact" class="mb-4 rounded" color="primary" variant="solo"
                            name="password" data-test-id="loginAndResetForm-passwordField"
                            :label="$t('mua.userLoginAndResetForm.passwordLabel')" type="password"
                            :placeholder="data.password || $t('mua.userLoginAndResetForm.passwordPlaceholder')"
                            :value="data.password"
                            @update:modelValue="res => data.password = res.replace(/[^a-z0-9!@#$%^&* \.,_-]/gim, '')"
                            required />
                        <v-btn block color="primary" data-test-id="loginAndResetForm-loginBtn" class="mb-3"
                            @click="processing = true; $emit('handleLoginHandler', data, () => { processing = false })">
                            {{ !processing ? $t('mua.userLoginAndResetForm.loginBtnText') : '' }}
                            <v-progress-circular v-if="processing" :size="20" indeterminate></v-progress-circular>{{
                                processing ? $t('mua.processing') : '' }}
                        </v-btn>
                        <LoginWithProvider :accountId="data.account">
                            <v-btn block variant="outlined" color="primary" data-test-id="loginAndResetForm-magicLinkBtn" class="mb-2"
                                @click="magicLinkProcessing = true; $emit('handleSendMagicLinkHandler', data.account, (res) => { magicLinkProcessing = false; if (res) magicLinkSent = true })">
                                <v-icon start>mdi-email-fast-outline</v-icon>
                                {{ !magicLinkProcessing ? $t('mua.userLoginAndResetForm.magicLink.sendBtn') : '' }}
                                <v-progress-circular v-if="magicLinkProcessing" :size="20" indeterminate></v-progress-circular>{{
                                    magicLinkProcessing ? $t('mua.processing') : '' }}
                            </v-btn>
                        </LoginWithProvider>
                    </div>
                    <div v-else class="py-4">
                        <v-icon size="48" color="primary" class="mb-3">mdi-email-fast-outline</v-icon>
                        <p class="text-h6 mb-2">{{ $t('mua.userLoginAndResetForm.magicLink.sentHeader') }}</p>
                        <p class="text-body-2 text-medium-emphasis">{{ $t('mua.userLoginAndResetForm.magicLink.sentMessage') }}</p>
                    </div>
                </v-card-text>
            </template>
        </v-card>
        <v-container v-if="!props.tokenData.accounts && !cb" class="w-100">
            <v-col v-if="recentLogins && !openRecentLogins" class="text-center justify-center align-center ">
                <p data-test-id="loginAndResetForm-createAccountBtn" style="cursor: pointer;  color: #888888;"
                    class="font-weight-bold" @click="openRecentLogins = true">{{
                        $t('mua.userLoginAndResetForm.cb.backToRecentLoginsBtn') }}</p>
            </v-col>
            <v-col class="text-center justify-center align-center ">
                <p style="color: #888888;"> {{ $t('mua.userLoginAndResetForm.cb.forgotMessage') }}</p>
                <router-link data-test-id="loginAndResetForm-createAccountBtn"
                    style="text-decoration: none;  color: #888888;" class="font-weight-bold"
                    to="/accounts/create-account">{{
                        $t('mua.userLoginAndResetForm.cb.forgotCbBtn') }}</router-link>
            </v-col>
        </v-container>
        <v-container v-if="props.tokenData.accounts && cb" class="w-100">
            <v-col class="text-center justify-center align-center ">

                <p style="color: #888888;">{{ $t('mua.userLoginAndResetForm.forgotHeader') }}</p>
                <router-link style="text-decoration: none; color: #888888;"
                    data-test-id="loginAndResetForm-resetPasswordBtn" class="font-weight-bold"
                    :to="`/accounts/forgot-password?token=${route.query.token}&account=${data.account}`">{{
                        $t('mua.userLoginAndResetForm.forgotBtn')
                    }}</router-link>
            </v-col>
        </v-container>

    </v-layout>
</template>

<style scoped>
.account-picker-card {
  transition: background-color 0.15s ease, border-color 0.15s ease;
}
.account-picker-card:hover {
  background-color: rgba(var(--v-theme-primary), 0.06);
  border-color: rgb(var(--v-theme-primary)) !important;
}
</style>
