import expect = require('expect.js');
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

//下载数据
async function download(): Promise<StockCodeType[]> {
    const file = await HttpDownloader.Get(address);
    const data = iconv.decode(file, 'gbk');     //转码

    const result: StockCodeType[] = [];

    $("#quotesearch ul li a[target]", data).each(function (this: CheerioElement) {
        const href = $(this).attr('href') as any;
        const text = $(this).text() as any;

        const code = text.match(/\d{6}/)[0].trim();

        if (/^[360]/.test(code)) {  //只要A股
            result.push({
                code,
                name: text.match(/(.+)(?:\()/)[1].trim(),
                market: (StockMarketType as any)[href.match(/([a-z]{2})(?:\d{6})/)[1]].id,
                isIndex: false
            });
        }
    }); 

    return result;
}

//检测下载的数据是否正确
function test(data: StockCodeType[]) {
    expect(data.length).to.greaterThan(0);

    data.forEach(item => {
        expect(/^[360]\d{5}$/.test(item.code)).to.be.ok();  //股票代码
        expect(item.name.length).to.greaterThan(0);         //确保公司名称不为空
        expect(item.market === StockMarketType.sh.id || item.market === StockMarketType.sz.id).to.be.ok()
    });

    return data;
}

/**
 * A股代码下载器
 */
export const A_Code_dfcf = Retry3(async () => test(await download()));