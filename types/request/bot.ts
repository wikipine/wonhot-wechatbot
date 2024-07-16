/**
 * 机器人管理
 */
import type { BotDO } from "@/types/dao";

// 机器人添加
export type BotAddFormType = Omit<BotDO, 'id' | 'status' | 'last_at'>;

// 机器人编辑
export type BotUpdateFormType = Omit<BotDO, 'type' | 'status' | 'last_at'>;