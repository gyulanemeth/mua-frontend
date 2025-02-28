import {
  createGetConnector
} from 'standard-json-api-connectors'

export default function (fetch, apiUrl) {
  const generateAdditionalHeaders = () => {
    return { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
  }

  const generateOverallStatsRoute = () => '/v1/statistics/overall'
  const generateAccountsStatsRoute = () => '/v1/statistics/accounts'
  const generateUsersStatsRoute = () => '/v1/statistics/users'

  const getAccountsStatsList = createGetConnector(fetch, apiUrl, generateAccountsStatsRoute, generateAdditionalHeaders)
  const getOverallStatsList = createGetConnector(fetch, apiUrl, generateOverallStatsRoute, generateAdditionalHeaders)
  const getUsersStatsList = createGetConnector(fetch, apiUrl, generateUsersStatsRoute, generateAdditionalHeaders)

  const getOverallStats = async function (query) {
    const res = await getOverallStatsList(null, query)
    return res
  }

  const getAccountsStats = async function (query) {
    const res = await getAccountsStatsList(null, query)
    return res
  }
  const getUsersStats = async function (query) {
    const res = await getUsersStatsList(null, query)
    return res
  }

  return {
    getAccountsStats, getUsersStats, getOverallStats
  }
}
