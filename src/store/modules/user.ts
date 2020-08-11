import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { signIn, signOut, refreshToken } from '@/api/auth'
import {
  getAccessToken, setAccessToken, removeAccessToken,
  getRefreshToken, setRefreshToken, removeRefreshToken,
  getUsername, setUsername, removeUsername
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

  @Action
  public async Login(userInfo: { username: string, password: string }) {
    try {
      console.log(userInfo)
      const data = await signIn(userInfo)
      console.log(data.access_token)
      setAccessToken(data.access_token)
      setRefreshToken(data.refresh_token)
      setUsername(data.username)
      this.SET_USERNAME(data.username)
      this.SET_ACCESS_TOKEN(data.access_token)
      this.SET_REFRESH_TOKEN(data.refresh_token)
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
      await refreshToken()
    } catch (error) {
      console.log(error)
    }
  }

  @Action
  public ResetToken() {
    removeAccessToken()
    removeRefreshToken()
    this.SET_ACCESS_TOKEN('')
    this.SET_REFRESH_TOKEN('')
  }

  @Action
  public async LogOut() {
    if (this.accessToken === '') {
      throw Error('LogOut: accessToken is undefined!')
    }
    await signOut()
    removeAccessToken()
    removeRefreshToken()
    removeUsername()
    this.SET_ACCESS_TOKEN('')
    this.SET_REFRESH_TOKEN('')
    this.SET_USERNAME('')
  }
}

export const UserModule = getModule(User)
