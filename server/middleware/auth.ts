/**
 * 备注：Nuxt3 中间件的执行顺序是按文件的顺序执行，当前仅需要用到auth
 * 接口鉴权中间件 跨域 & 鉴权处理
 * 非登录请求均需要鉴权处理
 */
import jwt from 'jsonwebtoken';
import { ErrorCodeEnum, ErrorCodeInfoEnum } from '~/config/enum/ErrorEnum';

// 无需校验权限的接口
const noAuthAPI = ['/api/login', '/api/loginout'];

export default defineEventHandler(async (event) => {
    const urlObj = getRequestURL(event);
    const headerObj = getHeaders(event);
    // 仅处理 api 请求
    if(urlObj.pathname.startsWith('/api')) {
        if(!noAuthAPI.includes(urlObj.pathname)) {
            if(!headerObj['access-token']) {
                return responseError(ErrorCodeEnum.UNAUTHORIZED, ErrorCodeInfoEnum.UNAUTHORIZED);
            }
            const config = useRuntimeConfig();
            // 解构一下token
            const res = await jwt.verify(headerObj['access-token'], config.public['VITE_JWT_SECRET_KEY']);
            if(!res.expireTime || new Date().getTime() > res.expireTime) {
                return responseError(ErrorCodeEnum.UNAUTHORIZED, ErrorCodeInfoEnum.UNAUTHORIZED);
            }
        }
    }
});
