import request from '@/plugins/request'

export const getCollection = (params: any) =>
  request({
    url: '/collection',
    method: 'get',
    params
  })

export const getCollectionResources = (params: any) =>
  request({
    url: '/collection/referenceds',
    method: 'get',
    params
  })
