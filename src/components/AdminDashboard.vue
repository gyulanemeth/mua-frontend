<script setup>
import { ref } from 'vue'
import { useStatsStore } from '../stores/index.js'
import { useI18n } from 'vue-i18n'
import VueApexCharts from 'vue3-apexcharts'

const { t } = useI18n()
const statsStore = useStatsStore()

const accounts = ref(await statsStore.getAccountsStats({ limit: 'unlimited', sort: { createdAt: 1 } }))
const users = ref(await statsStore.getUsersStats({ limit: 'unlimited', sort: { createdAt: 1 } }))

const groupedAccountByMonth = {}
const groupedUsersByMonth = {}
const groupedDeletedAccountByMonth = {}
const groupedDeletedUsersByMonth = {}

const getMonthYear = (dateStr) => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}`
}

accounts.value.items.forEach(item => {
  if (item.createdAt && !item.deleted) {
    const month = getMonthYear(item.createdAt)
    groupedAccountByMonth[month] = (groupedAccountByMonth[month] || 0) + 1
  } else if (item.deleted) {
    const month = getMonthYear(item.updatedAt)
    groupedDeletedAccountByMonth[month] = (groupedDeletedAccountByMonth[month] || 0) + 1
  }
})

users.value.items.forEach(item => {
  if (item.createdAt && !item.deleted) {
    const month = getMonthYear(item.createdAt)
    groupedUsersByMonth[month] = (groupedUsersByMonth[month] || 0) + 1
  } else if (item.deleted) {
    const month = getMonthYear(item.updatedAt)
    groupedDeletedUsersByMonth[month] = (groupedDeletedUsersByMonth[month] || 0) + 1
  }
})

const months = [
  ...new Set([
    ...Object.keys(groupedAccountByMonth),
    ...Object.keys(groupedUsersByMonth),
    ...Object.keys(groupedDeletedAccountByMonth),
    ...Object.keys(groupedDeletedUsersByMonth)
  ])
].sort()

const createMonthlySeries = (data, deleted) => {
  return months.map(month => ({
    x: month,
    y: (deleted ? -data[month] : data[month]) || 0
  }))
}

const createCumulativeSeries = (data, deleted) => {
  let cumulativeTotal = 0
  return months.map(month => {
    cumulativeTotal += data[month] || 0
    return {
      x: month,
      y: deleted ? -cumulativeTotal : cumulativeTotal
    }
  })
}

const usersSeries = ref([
  {
    name: t('mua.adminDashboard.chart.accumulatedUsersLabel'),
    data: createCumulativeSeries(groupedUsersByMonth),
    color: '#0859B3'
  },
  {
    name: t('mua.adminDashboard.chart.usersLabel'),
    data: createMonthlySeries(groupedUsersByMonth),
    color: '#10B1EF'
  },
  {
    name: t('mua.adminDashboard.chart.deletedAccumulatedUsersLabel'),
    data: createCumulativeSeries(groupedDeletedUsersByMonth, true),
    color: '#B71C1C'
  },
  {
    name: t('mua.adminDashboard.chart.deletedUsersLabel'),
    data: createMonthlySeries(groupedDeletedUsersByMonth, true),
    color: '#E57373'
  }
])

const accountsSeries = ref([
  {
    name: t('mua.adminDashboard.chart.accumulatedAccountsLabel'),
    data: createCumulativeSeries(groupedAccountByMonth),
    color: '#0859B3'
  },
  {
    name: t('mua.adminDashboard.chart.accountsLabel'),
    data: createMonthlySeries(groupedAccountByMonth),
    color: '#10B1EF'
  },
  {
    name: t('mua.adminDashboard.chart.deletedAccumulatedUsersLabel'),
    data: createCumulativeSeries(groupedDeletedAccountByMonth, true),
    color: '#B71C1C'
  },
  {
    name: t('mua.adminDashboard.chart.deletedAccountsLabel'),
    data: createMonthlySeries(groupedDeletedAccountByMonth, true),
    color: '#E57373'
  }
])

// Chart options
const options = ref({
  chart: {
    type: 'bar',
    stacked: true,
    zoom: {
      enabled: false
    }
  },
  xaxis: {
    type: 'category',
    labels: {
      formatter: function (value) {
        if (value) {
          const [year, month] = value.split('-')
          return `${year}-${month}`
        }
      }
    }
  },
  plotOptions: {
    bar: {
      horizontal: false
    }
  },
  fill: {
    opacity: 1
  },
  legend: {
    position: 'top'
  }
})
</script>

<template>
  <div class="mx-3">
    <v-layout :class="`d-flex flex-wrap`">
      <v-card flat :width="$vuetify.display.mdAndUp ? '70%' : '100%'">
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
        <p class="text-start text-h5 my-4 ml-4  font-weight-bold">{{ $t('mua.adminDashboard.chart.headerChart1') }}</p>
        <v-card class="text-center w-100 align-center elevation-0 justify-center">
          <VueApexCharts height="400" type="bar" :options="options" :series="accountsSeries"></VueApexCharts>
        </v-card>
        <p class="text-start text-h5 my-10 ml-4  font-weight-bold">{{ $t('mua.adminDashboard.chart.headerChart2') }}</p>
        <v-card class="text-center w-100 align-center elevation-0 justify-center">
          <VueApexCharts height="400" type="bar" :options="options" :series="usersSeries"></VueApexCharts>
        </v-card>
      </v-card>
      <v-card flat :width="$vuetify.display.mdAndUp ? '70%' : '100%'">
        <slot />
      </v-card>
    </v-layout>
  </div>
</template>
