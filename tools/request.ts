import { hash } from 'ohash';
import qs from 'qs';
import { createDiscreteApi } from 'naive-ui';
const { message } = createDiscreteApi(
    ['message']
)

type FetchOptionType = {
    method: string,
    url: string,
    headers?: any,
    params?: any,
    data?: any
}

type FetchType = 'client' | 'server';

/**
 * 定义Options对象
 */
export type RequestOptionType = {
    method: string;
    params?: any;
    body?: any;
    headers?: { [key: string]: string };
}

/**
 * 定义ResponseDataType
 */
export type ResponseDataType = {
    success: boolean;
    data: any;
    errorCode: number;
    errorInfo: string;
}

// 实际请求方法
const fetch = (type : FetchType, {method, url, headers, params, data}: FetchOptionType): Promise<ResponseDataType>  => {
    let options: RequestOptionType = {
        method,
        params: params ? params : {}
    }    
    if(data) {
        options['body'] = data;
    }
    if(headers) {
        options['headers'] = headers;
    }
    if (method === 'post' 
        && options['headers'] 
        && options['headers']['Content-Type'] === 'application/x-www-form-urlencoded'
        && options['body']
    ) {
        options['body'] = qs.stringify(options['body']);
    }
    // 设置token
    const authStore = useStore.authStore();
    const token = authStore.getToken;
    if(options['headers']) {
        options['headers']['access-token'] = token
    } else {
        options['headers'] = {
            'access-token': token
        }
    }
    // 链接处理
    const config = useRuntimeConfig();
    // let reqUrl = type === 'server' ? '/api' : config.public['VITE_CLIENT_BASE_URL'] as string;
    // if(url) {
    //     reqUrl += url;
    // }
    // 不设置key，始终拿到的都是第一个请求的值，参数一样则不会进行第二次请求
    const key = hash(JSON.stringify(options));
    if(options['params']){
        options['params']['t'] = new Date().getTime();
    } else {
        options['params'] = {
            t: new Date().getTime()
        }
    }
    return new Promise<ResponseDataType>((resolve, reject) => {
        $fetch('/api' + url, { ...options, key } as any)
        .then((res:any) => {
            // 错误交由指定业务处理
            if(!res.success) {
                message.error(res.errorInfo);
                if(res.errorCode === 401) {
                    authStore.loginOut();
                }
                reject(res);
            }
            resolve(res);
        })
        .catch((err: any) => {
            message.error(err.message);
            reject(err)
        })
    })
}

export default new class Http {
    get({ url, headers, params, data }: Omit<FetchOptionType, 'method'>) {
        return fetch('client', { method: 'get', url, headers, params, data });
    }
    post({url, headers, params, data}: Omit<FetchOptionType, 'method'>)  {
        return fetch('client', { method: 'post', url, headers, params, data });
    }
    serverGet({url, headers, params, data}: Omit<FetchOptionType, 'method'>) {
        return fetch('server', { method: 'get', url, headers, params, data });
    }
    serverPost({url, headers, params, data}: Omit<FetchOptionType, 'method'>) {
        return fetch('server', { method: 'post', url, headers, params, data });
    }
}