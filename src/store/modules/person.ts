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
  createAction,
  createAttribute,
  createCluster,
  createUserGroup,
  setActionAttribute,
  unsetActionAttribute,
  deleteAttribute,
  deleteCluster,
  getUserGroup,
  getGroupActions,
  getGroupClusters,
  getGroupAggregate,
  getGroups,
  getGroupMembers,
  addGroupMember
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
  groupMap
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

  public groupMap: any = {}

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
  SET_GROUP_ACTIONS(params) {
    const group = params.group
    group.actions = []
    group.actions.push(...params.actions)
    const actionMap = {}
    for (let i = 0; i < group.actions.length; i++) {
      const action = params.actions[i]
      action.expanded = false
      action.expandable = false
      actionMap[action.id] = action
    }
    group.actionMap = actionMap
  }

  @Mutation
  SET_GROUP_CLUSTERS(params) {
    params.group.clusters = params.clusters
  }

  @Mutation
  SET_GROUP_MEMEBERS(params) {
    params.group.members = params.members
  }

  @Mutation
  SET_GROUP_AGGREGATES(params) {
    const group = params.group
    const aggMap = {}
    const topActions: any = new Set()
    for (let i = 0; i < params.aggregates.length; i++) {
      const agg = params.aggregates[i]
      topActions.add(agg.ancestor_id)

      if (agg.ancestor_id !== agg.descendant_id) {
        if (agg.ancestor_id in aggMap) {
          aggMap[agg.ancestor_id].children.push(agg.descendant_id)
        } else {
          aggMap[agg.ancestor_id] = {
            id: agg.ancestor_id,
            children: [agg.descendant_id]
          }
        }
      }
    }

    for (let i = 0; i < params.aggregates.length; i++) {
      const agg = params.aggregates[i]
      if (agg.ancestor_id !== agg.descendant_id) {
        if (topActions.has(agg.descendant_id)) {
          topActions.delete(agg.descendant_id)
        }
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
      children: buildActionTree([...topActions], aggMap)
    }
    group.actionTree = actionTree
  }

  @Action
  public UpdateUserGroup() {
    getUserGroup({}).then((res) => {
      if (res.items.length === 1) {
        this.SET_USER_GROUP(res.items[0])
        this.SET_USER_GROUP_CREATED()
        getGroupActions({ group: this.userGroup.id, limit: 999 }).then((res) => {
          this.SET_GROUP_ACTIONS({
            group: this.userGroup,
            actions: res.items
          })
        })
        getGroupClusters({ group: this.userGroup.id, limit: 999 }).then((res) => {
          this.SET_GROUP_CLUSTERS({
            group: this.userGroup,
            clusters: res.items
          })
        })
        getGroupAggregate({ group: this.userGroup.id, limit: 999 }).then(res => {
          this.SET_GROUP_AGGREGATES({
            group: this.userGroup,
            aggregates: res.items
          })
        })
      }
    })
  }

  @Action
  public UpdateGroupDetail(params) {
    getGroupActions({ group: params.group.group.id, limit: 999 }).then((res) => {
      this.SET_GROUP_ACTIONS({ group: params.group, actions: res.items })
    })

    getGroupClusters({ group: params.group.group.id, limit: 999 }).then((res) => {
      this.SET_GROUP_CLUSTERS({ group: params.group, clusters: res.items })
    })

    getGroupAggregate({ group: params.group.group.id, limit: 999 }).then(res => {
      this.SET_GROUP_AGGREGATES({ group: params.group, aggregates: res.items })
    })

    getGroupMembers({ group: params.group.group.id, limit: 999 }).then(res => {
      this.SET_GROUP_MEMEBERS({ group: params.group, members: res.items })
    })
  }

  @Mutation
  public SET_GROUPS(groups) {
    for (let i = 0; i < groups.length; i++) {
      this.groupMap[groups[i].id].group = groups[i]
    }
  }

  @Action
  public UpdateGroup() {
    getGroups({}).then((res) => {
      this.SET_GROUPS(res.items)
    })
  }

  @Mutation
  SET_USER_GROUP(userGroup) {
    this.userGroup.group = userGroup
  }

  @Action
  public CreateUserGroup() {
    createUserGroup({}).then((res) => {
      if (res.items.length === 1) {
        this.UpdateUserGroup()
      }
    })
  }

  @Mutation
  public ADD_GROUP_ACTION(params) {
    params.group.actions.unshift(params.action)
    params.group.actionMap[params.action.id] = params.action
  }

  @Mutation
  public ADD_GROUP_CLUSTER(params) {
    params.group.clusters.push(params.cluster)
  }

  @Action
  public UpdateGroupAggregate(params) {
    getGroupAggregate({ group: params.group.group.id, limit: 999 }).then(res => {
      this.SET_GROUP_AGGREGATES({
        group: params.group.group,
        aggregates: res.items
      })
    })
  }

  @Action
  public CreateAction(params) {
    const p: any = {
      title: params.title,
      group: params.group.group.id
    }
    if (params.aggs.length > 0) {
      p.aggs = params.aggs
    }
    createAction(p).then((res) => {
      if (res.items.length === 1) {
        const action = res.items[0]
        this.ADD_GROUP_ACTION({
          action: action,
          group: params.group
        })
        this.UpdateGroupAggregate({
          group: params.group
        })

        if (params.success) {
          params.success()
        }
      }
    })
  }

  @Action
  public CreateCluster(params) {
    createCluster({
      title: params.title,
      group: params.group.group.id,
      type: params.type,
      aggregate: params.aggregate
    }).then((res) => {
      if (res.items.length === 1) {
        const cluster = res.items[0]
        this.ADD_GROUP_CLUSTER({
          cluster: cluster,
          group: params.group
        })

        if (params.success) {
          params.success()
        }
      }
    })
  }

  @Mutation
  public ADD_GROUP_ATTRIBUTE(params: { group, cluster, attr }) {
    for (let i = 0; i < params.group.clusters.length; i++) {
      if (params.group.clusters[i].id === params.cluster) {
        params.group.clusters[i].attrs.push(params.attr)
        break
      }
    }
  }

  @Action
  public CreateClusterAttribute(params) {
    createAttribute({
      cluster: params.cluster,
      text: params.text
    }).then((res) => {
      if (res.items.length === 1) {
        const attr = res.items[0]
        this.ADD_GROUP_ATTRIBUTE({
          group: params.group,
          cluster: params.cluster,
          attr: attr
        })
        if (params.success) {
          params.success()
        }
      }
    })
  }

  @Mutation
  public ADD_GROUP_ACTION_ATTR(params) {
    const action = params.group.actionMap[params.action.id]
    action.attrs.push(params.attr)
    for (let i = 0; i < params.group.actions.length; i++) {
      if (params.group.actions[i].id === params.action.id) {
        params.group.actions[i].attrs.push(params.attr)
        break
      }
    }
  }

  @Mutation
  public REMOVE_GROUP_ACTION_ATTR(params) {
    const action = params.group.actionMap[params.action.id]
    for (let i = 0; i < action.attrs.length; i++) {
      if (action.attrs[i].id === params.attr.id) {
        action.attrs.splice(i, 1)
      }
    }
    let done = false
    for (let i = 0; i < params.group.actions.length; i++) {
      if (params.group.actions[i].id === params.action.id) {
        for (let j = 0; j < params.group.actions[i].attrs.length; j++) {
          if (params.group.actions[i].attrs[j].id === params.attr.id) {
            params.group.actions[i].attrs.splice(j, 1)
            done = true
            break
          }
        }
        if (done) break
      }
    }
  }

  @Action
  public SetActionAttribute(params) {
    setActionAttribute({
      action: params.action.id,
      attr: params.attr.id
    }).then((res) => {
      if (res.items.length === 1) {
        const attr = res.items[0]
        this.ADD_GROUP_ACTION_ATTR({
          group: params.group,
          action: params.action,
          attr: attr
        })
      }
    })
  }

  @Action
  public ReplaceActionAttribute(params) {
    unsetActionAttribute({
      action: params.action.id,
      attr: params.oldAttr.id
    }).then((res) => {
      if (res.items.length === 1) {
        const oldAttr = res.items[0]
        setActionAttribute({
          action: params.action.id,
          attr: params.attr.id
        }).then((res) => {
          if (res.items.length === 1) {
            const attr = res.items[0]
            this.ADD_GROUP_ACTION_ATTR({
              group: params.group,
              action: params.action,
              attr: attr
            })
            this.REMOVE_GROUP_ACTION_ATTR({
              group: this.userGroup,
              action: params.action,
              attr: oldAttr
            })
          }
        })
      }
    })
  }

  @Mutation
  public REMOVE_GROUP_ALL_CLUSTER_ATTR(params) {
    let done = false
    for (let i = 0; i < params.group.clusters.length; i++) {
      if (params.group.clusters[i].id === params.attr.cluster_id) {
        for (let j = 0; j < params.group.clusters[i].attrs.length; j++) {
          if (params.group.clusters[i].attrs[j].id === params.attr.id) {
            params.group.clusters[i].attrs.splice(j, 1)
            done = true
            break
          }
        }
        if (done) break
      }
    }
  }

  @Mutation
  public REMOVE_GROUP_ALL_ACTION_ATTR(params) {
    for (const id in params.group.actionMap) {
      const action = params.group.actionMap[id]
      for (let j = 0; j < action.attrs.length; j++) {
        if (action.attrs[j].id === params.attr.id) {
          action.attrs.splice(j, 1)
        }
      }
    }
    for (let i = 0; i < params.group.actions.length; i++) {
      for (let j = 0; j < params.group.actions[i].attrs.length; j++) {
        if (params.group.actions[i].attrs[j].id === params.attr.id) {
          params.group.actions[i].attrs.splice(j, 1)
        }
      }
    }
  }

  @Action
  public RemoveClusterAttribute(params) {
    deleteAttribute({ attr: params.attr.id }).then((res) => {
      if (res.items.length === 1) {
        const attr = res.items[0]
        this.REMOVE_GROUP_ALL_CLUSTER_ATTR({
          group: params.group,
          attr: attr
        })
        this.REMOVE_GROUP_ALL_ACTION_ATTR({
          group: params.group,
          attr: attr
        })
      }
    })
  }

  @Mutation
  public REMOVE_GROUP_CLUSTER(params) {
    for (let i = 0; i < params.group.clusters.length; i++) {
      if (params.group.clusters[i].id === params.cluster.id) {
        params.group.clusters.splice(i, 1)
        break
      }
    }
  }

  @Mutation
  public REMOVE_GROUP_ALL_ACTION_CLUSTER(params) {
    for (const id in params.group.actionMap) {
      const action = params.group.actionMap[id]
      for (let j = 0; j < action.attrs.length; j++) {
        if (action.attrs[j].cluster_id === params.cluster.id) {
          action.attrs.splice(j, 1)
        }
      }
    }
    for (let i = 0; i < params.group.actions.length; i++) {
      for (let j = 0; j < params.group.actions[i].attrs.length; j++) {
        if (params.group.actions[i].attrs[j].cluster_id === params.cluster.id) {
          params.group.actions[i].attrs.splice(j, 1)
        }
      }
    }
  }

  @Action
  public DeleteCluster(params) {
    deleteCluster({ cluster: params.cluster.id }).then((res) => {
      if (res.items.length === 1) {
        this.REMOVE_GROUP_CLUSTER({
          group: params.group,
          cluster: params.cluster
        })
        this.REMOVE_GROUP_ALL_ACTION_CLUSTER({
          group: params.group,
          cluster: params.cluster
        })
      }
    })
  }

  @Mutation
  ADD_GROUP_MEMBER(params) {
    params.group.members.push(params.member)
  }

  @Action
  public AddGroupMember(params) {
    addGroupMember({ group: params.group.group.id, username: params.user.username }).then((res) => {
      if (res.items.length === 1) {
        this.ADD_GROUP_MEMBER({ group: params.group, member: res.items[0] })
        if (params.success) {
          params.success()
        }
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
    this.UpdateGroup()
  }
}

export const PersonModule = getModule(Person)
