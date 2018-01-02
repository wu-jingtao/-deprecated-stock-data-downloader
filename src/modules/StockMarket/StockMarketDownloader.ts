import { MysqlConnection } from './../MysqlConnection/MysqlConnection';
import { BaseServiceModule } from "service-starter";
import * as _ from 'lodash';

import { StockMarket } from './StockMarket';

//创建表
const createTable = "\
    CREATE TABLE IF NOT EXISTS `stock`.`stock_market` (\
        `id` INT UNSIGNED NOT NULL COMMENT '主键',\
        `name` VARCHAR(255) NOT NULL COMMENT '市场名称',\
        `start_time` TIME NOT NULL COMMENT '开市时间。时间统一为北京时间',\
        `end_time` TIME NOT NULL COMMENT '收市时间',\
        `day_of_week` VARCHAR(45) NOT NULL COMMENT '每周哪几日交易。格式为：1,2,3,4,5,6,7',\
        PRIMARY KEY (`id`),\
        UNIQUE INDEX `name_UNIQUE` (`name` ASC))\
    COMMENT = '交易市场列表';\
";

//插入或更新数据
const insertData = "\
    INSERT INTO `stock`.`stock_market`\
    (`id`, `name`, `start_time`, `end_time`, `day_of_week`)\
    VALUES\
    (?, ?, ?, ?, ?)\
    ON duplicate key update \
    `name` = ?,`start_time` = ?,`end_time` = ?,`day_of_week` = ?;\
";

/**
 * 股票市场列表。
 * 该模块目前的主要目的就是创建`stock_market`数据表，并且将StockMarket.ts中的数据保存到数据库中
 */
export class StockMarketDownloader extends BaseServiceModule {
    async onStart(): Promise<void> {
        const con: MysqlConnection = this.services.MysqlConnection;
        await con.asyncQuery(createTable);  //创建数据表
        for (const item of _.values(StockMarket)) { //向表中插入数据
            await con.asyncQuery(insertData, [
                item.id, item.name, item.start_time, item.end_time, item.day_of_week,
                item.name, item.start_time, item.end_time, item.day_of_week
            ]);
        }
    }
}