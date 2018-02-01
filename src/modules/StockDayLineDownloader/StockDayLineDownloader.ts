import * as moment from 'moment';
import { BaseDataModule } from '../../tools/BaseDataModule';

import * as sql from './Sql';
import { StockCodeDownloader } from '../StockCodeDownloader/StockCodeDownloader';
import { StockMarketType } from '../StockMarketList/StockMarketType';
import { DayLineType } from './DayLineType';

import { A_Stock_Day_Line_neteasy } from './DataSource/A_Stock/A_Stock_Day_Line_neteasy';

import { H_Stock_Day_Line_sina } from './DataSource/H_Stock/H_Stock_Day_Line_sina';
import { H_Stock_Index_Day_Line_sina } from './DataSource/H_Stock/H_Stock_Index_Day_Line_sina';

import { Future_Day_Line_sina } from './DataSource/Future/Future_Day_Line_sina';

import { WH_Day_Line_sina } from './DataSource/WH/WH_Day_Line_sina';

/**
 * 股票日线下载器
 */
export class StockDayLineDownloader extends BaseDataModule {

    private _stockCodeDownloader: StockCodeDownloader;

    constructor() {
        super([
            { time: "0 15 18 * * 1-5" },                //每周1-5的下午6点15分更新当天数据
            { time: "0 0 12 * * 6", reDownload: true }  //每周6中午12点更新全部数据
        ], [sql.create_table]);
    }

    async onStart(): Promise<void> {
        this._stockCodeDownloader = this.services.StockCodeDownloader;
        await super.onStart();
    }

    /**
     * 保存下载到的数据
     */
    private async _saveData(code_id: number, data: DayLineType[]) {
        for (const item of data) {
            await this._connection.asyncQuery(sql.insert_data, [
                code_id, item.date,
                item.close, item.high, item.low, item.open, item.pre_close,
                item.exchange_ratio, item.volume, item.money,
                item.gross_market_value, item.current_market_value,

                item.close, item.high, item.low, item.open, item.pre_close,
                item.exchange_ratio, item.volume, item.money,
                item.gross_market_value, item.current_market_value,
            ]);
        }
    }

    protected async _downloader(reDownload: boolean) {
        {//A股与A股指数
            const code_list = await this._stockCodeDownloader.getStockCodes([StockMarketType.sh.id, StockMarketType.sz.id], [true, false]);
            const downloader = new A_Stock_Day_Line_neteasy();

            //下载开始日期
            const start_date = reDownload ? '1990-01-01' : moment().subtract({ days: 7 }).format('YYYY-MM-DD');

            for (const { id, code, name, market } of code_list) {
                await this._saveData(id, await downloader.download(code, name, market, start_date));
                //console.log('A股', id, code, name, start_date);
            }

            downloader.printDownloadedAmount();
        }

        {//港股
            const code_list = await this._stockCodeDownloader.getStockCodes([StockMarketType.xg.id], [false]);
            const downloader = new H_Stock_Day_Line_sina();

            for (const { id, code, name, market } of code_list) {
                await this._saveData(id, await downloader.download(code, name, reDownload));
                //console.log('港股', code, name);
            }

            downloader.printDownloadedAmount();
        }

        {//港股指数
            const code_list = await this._stockCodeDownloader.getStockCodes([StockMarketType.xg.id], [true]);
            const downloader = new H_Stock_Index_Day_Line_sina();

            for (const { id, code, name, market } of code_list) {
                await this._saveData(id, await downloader.download(code, name, reDownload));
                //console.log('港股指数', code, name);
            }

            downloader.printDownloadedAmount();
        }

        {//国内商品期货
            const code_list = await this._stockCodeDownloader.getStockCodes([StockMarketType.sqs.id, StockMarketType.zss.id, StockMarketType.dss.id], [true]);
            const downloader = new Future_Day_Line_sina();

            for (const { id, code, name, market } of code_list) {
                await this._saveData(id, await downloader.download(code, name, reDownload));
                //console.log('国内商品期货', code, name);
            }

            downloader.printDownloadedAmount();
        }

        {//外汇
            const code_list = await this._stockCodeDownloader.getStockCodes([StockMarketType.wh.id], [true, false]);
            const downloader = new WH_Day_Line_sina();

            for (const { id, code, name, market } of code_list) {
                await this._saveData(id, await downloader.download(code, name, reDownload));
                //console.log('外汇', code, name);
            }

            downloader.printDownloadedAmount();
        }
    };
}
