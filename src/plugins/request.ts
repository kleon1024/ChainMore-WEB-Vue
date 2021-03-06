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
    if (UserModule.isLoggedIn && !('Authorization' in config.headers)) {
      return UserModule.GetLoginAccessToken().then((accessToken) => {
        config.headers.Authorization = `Bearer ${accessToken}`
        return Promise.resolve(config)
      })
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
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default service
