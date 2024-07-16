import { H3Event } from 'h3';
import { RuleReplyService } from '@/server/service/RuleReplyService';
import type { CommonPageQueryType } from '@/types/request';
import type { RuleReplyAddFormType, RuleReplyUpdateFormType } from '@/types/request/rule';
import { ErrorCodeEnum } from '~/config/enum/ErrorEnum';

/**
 * 获取规则分页列表
 */
export const getRuleReplyPageList = async (evt: H3Event) => {
    try {
        const { keyword, page, pageSize } = getQuery(evt);
        // 拼接请求参数
        const requestParam: CommonPageQueryType = {
            keyword: keyword as string,
            page: page ? Number(page) : 1,
            pageSize: pageSize ? Number(pageSize) : 20
        }
        // 查询分页列表
        const replyRuleService = new RuleReplyService();
        const rlt = await replyRuleService.getRulePageList(requestParam);
        return responseSuccess(rlt);
    } catch (err: any) {
        return responseError(ErrorCodeEnum.INTERNAL_SERVER_ERROR, err.message);
    }
}

/**
 * 添加回复规则
 */
export const addRuleReply = async (evt: H3Event) => {
    try {
        const body = await readBody(evt);
        let requestParam: RuleReplyAddFormType = {
            ...body
        }
        const replyRuleService = new RuleReplyService();
        const rlt = await replyRuleService.addRule(requestParam);
        return responseSuccess(rlt);
    } catch (err: any) {
        return responseError(ErrorCodeEnum.INTERNAL_SERVER_ERROR, err.message);
    }
}

/**
 * 更新回复规则
 */
export const updateRuleReply = async (evt: H3Event) => {
    try {
        const body = await readBody(evt);
        let requestParam: RuleReplyUpdateFormType = {
            ...body
        }
        const replyRuleService = new RuleReplyService();
        const rlt = await replyRuleService.updateRule(requestParam);
        return responseSuccess(rlt);
    } catch (err: any) {
        return responseError(ErrorCodeEnum.INTERNAL_SERVER_ERROR, err.message);
    }
}

/**
 * 删除回复规则
 */
export const deleteRuleReply = async (evt: H3Event) => {
    try {
        const { id } = await readBody(evt);
        if(!id) {
            return responseError(ErrorCodeEnum.BAD_REQUEST, 'id 参数不能为空');
        }
        const replyRuleService = new RuleReplyService();
        const rlt = await replyRuleService.deleteRuleById(id);
        return responseSuccess(rlt);
    } catch (err: any) {
        return responseError(ErrorCodeEnum.INTERNAL_SERVER_ERROR, err.message);
    }
}