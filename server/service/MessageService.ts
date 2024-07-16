import MessageModel from '~/server/model/MessageModel';
import type { Message } from "wechaty";
import { Op } from "sequelize";

export class MessageService {

    /**
     * 添加消息记录
     */
    async addMessageRecord(message: Message, botId: number) {
        const talker = message.talker();
        const listener = message.listener();
        const room = message.room();

        const addData = {
            bot_id: botId,
            talker_id: talker.id,
            talker_name: talker.name(),
            // 头像需要解析暂不处理
            talker_avatar: '',
            talker_gender: talker.gender() ?? 0,
            talker_alias: await talker.alias() ?? '',
            listener_id: listener?.id,
            listener_name: listener?.name(),
            // 头像需要解析暂不处理
            listener_avatar: '',
            listener_genger: listener?.gender() ?? 0,
            listener_alias: await listener?.alias() ?? '',
            room_id: room?.id,
            room_name: room?.payload?.topic as string,
            room_avatar: '',
            message_id: message.id,
            message_type: message.type(),
            message_content: message.text(),
            message_at: message.date()
        }
        const result = await MessageModel.create(addData);
        return result;

    }

    /**
     * 依据Ids获取message对象
     */
    async getMessageListByIds(ids: number[]) {
        const res = await MessageModel.findAll({
            where: {
                id: {
                    [Op.in]: ids
                }
            }
        });
        const resultObj = {};
        res.forEach(item => {
            resultObj[item.id] = {
                id: item.id,
                bot_id: item.bot_id,
                talker_id: item.talker_id,
                talker_name: item.talker_name,
                talker_alias: item.talker_alias,
                room_id: item.room_id,
                room_name: item.room_name,
                listener_id: item.listener_id,
                listener_name: item.listener_name,
                listener_alias: item.listener_alias,
            };
        })
        return resultObj;
    }
    
}