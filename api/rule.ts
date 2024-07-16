import request from "@/tools/request";
import type { CommonPageQueryType } from '@/types/request';
import type { RuleReplyUpdateFormType } from '@/types/request/rule';

// 获取规则分页列表
export const getRuleReplyPageListApi = (params: CommonPageQueryType) => {
    return request.serverGet({
        url: '/rule/reply/page/list',
        params
    })
}

// 保存规则
export const saveRuleReplyApi = (data: RuleReplyUpdateFormType) => {
    let url = '/rule/reply/add';
    if(data.id && data.id > 0) {
        url = '/rule/reply/update';
    }
    return request.serverPost({
        url,
        data
    })
}

// 删除规则
export const deleteRuleReplyApi = (id: number) => {
    return request.serverPost({
        url: '/rule/reply/delete',
        data: {
            id
        }
    })
}