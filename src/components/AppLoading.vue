<script setup>
const appName = import.meta.env.VITE_APP_NAME
const appIcon = import.meta.env.BASE_URL + 'bluefoxemail-logo.png'

</script>

<template>
    <div class="d-flex flex-column justify-center align-center text-center h-screen">
            <v-progress-circular indeterminate :size="300" :width="10" color="primary">

                <v-avatar size="100">
                    <v-img :src="appIcon" cover></v-img>
                </v-avatar>

            </v-progress-circular>
            <span class="text-h4 mt-10 "> {{ appName }} </span>
        </div>
</template>
