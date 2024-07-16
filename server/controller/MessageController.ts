import {H3Event} from 'h3';
import {MessageService} from '@/server/service/MessageService';
import type {MessagePageQueryType, MessageSendTestType} from '@/types/request/message';
import {ErrorCodeEnum} from '~/config/enum/ErrorEnum';
import {WechatBotService} from "~/server/service/wechat/service";

/**
 * 获取消息分页列表
 */
export const getMessagePageList = async (evt: H3Event) => {
    try {
        const {
            botId,
            keyword,
            page,
            pageSize
        } = getQuery(evt);
        // 拼接请求参数
        const requestParam: MessagePageQueryType = {
            botId: Number(botId),
            keyword: keyword as string,
            page: page ? Number(page) : 1,
            pageSize: pageSize ? Number(pageSize) : 20
        }
        // 查询分页列表
        const messageService = new MessageService();
        const rlt = await messageService.getMessageListByBotId(requestParam);
        return responseSuccess(rlt);
    } catch (err: any) {
        return responseError(ErrorCodeEnum.INTERNAL_SERVER_ERROR, err.message);
    }
}

/**
 * 消息发送测试
 */
export const sendMessageTest = async (evt: H3Event) => {
    try {
        const body = await readBody(evt);
        let requestParam: MessageSendTestType = {
            ...body
        }
        const botId = requestParam.bot_id;
        const chatName = requestParam.chat_name;
        // 1 获取机器人实例
        const bot = WechatBotService.getInstance();
        const botInstance = bot.getBotInstance(botId);
        if(!botInstance) {
            return responseError(ErrorCodeEnum.BAD_REQUEST, '机器人未登录，请先登录');
        }
        // 0 群聊 1 私聊
        if(requestParam.chat_type === 1) {
            const contact = await botInstance.Contact.find({name: chatName});
            if(contact) {
                await contact.say(requestParam.send_content);
                return responseSuccess(true);
            } else {
                return responseError(ErrorCodeEnum.BAD_REQUEST, '未找到联系人【' + chatName + '】');
            }
        } else {
            const room = await botInstance.Room.find({topic: chatName});
            if(room) {
                await room.say(requestParam.send_content);
                return responseSuccess(true);
            } else {
                return responseError(ErrorCodeEnum.BAD_REQUEST, '未找到群【' + chatName + '】');
            }
        }

    } catch (err: any) {
        return responseError(ErrorCodeEnum.INTERNAL_SERVER_ERROR, err.message);
    }
}