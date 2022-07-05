<script setup>

import { ref } from 'vue'

const props = defineProps({
  items: Array,
  roles: Array
})

const filter = ref('')
const radioGroup = ref(false)
const show = ref(false)

function expande (id) {
  radioGroup.value = false
  show.value = show.value === id ? false : id
}

</script>

<template>

<v-container>
  <v-layout class="d-flex flex-wrap">

  <v-text-field class="my-2 ml-4"
  variant="outlined"
  label="Prepend inner"
   prepend-icon="mdi-magnify"
  v-model.lazy="filter"
    color="primary"
  @change="$emit('searchEvent',filter)"

  ></v-text-field>

  <v-btn class="py-7 my-2 ml-4"
  variant="outlined"
  color="primary"
  to="/invitation"
  >
  Invite User
</v-btn>
</v-layout>
    <v-layout class="d-flex flex-wrap">
      <v-card class="mx-2 my-5 pa-2 align-self-start " min-width="275"  v-for="item in props.items" :key="item._id" >
        <v-img
          src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
          height="150px"
          cover
        ></v-img>
        <v-card-title>
        {{item.data.name}}
        <v-card-subtitle>
          - {{item.status}}
        </v-card-subtitle >
      </v-card-title>
        <v-card-actions>
          <v-btn
            color="red-lighten-2"
            variant="text"
            @click="$emit('buttonEvent',{id:item._id,operation: 'delete'})"
          >
            Delete
          </v-btn>
          <v-spacer></v-spacer>
                <v-btn
                  :icon="show === item._id? 'mdi-chevron-up' : 'mdi-chevron-down'"
                  @click="expande(item._id)"
                ></v-btn>
              </v-card-actions>
              <v-expand-transition v-if="show === item._id">
                <div >
                  <v-divider></v-divider>
                  <v-radio-group inline v-model="radioGroup">
                    <v-radio
                    v-for="data in props.roles"
                    :key="data+item._id"
                    :disabled = "item.data.role === data"
                    :label="data"
                    :value="data"
                    ></v-radio>
                  </v-radio-group>

                  <v-btn
                  color="primary"
                  variant="text"
                  @click="radioGroup && $emit('buttonEvent',{id: item._id, role: radioGroup, operation: 'updateRole'})"
                  >
                  Change Role
                </v-btn>
                </div>
              </v-expand-transition>
      </v-card>
</v-layout>
</v-container>
</template>
