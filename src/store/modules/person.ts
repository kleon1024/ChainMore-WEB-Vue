import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'

import { initialUnencryptedStorage } from '@/globals'

import {
  getCertifiedDomains,
  getTargetDomains,
  uncertify,
  unlearn,
  getMarkedDomains
} from '@/api/domains'
import { getCollectedCollections } from '@/api/collections'
import { getStaredResources } from '@/api/resources'

export interface PersonBean {
    certifiedDomains: Array<any>
    targetDomains: Array<any>
    resources: Array<any>
    collections: Array<any>
    domains: Array<any>
}

const name = 'person'

@Module({
  dynamic: true,
  store,
  name,
  namespaced: true,
  preserveState: Boolean(initialUnencryptedStorage[name])
})
class Person extends VuexModule implements PersonBean {
    public certifiedDomains: any[] = []
    public targetDomains: any[] = []
    public resources: any[] = []
    public collections: any[] = []
    public domains: any[] = []

    @Mutation
    REMOVE_RESOURCE(index) {
      for (let i = 0; i < this.resources.length; i++) {
        if (this.resources[i].id === index) {
          this.resources.splice(i, 1)
          break
        }
      }
    }

    @Mutation
    INSERT_RESOURCE(resource) {
      this.resources.push(resource)
    }

    @Mutation
    INSERT_RESOURCES(resources) {
      this.resources.push(...resources)
    }

    @Mutation
    RESET_RESOURCE() {
      this.resources.splice(0, this.resources.length)
    }

    @Mutation
    REMOVE_COLLECTION(index) {
      for (let i = 0; i < this.collections.length; i++) {
        if (this.collections[i].id === index) {
          this.collections.splice(i, 1)
          break
        }
      }
    }

    @Mutation
    INSERT_COLLECTION(collection) {
      this.collections.push(collection)
    }

    @Mutation
    INSERT_COLLECTIONS(collections) {
      this.collections.push(...collections)
    }

    @Mutation
    RESET_COLLECTION() {
      this.collections.splice(0, this.collections.length)
    }

    @Mutation
    REMOVE_DOMAIN(index) {
      for (let i = 0; i < this.domains.length; i++) {
        if (this.domains[i].id === index) {
          this.domains.splice(i, 1)
          break
        }
      }
    }

    @Mutation
    INSERT_DOMAIN(domain) {
      this.domains.push(domain)
    }

    @Mutation
    INSERT_DOMAINS(domains) {
      this.domains.push(...domains)
    }

    @Mutation
    RESET_DOMAIN() {
      this.domains.splice(0, this.domains.length)
    }

    @Mutation
    REMOVE_CERTIFIED_DOMAIN(index) {
      for (let i = 0; i < this.certifiedDomains.length; i++) {
        if (this.certifiedDomains[i].id === index) {
          this.certifiedDomains.splice(i, 1)
          break
        }
      }
    }

    @Mutation
    RESET_CERTIFIED_DOMAIN() {
      this.certifiedDomains.splice(0, this.certifiedDomains.length)
    }

    @Mutation
    INSERT_CERTIFIED_DOMAIN(domain: Record<string, any>) {
      this.certifiedDomains.push(domain)
    }

    @Mutation
    REMOVE_TARGET_DOMAIN(index) {
      for (let i = 0; i < this.targetDomains.length; i++) {
        if (this.targetDomains[i].id === index) {
          this.targetDomains.splice(i, 1)
          break
        }
      }
    }

    @Mutation
    RESET_TARGET_DOMAIN() {
      this.targetDomains.splice(0, this.targetDomains.length)
    }

    @Mutation
    INSERT_TARGET_DOMAIN(domain: Record<string, any>) {
      this.targetDomains.push(domain)
    }

    @Action
    public async UpdateCertifiedDomains() {
      getCertifiedDomains({}).then((res) => {
        this.RESET_CERTIFIED_DOMAIN()
        for (let i = 0; i < res.items.length; i++) {
          const domain = res.items[i]
          domain.icon = 'mdi-shield-star-outline'
          domain.text = domain.title
          domain.to = '/person/manage/domain/' + domain.id
          this.INSERT_CERTIFIED_DOMAIN(domain)
        }
      })
    }

    @Action
    public async UpdateTargetDomains() {
      getTargetDomains({}).then((res) => {
        this.RESET_TARGET_DOMAIN()
        for (let i = 0; i < res.items.length; i++) {
          const domain = res.items[i]
          domain.icon = 'mdi-shield-star-outline'
          domain.text = domain.title
          domain.to = '/person/learn/domain/' + domain.id
          this.INSERT_TARGET_DOMAIN(domain)
        }
      })
    }

    @Action
    public async UpdateDomains() {
      getMarkedDomains({ limit: 999 }).then((res) => {
        this.RESET_DOMAIN()
        this.INSERT_DOMAINS(res.items)
      })
    }

    @Action
    public async UpdateCollections() {
      getCollectedCollections({ limit: 999 }).then((res) => {
        this.RESET_COLLECTION()
        this.INSERT_COLLECTIONS(res.items)
      })
    }

    @Action
    public async UpdateResources() {
      getStaredResources({ limit: 999 }).then((res) => {
        this.RESET_RESOURCE()
        this.INSERT_RESOURCES(res.items)
      })
    }

    @Action
    public RemoveCertifiedDomain(index) {
      this.REMOVE_CERTIFIED_DOMAIN(index)
      uncertify({ domain: index }).then((res) => {
        return res.items.length === 1
      })
    }

    @Action
    public RemoveTargetDomain(index) {
      this.REMOVE_TARGET_DOMAIN(index)
      unlearn({ domain: index }).then((res) => {
        return res.items.length === 1
      })
    }

    @Action
    public async Initialize() {
      this.UpdateDomains()
      this.UpdateCollections()
      this.UpdateResources()
      this.UpdateTargetDomains()
      this.UpdateCertifiedDomains()
    }
}

export const PersonModule = getModule(Person)