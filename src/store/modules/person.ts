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
import {
  getUserGroup,
  createUserGroup,
  getGroupActions,
  getGroupClusters,
  getGroupAggregate
} from '@/api/groups'
import { getCollectedCollections } from '@/api/collections'
import {
  getStaredResources,
  getResourceTags,
  createResourceTag,
  deleteResourceTag,
  modifyResourceTag,
  stickResourceTag,
  unstickResourceTag
} from '@/api/resources'

export interface PersonBean {
    certifiedDomains
    targetDomains
    resources
    collections
    domains
    resourceTags
    resourceTagMap
    userGroup
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
    public resourceTags: any[] = []
    public resourceTagMap: any = {}
    public userGroup: any = {
      created: false
    }

    @Mutation
    REMOVE_RESOURCE_TAG(index) {
      for (let i = 0; i < this.resourceTags.length; i++) {
        if (this.resourceTags[i].id === index) {
          this.resourceTags.splice(i, 1)
          break
        }
      }

      delete this.resourceTagMap[index]

      for (let i = 0; i < this.resources.length; i++) {
        for (let j = 0; j < this.resources[i].tags.length; j++) {
          if (this.resources[i].tags[j].id === index) {
            this.resources[i].tags.splice(j, 1)
            break
          }
        }
      }
    }

    @Mutation
    MODIFY_RESOURCE_TAG(index, tag) {
      for (let i = 0; i < this.resourceTags.length; i++) {
        if (this.resourceTags[i].id === index) {
          this.resourceTags[i] = tag
          break
        }
      }

      this.resourceTagMap[index] = tag
    }

    @Mutation
    INSERT_RESOURCE_TAG(tag) {
      this.resourceTags.unshift(tag)
      this.resourceTagMap[tag.id] = tag
    }

    @Mutation
    INSERT_RESOURCE_TAGS(tags) {
      this.resourceTags.push(...tags)
      for (let i = 0; i < tags.length; i++) {
        this.resourceTagMap[tags[i].id] = tags[i]
      }
    }

    @Mutation
    RESET_RESOURCE_TAG() {
      this.resourceTags = []
      this.resourceTagMap = {}
    }

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
    MODIFY_RESOURCE(resource) {
      for (let i = 0; i < this.resources.length; i++) {
        if (this.resources[i].id === resource.id) {
          this.resources[i] = resource
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
      this.resources = []
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
      this.collections = []
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
      this.domains = []
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
      this.certifiedDomains = []
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
      this.targetDomains = []
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
    public UpdateResourceTags() {
      getResourceTags({ limit: 999 }).then((res) => {
        this.RESET_RESOURCE_TAG()
        this.INSERT_RESOURCE_TAGS(res.items)
      })
    }

    @Action
    public CreateResourceTag(params) {
      createResourceTag({ title: params.title }).then((res) => {
        if (res.items.length === 1) {
          const tag = res.items[0]
          this.INSERT_RESOURCE_TAG(tag)
          if (params.resourceId) {
            stickResourceTag({ resource: params.resourceId, tag: tag.id }).then((res) => {
              if (res.items.length === 1) {
                const resource = res.items[0]
                this.MODIFY_RESOURCE(resource)
                if (params.callback) {
                  params.callback(resource, tag)
                }
              }
            })
          } else {
            if (params.callback) {
              params.callback(tag)
            }
          }
        }
      })
    }

    @Action
    public RemoveResourceTag(params) {
      deleteResourceTag({ id: params.index }).then((res) => {
        if (res.items.length === 1) {
          const tag = res.items[0]
          this.REMOVE_RESOURCE_TAG(params.index)
          if (params.callback) {
            params.callback(tag)
          }
        }
      })
    }

    @Action
    public ModifyResourceTag(params) {
      modifyResourceTag({ id: params.index, title: params.title }).then((res) => {
        if (res.items.length === 1) {
          this.MODIFY_RESOURCE_TAG(params.index, res.items[0])
        }
      })
    }

    @Action
    public StickResourceTag(params) {
      stickResourceTag({ resource: params.resource, tag: params.tag }).then((res) => {
        if (res.items.length === 1) {
          const resource = res.items[0]
          this.MODIFY_RESOURCE(resource)
          if (params.callback) {
            params.callback(resource)
          }
        }
      })
    }

    @Action
    public UnstickResourceTag(params) {
      unstickResourceTag({ resource: params.resource, tag: params.tag }).then((res) => {
        if (res.items.length === 1) {
          const resource = res.items[0]
          this.MODIFY_RESOURCE(resource)
          if (params.callback) {
            params.callback(resource)
          }
        }
      })
    }

    @Mutation
    SET_USER_GROUP_CREATED() {
      this.userGroup.created = true
    }

    @Mutation
    SET_USER_GROUP_ACTIONS(actions) {
      this.userGroup.actions = actions
      const actionMap = {}
      for (let i = 0; i < actions.length; i++) {
        const action = actions[i]
        actionMap[action.id] = action
      }
      this.userGroup.actionMap = actionMap
    }

    @Mutation
    SET_USER_GROUP_CLUSTERS(clusters) {
      this.userGroup.clusters = clusters
    }

    @Mutation
    SET_USER_GROUP_AGGREGATES(aggregates) {
      const aggMap = {}
      const topActions: any = new Set()
      for (let i = 0; i < aggregates.length; i++) {
        const agg = aggregates[i]
        topActions.add(agg.ancestor_id)

        if (agg.ancestor_id in aggMap) {
          aggMap[agg.ancestor_id].children.push(agg.descendant_id)
        } else {
          aggMap[agg.ancestor_id].children = [agg.descendant_id]
        }
      }

      for (let i = 0; i < aggregates.length; i++) {
        const agg = aggregates[i]
        if (topActions.has(agg.descendant_id)) {
          topActions.remove(agg.descendant_id)
        }
      }

      function buildActionTree(actions, aggMap) {
        return actions.map(action => {
          if (!(action in aggMap)) {
            return {
              id: action,
              children: []
            }
          }
          return {
            id: action,
            children: buildActionTree(aggMap[action].children, aggMap)
          }
        })
      }

      const actionTree = {
        id: 0,
        children: buildActionTree(topActions, aggMap)
      }
      this.userGroup.actionTree = actionTree
    }

    @Action
    public UpdateUserGroup() {
      getUserGroup({}).then((res) => {
        if (res.items.length === 1) {
          this.SET_USER_GROUP(res.items[0])
          this.SET_USER_GROUP_CREATED()
          getGroupActions({ group: this.userGroup.id, limit: 999 }).then((res) => {
            this.SET_USER_GROUP_ACTIONS(res.items)
          })
          getGroupClusters({ group: this.userGroup.id, limit: 999 }).then((res) => {
            this.SET_USER_GROUP_CLUSTERS(res.items)
          })
          getGroupAggregate({ group: this.userGroup.id, limit: 999 }).then(res => {
            this.SET_USER_GROUP_AGGREGATES(res.items)
          })
        }
      })
    }

    @Mutation
    SET_USER_GROUP(userGroup) {
      this.userGroup = userGroup
    }

    @Action
    public CreateUserGroup() {
      createUserGroup({}).then((res) => {
        if (res.items.length === 1) {
          this.UpdateUserGroup()
        }
      })
    }

    @Action
    public async Initialize() {
      this.UpdateDomains()
      this.UpdateCollections()
      this.UpdateResources()
      this.UpdateTargetDomains()
      this.UpdateCertifiedDomains()
      this.UpdateResourceTags()
    }
}

export const PersonModule = getModule(Person)
