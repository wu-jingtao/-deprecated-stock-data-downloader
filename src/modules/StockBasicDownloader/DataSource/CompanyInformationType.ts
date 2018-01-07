/**
 * A股公司信息
 */
export interface CompanyInformationType {

    /**
     * 所属地域
     */
    location?: string;

    /**
     * 所属行业
     */
    industry?: string;

    /**
     * 曾用名(历史名称)
     */
    old_name: string[];

    /**
     * 主营业务
     */
    main_business?: string;

    /**
     * 产品名称
     */
    product_name: string[];

    /**
     * 控股股东
     */
    controling_shareholder?: string;

    /**
     * 实际控制人
     */
    actual_controller?: string;

    /**
     * 董事长
     */
    chairman?: string;

    /**
     * 法人代表
     */
    legal_representative?: string;

    /**
     * 总经理
     */
    manager?: string;

    /**
     * 注册资金(万元)
     */
    registered_capital?: number;

    /**
     * 员工人数
     */
    employees_number?: number;

    /**
     * 成立日期
     */
    establishing_date?: string;

    /**
     * 上市日期
     */
    listing_date?: string;

    /**
     * 发行数量(万股)
     */
    issuance_number?: number;

    /**
     * 发行价格
     */
    issuance_price?: number;

    /**
     * 发行市盈率(倍)
     */
    ipo_pe_ratio?: number;

    /**
     * 预计募资(万元)
     */
    expect_raise?: number;

    /**
     * 实际募资(万元)
     */
    actual_raise?: number;

    /**
     * 首日开盘价
     */
    first_day_open_price?: number;

    /**
     * 主承销商
     */
    main_underwriter?: string;

    /**
     * 上市保荐人
     */
    sponsors?: string;

    /**
     * 参股控股公司
     */
    subsidiary: {
        /**
         * 公司名称
         */
        name?: string,
        /**
         * 参控关系
         */
        relationship?: string,
        /**
         * 参控比例:(0-1)
         */
        share_ratio?: number,
        /**
         * 投资金额(万元)
         */
        investment_amount?: number
    }[];
}