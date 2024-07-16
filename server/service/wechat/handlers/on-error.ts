/**
 * 错误监听事件
 */
import { log, Wechaty } from 'wechaty'

async function onError (this: Wechaty, error:any) {
  // 未登录情况下，直接退出机器人
  // console.log('error wechaty', this);
  log.error('捕捉到🐛，如果还能正常运行，可以忽略', error)
  console.log('登录情况：', this.isLoggedIn)
  if(!this.isLoggedIn) {
    throw new Error('请执行关闭机器人操作');
  }
}
export default onError
