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

export const getCertificationGroups = (params: any) =>
  request({
    url: '/domain/groups',
    method: 'get',
    params
  })

export const getCertificationGroup = (params: any) =>
  request({
    url: '/domain/group',
    method: 'get',
    params
  })

export const putCertificationGroup = (data: any) =>
  request({
    url: '/domain/group',
    method: 'put',
    data
  })

export const postCertificationGroup = (data: any) =>
  request({
    url: '/domain/group',
    method: 'post',
    data
  })

export const deleteCertificationGroup = (params: any) =>
  request({
    url: '/domain/group',
    method: 'delete',
    params
  })

export const getCertifications = (params: any) =>
  request({
    url: '/domain/certifications',
    method: 'get',
    params
  })

export const getCertification = (params: any) =>
  request({
    url: '/domain/certification',
    method: 'get',
    params
  })

export const deleteCertification = (params: any) =>
  request({
    url: '/domain/certification',
    method: 'delete',
    params
  })

export const putCertification = (data: any) =>
  request({
    url: '/domain/certification',
    method: 'put',
    data
  })

export const postCertification = (data: any) =>
  request({
    url: '/domain/certification',
    method: 'post',
    data
  })

export const getMCP = (params: any) =>
  request({
    url: '/domain/mcp',
    method: 'get',
    params
  })

export const postMCP = (data: any) =>
  request({
    url: '/domain/mcp',
    method: 'post',
    data
  })

export const putMCP = (data: any) =>
  request({
    url: '/domain/mcp',
    method: 'put',
    data
  })

export const deleteMCP = (params: any) =>
  request({
    url: '/domain/mcp',
    method: 'delete',
    params
  })

export const getMCPChoice = (params: any) =>
  request({
    url: '/domain/mcp/choice',
    method: 'get',
    params
  })

export const postMCPChoice = (data: any) =>
  request({
    url: '/domain/mcp/choice',
    method: 'post',
    data
  })

export const putMCPChoice = (data: any) =>
  request({
    url: '/domain/mcp/choice',
    method: 'put',
    data
  })

export const deleteMCPChoice = (params: any) =>
  request({
    url: '/domain/mcp/choice',
    method: 'delete',
    params
  })

export const getMCPChoices = (params: any) =>
  request({
    url: '/domain/groups',
    method: 'get',
    params
  })

export const getMCPAnswers = (params: any) =>
  request({
    url: '/domain/groups',
    method: 'get',
    params
  })

export const certificate = (data: any) =>
  request({
    url: '/domain/certificate',
    method: 'post',
    data
  })

export const certify = (data: any) =>
  request({
    url: '/domain/certify',
    method: 'post',
    data
  })

export const checkCertify = (params: any) =>
  request({
    url: '/domain/certify',
    method: 'get',
    params
  })

export const getCertifiedDomains = (params: any) =>
  request({
    url: '/domain/certifieds',
    method: 'get',
    params
  })

export const getManageCertifications = (params: any) =>
  request({
    url: '/domain/manage/certifications',
    method: 'get',
    params
  })

export const checkLearn = (params: any) =>
  request({
    url: '/domain/learn',
    method: 'get',
    params
  })

export const learn = (data: any) =>
  request({
    url: '/domain/learn',
    method: 'post',
    data
  })

export const unlearn = (params: any) =>
  request({
    url: '/domain/learn',
    method: 'delete',
    params
  })

export const uncertify = (params: any) =>
  request({
    url: '/domain/certify',
    method: 'delete',
    params
  })

export const getTargetDomains = (params: any) =>
  request({
    url: '/domain/targets',
    method: 'get',
    params
  })
