/**
 * A股公司财务信息
 */
export interface CompanyFinanceType {

    /**
     * 报告时间
     */
    date: string;

    /**
     * 基本每股收益(元)
    */
    basic_earnings_per_share?: number;

    /**
     * 净利润(万元)
    */
    net_profit?: number;

    /**
     * 营业总收入(万元)
    */
    gross_revenue?: number;

    /**
     * 每股净资产(元)
    */
    net_assets_per_share?: number;

    /**
     * 资产负债比率(0-1)
    */
    asset_liability_ratio?: number;

    /**
     * 每股资本公积金(元)
    */
    capital_accumulation_fund_per_share?: number;

    /**
     * 每股未分配利润(元)
    */
    undistributed_profit_per_share?: number;

    /**
     * 每股经营现金流(元)
    */
    operating_cash_flow_per_share?: number;
}