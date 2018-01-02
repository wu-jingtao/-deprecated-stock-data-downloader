import { BaseServiceModule } from "service-starter";
/**
 * 股票市场列表。
 * 该模块目前的主要目的就是创建`stock_market`数据表，并且将StockMarket.ts中的数据保存到数据库中
 */
export declare class StockMarketDownloader extends BaseServiceModule {
    onStart(): Promise<void>;
}
