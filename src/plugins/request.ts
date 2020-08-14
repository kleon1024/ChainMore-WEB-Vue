import axios from 'axios'
import { UserModule } from '@/store/modules/user'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

// Request interceptors
service.interceptors.request.use(
  (config) => {
    // Add X-Access-Token header to every request, you can add other custom headers here
    if (!('Authorization' in config.headers)) {
      config.headers.Authorization = 'Bearer ' + UserModule.accessToken
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// Response interceptors
service.interceptors.response.use(
  (response) => {
    // You can change this part for your own usage.
    const res = response.data
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default service
