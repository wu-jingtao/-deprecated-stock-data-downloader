import * as dsv from 'd3-dsv';
import * as iconv from 'iconv-lite';

import * as HttpDownloader from '../../../tools/HttpDownloader';
import { StockMarket } from '../../StockMarketDownloader/StockMarket';

/**
 * 上交所，股票列表数据
 * 
 * 上交所只提供上海交易所的A股股票列表。返回`tsv`格式的数据，GBK编码
 * 
*  相关页面：http://www.sse.com.cn/assortment/stock/list/share/
*  下载地址：http://query.sse.com.cn/security/stock/downloadStockListFile.do?csrcCode=&stockCode=&areaName=&stockType=1
* 
*  注意：下载时服务器会检测"http request"头中"Referer"是否等于"http://www.sse.com.cn/assortment/stock/list/share/"
 */

//下载地址
const address = 'http://query.sse.com.cn/security/stock/downloadStockListFile.do?csrcCode=&stockCode=&areaName=&stockType=1';
const referer = "http://www.sse.com.cn/assortment/stock/list/share/";

/**
 * 上海A股代码下载器
 */
export async function SH_A_Code_sjs(): Promise<any[]> {
    const file = await HttpDownloader.Get(address, { Referer: referer });
    const data = iconv.decode(file, 'gbk');     //转码
    const result = dsv.tsvParse(data);

    return result.map(item => ({
        code: (item['A股代码'] as string).trim(),
        name: (item['A股简称'] as string).trim(),
        market: StockMarket.sh.id,
        isIndex: false
    }));
}