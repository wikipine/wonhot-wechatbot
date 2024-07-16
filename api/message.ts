import request from "@/tools/request";
import type {MessagePageQueryType, MessageSendTestType} from '@/types/request/message';

// 获取消息分页列表
export const getMessagePageListApi = (params: MessagePageQueryType) => {
    return request.serverGet({
        url: '/message/page/list',
        params
    })
}

// 发送消息
export const sendMessageTestApi = (data: MessageSendTestType) => {
    return request.serverPost({
        url: '/message/send/test',
        data
    })
}