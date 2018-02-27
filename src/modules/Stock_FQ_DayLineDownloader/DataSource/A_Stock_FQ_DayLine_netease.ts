import JSONP = require('jsonp-node');

import * as HttpDownloader from '../../../tools/HttpDownloader';
import { BaseDownloader } from '../../../tools/BaseDownloader';
import { GetLatestWeekData } from '../../../tools/GetLatestWeekData';
import { FQ_DayLineType } from '../FQ_DayLineType';

/** 
 * 网易财经 A股后复权收盘价数据下载器
 * 返回`jsonp`格式
 * 
 * 相关页面：http://quotes.money.163.com/1300359.html
 * 下载地址：http://img1.money.126.net/data/hs/klinederc/day/times/1300359.json?callback=ne30a1754cfd3dec
*/
export class A_Stock_FQ_DayLine_netease extends BaseDownloader {

    get name() {
        return '网易财经 A股后复权收盘价数据下载器';
    }

    private _address(code: string, market: number) {
        return `http://img1.money.126.net/data/hs/klinederc/day/times/${market - 1}${code}.json?callback=ne30a1754cfd3dec`;
    }

    protected _testData(data: FQ_DayLineType) {
        return /\d{4}.?\d{2}.?\d{2}/.test(data.date) &&
            data.close > 0;
    }

    protected async _download(code: string, name: string, market: number) {
        const file = await HttpDownloader.Get(this._address(code, market));

        const result: FQ_DayLineType[] = [];

        try {
            //由于如果没有数据，网易会返回一个404页面
            const data = JSONP.parse(file.toString(), 'ne30a1754cfd3dec');

            for (let index = 0; index < data.closes.length; index++) {
                result.push({
                    close: data.closes[index],
                    date: data.times[index]
                });
            }
        } catch  { }

        return result;
    }

    protected _process(err: Error | undefined, data: any[], [code, name, market, reDownload]: any[]): Promise<any[]> {
        return err ?
            Promise.reject(new Error(`"${this.name}" 下载 "${name}-${code}" 失败：${err.message}\n${err.stack}`)) :
            Promise.resolve(reDownload ? data : GetLatestWeekData(data, 'date'));
    }
}