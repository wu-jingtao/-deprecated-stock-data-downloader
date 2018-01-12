import * as iconv from 'iconv-lite';
import * as $ from 'cheerio';

import * as HttpDownloader from '../../../../tools/HttpDownloader';
import { Retry3 } from '../../../../tools/Retry';
import { StockCodeType } from '../../StockCodeType';
import { StockMarketType } from '../../../StockMarketList/StockMarketType';

/**
 * 东方财富，A股列表数据(同时包含上海与深圳)
 * 
 * 数据格式`HTML`
 * 下载地址：http://quote.eastmoney.com/stocklist.html
 */

//下载地址
const address = 'http://quote.eastmoney.com/stocklist.html';

//检测下载的数据是否正确
function testData(data: StockCodeType) {
    return /^[360]\d{5}$/.test(data.code) &&    //股票代码,只要A股
        data.name.length > 0 &&                 //确保公司名称不为空
        data.market === StockMarketType.sh.id || data.market === StockMarketType.sz.id;
}

//下载数据
async function download(): Promise<StockCodeType[]> {
    const file = await HttpDownloader.Get(address);
    const data = iconv.decode(file, 'gbk');     //转码
    const result: StockCodeType[] = [];

    $("#quotesearch ul li a[target]", data).each(function (this: CheerioElement) {
        const href = $(this).attr('href') as any;
        const text = $(this).text() as any;

        const temp = {
            code: text.match(/\d{6}/)[0].trim(),
            name: text.match(/(.+)(?:\()/)[1].trim(),
            market: (StockMarketType as any)[href.match(/([a-z]{2})(?:\d{6})/)[1]].id,
            isIndex: false
        };

        if (testData(temp)) result.push(temp);
    });

    if (result.length === 0) throw new Error('无法下载数据');

    return result;
}

/**
 * A股代码下载器
 */
export function A_Code_dfcf() {
    return Retry3(download)()
        .catch(err => { throw new Error('下载东方财富 A股股票代码异常：' + `${err.message}\n${err.stack}`) });
}