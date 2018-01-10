import * as dsv from 'd3-dsv';
import * as iconv from 'iconv-lite';
import * as moment from 'moment';

import * as HttpDownloader from '../../../../tools/HttpDownloader';
import { Retry3 } from '../../../../tools/Retry';
import { StockMarketType } from '../../../StockMarketList/StockMarketType';
import { DayLineType } from '../../DayLineType';
import { exchangeToWan, testData } from '../Tools';

/**
 * A股与A股指数日线数据下载器
 * 
 * 网易财经数据。返回`csv`格式的数据，`GBK`编码
 * 
 * 相关页面：http://quotes.money.163.com/trade/lsjysj_300359.html#01b07
 * 下载地址：http://quotes.money.163.com/service/chddata.html?code=1300359&start=20140113&end=20180109&fields=TCLOSE;HIGH;LOW;TOPEN;LCLOSE;CHG;PCHG;TURNOVER;VOTURNOVER;VATURNOVER;TCAP;MCAP
 */

//下载地址
function address(code: string, market: number, startDate: string) {
    return `http://quotes.money.163.com/service/chddata.html?code=${market - 1}${code}&start=${moment(startDate).format('YYYYMMDD')}&end=${moment().format('YYYYMMDD')}&fields=TCLOSE;HIGH;LOW;TOPEN;LCLOSE;CHG;PCHG;TURNOVER;VOTURNOVER;VATURNOVER;TCAP;MCAP`;
}

async function download(code_id: number, code: string, market: number, startDate: string): Promise<DayLineType> {
    const file = await HttpDownloader.Get(address(code, market, startDate));
    const data = iconv.decode(file, 'gbk');     //转码
    const result = dsv.csvParse(data);
    const day_line: any[] = [];

    result.forEach(item => {
        if (0 != (item['收盘价'] as any)) {    //不保存停牌期间的数据
            day_line.push({
                date: item['日期'],
                close: item['收盘价'],
                high: item['最高价'],
                low: item['最低价'],
                open: item['开盘价'],
                pre_close: item['前收盘'],
                exchange_ratio: item['换手率'],
                volume: exchangeToWan(item['成交量']),
                money: exchangeToWan(item['成交金额']),
                gross_market_value: exchangeToWan(item['总市值']),
                current_market_value: exchangeToWan(item['流通市值'])
            });
        }
    });

    return { code_id, code, day_line };
}

/**
 * A股与A股指数日线数据下载器
 * 
 * @param code_id `stock_code`中对应的`id`
 * @param code 股票代码
 * @param market 所属市场 上海1 深圳2
 * @param name 股票名称
 * @param startDate 开始日期
 */
export function A_Stock_Day_Line_Downloader(code_id: number, code: string, market: number, name: string, startDate: string) {
    return Retry3(async () => testData(await download(code_id, code, market, startDate)))()
        .catch(err => { throw new Error(`下载A股"${name}-${code}"失败：` + err) });
}