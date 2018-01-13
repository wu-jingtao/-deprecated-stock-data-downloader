/**
 * 下载到的后复权日线数据
 */
export interface FQ_DayLineType {
    /**
     * 日期
     */
    date: string;

    /**
     * 后复权收盘价
    */
    close: number;
}