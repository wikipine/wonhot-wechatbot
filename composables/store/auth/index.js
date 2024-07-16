import { defineStore } from "pinia";
import { handleLoginOutApi } from "~/api/account";

export const authStore = defineStore("authStore", {
    state: () => {
        return {
            token: '',
        }
    },
    getters: {
        getToken: (state) => {
            let token = state.token;
            // 不存在尝试从本地缓存中读取
            if(!token) {
                const { $localCache } = useNuxtApp();
                token = $localCache.getCache('token');
            }
            state.token = token;
            return token;
        }
    },
    actions: {
        // 设置Token
        setToken(data) {
            const { $localCache } = useNuxtApp();
            $localCache.setCache('token', data);
        },
        /**
         * 登录完成后操作
         */
        handleLoginComplete(data) {
            const { $localCache } = useNuxtApp();
            const router = useRouter();
            // token持久化处理
            this.setToken(data);
            // 获取缓存的回跳地址
            const callBackUrl = $localCache.getCache('callBackUrl');
            if(callBackUrl) {
                router.push(callBackUrl);
            } else {
                router.push("/");
            }
        },
        // 退出登录
        loginOut() {
            const { $localCache } = useNuxtApp();
            const router = useRouter();
            // 执行后端删除缓存
            handleLoginOutApi();
            $localCache.clearCache('token');
            router.push('/');
        }
    }
})