import RuleReplyModel from '~/server/model/RuleReplyModel';
import type { CommonPageQueryType } from '~/types/request';
import type { RuleReplyAddFormType, RuleReplyUpdateFormType } from '~/types/request/rule';
import type { RuleReplyDO } from '~/types/dao';
import { ChatTypeEnum, ReplyTypeEnum } from '~/config/enum/RuleReplyEnum';
import { Op } from "sequelize";


export class RuleReplyService {

    /**
     * 获取规则配置分页列表
     */
    async getRulePageList(params: CommonPageQueryType) {
        let filter: any = {};
        if(params.keyword) {
            filter.keyword = {
                [Op.like]: `%${params.keyword}%`
            }
        }
        const { count, rows } = await RuleReplyModel.findAndCountAll({
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
     * 添加规则
     */
    async addRule(params: RuleReplyAddFormType) {
        // 验证参数
        this.validateParams(params);
        // new addData
        const addData: Omit<RuleReplyDO, 'id'> = {
            chat_name: params.chat_name,
            chat_type: params.chat_type,
            keyword: params.keyword,
            reply_type: params.reply_type,
            reply_content: params.reply_content,
            used_num: 0
        }
        const result = await RuleReplyModel.create(addData);
        return result;
    }
    
    /**
     * 编辑规则 
     */
    async updateRule(params: RuleReplyUpdateFormType) {
        if(!params.id) {
            throw new Error('id 参数不能为空');
        }
        const rowData:any = await RuleReplyModel.findByPk(params.id);
        if (rowData === null) {
            throw new Error('非法更新');
        }
        // 验证其他参数
        this.validateParams(params);
        // 设置需要更新的字段
        const updateData: Omit<RuleReplyUpdateFormType, 'id'> = {
            chat_name: params.chat_name,
            chat_type: params.chat_type,
            keyword: params.keyword,
            reply_type: params.reply_type,
            reply_content: params.reply_content,
        }
        const result = await RuleReplyModel.update(updateData, {
            where: {
                id: params.id
            }
        });
        return result;
    }
    
    /**
     * 删除规则
     */
    async deleteRuleById(id: number) {
        if(!id) {
            throw new Error('参数非法');
        }
        // 不存在就返回说明删除成功
        const rowData:any = await RuleReplyModel.findByPk(id);
        if (rowData === null) {
            return true
        }
        const result = await RuleReplyModel.destroy({
            where: {
                id: id
            }
        });
        return result;
    }

    // 参数验证
    validateParams(params: RuleReplyAddFormType | RuleReplyUpdateFormType) {
        if (!checkEnumTypeExist(ChatTypeEnum, params.chat_type)) {
            throw new Error('非法会话类型');
        }
        if (!params.chat_name && params.chat_type !== ChatTypeEnum.ALL) {
            throw new Error('会话名称不能为空');
        }
        if (!params.keyword) {
            throw new Error('关键词不能为空');
        }
        if (!checkEnumTypeExist(ReplyTypeEnum, params.reply_type)) {
            throw new Error('非法回复类型');
        }
        if (!params.reply_content) {
            throw new Error('回复内容不能为空');
        }
    }

    /**
     * 添加使用次数
     */
    async addUsedNumById(id: number) {
        await RuleReplyModel.increment(
            'used_num', 
            { 
                where: { id: id }
            }
        );
    }


    /**
     * 依据keyword回复内容
     * 匹配规则如下
     * 1. 若配置了多条规则，则按最后配置的一条生效
     * 2. 存在多条情况，私聊 & 群聊的规则大于全部
     */
    async getReplyContentByKeyword(keyword: string, isRoom: boolean, chatName: string) {
        // 机器测试单处理
        if(isRoom && chatName === '机器测试') {
            if(keyword.startsWith("3D")) {
                return '[' + keyword + "]已出单";
            }
        }
        let where: any = {};
        where.keyword = keyword;
        where.chat_name = chatName;
        where.chat_type = isRoom ? ChatTypeEnum.GROUP : ChatTypeEnum.PRIVATE;
        const record = await RuleReplyModel.findOne({
            where,
            order: [
                ['id', 'DESC'],
                ['chat_type', 'ASC']
            ],
        }) as RuleReplyDO | null;
        // 若记录存在，则直接返回
        if(record && record.id) {
            this.addUsedNumById(record.id);
            return record.reply_content;
        }
        // 不存在，查询一下全局匹配
        const otherRecord = await RuleReplyModel.findOne({
            where: {
                keyword,
                chat_type: ChatTypeEnum.ALL
            },
            order: [
                ['id', 'DESC'],
            ],
        }) as RuleReplyDO | null;
        if(otherRecord && otherRecord.id) {
            this.addUsedNumById(otherRecord.id);
            return otherRecord.reply_content;
        }
        return null;
    }
    
}