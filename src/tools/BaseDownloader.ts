import { Retry3 } from "./Retry";

/**
 * 所有下载器的父类
 */
export abstract class BaseDownloader {

    /**
     * 当前下载器名称
     */
    get name() {
        return this.constructor.name;
    }

    /**
     * 测试下载到的每一条数据。如果某条数据不满足要求则将被丢弃
     */
    protected abstract _testData(data: any): boolean;

    /**
     * 下载数据。对于下载到的每一条数据都将使用"_testData"进行检验，只保留满足条件的数据。
     * 如果出错会自动重试最多3次
     */
    protected abstract _download(...args: any[]): Promise<any[]>;

    /**
     * 可以使用该方法对下载到的数据做最后处理
     * @param err 错误消息
     * @param data 下载到的数据
     * @param downloadArgs 传给下载器的参数
     */
    protected _process(err: Error | undefined, data: any[], downloadArgs: any[]): Promise<any[]> {
        return err ? Promise.reject(new Error(`"${this.name}"：${err.message}\n${err.stack}`)) : Promise.resolve(data);
    }

    /**
     * 下载数据
     */
    static download(...args: any[]) {
        const constructor = this as any;
        const downloader: BaseDownloader = new constructor();

        return Retry3(async () => {
            const data = await downloader._download(...args);

            const result: any[] = [];
            data.forEach(item => downloader._testData(item) && result.push(item));

            return result;
        })().then(data => downloader._process(undefined, data, args))
            .catch(err => downloader._process(err, undefined as any, args));
    }
}