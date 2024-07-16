import { H3Event } from 'h3';
import { responseError, responseSuccess } from '@/server/utils';
import { ErrorCodeEnum } from '~/config/enum/ErrorEnum';
import type { CommonPageQueryType } from '@/types/request';
import type { BotAddFormType, BotUpdateFormType } from '@/types/request/bot';
import { BotService } from '@/server/service/BotService';
import { WechatBotService } from '../service/wechat/service';

/**
 * 获取机器人列表
 */
export const getBotPageList = async (evt: H3Event) => {
    try {
        const { keyword, page, pageSize } = getQuery(evt);
        // 拼接请求参数
        const requestParam: CommonPageQueryType = {
            keyword: keyword as string,
            page: page ? Number(page) : 1,
            pageSize: pageSize ? Number(pageSize) : 20
        }
        // 查询分页列表
        const service = new BotService();
        const rlt = await service.getBotPageList(requestParam);
        return responseSuccess(rlt);
    } catch (err:any) {
        return responseError(ErrorCodeEnum.INTERNAL_SERVER_ERROR, err.message);
    }
}

/**
 * 添加机器人
 */
export const addBot = async (evt: H3Event) => {
    try {
        const body = await readBody(evt);
        let requestParam: BotAddFormType = {
            ...body
        }
        const service = new BotService();
        const rlt = await service.addBot(requestParam);
        return responseSuccess(rlt);
    } catch (err: any) {
        return responseError(ErrorCodeEnum.INTERNAL_SERVER_ERROR, err.message);
    }
}

/**
 * 更新机器人
 */
export const updateBot = async (evt: H3Event) => {
    try {
        const body = await readBody(evt);
        let requestParam: BotUpdateFormType = {
            ...body
        }
        const service = new BotService();
        const rlt = await service.updateBot(requestParam);
        return responseSuccess(rlt);
    } catch (err: any) {
        return responseError(ErrorCodeEnum.INTERNAL_SERVER_ERROR, err.message);
    }
}

/**
 * 删除机器人
 */
export const deleteBot = async (evt: H3Event) => {
    try {
        const { id } = await readBody(evt);
        if(!id) {
            return responseError(ErrorCodeEnum.BAD_REQUEST, 'id 参数不能为空');
        }
        // 删除前先退出机器人
        const bot = WechatBotService.getInstance();
        await bot.destroy(id);
        // 删除记录
        const service = new BotService();
        const rlt = await service.deleteBotById(id);
        return responseSuccess(rlt);
    } catch (err: any) {
        return responseError(ErrorCodeEnum.INTERNAL_SERVER_ERROR, err.message);
    }
}

/**
 * 登录机器人
 */
export const loginBot = async (evt: H3Event) => {
    try {
        const { id } = await readBody(evt);
        if(!id) {
            return responseError(ErrorCodeEnum.BAD_REQUEST, 'id 参数不能为空');
        }
        const service = new BotService();
        const record = await service.getBotById(id);
        if(null === record) {
            return responseError(ErrorCodeEnum.NOT_FOUND, '机器人不存在');
        }
        // 当前仅支持微信，估无需判断type
        const bot = WechatBotService.getInstance();
        // 如果存在，则先销毁
        if(bot.getBotInstance(id)) {
            await bot.destroy(id);
        }
        // 初始化机器人
        await bot.init(record.id);
        const qrcode = await bot.getScanQrcode(record.id);
        return responseSuccess(qrcode);
    } catch (err: any) {
        return responseError(ErrorCodeEnum.INTERNAL_SERVER_ERROR, err.message);
    }
}

/**
 * 退出登录
 * 监听中已实现登录，此处为手动补偿
 */
export const loginOutBot = async (evt: H3Event) => {
    try {
        const { id } = await readBody(evt);
        if(!id) {
            return responseError(ErrorCodeEnum.BAD_REQUEST, 'id 参数不能为空');
        }
        const service = new BotService();
        const record = await service.getBotById(id);
        if(null === record) {
            return responseError(ErrorCodeEnum.NOT_FOUND, '机器人不存在');
        }
        // 退出机器人
        const bot = WechatBotService.getInstance();
        await bot.destroy(id);
        // 设置退出状态
        await service.setBotLoginOut(id);
        return responseSuccess(true);
    } catch (err: any) {
        return responseError(ErrorCodeEnum.INTERNAL_SERVER_ERROR, err.message);
    }
}