<style lang="scss" scoped>
@import "./index.scss";
</style>
<template>
    <div class="login-container">
        <h1>登录页面</h1>
        <n-form ref="formRef" :model="formData" :rules="formRules" size="large">
            <n-form-item path="username" label="用户名">
                <n-input v-model:value="formData.username" placeholder="用户名" />
            </n-form-item>
            <n-form-item path="password" label="密码">
                <n-input v-model:value="formData.password" type="password" placeholder="密码" />
            </n-form-item>
            <n-form-item>
                <n-button type="primary" :loading="submitLoading" @click="onSubmit()">验证</n-button>
            </n-form-item>
        </n-form>
    </div>
</template>
<script setup>
import { useMessage } from 'naive-ui';
import { handleLoginApi } from "~/api/account";
definePageMeta({
    layout: 'empty'
})
const message = useMessage();
const authStore = useStore.authStore();

const formRef = ref();
const formData = reactive({ username: '', password: '' })
const formRules = {
    username: { 
        required: true,
        message: '用户名不能为空',
        trigger: ['input', 'blur']
    },
    password: {
        required: true,
        message: '密码不能为空',
        trigger: ['input', 'blur']
    },
};
const submitLoading = ref(false);
// 执行登录提交
const onSubmit = () => {
    formRef.value?.validate((errors) => {
        if (errors) {
            return;
        }
        submitLoading.value = true;
        handleLoginApi(formData).then(res=>{
            if(true === res.success) {
                message.success('登录成功');
                // 前往操作页面
                authStore.handleLoginComplete(res.data);
            }
        }).finally(()=>{
            submitLoading.value = false;
        })
    })
}
</script>