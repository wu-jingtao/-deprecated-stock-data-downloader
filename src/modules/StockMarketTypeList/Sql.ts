/**
 * 创建表
 */
export const create_table = "\
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

/**
 * 插入或更新数据
 */
export const insert_data = "\
    INSERT INTO `stock`.`stock_market`\
    (`id`, `name`, `start_time`, `end_time`, `day_of_week`)\
    VALUES\
    (?, ?, ?, ?, ?)\
    ON duplicate key update \
    `name` = ?,`start_time` = ?,`end_time` = ?,`day_of_week` = ?;\
";