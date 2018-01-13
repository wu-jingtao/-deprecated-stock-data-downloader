/**
 * 创建保存复权日线数据的表
 */
export const create_table = "\
    CREATE TABLE IF NOT EXISTS `stock`.`stock_fq_day_line` (\
        `code` int(10) unsigned NOT NULL COMMENT '股票代码`stock_code`中对应的`id`',\
        `date` date NOT NULL COMMENT '日期',\
        `close` float unsigned NOT NULL COMMENT '后复权收盘价',\
        UNIQUE KEY `unique_code_date` (`code`,`date`),\
        KEY `code_idx` (`code`),\
        KEY `date_idx` (`date`),\
        CONSTRAINT `code_fq_day_line_code` FOREIGN KEY (`code`) REFERENCES `stock_code` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION\
    ) COMMENT='后复权股票日线数据';\
";

/**
 * 插入或更新复权日线数据
 */
export const insert_data = "\
    INSERT INTO `stock`.`stock_fq_day_line`\
    (`code`,`date`,`close`)\
    VALUES (?,?,?)\
    ON DUPLICATE KEY UPDATE \
    `close` = ?\
";