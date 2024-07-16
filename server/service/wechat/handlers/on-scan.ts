/**
 * 监听获取登录二维码用途
 */
import { ScanStatus } from 'wechaty';

export async function onScan (qrcode: string, status: ScanStatus) {
  return {
    qrcode,
    status
  }
}

export default onScan
