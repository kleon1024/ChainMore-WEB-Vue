import request from '@/plugins/request'

export const signIn = (data: Record<string, string>) =>
  request({
    url: '/auth/signin',
    method: 'post',
    data
  })

export const signOut = () =>
  request({
    url: '/auth/signout',
    method: 'delete'
  })

export const refreshToken = (headers: any) =>
  request({
    url: '/auth/refresh',
    method: 'get',
    headers
  })
