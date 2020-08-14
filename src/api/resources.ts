import request from '@/plugins/request'

export const getResource = (params: any) =>
  request({
    url: '/resource',
    method: 'get',
    params
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

export const createResource = (data: any) =>
  request({
    url: '/resource',
    method: 'post',
    data
  })

export const starResource = (data: any) =>
  request({
    url: '/resource/star',
    method: 'post',
    data
  })
