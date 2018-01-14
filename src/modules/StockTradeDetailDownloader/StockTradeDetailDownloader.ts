import * as moment from 'moment';

import * as sql from './Sql';
import { BaseDataModule } from '../../tools/BaseDataModule';
import { StockCodeDownloader } from '../StockCodeDownloader/StockCodeDownloader';
import { TradeDetailType } from './TradeDetailType';
import { StockMarketType } from '../StockMarketList/StockMarketType';

import { A_Stock_TradeDetail_tencent } from './DataSource/A_Stock_TradeDetail_tencent';

/**
 * 股票成交明细下载器
 */
export class StockTradeDetailDownloader extends BaseDataModule {

    private _stockCodeDownloader: StockCodeDownloader;

    constructor() {
        super([
            { time: "0 15 18 * * 1-5" },                //每周1-5的下午6点15分更新当天数据
            { time: "0 0 1 * * 7", reDownload: true }   //每周末凌晨1点更新全部数据
        ], [sql.create_table]);
    }

    async onStart(): Promise<void> {
        this._stockCodeDownloader = this.services.StockCodeDownloader;
        await super.onStart();
    }

    /**
     * 保存下载到的数据
     */
    private async _saveData(code_id: number, data: TradeDetailType[]) {
        for (const item of data) {
            await this._connection.asyncQuery(sql.insert_data, [
                code_id, item.date, item.price, item.volume, item.money, item.direction,
                item.price, item.volume, item.money, item.direction
            ]);
        }
    }

    protected async _downloader(reDownload?: boolean) {
        {//A股
            const code_list = await this._stockCodeDownloader.getStockCodes([StockMarketType.sh.id, StockMarketType.sz.id], [false]);

            for (const { id, code, name, market } of code_list) {
                if (reDownload) {
                    const dateList = await this._connection.asyncQuery(sql.get_stock_date_list, [id]);
                    await this._saveData(id, await A_Stock_TradeDetail_tencent.download(code, name, market, dateList.map((item: any) => item.date)));
                } else {
                    await this._saveData(id, await A_Stock_TradeDetail_tencent.download(code, name, market, [moment().format('YYYY-MM-DD')]));
                }
                //console.log('A股', code, name);
            }
        }
    };
}