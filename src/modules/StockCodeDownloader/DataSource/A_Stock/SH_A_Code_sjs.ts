import * as dsv from 'd3-dsv';
import * as iconv from 'iconv-lite';

import * as HttpDownloader from '../../../../tools/HttpDownloader';
import { BaseDownloader } from '../../../../tools/BaseDownloader';
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
export class SH_A_Code_sjs extends BaseDownloader {

    private address = 'http://query.sse.com.cn/security/stock/downloadStockListFile.do?csrcCode=&stockCode=&areaName=&stockType=1';
    private referer = "http://www.sse.com.cn/assortment/stock/list/share/";

    get name() {
        return '上交所 A股代码下载器';
    }

    protected _testData(data: StockCodeType) {
        return /^6\d{5}$/.test(data.code) &&        //股票代码
            data.name.length > 0                    //确保公司名称不为空
    }

    protected async _download() {
        const file = await HttpDownloader.Get(this.address, { Referer: this.referer });
        const data = iconv.decode(file, 'gbk');     //转码

        return dsv.tsvParse(data).map(item => ({
            code: (item['A股代码'] as string).trim(),
            name: (item['A股简称'] as string).trim(),
            market: StockMarketType.sh.id,
            isIndex: false
        }));
    }

    protected _process(err: Error | undefined, data: any[]): Promise<any[]> {
        if (err === undefined && data.length === 0)
            return super._process(new Error('没有下载到数据'), data);
        else
            return super._process(err, data);
    }
}