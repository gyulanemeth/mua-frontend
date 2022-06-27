<script setup>
import { defineComponent, watchEffect, ref } from 'vue'
import AccountDetails from '../components/AccountDetails.vue'
import UpdatePassword from '../components/UpdatePassword.vue'
import EmailAndNameForm from '../components/EmailAndNameForm.vue'
import stores from '../stores/index.js'
import { useRoute, useRouter } from 'vue-router';
const route = useRoute()
const router = useRouter()
const formData = ref()
const store = stores().currentUserAndAccountStore()
async function loadData(){
  if(route.name === "patchAccountName"){
    formData.value = {inputType:"text", inputText:"New Name", text:"Update Name"}
  }
  if(route.name === "patchUrlFriendlyName"){
    formData.value = {inputType:"text", inputText:"New Url Friendly Name", text:"Update Url Friendly Name"}
  }
}

async function eventHandler(data){
  var res
  if(formData.value.text === "Update Name"){
   res = await store.patchName(data)
 }
 else if(formData.value.text === "Update Url Friendly Name"){
  res = await store.patchUrlFriendlyName(data)
}
  if(res === 'success'){
    router.push('/')
  }
}


watchEffect(async () => {
  loadData()
})
</script>


<template>
  <EmailAndNameForm v-if="route.name === 'patchAccountName'" :formData="formData" @buttonEvent="eventHandler" />
  <EmailAndNameForm v-else-if="route.name === 'patchUrlFriendlyName'" :formData="formData" @buttonEvent="eventHandler" />
  <AccountDetails v-else />

</template>
