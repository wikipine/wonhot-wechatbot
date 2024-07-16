/**
 * 准备好的事件监听
 */
import type { Wechaty } from 'wechaty';
import { log } from 'wechaty';

async function onReady (this:Wechaty) {
  log.info('准备好的事件');
}

export default onReady
