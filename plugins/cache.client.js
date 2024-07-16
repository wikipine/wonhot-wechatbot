/**
 * 基于localStorage的持久化缓存
 */
export default defineNuxtPlugin(() => {
    const CACHE_BUCKET_NAME = 'rkt-wxbot';
    const getData = () => {
        let data = localStorage.getItem(CACHE_BUCKET_NAME);
        try{
            data = JSON.parse(data);
            return data ?? {};
        }catch(e) {
            return {};
        }
    }
    return {
        provide: {
            localCache: {
                getCache: (key) => {
                    let data = getData();
                    return data[key] ?? null;
                },
                setCache: (key, value) => {
                    let data = getData();
                    data[key] = value;
                    localStorage.setItem(CACHE_BUCKET_NAME, JSON.stringify(data));
                },
                clearCache: (key) => {
                    let data = getData();
                    if(data[key]) {
                        delete data[key];
                        localStorage.setItem(CACHE_BUCKET_NAME, JSON.stringify(data));
                    }
                }
            }
        }
    }
})