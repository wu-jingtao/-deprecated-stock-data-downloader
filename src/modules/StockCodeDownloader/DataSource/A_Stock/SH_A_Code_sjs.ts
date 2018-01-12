import * as dsv from 'd3-dsv';
import * as iconv from 'iconv-lite';

import * as HttpDownloader from '../../../../tools/HttpDownloader';
import { Retry3 } from '../../../../tools/Retry';
import { StockCodeType } from '../../StockCodeType';
import { StockMarketType } from '../../../StockMarketList/StockMarketType';

/**
 * 上交所，股票列表数据
 * 
 * 上交所只提供上海交易所的A股股票列表。返回`tsv`格式的数据，GBK编码
 * 
 * 相关页面：http://www.sse.com.cn/assortment/stock/list/share/
 * 下载地址：http://query.sse.com.cn/security/stock/downloadStockListFile.do?csrcCode=&stockCode=&areaName=&stockType=1
 *
 * 注意：下载时服务器会检测"http request"头中"Referer"是否等于"http://www.sse.com.cn/assortment/stock/list/share/"
 */

//下载地址
const address = 'http://query.sse.com.cn/security/stock/downloadStockListFile.do?csrcCode=&stockCode=&areaName=&stockType=1';
const referer = "http://www.sse.com.cn/assortment/stock/list/share/";

//检测下载的数据是否正确
function testData(data: StockCodeType) {
    return /^6\d{5}$/.test(data.code) &&        //股票代码
        data.name.length > 0                    //确保公司名称不为空
}

//下载数据
async function download(): Promise<StockCodeType[]> {
    const file = await HttpDownloader.Get(address, { Referer: referer });
    const data = dsv.tsvParse(iconv.decode(file, 'gbk'));     //转码
    const result: StockCodeType[] = [];

    data.forEach(item => {
        const temp = {
            code: (item['A股代码'] as string).trim(),
            name: (item['A股简称'] as string).trim(),
            market: StockMarketType.sh.id,
            isIndex: false
        };

        if (testData(temp)) result.push(temp);
    });

    if (result.length === 0) throw new Error('无法下载数据');

    return result;
}

/**
 * 上海A股代码下载器
 */
export function SH_A_Code_sjs() {
    return Retry3(download)()
        .catch(err => { throw new Error('下载上交所股票代码异常：' + `${err.message}\n${err.stack}`) });
}
