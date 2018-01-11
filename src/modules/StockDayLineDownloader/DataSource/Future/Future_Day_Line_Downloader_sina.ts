import * as moment from 'moment';

import * as HttpDownloader from '../../../../tools/HttpDownloader';
import { Retry3 } from '../../../../tools/Retry';
import { DayLineType } from '../../DayLineType';
import { exchangeToWan, testData, exchangeToYi } from '../../Tools';

/**
 * 国内商品期货日线数据下载器
 * 
 * 新浪财经数据。返回`js`格式的数据
 * 
 * 相关页面：http://finance.sina.com.cn/futures/quotes/HC0.shtml
 * 下载地址：http://stock2.finance.sina.com.cn/futures/api/jsonp.php/var%20_HC02018_1_12=/InnerFuturesNewService.getDailyKLine?symbol=HC0&_=2018_1_12
 */

//下载地址
function address(code: string) {
    return `http://stock2.finance.sina.com.cn/futures/api/jsonp.php/var%20_HC02018_1_12=/InnerFuturesNewService.getDailyKLine?symbol=${code}0&_=${moment().add({ days: 1 }).format('YYYY_M_D')}`;
}

function download(code: string): Promise<DayLineType[]> {
    return Retry3(async () => {
        const reg = /\{d:"(\d{4}-\d{2}-\d{2})",o:"(-?[0-9\.]+)",h:"(-?[0-9\.]+)",l:"(-?[0-9\.]+)",c:"(-?[0-9\.]+)",v:"(-?[0-9\.]+)"\}/;
        const reg_g = /\{d:"(\d{4}-\d{2}-\d{2})",o:"(-?[0-9\.]+)",h:"(-?[0-9\.]+)",l:"(-?[0-9\.]+)",c:"(-?[0-9\.]+)",v:"(-?[0-9\.]+)"\}/g;

        const file = await HttpDownloader.Get(address(code));
        const result: DayLineType[] = [];

        (file.toString().match(reg_g) || []).forEach(item => {
            const data = item.match(reg) || [];

            const temp: any = {
                date: data[1],
                close: exchangeToYi(data[5]),
                high: exchangeToYi(data[3]),
                low: exchangeToYi(data[4]),
                open: exchangeToYi(data[2]),
                volume: exchangeToWan(data[6])
            };

            if (testData(temp)) result.push(temp);
        });

        if (result.length === 0) throw new Error('没下载到数据');

        return result;
    })();
}

/**
 * 国内商品期货日线数据下载器
 * 
 * @param code 股票代码
 * @param name 股票名称
 */
export async function Future_Day_Line_Downloader_sina(code: string, name: string) {
    try {
        const result = await download(code);
        return result;
    } catch (err) {
        throw new Error(`下载国内商品期货"${name}-${code}"失败：` + `${err.message}\n${err.stack}`);
    }
}