<template>
    <n-modal v-model:show="showModal" transform-origin="center" :auto-focus="false" @mask-click="emitClose()">
        <n-card style="width: 500px" title="添加机器人" :bordered="false">
            <template #header-extra>
                <n-button quaternary circle :focusable="false" @click="emitClose()">
                    <Icon name="material-symbols:close-rounded" size="22" />
                </n-button>
            </template>
            <n-form ref="formRef" :model="formData" :rules="formRules">
                <n-form-item label="建议与微信同名，方便识别" path="alias" :show-require-mark="false">
                    <n-input type="text" v-model:value="formData.alias" placeholder="输入别名即可创建机器人" />
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
import { saveBotApi } from "~/api/bot";
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
    alias: '',
    type: 0
})
const formRules = {
    alias: {
        required: true,
        message: '请输入别名',
        trigger: ['input', 'blur']
    }
};

onMounted(() => {
    setShowModal(props.visible);
    if(props.formParam?.id > 0) {
        for(const i in formData) {
            formData[i] = props.formParam[i];
        }
    } else {
        formData.id = 0;
        formData.alias = '';
        formData.type = 0;
    }
})


// 确认提交
const onConfirm = () => {
    formRef.value?.validate(async (errors) => {
        if (errors) {
            return;
        }
        setSubmitLoading(true);
        const [err, res] = await to(saveBotApi(formData));
        setSubmitLoading(false);
        if(err || !res.success) {
            return;
        }
        message.success(formData.id > 0 ? '编辑成功': '添加成功');
        emitSuccess();
    })
}
</script>