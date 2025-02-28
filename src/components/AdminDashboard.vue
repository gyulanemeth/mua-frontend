<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import VueApexCharts from 'vue3-apexcharts'
import { DatePicker } from 'v-calendar'
import 'v-calendar/style.css'
import { useStatsStore } from '../stores/index.js'
import useSystemMessagesStore from '../stores/systemMessages.js'

const { t } = useI18n()
const statsStore = useStatsStore()

const overall = ref(await statsStore.getOverallStats())
const accountStats = ref(await statsStore.getAccountsStats({ filter: { type: 'daily' } }))
const userStats = ref(await statsStore.getUsersStats({ filter: { type: 'daily' } }))

const accountdateRange = ref({
  start: new Date(new Date().setMonth(new Date().getUTCMonth() - 1)),
  end: new Date()
})

const accountSelectedGrouping = ref('daily')
const accountSeries = ref()
const accountLoading = ref()
const accountChartTypeLine = ref(false)
const accumulatedAccountChart = ref(false)
const accountTimeZone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone)
let isAccountResettingValue = false

const userdateRange = ref({
  start: new Date(new Date().setMonth(new Date().getUTCMonth() - 1)),
  end: new Date()
})

const userSelectedGrouping = ref('daily')
const userSeries = ref()
const userLoading = ref()
const userChartTypeLine = ref(false)
const accumulatedUserChart = ref(false)
const userTimeZone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone)

let isUserResettingValue = false

async function accountStatsFilter () {
  accountLoading.value = true
  accountStats.value = await statsStore.getAccountsStats({ filter: { timeZone: accountTimeZone.value, type: accountSelectedGrouping.value, startDate: accountdateRange.value.start, endDate: accountdateRange.value.end } })
  accountLoading.value = false
}

async function userStatsFilter () {
  userLoading.value = true
  userStats.value = await statsStore.getUsersStats({ filter: { timeZone: userTimeZone.value, type: userSelectedGrouping.value, startDate: userdateRange.value.start, endDate: userdateRange.value.end } })
  userLoading.value = false
}

const createSeries = (list, value, type, date) => {
  const startDate = new Date(date.start).setUTCHours(0, 0, 0, 0)
  const endDate = new Date(date.end).setUTCHours(23, 59, 59, 59)
  const data = fillMissingDates(Object.entries(list).map(([x, val]) => ({ x, y: val[value] })), new Date(startDate), new Date(endDate), type)
  return data
}
const createCumulativeSeries = (list, value, type, date) => {
  const startDate = new Date(date.start).setUTCHours(0, 0, 0, 0)
  const endDate = new Date(date.end).setUTCHours(23, 59, 59, 59)
  const data = fillMissingDates(Object.entries(list).map(([x, val]) => ({ x, y: val[value] })), new Date(startDate), new Date(endDate), type, true)
  return data
}

const createAccountSeries = () => {
  return [
    {
      statsType: 'accumulated',
      name: t('mua.adminDashboard.chart.accumulatedAccountsLabel'),
      data: createCumulativeSeries(accountStats.value, 'accumulatedAccounts', accountSelectedGrouping.value, accountdateRange.value),
      group: 'activeAccounts',
      color: '#0859B3'
    },
    {
      name: t('mua.adminDashboard.chart.accountsLabel'),
      data: createSeries(accountStats.value, 'accounts', accountSelectedGrouping.value, accountdateRange.value),
      group: 'activeAccounts',
      color: '#10B1EF'
    },
    {
      statsType: 'accumulated',
      name: t('mua.adminDashboard.chart.deletedAccumulatedAccountsLabel'),
      data: createCumulativeSeries(accountStats.value, 'accumulatedDeletedAccounts', accountSelectedGrouping.value, accountdateRange.value),
      group: 'deletedAccounts',
      color: '#B71C1C'
    },
    {
      name: t('mua.adminDashboard.chart.deletedAccountsLabel'),
      data: createSeries(accountStats.value, 'deleted', accountSelectedGrouping.value, accountdateRange.value),
      group: 'deletedAccounts',
      color: '#E57373'
    }
  ]
}

