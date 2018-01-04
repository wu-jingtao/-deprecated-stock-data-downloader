import { MysqlConnection } from './../MysqlConnection/MysqlConnection';
import { BaseServiceModule } from "service-starter";
import * as _ from 'lodash';

import { StockMarketType } from './StockMarketType';
import * as sql from './Sql';

/**
 * 股票市场列表。
 * 该模块目前的主要目的就是创建`stock_market`数据表，并且将StockMarket.ts中的数据保存到数据库中
 */
export class StockMarketTypeList extends BaseServiceModule {

    async onStart(): Promise<void> {
        const con: MysqlConnection = this.services.MysqlConnection;

        await con.asyncQuery(sql.create_table);  //创建数据表
        
        for (const item of _.values(StockMarketType)) { //向表中插入数据
            await con.asyncQuery(sql.insert_data, [
                item.id, item.name, item.start_time, item.end_time, item.day_of_week,
                item.name, item.start_time, item.end_time, item.day_of_week
            ]);
        }
    }
}