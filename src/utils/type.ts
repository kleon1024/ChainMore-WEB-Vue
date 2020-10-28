import { GlobalModule } from '@/store/modules/global'

export const badgeUrl = (resourceType, mediaType) => {
  const baseUrl = 'https://img.shields.io/badge/'
  return baseUrl + GlobalModule.mediaTypeMap[mediaType].name_zh_cn + '-' + GlobalModule.resourceTypeMap[resourceType].name_zh_cn + '-teal.svg'
}
