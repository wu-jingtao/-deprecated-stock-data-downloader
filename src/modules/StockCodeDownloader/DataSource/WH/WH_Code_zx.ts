import { StockCodeType } from "../../StockCodeType";
import { StockMarketType } from "../../../StockMarketList/StockMarketType";

/**
 * 自选的一些外汇
 */
export function WH_Code_zx(): StockCodeType[] {
    return [
        {
            code: 'DINIW',  //这个代码是新浪财经的
            name: '美元指数',
            market: StockMarketType.wh.id,
            isIndex: true
        },
        {
            code: 'fx_susdcny',  
            name: '美元人民币',
            market: StockMarketType.wh.id,
            isIndex: false
        }
    ];
}
