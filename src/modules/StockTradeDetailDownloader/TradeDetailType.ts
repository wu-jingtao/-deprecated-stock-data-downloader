/**
 * 成交明细类型
 */
export interface TradeDetailType {

    /**
     * 成交时间 日期 + 时间
     */
    date: string;

    /**
     * 成交价格
     */
    price: number;

    /**
     * 成交量（万股）
     */
    volume: number;

    /**
     * 成交金额（万元）
     */
    money: number;

    /**
     * 成交方向。 S：卖盘，B：买盘，M：中性盘
     */
    direction: 'S' | 'B' | 'M';
}