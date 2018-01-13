import * as iconv from 'iconv-lite';
import * as $ from 'cheerio';

import * as HttpDownloader from '../../../../tools/HttpDownloader';
import { BaseDownloader } from '../../../../tools/BaseDownloader';
import { StockCodeType } from '../../StockCodeType';
import { StockMarketType } from '../../../StockMarketList/StockMarketType';

/**
 * 东方财富，A股列表数据(同时包含上海与深圳)
 * 
 * 下载地址：http://quote.eastmoney.com/stocklist.html
 * 数据格式`HTML`
 */
export class A_Code_dfcf extends BaseDownloader {

    private address = 'http://quote.eastmoney.com/stocklist.html';  //下载地址

    get name() {
        return '东方财富 A股代码下载器';
    }

    protected _testData(data: StockCodeType) {
        return /^[360]\d{5}$/.test(data.code) &&    //股票代码,只要A股
            data.name.length > 0 &&                 //确保公司名称不为空
            data.market === StockMarketType.sh.id || data.market === StockMarketType.sz.id;
    }

    protected async _download() {
        const file = await HttpDownloader.Get(this.address);
        const data = iconv.decode(file, 'gbk');     //转码

        return Array.from($("#quotesearch ul li a[target]", data).map(function (this: CheerioElement) {
            const href = $(this).attr('href') as any;
            const text = $(this).text() as any;

            return {
                code: text.match(/\d{6}/)[0].trim(),
                name: text.match(/(.+)(?:\()/)[1].trim(),
                market: (StockMarketType as any)[href.match(/([a-z]{2})(?:\d{6})/)[1]].id,
                isIndex: false
            };
        }));
    }

    protected _process(err: Error | undefined, data: any[]): Promise<any[]> {
        if (err === undefined && data.length === 0)
            return super._process(new Error('没有下载到数据'), data);
        else
            return super._process(err, data);
    }
}