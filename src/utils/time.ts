import moment from 'moment'
moment.locale('zh-CN')

export const readableTimestamp = (timestamp: string) => {
  return moment(timestamp).fromNow()
}
