import { BaseServiceModule } from "service-starter";

/**
 * 股票代码下载器
 */
export class StockCodeDownloader extends BaseServiceModule {

    onStart(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
