import {
    createGetConnector
} from 'standard-json-api-connectors'

import RouteError from '../errors/RouteError.js'

export default function (fetch, apiUrl) {
    const generateAdditionalHeaders = (params) => {
        return { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    }

    const generateAdminRoute = (params) => `/v1/admins/${params.id}`
    const getAdmin = createGetConnector(fetch, apiUrl, generateAdminRoute, generateAdditionalHeaders)

    const readOne = async function (data) {
        if (!data || !data.id) {
            throw new RouteError('Admin ID Is Required')
        }
        const res = await getAdmin({ id: data.id })
        return res
    }

    return {
        admin: { readOne }
    }
}
