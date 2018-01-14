import * as moment from 'moment';

import * as HttpDownloader from '../../../../tools/HttpDownloader';
import { BaseDownloader } from '../../../../tools/BaseDownloader';
import { GetLatestWeekData } from '../../../../tools/GetLatestWeekData';
import { DayLineType } from '../../DayLineType';
import { exchangeToWan, exchangeToYi } from '../../Tools';

/**
 * 外汇日线数据下载器
 * 
 * 新浪财经数据。返回`js`格式的数据
 * 
 * 相关页面：http://finance.sina.com.cn/money/forex/hq/USDCNY.shtml
 * 下载地址：http://vip.stock.finance.sina.com.cn/forex/api/jsonp.php/var%20_fx_susdcny2018_1_12=/NewForexService.getDayKLine?symbol=fx_susdcny&_=2018_1_12
 */
export class WH_Day_Line_sina extends BaseDownloader {

    get name() {
        return '新浪财经 外汇日线数据下载器';
    }

    private _address(code: string) {
        return `http://vip.stock.finance.sina.com.cn/forex/api/jsonp.php/var%20_fx_susdcny2018_1_12=/NewForexService.getDayKLine?symbol=${code}&_=${moment().add({ days: 1 }).format('YYYY_M_D')}`;
    }

    protected _testData(data: DayLineType | any) {
        return /\d{4}.?\d{2}.?\d{2}/.test(data.date) &&
            data.close > 0 &&
            data.high > 0 &&
            data.low > 0 &&
            data.open > 0;
    }

    /**
     * @param code 股票代码
     */
    protected async _download(code: string) {
        const file = await HttpDownloader.Get(this._address(code));
        const data = (file.toString().match(/\("(.+?)"\)/) || [])[1] || '';

        return data.split('|').map(item => {
            const data = item.split(',');

            return {
                date: data[0],
                close: exchangeToYi(data[4]),
                high: exchangeToYi(data[3]),
                low: exchangeToYi(data[2]),
                open: exchangeToYi(data[1]),
                volume: 0   //外汇没有成交量数据
            };
        });
    }

    protected _process(err: Error | undefined, data: any[], [code, name, reDownload]: any[]): Promise<any[]> {
        return err ?
            Promise.reject(new Error(`"${this.name}" 下载 "${name}-${code}" 失败：${err.message}\n${err.stack}`)) :
            Promise.resolve(reDownload ? data : GetLatestWeekData(data, 'date'));
    }
}