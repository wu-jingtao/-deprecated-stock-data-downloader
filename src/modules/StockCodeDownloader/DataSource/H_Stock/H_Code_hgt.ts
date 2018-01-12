import * as HttpDownloader from '../../../../tools/HttpDownloader';
import { BaseDownloader } from '../../../../tools/BaseDownloader';
import { StockCodeType } from '../../StockCodeType';
import { StockMarketType } from '../../../StockMarketList/StockMarketType';

/**
 * 上交所，沪港通代码列表。
 * 注意：有些港股没有中文名称，没有中文名的用英文名来代替
 * 
 * 数据格式`HTML`。数据在一个<script>标签中
 * 下载地址：http://www.sse.com.cn/services/hkexsc/disclo/eligiblead/
 */
export class H_Code_hgt extends BaseDownloader {

    private address = 'http://www.sse.com.cn/services/hkexsc/disclo/eligiblead/';  //下载地址

    get name() {
        return '上交所，沪港通代码列表下载器';
    }

    protected _testData(data: StockCodeType) {
        return /^\d{5}$/.test(data.code) &&     //股票代码
            data.name.length > 1                //确保公司名称不为空
    }

    protected async _download() {
        const file = (await HttpDownloader.Get(this.address)).toString();

        //数据排列：序号	港股代码	英文简称	中文简称	调整内容	生效日期
        const reg_g = /\[\s+"\d+",\s+"(\d{5})",\s+"(.+?)",\s+"(.+?)",\s+"(.+?)",\s+"(\d{4}-\d{2}-\d{2})"\s+\]/g;
        const reg = /\[\s+"\d+",\s+"(\d{5})",\s+"(.+?)",\s+"(.+?)",\s+"(.+?)",\s+"(\d{4}-\d{2}-\d{2})"\s+\]/;   //如果 正则带g 则reg.exec() 重复执行时会出现间断返回null的情况

        const lines = file.match(reg_g) || [];    //由于JS不支持直接获取全部，所以只有先差分成行，再获取项

        return lines.map(item => {
            const match = reg.exec(item) as any;

            return {
                code: match[1].trim(),
                name: match[3].trim() === '-' ? match[2].trim() : match[3].trim(), //如果没有中文名就用英文名
                market: StockMarketType.xg.id,
                isIndex: false
            };
        });
    }

    protected _process(err: Error | undefined, data: any[]): Promise<any[]> {
        if (err === undefined && data.length === 0)
            return super._process(new Error('无法下载到数据'), data);
        else
            return super._process(err, data);
    }
}