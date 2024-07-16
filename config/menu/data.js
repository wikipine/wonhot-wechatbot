import { h } from 'vue';
import { Icon } from '#components';

export const menuOptions = [
    {
        name: "dashboard",
        label: "仪表盘",
        icon: () => {
            return h(Icon, { name: 'uil:file-info-alt', size: '18' })
        }
    },
    {
        name: "bot",
        label: "机器人",
        icon: () => {
            return h(Icon, { name: 'uil:file-info-alt', size: '18' })
        }
    },
    {
        name: "rule-reply",
        label: "回复规则",
        icon: () => {
            return h(Icon, { name: 'uil:file-info-alt', size: '18' })
        }
    },
    {
        name: "message-list",
        label: "消息列表",
        icon: () => {
            return h(Icon, { name: 'uil:file-info-alt', size: '18' })
        }
    },
    {
        name: "message-send",
        label: "发送消息",
        icon: () => {
            return h(Icon, { name: 'uil:file-info-alt', size: '18' })
        }
    }
];