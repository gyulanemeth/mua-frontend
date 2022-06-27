<script setup >
import { ref } from 'vue'
import stores from '../stores/index.js'


</script>

<template>
  <v-container>
      <v-layout >
  </v-layout>
  </v-container>
  <v-container>
    <v-row class="text-center" justify="center">
        <v-col cols="6">
          <v-col>
            <h1>Account Details</h1>
          </v-col>
          <v-card  >
            <v-card-title>
              Account Name
            <v-card-subtitle>
              -  Account Url Friendly Name
            </v-card-subtitle >
          </v-card-title>
            <v-card-actions>
              <v-btn color="primary" to="/patchAccountName">Update Name</v-btn>
              <v-btn color="primary" to="/patchUrlFriendlyName" >Update Url Friendly Name</v-btn>
            </v-card-actions>
          </v-card>
      </v-col>
    </v-row >
  </v-container>
</template>
