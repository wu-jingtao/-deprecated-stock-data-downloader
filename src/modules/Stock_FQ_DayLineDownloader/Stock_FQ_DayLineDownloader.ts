import * as sql from './Sql';
import { BaseDataModule } from '../../tools/BaseDataModule';
import { StockCodeDownloader } from '../StockCodeDownloader/StockCodeDownloader';
import { FQ_DayLineType } from './FQ_DayLineType';
import { StockMarketType } from '../StockMarketList/StockMarketType';

import { A_Stock_FQ_DayLine } from './DataSource/A_Stock_FQ_DayLine';

/**
 * 后复权收盘价下载器
 */
export class Stock_FQ_DayLineDownloader extends BaseDataModule {

    private _stockCodeDownloader: StockCodeDownloader;

    constructor() {
        //每周1-6的下午6点15分更新数据
        super([{ time: "0 15 18 * * 1-6" }], [sql.create_table]);
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

    protected async _downloader() {
        {//A股
            const code_list = await this._stockCodeDownloader.getStockCodes([StockMarketType.sh.id, StockMarketType.sz.id], [false]);

            for (const { id, code, name, market } of code_list) {
                try {
                    await this._saveData(id, await A_Stock_FQ_DayLine.download(code, market));
                    //console.log('A股', id, code, name, start_date);
                } catch (err) {
                    throw new Error(`下载A股后复权收盘价"${name}-${code}"失败：` + err);
                }
            }
        }
    };
}