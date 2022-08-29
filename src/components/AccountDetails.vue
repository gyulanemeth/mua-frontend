<script setup >
import { ref } from 'vue'

const props = defineProps({
  name: String,
  urlFriendlyName: String
})

const name = ref(props.name)
const urlFriendlyName = ref(props.urlFriendlyName)

const editemood = ref()

</script>

<template>

         <v-layout class="d-flex flex-wrap ml-5 w-50">
           <v-col class="pt-3">
           <h3 class="font-weight-bold">{{props.name}}</h3>
           <v-divider />

           <v-row align="center" class="mt-3">
               <v-col>
                   <p class="font-weight-bold">Name</p>
               </v-col>
                 <v-text-field  hide-details density="compact" :disabled='editemood !== "name"'  color="info" variant="underlined" :placeholder="props.name" name="name" v-model="name" type="text" required />
                 <template v-if='editemood === "name"'>
                          <v-btn color="info" variant="text" icon="mdi-check" size="small" @click.stop="$emit('updateNameHandler', name);editemood = false" />
                          <v-btn class="ml-2" color="error" variant="text" icon="mdi-window-close" size="small"  @click='editemood = false' />
                  </template>
                  <template v-else>
                    <v-btn color="info" variant="text" class="ma-2"  icon="mdi-pencil-outline" size="small" @click='editemood = "name"'  />
                  </template>

             </v-row>
             <v-row align="center" class="mt-3">
                 <v-col>
                     <p class="font-weight-bold">urlFriendlyName</p>
                 </v-col>
                   <v-text-field  hide-details density="compact" :disabled='editemood !== "urlFriendlyName"'  color="info" variant="underlined" :placeholder="props.urlFriendlyName" name="urlFriendlyName" v-model="urlFriendlyName" type="text" required />
                   <template v-if='editemood === "urlFriendlyName"'>
                            <v-btn color="info" variant="text" icon="mdi-check" size="small" @click.stop="$emit('updateUrlFriendlyNameHandler', urlFriendlyName);editemood = false" />
                            <v-btn class="ml-2" color="error" variant="text" icon="mdi-window-close" size="small"  @click='editemood = false' />
                    </template>
                    <template v-else>
                      <v-btn color="info" variant="text" class="ma-2"  icon="mdi-pencil-outline" size="small" @click='editemood = "urlFriendlyName"'  />
                    </template>

               </v-row>

             </v-col >

         </v-layout>
</template>
