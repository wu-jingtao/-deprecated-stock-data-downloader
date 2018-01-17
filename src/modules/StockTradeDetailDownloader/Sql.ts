import { TradeDetailType } from "./TradeDetailType";

/**
 * 创建表
 */
export const create_table = "\
    CREATE TABLE IF NOT EXISTS `stock`.`stock_trade_detail` (\
        `code` int(10) unsigned NOT NULL COMMENT '股票代码(`stock_code`中对应的`id`)',\
        `date` datetime NOT NULL COMMENT '日期时间',\
        `price` float unsigned NOT NULL COMMENT '成交价格',\
        `volume` double unsigned NOT NULL COMMENT '成交量（万股）',\
        `money` double unsigned NOT NULL COMMENT '成交金额（万元）',\
        `direction` char(1) NOT NULL COMMENT '成交方向。 S：卖盘，B：买盘，M：中性盘',\
        KEY `code_idx` (`code`),\
        KEY `date_idx` (`date`),\
        CONSTRAINT `stock_trade_detail_code` FOREIGN KEY (`code`) REFERENCES `stock_code` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION\
    ) COMMENT='股票成交明细';\
";

/**
 * 插入数据
 * @param code_id 代码id
 * @param date 日期
 * @param data 要插入的数据
 */
export function insert_data(code_id: number, date: string, data: TradeDetailType[]) {
    if (data.length > 0) {
        const data_string = data.map(item => `('${code_id}','${item.date}','${item.price}','${item.volume}','${item.money}','${item.direction}')`).join(',');

        //由于成交明细数据中的日期会出现重复(同一秒下发生多笔交易)，所以没办法像其他数据那样更新。
        //所以只有先删除当天的旧数据再导入当天的新数据
        return "\
            START TRANSACTION;\
                DELETE FROM `stock`.`stock_trade_detail`\
                WHERE `code` = '"+ code_id + "' AND date(`date`) = '" + date + "';\
                \
                INSERT INTO `stock`.`stock_trade_detail`\
                (`code`,`date`,`price`,`volume`,`money`,`direction`)\
                VALUES "+ data_string + ";\
            COMMIT;\
        ";
    } else {
        return 'SELECT 1';
    }
}

/**
 * 获取某个股票的交易所有日期
 */
export const get_stock_date_list = "\
    SELECT `date`\
    FROM `stock`.`stock_day_line`\
    WHERE `code` = ?;\
";

/**
 * 获取某个股票最近一周的交易日
 */
export const get_stock_latest_week_date = "\
    SELECT `date`\
    FROM `stock`.`stock_day_line`\
    WHERE `code` = ?\
    ORDER BY `date` DESC\
    LIMIT 7;\
";