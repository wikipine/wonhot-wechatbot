/**
 * 登录成功监听事件
 */
import type { Wechaty } from 'wechaty';
import { log } from 'wechaty';
import { BotService } from '@/server/service/BotService';
import { getBotIdByName } from '@/server/utils/handler';

async function onLogin (this: Wechaty) {
  log.info('微信User登录成功:', this);
  // 设置最近登录的时间, botId 为 wx-{botId}, 故从3开始截取
  const botId = getBotIdByName(this.name());
  if(botId > 0) {
    const service = new BotService();
    await service.setBotHasLogin(botId);
  } else {
    log.info('登录成功，但是bot失败:', botId);
  }
}

export default onLogin
