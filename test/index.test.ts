import expect = require('expect.js');

import { SH_A_Code_sjs } from '../src/modules/StockCodeDownloader/DataSource/A_Stock/SH_A_Code_sjs';
import { SZ_A_Code_sjs } from '../src/modules/StockCodeDownloader/DataSource/A_Stock/SZ_A_Code_sjs';
import { A_Code_dfcf } from '../src/modules/StockCodeDownloader/DataSource/A_Stock/A_Code_dfcf';

import { H_Code_hgt } from '../src/modules/StockCodeDownloader/DataSource/H_Stock/H_Code_hgt';
import { H_Code_sgt } from '../src/modules/StockCodeDownloader/DataSource/H_Stock/H_Code_sgt';

import { SH_Future_Index } from '../src/modules/StockCodeDownloader/DataSource/SH_Future/SH_Future_Index';
import { ZZ_Future_Index } from '../src/modules/StockCodeDownloader/DataSource/ZZ_Future/ZZ_Future_Index';
import { DL_Future_Index } from '../src/modules/StockCodeDownloader/DataSource/DL_Future/DL_Future_Index';

import { CompanyInformationDownloader } from '../src/modules/StockBasicDownloader/DataSource/CompanyInformationDownloader';
import { CompanyFinanceDownloader } from '../src/modules/StockBasicDownloader/DataSource/CompanyFinanceDownloader';

import { A_Stock_Day_Line_Downloader } from '../src/modules/StockDayLineDownloader/DataSource/A_Stock/A_Stock_Day_Line_Downloader';

describe('测试下载数据', function () {
    this.timeout(3 * 60 * 1000);

    describe('测试下载股票代码', function () {

        it('上交所 A股列表 数据', SH_A_Code_sjs);

        it('深交所 A股列表 数据', SZ_A_Code_sjs);

        it('东方财富 A股列表 数据', A_Code_dfcf);  //同时包含上交所与深交所

        it('沪港通 H股列表 数据', H_Code_hgt);

        it('深港通 H股列表 数据', H_Code_sgt);

        it('上海期货交易所 主连列表 数据', SH_Future_Index);

        it('郑州商品交易所 主连列表 数据', ZZ_Future_Index);

        it('大连商品交易所 主连列表 数据', DL_Future_Index);
    });

    describe('测试下载基本面数据', function () {

        it('同花顺 公司资料', () => CompanyInformationDownloader('300359'));

        it('同花顺 公司财务', () => CompanyFinanceDownloader('300359'));
    });

    describe('测试下载日线数据', function () {

        it.only('网易财经 A股与A股指数日线数据', () => A_Stock_Day_Line_Downloader(1, '600007', 1, '中国国贸', '1990-01-01'));

    });
});

