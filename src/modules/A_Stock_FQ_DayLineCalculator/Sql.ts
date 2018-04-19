/**
 * 查询某个股票的日线数据
 */
export const query_dayline = "\
    SELECT `date`, `close`, `pre_close` FROM `stock`.`stock_day_line` where code = ? order by `date` asc;\
";

