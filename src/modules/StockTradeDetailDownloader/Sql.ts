import { TradeDetailType } from "./TradeDetailType";

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
        KEY `code_idx` (`code`),\
        KEY `date_idx` (`date`),\
        CONSTRAINT `stock_trade_detail_code` FOREIGN KEY (`code`) REFERENCES `stock_code` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION\
    ) COMMENT='股票成交明细';\
";

/**
 * 插入数据
 * @param code_id 代码id
 * @param data 要插入的数据
 */
export function insert_data(code_id: number, data: TradeDetailType[]) {
    const insert = "\
        INSERT INTO `stock`.`stock_trade_detail`\
        (`code`,`date`,`price`,`volume`,`money`,`direction`)\
        VALUES ";

    return insert + data.map(item => `(${code_id},'${item.date}','${item.price}','${item.volume}','${item.money}','${item.direction}')`).join(',');
}

/**
 * 删除旧的数据
 */
export const delete_data = "\
    DELETE FROM `stock`.`stock_trade_detail`\
    WHERE `code` = ? AND date(`date`) = ?;\
";

/**
 * 获取某个股票的交易日期列表
 */
export const get_stock_date_list = "\
    SELECT `date`\
    FROM `stock`.`stock_day_line`\
    WHERE `code` = ?;\
";