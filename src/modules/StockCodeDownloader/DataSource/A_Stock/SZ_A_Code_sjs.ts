import * as xlsx from 'xlsx';

import * as HttpDownloader from '../../../../tools/HttpDownloader';
import { Retry3 } from '../../../../tools/Retry';
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

//下载地址
const address = 'http://www.szse.cn/szseWeb/ShowReport.szse?SHOWTYPE=xlsx&CATALOGID=1110&tab2PAGENO=1&ENCODE=1&TABKEY=tab2';

//检测下载的数据是否正确
function testData(data: StockCodeType) {
    return /^[03]\d{5}$/.test(data.code) &&     //股票代码
        data.name.length > 0                    //确保公司名称不为空
}

//下载数据
async function download(): Promise<StockCodeType[]> {
    const file = await HttpDownloader.Get(address);
    const data = xlsx.utils.sheet_to_json(xlsx.read(file).Sheets["A股列表"]) as any[];
    const result: StockCodeType[] = [];

    data.forEach(item => {
        const temp = {
            code: (item['A股代码'] as string).trim(),
            name: (item['A股简称'] as string).trim(),
            market: StockMarketType.sz.id,
            isIndex: false
        };

        if (testData(temp)) result.push(temp);
    });

    if (result.length === 0) throw new Error('无法下载数据');

    return result;
}

/**
 * 深圳A股代码下载器
 */
export function SZ_A_Code_sjs() {
    return Retry3(download)()
        .catch(err => { throw new Error('下载深交所股票代码异常：' + `${err.message}\n${err.stack}`) });
}