<template>
    <n-modal v-model:show="showModal" transform-origin="center" :auto-focus="false" @mask-click="emitClose()">
        <n-card style="width: 500px" title="删除机器人" :bordered="false">
            <template #header-extra>
                <n-button quaternary circle :focusable="false" @click="emitClose()">
                    <Icon name="material-symbols:close-rounded" size="22" />
                </n-button>
            </template>
            确认删除此机器人【{{ info['alias'] }}】吗？若此机器人正在使用，将会自动退出
            <template #footer>
                <n-flex justify="end">
                    <n-button 
                        type="error" 
                        size="large"
                        :loading="submitLoading" 
                        style="width: 100px"
                        @click="onConfirm()">确认</n-button>
                </n-flex>
            </template>
        </n-card>
    </n-modal>
</template>
<script setup>
import useState from "@/hooks/useState";
import { useMessage } from "naive-ui";
import to from "await-to-js";
import { deleteBotApi } from "~/api/bot";
const message = useMessage();

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
const [submitLoading, setSubmitLoading] = useState(false);

onMounted(() => {
    setShowModal(props.visible);
})

// 确认提交
const onConfirm = async () => {
    setSubmitLoading(true);
    const [err, res] = await to(deleteBotApi(props.info['id']));
    setSubmitLoading(false);
    if(err || !res.success) {
        return;
    }
    message.success('操作成功');
    emitSuccess();
}
</script>