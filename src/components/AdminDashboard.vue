<script setup>
import { ref } from 'vue'
import { useStatsStore } from '../stores/index.js'
import { useI18n } from 'vue-i18n'
import VueApexCharts from 'vue3-apexcharts'

const { t } = useI18n()
const statsStore = useStatsStore()

const accounts = ref(await statsStore.getAccountsStats({ limit: 'unlimited', sort: { createdAt: 1 } }))
const users = ref(await statsStore.getUsersStats({ limit: 'unlimited', sort: { createdAt: 1 } }))
const groupedAccountByDate = {}
const groupedUsersByDate = {}

accounts.value.items.forEach(item => {
  if (item.createdAt) {
    const date = item.createdAt.split('T')[0] // Format: YYYY-MM-DD
    groupedAccountByDate[date] = (groupedAccountByDate[date] || 0) + 1
  }
})
users.value.items.forEach(item => {
  if (item.createdAt) {
    const date = item.createdAt.split('T')[0] // Format: YYYY-MM-DD
    groupedUsersByDate[date] = (groupedUsersByDate[date] || 0) + 1
  }
})

const dates = [
  ...Object.keys(groupedAccountByDate),
  ...Object.keys(groupedUsersByDate)
]
const minDate = new Date(Math.min(...dates.map(date => new Date(date).getTime())))
const todayDate = new Date()

const createSeries = (data) => {
  const seriesData = []
  let currentDate = new Date(minDate)
  while (currentDate <= todayDate) {
    const dateStr = currentDate.toISOString().split('T')[0]
    seriesData.push({
      x: dateStr,
      y: data[dateStr] || 0
    })
    currentDate = new Date(currentDate)
    currentDate.setDate(currentDate.getDate() + 1)
  }
  return seriesData
}

const seriesData = createSeries(groupedAccountByDate)
const seriesUsersData = createSeries(groupedUsersByDate)

const series = [{
  name: t('mua.adminDashboard.chart.accountsLabel'),
  data: seriesData
}, {
  name: t('mua.adminDashboard.chart.usersLabel'),
  data: seriesUsersData
}]

const interval = 10
const options = {
  colors: ['#00BFA5', '#10B1EF'],
  chart: {
    type: 'line',
    zoom: {
      enabled: false
    }
  },
  xaxis: {
    type: 'datetime',
    labels: {
      formatter: function (value) {
        const date = new Date(value)
        return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`
      }
    },
    tickAmount: Math.ceil((todayDate - minDate) / (interval * 24 * 60 * 60 * 1000)) + 1
  }
}
</script>

<template>
  <div class="mx-3">
    <v-layout :class="`d-flex flex-wrap`">
      <v-card flat :width="$vuetify.display.mdAndUp? '70%':'100%'">
        <p class="text-start text-h5 mt-4 ml-4 font-weight-bold"> {{ $t('mua.adminDashboard.mainHeader') }}</p>

        <v-card-text class="text-center align-center">
          <v-row class=" my-5 mx-0">
            <v-col class="border border-thin rounded-s-lg">
              <p>{{ $t('mua.adminDashboard.accountsOverAllLabel') }}</p>
              <p class="text-h1">{{ accounts.count }}</p>
            </v-col>
            <v-col class="border border-thin rounded-e-lg">
              <p>{{ $t('mua.adminDashboard.usersOverAllLabel') }}</p>
              <p class="text-h1">{{ users.count }}</p>
            </v-col>
          </v-row>
        </v-card-text>
        <p class="text-start text-h5 my-4 ml-4  font-weight-bold">{{ $t('mua.adminDashboard.chart.header') }}</p>

        <v-card class="text-center w-100 align-center justify-center">
          <VueApexCharts height="400" type="line" :options="options" :series="series"></VueApexCharts>
        </v-card>
      </v-card>
      <slot />
    </v-layout>
  </div>
</template>
