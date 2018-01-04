import * as xlsx from 'xlsx';
import expect = require('expect.js');

import * as HttpDownloader from '../../../tools/HttpDownloader';
import { StockCodeDownloadedData } from '../StockCodeDownloadedData';
import { Retry3 } from '../../../tools/Retry';
import { StockMarketType } from '../../StockMarketTypeList/StockMarketType';

/**
 * 深交所，股票列表数据
 * 
 * 深交所只提供深圳交易所的A股股票列表。返回`xlsx`格式的数据
 * 
 * 相关页面：http://www.szse.cn/main/marketdata/jypz/colist/
 * 下载地址：http://www.szse.cn/szseWeb/ShowReport.szse?SHOWTYPE=xlsx&CATALOGID=1110&tab2PAGENO=1&ENCODE=1&TABKEY=tab2
 */

//下载地址
const address = 'http://www.szse.cn/szseWeb/ShowReport.szse?SHOWTYPE=xlsx&CATALOGID=1110&tab2PAGENO=1&ENCODE=1&TABKEY=tab2';

//下载数据
async function download(): Promise<StockCodeDownloadedData[]> {
    const file = await HttpDownloader.Get(address);
    const data = xlsx.read(file);
    const result = xlsx.utils.sheet_to_json(data.Sheets["A股列表"]) as any[];

    return result.map(item => ({
        code: (item['A股代码'] as string).trim(),
        name: (item['A股简称'] as string).trim(),
        market: StockMarketType.sz.id,
        isIndex: false
    }));
}

//检测下载的数据是否正确
function test(data: StockCodeDownloadedData[]) {
    expect(data.length).to.greaterThan(0);

    data.forEach(item => {
        expect(/^[03]\d{5}$/.test(item.code)).to.be.ok();   //股票代码
        expect(item.name.length).to.greaterThan(0);         //确保公司名称不为空
    });

    return data;
}

/**
 * 深圳A股代码下载器
 */
export const SZ_A_Code_sjs = Retry3(async () => test(await download()));