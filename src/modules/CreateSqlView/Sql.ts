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

/**
 * 创建后复权周线存储过程
 * 由于做成视图在查询时会对系统造成很大压力，所以做成了存储过程，使用时传入股票的code_id
 * 例如：call stock.new_procedure(1);
 */
export const procedure_fq_week_line = "\
    DROP PROCEDURE IF EXISTS `stock`.`fq_week_line`;\
    CREATE PROCEDURE `stock`.`fq_week_line`(code_id INT)\
    BEGIN\
        SELECT\
            `stock_code`.`id` AS `id`,\
            `stock_code`.`code` AS `code`,\
            `stock_code`.`name` AS `name`,\
            `stock_code`.`market` AS `market`,\
            `stock_code`.`is_index` AS `is_index`,\
            SUBSTRING_INDEX(GROUP_CONCAT(`stock_day_line`.`date` ORDER BY `stock_day_line`.`date` DESC), ',', 1 ) AS `date`,\
            SUBSTRING_INDEX(GROUP_CONCAT(CAST(`stock_fq_day_line`.`close` AS CHAR) ORDER BY  `stock_day_line`.`date` DESC), ',', 1 ) AS `close`,\
            MAX(ROUND(`stock_day_line`.`high` * `stock_fq_day_line`.`close` / `stock_day_line`.`close`, 2)) AS `high`,\
            MIN(ROUND(`stock_day_line`.`low` * `stock_fq_day_line`.`close` / `stock_day_line`.`close`, 2)) AS `low`,\
            SUBSTRING_INDEX(GROUP_CONCAT(CAST(ROUND(`stock_day_line`.`open` * `stock_fq_day_line`.`close` / `stock_day_line`.`close`, 2) AS CHAR) ORDER BY `stock_day_line`.`date`), ',', 1 ) as `open`,\
            SUM(`stock_day_line`.`exchange_ratio`) AS `exchange_ratio`,\
            SUM(`stock_day_line`.`volume`) AS `volume`,\
            SUM(`stock_day_line`.`money`) AS `money`,\
            `stock_day_line`.`gross_market_value` AS `gross_market_value`,\
            `stock_day_line`.`current_market_value` AS `current_market_value`\
        FROM `stock`.`stock_code`\
        INNER JOIN `stock`.`stock_fq_day_line` ON `stock_code`.`id` = `stock_fq_day_line`.`code`\
        INNER JOIN `stock`.`stock_day_line` ON `stock_code`.`id` = `stock_day_line`.`code` AND `stock_fq_day_line`.`date` = `stock_day_line`.`date`\
        WHERE `stock_code`.`id` = code_id\
        GROUP BY `stock_code`.`id`, YEAR(`stock_day_line`.`date`), WEEKOFYEAR(`stock_day_line`.`date`);\
    END\
";

/**
 * 创建后复权月线存储过程
 */
export const procedure_fq_month_line = "\
    DROP PROCEDURE IF EXISTS `stock`.`fq_month_line`;\
    CREATE PROCEDURE `stock`.`fq_month_line`(code_id INT)\
    BEGIN\
        SELECT\
            `stock_code`.`id` AS `id`,\
            `stock_code`.`code` AS `code`,\
            `stock_code`.`name` AS `name`,\
            `stock_code`.`market` AS `market`,\
            `stock_code`.`is_index` AS `is_index`,\
            SUBSTRING_INDEX(GROUP_CONCAT(`stock_day_line`.`date` ORDER BY `stock_day_line`.`date` DESC), ',', 1 ) AS `date`,\
            SUBSTRING_INDEX(GROUP_CONCAT(CAST(`stock_fq_day_line`.`close` AS CHAR) ORDER BY  `stock_day_line`.`date` DESC), ',', 1 ) AS `close`,\
            MAX(ROUND(`stock_day_line`.`high` * `stock_fq_day_line`.`close` / `stock_day_line`.`close`, 2)) AS `high`,\
            MIN(ROUND(`stock_day_line`.`low` * `stock_fq_day_line`.`close` / `stock_day_line`.`close`, 2)) AS `low`,\
            SUBSTRING_INDEX(GROUP_CONCAT(CAST(ROUND(`stock_day_line`.`open` * `stock_fq_day_line`.`close` / `stock_day_line`.`close`, 2) AS CHAR) ORDER BY `stock_day_line`.`date`), ',', 1 ) as `open`,\
            SUM(`stock_day_line`.`exchange_ratio`) AS `exchange_ratio`,\
            SUM(`stock_day_line`.`volume`) AS `volume`,\
            SUM(`stock_day_line`.`money`) AS `money`,\
            `stock_day_line`.`gross_market_value` AS `gross_market_value`,\
            `stock_day_line`.`current_market_value` AS `current_market_value`\
        FROM `stock`.`stock_code`\
        INNER JOIN `stock`.`stock_fq_day_line` ON `stock_code`.`id` = `stock_fq_day_line`.`code`\
        INNER JOIN `stock`.`stock_day_line` ON `stock_code`.`id` = `stock_day_line`.`code` AND `stock_fq_day_line`.`date` = `stock_day_line`.`date`\
        WHERE `stock_code`.`id` = code_id\
        GROUP BY `stock_code`.`id`, YEAR(`stock_day_line`.`date`), MONTH(`stock_day_line`.`date`);\
    END\
";

