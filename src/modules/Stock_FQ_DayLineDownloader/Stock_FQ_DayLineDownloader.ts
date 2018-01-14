import * as sql from './Sql';
import { BaseDataModule } from '../../tools/BaseDataModule';
import { StockCodeDownloader } from '../StockCodeDownloader/StockCodeDownloader';
import { FQ_DayLineType } from './FQ_DayLineType';
import { StockMarketType } from '../StockMarketList/StockMarketType';

import { A_Stock_FQ_DayLine_sina } from './DataSource/A_Stock_FQ_DayLine_sina';
import { H_Stock_FQ_DayLine_tencent } from './DataSource/H_Stock_FQ_DayLine_tencent';

/**
 * 后复权收盘价下载器
 */
export class Stock_FQ_DayLineDownloader extends BaseDataModule {

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
    private async _saveData(code_id: number, data: FQ_DayLineType[]) {
        for (const item of data) {
            await this._connection.asyncQuery(sql.insert_data, [
                code_id, item.date, item.close,
                item.close
            ]);
        }
    }

    protected async _downloader(reDownload?: boolean) {
        {//A股
            const code_list = await this._stockCodeDownloader.getStockCodes([StockMarketType.sh.id, StockMarketType.sz.id], [false]);

            for (const { id, code, name, market } of code_list) {
                await this._saveData(id, await A_Stock_FQ_DayLine_sina.download(code, name, market, reDownload));
                //console.log('A股', id, code, name);
            }
        }

        {//港股
            const code_list = await this._stockCodeDownloader.getStockCodes([StockMarketType.xg.id], [false]);

            for (const { id, code, name, market } of code_list) {
                await this._saveData(id, await H_Stock_FQ_DayLine_tencent.download(code, name, reDownload));
                //console.log('港股', id, code, name);
            }
        }
    };
}