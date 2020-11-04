import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { signIn, signOut, refreshToken, changePassword } from '@/api/auth'
import { getUser } from '@/api/users'
import store from '@/store'
import { initialUnencryptedStorage } from '@/globals'

export interface UserBean {
  accessToken: string
  refreshToken: string
  username: string
}

const name = 'user'

@Module({
  dynamic: true,
  store,
  name: name,
  namespaced: true,
  preserveState: Boolean(initialUnencryptedStorage[name])
})
class User extends VuexModule implements UserBean {
  public accessToken = ''
  public refreshToken = ''
  public username = ''
  public timestamp = ''
  public userId = ''
  public userInfo: any = undefined

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

  public get isAdmin() {
    return (
      this.userInfo && this.userInfo.is_admin
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

  @Mutation
  private SET_USER_INFO(userInfo: Record<string, any> | undefined) {
    this.userInfo = userInfo
  }

  @Action
  public async Login(userInfo: { username: string, password: string }) {
    try {
      const data = await signIn(userInfo).catch(err => {
        console.log(err)
        return false
      })

      const timestamp = Math.floor(Date.now() / 1000 / 60).toString()
      this.SET_USERNAME(data.username)

      this.SET_ACCESS_TOKEN(data.access_token)
      this.SET_REFRESH_TOKEN(data.refresh_token)
      this.SET_TIMESTAMP(timestamp)
      this.SET_USE_ID(data.id.toString())

      getUser({ id: data.id }).then((res) => {
        if (res.items.length === 1) {
          const user = res.items[0]
          this.SET_USER_INFO(user)
        }
      })
      return true
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
      const data = await refreshToken({
        Authorization: 'Bearer ' + this.refreshToken
      })
      const timestamp = Math.floor(Date.now() / 1000 / 60).toString()
      this.SET_ACCESS_TOKEN(data.access_token)
      this.SET_REFRESH_TOKEN(data.refresh_token)
      this.SET_TIMESTAMP(timestamp)
    } catch (error) {
      console.log(error)
    }
  }

  @Action
  public ResetToken() {
    this.SET_ACCESS_TOKEN('')
    this.SET_REFRESH_TOKEN('')
  }

  @Action
  public async ResetAll() {
    this.SET_ACCESS_TOKEN('')
    this.SET_REFRESH_TOKEN('')
    this.SET_USERNAME('')
    this.SET_TIMESTAMP('')
    this.SET_USE_ID('')
    this.SET_USER_INFO(undefined)
  }

  @Action
  public async LogOut() {
    try {
      if (this.accessToken === '') {
        throw Error('LogOut: accessToken is undefined!')
      }
      this.ResetAll()
      await signOut()
    } catch (err) {
      console.log(err)
    }
  }

  @Action
  public ChangePassword(params: {
    oldPassword: string
    newPassword: string
    success
    failed
  }) {
    changePassword({
      oldPassword: params.oldPassword,
      newPassword: params.newPassword
    }).then(res => {
      this.ResetAll()
      if (params.success) {
        params.success()
      }
    }).catch(err => {
      console.log(err)
      if (params.failed) {
        params.failed()
      }
    })
  }
}

export const UserModule = getModule(User)
