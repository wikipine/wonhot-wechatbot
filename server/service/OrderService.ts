import OrderModel from "~/server/model/OrderModel";
import type { OrderDO } from "~/types/dao";
import type { CommonPageQueryType } from '~/types/request';
import { handleChoiceMessage } from "@/tools/handler";
import { MessageService } from '@/server/service/MessageService';
import { Op } from "sequelize";

export class OrderService {

  /**
   * 添加订单记录
   */
  async addOrderRecord(params: OrderDO) {
    const contentRes = handleChoiceMessage(params.content);
    // 非订单消息，过滤
    if (!contentRes) {
      return;
    }
    // 判断是否属于订单
    const addData = {
      bot_id: params.bot_id,
      msg_id: params.msg_id,
      uid: params.uid,
      user_name: params.user_name,
      content: params.content,
      time: params.time,
      status: 0,
    };
    const result = await OrderModel.create(addData);
    // todo 回写Message已处理？
    return result;
  }

  /**
   * 获取订单列表(按指定日期获取)
   */
  async getOrderDailyList(params: CommonPageQueryType) {

    // 依据当前的日期获得今日起始的日期
    const dateTime = params.dateTime ? Number(params.dateTime) : new Date().getTime();
    const inputDate = new Date(dateTime);
    const startOfDay = new Date(inputDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(inputDate);
    endOfDay.setHours(24, 0, 0, 0);

    const rows = await OrderModel.findAll({
      where: {
        time: {
            [Op.between]: [startOfDay, endOfDay]
        }
      },
      order: [["id", "DESC"]],
    });
    // 批量返回实际消息
    const msgIds = rows.map(item => item.msg_id);
    if(msgIds.length > 0) {
        const messageService = new MessageService();
        const messageObj = await messageService.getMessageListByIds(msgIds);
        rows.forEach((item) => {
            item.dataValues['message_body'] = messageObj[item.msg_id] ?? null;
        })
    }
    return rows;
  }
}
