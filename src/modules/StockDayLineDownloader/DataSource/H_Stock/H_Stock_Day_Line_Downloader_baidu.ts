import * as HttpDownloader from '../../../../tools/HttpDownloader';
import { Retry3 } from '../../../../tools/Retry';
import { DayLineType } from '../../DayLineType';
import { exchangeToWan, testData, exchangeToYi } from '../../Tools';

/**
 * 港股与港股指数日线数据下载器
 * 
 * 百度股市通数据。返回`json`格式的数据
 * 注意：百度的恒生指数数据缺少成交量，而且很多港股数据不全
 * 
 * 相关页面：https://gupiao.baidu.com/stock/hk00700.html?from=aladingpc
 * 下载地址：https://gupiao.baidu.com/api/stocks/stockdaybar?from=pc&os_ver=1&cuid=xxx&vv=100&format=json&stock_code=hk00700&step=3&start=&count=16000&fq_type=no&timestamp=1515682611182
 */

//下载地址
function address_data(code: string, length: number = 999999) {
    return `https://gupiao.baidu.com/api/stocks/stockdaybar?from=pc&os_ver=1&cuid=xxx&vv=100&format=json&stock_code=hk${code}&step=3&start=&count=${length}&fq_type=no&timestamp=1515682611182`;
}

async function download(code: string, length?: number): Promise<DayLineType[]> {
    const file = await HttpDownloader.Get(address_data(code, length));
    const data = JSON.parse(file.toString());
    const result: DayLineType[] = [];

    data.mashData.forEach((item: any) => {
        const temp: DayLineType = {
            date: item.date.toString(),
            close: item.kline.close,
            high: item.kline.high,
            low: item.kline.low,
            open: item.kline.open,
            pre_close: item.kline.preClose,
            volume: item.kline.volume / 10000,
            money: item.kline.amount / 10000
        };

        if (testData(temp)) result.push(temp);
    });

    if (result.length === 0) throw new Error('没下载到数据');

    return result;
}

/**
 * 港股日线数据下载器。
 * 
 * @param code 股票代码
 * @param name 股票名称
 * @param length 下载从当天起，多少天内的数据
 */
export function H_Stock_Day_Line_Downloader_baidu(code: string, name: string, length?: number) {
    return Retry3(async () => await download(code, length))()
        .catch(err => { throw new Error(`下载港股"${name}-${code}"失败：` + `${err.message}\n${err.stack}`); });
}