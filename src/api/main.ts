import request from '@/plugins/request'

export const search = (params: Record<string, string>) =>
  request({
    url: '/search',
    method: 'get',
    params
  })
