<style lang="scss" scoped>
.index-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
<template>
  <div class="index-container">
    <h1>欢迎来到微信 Bot beta 管理系统</h1>
    <div v-if="token" style="display: flex; gap: 10px; flex-direction: column; align-items: center;">
      <div>欢迎您，Admin</div>
      <n-button size="large" type="primary" @click="router.push({ name: 'dashboard'})">前往使用</n-button>
    </div>
    <div v-else style="display: flex; gap: 10px; flex-direction: column; align-items: center;">
      <div>系统检测到还未登录，请先登录</div>
      <n-button style="width: 100px;" @click="router.push('/account/login')">前往登录</n-button>
    </div>
  </div>
</template>
<script setup>
definePageMeta({
  layout: 'empty'
})
const authStore = useStore.authStore();
const router = useRouter();

const token = ref('');

onMounted(() => {
  token.value = authStore.getToken;
  if(authStore.getToken) {
    router.push('/dashboard');
  }
})
</script>