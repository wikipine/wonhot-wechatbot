import { H3Event } from 'h3';
import { responseError, responseSuccess } from '@/server/utils';
import jwt from 'jsonwebtoken';
import { ErrorCodeEnum } from '~/config/enum/ErrorEnum';

/**
 * 登录授权
 */
export const login = async (evt: H3Event) => {
    try {
        const body = await readBody(evt);
        const config = useRuntimeConfig();
        // 暂时固定账号-密码
        const rightName = 'admin';
        const rightPwd = 'temp-W8g)gvnh3ykNz#8b';
        if(body.username === rightName && body.password === rightPwd) {
            // 过期时间，权限等信息
            const payload = { 
                user: 'admin',
                role: 'admin',
                expireTime: new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
            };
            const token = jwt.sign(payload, config.public['VITE_JWT_SECRET_KEY']);
            return responseSuccess(token);
        } else {
            return responseError(ErrorCodeEnum.BAD_REQUEST, '账号或密码错误');
        }
    } catch (err: any) {
        return responseError(ErrorCodeEnum.INTERNAL_SERVER_ERROR, err.message);
    }
}

/**
 * 退出登录
 */
export const loginOut = async (evt: H3Event) => {
    try {
        // 暂时无需处理
        return responseSuccess(true);
    } catch (err: any) {
        return responseError(ErrorCodeEnum.INTERNAL_SERVER_ERROR, err.message);
    }
}