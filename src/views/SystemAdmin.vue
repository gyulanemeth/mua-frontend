<script setup>

</script>

<template>
  <v-layout style="z-index: 10;">
        <Suspense>
          <router-view class="w-100"></router-view>
        </Suspense>
  </v-layout>
</template>
