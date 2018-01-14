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
            { time: "0 0 1 1 * *", reDownload: true }   //每月1日更新全部数据
        ], [sql.create_table]);
    }

    async onStart(): Promise<void> {
        this._stockCodeDownloader = this.services.StockCodeDownloader;
        await super.onStart();
    }

    /**
     * 保存下载到的数据
     * @param date 日期 'YYYY-MM-DD'
     * @param data 下载到的数据
     */
    private async _saveData(code_id: number, date: string, data: TradeDetailType[]) {
        //由于成交明细数据中的日期会出现重复(同一秒下发生多笔交易)，所以没办法像其他数据那样更新。
        //所以只有先删除当天的旧数据再导入当天的新数据
        await this._connection.asyncQuery(sql.delete_data, [code_id, date]);
        await this._connection.asyncQuery(sql.insert_data(code_id, data), [code_id, date]);
    }

    protected async _downloader(reDownload?: boolean) {
        {//A股
            const code_list = await this._stockCodeDownloader.getStockCodes([StockMarketType.sh.id, StockMarketType.sz.id], [false]);

            for (const { id, code, name, market } of code_list) {
                if (reDownload) {
                    const dateList = await this._connection.asyncQuery(sql.get_stock_date_list, [id]);
                    for (let { date } of dateList) {
                        date = moment(date).format('YYYY-MM-DD');
                        await this._saveData(id, date, await A_Stock_TradeDetail_tencent.download(code, name, market, date));
                        //console.log('A股', code, name, date);
                    }
                } else {
                    let date = moment().format('YYYY-MM-DD');
                    await this._saveData(id, date, await A_Stock_TradeDetail_tencent.download(code, name, market, date));
                }
                //console.log('A股', code, name);
            }
        }
    };
}