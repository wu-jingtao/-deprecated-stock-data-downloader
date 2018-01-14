import * as xlsx from 'xlsx';
import expect = require('expect.js');

import * as HttpDownloader from '../../../../tools/HttpDownloader';
import { BaseDownloader } from '../../../../tools/BaseDownloader';
import { StockCodeType } from '../../StockCodeType';
import { StockMarketType } from '../../../StockMarketList/StockMarketType';

/**
 * 深交所，深港通代码列表数据
 * 注意：有些港股没有中文名称，没有中文名的用英文名来代替
 * 
 * 相关页面：http://www.szse.cn/main/szhk/ggtywxx/bdzqmd/
 * 下载地址：http://www.szse.cn/szseWeb/ShowReport.szse?SHOWTYPE=xlsx&CATALOGID=SGT_GGTBDQD&tab1PAGENO=1&ENCODE=1&TABKEY=tab1
 */
export class H_Code_sgt extends BaseDownloader {

    get name() {
        return '深交所 深港通代码下载器';
    }

    private _address = 'http://www.szse.cn/szseWeb/ShowReport.szse?SHOWTYPE=xlsx&CATALOGID=SGT_GGTBDQD&tab1PAGENO=1&ENCODE=1&TABKEY=tab1';  //下载地址

    protected _testData(data: StockCodeType) {
        return /^\d{5}$/.test(data.code) &&     //股票代码
            data.name.length > 0                //确保公司名称不为空
    }

    protected async _download() {
        const file = await HttpDownloader.Get(this._address);
        const data = xlsx.read(file);
        const result = xlsx.utils.sheet_to_json(data.Sheets["港股通标的证券名单"]) as any[];

        return result.map(item => {
            const english = (item['英文简称'] as string).trim()
            const chinese = (item['中文简称'] as string).trim()

            return {
                code: (item['港股代码'] as string).trim(),
                name: chinese || english,
                market: StockMarketType.xg.id,
                isIndex: false
            }
        });
    }

    protected _process(err: Error | undefined, data: any[], downloadArgs: any[]): Promise<any[]> {
        if (err === undefined && data.length === 0)
            return super._process(new Error('没有下载到数据'), data, downloadArgs);
        else
            return super._process(err, data, downloadArgs);
    }
}