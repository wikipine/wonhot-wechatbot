import request from "@/tools/request";
import type { LoginFormType } from '@/types/request/auth';

// 执行登录操作
export const handleLoginApi = (data: LoginFormType) => {
    return request.serverPost({
        url: '/login',
        data
    })
}

// 执行退出登录
export const handleLoginOutApi = () => {
    return request.serverPost({
        url: '/loginout'
    })
}