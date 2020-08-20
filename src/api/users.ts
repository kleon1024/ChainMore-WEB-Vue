import request from '@/plugins/request'

export const getUser = (params: any, headers: any) =>
  request({
    url: '/user',
    method: 'get',
    params,
    headers
  })

export const modifyUser = (data: any) =>
  request({
    url: '/user',
    method: 'put',
    data
  })
