import request from '@/plugins/request'

export const getDomains = (params: any) =>
  request({
    url: '/domain/all',
    method: 'get',
    params
  })

export const getDomainDepends = (params: any) =>
  request({
    url: '/domain/depend/all',
    method: 'get',
    params
  })

export const getDomainAggregates = (params: any) =>
  request({
    url: '/domain/aggregate/all',
    method: 'get',
    params
  })
