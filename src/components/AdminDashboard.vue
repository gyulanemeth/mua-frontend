<script setup>
import { ref, watch } from 'vue'
import { useStatsStore } from '../stores/index.js'
import { useI18n } from 'vue-i18n'
import VueApexCharts from 'vue3-apexcharts'

const { t } = useI18n()
const statsStore = useStatsStore()

const accounts = ref(await statsStore.getAccountsStats({ limit: 'unlimited', sort: { createdAt: 1 } }))
const users = ref(await statsStore.getUsersStats({ limit: 'unlimited', sort: { createdAt: 1 } }))
const accountsSelectedGrouping = ref('monthly')
const usersSelectedGrouping = ref('monthly')
const usersLoading = ref(false)
const accountsLoading = ref(false)
const accountsSeries = ref()
const usersSeries = ref()

const appIcon = import.meta.env.BASE_URL + 'bluefoxemail-logo.png'

const groupedAccountByMonth = {
  daily: {},
  weekly: {},
  monthly: {}
}
const groupedUsersByMonth = {
  daily: {},
  weekly: {},
  monthly: {}
}
const groupedDeletedAccountByMonth = {
  daily: {},
  weekly: {},
  monthly: {}
}
const groupedDeletedUsersByMonth = {
  daily: {},
  weekly: {},
  monthly: {}
}

const getDateGroup = (dateStr, basis) => {
  const date = new Date(dateStr)
  switch (basis) {
    case 'daily':
      return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`
    case 'weekly': {
      const startOfWeek = new Date(date)
      const day = startOfWeek.getDay()
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1)
      startOfWeek.setDate(diff)
      return `${startOfWeek.getFullYear()}-${('0' + (startOfWeek.getMonth() + 1)).slice(-2)}-W${Math.ceil(diff / 7)}`
    }
    case 'monthly':
    default:
      return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}`
  }
}

const groupUsersBy = (basis) => {
  users.value.items.forEach(item => {
    const groupKey = getDateGroup(item.createdAt, basis)
    if (item.createdAt && !item.deleted) {
      groupedUsersByMonth[basis][groupKey] = (groupedUsersByMonth[basis][groupKey] || 0) + 1
    } else if (item.deleted) {
      groupedDeletedUsersByMonth[basis][groupKey] = (groupedDeletedUsersByMonth[basis][groupKey] || 0) + 1
    }
  })
}

const groupAccountsBy = (basis) => {
  accounts.value.items.forEach(item => {
    const groupKey = getDateGroup(item.createdAt, basis)
    if (item.createdAt && !item.deleted) {
      groupedAccountByMonth[basis][groupKey] = (groupedAccountByMonth[basis][groupKey] || 0) + 1
    } else if (item.deleted) {
      groupedDeletedAccountByMonth[basis][groupKey] = (groupedDeletedAccountByMonth[basis][groupKey] || 0) + 1
    }
  })
}

const createMonthlySeries = (data, months, negative) => {
  return months.map(month => ({
    x: month,
    y: (negative ? -data[month] : data[month]) || 0
  }))
}

const createCumulativeSeries = (data, months, negative) => {
  let cumulativeTotal = 0
  return months.map(month => {
    cumulativeTotal += data[month] || 0
    return {
      x: month,
      y: negative ? -cumulativeTotal : cumulativeTotal
    }
  })
}

const createUsersSeries = (basis) => {
  const months = [
    ...new Set([
      ...Object.keys(groupedUsersByMonth[basis]),
      ...Object.keys(groupedDeletedUsersByMonth[basis])
    ])
  ].sort()

  return [
    {
      name: t('mua.adminDashboard.chart.accumulatedUsersLabel'),
      data: createCumulativeSeries(groupedUsersByMonth[basis], months),
      color: '#0859B3'
    },
    {
      name: t('mua.adminDashboard.chart.usersLabel'),
      data: createMonthlySeries(groupedUsersByMonth[basis], months),
      color: '#10B1EF'
    },
    {
      name: t('mua.adminDashboard.chart.deletedAccumulatedUsersLabel'),
      data: createCumulativeSeries(groupedDeletedUsersByMonth[basis], months, true),
      color: '#B71C1C'
    },
    {
      name: t('mua.adminDashboard.chart.deletedUsersLabel'),
      data: createMonthlySeries(groupedDeletedUsersByMonth[basis], months, true),
      color: '#E57373'
    }
  ]
}

const createAccountsSeries = (basis) => {
  const months = [
    ...new Set([
      ...Object.keys(groupedAccountByMonth[basis]),
      ...Object.keys(groupedDeletedAccountByMonth[basis])
    ])
  ].sort()

  return [
    {
      name: t('mua.adminDashboard.chart.accumulatedAccountsLabel'),
      data: createCumulativeSeries(groupedAccountByMonth[basis], months),
      color: '#0859B3'
    },
    {
      name: t('mua.adminDashboard.chart.accountsLabel'),
      data: createMonthlySeries(groupedAccountByMonth[basis], months),
      color: '#10B1EF'
    },
    {
      name: t('mua.adminDashboard.chart.deletedAccumulatedUsersLabel'),
      data: createCumulativeSeries(groupedDeletedAccountByMonth[basis], months, true),
      color: '#B71C1C'
    },
    {
      name: t('mua.adminDashboard.chart.deletedAccountsLabel'),
      data: createMonthlySeries(groupedDeletedAccountByMonth[basis], months, true),
      color: '#E57373'
    }
  ]
}

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
          const parts = value.split('-')
          return parts.length === 3 ? `${parts[0]}-${parts[1]}-${parts[2]}` : value
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

