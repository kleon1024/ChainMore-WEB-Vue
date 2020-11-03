import request from '@/plugins/request'

export const getUser = (params: any) =>
  request({
    url: '/user',
    method: 'get',
    params
  })

export const modifyUser = (data: any) =>
  request({
    url: '/user',
    method: 'put',
    data
  })
