
/**
 * 包装传入的方法，调用时，如果传入的方法发生异常则重新执行，最多重试3次
 */
export function Retry3<T extends (...args: any[]) => Promise<any>>(func: T): T {
    async function wrap(...args: any[]) {
        try {   //重试3次
            return await func(...args);
        } catch {
            try {
                return await func(...args);
            } catch {
                return await func(...args);
            }
        }
    }

    return wrap as any;
}