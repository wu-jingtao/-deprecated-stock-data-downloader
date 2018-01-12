import * as xlsx from 'xlsx';

import * as HttpDownloader from '../../../../tools/HttpDownloader';
import { BaseDownloader } from '../../../../tools/BaseDownloader';
import { StockCodeType } from '../../StockCodeType';
import { StockMarketType } from '../../../StockMarketList/StockMarketType';

/**
 * 深交所，股票列表数据
 * 
 * 深交所只提供深圳交易所的A股股票列表。返回`xlsx`格式的数据
 * 
 * 相关页面：http://www.szse.cn/main/marketdata/jypz/colist/
 * 下载地址：http://www.szse.cn/szseWeb/ShowReport.szse?SHOWTYPE=xlsx&CATALOGID=1110&tab2PAGENO=1&ENCODE=1&TABKEY=tab2
 */
export class SZ_A_Code_sjs extends BaseDownloader {

    private address = 'http://www.szse.cn/szseWeb/ShowReport.szse?SHOWTYPE=xlsx&CATALOGID=1110&tab2PAGENO=1&ENCODE=1&TABKEY=tab2';

    get name() {
        return '深交所 A股代码下载器';
    }

    protected _testData(data: StockCodeType) {
        return /^[03]\d{5}$/.test(data.code) &&     //股票代码
            data.name.length > 0                    //确保公司名称不为空
    }

    protected async _download() {
        const file = await HttpDownloader.Get(this.address);
        const data = xlsx.read(file).Sheets["A股列表"];
        const result = xlsx.utils.sheet_to_json(data) as any[];

        return result.map(item => ({
            code: (item['A股代码'] as string).trim(),
            name: (item['A股简称'] as string).trim(),
            market: StockMarketType.sz.id,
            isIndex: false
        }));
    }

    protected _process(err: Error | undefined, data: any[]): Promise<any[]> {
        if (err === undefined && data.length === 0)
            return super._process(new Error('无法下载到数据'), data);
        else
            return super._process(err, data);
    }
}