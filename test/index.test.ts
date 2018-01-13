import expect = require('expect.js');

import { SH_A_Code_sjs } from '../src/modules/StockCodeDownloader/DataSource/A_Stock/SH_A_Code_sjs';
import { SZ_A_Code_sjs } from '../src/modules/StockCodeDownloader/DataSource/A_Stock/SZ_A_Code_sjs';
import { A_Code_dfcf } from '../src/modules/StockCodeDownloader/DataSource/A_Stock/A_Code_dfcf';

import { H_Code_hgt } from '../src/modules/StockCodeDownloader/DataSource/H_Stock/H_Code_hgt';
import { H_Code_sgt } from '../src/modules/StockCodeDownloader/DataSource/H_Stock/H_Code_sgt';

import { SH_Future_Index } from '../src/modules/StockCodeDownloader/DataSource/SH_Future/SH_Future_Index';
import { ZZ_Future_Index } from '../src/modules/StockCodeDownloader/DataSource/ZZ_Future/ZZ_Future_Index';
import { DL_Future_Index } from '../src/modules/StockCodeDownloader/DataSource/DL_Future/DL_Future_Index';

import { Company_Information } from '../src/modules/StockBasicDownloader/DataSource/Company_Information';
import { Company_Finance } from '../src/modules/StockBasicDownloader/DataSource/Company_Finance';

import { A_Stock_Day_Line_neteasy } from '../src/modules/StockDayLineDownloader/DataSource/A_Stock/A_Stock_Day_Line_neteasy';
import { H_Stock_Day_Line_sina } from '../src/modules/StockDayLineDownloader/DataSource/H_Stock/H_Stock_Day_Line_sina';
import { H_Stock_Index_Day_Line_sina } from '../src/modules/StockDayLineDownloader/DataSource/H_Stock/H_Stock_Index_Day_Line_sina';
import { H_Stock_Day_Line_baidu } from '../src/modules/StockDayLineDownloader/DataSource/H_Stock/H_Stock_Day_Line_baidu';

import { Future_Day_Line_sina } from '../src/modules/StockDayLineDownloader/DataSource/Future/Future_Day_Line_sina';

import { WH_Day_Line_sina } from '../src/modules/StockDayLineDownloader/DataSource/WH/WH_Day_Line_sina';

import { A_Stock_FQ_DayLine } from '../src/modules/Stock_FQ_DayLineDownloader/DataSource/A_Stock_FQ_DayLine';

describe('测试下载数据', function () {
    this.timeout(3 * 60 * 1000);

    describe('测试下载股票代码', function () {

        it('上交所 A股列表 数据', SH_A_Code_sjs.download.bind(SH_A_Code_sjs));

        it('深交所 A股列表 数据', SZ_A_Code_sjs.download.bind(SZ_A_Code_sjs));

        it('东方财富 A股列表 数据', A_Code_dfcf.download.bind(A_Code_dfcf));  //同时包含上交所与深交所

        it('沪港通 H股列表 数据', H_Code_hgt.download.bind(H_Code_hgt));

        it('深港通 H股列表 数据', H_Code_sgt.download.bind(H_Code_sgt));

        it('上海期货交易所 主连列表 数据', SH_Future_Index.download.bind(SH_Future_Index));

        it('郑州商品交易所 主连列表 数据', ZZ_Future_Index.download.bind(ZZ_Future_Index));

        it('大连商品交易所 主连列表 数据', DL_Future_Index.download.bind(DL_Future_Index));
    });

    describe('测试下载基本面数据', function () {

        it('同花顺 公司资料', Company_Information.download.bind(Company_Information, '300359'));

        it('同花顺 公司财务', Company_Finance.download.bind(Company_Finance, '300359'));
    });

    describe('测试下载日线数据', function () {

        it('网易财经 A股与A股指数日线数据', A_Stock_Day_Line_neteasy.download.bind(A_Stock_Day_Line_neteasy, '600007', 1, '1990-01-01'));

        it('新浪财经 港股日线数据', H_Stock_Day_Line_sina.download.bind(H_Stock_Day_Line_sina, '00700', true));

        it('新浪财经 港股指数日线数据', H_Stock_Index_Day_Line_sina.download.bind(H_Stock_Index_Day_Line_sina, 'HSI'));

        it('百度股市通 港股和港股指数日线数据', H_Stock_Day_Line_baidu.download.bind(H_Stock_Day_Line_baidu, '00700'));

        it('新浪财经 国内商品期货日线数据', Future_Day_Line_sina.download.bind(Future_Day_Line_sina, 'AU'));

        it('新浪财经 外汇日线数据', WH_Day_Line_sina.download.bind(WH_Day_Line_sina, 'fx_susdcny'));
    });

    describe.only('测试下载 后复权收盘价数据', function () {

        it('新浪财经 A股后复权收盘价数据', A_Stock_FQ_DayLine.download.bind(A_Stock_FQ_DayLine, '300359', 2));
    });
});

