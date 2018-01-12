import * as fs from 'fs';
import * as path from 'path';
import * as dsv from 'd3-dsv';
import * as iconv from 'iconv-lite';
import * as _ from 'lodash';

import { StockCodeType } from "../../StockCodeType";
import { StockMarketType } from "../../../StockMarketList/StockMarketType";

//检测下载的数据是否正确
function testData(data: StockCodeType) {
    return /^[a-z]+$/i.test(data.code) &&       //股票代码
        data.name.length > 0 &&                 //确保名称不为空
        data.name.endsWith('主连')
}

/**
 * 大连商品交易所。上市各产品主力连续。
 * 
 * 由于各个数据源的代码各不相同，所以只保留代码固定部分
 * 
 * 该目录下有一个`DSS.xls`文件，这个是我从同花顺，上期所页面下导出的，只保留了名称与代码。`GBK`编码
 */

/**
 * 大连商品交易所 各产品主力连续
 */
export function DL_Future_Index(): StockCodeType[] {
    const file = fs.readFileSync(path.resolve(__dirname, './DSS_2018-1-6.xls'));
    const data = iconv.decode(file, 'gbk');     //转码
    const parsed = dsv.tsvParse(data);

    const result: StockCodeType[] = [];

    parsed.forEach(item => {
        const [name, code] = _.map(item, value => value && value.trim());   //去除空格

        const temp: any = {
            code: ((code && code.match(/[a-z]+/i)) || [])[0],
            name,
            market: StockMarketType.dss.id,
            isIndex: true
        };

        if (testData(temp)) result.push(temp);
    });

    if (result.length === 0) throw new Error('没有收集到数据');

    return result;
}
