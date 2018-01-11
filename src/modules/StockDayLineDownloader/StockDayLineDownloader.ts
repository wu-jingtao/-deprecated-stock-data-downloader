import * as moment from 'moment';
import * as schedule from 'node-schedule';
import { BaseServiceModule } from "service-starter";

import * as sql from './Sql';
import { MysqlConnection } from "../MysqlConnection/MysqlConnection";
import { ModuleStatusRecorder } from "../ModuleStatusRecorder/ModuleStatusRecorder";
import { StockMarketType } from '../StockMarketList/StockMarketType';
import { DayLineType } from './DayLineType';

import { H_Stock_Day_Line_Downloader_sina } from './DataSource/H_Stock/H_Stock_Day_Line_Downloader_sina';
import { H_Stock_Index_Day_Line_Downloader_sina } from './DataSource/H_Stock/H_Stock_Index_Day_Line_Downloader_sina';

/**
 * 股票日线下载器
 */
export class StockDayLineDownloader extends BaseServiceModule {

    private _timer: schedule.Job;               //下载计时器
    private _timer_reDownload: schedule.Job;    //重新下载计时器
    private _connection: MysqlConnection;
    private _statusRecorder: ModuleStatusRecorder;
    private _downloading: boolean = false;      //是否正在下载

    /**
     * 保存下载到的数据
     */
    private async _saveData(code_id: number, data: DayLineType[]) {
        for (const item of data) {
            await this._connection.asyncQuery(sql.insert_data, [
                code_id, item.date,
                item.close, item.high, item.low, item.open, item.pre_close,
                item.exchange_ratio, item.volume, item.money,
                item.gross_market_value, item.current_market_value,

                item.close, item.high, item.low, item.open, item.pre_close,
                item.exchange_ratio, item.volume, item.money,
                item.gross_market_value, item.current_market_value,
            ]);
        }
    }

    /**
     * 下载器
     * @param reDownload 是否从头开始下载
     */
    private async _downloader(reDownload: boolean) {
        if (!this._downloading) {   //如果上次还没有执行完这次就取消执行了
            this._downloading = true;
            const jobID = await this._statusRecorder.newStartTime(this);

            try {

                /* {//A股与A股指数
                    const code_list = await this._connection.asyncQuery(sql.get_stock_code, [
                        [StockMarketType.sh.id, StockMarketType.sz.id].join(','),
                        'true, false'
                    ]);

                    //下载开始日期
                    const start_date = reDownload ? '1990-01-01' : moment().subtract({ days: 7 }).format('YYYY-MM-DD');

                    for (const code of code_list) {
                        await this._saveData(code.id, await A_Stock_Day_Line_Downloader(code.code, code.market, code.name, start_date));
                        //console.log('A股', code.id, code.code, code.name, start_date);
                    }
                } */

                {//港股
                    const code_list = await this._connection.asyncQuery(sql.get_stock_code, [StockMarketType.xg.id, 'false']);

                    for (const code of code_list) {
                        await this._saveData(code.id, await H_Stock_Day_Line_Downloader_sina(code.code, code.name, reDownload));
                        console.log('港股', code.code, code.name);
                    }
                }

                {//港股指数
                    const code_list = await this._connection.asyncQuery(sql.get_stock_code, [StockMarketType.xg.id, 'true']);

                    for (const code of code_list) {
                        await this._saveData(code.id, await H_Stock_Index_Day_Line_Downloader_sina(code.code, code.name));
                        console.log('港股指数', code.code, code.name);
                    }
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
        await this._connection.asyncQuery(sql.create_table);  //创建数据表

        const status = await this._statusRecorder.getStatus(this);
        //如果没下载过或上次下载出现过异常，则立即重新下载
        if (status == null || status.error != null || status.startTime > status.endTime) {
            await this._downloader(true);
        }

        //每周1-5的下午6点15分更新
        this._timer = schedule.scheduleJob("0 15 18 * * 1-5", () => this._downloader(false).catch(err => this.emit('error', err)));

        //每周末凌晨1点更新全部数据
        this._timer_reDownload = schedule.scheduleJob("0 0 1 * * 7", () => this._downloader(true).catch(err => this.emit('error', err)));
    }

    async onStop() {
        this._timer && this._timer.cancel();
        this._timer_reDownload && this._timer_reDownload.cancel();
    }
}
