/**
 * Object类型推演判断key值是否存在
 * @param obj
 * @param prop 
 * @returns 
 */
export function hasObjectProperty<T extends object, K extends keyof T>(obj: T, prop: K): obj is T & Record<K, any> {
    return prop in obj && obj[prop] !== undefined;
}