const createUserSeries = () => {
  return [
    {
      statsType: 'accumulated',
      name: t('mua.adminDashboard.chart.accumulatedUsersLabel'),
      data: createCumulativeSeries(userStats.value, 'accumulatedUsers', userSelectedGrouping.value, userdateRange.value),
      group: 'activeUsers',
      color: '#0859B3'
    },
    {
      name: t('mua.adminDashboard.chart.usersLabel'),
      data: createSeries(userStats.value, 'users', userSelectedGrouping.value, userdateRange.value),
      group: 'activeUsers',
      color: '#10B1EF'
    },
    {
      statsType: 'accumulated',
      name: t('mua.adminDashboard.chart.deletedAccumulatedUsersLabel'),
      data: createCumulativeSeries(userStats.value, 'accumulatedSent', userSelectedGrouping.value, userdateRange.value),
      group: 'deletedUsers',
      color: '#B71C1C'
    },
    {
      name: t('mua.adminDashboard.chart.deletedUsersLabel'),
      data: createSeries(userStats.value, 'sent', userSelectedGrouping.value, userdateRange.value),
      group: 'deletedUsers',
      color: '#E57373'
    }
  ]
}

const chartOptions = ref({
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
      formatter: (value) => {
        if (value && typeof value === 'string') {
          const parts = value.split('-')
          return parts.length === 3 ? `${parts[0]}-${parts[1]}-${parts[2]}` : value
        }
        return ''
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

function fillMissingDates (data, startDate, endDate, interval = 'weekly', accumulated) {
  const dates = Object.fromEntries(data.map(item => [item.x, item.y]))
  const increment = {
    hourly: date => date.setUTCHours(date.getUTCHours() + 1),
    daily: date => date.setUTCDate(date.getUTCDate() + 1),
    weekly: date => date.setUTCDate(date.getUTCDate() + 7),
    monthly: date => date.setUTCMonth(date.getUTCMonth() + 1)
  }
  const result = []
  for (let d = new Date(startDate); d <= new Date(endDate); increment[interval](d)) {
    let x
    switch (interval) {
      case 'monthly':
        x = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
        break
      case 'daily':
        x = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
        break
      case 'weekly': {
        const start = new Date(d)
        start.setDate(start.getUTCDate() - start.getUTCDay())
        const end = new Date(d)
        end.setDate(end.getUTCDate() + (6 - end.getUTCDay()))
        x = `${start.getUTCFullYear()}-${String(start.getUTCMonth() + 1).padStart(2, '0')}-${String(start.getUTCDate()).padStart(2, '0')} to ${end.getUTCFullYear()}-${String(end.getUTCMonth() + 1).padStart(2, '0')}-${String(end.getUTCDate()).padStart(2, '0')}`
        break
      }
      case 'hourly':
        x = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')} ${String(d.getUTCHours()).padStart(2, '0')}:00`
        break
      default:
        x = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
    }
    const y = dates[x] ? dates[x] : accumulated ? result[result.length - 1] ? result[result.length - 1].y : 0 : 0
    result.push({ x, y })
  }
  return result
}

function checkDataRange (type, date) {
  const maxRange = type === 'hourly' ? 7 * 24 * 60 * 60 * 1000 : 365 * 24 * 60 * 60 * 1000
  const validRange = (date.end - date.start) <= maxRange
  if (validRange) {
    return true
  }
  useSystemMessagesStore().addError({ message: `Date range exceeds the maximum allowed: ${type === 'hourly' ? '7 days' : '12 months'}.` })
}

function getTimeZonesWithLocal () {
  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  // We use Etc/GMT+x to get UTC-x because city-based time zones change with daylight saving time, while Etc/GMT+x stays fixed and reliable.
  // https://stackoverflow.com/questions/7303580/understanding-the-etc-gmt-time-zone

  const timeZones = {
    'UTC-12': 'Etc/GMT+12',
    'UTC-11': 'Etc/GMT+11',
    'UTC-10': 'Etc/GMT+10',
    'UTC-9': 'Etc/GMT+9',
    'UTC-8': 'Etc/GMT+8',
    'UTC-7': 'Etc/GMT+7',
    'UTC-6': 'Etc/GMT+6',
    'UTC-5': 'Etc/GMT+5',
    'UTC-4': 'Etc/GMT+4',
    'UTC-3': 'Etc/GMT+3',
    'UTC-2': 'Etc/GMT+2',
    'UTC-1': 'Etc/GMT+1',
    'UTC+0': 'UTC',
    'UTC+1': 'Etc/GMT-1',
    'UTC+2': 'Etc/GMT-2',
    'UTC+3': 'Etc/GMT-3',
    'UTC+4': 'Etc/GMT-4',
    'UTC+5': 'Etc/GMT-5',
    'UTC+6': 'Etc/GMT-6',
    'UTC+7': 'Etc/GMT-7',
    'UTC+8': 'Etc/GMT-8',
    'UTC+9': 'Etc/GMT-9',
    'UTC+10': 'Etc/GMT-10',
    'UTC+11': 'Etc/GMT-11',
    'UTC+12': 'Etc/GMT-12'
  }

  // Get the user's local offset in hours
  const offsetMinutes = new Date().getTimezoneOffset()
  const offsetHours = -offsetMinutes / 60
  const utcKey = `UTC${offsetHours >= 0 ? '+' : ''}${offsetHours}`

  // Add the user's local timezone to the list
  const updatedTimeZones = {
    ...timeZones,
    [utcKey]: localTimeZone
  }
  return Object.entries(updatedTimeZones).map(([key, val]) => ({ name: key, value: val }))
}

watch(accountSelectedGrouping, (_, oldValue) => {
  if (isAccountResettingValue) {
    isAccountResettingValue = false
    return false
  }
  const validRange = checkDataRange(accountSelectedGrouping.value, accountdateRange.value)
  if (!validRange) {
    isAccountResettingValue = true
    accountSelectedGrouping.value = oldValue
    return false
  }
  accountStatsFilter({ type: accountSelectedGrouping.value, startDate: accountdateRange.value.start, endDate: accountdateRange.value.end })
})

watch(accountdateRange, () => {
  const validRange = checkDataRange(accountSelectedGrouping.value, accountdateRange.value)
  if (!validRange) {
    return false
  }
  accountStatsFilter({ type: accountSelectedGrouping.value, startDate: accountdateRange.value.start, endDate: accountdateRange.value.end })
})

watch(accountTimeZone, () => {
  accountStatsFilter({ type: accountSelectedGrouping.value, startDate: accountdateRange.value.start, endDate: accountdateRange.value.end })
})

watch(accountStats, () => {
  if (accountStats.value) {
    accountSeries.value = createAccountSeries()
  }
}, { immediate: true })

watch(userSelectedGrouping, (_, oldValue) => {
  if (isUserResettingValue) {
    isUserResettingValue = false
    return false
  }
  const validRange = checkDataRange(userSelectedGrouping.value, userdateRange.value)
  if (!validRange) {
    isUserResettingValue = true
    userSelectedGrouping.value = oldValue
    return false
  }
  userStatsFilter({ type: userSelectedGrouping.value, startDate: userdateRange.value.start, endDate: userdateRange.value.end })
})

watch(userdateRange, () => {
  const validRange = checkDataRange(userSelectedGrouping.value, userdateRange.value)
  if (!validRange) {
    return false
  }
  userStatsFilter({ type: userSelectedGrouping.value, startDate: userdateRange.value.start, endDate: userdateRange.value.end })
})

watch(userTimeZone, () => {
  userStatsFilter({ type: userSelectedGrouping.value, startDate: userdateRange.value.start, endDate: userdateRange.value.end })
})

watch(userStats, () => {
  if (userStats.value) {
    userSeries.value = createUserSeries()
  }
}, { immediate: true })

</script>

<template>
  <div class="mx-3">
    <v-layout :class="`d-flex flex-wrap`">
      <v-card flat :width="'100%'">
        <p class="text-start text-h5 mt-4 ml-4 font-weight-bold"> {{ $t('mua.adminDashboard.mainHeader') }}</p>
        <v-card-text class="text-center align-center">
          <v-row class=" my-5 mx-0">
            <v-col class="border border-thin rounded-s-lg">
              <p>{{ $t('mua.adminDashboard.accountsOverAllLabel') }}</p>
              <p class="text-h1">{{ overall.activeAccounts }}</p>
            </v-col>
            <v-col class="border border-thin rounded-e-lg">
              <p>{{ $t('mua.adminDashboard.usersOverAllLabel') }}</p>
              <p class="text-h1">{{ overall.activeUsers }}</p>
            </v-col>
          </v-row>
        </v-card-text>
        <p class="text-start text-h5 mt-10 ml-4  font-weight-bold">{{ $t('mua.adminDashboard.chart.headerChart1') }}</p>
        <div class="d-flex flex-wrap align-center justify-start text-center w-100 px-2">
          <DatePicker v-model="accountdateRange" :timezone="accountTimeZone" :popover="false"
            :disabled-dates="[{ start: new Date(Date.now() + 86400000), end: null }]" is-range>
            <template #default="{ togglePopover, inputValue, inputEvents }">
              <v-col cols="12" md="3" class="d-flex mt-2" @click="togglePopover">
                <v-col>
                  <v-row>
                    <p class="text-body-2">{{ $t('detailedStats.fromLabel') }}: </p>
                  </v-row>
                  <v-row>
                    <v-text-field hide-details variant="outlined" color="primary" base-color="primary"
                      :value="inputValue.start" v-on="inputEvents.start" />
                  </v-row>
                </v-col>
                <v-col cols="auto" class="d-flex flex-column align-center justify-center text-center mt-5">
                  <v-icon size="30">mdi-arrow-right-thin</v-icon>
                </v-col>
                <v-col>
                  <v-row>
                    <p class="text-body-2">{{ $t('detailedStats.toLabel') }}: </p>
                  </v-row>
                  <v-row>
                    <v-text-field hide-details variant="outlined" color="primary" base-color="primary"
                      :value="inputValue.end" v-on="inputEvents.end" />
                  </v-row>
                </v-col>
              </v-col>
            </template>
          </DatePicker>
          <v-col cols="12" md="auto" class="mx-1 mt-2">
            <v-row>
              <p class="text-body-2">{{ $t('detailedStats.timeZoneLabel') }}: </p>
            </v-row>
            <v-row>
              <v-select hide-details class="rounded" base-color="primary" color="primary" variant="outlined"
                v-model="accountTimeZone" :items="getTimeZonesWithLocal()" item-title="name" item-value="value" />
            </v-row>
          </v-col>
          <v-col cols="12" md="auto" class="mx-0 mt-2">
            <v-row>
              <p class="text-body-2">{{ $t('detailedStats.timeResolutionLabel') }}: </p>
            </v-row>
            <v-row>
              <v-select hide-details class="rounded" base-color="primary" color="primary" variant="outlined"
                item-title="name" item-value="value" v-model="accountSelectedGrouping"
                :items="[{ name: 'Monthly', value: 'monthly' }, { name: 'Weekly', value: 'weekly' }, { name: 'Daily', value: 'daily' }, { name: 'Hourly', value: 'hourly' }]" />
            </v-row>
          </v-col>
          <v-spacer />
          <v-btn-toggle class="mt-4" mandatory v-model="accountChartTypeLine" color="primary" rounded="xl" group>
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-chart-line" v-bind="props" variant="outlined" :value="true" />
              </template>
              <span>{{ $t('detailedStats.switchToLineChartLabel') }}</span>
            </v-tooltip>
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-chart-bar" v-bind="props" variant="outlined" :value="false" />
              </template>
              <span> {{ $t('detailedStats.switchToBarChartLabel') }}</span>
            </v-tooltip>
          </v-btn-toggle>
          <v-switch v-model="accumulatedAccountChart" color="primary" class="ml-4 mt-4 " :label="`Accumulated`"
            hide-details inset></v-switch>
        </div>
        <v-layout v-if="accountLoading" class="ma-auto d-flex flex-wrap pa-4">
          <v-card class="ma-auto align-self-start d-flex elevation-0 text-center" min-height="400" min-width="400">
            <div class="ma-auto">
              <v-progress-circular color="primary" indeterminate :size="100" :width="5">
                <v-avatar size="50">
                  <v-img :src="appIcon" cover></v-img>
                </v-avatar>
              </v-progress-circular>
              <p class="mt-3 text-body-2 font-weight-bold">{{ $t('loading') }}</p>
            </div>
          </v-card>
        </v-layout>
        <v-card v-else-if="accountSeries" class="text-center w-100 align-center justify-center elevation-0">
      <VueApexCharts height="400" :type="accountChartTypeLine ? 'line' : 'bar'" :options="chartOptions" :series="accountSeries.filter(ele => {
        if (accumulatedAccountChart && ele.statsType === 'accumulated') {
          return ele
        } else if (!accumulatedAccountChart && ele.statsType !== 'accumulated') {
          return ele
        }
      })"></VueApexCharts>
    </v-card>
        <p class="text-start text-h5 mt-10 ml-4  font-weight-bold">{{ $t('mua.adminDashboard.chart.headerChart2') }}</p>
        <div class="d-flex flex-wrap align-center justify-start text-center w-100 px-2">
          <DatePicker v-model="userdateRange" :timezone="userTimeZone" :popover="false"
            :disabled-dates="[{ start: new Date(Date.now() + 86400000), end: null }]" is-range>
            <template #default="{ togglePopover, inputValue, inputEvents }">
              <v-col cols="12" md="3" class="d-flex mt-2" @click="togglePopover">
                <v-col>
                  <v-row>
                    <p class="text-body-2">{{ $t('detailedStats.fromLabel') }}: </p>
                  </v-row>
                  <v-row>
                    <v-text-field hide-details variant="outlined" color="primary" base-color="primary"
                      :value="inputValue.start" v-on="inputEvents.start" />
                  </v-row>
                </v-col>
                <v-col cols="auto" class="d-flex flex-column align-center justify-center text-center mt-5">
                  <v-icon size="30">mdi-arrow-right-thin</v-icon>
                </v-col>
                <v-col>
                  <v-row>
                    <p class="text-body-2">{{ $t('detailedStats.toLabel') }}: </p>
                  </v-row>
                  <v-row>
                    <v-text-field hide-details variant="outlined" color="primary" base-color="primary"
                      :value="inputValue.end" v-on="inputEvents.end" />
                  </v-row>
                </v-col>
              </v-col>
            </template>
          </DatePicker>
          <v-col cols="12" md="auto" class="mx-1 mt-2">
            <v-row>
              <p class="text-body-2">{{ $t('detailedStats.timeZoneLabel') }}: </p>
            </v-row>
            <v-row>
              <v-select hide-details class="rounded" base-color="primary" color="primary" variant="outlined"
                v-model="userTimeZone" :items="getTimeZonesWithLocal()" item-title="name" item-value="value" />
            </v-row>
          </v-col>
          <v-col cols="12" md="auto" class="mx-0 mt-2">
            <v-row>
              <p class="text-body-2">{{ $t('detailedStats.timeResolutionLabel') }}: </p>
            </v-row>
            <v-row>
              <v-select hide-details class="rounded" base-color="primary" color="primary" variant="outlined"
                item-title="name" item-value="value" v-model="userSelectedGrouping"
                :items="[{ name: 'Monthly', value: 'monthly' }, { name: 'Weekly', value: 'weekly' }, { name: 'Daily', value: 'daily' }, { name: 'Hourly', value: 'hourly' }]" />
            </v-row>
          </v-col>
          <v-spacer />
          <v-btn-toggle class="mt-4" mandatory v-model="userChartTypeLine" color="primary" rounded="xl" group>
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-chart-line" v-bind="props" variant="outlined" :value="true" />
              </template>
              <span>{{ $t('detailedStats.switchToLineChartLabel') }}</span>
            </v-tooltip>
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-chart-bar" v-bind="props" variant="outlined" :value="false" />
              </template>
              <span> {{ $t('detailedStats.switchToBarChartLabel') }}</span>
            </v-tooltip>
          </v-btn-toggle>
          <v-switch v-model="accumulatedUserChart" color="primary" class="ml-4 mt-4 " :label="`Accumulated`"
            hide-details inset></v-switch>
        </div>
        <v-layout v-if="usersLoading" class="ma-auto d-flex flex-wrap pa-4">
          <v-card class="ma-auto align-self-start d-flex elevation-0 text-center" min-height="400" min-width="400">
            <div class="ma-auto">
              <v-progress-circular color="primary" indeterminate :size="100" :width="5">
                <v-avatar size="50">
                  <v-img :src="appIcon" cover></v-img>
                </v-avatar>
              </v-progress-circular>
              <p class="mt-3 text-body-2 font-weight-bold">{{ $t('loading') }}</p>
            </div>
          </v-card>
        </v-layout>
          <v-card v-else-if="userSeries" class="text-center w-100 align-center justify-center elevation-0">
      <VueApexCharts height="400" :type="userChartTypeLine ? 'line' : 'bar'" :options="chartOptions" :series="userSeries.filter(ele => {
        if (accumulatedUserChart && ele.statsType === 'accumulated') {
          return ele
        } else if (!accumulatedUserChart && ele.statsType !== 'accumulated') {
          return ele
        }
      })"></VueApexCharts>
        </v-card>
      </v-card>
      <v-card flat :width="'100%'">
        <CustomSystemStats />
      </v-card>
    </v-layout>
  </div>
</template>
