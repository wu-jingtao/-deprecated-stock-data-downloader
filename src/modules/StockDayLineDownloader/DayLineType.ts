/**
 * 下载到的日线数据
 */
export interface DayLineType {

    /**
     * `stock_code`中对应的`id`
     */
    code_id: number;

    /**
     * 股票代码
     */
    code: string;

    /**
     * 下载到的日线
     */
    day_line: {
        /**
         * 日期
         */
        date: string;

        /**
         * 收盘价
        */
        close: number;

        /**
         * 最高价
        */
        high: number;

        /**
         * 最低价
        */
        low: number;

        /**
         * 开盘价
        */
        open: number;

        /**
         * 昨日收盘价
        */
        pre_close?: number;

        /**
         * 换手率(%)
        */
        exchange_ratio?: number;

        /**
         * 成交量(万股)
        */
        volume: number;

        /**
         * 成交金额(万元)
        */
        money?: number;

        /**
         * 总市值(万元)
        */
        gross_market_value?: number;

        /**
         * 流通市值(万元)
        */
        current_market_value?: number;
    }[];
}