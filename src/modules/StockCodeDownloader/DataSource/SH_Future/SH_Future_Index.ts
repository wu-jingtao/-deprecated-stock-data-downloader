import * as fs from 'fs';
import * as path from 'path';
import * as dsv from 'd3-dsv';
import * as iconv from 'iconv-lite';
import * as _ from 'lodash';
import expect = require('expect.js');

import { StockCodeType } from "../../StockCodeType";
import { StockMarketType } from "../../../StockMarketList/StockMarketType";

//读取数据
function read(): StockCodeType[] {
    const file = fs.readFileSync(path.resolve(__dirname, './SQS.xls'));
    const data = iconv.decode(file, 'gbk');     //转码
    const parsed = dsv.tsvParse(data);

    const result: StockCodeType[] = [];

    parsed.forEach(item => {
        const [name, code] = _.map(item, value => value && value.trim());   //去除空格

        if (code && name && name.endsWith('主连')) {
            result.push({
                code: (code.match(/[a-z]+/i) as any)[0],
                name,
                market: StockMarketType.sqs.id,
                isIndex: true
            });
        }
    });

    return result;
}

//检测下载的数据是否正确
function test(data: StockCodeType[]) {
    expect(data.length).to.greaterThan(0);

    data.forEach(item => {
        expect(/^[a-z]+$/i.test(item.code)).to.be.ok();  //股票代码
        expect(item.name.length).to.greaterThan(0);     //确保公司名称不为空
    });

    return data;
}

/**
 * 上海期货交易所。上市各产品主力连续。
 * 
 * 由于各个数据源的代码各不相同，所以只保留代码固定部分
 * 
 * 该目录下有一个`SQS.xls`文件，这个是我从同花顺，上期所页面下导出的，只保留了名称与代码。`GBK`编码
 */

/**
 * 上海期货指数
 */
export function SH_Future_Index(): StockCodeType[] {
    return test(read());
}
