<script setup>
import { ref } from 'vue'

const props = defineProps({
  data: Object,
  roles: Array
})

const role = ref(props.data.role)
const dialog = ref()

</script>

<template>
<v-dialog v-model="dialog" persistent>
    <template v-slot:activator="{ props }">
          <v-btn color="info" class="text-white"  v-bind="props" >View profile</v-btn>

    </template>
    <v-card min-width="600" class="d-flex flex-column justify-center">

        <v-card-text align="start">
          <v-col align="center" class="pb-10">
            <v-toolbar-title class="font-weight-bold">{{props.data.name}}</v-toolbar-title>
          </v-col>

          <v-row align="center" class="pb-10"  >
          <h3 class="font-weight-bold">Account Overview</h3>
          <v-divider />
        </v-row >

        <v-row align="center" >
            <v-col>
                <p class="font-weight-bold">Name</p>
            </v-col>
          <v-col cols="7">
              <v-text-field  hide-details density="compact" color="info" disabled class=" elevation-2 my-5 pt-2 pl-3 rounded" variant="plain" :placeholder="props.data.name" name="name" :value="props.data.name" type="text" required />
            </v-col>

          </v-row>

          <v-row align="center" >
              <v-col>
                  <p class="font-weight-bold">E-mail</p>
              </v-col>
                <v-col cols="7">
                <v-text-field  hide-details density="compact" color="info" disabled class=" elevation-2 my-5 pt-2 pl-3 rounded" variant="plain" :placeholder="props.data.email" name="email" :value="props.data.email" type="text" required />
              </v-col>

            </v-row>

            <v-row align="center" >
                <v-col>
                    <p class="font-weight-bold">Role</p>
                </v-col>
                <v-col cols="7">
                <v-select
                  hide-details
                  v-model="role"
                  density="compact"
                  color="info"
                  class="elevation-2 my-5 pt-2 pl-3 rounded"
                  variant="plain"
                  :items="props.roles"
                  name="role"
                  />
                </v-col>
              </v-row>

          <v-row align="center">
            <v-col  >
            <p class="font-weight-bold">Profile picture</p>
          </v-col >
            <v-col align="center" >
            <v-avatar class="elevation-3 " size="180" >
              <v-img
              src="https://selective.agency/wp-content/uploads/2018/02/placeholder-600x300.jpg"
               class="align-self-stretch"
              cover/>
            </v-avatar>
          </v-col>
          </v-row>

        </v-card-text>
        <v-card-actions>
          <v-btn color="info" @click="$emit('updateRoleEventHandler',{id:props.data._id, role});dialog=false">Save changes</v-btn>
          <v-spacer />
            <v-btn color="info" @click="dialog=false; password=null">close</v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>

</template>
