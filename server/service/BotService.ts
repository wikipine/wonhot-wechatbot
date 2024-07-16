import BotModel from '~/server/model/BotModel';
import type { CommonPageQueryType } from '~/types/request';
import type { BotAddFormType, BotUpdateFormType } from '~/types/request/bot';
import type { BotDO } from '~/types/dao';
import { BotTypeEnum } from '~/config/enum/BotEnum';
import { Op } from "sequelize";
import { StatusEnum } from '~/config/enum';


export class BotService {

    /**
     * 获取机器人列表
     */
    async getBotPageList(params: CommonPageQueryType) {
        let filter: any = {};
        if(params.keyword) {
            filter.alias = {
                [Op.like]: `%${params.keyword}%`
            }
        }
        const { count, rows } = await BotModel.findAndCountAll({
            where: filter,
            order: [
                ['id', 'DESC']
            ],
            limit: params.pageSize,
            offset: ((params.page ?? 1) - 1) * (params.pageSize ?? 20)
        });
        return {
            total: count,
            page: params.page,
            pageSize: params.pageSize,
            list: rows
        };
    }
    
    /**
     * 添加机器人
     */
    async addBot(params: BotAddFormType) {
        // 验证参数
        if (!checkEnumTypeExist(BotTypeEnum, params.type)) {
            throw new Error('非法机器人类型');
        }
        if (!params.alias) {
            throw new Error('昵称不能为空');
        }
        // new addData
        const addData: BotAddFormType = {
            alias: params.alias,
            type: params.type
        }
        const result = await BotModel.create(addData);
        return result;
    }
    
    /**
     * 编辑机器人
     */
    async updateBot(params: BotUpdateFormType) {
        // 验证参数
        if (!params.alias) {
            throw new Error('昵称不能为空');
        }
        const updateData: Omit<BotUpdateFormType, 'id'> = {
            alias: params.alias,
        }
        const result = await BotModel.update(updateData, {
            where: {
                id: params.id
            }
        });
        return result;
    }

    /**
     * 删除机器人
     */
    async deleteBotById(id: number) {
        if(!id) {
            throw new Error('参数非法');
        }
        // 不存在就返回说明删除成功
        const rowData:any = await BotModel.findByPk(id);
        if (rowData === null) {
            return true
        }
        const result = await BotModel.destroy({
            where: {
                id: id
            }
        });
        return result;
    }
    
    /**
     * 依据ID获取类型
     */
    async getBotById(id: number) {
        const rowData = await BotModel.findByPk(id) as BotDO | null;
        return rowData;
    }
    
    /**
     * 设置机器人已登录
     */
    async setBotHasLogin(id: number) {
        const updateData = {
            status: StatusEnum.ENABLE,
            last_at: new Date()
        }
        await BotModel.update(updateData, {
            where: {
                id: id
            }
        });
    }    
    
    /**
     * 设置机器人登出
     */
    async setBotLoginOut(id: number) {
        const updateData = {
            status: StatusEnum.DISABLE,
            last_out_at: new Date()
        }
        await BotModel.update(updateData, {
            where: {
                id: id
            }
        });
    }
    
    /**
     * 设置机器人存活状态
     */
    async setBotHeartBeatAt(id: number) {
        const updateData = {
            heartbeat_at: new Date(),
        }
        await BotModel.update(updateData, {
            where: {
                id: id
            }
        });
    }
    
}