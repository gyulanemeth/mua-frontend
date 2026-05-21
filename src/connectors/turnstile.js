import { createGetConnector } from 'standard-json-api-connectors'

export default function (fetch, apiUrl) {
  const generateAdditionalHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
  })

  const fetchConfig = createGetConnector(fetch, apiUrl, () => '/v1/turnstile', generateAdditionalHeaders)

  const getTurnstileConfig = async function () {
    return await fetchConfig()
  }

  return { getTurnstileConfig }
}
