import { H3Event } from 'h3';
import { OrderService } from '@/server/service/OrderService';
import type { OrderSearchType } from '@/types/request/order';
import { ErrorCodeEnum } from '~/config/enum/ErrorEnum';

/**
 * 获取订单列表
 */
export const getOrderList = async (evt: H3Event) => {
    try {
        const { dateTime } = getQuery(evt);
        // 拼接请求参数
        const requestParam: OrderSearchType = {
            dateTime: dateTime
        }
        // 查询分页列表
        const orderService = new OrderService();
        const rlt = await orderService.getOrderDailyList(requestParam);
        return responseSuccess(rlt);
    } catch (err: any) {
        return responseError(ErrorCodeEnum.INTERNAL_SERVER_ERROR, err.message);
    }
}