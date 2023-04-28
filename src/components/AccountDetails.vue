<script setup >
import { ref } from 'vue'

const props = defineProps({
  name: String,
  urlFriendlyName: String
})

const name = ref(props.name)
const urlFriendlyName = ref(props.urlFriendlyName)

const editMode = ref()

</script>

<template>

<v-container class="mx-6 pt-0">
  <v-layout class="d-flex flex-wrap w-50">
      <v-col class="pt-3">
          <h3 class="font-weight-bold">{{props.name}}</h3>
          <v-divider />

          <v-row align="center" class="mt-3">
              <v-col>
                  <p class="font-weight-bold">{{$t('accountDetails.nameLabel')}}</p>
              </v-col>
              <v-text-field hide-details density="compact" data-test-id="accountDetails-nameField" :disabled='editMode !== "name"' color="info" variant="underlined"
              name="name" type="text"
              :placeholder="name ||$t('accountDetails.namePlaceholder')"
              :value="name"
              @update:modelValue="res => name = res.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, '')"
              required />
              <template v-if='editMode === "name"'>
                  <v-btn color="info" variant="text" data-test-id="accountDetails-confirmNameEditBtn" icon="mdi-check" size="small" @click.stop="$emit('updateNameHandler', name);editMode = false" />
                  <v-btn class="ml-2" color="error" data-test-id="accountDetails-cancelmNameEditBtn" variant="text" icon="mdi-window-close" size="small" @click='editMode = false' />
              </template>
              <template v-else>
                  <v-btn color="info" variant="text" data-test-id="accountDetails-editNameBtn" class="ma-2" icon="mdi-pencil-outline" size="small" @click='editMode = "name"' />
              </template>

          </v-row>
          <v-row align="center" class="mt-3">
              <v-col>
                  <p class="font-weight-bold">{{$t('accountDetails.urlFriendlyNameLabel')}}</p>
              </v-col>
              <v-text-field hide-details data-test-id="accountDetails-urlFriendlyNameField" density="compact" :disabled='editMode !== "urlFriendlyName"' color="info" variant="underlined" name="urlFriendlyName"
              :placeholder="urlFriendlyName ||$t('accountDetails.urlFriendlyNamePlaceholder')"
              :value="urlFriendlyName"
              @update:modelValue="res => urlFriendlyName = res.replace(/[^a-z0-9/ \.,_-]/gim, '').replace(' ', '-').toLowerCase()"
              type="text" required />
              <template v-if='editMode === "urlFriendlyName"'>
                  <v-btn color="info" variant="text" data-test-id="accountDetails--confirmUrlFriendlyNameEdit" icon="mdi-check" size="small" @click.stop="$emit('updateUrlFriendlyNameHandler', urlFriendlyName);editMode = false" />
                  <v-btn class="ml-2" color="error"  data-test-id="accountDetails-cancelUrlFriendlyNameEdit" variant="text" icon="mdi-window-close" size="small" @click='editMode = false' />
              </template>
              <template v-else>
                  <v-btn color="info" variant="text" data-test-id="accountDetails-editUrlFriendlyNameBtn" class="ma-2" icon="mdi-pencil-outline" size="small" @click='editMode = "urlFriendlyName"' />
              </template>

          </v-row>

      </v-col>

  </v-layout>
</v-container>

</template>
