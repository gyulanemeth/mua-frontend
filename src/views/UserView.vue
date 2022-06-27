<script setup>
import { defineComponent, watchEffect, ref } from 'vue'
import List from '../components/List.vue'
import stores from '../stores/index.js'
import { useRoute } from 'vue-router';
const route = useRoute()
const data = ref()
const btn = ref()
var store
async function loadData(){
    store = stores().usersStore()
    store.params= store.account._id
    await store.load()
    data.value = store.items
    btn.value = {text:"Delete", color:"red-lighten-2"}
  }

async function eventHandler(id){
  store.deleteOne(id)
}

async function searchBarHandler(filter){
  if(filter === ""){
    store.filter = {}
  }else{
    store.filter = {$text : {$search:`"\" ${filter} "\"`}}
  }
  await store.load()
  data.value = store.items
}

watchEffect(async () => {
  loadData()
})
</script>


<template>
  <List :items="data" :btn="btn" @buttonEvent="eventHandler" @searchEvent="searchBarHandler" />
</template>
