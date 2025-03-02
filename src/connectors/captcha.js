import {
  createGetConnector
} from 'standard-json-api-connectors'

export default function (fetch, apiUrl) {
  const generateAdditionalHeaders = () => {
    return { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
  }

  const generateCaptcha = createGetConnector(fetch, apiUrl, () => '/v1/captcha', generateAdditionalHeaders)

  const getCaptcha = async function () {
    const res = await generateCaptcha()
    return res
  }

  return {
    getCaptcha
  }
}
