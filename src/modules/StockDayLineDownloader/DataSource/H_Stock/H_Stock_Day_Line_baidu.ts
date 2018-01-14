import * as HttpDownloader from '../../../../tools/HttpDownloader';
import { BaseDownloader } from '../../../../tools/BaseDownloader';
import { DayLineType } from '../../DayLineType';

/**
 * 港股与港股指数日线数据下载器
 * 
 * 百度股市通数据。返回`json`格式的数据
 * 注意：百度的恒生指数数据缺少成交量，而且很多港股数据不全
 * 
 * 相关页面：https://gupiao.baidu.com/stock/hk00700.html?from=aladingpc
 * 下载地址：https://gupiao.baidu.com/api/stocks/stockdaybar?from=pc&os_ver=1&cuid=xxx&vv=100&format=json&stock_code=hk00700&step=3&start=&count=16000&fq_type=no&timestamp=1515682611182
 */
export class H_Stock_Day_Line_baidu extends BaseDownloader {

    get name() {
        return '百度股市通 港股与港股指数日线数据下载器';
    }

    private _address(code: string, length: number = 999999) {
        return `https://gupiao.baidu.com/api/stocks/stockdaybar?from=pc&os_ver=1&cuid=xxx&vv=100&format=json&stock_code=hk${code}&step=3&start=&count=${length}&fq_type=no&timestamp=1515682611182`;
    }

    protected _testData(data: DayLineType | any) {
        return /\d{4}.?\d{2}.?\d{2}/.test(data.date) &&
            data.close > 0 &&
            data.high > 0 &&
            data.low > 0 &&
            data.open > 0 &&
            data.pre_close > 0 &&
            data.volume > 0 &&
            data.money > 0;
    }

    /**
     * @param code 股票代码
     * @param length 要下载多少天的数据
     */
    protected async _download(code: string, name: string, length?: number) {
        const file = await HttpDownloader.Get(this._address(code, length));
        const data = JSON.parse(file.toString());
        return data.mashData.map((item: any) => ({
            date: item.date.toString(),
            close: item.kline.close,
            high: item.kline.high,
            low: item.kline.low,
            open: item.kline.open,
            pre_close: item.kline.preClose,
            volume: item.kline.volume / 10000,
            money: item.kline.amount / 10000
        }));
    }

    protected _process(err: Error | undefined, data: any[], [code, name]: any[]): Promise<any[]> {
        return err ?
            Promise.reject(new Error(`"${this.name}" 下载 "${name}-${code}" 失败：${err.message}\n${err.stack}`)) :
            Promise.resolve(data);
    }
}