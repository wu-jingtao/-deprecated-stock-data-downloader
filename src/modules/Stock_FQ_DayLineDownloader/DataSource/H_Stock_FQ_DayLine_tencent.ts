import * as jsonp from 'jsonp-node';

import * as HttpDownloader from '../../../tools/HttpDownloader';
import { BaseDownloader } from '../../../tools/BaseDownloader';
import { GetLatestWeekData } from '../../../tools/GetLatestWeekData';
import { FQ_DayLineType } from '../FQ_DayLineType';

/**
 * 港股后复权收盘价数据下载器
 * 
 * 腾讯财经数据。返回`js`格式的数据
 * 
 * 相关页面：http://gu.qq.com/hk00700/gp
 * 下载地址：http://web.ifzq.gtimg.cn/other/klineweb/klineWeb/weekTrends?code=hk00700&type=hfq&_var=trend_hfq&r=0.16858980765331322
 */
export class H_Stock_FQ_DayLine_tencent extends BaseDownloader {

    get name() {
        return '腾讯财经 港股后复权收盘价数据下载器';
    }

    private _address(code: string) {
        return `http://web.ifzq.gtimg.cn/other/klineweb/klineWeb/weekTrends?code=hk${code}&type=hfq&_var=trend_hfq&r=0.16858980765331322`;
    }

    protected _testData(data: FQ_DayLineType) {
        return /\d{4}.?\d{2}.?\d{2}/.test(data.date) &&
            data.close > 0;
    }

    protected async _download(code: string, name: string) {
        let result = [];

        const file = await HttpDownloader.Get(this._address(code));

        try {
            const data = jsonp.parse_var(file.toString(), 'trend_hfq', true);
            if (data.code == 0 && data.msg == 'ok') {   //确保腾讯返回的数据正确
                result = data.data.map(([date, close]: any) => ({ date, close }));
            }
        } catch  { }
        
        return result;
    }

    protected _process(err: Error | undefined, data: any[], [code, name, reDownload]: any[]): Promise<any[]> {
        return err ?
            Promise.reject(new Error(`"${this.name}" 下载 "${name}-${code}" 失败：${err.message}\n${err.stack}`)) :
            Promise.resolve(reDownload ? data : GetLatestWeekData(data, 'date'));
    }
}