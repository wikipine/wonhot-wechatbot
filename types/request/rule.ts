/**
 * 回复规则表单类型
 */
import type { RuleReplyDO } from "@/types/dao";

// 规则添加的表单类型
export type RuleReplyAddFormType = Omit<RuleReplyDO, 'used_num' | 'id'>;

// 规则编辑的表单类型
export type RuleReplyUpdateFormType = Omit<RuleReplyDO, 'used_num'>;