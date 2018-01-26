import { TradeDetailType } from "./TradeDetailType";

/**
 * 创建表
 */
export const create_table = "\
    CREATE TABLE IF NOT EXISTS `stock`.`stock_trade_detail` (\
        `code` int(10) unsigned NOT NULL COMMENT '股票代码(`stock_code`中对应的`id`)',\
        `date` date NOT NULL COMMENT '日期',\
        `trade_detail` json NOT NULL COMMENT '\
            当天的成交明细。由一个数组组成。\
            顺序：[''成交时间'',  ''成交价格'', ''成交量（万股）'', ''成交金额（万元）'', ''成交方向'' ]\
            成交时间 -> 注意，同一时间下，可能会发生多笔交易\
            成交方向 -> S：卖盘，B：买盘，M：中性盘\
        ',\
        PRIMARY KEY `pk` (`code`,`date`),\
        CONSTRAINT `stock_trade_detail_code` FOREIGN KEY (`code`) REFERENCES `stock_code` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION\
    ) COMMENT='股票成交明细';\
";

/**
 * 插入或更新数据
 */
export const insert_data = "\
    INSERT INTO `stock`.`stock_trade_detail` (`code`,`date`,`trade_detail`)\
    VALUES (?, ?, ?)\
    ON DUPLICATE KEY UPDATE \
    `trade_detail` = ?\
";

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