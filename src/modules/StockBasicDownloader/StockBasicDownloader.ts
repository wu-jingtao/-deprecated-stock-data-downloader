import { BaseDataModule } from '../../tools/BaseDataModule';

import * as sql from './Sql';
import { StockCodeDownloader } from '../StockCodeDownloader/StockCodeDownloader';
import { StockMarketType } from '../StockMarketList/StockMarketType';

import { CompanyFinanceType } from './CompanyFinanceType';
import { CompanyInformationType } from './CompanyInformationType';

import { Company_Finance } from './DataSource/Company_Finance';
import { Company_Information } from './DataSource/Company_Information';

/**
 * 股票基本面下载器
 */
export class StockBasicDownloader extends BaseDataModule {

    private _stockCodeDownloader: StockCodeDownloader;

    constructor() {
        //每周星期五的晚上7点钟更新
        super([{ time: "0 0 19 * * 5" }], [sql.create_company_information_table, sql.create_company_finance_table]);
    }

    async onStart(): Promise<void> {
        this._stockCodeDownloader = this.services.StockCodeDownloader;
        await super.onStart();
    }

    /**
     * 保存公司资料数据
     * @param code_id 数据库中的股票代码
     */
    private _saveInformationData(code_id: number, code: string, data: CompanyInformationType) {
        return this._connection.asyncQuery(sql.insert_company_information, [
            code_id, data.location, data.industry, JSON.stringify(data.old_name), data.main_business,
            JSON.stringify(data.product_name), data.controling_shareholder, data.actual_controller,
            data.chairman, data.legal_representative, data.manager, data.registered_capital,
            data.employees_number, data.establishing_date, data.listing_date, data.issuance_number,
            data.issuance_price, data.ipo_pe_ratio, data.expect_raise, data.actual_raise,
            data.first_day_open_price, data.main_underwriter, data.sponsors, JSON.stringify(data.subsidiary),

            data.location, data.industry, JSON.stringify(data.old_name), data.main_business,
            JSON.stringify(data.product_name), data.controling_shareholder, data.actual_controller,
            data.chairman, data.legal_representative, data.manager, data.registered_capital,
            data.employees_number, data.establishing_date, data.listing_date, data.issuance_number,
            data.issuance_price, data.ipo_pe_ratio, data.expect_raise, data.actual_raise,
            data.first_day_open_price, data.main_underwriter, data.sponsors, JSON.stringify(data.subsidiary)
        ]);
    }

    /**
     * 保存公司财务数据
     */
    private async _saveFinanceData(code_id: number, code: string, data: CompanyFinanceType[]) {
        for (const item of data) {
            await this._connection.asyncQuery(sql.insert_company_finance_data, [
                code_id, item.date,
                item.basic_earnings_per_share,
                item.net_profit,
                item.gross_revenue,
                item.net_assets_per_share,
                item.asset_liability_ratio,
                item.capital_accumulation_fund_per_share,
                item.undistributed_profit_per_share,
                item.operating_cash_flow_per_share,

                item.basic_earnings_per_share,
                item.net_profit,
                item.gross_revenue,
                item.net_assets_per_share,
                item.asset_liability_ratio,
                item.capital_accumulation_fund_per_share,
                item.undistributed_profit_per_share,
                item.operating_cash_flow_per_share
            ]);
        }
    }

    protected async _downloader() {
        const code_list = await this._stockCodeDownloader.getStockCodes([StockMarketType.sh.id, StockMarketType.sz.id], [false]); //查询出所有A股代码

        for (const { id, code, market } of code_list) {   //循环下载
            try {
                await this._saveInformationData(id, code, (await Company_Information.download(code))[0]);
                await this._saveFinanceData(id, code, await Company_Finance.download(code));
                //console.log('下载完成：' + code);    //调试使用
            } catch (error) {
                throw new Error(`下载${code}失败：` + error);
            }
        }
    };
}