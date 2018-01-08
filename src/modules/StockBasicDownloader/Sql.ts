/**
 * 创建公司资料表
 */
export const create_company_information_table = "\
    CREATE TABLE IF NOT EXISTS `stock`.`stock_company_information` (\
        `code` INT UNSIGNED NOT NULL COMMENT '股票代码(`stock_code`中对应的`id`)',\
        `location` VARCHAR(255) NULL COMMENT '所属地域',\
        `industry` VARCHAR(255) NULL COMMENT '所属行业',\
        `old_name` JSON NULL COMMENT '曾用名(历史名称)：string[]',\
        `main_business` TEXT NULL COMMENT '主营业务',\
        `product_name` JSON NULL COMMENT '产品名称：string[]',\
        `controling_shareholder` VARCHAR(255) NULL COMMENT '控股股东',\
        `actual_controller` VARCHAR(255) NULL COMMENT '实际控制人',\
        `chairman` VARCHAR(255) NULL COMMENT '董事长',\
        `legal_representative` VARCHAR(255) NULL COMMENT '法人代表',\
        `manager` VARCHAR(255) NULL COMMENT '总经理',\
        `registered_capital` DOUBLE NULL COMMENT '注册资金(万元)',\
        `employees_number` INT NULL COMMENT '员工人数',\
        `establishing_date` DATE NULL COMMENT '成立日期',\
        `listing_date` DATE NULL COMMENT '上市日期',\
        `issuance_number` DOUBLE NULL COMMENT '发行数量(万股)',\
        `issuance_price` FLOAT NULL COMMENT '发行价格',\
        `ipo_pe_ratio` FLOAT NULL COMMENT '发行市盈率(倍)',\
        `expect_raise` DOUBLE NULL COMMENT '预计募资(万元)',\
        `actual_raise` DOUBLE NULL COMMENT '实际募资(万元)',\
        `first_day_open_price` FLOAT NULL COMMENT '首日开盘价',\
        `main_underwriter` VARCHAR(255) NULL COMMENT '主承销商',\
        `sponsors` VARCHAR(255) NULL COMMENT '上市保荐人',\
        `subsidiary` JSON NULL COMMENT '参股控股公司 {公司名称:string, 参控关系:string, 参控比例:float(0-1), 投资金额:number(万元)}',\
        PRIMARY KEY (`code`),\
        CONSTRAINT `code`\
        FOREIGN KEY (`code`)\
        REFERENCES `stock`.`stock_code` (`id`)\
        ON DELETE NO ACTION\
        ON UPDATE NO ACTION\
    ) COMMENT = 'A股上市公司的公司资料。注意：其中有些数据可能随着时间会发生变化。';\
";

/**
 * 向公司资料表中插入或更新数据
 */
export const insert_company_information = "\
    INSERT INTO `stock`.`stock_company_information`\
    (`code`,`location`,`industry`,`old_name`,`main_business`,\
    `product_name`,`controling_shareholder`,`actual_controller`,\
    `chairman`,`legal_representative`,`manager`,`registered_capital`,\
    `employees_number`,`establishing_date`,`listing_date`,`issuance_number`,\
    `issuance_price`,`ipo_pe_ratio`,`expect_raise`,`actual_raise`,\
    `first_day_open_price`,`main_underwriter`,`sponsors`,`subsidiary`)\
    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)\
    ON DUPLICATE KEY UPDATE \
    `location` = ?,\
    `industry` = ?,\
    `old_name` = ?,\
    `main_business` = ?,\
    `product_name` = ?,\
    `controling_shareholder` = ?,\
    `actual_controller` = ?,\
    `chairman` = ?,\
    `legal_representative` = ?,\
    `manager` = ?,\
    `registered_capital` = ?,\
    `employees_number` = ?,\
    `establishing_date` = ?,\
    `listing_date` = ?,\
    `issuance_number` = ?,\
    `issuance_price` = ?,\
    `ipo_pe_ratio` = ?,\
    `expect_raise` = ?,\
    `actual_raise` = ?,\
    `first_day_open_price` = ?,\
    `main_underwriter` = ?,\
    `sponsors` = ?,\
    `subsidiary` = ?\
";

/**
 * 创建公司财务表
 */
export const create_company_finance_table = "\
    CREATE TABLE IF NOT EXISTS `stock`.`stock_company_finance` (\
        `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',\
        `code` INT UNSIGNED NOT NULL COMMENT '股票代码(`stock_code`中对应的`id`)',\
        `date` DATE NOT NULL COMMENT '报告时间',\
        `basic_earnings_per_share` FLOAT NULL COMMENT '基本每股收益(元)',\
        `net_profit` DOUBLE NULL COMMENT '净利润(万元)',\
        `gross_revenue` DOUBLE NULL COMMENT '营业总收入(万元)',\
        `net_assets_per_share` FLOAT NULL COMMENT '每股净资产(元)',\
        `asset_liability_ratio` FLOAT NULL COMMENT '资产负债比率(0-1)',\
        `capital_accumulation_fund_per_share` FLOAT NULL COMMENT '每股资本公积金(元)',\
        `undistributed_profit_per_share` FLOAT NULL COMMENT '每股未分配利润(元)',\
        `operating_cash_flow_per_share` FLOAT NULL COMMENT '每股经营现金流(元)',\
        PRIMARY KEY (`id`),\
        KEY `code_idx` (`code`),\
        CONSTRAINT `code_fk` FOREIGN KEY (`code`) REFERENCES `stock_code` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION\
    ) COMMENT='A股上市公司财务数据';\
";

/**
 * 插入新的财务数据
 */
export const insert_company_finance_data = "\
    INSERT INTO `stock`.`stock_company_finance`\
    (`code`,`date`,`basic_earnings_per_share`,\
    `net_profit`,`gross_revenue`,`net_assets_per_share`,\
    `asset_liability_ratio`,\
    `capital_accumulation_fund_per_share`,\
    `undistributed_profit_per_share`,\
    `operating_cash_flow_per_share`)\
    VALUES\
    (?,?,?,?,?,?,?,?,?,?);\
";

/**
 * 更新财务数据
 */
export const update_company_finance_data = "\
    UPDATE `stock`.`stock_company_finance`\
    SET\
    `basic_earnings_per_share` = ?,\
    `net_profit` = ?,\
    `gross_revenue` = ?,\
    `net_assets_per_share` = ?,\
    `asset_liability_ratio` = ?,\
    `capital_accumulation_fund_per_share` = ?,\
    `undistributed_profit_per_share` = ?,\
    `operating_cash_flow_per_share` = ?\
    WHERE `code` = ? AND `date` = ?\
";