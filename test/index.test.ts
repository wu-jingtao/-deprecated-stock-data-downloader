import expect = require('expect.js');

import { SH_A_Code_sjs } from '../src/modules/StockCodeDownloader/DataSource/A_Stock/SH_A_Code_sjs';
import { SZ_A_Code_sjs } from '../src/modules/StockCodeDownloader/DataSource/A_Stock/SZ_A_Code_sjs';
import { A_Code_dfcf } from '../src/modules/StockCodeDownloader/DataSource/A_Stock/A_Code_dfcf';

import { H_Code_hgt } from '../src/modules/StockCodeDownloader/DataSource/H_Stock/H_Code_hgt';
import { H_Code_sgt } from '../src/modules/StockCodeDownloader/DataSource/H_Stock/H_Code_sgt';

import { SH_Future_Index } from '../src/modules/StockCodeDownloader/DataSource/SH_Future/SH_Future_Index';

describe('测试下载数据', function () {
    this.timeout(3 * 60 * 1000);

    describe('测试下载股票代码', function () {

        it('上交所 A股列表 数据', SH_A_Code_sjs);

        it('深交所 A股列表 数据', SZ_A_Code_sjs);

        it('东方财富 A股列表 数据', A_Code_dfcf);  //同时包含上交所与深交所

        it('沪港通 H股列表 数据', H_Code_hgt);

        it('深港通 H股列表 数据', H_Code_sgt);

        it.only('上海期货交易所 主连列表 数据', SH_Future_Index);
    });
});

