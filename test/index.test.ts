import expect = require('expect.js');

import { BaseDataModule } from '../src/tools/BaseDataModule';

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

import { A_Stock_FQ_DayLine_netease } from './../src/modules/Stock_FQ_DayLineDownloader/DataSource/A_Stock_FQ_DayLine_netease';
import { A_Stock_FQ_DayLine_sina } from '../src/modules/Stock_FQ_DayLineDownloader/DataSource/A_Stock_FQ_DayLine_sina';
import { H_Stock_FQ_DayLine_tencent } from '../src/modules/Stock_FQ_DayLineDownloader/DataSource/H_Stock_FQ_DayLine_tencent';

import { A_Stock_TradeDetail_tencent } from '../src/modules/StockTradeDetailDownloader/DataSource/A_Stock_TradeDetail_tencent';

describe('测试下载数据', function () {
    this.timeout(3 * 60 * 1000);

    const baseDataModule = { name: 'test' } as BaseDataModule

    describe('测试下载股票代码', function () {

        it('上交所 A股列表 数据', async () => {
            expect(await SH_A_Code_sjs.download(baseDataModule)).not.empty();
        });

        it('深交所 A股列表 数据', async () => {
            expect(await SZ_A_Code_sjs.download(baseDataModule)).not.empty();
        });

        it('东方财富 A股列表 数据', async () => {    //同时包含上交所与深交所
            expect(await A_Code_dfcf.download(baseDataModule)).not.empty();
        });

        it('沪港通 H股列表 数据', async () => {
            expect(await H_Code_hgt.download(baseDataModule)).not.empty();
        });

        it('深港通 H股列表 数据', async () => {
            expect(await H_Code_sgt.download(baseDataModule)).not.empty();
        });

        it('上海期货交易所 主连列表 数据', async () => {
            expect(await SH_Future_Index.download(baseDataModule)).not.empty();
        });

        it('郑州商品交易所 主连列表 数据', async () => {
            expect(await ZZ_Future_Index.download(baseDataModule)).not.empty();
        });

        it('大连商品交易所 主连列表 数据', async () => {
            expect(await DL_Future_Index.download(baseDataModule)).not.empty();
        });
    });

    describe('测试下载基本面数据', function () {

        it('同花顺 公司资料', async () => {
            expect(await Company_Information.download(baseDataModule, '300359')).not.empty();
        });

        it('同花顺 公司财务', async () => {
            expect(await Company_Finance.download(baseDataModule, '300359')).not.empty();
        });
    });

    describe('测试下载日线数据', function () {

        it('网易财经 A股与A股指数日线数据', async () => {
            expect(await A_Stock_Day_Line_neteasy.download(baseDataModule, '600000', '浦发银行', 1, '1990-01-01')).not.empty();
        });

        it('新浪财经 港股日线数据', async () => {
            expect(await H_Stock_Day_Line_sina.download(baseDataModule, '00700', '腾讯控股', true)).not.empty();
        });

        it('新浪财经 港股指数日线数据', async () => {
            expect(await H_Stock_Index_Day_Line_sina.download(baseDataModule, 'HSI', '恒生指数', false)).not.empty();
        });

        it('百度股市通 港股和港股指数日线数据', async () => {
            expect(await H_Stock_Day_Line_baidu.download(baseDataModule, '00700', '腾讯控股')).not.empty();
        });

        it('新浪财经 国内商品期货日线数据', async () => {
            expect(await Future_Day_Line_sina.download(baseDataModule, 'AU', '沪金主连', false)).not.empty();
        });

        it('新浪财经 外汇日线数据', async () => {
            expect(await WH_Day_Line_sina.download(baseDataModule, 'fx_susdcny', '美元人民币', false)).not.empty();
        });
    });

    describe('测试下载 后复权收盘价数据', function () {

        it('新浪财经 A股后复权收盘价数据', async () => {
            expect(await A_Stock_FQ_DayLine_sina.download(baseDataModule, '300359', '全通教育', 2, false)).not.empty();
            expect(await A_Stock_FQ_DayLine_sina.download(baseDataModule, '300359', '全通教育', 2, true)).not.empty();
        });

        it('网易财经 A股后复权收盘价数据', async () => {
            expect(await A_Stock_FQ_DayLine_netease.download(baseDataModule, '300359', '全通教育', 2, false)).not.empty();
        });

        it('腾讯财经 港股后复权收盘价数据', async () => {
            expect(await H_Stock_FQ_DayLine_tencent.download(baseDataModule, '00700', '腾讯控股', false)).not.empty();
        });
    });

    describe('测试下载 成交明细数据', function () {

        //注意，由于腾讯好像只提供最近一个月的数据，所以之后测试的时候可能需要修改日期
        it('腾讯财经 A股成交明细数据', async () => {
            expect(await A_Stock_TradeDetail_tencent.download(baseDataModule, '300359', '全通教育', 2, '2018-01-12')).not.empty();
        });
    });
});

