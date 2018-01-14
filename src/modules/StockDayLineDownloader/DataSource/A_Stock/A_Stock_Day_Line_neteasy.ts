import * as dsv from 'd3-dsv';
import * as iconv from 'iconv-lite';
import * as moment from 'moment';

import * as HttpDownloader from '../../../../tools/HttpDownloader';
import { BaseDownloader } from '../../../../tools/BaseDownloader';
import { DayLineType } from '../../DayLineType';
import { exchangeToWan, exchangeToYi } from '../../Tools';

/**
 * A股与A股指数日线数据下载器
 * 
 * 网易财经数据。返回`csv`格式的数据，`GBK`编码
 * 
 * 相关页面：http://quotes.money.163.com/trade/lsjysj_300359.html#01b07
 * 下载地址：http://quotes.money.163.com/service/chddata.html?code=1300359&start=20140113&end=20180109&fields=TCLOSE;HIGH;LOW;TOPEN;LCLOSE;CHG;PCHG;TURNOVER;VOTURNOVER;VATURNOVER;TCAP;MCAP
 */
export class A_Stock_Day_Line_neteasy extends BaseDownloader {

    get name() {
        return '网易财经 A股与A股指数日线数据下载器';
    }

    private _address(code: string, market: number, startDate: string) {
        return `http://quotes.money.163.com/service/chddata.html?code=${market - 1}${code}&start=${moment(startDate).format('YYYYMMDD')}&end=${moment().format('YYYYMMDD')}&fields=TCLOSE;HIGH;LOW;TOPEN;LCLOSE;CHG;PCHG;TURNOVER;VOTURNOVER;VATURNOVER;TCAP;MCAP`;
    }

    protected _testData(data: DayLineType | any) {
        return /\d{4}.?\d{2}.?\d{2}/.test(data.date) &&
            data.close > 0 &&
            data.high > 0 &&
            data.low > 0 &&
            data.open > 0 &&
            data.pre_close > 0 &&
            data.exchange_ratio > 0 &&
            data.volume > 0 &&
            data.money > 0 &&
            data.gross_market_value > 0 &&
            data.current_market_value > 0;
    }

    /**
     * @param code 股票代码
     * @param market 所属市场 上海1 深圳2
     * @param startDate 开始日期
     */
    protected async _download(code: string, name: string, market: number, startDate: string) {
        const file = await HttpDownloader.Get(this._address(code, market, startDate));
        const data = iconv.decode(file, 'gbk');     //转码

        return dsv.csvParse(data).map(item => ({
            date: item['日期'],
            close: exchangeToYi(item['收盘价']),
            high: exchangeToYi(item['最高价']),
            low: exchangeToYi(item['最低价']),
            open: exchangeToYi(item['开盘价']),
            pre_close: exchangeToYi(item['前收盘']),
            exchange_ratio: exchangeToYi(item['换手率']),
            volume: exchangeToWan(item['成交量']),
            money: exchangeToWan(item['成交金额']),
            gross_market_value: exchangeToWan(item['总市值']),
            current_market_value: exchangeToWan(item['流通市值'])
        }));
    }

    protected _process(err: Error | undefined, data: any[], [code, name]: any[]): Promise<any[]> {
        return err ?
            Promise.reject(new Error(`"${this.name}" 下载 "${name}-${code}" 失败：${err.message}\n${err.stack}`)) :
            Promise.resolve(data);
    }
}