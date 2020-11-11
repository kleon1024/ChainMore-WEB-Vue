import request from '@/plugins/request'

export const getUserGroup = (params: any) =>
  request({
    url: '/group/user',
    method: 'get',
    params
  })

export const createUserGroup = (data: any) =>
  request({
    url: '/group/user',
    method: 'post',
    data
  })

export const createGroup = (data: any) =>
  request({
    url: '/group',
    method: 'post',
    data
  })

export const createAction = (data: any) =>
  request({
    url: '/group/action',
    method: 'post',
    data
  })

export const modifyAction = (data: any) =>
  request({
    url: '/group/action',
    method: 'put',
    data
  })

export const createCluster = (data: any) =>
  request({
    url: '/group/cluster',
    method: 'post',
    data
  })

export const createAttribute = (data: any) =>
  request({
    url: '/group/attr',
    method: 'post',
    data
  })

export const deleteAttribute = (params: any) =>
  request({
    url: '/group/attr',
    method: 'delete',
    params
  })

export const deleteCluster = (params: any) =>
  request({
    url: '/group/cluster',
    method: 'delete',
    params
  })

export const getGroupClusters = (params: any) =>
  request({
    url: '/group/clusters',
    method: 'get',
    params
  })

export const getGroupActions = (params: any) =>
  request({
    url: '/group/actions',
    method: 'get',
    params
  })

export const getGroups = (params: any) =>
  request({
    url: '/group/all',
    method: 'get',
    params
  })

export const getGroupMembers = (params: any) =>
  request({
    url: '/group/member',
    method: 'get',
    params
  })

export const getGroupAggregate = (params: any) =>
  request({
    url: '/group/action/aggregate',
    method: 'get',
    params
  })

export const getGroupClusterTypes = (params: any) =>
  request({
    url: '/group/cluster/types',
    method: 'get',
    params
  })

export const addGroupMember = (data: any) =>
  request({
    url: '/group/member',
    method: 'post',
    data
  })

export const setActionAttribute = (data: any) =>
  request({
    url: '/group/action/belong',
    method: 'post',
    data
  })

export const putActionAttribute = (data: any) =>
  request({
    url: '/group/action/belong',
    method: 'put',
    data
  })

export const unsetActionAttribute = (params: any) =>
  request({
    url: '/group/action/belong',
    method: 'delete',
    params
  })
