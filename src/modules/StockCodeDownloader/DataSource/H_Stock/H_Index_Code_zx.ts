import { StockCodeType } from "../../StockCodeType";
import { StockMarketType } from "../../../StockMarketList/StockMarketType";

/**
 * 自选的一些港股指数
 */
export function H_Index_Code_zx(): StockCodeType[] {
    return [
        {
            code: 'HSI',
            name: '恒生指数',
            market: StockMarketType.xg.id,
            isIndex: true
        }
    ];
}
