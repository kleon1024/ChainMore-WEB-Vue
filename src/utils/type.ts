const resourceName = {
  article: '讨论',
  course: '课程',
  book: '书籍',
  tutorial: '教程/步骤',
  research: '研究',
  share: '分享',
  art: '艺术作品'
}

const mediaName = {
  text: '文字',
  image: '图片',
  audio: '音频',
  video: '视频'
}

export const badgeUrl = (resourceType: string, mediaType: string) => {
  const baseUrl = 'https://img.shields.io/badge/'
  return baseUrl + mediaName[mediaType] + '-' + resourceName[resourceType] + '-teal.svg'
}
