import type { Wechaty } from 'wechaty';
import { log } from 'wechaty';
import { BotService } from '@/server/service/BotService';
import { getBotIdByName } from '@/server/utils/handler';

/**
 * 登出事件
 */
async function onLogout (this: Wechaty) {
  log.info('微信User登出成功:', this);
  // botId 为 wx-{botId}, 故从3开始截取
  const botId = getBotIdByName(this.name());
  if(botId > 0) {
    const service = new BotService();
    await service.setBotLoginOut(botId);
  }
}
export default onLogout
