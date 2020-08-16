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

export const isMarkDomain = (params: any) =>
  request({
    url: '/domain/mark',
    method: 'get',
    params
  })

export const markDomain = (data: any) =>
  request({
    url: '/domain/mark',
    method: 'post',
    data
  })

export const unmarkDomain = (params: any) =>
  request({
    url: '/domain/mark',
    method: 'delete',
    params
  })

export const getDependedDomains = (params: any) =>
  request({
    url: '/domain/i/dependeds',
    method: 'get',
    params
  })

export const getAggregatorDomains = (params: any) =>
  request({
    url: '/domain/i/aggregators',
    method: 'get',
    params
  })

export const createDomain = (data: any) =>
  request({
    url: '/domain',
    method: 'post',
    data
  })

export const updateDomain = (data: any) =>
  request({
    url: '/domain',
    method: 'put',
    data
  })

export const checkDomainExist = (params: any) =>
  request({
    url: '/domain/exist',
    method: 'get',
    params
  })
