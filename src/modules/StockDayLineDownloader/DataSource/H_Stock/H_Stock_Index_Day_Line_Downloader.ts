import * as moment from 'moment';

import * as HttpDownloader from '../../../../tools/HttpDownloader';
import { Retry3 } from '../../../../tools/Retry';
import { DayLineType } from '../../DayLineType';
import { exchangeToWan, testData, exchangeToYi } from '../../Tools';
import { Sina_HQ_DayLine_Decoder } from '../../Sina_HQ_DayLine_Decoder.js';

/**
 * 港股指数日线数据下载器（目前就只有恒生指数）
 * 
 * 新浪财经数据。返回`js`格式的数据
 * 
 * 相关页面：http://stock.sina.com.cn/hkstock/quotes/HSI.html
 * 下载地址：http://finance.sina.com.cn/stock/hkstock/HSI/klc_kl.js?d=2018_1_11 
 *      这个数据源返回的数据缺少当天的K线
 */

//下载到的数据格式
type downloadedData = { date: Date, close: number, high: number, low: number, open: number, volume: number };

//下载地址
function address(code: string) {
    return `http://finance.sina.com.cn/stock/hkstock/${code}/klc_kl.js?d=${moment().format('YYYY_M_D')}`;
}

async function download(code: string): Promise<DayLineType[]> {
    const file = await HttpDownloader.Get(address(code));
    const data: downloadedData[] = Sina_HQ_DayLine_Decoder((file.toString().match(/="(.+?)";/) || [])[1] || "");
    const result: DayLineType[] = [];

    data.forEach(item => {
        const temp: any = {
            date: moment(item.date).format("YYYY-MM-DD"),
            close: item.close,
            high: item.high,
            low: item.low,
            open: item.open,
            volume: item.volume / 10000
        };

        if (testData(temp)) result.push(temp);
    });

    if (result.length === 0) throw 'no data';   //如果没有下载到数据就再试几次，排除服务器异常的情况

    return result;
}

/**
 * 港股指数日线数据下载器
 * 
 * @param code 股票代码
 * @param name 股票名称
 */
export function H_Stock_Index_Day_Line_Downloader(code: string, name: string) {
    return Retry3(async () => await download(code))()
        .catch(err => {
            if (err !== 'no data')
                throw new Error(`下载港股指数"${name}-${code}"失败：` + `${err.message}\n${err.stack}`);
            else
                return [];
        });
}