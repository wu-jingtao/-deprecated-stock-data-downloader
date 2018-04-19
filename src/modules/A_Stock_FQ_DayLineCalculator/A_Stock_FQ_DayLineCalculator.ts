import log from 'log-formatter';

import { MysqlConnection } from "../MysqlConnection/MysqlConnection";
import { StockCodeDownloader } from "../StockCodeDownloader/StockCodeDownloader";
import { StockMarketType } from "../StockMarketList/StockMarketType";
import { query_dayline } from './Sql';
import { insert_data, create_table } from '../Stock_FQ_DayLineDownloader/Sql';

/**
 * 计算后复权数据
 */
function FQ_Calculator(data: { date: Date, close: number, pre_close: number }[]) {
    const result = [];

    let pre_fq_close = data[0].close;
    result.push([data[0].date, pre_fq_close]);

    for (let index = 1; index < data.length; index++) {
        const element = data[index];
        pre_fq_close *= element.close / element.pre_close;
        result.push([element.date, pre_fq_close]);
    }

    return result;
}

/**
 * 根据下载到的A股日线数据，计算出后复权数据
 * @param dbCon 
 */
export async function A_Stock_FQ_DayLineCalculator(dbCon: MysqlConnection, stockCode: StockCodeDownloader) {
    try {
        log.location.text.blue.round('A_Stock_FQ_DayLineCalculator', '计算A股后复权数据 开始');

        await dbCon.asyncQuery(create_table);   //确保后复权数据表被创建

        const code_list = await stockCode.getStockCodes([StockMarketType.sh.id, StockMarketType.sz.id], [false]);

        for (const { id } of code_list) {
            const data = FQ_Calculator(await dbCon.asyncQuery(query_dayline, [id]));
            for (const item of data) {  //保存数据
                await dbCon.asyncQuery(insert_data, [
                    id, item[0], item[1],
                    item[1]
                ]);
            }
        }

        log.location.text.green.round('A_Stock_FQ_DayLineCalculator', '计算A股后复权数据 完成');
    } catch (error) {
        log.location.text.red.round.content.red('A_Stock_FQ_DayLineCalculator', '计算A股后复权数据 异常', error);
        throw error;
    }
}