import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'

import { initialUnencryptedStorage } from '@/globals'

import { getResourceType } from '@/api/main'

export interface GlobalBean {
  resourceTypeMap
  mediaTypeMap
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

  @Action
  public async UpdateResourceType() {
    getResourceType({}).then(res => {
      const types: any[] = []
      types.push(...res.items)
      types.forEach((type) => {
        if (type.resource_id in this.typeMap) {
          this.typeMap[type.resource_id].push({
            id: type.media_id,
            name: this.mediaName[type.media_name]
          })
        } else {
          this.resourceItems.push({
            id: type.resource_id,
            name: this.resourceName[type.resource_name]
          })
          this.typeMap[type.resource_id] = [
            {
              id: type.media_id,
              name: this.mediaName[type.media_name]
            }
          ]
        }
        if (!(type.resource_id in this.resourceNameMap)) {
          this.resourceNameMap[type.resource_id] = type.resource_name
        }
        if (!(type.media_id in this.mediaNameMap)) {
          this.mediaNameMap[type.media_id] = type.media_name
        }
      })
    })
  }
}

export const GlobalModule = getModule(Global)
