/**
 * 心跳检测
 */
import type { Wechaty } from 'wechaty';
import { log } from 'wechaty';
import { BotService } from '@/server/service/BotService';

async function onHeartBeat (this: Wechaty, data) {
  log.info('心跳检测');
  console.log(data);
  const type = data.split(':')[1];
  // botId 为 wx-{botId}, 故从3开始截取
  const botId = getBotIdByName(this.name());
  if(botId > 0 && type === 'normal') {
    const service = new BotService();
    await service.setBotHeartBeatAt(botId);
  }
}
export default onHeartBeat
