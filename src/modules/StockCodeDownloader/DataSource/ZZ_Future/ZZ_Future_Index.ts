import * as fs from 'fs';
import * as path from 'path';
import * as dsv from 'd3-dsv';
import * as iconv from 'iconv-lite';
import * as _ from 'lodash';

import { BaseDownloader } from '../../../../tools/BaseDownloader';
import { StockCodeType } from '../../StockCodeType';
import { StockMarketType } from '../../../StockMarketList/StockMarketType';

/**
 * 郑州商品交易所。上市各产品主力连续。
 * 
 * 由于各个数据源的代码各不相同，所以只保留代码固定部分
 * 
 * 该目录下有一个`ZSS.xls`文件，这个是我从同花顺，上期所页面下导出的，只保留了名称与代码。`GBK`编码
 */
export class ZZ_Future_Index extends BaseDownloader {

    get name() {
        return '郑州商品交易所 代码下载器';
    }

    protected _testData(data: StockCodeType) {
        return /^[a-z]+$/i.test(data.code) &&       //股票代码
            data.name.endsWith('主连')
    }

    protected async _download() {
        const file = fs.readFileSync(path.resolve(__dirname, './ZSS_2018-1-6.xls'));
        const data = dsv.tsvParse(iconv.decode(file, 'gbk'));     //转码

        return data.map(item => {
            const [name = '', code = ''] = _.map(item, value => value && value.trim());   //去除空格

            return {
                code: (<any>code).match(/[a-z]+/i)[0],
                name,
                market: StockMarketType.zss.id,
                isIndex: true
            };
        });
    }

    protected _process(err: Error | undefined, data: any[], downloadArgs: any[]): Promise<any[]> {
        if (err === undefined && data.length === 0)
            return super._process(new Error('没有读取到满足条件的数据'), data, downloadArgs);
        else
            return super._process(err, data, downloadArgs);
    }
}