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

export const getGroupAggregate = (params: any) =>
  request({
    url: '/group/action/aggregate',
    method: 'get',
    params
  })
