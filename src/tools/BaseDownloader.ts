import log from 'log-formatter';
import { Retry3 } from "./Retry";
import { BaseDataModule } from './BaseDataModule';

/**
 * 所有下载器的父类
 */
export abstract class BaseDownloader {

    /**
     * 下载到了多少数据
     */
    downloadedAmount: number = 0;

    /**
     * 当前下载器名称
     */
    get name() {
        return this.constructor.name;
    }

    constructor(private readonly _baseDataModule: BaseDataModule) { }

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
    download(...args: any[]) {
        return Retry3(async () => {
            const data = await this._download(...args);
            return data.filter(item => this._testData(item));
        })().then(async (data) => {
            const result = await this._process(undefined, data, args)
            this.downloadedAmount += data.length;
            return data;
        }).catch(err => this._process(err, undefined as any, args));
    }

    /**
     * 打印下载到的数量到控制台
     */
    printDownloadedAmount() {
        log.location.location.text(this._baseDataModule.name, this.name, '下载到了', this.downloadedAmount, '条数据');
    }

    /**
     * 方便使用download方法，省去了实例化对象的过程
     */
    static download(baseDataModule: BaseDataModule, ...args: any[]) {
        const constructor = this as any;
        const downloader: BaseDownloader = new constructor(baseDataModule);
        return downloader.download(...args);
    }
}