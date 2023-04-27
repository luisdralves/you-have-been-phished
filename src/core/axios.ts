import Axios from 'axios'

export const ClientAxios = Axios.create({
    baseURL: '/api'
})

export const ServerAxios = Axios.create({
    baseURL: process.env.BASE_URL + '/api'
})
