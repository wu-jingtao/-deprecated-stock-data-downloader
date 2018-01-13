/**
 * 创建表
 */
export const create_table = "\
    CREATE TABLE IF NOT EXISTS `stock`.`stock_day_line` (\
        `code` int(10) unsigned NOT NULL COMMENT '股票代码`stock_code`中对应的`id`',\
        `date` date NOT NULL COMMENT '日期',\
        `close` float unsigned NOT NULL COMMENT '收盘价',\
        `high` float unsigned NOT NULL COMMENT '最高价',\
        `low` float unsigned NOT NULL COMMENT '最低价',\
        `open` float unsigned NOT NULL COMMENT '开盘价',\
        `pre_close` float unsigned DEFAULT NULL COMMENT '昨日收盘价',\
        `exchange_ratio` float unsigned DEFAULT NULL COMMENT '换手率(%)',\
        `volume` double unsigned NOT NULL COMMENT '成交量(万股)',\
        `money` double unsigned DEFAULT NULL COMMENT '成交金额(万元)',\
        `gross_market_value` double unsigned DEFAULT NULL COMMENT '总市值(万元)',\
        `current_market_value` double unsigned DEFAULT NULL COMMENT '流通市值(万元)',\
        KEY `code_idx` (`code`),\
        KEY `date_idx` (`date`),\
        UNIQUE KEY `unique_code_date` (`code`,`date`),\
        CONSTRAINT `code_day_line_code` FOREIGN KEY (`code`) REFERENCES `stock_code` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION\
    ) COMMENT='股票日线数据';\
";

/**
 * 插入或更新数据
 */
export const insert_data = "\
    INSERT INTO `stock`.`stock_day_line`\
    (`code`,`date`,`close`,`high`,`low`,`open`,`pre_close`,\
    `exchange_ratio`,`volume`,`money`,\
    `gross_market_value`,`current_market_value`)\
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?)\
    ON DUPLICATE KEY UPDATE \
    `close` = ?,\
    `high` = ?,\
    `low` = ?,\
    `open` = ?,\
    `pre_close` = ?,\
    `exchange_ratio` = ?,\
    `volume` = ?,\
    `money` = ?,\
    `gross_market_value` = ?,\
    `current_market_value` = ?\
";

