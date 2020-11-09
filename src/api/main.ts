import request from '@/plugins/request'

export const search = (params: any) =>
  request({
    url: '/search',
    method: 'get',
    params
  })

export const getResourceType = (params: any) =>
  request({
    url: '/type',
    method: 'get',
    params
  })
