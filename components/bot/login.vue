
<template>
    <n-modal v-model:show="showModal" transform-origin="center" :auto-focus="false" @mask-click="emitClose()">
        <n-card style="width: 500px" :title="'扫码登录【' + info.alias + '】'" :bordered="false">
            <template #header-extra>
                <n-button quaternary circle :focusable="false" @click="emitClose()">
                    <Icon name="material-symbols:close-rounded" size="22" />
                </n-button>
            </template>
            <div style="display: flex; justify-content: center; align-items: center; height: 200px">
                <n-spin v-if="searchLoading"></n-spin>
                <div v-else>
                    <img v-if="qrcodeUrl" class="qrcode-img" :src="qrcodeImg" alt="微信登录二维码" />
                    <div v-else>
                        获取登录二维码失败
                    </div>
                </div>
            </div>
            <template #footer>
                <div style="text-align: center;">
                    <n-button type="primary" @click="emitSuccess()">成功后点击</n-button>
                </div>
            </template>
        </n-card>
    </n-modal>
</template>
<script setup>
import useState from "@/hooks/useState";
import to from "await-to-js";
import { loginBotApi } from "~/api/bot";
import { useQRCode } from '@vueuse/integrations/useQRCode';

const props = defineProps(['visible', 'info']);
const emit = defineEmits(['close', 'success']);
const emitClose = () => {
    setShowModal(false);
    emit('close');
}
const emitSuccess = () => {
    emit('success');
    emitClose();
}

const [showModal, setShowModal] = useState(false);
const [searchLoading, setSearchLoading] = useState(false);
const qrcodeUrl = ref('');
const qrcodeImg = useQRCode(qrcodeUrl);

onMounted(() => {
    setShowModal(props.visible);
    if(props.visible) {
        searchQrcode();
    }
})

// 确认提交
const searchQrcode = async () => {
    setSearchLoading(true);
    const [err, res] = await to(loginBotApi(props.info['id']));
    setSearchLoading(false);
    if(err || !res.success) {
        return;
    }
    qrcodeUrl.value = res.data;
}
</script>