watch(accountsSelectedGrouping, async (newBasis) => {
  accountsLoading.value = true
  groupAccountsBy(newBasis)
  accountsSeries.value = createAccountsSeries(newBasis)
  await new Promise(resolve => setTimeout(resolve, 1000))
  accountsLoading.value = false
}, { immediate: true })

watch(usersSelectedGrouping, async (newBasis) => {
  usersLoading.value = true
  groupUsersBy(newBasis)
  usersSeries.value = createUsersSeries(newBasis)
  await new Promise(resolve => setTimeout(resolve, 1000))
  usersLoading.value = false
}, { immediate: true })

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
        <v-col class="mt-4 ml-4 my-3 ">
          <v-row>
            <v-chip variant="elevated" @click="accountsSelectedGrouping = 'monthly'"
              :color="accountsSelectedGrouping === 'monthly' ? 'info' : 'grey'" class="mr-2">{{
                $t('mua.adminDashboard.monthlyBasisBtn') }}</v-chip>
            <v-chip variant="elevated" @click="accountsSelectedGrouping = 'weekly'"
              :color="accountsSelectedGrouping === 'weekly' ? 'info' : 'grey'" class="mr-2">{{
                $t('mua.adminDashboard.weeklyBasisBtn') }}</v-chip>
            <v-chip variant="elevated" @click="accountsSelectedGrouping = 'daily'"
              :color="accountsSelectedGrouping === 'daily' ? 'info' : 'grey'" class="mr-2">{{
                $t('mua.adminDashboard.dailyBasisBtn') }}</v-chip>
          </v-row>
        </v-col>
        <v-layout v-if="accountsLoading" class="ma-auto d-flex flex-wrap pa-4">
          <v-card class="ma-auto align-self-start d-flex elevation-0 text-center" min-height="400" min-width="400">
            <div class="ma-auto">
              <v-progress-circular color="info" indeterminate :size="100" :width="5">
                <v-avatar size="50">
                  <v-img :src="appIcon" cover></v-img>
                </v-avatar>
              </v-progress-circular>
              <p class="mt-3 text-body-2 font-weight-bold">{{ $t('loading') }}</p>
            </div>
          </v-card>
        </v-layout>
        <v-card v-else-if="accountsSeries" class="text-center w-100 align-center elevation-0 justify-center">
          <VueApexCharts height="400" type="bar" :options="options" :series="accountsSeries"></VueApexCharts>
        </v-card>
        <p class="text-start text-h5 my-10 ml-4  font-weight-bold">{{ $t('mua.adminDashboard.chart.headerChart2') }}</p>
        <v-col class="mt-4 ml-4 my-3 ">
          <v-row>
            <v-chip variant="elevated" @click="usersSelectedGrouping = 'monthly'"
              :color="usersSelectedGrouping === 'monthly' ? 'info' : 'grey'" class="mr-2">{{
                $t('mua.adminDashboard.monthlyBasisBtn') }}</v-chip>
            <v-chip variant="elevated" @click="usersSelectedGrouping = 'weekly'"
              :color="usersSelectedGrouping === 'weekly' ? 'info' : 'grey'" class="mr-2">{{
                $t('mua.adminDashboard.weeklyBasisBtn') }}</v-chip>
            <v-chip variant="elevated" @click="usersSelectedGrouping = 'daily'"
              :color="usersSelectedGrouping === 'daily' ? 'info' : 'grey'" class="mr-2">{{
                $t('mua.adminDashboard.dailyBasisBtn') }}</v-chip>
          </v-row>
        </v-col>
        <v-layout v-if="usersLoading" class="ma-auto d-flex flex-wrap pa-4">
          <v-card class="ma-auto align-self-start d-flex elevation-0 text-center" min-height="400" min-width="400">
            <div class="ma-auto">
              <v-progress-circular color="info" indeterminate :size="100" :width="5">
                <v-avatar size="50">
                  <v-img :src="appIcon" cover></v-img>
                </v-avatar>
              </v-progress-circular>
              <p class="mt-3 text-body-2 font-weight-bold">{{ $t('loading') }}</p>
            </div>
          </v-card>
        </v-layout>
        <v-card v-else-if="usersSeries" class="text-center w-100 align-center elevation-0 justify-center">
          <VueApexCharts height="400" type="bar" :options="options" :series="usersSeries"></VueApexCharts>
        </v-card>
      </v-card>
      <v-card flat :width="$vuetify.display.mdAndUp ? '70%' : '100%'">
        <slot />
      </v-card>
    </v-layout>
  </div>
</template>
