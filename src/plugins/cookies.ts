import Cookies from 'js-cookie'

// User
const accessTokenKey = 'cm_access_token'
export const getAccessToken = () => Cookies.get(accessTokenKey)
export const setAccessToken = (token: string) => Cookies.set(accessTokenKey, token)
export const removeAccessToken = () => Cookies.remove(accessTokenKey)

const refreshTokenKey = 'cm_refresh_token'
export const getRefreshToken = () => Cookies.get(refreshTokenKey)
export const setRefreshToken = (token: string) => Cookies.set(refreshTokenKey, token)
export const removeRefreshToken = () => Cookies.remove(refreshTokenKey)

const usernameKey = 'cm_username'
export const getUsername = () => Cookies.get(usernameKey)
export const setUsername = (username: string) => Cookies.set(usernameKey, username)
export const removeUsername = () => Cookies.remove(usernameKey)

const timestampKey = 'cm_timestamp'
export const getTimestamp = () => Cookies.get(timestampKey)
export const setTimestamp = (timestamp: string) => Cookies.set(timestampKey, timestamp)
export const removeTimestamp = () => Cookies.remove(timestampKey)

const userIdKey = 'cm_user_id'
export const getUserId = () => Cookies.get(userIdKey)
export const setUserId = (userId: string) => Cookies.set(userIdKey, userId)
export const removeUserId = () => Cookies.remove(userIdKey)

const userInfoKey = 'cm_user_info'
export const getUserInfo = () => {
  const str = Cookies.get(userInfoKey); if (str) {
    return JSON.parse(str)
  } else {
    return undefined
  }
}
export const setUserInfo = (userInfo: string) => Cookies.set(userInfoKey, JSON.stringify(userInfo))
export const removeUserInfo = () => Cookies.remove(userInfoKey)
