<script setup>
import { defineComponent, watchEffect, ref } from 'vue'
import MeDetails from '../components/MeDetails.vue'
import UpdatePassword from '../components/UpdatePassword.vue'
import EmailAndNameForm from '../components/EmailAndNameForm.vue'
import stores from '../stores/index.js'
import { useRoute, useRouter } from 'vue-router';
const route = useRoute()
const router = useRouter()
const formData = ref()
const store = stores().currentUserAndAccountStore()
async function loadData(){
  if(route.name === "patchUserName"){
    formData.value = {inputType:"text", inputText:"New Name", text:"Update Name"}
  }
}

async function eventHandler(data){
  var res
  if(formData.value.text === "Update Name"){
   res = await store.patchName(data)
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
  <EmailAndNameForm v-if="route.name === 'patchUserName'" :formData="formData" @buttonEvent="eventHandler" />
  <UpdatePassword v-else-if="route.name === 'patchPassword'"  />
  <MeDetails v-else />

</template>
