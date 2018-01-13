import * as cheerio from 'cheerio';
import * as iconv from 'iconv-lite';
import * as moment from 'moment';

import * as HttpDownloader from '../../../../tools/HttpDownloader';
import { BaseDownloader } from '../../../../tools/BaseDownloader';
import { DayLineType } from '../../DayLineType';
import { exchangeToWan, exchangeToYi } from '../../Tools';

/**
 * 港股日线数据下载器
 * 
 * 新浪财经数据。返回`HTML`格式的数据，`GBK`编码
 * 
 * 相关页面：http://stock.finance.sina.com.cn/hkstock/history/00005.html
 * 
 * 下载地址：http://stock.finance.sina.com.cn/hkstock/history/00700.html   
 *      请求方法"POST"，参数：year：年份，season：季度
 *      如果只下载当前季度的数据可直接"GET"请求
 * 
 * 获取行情开始年份：http://stock.finance.sina.com.cn/hkstock/api/jsonp.php/var%20hk_history_data_range_00005%20%3d/HistoryTradeService.getHistoryRange?symbol=00005
 */
export class H_Stock_Day_Line_sina extends BaseDownloader {

    get name() {
        return '新浪财经 港股日线数据下载器';
    }

    //行情开始年份地址
    private _address_min_year(code: string) {
        return `http://stock.finance.sina.com.cn/hkstock/api/jsonp.php/var%20hk_history_data_range_${code}%20%3d/HistoryTradeService.getHistoryRange?symbol=${code}`;
    }

    //下载地址
    private _address_data(code: string) {
        return `http://stock.finance.sina.com.cn/hkstock/history/${code}.html`;
    }

    /**
     * 获取港股上市年份
     */
    private async _get_listing_year(code: string): Promise<string> {
        const file = await HttpDownloader.Get(this._address_min_year(code));

        const year = (file.toString().match(/min:"(\d{4})/) || [])[1];

        if (/^\d{4}$/.test(year))
            return year;
        else
            throw new Error(`获取到的港股上市年份不正确。(${year})`);
    }

    /**
     * 下载数据
     * @param code 代码
     * @param year 年份
     * @param season 季度
     */
    private async _download_data(code: string, year?: number, season?: number): Promise<DayLineType[]> {
        if (year != null && season != null)
            var file = await HttpDownloader.Post(this._address_data(code), { year, season });
        else
            var file = await HttpDownloader.Get(this._address_data(code));

        const data = iconv.decode(file, 'gbk');     //转码

        return Array.from(cheerio('table tr', data).slice(1).map((index, element) => {
            const items = cheerio(element).children();

            return {
                date: items.eq(0).text(),
                close: exchangeToYi(items.eq(1).text()),
                high: exchangeToYi(items.eq(7).text()),
                low: exchangeToYi(items.eq(8).text()),
                open: exchangeToYi(items.eq(6).text()),
                volume: exchangeToWan(items.eq(4).text()),
                money: exchangeToWan(items.eq(5).text())
            };
        }));
    }


    protected _testData(data: DayLineType | any) {
        return /\d{4}.?\d{2}.?\d{2}/.test(data.date) &&
            data.close > 0 &&
            data.high > 0 &&
            data.low > 0 &&
            data.open > 0 &&
            data.volume > 0 &&
            data.money > 0;
    }

    /**
     * @param code 股票代码
     * @param downloadAll 是否下载全部数据
     */
    protected async _download(code: string, downloadAll?: boolean) {
        if (downloadAll) {
            const result: DayLineType[] = [];
            const min_year = Number.parseInt(await this._get_listing_year(code));

            for (let year = moment().year(); year >= min_year; year--) {
                for (let season = 4; season >= 1; season--) {
                    result.push(... await this._download_data(code, year, season));
                }
            }

            return result;
        } else {
            return await this._download_data(code);
        }
    }
}