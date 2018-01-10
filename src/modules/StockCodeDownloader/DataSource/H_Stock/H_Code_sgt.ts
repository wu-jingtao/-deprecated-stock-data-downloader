import * as xlsx from 'xlsx';
import expect = require('expect.js');

import * as HttpDownloader from '../../../../tools/HttpDownloader';
import { Retry3 } from '../../../../tools/Retry';
import { StockCodeType } from '../../StockCodeType';
import { StockMarketType } from '../../../StockMarketList/StockMarketType';

/**
 * 深交所，深港通代码列表数据
 * 注意：有些港股没有中文名称，没有中文名的用英文名来代替
 * 
 * 相关页面：http://www.szse.cn/main/szhk/ggtywxx/bdzqmd/
 * 下载地址：http://www.szse.cn/szseWeb/ShowReport.szse?SHOWTYPE=xlsx&CATALOGID=SGT_GGTBDQD&tab1PAGENO=1&ENCODE=1&TABKEY=tab1
 */

//下载地址
const address = 'http://www.szse.cn/szseWeb/ShowReport.szse?SHOWTYPE=xlsx&CATALOGID=SGT_GGTBDQD&tab1PAGENO=1&ENCODE=1&TABKEY=tab1';

//下载数据
async function download(): Promise<StockCodeType[]> {
    const file = await HttpDownloader.Get(address);
    const data = xlsx.read(file);
    const result = xlsx.utils.sheet_to_json(data.Sheets["港股通标的证券名单"]) as any[];

    return result.map(item => {
        const english = (item['英文简称'] as string).trim()
        const chinese = (item['中文简称'] as string).trim()

        return {
            code: (item['港股代码'] as string).trim(),
            name: chinese || english,
            market: StockMarketType.xg.id,
            isIndex: false
        }
    });
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
 * 深港通代码下载器
 */
export function H_Code_sgt() {
    return Retry3(async () => test(await download()))()
        .catch(err => { throw new Error('下载深港通代码异常：' + `${err.message}\n${err.stack}`) });
}