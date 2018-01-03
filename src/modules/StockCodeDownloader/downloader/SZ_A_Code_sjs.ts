import * as xlsx from 'xlsx';

import * as HttpDownloader from '../../../tools/HttpDownloader';
import { StockMarket } from '../../StockMarketDownloader/StockMarket';
import { DownloadedData } from '../DownloadedData';

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

/**
 * 深圳A股代码下载器
 */
export async function SZ_A_Code_sjs(): Promise<DownloadedData[]> {
    const file = await HttpDownloader.Get(address);
    const data = xlsx.read(file);
    const result = xlsx.utils.sheet_to_json(data.Sheets["A股列表"]) as any[];

    return result.map(item => ({
        code: (item['A股代码'] as string).trim(),
        name: (item['A股简称'] as string).trim(),
        market: StockMarket.sz.id,
        isIndex: false
    }));
}