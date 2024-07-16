import request from "@/tools/request";
import type { CommonPageQueryType } from '@/types/request';
import type { BotUpdateFormType } from '@/types/request/bot';

// 获取机器人分页列表
export const getBotPageListApi = (params: CommonPageQueryType) => {
    return request.serverGet({
        url: '/bot/page/list',
        params
    })
}

// 保存机器人
export const saveBotApi = (data: BotUpdateFormType) => {
    let url = '/bot/add';
    if(data.id && data.id > 0) {
        url = '/bot/update';
    }
    return request.serverPost({
        url,
        data
    })
}

// 删除机器人
export const deleteBotApi = (id: number) => {
    return request.serverPost({
        url: '/bot/delete',
        data: {
            id
        }
    })
}

// 机器人登录
export const loginBotApi = (id: number) => {
    return request.serverPost({
        url: '/bot/login',
        data: {
            id
        }
    })
}

// 机器人退出登录
export const loginOutBotApi = (id: number) => {
    return request.serverPost({
        url: '/bot/login/out',
        data: {
            id
        }
    })
}