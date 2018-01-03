/**
 * 包装传入的方法，调用时，如果传入的方法发生异常则重新执行，最多重试3次
 */
export declare function Retry3<T extends (...args: any[]) => Promise<any>>(func: T): T;
