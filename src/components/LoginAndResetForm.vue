<script setup >
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  formData: Object,
  tokenData: Object
})

const route = useRoute()

const data = ref({})
const cb = ref(false)

if (props.tokenData.user) {
  data.value.email = props.tokenData.user.email
}
if (props.tokenData.account) {
  props.tokenData.accounts = [props.tokenData.account]
  data.value.account = props.tokenData.account._id
}

</script>

<template>
  <v-form class="d-flex flex-column justify-center align-center h-screen">
    <v-card elevation="0" class="w-25">
      <v-card-text align="center" >
          <v-icon size="77" color="info" icon="mdi-weather-hurricane" />
      </v-card-text>
      <v-card-title class="justify-center py-0">
        <h4 class="text-h4">  Administration Panel </h4>
      </v-card-title>
    </v-card>
  <v-card class="ma-2 pa-2  rounded-xl  elevation-2" width="30%">
    <v-card-text align="center">
      <h6 class="text-h6" >{{props.formData.header}}</h6>
               <v-text-field  hide-details
                density="compact"
              class=" elevation-2 my-5 pt-2 pl-3 rounded"
                color="info"
                variant="plain"
                placeholder="your@email.com"
                name="email"
                label="Email"
                v-model="data.email"
                :disabled="!!cb || !!props.tokenData.user"
                type="email"
                required />
                <v-select v-if="props.tokenData.accounts || props.tokenData.account "
                  hide-details
                  v-model="data.account"
                  density="compact"
                  color="info"
                  class="elevation-2 my-5 pt-2 pl-3 rounded"
                  variant="plain"
                  :disabled="!!cb"
                  :items="props.tokenData.accounts"
                  item-title="name"
                  item-value="_id"
                  label="Select Account"
                  name="account"
                  />

                  <div v-if="props.tokenData.accounts && props.formData.btnText === 'Sign in' ">
                    <v-btn v-if="!cb" color="info" @click="cb='signIn'" >Continue</v-btn>
                    <div v-if="cb">
                    <v-text-field hide-details
                      density="compact"
                    class=" elevation-2 my-5 pt-2 pl-3 rounded"
                      color="info"
                      variant="plain"
                      placeholder="*********"
                      name="password"
                      label="Password"
                      v-model="data.password"
                      type="password"
                      required />
                      <p class="mt-4 pa-4">Forget your password? <router-link style="text-decoration: none; color: inherit;" class="font-weight-bold" :to="`/forgot-password?token=${route.query.token}`">Reset it here.</router-link>
                      </p>
                        <v-btn color="info" @click="$emit('handleLoginHandler', data )" >{{props.formData.btnText}}</v-btn>
                        <button hidden @click.enter.prevent="$emit('handleLoginHandler', data )" />
                      </div>
                    </div>

                    <div v-if="props.tokenData.account">
                      <v-btn v-if="!cb" color="info" @click="cb=true" >Continue</v-btn>
                      <div v-if="cb">
                      <v-text-field hide-details
                        density="compact"
                      class=" elevation-2 my-5 pt-2 pl-3 rounded"
                        color="info"
                        variant="plain"
                        placeholder="*********"
                        name="password"
                        label="New Password"
                        v-model="data.password"
                        type="password"
                        required />
                        <v-text-field hide-details
                          density="compact"
                        class=" elevation-2 my-5 pt-2 pl-3 rounded"
                          color="info"
                          variant="plain"
                          placeholder="*********"
                          name="confirmPassword"
                          label="Confirm New Password"
                          v-model="data.confirmPassword"
                          type="password"
                          required />
                          <v-checkbox
                             label="I am human."
                             color="info"
                             value="I am human"
                             hide-details
                           ></v-checkbox>
                          <v-btn color="info" @click="$emit('handleForgotPasswordResetHandler', data )" >{{props.formData.btnText}}</v-btn>
                          <button hidden @click.enter.prevent="$emit('handleForgotPasswordResetHandler', data )" />
                        </div>
                      </div>

               <div v-if="props.tokenData.accounts && !props.tokenData.account && props.formData.btnText === 'Reset Password'">
                   <div v-if="cb !== 'reset'">
                   <v-checkbox
                      label="I am human."
                      color="info"
                      value="I am human"
                      hide-details
                    ></v-checkbox>
                     <v-btn color="info" @click="$emit('handleForgotPasswordHandler', data, (res)=>{cb=res})" >{{props.formData.btnText}}</v-btn>
                     <button hidden @click.enter.prevent="$emit('handleForgotPasswordHandler', data, (res)=>{cb=res})" />
                   </div>
                   <p v-if="cb === 'reset'" class="mt-4">To continue resetting your password, please check your inbox and click the link we sent you.</p>
                 </div>

              <div  v-if="!props.tokenData.accounts">
              <div v-if="!cb">
              <v-btn color="info" @click="$emit('handleGetLoginAccountsHandler', data.email, (res)=>{cb=res})" >{{props.formData.btnText}}</v-btn>
              <p class="mt-4 pa-4">
               Don't have account? <router-link style="text-decoration: none; color: inherit;" class="font-weight-bold" to="/create-account">Create new account.</router-link>
              </p>
            </div>
              <p v-else class="mt-4">To continue logging in, please check your inbox and click the link we sent you.</p>
              <button hidden @click.enter.prevent="$emit('handleGetLoginAccountsHandler', data.email, (res)=>{cb=res})" />
              </div>

            </v-card-text>

            </v-card>
        </v-form>
</template>
