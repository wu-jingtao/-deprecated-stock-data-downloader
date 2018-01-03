import { BaseServiceModule } from "service-starter";
/**
 * 股票代码下载器
 */
export declare class StockCodeDownloader extends BaseServiceModule {
    timer: any[];
    onStart(): Promise<void>;
}