/**
 * 创建后复权季线存储过程
 */
export const procedure_fq_quarter_line = "\
    DROP PROCEDURE IF EXISTS `stock`.`fq_quarter_line`;\
    CREATE PROCEDURE `stock`.`fq_quarter_line`(code_id INT)\
    BEGIN\
        SELECT\
            `stock_code`.`id` AS `id`,\
            `stock_code`.`code` AS `code`,\
            `stock_code`.`name` AS `name`,\
            `stock_code`.`market` AS `market`,\
            `stock_code`.`is_index` AS `is_index`,\
            SUBSTRING_INDEX(GROUP_CONCAT(`stock_day_line`.`date` ORDER BY `stock_day_line`.`date` DESC), ',', 1 ) AS `date`,\
            SUBSTRING_INDEX(GROUP_CONCAT(CAST(`stock_fq_day_line`.`close` AS CHAR) ORDER BY  `stock_day_line`.`date` DESC), ',', 1 ) AS `close`,\
            MAX(ROUND(`stock_day_line`.`high` * `stock_fq_day_line`.`close` / `stock_day_line`.`close`, 2)) AS `high`,\
            MIN(ROUND(`stock_day_line`.`low` * `stock_fq_day_line`.`close` / `stock_day_line`.`close`, 2)) AS `low`,\
            SUBSTRING_INDEX(GROUP_CONCAT(CAST(ROUND(`stock_day_line`.`open` * `stock_fq_day_line`.`close` / `stock_day_line`.`close`, 2) AS CHAR) ORDER BY `stock_day_line`.`date`), ',', 1 ) as `open`,\
            SUM(`stock_day_line`.`exchange_ratio`) AS `exchange_ratio`,\
            SUM(`stock_day_line`.`volume`) AS `volume`,\
            SUM(`stock_day_line`.`money`) AS `money`,\
            `stock_day_line`.`gross_market_value` AS `gross_market_value`,\
            `stock_day_line`.`current_market_value` AS `current_market_value`\
        FROM `stock`.`stock_code`\
        INNER JOIN `stock`.`stock_fq_day_line` ON `stock_code`.`id` = `stock_fq_day_line`.`code`\
        INNER JOIN `stock`.`stock_day_line` ON `stock_code`.`id` = `stock_day_line`.`code` AND `stock_fq_day_line`.`date` = `stock_day_line`.`date`\
        WHERE `stock_code`.`id` = code_id\
        GROUP BY `stock_code`.`id`, YEAR(`stock_day_line`.`date`), QUARTER(`stock_day_line`.`date`);\
    END\
";

/**
 * 创建后复权年线存储过程
 */
export const procedure_fq_year_line = "\
    DROP PROCEDURE IF EXISTS `stock`.`fq_year_line`;\
    CREATE PROCEDURE `stock`.`fq_year_line`(code_id INT)\
    BEGIN\
        SELECT\
            `stock_code`.`id` AS `id`,\
            `stock_code`.`code` AS `code`,\
            `stock_code`.`name` AS `name`,\
            `stock_code`.`market` AS `market`,\
            `stock_code`.`is_index` AS `is_index`,\
            SUBSTRING_INDEX(GROUP_CONCAT(`stock_day_line`.`date` ORDER BY `stock_day_line`.`date` DESC), ',', 1 ) AS `date`,\
            SUBSTRING_INDEX(GROUP_CONCAT(CAST(`stock_fq_day_line`.`close` AS CHAR) ORDER BY  `stock_day_line`.`date` DESC), ',', 1 ) AS `close`,\
            MAX(ROUND(`stock_day_line`.`high` * `stock_fq_day_line`.`close` / `stock_day_line`.`close`, 2)) AS `high`,\
            MIN(ROUND(`stock_day_line`.`low` * `stock_fq_day_line`.`close` / `stock_day_line`.`close`, 2)) AS `low`,\
            SUBSTRING_INDEX(GROUP_CONCAT(CAST(ROUND(`stock_day_line`.`open` * `stock_fq_day_line`.`close` / `stock_day_line`.`close`, 2) AS CHAR) ORDER BY `stock_day_line`.`date`), ',', 1 ) as `open`,\
            SUM(`stock_day_line`.`exchange_ratio`) AS `exchange_ratio`,\
            SUM(`stock_day_line`.`volume`) AS `volume`,\
            SUM(`stock_day_line`.`money`) AS `money`,\
            `stock_day_line`.`gross_market_value` AS `gross_market_value`,\
            `stock_day_line`.`current_market_value` AS `current_market_value`\
        FROM `stock`.`stock_code`\
        INNER JOIN `stock`.`stock_fq_day_line` ON `stock_code`.`id` = `stock_fq_day_line`.`code`\
        INNER JOIN `stock`.`stock_day_line` ON `stock_code`.`id` = `stock_day_line`.`code` AND `stock_fq_day_line`.`date` = `stock_day_line`.`date`\
        WHERE `stock_code`.`id` = code_id\
        GROUP BY `stock_code`.`id`, YEAR(`stock_day_line`.`date`);\
    END\
";