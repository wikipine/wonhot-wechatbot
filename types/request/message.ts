import type { CommonPageQueryType } from "./index";
/**
 * 消息查询类型
 */
export type MessagePageQueryType = CommonPageQueryType & {
    botId: number;
}

/**
 * 消息发送测试类型
 */
export type MessageSendTestType = {
    bot_id: number;
    chat_name: string;
    chat_type: number;
    send_type: number;
    send_content: string;
}