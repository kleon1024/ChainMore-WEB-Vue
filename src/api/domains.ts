import request from '@/plugins/request'

export const getDomains = (params: any) =>
  request({
    url: '/domain/all',
    method: 'get',
    params
  })

export const getDomain = (params: any) =>
  request({
    url: '/domain',
    method: 'get',
    params
  })

export const getDomainDepends = (params: any) =>
  request({
    url: '/domain/depend/all',
    method: 'get',
    params
  })

export const getDomainRootDepends = (params: any) =>
  request({
    url: '/domain/depend/root',
    method: 'get',
    params
  })

export const getDomainAggregates = (params: any) =>
  request({
    url: '/domain/aggregate/all',
    method: 'get',
    params
  })

export const getDomainCollections = (params: any) =>
  request({
    url: '/domain/collections',
    method: 'get',
    params
  })

export const getMarkedDomains = (params: any) =>
  request({
    url: '/domain/marked',
    method: 'get',
    params
  })
