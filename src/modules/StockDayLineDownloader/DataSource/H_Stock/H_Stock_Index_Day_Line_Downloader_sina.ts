import * as moment from 'moment';
import * as iconv from 'iconv-lite';

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
 *      后来发现：其实在今天的日期上加一就可以得到了
 * 
 * 当天数据：http://hq.sinajs.cn/?list=hkHSI  (弃用了：新浪返回的数据有问题)
 */

//当天的数据
function address_today(code: string) {
    return `http://hq.sinajs.cn/?list=rt_hk${code}`;
}

//下载地址
function address_history(code: string) {
    return `http://finance.sina.com.cn/stock/hkstock/${code}/klc_kl.js?d=${moment().add({ days: 1 }).format('YYYY_M_D')}`;
}

function download_history(code: string): Promise<DayLineType[]> {
    return Retry3(async () => {
        //下载到的数据格式
        type historyData = { date: Date, close: number, high: number, low: number, open: number, volume: number };

        const file = await HttpDownloader.Get(address_history(code));
        const data: historyData[] = Sina_HQ_DayLine_Decoder((file.toString().match(/="(.+?)";/) || [])[1] || "");
        const result: DayLineType[] = [];

        data.forEach(item => {
            const temp: any = {
                date: moment(item.date).format("YYYY-MM-DD"),
                close: item.close,
                high: item.high,
                low: item.low,
                open: item.open,
                volume: item.volume / 10000 //新浪这里返回的数据实际上是成交金额
            };

            if (testData(temp)) result.push(temp);
        });

        if (result.length === 0) throw new Error('没下载到数据');

        return result;
    })();
}

async function download_today(code: string): Promise<DayLineType> {
    return Retry3(async () => {
        const file = await HttpDownloader.Get(address_today(code));
        const data: any[] = ((iconv.decode(file, 'gbk').match(/="(.+?)";/) || [])[1] || "").split(',');     //转码

        const result = {
            date: data[17],
            close: data[6],
            high: data[4],
            low: data[5],
            open: data[2],
            volume: data[11] / 10000
        }

        if (!testData(result)) throw new Error('下载到的当天数据格式不正确');

        return result;
    })();
}

/**
 * 港股指数日线数据下载器
 * 
 * @param code 股票代码
 * @param name 股票名称
 */
export async function H_Stock_Index_Day_Line_Downloader_sina(code: string, name: string) {
    try {
        const result = await download_history(code);
        //result.push(await download_today(code));
        return result;
    } catch (err) {
        throw new Error(`下载港股指数"${name}-${code}"失败：` + `${err.message}\n${err.stack}`);
    }
}