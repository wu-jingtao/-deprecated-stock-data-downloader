/**
 * 创建未复权日线视图
 */
export const view_day_line = "\
    CREATE OR REPLACE VIEW `stock`.`day_line` AS\
        SELECT\
            `stock_code`.`id` AS `id`,\
            `stock_code`.`code` AS `code`,\
            `stock_code`.`name` AS `name`,\
            `stock_code`.`market` AS `market`,\
            `stock_code`.`is_index` AS `is_index`,\
            `stock_day_line`.`date` AS `date`,\
            `stock_day_line`.`close` AS `close`,\
            `stock_day_line`.`high` AS `high`,\
            `stock_day_line`.`low` AS `low`,\
            `stock_day_line`.`open` AS `open`,\
            `stock_day_line`.`exchange_ratio` AS `exchange_ratio`,\
            `stock_day_line`.`volume` AS `volume`,\
            `stock_day_line`.`money` AS `money`,\
            `stock_day_line`.`gross_market_value` AS `gross_market_value`,\
            `stock_day_line`.`current_market_value` AS `current_market_value`\
        FROM `stock`.`stock_day_line`\
        INNER JOIN `stock`.`stock_code` ON `stock_code`.`id` = `stock_day_line`.`code`\
";

/**
 * 创建后复权日线视图
 * 注意：复权时复权了价格，没有复权成交量
 */
export const view_fq_day_line = "\
    CREATE OR REPLACE VIEW `stock`.`fq_day_line` AS\
        SELECT\
            `stock_code`.`id` AS `id`,\
            `stock_code`.`code` AS `code`,\
            `stock_code`.`name` AS `name`,\
            `stock_code`.`market` AS `market`,\
            `stock_code`.`is_index` AS `is_index`,\
            `stock_day_line`.`date` AS `date`,\
            `stock_fq_day_line`.`close` AS `close`,\
            ROUND(`stock_day_line`.`high` * `stock_fq_day_line`.`close` / `stock_day_line`.`close`, 2) AS `high`,\
            ROUND(`stock_day_line`.`low` * `stock_fq_day_line`.`close` / `stock_day_line`.`close`, 2) AS `low`,\
            ROUND(`stock_day_line`.`open` * `stock_fq_day_line`.`close` / `stock_day_line`.`close`, 2) AS `open`,\
            `stock_day_line`.`exchange_ratio` AS `exchange_ratio`,\
            `stock_day_line`.`volume` AS `volume`,\
            `stock_day_line`.`money` AS `money`,\
            `stock_day_line`.`gross_market_value` AS `gross_market_value`,\
            `stock_day_line`.`current_market_value` AS `current_market_value`\
        FROM `stock`.`stock_code`\
        INNER JOIN `stock`.`stock_fq_day_line` ON `stock_code`.`id` = `stock_fq_day_line`.`code`\
        INNER JOIN `stock`.`stock_day_line` ON `stock_code`.`id` = `stock_day_line`.`code` AND `stock_fq_day_line`.`date` = `stock_day_line`.`date`\
";