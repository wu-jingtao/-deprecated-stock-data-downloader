import JSONP = require('jsonp-node');

import * as HttpDownloader from '../../../tools/HttpDownloader';
import { BaseDownloader } from '../../../tools/BaseDownloader';
import { GetLatestWeekData } from '../../../tools/GetLatestWeekData';
import { FQ_DayLineType } from '../FQ_DayLineType';

/** 
 * 东方财富 A股后复权收盘价数据下载器
 * 返回`jsonp`格式
 * 
 * 相关页面：http://stockhtm.finance.qq.com/sstock/ggcx/300059.shtml
 * 下载地址：http://pdfm.eastmoney.com/EM_UBG_PDTI_Fast/api/js?rtntype=5&token=4f1862fc3b5e77c150a2b985b12db0fd&id=3000592&type=k&authorityType=ba&cb=jsonp1523700672251
 *
 * 发现东方财富的后复权数据与新浪网易的存在差别
*/
export class A_Stock_FQ_DayLine_eastmoney extends BaseDownloader {

    get name() {
        return '东方财富 A股后复权收盘价数据下载器';
    }

    private _address(code: string, market: number) {
        return `http://pdfm.eastmoney.com/EM_UBG_PDTI_Fast/api/js?rtntype=5&token=4f1862fc3b5e77c150a2b985b12db0fd&id=${code}${market}&type=k&authorityType=ba&cb=jsonp1523700672251`;
    }

    protected _testData(data: FQ_DayLineType) {
        return /\d{4}.?\d{2}.?\d{2}/.test(data.date) &&
            data.close > 0;
    }

    protected async _download(code: string, name: string, market: number) {
        const file = await HttpDownloader.Get(this._address(code, market));

        const result: FQ_DayLineType[] = [];

        try { //防止出现没有数据的情况
            const data = JSONP.parse(file.toString(), 'jsonp1523700672251');

            for (const item of data.data) {
                const data = item.split(',')
                result.push({
                    close: data[2],
                    date: data[0]
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