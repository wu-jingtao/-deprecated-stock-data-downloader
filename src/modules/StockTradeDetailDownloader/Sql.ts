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
        UNIQUE KEY `unique` (`code`,`date`),\
        KEY `code_idx` (`code`),\
        KEY `date_idx` (`date`),\
        CONSTRAINT `stock_trade_detail_code` FOREIGN KEY (`code`) REFERENCES `stock_code` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION\
    ) COMMENT='股票成交明细';\
";

/**
 * 插入或更新数据
 */
export const insert_data = "\
    INSERT INTO `stock`.`stock_trade_detail`\
    (`code`,`date`,`price`,`volume`,`money`,`direction`)\
    VALUES\
    (?,?,?,?,?,?)\
    ON DUPLICATE KEY UPDATE \
    `price` = ?,\
    `volume` = ?,\
    `money` = ?,\
    `direction` = ?\
";

/**
 * 获取某个股票的交易日期列表
 */
export const get_stock_date_list = "\
    SELECT `date`\
    FROM `stock`.`stock_day_line`\
    WHERE `code` = ?;\
";