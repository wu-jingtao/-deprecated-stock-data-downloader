import { BaseServiceModule } from "service-starter";
import * as schedule from 'node-schedule';

import * as sql from './Sql';
import { MysqlConnection } from "../MysqlConnection/MysqlConnection";
import { ModuleStatusRecorder } from "../ModuleStatusRecorder/ModuleStatusRecorder";

import { SH_A_Code_sjs } from "./downloader/SH_A_Code_sjs";
import { SZ_A_Code_sjs } from "./downloader/SZ_A_Code_sjs";

/**
 * 股票代码下载器
 */
export class StockCodeDownloader extends BaseServiceModule {

    private _timer: schedule.Job;    //保存计时器
    private _connection: MysqlConnection;
    private _statusRecorder: ModuleStatusRecorder;

    private async _downloader() {  //下载器
        const jobID = await this._statusRecorder.newStartTime(this);

        try {
            await SH_A_Code_sjs().catch(err => { throw new Error('下载上交所股票代码异常：' + err) });
            await SZ_A_Code_sjs().catch(err => { throw new Error('下载深交所股票代码异常：' + err) });

            this._statusRecorder.updateEndTime(jobID);
        } catch (error) {
            this._statusRecorder.updateError(jobID, error);
            throw error;
        }
    };

    async onStart(): Promise<void> {
        this._connection = this.services.MysqlConnection;
        this._statusRecorder = this.services.ModuleStatusRecorder;
        await this._connection.asyncQuery(sql.create_table);  //创建数据表

        const status = await this._statusRecorder.getStatus(this);
        if (status == null || status.error != null || status.startTime > status.endTime) {
            //如果没下载过或上次下载出现过异常，则立即重新下载
            await this._downloader();
        }

        //每周星期天的3点钟更新
        this._timer = schedule.scheduleJob({ hour: 3, dayOfWeek: 7 }, () => this._downloader().catch(err => this.emit('error', err)));
    }

    async onStop() {
        this._timer.cancel();
    }
}
