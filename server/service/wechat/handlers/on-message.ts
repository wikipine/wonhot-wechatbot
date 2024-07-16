/**
 * 消息处理处
 */
import type { Message, Wechaty } from "wechaty";
import { RuleReplyService } from '@/server/service/RuleReplyService';
import { MessageService } from '@/server/service/MessageService';
import { OrderService } from '@/server/service/OrderService';
import { getBotIdByName } from '@/server/utils/handler';
import type { OrderDO } from '~/types/dao';


export async function onMessage(this: Wechaty, message: Message) {
  const room = message.room();
  const text = message.text();
  const isSelf = message.self();
  const botId = getBotIdByName(this.name());
  
  // types.Message.Unknown 为 0 这种消息不处理
  if(message.type() == 0) {
    return;
  }
  
  // 消息记录添加 异步处理
  const messageService = new MessageService();
  messageService.addMessageRecord(message, botId).then(res=>{
    // 添加完成后执行的操作
    if(res) {
      const params: OrderDO = {
        bot_id: botId,
        msg_id: res.getDataValue('id'),
        uid: res.getDataValue('talker_id'),
        user_name: res.getDataValue('talker_name'),
        content: res.getDataValue('message_content'),
        time: res.getDataValue('message_at')
      }
      const service = new OrderService();
      service.addOrderRecord(params);
    }
  });
  // 回复处理 - 同步返回
  const ruleReplyService = new RuleReplyService();
  let replyContent = null;
  if (room) {
    replyContent = await ruleReplyService.getReplyContentByKeyword(text, true, room.payload?.topic as string);
  } else {
    replyContent = await ruleReplyService.getReplyContentByKeyword(text, false, "不存在的会话");
  }
  if(replyContent) {
    message.say(replyContent);
  }
}

export default onMessage;
