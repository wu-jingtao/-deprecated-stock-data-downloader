import * as moment from 'moment';

import * as sql from './Sql';
import { BaseDataModule } from '../../tools/BaseDataModule';
import { StockCodeDownloader } from '../StockCodeDownloader/StockCodeDownloader';
import { TradeDetailType } from './TradeDetailType';
import { StockMarketType } from '../StockMarketList/StockMarketType';

import { A_Stock_TradeDetail_tencent } from './DataSource/A_Stock_TradeDetail_tencent';

/**
 * 股票成交明细下载器的父类
 * 之所以要拆分成两个下载器是因为，下载全部的成交明细会花费大量的时间，如果一天内无法下载完成，可能会影响到第二天的下载任务
 */
export abstract class BaseStockTradeDetailDownloader extends BaseDataModule {

    private _stockCodeDownloader: StockCodeDownloader;

    /**
     * @param crontab 供子类传递定时器数据
     */
    constructor(crontab: { time: string, reDownload?: boolean }) {
        super([crontab], [sql.create_table]);
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
                else    //获取最近一个交易日
                    var dateList = await this._connection.asyncQuery(sql.get_stock_latest_date, [id]);

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

export class StockTradeDetailDownloader extends BaseStockTradeDetailDownloader {
    constructor() {
        super({ time: "0 30 19 * * 1-5" }); //每周1-5的下午7点30分更新当天数据
    }

    protected _downloader() {   //确保总是只下载当天的数据
        return super._downloader(false);
    }
}

export class StockTradeDetailDownloader_All extends BaseStockTradeDetailDownloader {
    constructor() {
        super({ time: "0 0 1 1 * *" }); //每月1日更新全部数据
    }

    protected _downloader() {   //确保总是下载全部数据
        return super._downloader(true);
    }
}