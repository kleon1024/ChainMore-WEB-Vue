import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'

import { initialUnencryptedStorage } from '@/globals'

import { getResourceType } from '@/api/main'

export interface GlobalBean {
  resourceTypeMap
  mediaTypeMap
  resourceMediaTypeMap
  resourceItems
  mediaItems
  resourceMediaNameMap
  resourceTypeCached
  darkTheme
}

const name = 'global'

@Module({
  dynamic: true,
  store,
  name,
  namespaced: true,
  preserveState: Boolean(initialUnencryptedStorage[name])
})
class Global extends VuexModule implements GlobalBean {
  public resourceTypeMap = {}
  public mediaTypeMap = {}
  public resourceMediaTypeMap = {}
  public resourceItems: any[] = []
  public mediaItems: any[] = []
  public resourceMediaNameMap = {}
  public resourceTypeCached = false
  public darkTheme = false

  @Mutation
  public SET_RESOURCE_TYPE(types) {
    types.forEach((type) => {
      if (type.resource.id in this.resourceMediaTypeMap) {
        this.resourceMediaTypeMap[type.resource.id].push(type.media)
      } else {
        this.resourceMediaTypeMap[type.resource.id] = [type.media]
      }

      this.resourceMediaNameMap[`${type.resource.id}${type.media.id}`] = type

      if (!(type.resource.id in this.resourceTypeMap)) {
        this.resourceTypeMap[type.resource.id] = type.resource
      }
      if (!(type.media.id in this.mediaTypeMap)) {
        this.mediaTypeMap[type.media.id] = type.media
      }
    })
    this.resourceItems = []
    this.resourceItems.push(...Object.values(this.resourceTypeMap))
    this.mediaItems = []
    this.mediaItems.push(...Object.values(this.mediaTypeMap))
    this.resourceTypeCached = true
  }

  @Action
  public async UpdateResourceType() {
    getResourceType({}).then(res => {
      this.SET_RESOURCE_TYPE(res.items)
    })
  }

  @Mutation
  public SET_DARK_THEME(theme) {
    this.darkTheme = theme
  }

  @Action
  public UpdateDarkTheme(theme) {
    this.SET_DARK_THEME(theme)
  }
}

export const GlobalModule = getModule(Global)
