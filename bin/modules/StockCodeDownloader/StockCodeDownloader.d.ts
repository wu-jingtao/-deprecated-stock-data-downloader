import { BaseServiceModule } from "service-starter";
/**
 * 股票代码下载器
 */
export declare class StockCodeDownloader extends BaseServiceModule {
    private _timer;
    private _connection;
    private _statusRecorder;
    private _downloading;
    /**
     * 保存下载到的数据
     */
    private _saveData(data);
    /**
     * 下载器
     */
    private _downloader();
    onStart(): Promise<void>;
    onStop(): Promise<void>;
}
