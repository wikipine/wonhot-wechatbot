/**
 * 说明
 * 数据库表字段类型
 * 其他类型可基于此推演处理，非server层不要使用
 * created_at, updated_at, deleted_at 默认字段无需添加不处理，底层自动处理
 */

// 机器信息
export type BotDO = {
    id: number;
    alias: string;
    type: number;
    status: number;
    last_at: Date;
}

// 回复规则表
export type RuleReplyDO = {
    id: number;
    chat_name: string;
    chat_type: number;
    keyword: string;
    reply_type: string;
    reply_content: string;
    used_num: number;
}

// 订单表
export type OrderDO = {
    id?: number;
    bot_id: number;
    msg_id: number;
    uid: string;
    user_name: string;
    content: string;
    time: Date;
}