/**
 * 微信机器人（单例实现）
 */
import { Wechaty, WechatyBuilder, ScanStatus, log } from "wechaty";
import onError from "~/server/service/wechat/handlers/on-error";
import onRoomjoin from "~/server/service/wechat/handlers/on-roomjoin";
import onLogout from "~/server/service/wechat/handlers/on-logout";
import onLogin from "~/server/service/wechat/handlers/on-login";
import onReady from "~/server/service/wechat/handlers/on-ready";
import onMessage from "~/server/service/wechat/handlers/on-message";
import onHeartBeat from "~/server/service/wechat/handlers/on-heartbeat";
import { getBotIdByName } from '@/server/utils/handler';


export class WechatBotService {
  private static instance: WechatBotService;
  private botInstances: { [key: number]: Wechaty } = {};

  // 私有化构造函数，防止外部实例化
  private constructor() {}

  // 获取单例实例的方法
  public static getInstance(): WechatBotService {
    if (!WechatBotService.instance) {
      WechatBotService.instance = new WechatBotService();
    }
    return WechatBotService.instance;
  }

  /**
   * 获取机器人实例
   * @param botId
   * @returns
   */
  getBotInstance(botId: number) {
    return this.botInstances[botId];
  }

  /**
   * 初始化一个机器人
   * @param botId
   */
  async init(botId: number) {
    // 检查是否已有该botId的实例
    if (this.botInstances[botId]) {
      return this.botInstances[botId];
    }
    const bot = WechatyBuilder.build({
      name: "wx-" + botId,
    });

    // 登录二维码获取 转移到 getScanQrcode 中 获取
    // bot.on('scan', (qrcode, status: ScanStatus) => {
    //     console.log('获取登录码：', status, qrcode);
    // })
    bot.on("login", onLogin);
    bot.on("ready", onReady);
    bot.on("logout", onLogout);
    bot.on("message", onMessage);
    bot.on("room-join", onRoomjoin);
    bot.on("error", (err: any) => {
      log.error("捕捉到🐛，如果还能正常运行，可以忽略", err);
      // 未登录情况下直接关闭机器人
      if (!bot.isLoggedIn) {
        const botId = getBotIdByName(bot.name());
        this.destroy(botId);
      }
    });
    bot.on("heartbeat", onHeartBeat)

    // 启动机器人
    await bot.start();
    // 启动成功后存储实例
    this.botInstances[botId] = bot;
    return bot;
  }

  /**
   * 获取登录二维码
   * @param botId
   */
  async getScanQrcode(botId: number) {
    const bot = this.botInstances[botId];
    if (!bot) {
      throw new Error("请先初始化机器人");
    }
    // 等待获取qrcode
    const waitForQrcode = new Promise<string>((resolve, reject) => {
      bot.on("scan", (qrcode: string, status: ScanStatus) => {
        console.log(status, qrcode);
        resolve(qrcode);
      });
      bot.on("error", (error: any) => {
        reject(error);
      });
    });
    const qrcode = await waitForQrcode;
    return qrcode;
  }

  /**
   * 销毁指定的机器人实例
   * @param botId
   */
  async destroy(botId: number) {
    const bot = this.botInstances[botId];
    if (bot) {
      await bot.stop();
      delete this.botInstances[botId];
      return true;
    } else {
      return true;
    }
  }

  /**
   * 销毁所有实例
   */
  async destroyAll() {
    Object.keys(this.botInstances).forEach((val) => {
      this.botInstances[Number(val)].stop();
    });
  }

  /**
   * 获取当前正在运行的客户端数量
   */
  getRunningClientsCount(): number {
    return Object.keys(this.botInstances).length;
  }
}
