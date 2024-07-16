// 参考案例: https://github.com/hastackdev/nuxt3-blog/tree/master
import { useBase, createRouter, defineEventHandler } from 'h3';

import * as AuthController from '~/server/controller/AuthController';
import * as RulesController from '@/server/controller/RuleController';
import * as BotController from '@/server/controller/BotController';
import * as MessageController from '@/server/controller/MessageController';

const router = createRouter();

// 授权相关接口
router.post('/login', defineEventHandler(AuthController.login));
router.post('/loginout', defineEventHandler(AuthController.loginOut));

// 回复规则列表查询
router.get('/rule/reply/page/list', defineEventHandler(RulesController.getRuleReplyPageList));
router.post('/rule/reply/add', defineEventHandler(RulesController.addRuleReply));
router.post('/rule/reply/update', defineEventHandler(RulesController.updateRuleReply));
router.post('/rule/reply/delete', defineEventHandler(RulesController.deleteRuleReply));

// 机器人管理
router.get('/bot/page/list', defineEventHandler(BotController.getBotPageList));
router.post('/bot/add', defineEventHandler(BotController.addBot));
router.post('/bot/update', defineEventHandler(BotController.updateBot));
router.post('/bot/delete', defineEventHandler(BotController.deleteBot));
router.post('/bot/login', defineEventHandler(BotController.loginBot));
router.post('/bot/login/out', defineEventHandler(BotController.loginOutBot));

// 消息管理
router.get('/message/page/list', defineEventHandler(MessageController.getMessagePageList));
router.post('/message/send/test', defineEventHandler(MessageController.sendMessageTest));

export default useBase('/api', router.handler);