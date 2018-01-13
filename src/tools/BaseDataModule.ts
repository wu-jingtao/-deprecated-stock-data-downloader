import * as schedule from 'node-schedule';
import { BaseServiceModule } from "service-starter";

import { MysqlConnection } from "../modules/MysqlConnection/MysqlConnection";
import { ModuleStatusRecorder } from "../modules/ModuleStatusRecorder/ModuleStatusRecorder";

/**
 * 行情数据下载器模块父类
 */
export abstract class BaseDataModule extends BaseServiceModule {

    private _timers: schedule.Job[] = [];       //下载计时器
    private _downloading: boolean = false;      //是否正在下载
    private _statusRecorder: ModuleStatusRecorder;

    /**
     * @param _crontab 下载定时器
     * @param _sql_create_table 创建数据表Sql
     */
    constructor(
        private _crontab: { time: string, reDownload?: boolean }[],
        private _sql_create_table: string[]
    ) { super(); }

    /**
     * Mysql 连接
     */
    protected _connection: MysqlConnection;

    /**
     * 所有与下载行情数据相关的代码都放入其中
     * @param reDownload 是否重新下载所有数据
     */
    protected abstract _downloader(reDownload?: boolean): Promise<void>;

    /**
     * 包裹_downloader
     */
    private _downloaderWrap = async (reDownload?: boolean) => {
        if (!this._downloading) {   //如果上次还没有执行完这次就不执行了
            this._downloading = true;
            const jobID = await this._statusRecorder.newStartTime(this);

            try {
                await this._downloader(reDownload);
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
        
        for (const item of this._sql_create_table) {
            await this._connection.asyncQuery(item);  //创建数据表
        }

        //查询上次执行的状态
        const status = await this._statusRecorder.getStatus(this);

        //如果没下载过或上次下载出现过异常，则立即重新下载
        if (status == null || status.error != null || status.startTime > status.endTime) {
            await this._downloaderWrap(true);
        }

        //设置计时器
        this._timers = this._crontab.map(item => schedule.scheduleJob(item.time,
            () => this._downloaderWrap(item.reDownload).catch(err => this.emit('error', err))));
    }

    async onStop() {
        this._timers.forEach(item => item.cancel());
    }
}