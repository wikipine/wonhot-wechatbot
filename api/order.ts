import request from "@/tools/request";
import type { CommonPageQueryType } from '@/types/request';

// 获取订单分页列表
export const getOrderPageListApi = (params: CommonPageQueryType) => {
    return request.serverGet({
        url: '/order/list',
        params
    })
}