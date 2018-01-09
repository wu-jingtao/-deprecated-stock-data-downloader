import * as schedule from 'node-schedule';
import { BaseServiceModule } from "service-starter";

import * as sql from './Sql';
import { MysqlConnection } from "../MysqlConnection/MysqlConnection";
import { ModuleStatusRecorder } from "../ModuleStatusRecorder/ModuleStatusRecorder";
import { StockMarketType } from '../StockMarketList/StockMarketType';

import { CompanyFinanceType } from './CompanyFinanceType';
import { CompanyInformationType } from './CompanyInformationType';

import { CompanyFinanceDownloader } from './DataSource/CompanyFinanceDownloader';
import { CompanyInformationDownloader } from './DataSource/CompanyInformationDownloader';

/**
 * 股票基本面下载器
 */
export class StockBasicDownloader extends BaseServiceModule {

    private _timer: schedule.Job;    //保存计时器
    private _connection: MysqlConnection;
    private _statusRecorder: ModuleStatusRecorder;
    private _downloading: boolean = false;  //是否正在下载

    /**
     * 保存公司资料数据
     * @param code_id 数据库中的股票代码
     */
    private async _saveInformationData(code_id: number, code: string, data: CompanyInformationType) {
        await this._connection.asyncQuery(sql.insert_company_information, [
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
        ]).catch(err => { throw new Error(`保存"${code}"公司资料失败：` + err) });
    }

    //保存公司财务数据
    private async _saveFinanceData(code_id: number, code: string, data: CompanyFinanceType[]) {
        try {
            for (const item of data) {
                const id = await this._connection.asyncQuery(sql.get_company_finance_id, [code_id, item.date]);
                if (id.length > 0) {  //说明有数据，更新
                    await this._connection.asyncQuery(sql.update_company_finance_data, [
                        item.basic_earnings_per_share,
                        item.net_profit,
                        item.gross_revenue,
                        item.net_assets_per_share,
                        item.asset_liability_ratio,
                        item.capital_accumulation_fund_per_share,
                        item.undistributed_profit_per_share,
                        item.operating_cash_flow_per_share,
                        id[0].id
                    ]);
                } else {
                    await this._connection.asyncQuery(sql.insert_company_finance_data, [
                        code_id, item.date,
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
        } catch (error) {
            throw new Error(`保存"${code}"财务数据失败：` + error);
        }
    }

    /**
     * 下载器
     */
    private async _downloader() {
        if (!this._downloading) {   //如果上次还没有执行完这次就取消执行了
            this._downloading = true;
            const jobID = await this._statusRecorder.newStartTime(this);

            try {
                const code_list = await this._connection.asyncQuery(sql.get_code_list); //查询出所有A股代码

                for (const { id, code, market } of code_list) {   //循环下载
                    await this._saveInformationData(id, code, await CompanyInformationDownloader(code));
                    await this._saveFinanceData(id, code, await CompanyFinanceDownloader(code));
                    //console.log('下载完成：' + code);    //调试使用
                }

                await this._statusRecorder.updateEndTime(this, jobID);
            } catch (error) {
                await this._statusRecorder.updateError(this, jobID, error);
                throw error;
            } finally {
                this._downloading = false;
            }
        }
    };

    async onStart(): Promise<void> {
        this._connection = this.services.MysqlConnection;
        this._statusRecorder = this.services.ModuleStatusRecorder;
        await this._connection.asyncQuery(sql.create_company_information_table);    //创建公司资料数据表
        await this._connection.asyncQuery(sql.create_company_finance_table);        //创建公司财务数据表

        const status = await this._statusRecorder.getStatus(this);
        //如果没下载过或上次下载出现过异常，则立即重新下载
        if (status == null || status.error != null || status.startTime > status.endTime) {
            await this._downloader();
        }

        //每周星期五的晚上7点钟更新
        this._timer = schedule.scheduleJob("0 0 19 * * 5", () => this._downloader().catch(err => this.emit('error', err)));
    }

    async onStop() {
        this._timer && this._timer.cancel();
    }
}
