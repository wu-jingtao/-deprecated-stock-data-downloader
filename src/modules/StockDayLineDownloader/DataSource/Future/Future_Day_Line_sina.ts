import * as moment from 'moment';

import * as HttpDownloader from '../../../../tools/HttpDownloader';
import { BaseDownloader } from '../../../../tools/BaseDownloader';
import { GetLatestWeekData } from '../../../../tools/GetLatestWeekData';
import { DayLineType } from '../../DayLineType';
import { exchangeToWan, exchangeToYi } from '../../Tools';

/**
 * 国内商品期货日线数据下载器
 * 
 * 新浪财经数据。返回`js`格式的数据
 * 
 * 相关页面：http://finance.sina.com.cn/futures/quotes/HC0.shtml
 * 下载地址：http://stock2.finance.sina.com.cn/futures/api/jsonp.php/var%20_HC02018_1_12=/InnerFuturesNewService.getDailyKLine?symbol=HC0&_=2018_1_12
 */
export class Future_Day_Line_sina extends BaseDownloader {

    get name() {
        return '新浪财经 国内商品期货日线数据下载器';
    }

    private _address(code: string) {
        return `http://stock2.finance.sina.com.cn/futures/api/jsonp.php/var%20_HC02018_1_12=/InnerFuturesNewService.getDailyKLine?symbol=${code}0&_=${moment().add({ days: 1 }).format('YYYY_M_D')}`;
    }

    protected _testData(data: DayLineType) {
        return /\d{4}.?\d{2}.?\d{2}/.test(data.date) &&
            data.close > 0 &&
            data.high > 0 &&
            data.low > 0 &&
            data.open > 0 &&
            data.volume > 0;
    }

    /**
     * @param code 股票代码
     */
    protected async _download(code: string) {
        const reg = /\{d:"(\d{4}-\d{2}-\d{2})",o:"(-?[0-9\.]+)",h:"(-?[0-9\.]+)",l:"(-?[0-9\.]+)",c:"(-?[0-9\.]+)",v:"(-?[0-9\.]+)"\}/;
        const reg_g = /\{d:"(\d{4}-\d{2}-\d{2})",o:"(-?[0-9\.]+)",h:"(-?[0-9\.]+)",l:"(-?[0-9\.]+)",c:"(-?[0-9\.]+)",v:"(-?[0-9\.]+)"\}/g;

        const file = await HttpDownloader.Get(this._address(code));

        return (file.toString().match(reg_g) || []).map(item => {
            const data = item.match(reg) || [];

            return {
                date: data[1],
                close: exchangeToYi(data[5]),
                high: exchangeToYi(data[3]),
                low: exchangeToYi(data[4]),
                open: exchangeToYi(data[2]),
                volume: exchangeToWan(data[6])
            };
        });
    }

    protected _process(err: Error | undefined, data: any[], [code, name, reDownload]: any[]): Promise<any[]> {
        return err ?
            Promise.reject(new Error(`"${this.name}" 下载 "${name}-${code}" 失败：${err.message}\n${err.stack}`)) :
            Promise.resolve(reDownload ? GetLatestWeekData(data, 'date') : data);
    }
}