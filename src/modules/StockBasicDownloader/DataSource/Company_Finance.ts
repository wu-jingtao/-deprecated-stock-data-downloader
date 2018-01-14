import * as xlsx from 'xlsx';
import * as _ from 'lodash';

import * as HttpDownloader from '../../../tools/HttpDownloader';
import { BaseDownloader } from '../../../tools/BaseDownloader';
import { CompanyFinanceType } from '../CompanyFinanceType';
import { normalizeAmountToYi, normalizeAmountToWan, normalizePercent } from '../Tools';

/**
 * A股上市公司 财务数据下载。数据来源于同花顺f10
 * 
 * 返回数据：`xls`
 * 
 * 相关页面：http://basic.10jqka.com.cn/601398/finance.html
 * 下载地址：http://basic.10jqka.com.cn/api/stock/export.php?export=main&type=report&code=601398
 */
export class Company_Finance extends BaseDownloader {

    get name() {
        return 'A股财务数据下载器';
    }
    
    private address(code: string) {
        return "http://basic.10jqka.com.cn/api/stock/export.php?export=main&type=report&code=" + code;
    }

    /**
     * 解析表中的数据，将其转换成对象的形式。(因为同花顺返回的数据是行列颠倒的，没办法直接转换成对象)
     */
    private _parseData(sheet: xlsx.WorkSheet): any[] {
        const result: any[] = [];

        const columns: Set<string> = new Set(); //收集有哪些列(sheet中的属性是排好序)
        const rows: Set<string> = new Set();    //收集有哪些行

        _.forEach(sheet, (value, key) => {      //解析行列
            const column_key = key.match(/^[a-z]+/i);
            const row_key = key.match(/[0-9]+$/);
            if (column_key != null && row_key != null) {
                columns.add(column_key[0]);
                rows.add(row_key[0]);
            }
        });

        const title_column = columns.values().next().value;    //找出标题列的键  
        columns.delete(title_column);

        for (let column_key of columns) {        //开始转换数据
            const temp: any = {};

            for (let row_key of rows) {
                temp[sheet[title_column + row_key].v] = (sheet[column_key + row_key] || {}).v;
            }

            result.push(temp);
        }

        return result;
    }

    protected _testData(data: CompanyFinanceType) {
        return /\d{4}-\d{2}-\d{2}/.test(data.date) &&
            data.basic_earnings_per_share != null &&
            data.net_profit != null &&
            data.gross_revenue != null &&
            data.net_assets_per_share != null &&
            data.asset_liability_ratio != null &&
            data.capital_accumulation_fund_per_share != null &&
            data.undistributed_profit_per_share != null &&
            data.operating_cash_flow_per_share != null;
    }

    protected async _download(code: string) {
        const file = await HttpDownloader.Get(this.address(code));
        const data = this._parseData(xlsx.read(file).Sheets['Worksheet']);

        return data.map(item => ({
            date: item['科目\\时间'],
            basic_earnings_per_share: normalizeAmountToYi(item['基本每股收益']),
            net_profit: normalizeAmountToWan(item['净利润']),
            gross_revenue: normalizeAmountToWan(item['营业总收入']),
            net_assets_per_share: normalizeAmountToYi(item['每股净资产']),
            asset_liability_ratio: normalizePercent(item['资产负债比率']),
            capital_accumulation_fund_per_share: normalizeAmountToYi(item['每股资本公积金']),
            undistributed_profit_per_share: normalizeAmountToYi(item['每股未分配利润']),
            operating_cash_flow_per_share: normalizeAmountToYi(item['每股经营现金流'])
        }));
    }
}