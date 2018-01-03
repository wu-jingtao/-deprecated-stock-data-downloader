import * as _ from 'lodash';
import expect = require('expect.js');

import { StockMarket } from './../src/modules/StockMarketDownloader/StockMarket';

import { SH_A_Code_sjs } from '../src/modules/StockCodeDownloader/downloader/SH_A_Code_sjs';
import { SZ_A_Code_sjs } from '../src/modules/StockCodeDownloader/downloader/SZ_A_Code_sjs';

describe('测试下载数据', function () {
    this.timeout(3 * 60 * 1000);

    describe('测试下载股票代码', function () {

        it('上交所 A股列表 数据', async function () {
            const result = await SH_A_Code_sjs();

            result.forEach(item => {
                expect(/^6\d{5}$/.test(item.code)).to.be.ok();  //股票代码
                expect(item.name.length).to.greaterThan(0);     //确保公司名称不为空
                expect(item.market).to.be(StockMarket.sh.id);
                expect(item.isIndex).to.be(false);
            });
        });

        it.only('深交所 A股列表 数据', async function () {
            const result = await SZ_A_Code_sjs();

            result.forEach(item => {
                expect(/^[03]\d{5}$/.test(item.code)).to.be.ok();   //股票代码
                expect(item.name.length).to.greaterThan(0);         //确保公司名称不为空
                expect(item.market).to.be(StockMarket.sz.id);
                expect(item.isIndex).to.be(false);
            });
        });
    });
});

