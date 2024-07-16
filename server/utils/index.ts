import crypto from 'crypto';

/**
 * 成功返回
 */
export const responseSuccess = (data: any) => {
    return {
        success: true,
        errorCode: 0,
        errorInfo: 'No Error!',
        data
    }
}

/**
 * 失败返回
 */
export const responseError = (errorCode: number, errorInfo: string) => {
    return {
        success: false,
        errorCode,
        errorInfo: errorInfo ?? 'UnKnown Error',
        data: null
    }
}

/**
 * 获取随机的16进制符号
 */
export const getRandomHex = (length: number) => {
    const randomBytes = crypto.randomBytes(length);
    return randomBytes.toString('hex');
}

/**
 * 检查Enum类型的数据存在
 */
export const checkEnumTypeExist = (EnumObject: Record<string | number, any>, value: any) => {
    return Object.values(EnumObject).includes(value);
}

/**
 * Enum类型 
 * 依据key返回value
 */
export const getEnumTypeValueByKey = (EnumObject: Record<string | number, any>, key: string | number) => {
    return EnumObject[key] || null;
}

/**
 * 辅助函数
 * @param ms 
 * @returns 
 */
function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
