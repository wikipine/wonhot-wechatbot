<style scoped lang="scss">

</style>
<template>
  <div>
    <n-alert type="info">
      机器人主动发送消息(测试使用，一般来说机器人不需要主动发送消息)
    </n-alert>
    <div style="margin: 12px auto; width: 80%;">
      <n-form ref="formRef" label-placement="left" label-width="200px" :model="formData" :rules="formRules">
        <n-form-item label="机器人ID" path="bot_id">
          <n-input type="text" v-model:value="formData.bot_id" placeholder="机器人ID"/>
        </n-form-item>
        <n-form-item label="会话类型" path="chat_type">
          <n-radio-group v-model:value="formData.chat_type">
            <n-space>
              <n-radio :value="0">群聊</n-radio>
              <n-radio :value="1">私聊</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item label="聊天室名称" path="chat_name">
          <n-input type="text" v-model:value="formData.chat_name" placeholder="聊天室名称"/>
        </n-form-item>
        <n-form-item label="发送类型" path="send_type">
          <n-radio-group v-model:value="formData.send_type">
            <n-space>
              <n-radio :value="0">固定文本</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item label="发送内容" path="send_content">
          <n-input type="textarea" v-model:value="formData.send_content" placeholder="发送内容"/>
        </n-form-item>
        <n-form-item label=" ">
          <n-button type="primary" :loading="submitLoading" @click="onSubmit">确认发送</n-button>
        </n-form-item>
      </n-form>
    </div>
  </div>
</template>
<script setup>
import { useMessage } from "naive-ui";
import to from "await-to-js";
import { sendMessageTestApi } from "~/api/message";
const message = useMessage();

const formRef = ref();
const formData = reactive({
  bot_id: '',
  chat_name: '',
  chat_type: 0,
  send_type: 0,
  send_content: '',
})
const formRules = {
  bot_id: {
    required: true,
    message: '请输入机器人ID',
    trigger: ['input', 'blur']
  },
  chat_name: {
    required: true,
    message: '请输入会话名称',
    trigger: ['input', 'blur']
  },
  send_content: {
    required: true,
    message: '请填写回复的内容',
    trigger: ['input', 'blur']
  },
};
const submitLoading = ref(false);

// 确认提交
const onSubmit = () => {
  formRef.value?.validate(async (errors) => {
    if (errors) {
      return;
    }
    submitLoading.value = true;
    const [err, res] = await to(sendMessageTestApi(formData));
    submitLoading.value = false;
    if(err || !res.success) {
      return;
    }
    message.success('发送成功');
  })
}
</script>