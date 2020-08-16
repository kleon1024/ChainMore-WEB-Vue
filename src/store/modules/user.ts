import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { signIn, signOut, refreshToken } from '@/api/auth'
import {
  getAccessToken, setAccessToken, removeAccessToken,
  getRefreshToken, setRefreshToken, removeRefreshToken,
  getUsername, setUsername, removeUsername,
  getTimestamp, setTimestamp, removeTimestamp,
  getUserId, setUserId, removeUserId
} from '@/plugins/cookies'
import store from '@/store'

export interface UserBean {
  accessToken: string
  refreshToken: string
  username: string
}

@Module({
  dynamic: true,
  store,
  name: 'user',
  namespaced: true
})
class User extends VuexModule implements UserBean {
  public accessToken = getAccessToken() || ''
  public refreshToken = getRefreshToken() || ''
  public username = getUsername() || ''
  public timestamp = getTimestamp() || ''
  public userId = getUserId() || ''

  public get UserId() {
    return parseInt(this.userId)
  }

  @Action
  public async GetLoginAccessToken() {
    if (this.timestamp === '') {
      await this.RefreshToken()
      return this.accessToken
    }
    const oldTime = parseInt(this.timestamp)
    const newTime = Math.floor(Date.now() / 1000 / 60)
    if (newTime - oldTime > 15 || newTime < oldTime) {
      await this.RefreshToken()
    }
    return this.accessToken
  }

  public get isLoggedIn() {
    return (
      this.accessToken !== '' &&
      this.refreshToken !== '' &&
      this.username !== '' &&
      this.timestamp !== '' &&
      this.userId !== ''
    )
  }

  @Mutation
  private SET_ACCESS_TOKEN(token: string) {
    this.accessToken = token
  }

  @Mutation
  private SET_REFRESH_TOKEN(token: string) {
    this.refreshToken = token
  }

  @Mutation
  private SET_USERNAME(username: string) {
    this.username = username
  }

  @Mutation
  private SET_TIMESTAMP(timestamp: string) {
    this.timestamp = timestamp
  }

  @Mutation
  private SET_USE_ID(useId: string) {
    this.userId = useId
  }

  @Action
  public async Login(userInfo: { username: string, password: string }) {
    try {
      const data = await signIn(userInfo)
      setAccessToken(data.access_token)
      setRefreshToken(data.refresh_token)
      setUsername(data.username)
      setUserId(data.id)
      const timestamp = Math.floor(Date.now() / 1000 / 60).toString()
      setTimestamp(timestamp)
      this.SET_USERNAME(data.username)
      this.SET_ACCESS_TOKEN(data.access_token)
      this.SET_REFRESH_TOKEN(data.refresh_token)
      this.SET_TIMESTAMP(timestamp)
      this.SET_USE_ID(data.id.toString())
    } catch (error) {
      console.log(error)
    }
  }

  @Action
  public async RefreshToken() {
    try {
      if (this.refreshToken === '') {
        throw Error('RefreshToken: cannot find refresh token')
      }
      const data = await refreshToken({ Authorization: 'Bearer ' + this.refreshToken })
      setAccessToken(data.access_token)
      setRefreshToken(data.refresh_token)
      const timestamp = Math.floor(Date.now() / 1000 / 60).toString()
      setTimestamp(timestamp)
      this.SET_ACCESS_TOKEN(data.access_token)
      this.SET_REFRESH_TOKEN(data.refresh_token)
      this.SET_TIMESTAMP(timestamp)
    } catch (error) {
      console.log(error)
    }
  }

  @Action
  public ResetToken() {
    removeAccessToken()
    removeRefreshToken()
    removeTimestamp()
    this.SET_ACCESS_TOKEN('')
    this.SET_REFRESH_TOKEN('')
  }

  @Action
  public async LogOut() {
    try {
      if (this.accessToken === '') {
        throw Error('LogOut: accessToken is undefined!')
      }
      await signOut()
      removeAccessToken()
      removeRefreshToken()
      removeUsername()
      removeUserId()
      removeTimestamp()
      this.SET_ACCESS_TOKEN('')
      this.SET_REFRESH_TOKEN('')
      this.SET_USERNAME('')
      this.SET_TIMESTAMP('')
      this.SET_USE_ID('')
    } catch (err) {
      console.log(err)
    }
  }
}

export const UserModule = getModule(User)
