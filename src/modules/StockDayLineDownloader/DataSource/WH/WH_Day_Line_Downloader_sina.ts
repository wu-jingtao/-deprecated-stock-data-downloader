import * as moment from 'moment';

import * as HttpDownloader from '../../../../tools/HttpDownloader';
import { Retry3 } from '../../../../tools/Retry';
import { DayLineType } from '../../DayLineType';
import { exchangeToWan, testData, exchangeToYi } from '../../Tools';

/**
 * 外汇日线数据下载器
 * 
 * 新浪财经数据。返回`js`格式的数据
 * 
 * 相关页面：http://finance.sina.com.cn/money/forex/hq/USDCNY.shtml
 * 下载地址：http://vip.stock.finance.sina.com.cn/forex/api/jsonp.php/var%20_fx_susdcny2018_1_12=/NewForexService.getDayKLine?symbol=fx_susdcny&_=2018_1_12
 */

//下载地址
function address(code: string) {
    return `http://vip.stock.finance.sina.com.cn/forex/api/jsonp.php/var%20_fx_susdcny2018_1_12=/NewForexService.getDayKLine?symbol=${code}&_=${moment().add({ days: 1 }).format('YYYY_M_D')}`;
}

function download(code: string): Promise<DayLineType[]> {
    return Retry3(async () => {
        const file = await HttpDownloader.Get(address(code));
        const result: DayLineType[] = [];
        const data = (file.toString().match(/\("(.+?)"\)/) || [])[1] || '';

        data.split('|').forEach(item => {
            const data = item.split(',');

            const temp: any = {
                date: data[0],
                close: exchangeToYi(data[4]),
                high: exchangeToYi(data[3]),
                low: exchangeToYi(data[2]),
                open: exchangeToYi(data[1]),
                volume: 1   //外汇没有成交量数据
            };

            if (testData(temp)) result.push(temp);
        });

        if (result.length === 0) throw new Error('没下载到数据');

        return result;
    })();
}

/**
 * 外汇日线数据下载器
 * 
 * @param code 股票代码
 * @param name 股票名称
 */
export async function WH_Day_Line_Downloader_sina(code: string, name: string) {
    try {
        const result = await download(code);
        return result;
    } catch (err) {
        throw new Error(`下载外汇"${name}-${code}"失败：` + `${err.message}\n${err.stack}`);
    }
}