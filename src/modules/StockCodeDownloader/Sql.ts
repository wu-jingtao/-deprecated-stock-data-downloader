/**
 * 创建表
 */
export const create_table = "\
    CREATE TABLE IF NOT EXISTS `stock`.`stock_code` (\
        `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',\
        `code` varchar(45) NOT NULL COMMENT '股票代码',\
        `name` varchar(255) NOT NULL COMMENT '股票名称',\
        `market` int(11) unsigned NOT NULL COMMENT '所属市场',\
        `is_index` tinyint(4) NOT NULL COMMENT '是不是指数, true：1 , false:0',\
        PRIMARY KEY (`id`),\
        KEY `code` (`code`),\
        KEY `market` (`market`),\
        CONSTRAINT `market` FOREIGN KEY (`market`) REFERENCES `stock_market` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION\
    ) COMMENT='股票代码列表';\
";

/**
 * 查询ID
 */
export const get_id = "\
    SELECT `id` FROM `stock`.`stock_code`\
    WHERE `code` = ? AND `market` = ? AND `is_index` = ?;\
";

/**
 * 保存数据
 */
export const insert_data = "\
    INSERT INTO `stock`.`stock_code` (`code`, `name`, `market`, `is_index`)\
    VALUES (?, ?, ?, ?);\
";

/**
 * 更新股票名称
 */
export const update_data = "\
    UPDATE `stock`.`stock_code`\
    SET `name` = ?\
    WHERE `id` = ?;\
";