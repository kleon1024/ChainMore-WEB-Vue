import request from '@/plugins/request'

export const getCollection = (params: any) =>
  request({
    url: '/collection',
    method: 'get',
    params
  })

export const createCollection = (data: any) =>
  request({
    url: '/collection',
    method: 'post',
    data
  })

export const modifyCollection = (data: any) =>
  request({
    url: '/collection',
    method: 'put',
    data
  })

export const getCollectionResources = (params: any) =>
  request({
    url: '/collection/referenceds',
    method: 'get',
    params
  })

export const getCollectedCollections = (params: any) =>
  request({
    url: '/collection/collected',
    method: 'get',
    params
  })

export const isCollectCollection = (params: any) =>
  request({
    url: '/collection/collect',
    method: 'get',
    params
  })

export const collectCollection = (data: any) =>
  request({
    url: '/collection/collect',
    method: 'post',
    data
  })

export const uncollectCollection = (params: any) =>
  request({
    url: '/collection/collect',
    method: 'delete',
    params
  })
