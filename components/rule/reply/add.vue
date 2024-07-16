<template>
    <n-modal v-model:show="showModal" transform-origin="center" :auto-focus="false" @mask-click="emitClose()">
        <n-card style="width: 600px" :title="formData.id > 0 ? '编辑规则' : '添加规则'" :bordered="false">
            <template #header-extra>
                <n-button quaternary circle :focusable="false" @click="emitClose()">
                    <Icon name="material-symbols:close-rounded" size="22" />
                </n-button>
            </template>
            <div v-if="formData.chat_type === 2" style="padding-bottom: 12px;">
                <n-alert type="info">您当前配置了适用所有会话的规则，注意甄别</n-alert>
            </div>
            <n-form ref="formRef" :model="formData" :rules="formRules">
                <n-form-item label="会话类型" path="chat_type">
                    <n-radio-group v-model:value="formData.chat_type">
                        <n-space>
                            <n-radio :value="0">群聊</n-radio>
                            <n-radio :value="1">私聊</n-radio>
                            <n-radio :value="2">所有</n-radio>
                        </n-space>
                    </n-radio-group>
                </n-form-item>
                <n-form-item v-if="formData.chat_type !== 2" label="会话名称" path="chat_name">
                    <n-input type="text" v-model:value="formData.chat_name" placeholder="聊天室名称" />
                </n-form-item>
                <n-form-item label="关键词" path="keyword">
                    <n-input type="text" v-model:value="formData.keyword" placeholder="触发的关键" />
                </n-form-item>
                <n-form-item label="回复类型" path="reply_type">
                    <n-radio-group v-model:value="formData.reply_type">
                        <n-space>
                            <n-radio :value="0">固定文本</n-radio>
                        </n-space>
                    </n-radio-group>
                </n-form-item>
                <n-form-item label="回复内容" path="reply_content">
                    <n-input type="textarea" v-model:value="formData.reply_content" placeholder="触发关键词后回复的内容" />
                </n-form-item>
            </n-form>
            <template #footer>
                <n-flex justify="end">
                    <n-button 
                        type="primary" 
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
import { saveRuleReplyApi } from "~/api/rule";
const message = useMessage();

const props = defineProps(['visible', 'formParam']);
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
const formRef = ref();
const formData = reactive({
    id: 0,
    chat_name: '',
    chat_type: 0,
    keyword: '',
    reply_type: 0,
    reply_content: '',
})
const formRules = {
    chat_name: {
        required: true,
        message: '请输入会话名称',
        trigger: ['input', 'blur']
    },
    keyword: {
        required: true,
        message: '请输入触发关键词',
        trigger: ['input', 'blur']
    },
    reply_content: {
        required: true,
        message: '请填写回复的内容',
        trigger: ['input', 'blur']
    },
};

onMounted(() => {
    setShowModal(props.visible);
    if(props.formParam?.id > 0) {
        for(const i in formData) {
            formData[i] = props.formParam[i];
        }
    } else {
        formData.id = 0;
        formData.chat_name = '';
        formData.chat_type = 0;
        formData.keyword = '';
        formData.reply_type = 0;
        formData.reply_content = '';
    }
})


// 确认提交
const onConfirm = () => {
    formRef.value?.validate(async (errors) => {
        if (errors) {
            return;
        }
        setSubmitLoading(true);
        const [err, res] = await to(saveRuleReplyApi(formData));
        setSubmitLoading(false);
        if(err || !res.success) {
            return;
        }
        message.success(formData.id > 0 ? '编辑成功': '添加成功');
        emitSuccess();
    })
}
</script>