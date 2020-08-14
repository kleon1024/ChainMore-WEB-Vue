import request from '@/plugins/request'

export const search = (params: Record<string, string>) =>
  request({
    url: '/search',
    method: 'get',
    params
  })

export const getResourceType = (params: Record<string, string>) =>
  request({
    url: '/type',
    method: 'get',
    params
  })
