import * as iconv from 'iconv-lite';
import * as cheerio from 'cheerio';

import * as HttpDownloader from '../../../tools/HttpDownloader';
import { BaseDownloader } from '../../../tools/BaseDownloader';
import { CompanyInformationType } from '../CompanyInformationType';
import { normalizeAmountToYi, normalizeAmountToWan, normalizeNull } from '../Tools';

/**
 * A股上市公司 公司资料下载。数据来源于同花顺f10
 * 
 * 返回数据：`HTML`，`GBK`编码
 * 
 * 下载地址：http://basic.10jqka.com.cn/${code}/company.html
 */
export class Company_Information extends BaseDownloader {

    private address = (code: string) => `http://basic.10jqka.com.cn/${code}/company.html`;

    get name() {
        return 'A股公司资料下载器';
    }

    protected _testData(data: CompanyInformationType) {
        return true
    }

    protected async _download(code: string) {
        const file = await HttpDownloader.Get(this.address(code));
        const data = iconv.decode(file, 'gbk');     //转码
        const $ = cheerio.load(data);

        //详细情况部分
        const detail = $('.page_event_content #detail');

        //发行相关部分
        const publish = $('.page_event_content #publish');

        //参股控股公司部分
        const share = $('.page_event_content #share');

        let temp: any;
        return [{
            location: normalizeNull(detail.find(".hltip:contains('所属地域')").next('span').text().trim()),
            industry: normalizeNull((detail.find(".hltip:contains('所属行业')").next('span').text().split('—')[1] || '').trim()),
            old_name: (temp = normalizeNull(detail.find(".hltip:contains('曾 用 名')").next('span').text()))
                ? temp.split('->').map((item: string) => item.trim()) : [],
            main_business: normalizeNull(detail.find(".hltip:contains('主营业务')").next('span').text().trim()),
            product_name: Array.from(detail.find(".hltip:contains('产品名称')").next('span').find('a:not(.m_more)').map((index, element) => $(element).text().trim())),
            controling_shareholder: (temp = detail.find(".hltip:contains('控股股东')").nextAll('span').eq(0), temp.children('span').remove(), normalizeNull(temp.text().trim())),
            actual_controller: (temp = detail.find(".hltip:contains('实际控制人')").nextAll('span').eq(0), temp.children('span').remove(), normalizeNull(temp.text().trim())),
            chairman: normalizeNull(detail.find(".hltip:contains('董事长')").next('span').text().trim()),
            legal_representative: normalizeNull(detail.find(".hltip:contains('法人代表')").next('span').text().trim()),
            manager: normalizeNull(detail.find(".hltip:contains('总 经 理'), .hltip:contains('总 裁')").next('span').eq(0).text().trim()),
            registered_capital: normalizeAmountToWan(detail.find(".hltip:contains('注册资金')").next('span').text()),
            employees_number: normalizeAmountToYi(detail.find(".hltip:contains('员工人数')").next('span').text().trim()),

            establishing_date: normalizeNull(publish.find(".hltip:contains('成立日期')").next('span').text().trim()),
            listing_date: normalizeNull(publish.find(".hltip:contains('上市日期')").next('span').text().trim()),
            issuance_number: normalizeAmountToWan(publish.find(".hltip:contains('发行数量')").next('span').text()),
            issuance_price: normalizeAmountToYi(publish.find(".hltip:contains('发行价格')").next('span').text()),
            ipo_pe_ratio: normalizeAmountToYi(publish.find(".hltip:contains('发行市盈率')").next('span').text()),
            expect_raise: normalizeAmountToWan(publish.find(".hltip:contains('预计募资')").next('span').text()),
            actual_raise: normalizeAmountToWan(publish.find(".hltip:contains('实际募资')").next('span').text()),
            first_day_open_price: normalizeAmountToYi(publish.find(".hltip:contains('首日开盘价')").next('span').text()),
            main_underwriter: normalizeNull(publish.find(".hltip:contains('主承销商')").next('span').text().trim()),
            sponsors: normalizeNull(publish.find(".hltip:contains('上市保荐人')").next('span').text().trim()),

            //使用Array.from包装一下是因为，无法JSON.stringify
            subsidiary: Array.from(share.find('#ckg_table > tbody > tr').map((index, element) => {
                const cells = $(element).find('td');

                return {
                    name: normalizeNull(cells.eq(1).children('p').text().trim()),
                    relationship: normalizeNull(cells.eq(2).text().trim()),
                    share_ratio: (temp = normalizeAmountToYi(cells.eq(3).text())) ? temp / 100 : undefined,
                    investment_amount: normalizeAmountToWan(cells.eq(4).text()),
                };
            }))
        }];
    }
}