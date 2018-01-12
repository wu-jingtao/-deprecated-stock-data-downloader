import { BaseDataModule } from '../../tools/BaseDataModule';

import * as sql from './Sql';
import { StockCodeType } from './StockCodeType';

import { SH_A_Code_sjs } from './DataSource/A_Stock/SH_A_Code_sjs';
import { SZ_A_Code_sjs } from './DataSource/A_Stock/SZ_A_Code_sjs';
import { A_Index_Code_zx } from './DataSource/A_Stock/A_Index_Code_zx';

import { H_Code_hgt } from './DataSource/H_Stock/H_Code_hgt';
import { H_Code_sgt } from './DataSource/H_Stock/H_Code_sgt';
import { H_Index_Code_zx } from './DataSource/H_Stock/H_Index_Code_zx';

import { SH_Future_Index } from './DataSource/SH_Future/SH_Future_Index';
import { ZZ_Future_Index } from './DataSource/ZZ_Future/ZZ_Future_Index';
import { DL_Future_Index } from './DataSource/DL_Future/DL_Future_Index';

import { WH_Code_zx } from './DataSource/WH/WH_Code_zx';

/**
 * 股票代码下载器
 */
export class StockCodeDownloader extends BaseDataModule {

    constructor() {
        //每天的下午5点钟更新
        super([{ time: "0 0 17 * * *" }], sql.create_table);
    }

    /**
     * 保存下载到的数据
     */
    private async _saveData(data: StockCodeType[]) {
        for (const item of data) {
            await this._connection.asyncQuery(sql.insert_data, [
                item.code, item.name, item.market, item.isIndex,
                item.name
            ]);
        }
    }

    protected async _downloader() {
        //A股
        await this._saveData(await SH_A_Code_sjs.download());
        await this._saveData(await SZ_A_Code_sjs.download());
        await this._saveData(A_Index_Code_zx());

        //港股
        await this._saveData(await H_Code_hgt.download());
        await this._saveData(await H_Code_sgt.download());
        await this._saveData(H_Index_Code_zx());

        //上海期货交易所 主连列表
        await this._saveData(await SH_Future_Index.download());

        //郑州商品交易所 主连列表
        await this._saveData(await ZZ_Future_Index.download());

        //大连商品交易所 主连列表
        await this._saveData(await DL_Future_Index.download());

        //外汇
        await this._saveData(WH_Code_zx());
    };
}
