import expect = require('expect.js');

import * as HttpDownloader from '../../../../tools/HttpDownloader';
import { Retry3 } from '../../../../tools/Retry';
import { StockCodeType } from '../../StockCodeType';
import { StockMarketType } from '../../../StockMarketList/StockMarketType';

/**
 * 上交所，沪港通代码列表。
 * 注意：有些港股没有中文名称，没有中文名的用英文名来代替
 * 
 * 数据格式`HTML`。数据在一个<script>标签中
 * 下载地址：http://www.sse.com.cn/services/hkexsc/disclo/eligiblead/
 */

//下载地址
const address = 'http://www.sse.com.cn/services/hkexsc/disclo/eligiblead/';

//下载数据
async function download(): Promise<StockCodeType[]> {
    const file = (await HttpDownloader.Get(address)).toString();

    //数据排列：序号	港股代码	英文简称	中文简称	调整内容	生效日期
    const reg_g = /\[\s+"\d+",\s+"(\d{5})",\s+"(.+?)",\s+"(.+?)",\s+"(.+?)",\s+"(\d{4}-\d{2}-\d{2})"\s+\]/g;
    const reg = /\[\s+"\d+",\s+"(\d{5})",\s+"(.+?)",\s+"(.+?)",\s+"(.+?)",\s+"(\d{4}-\d{2}-\d{2})"\s+\]/;   //如果 正则带g 则reg.exec() 重复执行时会出现间断返回null的情况

    const lines = file.match(reg_g) || [];    //由于JS不支持直接获取全部，所以只有先差分成行，再获取项

    const result: StockCodeType[] = lines.map(item => {
        const match = reg.exec(item) as any;

        return {
            code: match[1].trim(),
            name: match[3].trim() === '-' ? match[2].trim() : match[3].trim(), //如果没有中文名就用英文名
            market: StockMarketType.xg.id,
            isIndex: false
        };
    });

    return result;
}

//检测下载的数据是否正确
function test(data: StockCodeType[]) {
    expect(data.length).to.greaterThan(0);

    data.forEach(item => {
        expect(/^\d{5}$/.test(item.code)).to.be.ok();  //股票代码
        expect(item.name.length).to.greaterThan(1);    //确保公司名称不为空
    });

    return data;
}

/**
 * 沪港通代码下载器
 */
export const H_Code_hgt = Retry3(async () => test(await download()));