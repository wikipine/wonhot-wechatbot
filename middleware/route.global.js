import { noAuthPages } from "@/config/routes.ts";

export default defineNuxtRouteMiddleware((to, from) => {
  // 在服务器端跳过中间件
  if (process.server) {
    return;
  }
  const authStore = useStore.authStore();
  const token = authStore.getToken;
  // 如果是登录页面，但是已登录则跳转到首页
  if (token) {
    if (to.name === "account-login") {
      return navigateTo({ path: "/" });
    }
  } else {
    // 不在配置的页面均需要登录
    if (!noAuthPages.includes(to.name)) {
      return navigateTo({
        path: "/account/login",
        query: {
          redirect: to.path,
        },
      });
    }
  }
});
