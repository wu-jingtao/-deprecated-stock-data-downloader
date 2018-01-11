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

//检测某一日的数据是否正确
export function testData(data: DayLineType): boolean {
    try {
        expect(/\d{4}.?\d{2}.?\d{2}/.test(data.date)).to.be.ok();
        expect(data.close).to.greaterThan(0);
        expect(data.high).to.greaterThan(0);
        expect(data.low).to.greaterThan(0);
        expect(data.open).to.greaterThan(0);
        if (data.pre_close != null) expect(data.pre_close).to.greaterThan(0);
        if (data.exchange_ratio != null) expect(data.exchange_ratio).to.greaterThan(0);
        expect(data.volume).to.greaterThan(0);
        if (data.money != null) expect(data.money).to.greaterThan(0);
        if (data.gross_market_value != null) expect(data.gross_market_value).to.greaterThan(0);
        if (data.current_market_value != null) expect(data.current_market_value).to.greaterThan(0);

        return true;
    } catch {
        return false;
    }
}