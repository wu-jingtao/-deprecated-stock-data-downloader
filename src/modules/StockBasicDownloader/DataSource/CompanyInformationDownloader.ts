import * as iconv from 'iconv-lite';
import * as cheerio from 'cheerio';

import * as HttpDownloader from '../../../tools/HttpDownloader';
import { Retry3 } from '../../../tools/Retry';
import { CompanyInformationType } from '../CompanyInformationType';

/**
 * A股上市公司 公司资料下载。数据来源于同花顺f10
 * 
 * 下载地址：http://basic.10jqka.com.cn/${code}/company.html
 */

//下载地址
const address = (code: string) => `http://basic.10jqka.com.cn/${code}/company.html`;

//由于网页上表示空的方式各不相同，通过该方法来统一数据格式
function normalizeNull(data?: string): string | undefined {
    switch (data) {
        case undefined:
        case null:
        case '':
        case '-':
        case '—':
        case '--':
            return undefined;

        default:
            return data;
    }
}

//统一单位到万
function normalizeAmountToWan(data?: string): number | undefined {
    if (data = normalizeNull(data)) {
        let temp: any = data.match(/[0-9\.]+/);
        if (temp) {
            if (data.includes('亿')) {
                return temp[0] * 10000;
            } else if (data.includes('万')) {
                return temp[0] * 1;
            } else {
                return temp[0] / 10000;
            }
        }
    }
}

//统一单位到一
function normalizeAmountToYi(data?: string): number | undefined {
    if (data = normalizeNull(data)) {
        let temp: any = data.match(/[0-9\.]+/);
        if (temp) {
            if (data.includes('亿')) {
                return temp[0] * 10000 * 10000;
            } else if (data.includes('万')) {
                return temp[0] * 10000;
            } else {
                return temp[0] * 1;
            }
        }
    }
}

//下载数据
export async function download(code: string): Promise<CompanyInformationType[]> {
    try {
        const file = await HttpDownloader.Get(address(code));
        const data = iconv.decode(file, 'gbk');     //转码
        const $ = cheerio.load(data);

        //详细情况部分
        const detail = $('.page_event_content #detail');

        //发行相关部分
        const publish = $('.page_event_content #publish');

        //参股控股公司部分
        const share = $('.page_event_content #share');

        let temp: any;
        return {
            location: normalizeNull(detail.find(".hltip:contains('所属地域')").next('span').text().trim()),
            industry: normalizeNull((detail.find(".hltip:contains('所属行业')").next('span').text().split('—')[1] || '').trim()),
            old_name: (temp = normalizeNull(detail.find(".hltip:contains('曾 用 名')").next('span').text()))
                ? temp.split('->').map((item: string) => item.trim()) : [],
            main_business: normalizeNull(detail.find(".hltip:contains('主营业务')").next('span').text().trim()),
            product_name: detail.find(".hltip:contains('产品名称')").next('span').find('a').map((index, element) => $(element).text().trim()),
            controling_shareholder: (temp = detail.find(".hltip:contains('控股股东')").next('span'), temp.children('span').remove(), normalizeNull(temp.text().trim())),
            actual_controller: (temp = detail.find(".hltip:contains('实际控制人')").next('span'), temp.children('span').remove(), normalizeNull(temp.text().trim())),
            chairman: normalizeNull(detail.find(".hltip:contains('董事长')").next('span').text().trim()),
            legal_representative: normalizeNull(detail.find(".hltip:contains('法人代表')").next('span').text().trim()),
            manager: normalizeNull(detail.find(".hltip:contains('总 经 理')").next('span').text().trim()),
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

            subsidiary: share.find('#ckg_table > tbody > tr').map((index, element) => {
                const cells = $(element).find('td');

                return {
                    name: normalizeNull(cells.eq(1).children('p').text().trim()),
                    relationship: normalizeNull(cells.eq(2).text().trim()),
                    share_ratio: (temp = normalizeAmountToYi(cells.eq(3).text())) ? temp / 100 : undefined,
                    investment_amount: normalizeAmountToWan(cells.eq(4).text()),
                };
            })
        } as any;
    } catch (error) {
        throw new Error(`下载"${code}"公司资料失败："` + error);
    }
}

/**
 * 上海A股代码下载器
 * @param code 要下载的股票代码
 */
export const CompanyInformationDownloader = Retry3(download);
