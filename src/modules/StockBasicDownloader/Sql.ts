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
        `registered_capital` BIGINT NULL COMMENT '注册资金(万元)',\
        `employees_number` INT NULL COMMENT '员工人数',\
        `establishing_date` DATE NULL COMMENT '成立日期',\
        `listing_date` DATE NULL COMMENT '上市日期',\
        `issuance_number` BIGINT NULL COMMENT '发行数量(万股)',\
        `issuance_price` FLOAT NULL COMMENT '发行价格',\
        `ipo_pe_ratio` FLOAT NULL COMMENT '发行市盈率(倍)',\
        `expect_raise` BIGINT NULL COMMENT '预计募资(万元)',\
        `actual_raise` BIGINT NULL COMMENT '实际募资(万元)',\
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
    ) COMMENT = '股票的公司资料。注意：其中有些数据可能随着时间会发生变化。';\
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
