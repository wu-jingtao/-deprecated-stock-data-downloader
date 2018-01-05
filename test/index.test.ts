import expect = require('expect.js');

import { SH_A_Code_sjs } from '../src/modules/StockCodeDownloader/DataSource/A_Stock/SH_A_Code_sjs';
import { SZ_A_Code_sjs } from '../src/modules/StockCodeDownloader/DataSource/A_Stock/SZ_A_Code_sjs';
import { A_Code_dfcf } from '../src/modules/StockCodeDownloader/DataSource/A_Stock/A_Code_dfcf';

describe('测试下载数据', function () {
    this.timeout(3 * 60 * 1000);

    describe('测试下载股票代码', function () {

        it('上交所 A股列表 数据', SH_A_Code_sjs);

        it('深交所 A股列表 数据', SZ_A_Code_sjs);

        it('东方财富 A股列表 数据', A_Code_dfcf);  //同时包含上交所与深交所
    });
});

