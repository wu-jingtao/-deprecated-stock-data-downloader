import { StockCodeType } from "../../StockCodeType";
import { StockMarketType } from "../../../StockMarketList/StockMarketType";

/**
 * 自选的一些A股指数
 */
export function A_Index_Code_zx(): StockCodeType[] {
    return [
        {
            code: '000001',
            name: '上证指数',
            market: StockMarketType.sh.id,
            isIndex: true
        },
        {
            code: '399001',
            name: '深证成指',
            market: StockMarketType.sz.id,
            isIndex: true
        },
        {
            code: '399005',
            name: '中小板指',
            market: StockMarketType.sz.id,
            isIndex: true
        },
        {
            code: '399006',
            name: '创业板指',
            market: StockMarketType.sz.id,
            isIndex: true
        },
        {
            code: '399300',
            name: '沪深300',
            market: StockMarketType.sz.id,
            isIndex: true
        }
    ];
}
