import * as cheerio from 'cheerio';
import * as iconv from 'iconv-lite';
import * as moment from 'moment';
import expect = require('expect.js');

import * as HttpDownloader from '../../../../tools/HttpDownloader';
import { Retry3 } from '../../../../tools/Retry';
import { DayLineType } from '../../DayLineType';
import { exchangeToWan, testData, exchangeToYi } from '../../Tools';

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

//行情开始年份地址
function address_min_year(code: string) {
    return `http://stock.finance.sina.com.cn/hkstock/api/jsonp.php/var%20hk_history_data_range_${code}%20%3d/HistoryTradeService.getHistoryRange?symbol=${code}`;
}

//下载地址
function address_data(code: string) {
    return `http://stock.finance.sina.com.cn/hkstock/history/${code}.html`;
}

/**
 * 下载数据
 * @param code 代码
 * @param year 年份
 * @param season 季度
 */
function download(code: string, year?: number, season?: number): Promise<DayLineType[]> {
    return Retry3(async () => {
        if (year != null && season != null)
            var file = await HttpDownloader.Post(address_data(code), { year, season });
        else
            var file = await HttpDownloader.Get(address_data(code));

        const data = iconv.decode(file, 'gbk');     //转码
        const result: DayLineType[] = [];

        cheerio('table tr', data).slice(1).each((index, element) => {
            const items = cheerio(element).children();
            const temp: any = {
                date: items.eq(0).text(),
                close: exchangeToYi(items.eq(1).text()),
                high: exchangeToYi(items.eq(7).text()),
                low: exchangeToYi(items.eq(8).text()),
                open: exchangeToYi(items.eq(6).text()),
                volume: exchangeToWan(items.eq(4).text()),
                money: exchangeToWan(items.eq(5).text())
            };

            if (testData(temp)) result.push(temp);
        });

        if (result.length === 0) throw 'no data';   //如果没有下载到数据就再试几次，排除服务器异常的情况

        return result;
    })().catch(err => { if (err === 'no data') return []; else throw err; });
}

/**
 * 获取港股上市年份
 */
function get_listing_year(code: string): Promise<string> {
    return Retry3(async () => {
        const file = await HttpDownloader.Get(address_min_year(code));
        const year = (file.toString().match(/min:"(\d{4})/) || [])[1];
        expect(/^\d{4}$/.test(year)).to.be.ok();
        return year;
    })();
}

/**
 * 港股日线数据下载器。
 * 
 * @param code 股票代码
 * @param name 股票名称
 * @param downloadAll 是否下载所有数据
 */
export async function H_Stock_Day_Line_Downloader_sina(code: string, name: string, downloadAll?: boolean) {
    try {
        if (downloadAll) {
            const result: DayLineType[] = [];
            const min_year = Number.parseInt(await get_listing_year(code));

            for (let year = moment().year(); year >= min_year; year--) {
                for (let season = 4; season >= 1; season--) {
                    result.push(... await download(code, year, season));
                }
            }

            return result;
        } else {
            return await download(code);
        }
    } catch (err) {
        throw new Error(`下载港股"${name}-${code}"失败：` + `${err.message}\n${err.stack}`);
    }
}