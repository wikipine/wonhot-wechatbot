/**
 * 群中有人加入监听
 */
import { Contact, Room, log } from 'wechaty'

async function onRoomjoin (room: Room, inviteeList: Contact[], inviter: Contact) {
  log.info('有人加入群聊后的处理');
}
export default onRoomjoin
