<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useUsersStore } from '../stores/index.js'
import useSystemMessagesStore from '../stores/systemMessages.js'
import jwtDecode from 'jwt-decode'

const emit = defineEmits(['updateUserData'])

const props = defineProps({
  accountId: String,
  userId: String
})

const route = useRoute()
const router = useRouter()

async function submitCreateWithProvider (provider) {
  const res = await useUsersStore().createWithProvider({ provider, accountId: props.accountId, userId: props.userId })

  if (res.redirectUrl) {
    let token
    let failed
    const popup = window.open(res.redirectUrl, 'provider-signin-popup', 'width=600,height=600')
    const handleMessage = async (event) => {
      if (event.data.userData) {
        const data = jwtDecode(event.data.userData)
        emit('updateUserData', data.user)
      }
      if (event.data.type === 'provider-signup-token') {
        token = event.data.loginToken
        failed = event.data.failed
      }
    }
    if (popup) {
      window.addEventListener('message', handleMessage)

      const interval = setInterval(async () => {
        if (popup.closed) {
          window.removeEventListener('message', handleMessage)
          clearInterval(interval)

          if (token) {
            localStorage.setItem('loginToken', token)

            const res = await useUsersStore().getAccessToken(token)

            if (res.success) {
              router.push(`/accounts/${route.params.urlFriendlyName}/dashboard`)
            }
          } else if (failed) {
            useSystemMessagesStore().addError({ name: 'Authentication failed' })
          }
        }
        try {
          const params = new URLSearchParams(popup.location.search)
          const loginToken = params.get('loginToken')
          const failed = params.get('failed')
          const userData = params.get('userData')
          if (!popup.closed && (loginToken || failed || userData)) {
            popup.opener.postMessage({
              type: 'provider-signup-token',
              loginToken,
              failed,
              userData
            }, '*')
            popup.close()
          }
        } catch (e) {
          console.error('Error accessing popup URL parameters:', e)
        }
      }, 1000)
    }
  }
}

</script>

<template>
  <v-card-text align="left">
    <div class="w-100 d-flex flex-wrap justify-center align-center text-center mb-7">
      <v-divider style="flex: 1; margin-right: 10px;" :thickness="2"></v-divider>

      <span class=" text-grey">Or</span>

      <v-divider style="flex: 1; margin-left: 10px;" :thickness="2"></v-divider>
    </div>
    <v-btn block @click="submitCreateWithProvider('google')" class="pa-2 border" variant="text">
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
          <path fill="#FFC107"
            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
          <path fill="#FF3D00"
            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
          <path fill="#4CAF50"
            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
          <path fill="#1976D2"
            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
        </svg>
      </span>
      <span class="mx-2 text-caption font-weight-medium">Sign up with Google</span>
    </v-btn>
    <v-btn block @click="submitCreateWithProvider('microsoft')" class="pa-2 border mt-2" variant="text">
      <span>
        <span>
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 48 48">
          <path fill="#ff5722" d="M6 6H22V22H6z" transform="rotate(-180 14 14)"></path>
          <path fill="#4caf50" d="M26 6H42V22H26z" transform="rotate(-180 34 14)"></path>
          <path fill="#ffc107" d="M26 26H42V42H26z" transform="rotate(-180 34 34)"></path>
          <path fill="#03a9f4" d="M6 26H22V42H6z" transform="rotate(-180 14 34)"></path>
        </svg>
      </span>
      </span>
      <span class="mx-2 text-caption font-weight-medium">Sign up with Microsoft</span>
    </v-btn>

    <v-btn block @click="submitCreateWithProvider('github')" class="pa-2 border mt-2" variant="text">
      <span>
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 72 72">
          <path d="M36,12c13.255,0,24,10.745,24,24c0,10.656-6.948,19.685-16.559,22.818c0.003-0.009,0.007-0.022,0.007-0.022	s-1.62-0.759-1.586-2.114c0.038-1.491,0-4.971,0-6.248c0-2.193-1.388-3.747-1.388-3.747s10.884,0.122,10.884-11.491	c0-4.481-2.342-6.812-2.342-6.812s1.23-4.784-0.426-6.812c-1.856-0.2-5.18,1.774-6.6,2.697c0,0-2.25-0.922-5.991-0.922	c-3.742,0-5.991,0.922-5.991,0.922c-1.419-0.922-4.744-2.897-6.6-2.697c-1.656,2.029-0.426,6.812-0.426,6.812	s-2.342,2.332-2.342,6.812c0,11.613,10.884,11.491,10.884,11.491s-1.097,1.239-1.336,3.061c-0.76,0.258-1.877,0.576-2.78,0.576	c-2.362,0-4.159-2.296-4.817-3.358c-0.649-1.048-1.98-1.927-3.221-1.927c-0.817,0-1.216,0.409-1.216,0.876s1.146,0.793,1.902,1.659	c1.594,1.826,1.565,5.933,7.245,5.933c0.617,0,1.876-0.152,2.823-0.279c-0.006,1.293-0.007,2.657,0.013,3.454	c0.034,1.355-1.586,2.114-1.586,2.114s0.004,0.013,0.007,0.022C18.948,55.685,12,46.656,12,36C12,22.745,22.745,12,36,12z">
          </path>
        </svg>
      </span>
      </span>
      <span class="mx-2 text-caption font-weight-medium">Sign up with Github</span>
    </v-btn>
  </v-card-text>
</template>
