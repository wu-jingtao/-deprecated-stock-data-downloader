import * as moment from 'moment';

import * as sql from './Sql';
import { BaseDataModule } from '../../tools/BaseDataModule';
import { StockCodeDownloader } from '../StockCodeDownloader/StockCodeDownloader';
import { TradeDetailType } from './TradeDetailType';
import { StockMarketType } from '../StockMarketList/StockMarketType';

import { A_Stock_TradeDetail_tencent } from './DataSource/A_Stock_TradeDetail_tencent';

/**
 * 股票成交明细下载器的父类
 */
export class StockTradeDetailDownloader extends BaseDataModule {

    private _stockCodeDownloader: StockCodeDownloader;

    constructor() {
        super([
            { time: "0 30 19 * * 1-5" },    //每周1-5的下午7点30分更新当天数据
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
        await this._connection.asyncQuery(sql.insert_data(code_id, date, data));
    }

    protected async _downloader(reDownload?: boolean) {
        {//A股
            const code_list = await this._stockCodeDownloader.getStockCodes([StockMarketType.sh.id, StockMarketType.sz.id], [false]);

            for (const { id, code, name, market } of code_list) {
                if (reDownload) //获取所有交易日
                    var dateList = await this._connection.asyncQuery(sql.get_stock_date_list, [id]);
                else    //获取最近一周交易日
                    var dateList = await this._connection.asyncQuery(sql.get_stock_latest_week_date, [id]);

                for (let { date } of dateList) {
                    date = moment(date).format('YYYY-MM-DD');
                    await this._saveData(id, date, await A_Stock_TradeDetail_tencent.download(code, name, market, date));
                    //console.log('A股', code, name, date);
                }

                //console.log('A股', code, name);
            }
        }
    };
}