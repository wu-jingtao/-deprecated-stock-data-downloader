import * as dsv from 'd3-dsv';
import * as iconv from 'iconv-lite';
import * as moment from 'moment';

import * as HttpDownloader from '../../../tools/HttpDownloader';
import { BaseDownloader } from '../../../tools/BaseDownloader';
import { TradeDetailType } from '../TradeDetailType';
import { exchangeToYi, exchangeToWan } from '../../StockDayLineDownloader/Tools';

/**
 * A股成交明细数据下载器
 * 
 * 腾讯财经数据。返回`tsv`格式的数据 `GBK`编码
 * 注意，腾讯好像只提供最近一个月的数据
 * 
 * 相关页面：http://stockhtm.finance.qq.com/sstock/quotpage/q/300359.htm#detail
 * 下载地址：http://stock.gtimg.cn/data/index.php?appn=detail&action=download&c=sz300359&d=20180112
 */
export class A_Stock_TradeDetail_tencent extends BaseDownloader {

    get name() {
        return '腾讯财经 A股成交明细数据下载器';
    }

    /**
     * @param date 日期
     */
    private _address(code: string, market: number, date: string) {
        return `http://stock.gtimg.cn/data/index.php?appn=detail&action=download&c=${market === 1 ? 'sh' : 'sz'}${code}&d=${moment(date).format('YYYYMMDD')}`;
    }

    /**
     * 转换买卖方向
     */
    private _tradeDirection(direction: string) {
        switch (direction.trim()) {
            case '卖盘':
                return 'S';
            case '买盘':
                return 'B';
            case '中性盘':
                return 'M';
        }
    }

    protected _testData(data: TradeDetailType) {
        return /\d{4}.?\d{2}.?\d{2}\s\d{1,2}:\d{1,2}:\d{1,2}/.test(data.date) &&
            data.price > 0 &&
            data.volume > 0 &&
            data.money > 0 &&
            ['S', 'B', 'M'].includes(data.direction);
    }

    /**
     * @param code 代码
     * @param name 名称
     * @param market 市场
     * @param dateList 要下载的日期列表。传入的日期要求"YYYY-MM-DD"格式
     */
    protected async _download(code: string, name: string, market: number, dateList: string[]) {
        const result: TradeDetailType[] = [];

        for (const date of dateList) {
            const file = await HttpDownloader.Get(this._address(code, market, date));
            const data = dsv.tsvParse(iconv.decode(file, 'gbk'));     //转码

            data.forEach((item: any) => {
                result.push({
                    date: `${date} ${item['成交时间'].trim()}`,
                    price: exchangeToYi(item['成交价格']),
                    volume: (exchangeToYi(item['成交量(手)']) as any) / 100,
                    money: exchangeToWan(item['成交额(元)']),
                    direction: this._tradeDirection(item['性质']),
                } as any);
            });
        }

        return result;
    }

    protected _process(err: Error | undefined, data: any[], [code, name]: any[]): Promise<any[]> {
        return err ?
            Promise.reject(new Error(`"${this.name}" 下载 "${name}-${code}" 失败：${err.message}\n${err.stack}`)) :
            Promise.resolve(data);
    }
}