import request from '@/plugins/request'

export const getResource = (params: any) =>
  request({
    url: '/resource',
    method: 'get',
    params
  })

export const createResource = (data: any) =>
  request({
    url: '/resource',
    method: 'post',
    data
  })

export const modifyResource = (data: any) =>
  request({
    url: '/resource',
    method: 'put',
    data
  })

export const getStaredResources = (params: any) =>
  request({
    url: '/resource/stared',
    method: 'get',
    params
  })

export const checkUrlExsit = (data: any) =>
  request({
    url: '/resource/exist',
    method: 'post',
    data
  })

export const starResource = (data: any) =>
  request({
    url: '/resource/star',
    method: 'post',
    data
  })

export const unstarResource = (params: any) =>
  request({
    url: '/resource/star',
    method: 'delete',
    params
  })

export const isStarResource = (params: any) =>
  request({
    url: '/resource/star',
    method: 'get',
    params
  })

export const getRefCollections = (params: any) =>
  request({
    url: '/resource/collections',
    method: 'get',
    params
  })
