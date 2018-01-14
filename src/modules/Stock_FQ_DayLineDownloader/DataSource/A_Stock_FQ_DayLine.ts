import * as HttpDownloader from '../../../tools/HttpDownloader';
import { BaseDownloader } from '../../../tools/BaseDownloader';
import { GetLatestWeekData } from '../../../tools/GetLatestWeekData';
import { FQ_DayLineType } from '../FQ_DayLineType';

/**
 * A股后复权收盘价数据下载器
 * 
 * 新浪财经数据。返回`js`格式的数据
 * 
 * 相关页面：http://finance.sina.com.cn/realstock/company/sz300359/nc.shtml
 * 下载地址：http://finance.sina.com.cn/realstock/newcompany/sz300359/phfq.js?_=1
 */
export class A_Stock_FQ_DayLine extends BaseDownloader {

    get name() {
        return '新浪财经 A股后复权收盘价数据下载器';
    }

    private _address(code: string, market: number) {
        return `http://finance.sina.com.cn/realstock/newcompany/${market === 1 ? 'sh' : 'sz'}${code}/phfq.js?_=1`;
    }

    protected _testData(data: FQ_DayLineType) {
        return /\d{4}.?\d{2}.?\d{2}/.test(data.date) &&
            data.close > 0;
    }

    protected async _download(code: string, name: string, market: number) {
        const reg_g = /_(\d{4}_\d{2}_\d{2}):"(-?[0-9\.]+)"/g;
        const reg = /_(\d{4}_\d{2}_\d{2}):"(-?[0-9\.]+)"/;

        const file = await HttpDownloader.Get(this._address(code, market));
        const data = file.toString().match(reg_g) || [];

        return data.map(item => {
            const temp = item.match(reg) || [];

            return {
                date: temp[1],
                close: Number.parseFloat(temp[2]),
            }
        });
    }

    protected _process(err: Error | undefined, data: any[], [code, name, market, reDownload]: any[]): Promise<any[]> {
        return err ?
            Promise.reject(new Error(`"${this.name}" 下载 "${name}-${code}" 失败：${err.message}\n${err.stack}`)) :
            Promise.resolve(reDownload ? data : GetLatestWeekData(data, 'date', 'YYYY_MM_DD'));
    }
}