/**
 * 错误码声明
 */
export enum ErrorCodeEnum {
    SUCCESS = 0,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
    VERSION_NOT_SUPPORTED = 505,
}

/**
 * 错误码说明
 */
export enum ErrorCodeInfoEnum { 
    SUCCESS = '成功',
    BAD_REQUEST = '错误请求',
    UNAUTHORIZED = '未授权',
    FORBIDDEN = '禁止访问',
    NOT_FOUND = '未找到',
    METHOD_NOT_ALLOWED = '方法不允许',
    INTERNAL_SERVER_ERROR = '服务器内部错误',
    NOT_IMPLEMENTED = '未实现',
    BAD_GATEWAY = '错误的网关',
    SERVICE_UNAVAILABLE = '服务不可用',
    VERSION_NOT_SUPPORTED = '版本不支持',
}