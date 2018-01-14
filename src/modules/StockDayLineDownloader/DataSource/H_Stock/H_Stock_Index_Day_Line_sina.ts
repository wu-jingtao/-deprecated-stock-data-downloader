import * as moment from 'moment';
import * as iconv from 'iconv-lite';

import * as HttpDownloader from '../../../../tools/HttpDownloader';
import { BaseDownloader } from '../../../../tools/BaseDownloader';
import { GetLatestWeekData } from '../../../../tools/GetLatestWeekData';
import { DayLineType } from '../../DayLineType';
import * as Sina_HQ_DayLine_Decoder from '../../Sina_HQ_DayLine_Decoder.js';

/**
 * 港股指数日线数据下载器（目前就只有恒生指数）
 * 
 * 新浪财经数据。返回`js`格式的数据
 * 
 * 相关页面：http://stock.sina.com.cn/hkstock/quotes/HSI.html
 * 下载地址：http://finance.sina.com.cn/stock/hkstock/HSI/klc_kl.js?d=2018_1_11 
 *      这个数据源返回的数据缺少当天的K线
 *      后来发现：其实在今天的日期上加一就可以得到了
 */
export class H_Stock_Index_Day_Line_sina extends BaseDownloader {

    get name() {
        return '新浪财经 港股指数日线数据下载器';
    }

    //下载地址
    private _address_history(code: string) {
        return `http://finance.sina.com.cn/stock/hkstock/${code}/klc_kl.js?d=${moment().add({ days: 1 }).format('YYYY_M_D')}`;
    }

    protected _testData(data: DayLineType | any) {
        return /\d{4}.?\d{2}.?\d{2}/.test(data.date) &&
            data.close > 0 &&
            data.high > 0 &&
            data.low > 0 &&
            data.open > 0 &&
            data.volume > 0;
    }

    private async _download_history(code: string): Promise<DayLineType[]> {
        //下载到的数据格式
        type historyData = { date: Date, close: number, high: number, low: number, open: number, volume: number };

        const file = await HttpDownloader.Get(this._address_history(code));
        const data: historyData[] = Sina_HQ_DayLine_Decoder((file.toString().match(/="(.+?)";/) || [])[1] || "");

        return data.map(item => ({
            date: moment(item.date).format("YYYY-MM-DD"),
            close: item.close,
            high: item.high,
            low: item.low,
            open: item.open,
            volume: item.volume / 10000 //新浪这里返回的数据实际上是成交金额
        }));
    }

    /**
     * @param code 股票代码
     */
    protected async _download(code: string) {
        return await this._download_history(code);
    }

    protected _process(err: Error | undefined, data: any[], [code, name, reDownload]: any[]): Promise<any[]> {
        return err ?
            Promise.reject(new Error(`"${this.name}" 下载 "${name}-${code}" 失败：${err.message}\n${err.stack}`)) :
            Promise.resolve(reDownload ? data : GetLatestWeekData(data, 'date'));
    }
}

/*
    //当天数据：http://hq.sinajs.cn/?list=hkHSI  (弃用了：新浪返回的数据有问题)


    //当天的数据
    private _address_today(code: string) {
        return `http://hq.sinajs.cn/?list=rt_hk${code}`;
    }


    //已弃用
    private async _download_today(code: string): Promise<DayLineType> {
        const file = await HttpDownloader.Get(this._address_today(code));
        const data: any[] = ((iconv.decode(file, 'gbk').match(/="(.+?)";/) || [])[1] || "").split(',');     //转码

        return {
            date: data[17],
            close: data[6],
            high: data[4],
            low: data[5],
            open: data[2],
            volume: data[11] / 10000
        };
    }
*/