import expect = require('expect.js');

import { DayLineType } from './DayLineType';

//将数字转换成以万的形式表示
export function exchangeToWan(data?: string) {
    if (data) {
        return Number.parseFloat(data) / 10000;
    }
}

//将数字转换成以一的形式表示
export function exchangeToYi(data?: string) {
    if (data) {
        return Number.parseFloat(data);
    }
}

//检测下载的数据是否正确
export function testData(data: DayLineType[]) {
    data.forEach(item => {
        expect(/\d{4}.?\d{2}.?\d{2}/.test(item.date)).to.be.ok();
        expect(item.close).to.greaterThan(0);
        expect(item.high).to.greaterThan(0);
        expect(item.low).to.greaterThan(0);
        expect(item.open).to.greaterThan(0);
        if (item.pre_close != null) expect(item.pre_close >= 0).to.ok();    //有些股票上市第一天可能为0
        if (item.exchange_ratio != null) expect(item.exchange_ratio).to.greaterThan(0);
        expect(item.volume).to.greaterThan(0);
        if (item.money != null) expect(item.money).to.greaterThan(0);
        if (item.gross_market_value != null) expect(item.gross_market_value).to.greaterThan(0);
        if (item.current_market_value != null) expect(item.current_market_value).to.greaterThan(0);
    });

    return data;
}