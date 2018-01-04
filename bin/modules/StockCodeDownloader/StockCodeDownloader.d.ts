import { BaseServiceModule } from "service-starter";
/**
 * 股票代码下载器
 */
export declare class StockCodeDownloader extends BaseServiceModule {
    private _timer;
    private _connection;
    private _statusRecorder;
    private _downloading;
    private _downloader();
    onStart(): Promise<void>;
    onStop(): Promise<void>;
}
