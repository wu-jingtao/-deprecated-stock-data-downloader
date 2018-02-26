import * as iconv from 'iconv-lite';
import * as cheerio from 'cheerio';

import * as HttpDownloader from '../../../tools/HttpDownloader';
import { BaseDownloader } from '../../../tools/BaseDownloader';
import { GetLatestWeekData } from '../../../tools/GetLatestWeekData';
import { FQ_DayLineType } from '../FQ_DayLineType';

/**
 * A股后复权收盘价数据下载器
 * 
 * 新浪财经数据。返回`jsonp`格式的数据
 * 注意：如果某个股票停牌，新浪也会包含其当天的复权数据
 * 
 * 相关页面：http://finance.sina.com.cn/realstock/company/sz300359/nc.shtml
 * 下载地址：http://finance.sina.com.cn/realstock/newcompany/sz300359/phfq.js?_=1
 * 
 * --------------------------------------------------------
 * 
 * 由于上面的数据源，无法获取到当天的数据，所以加一个下面的数据源
 * 
 * 新浪财经数据。返回`html`格式的数据
 * 下载地址：http://vip.stock.finance.sina.com.cn/corp/go.php/vMS_FuQuanMarketHistory/stockid/600000.phtml
 */
export class A_Stock_FQ_DayLine_sina extends BaseDownloader {

    get name() {
        return '新浪财经 A股后复权收盘价数据下载器';
    }

    /**
     * 下载所有历史复权数据，不过当天的数据会滞后
     */
    private _addressAll(code: string, market: number) {
        return `http://finance.sina.com.cn/realstock/newcompany/${market === 1 ? 'sh' : 'sz'}${code}/phfq.js?_=1`;
    }

    /**
     * 下载当天的后复权数据
     */
    private _addressToday(code: string) {
        return `http://vip.stock.finance.sina.com.cn/corp/go.php/vMS_FuQuanMarketHistory/stockid/${code}.phtml`;
    }

    private async _downloadAll(code: string, market: number) {
        const reg_g = /_(\d{4}_\d{2}_\d{2}):"(-?[0-9\.]+)"/g;
        const reg = /_(\d{4}_\d{2}_\d{2}):"(-?[0-9\.]+)"/;

        const file = await HttpDownloader.Get(this._addressAll(code, market));
        const data = file.toString().match(reg_g) || [];

        return data.map(item => {
            const temp = item.match(reg) || [];

            return {
                date: temp[1],
                close: Number.parseFloat(temp[2]),
            }
        });
    }

    private async _downloadToday(code: string) {
        const file = await HttpDownloader.Get(this._addressToday(code));
        const data = iconv.decode(file, 'gbk');     //转码
        const $ = cheerio.load(data);

        const result: FQ_DayLineType[] = [];

        $("#FundHoldSharesTable tr").slice(2)   //去除前两行标题
            .each((i, e) => {
                const data = $(e).find("td div");
                result.push({
                    date: data.eq(0).text().trim(),
                    close: Number.parseFloat(data.eq(3).text())
                });
            });

        return result;
    }

    protected _testData(data: FQ_DayLineType) {
        return /\d{4}.?\d{2}.?\d{2}/.test(data.date) &&
            data.close > 0;
    }

    protected _download(code: string, name: string, market: number, reDownload: boolean) {
        return reDownload ? this._downloadAll(code, market) : this._downloadToday(code);
    }

    protected _process(err: Error | undefined, data: any[], [code, name]: any[]): Promise<any[]> {
        return err ?
            Promise.reject(new Error(`"${this.name}" 下载 "${name}-${code}" 失败：${err.message}\n${err.stack}`)) :
            Promise.resolve(data);
    }
}