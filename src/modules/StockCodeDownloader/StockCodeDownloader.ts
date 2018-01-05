import * as schedule from 'node-schedule';
import { BaseServiceModule } from "service-starter";

import * as sql from './Sql';
import { MysqlConnection } from "../MysqlConnection/MysqlConnection";
import { ModuleStatusRecorder } from "../ModuleStatusRecorder/ModuleStatusRecorder";
import { StockCodeType } from './StockCodeType';

import { SH_A_Code_sjs } from './DataSource/A_Stock/SH_A_Code_sjs';
import { SZ_A_Code_sjs } from './DataSource/A_Stock/SZ_A_Code_sjs';
import { A_Index_Code_zx } from './DataSource/A_Stock/A_Index_Code_zx';

import { H_Code_hgt } from './DataSource/H_Stock/H_Code_hgt';
import { H_Code_sgt } from './DataSource/H_Stock/H_Code_sgt';
import { H_Index_Code_zx } from './DataSource/H_Stock/H_Index_Code_zx';

import { SH_Future_Index } from './DataSource/SH_Future/SH_Future_Index';
import { ZZ_Future_Index } from './DataSource/ZZ_Future/ZZ_Future_Index';


/**
 * 股票代码下载器
 */
export class StockCodeDownloader extends BaseServiceModule {

    private _timer: schedule.Job;    //保存计时器
    private _connection: MysqlConnection;
    private _statusRecorder: ModuleStatusRecorder;
    private _downloading: boolean = false;  //是否正在下载

    /**
     * 保存下载到的数据
     */
    private async _saveData(data: StockCodeType[]) {
        for (const item of data) {
            const id = await this._connection.asyncQuery(sql.get_id, [item.code, item.market, item.isIndex]);
            if (id.length > 0) {  //说明有数据，更新
                await this._connection.asyncQuery(sql.update_data, [item.name, id[0].id]);
            } else {
                await this._connection.asyncQuery(sql.insert_data, [item.code, item.name, item.market, item.isIndex]);
            }
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
                //A股
                await this._saveData(await SH_A_Code_sjs().catch(err => { throw new Error('下载上交所股票代码异常：' + err) }));
                await this._saveData(await SZ_A_Code_sjs().catch(err => { throw new Error('下载深交所股票代码异常：' + err) }));
                await this._saveData(A_Index_Code_zx());

                //港股
                await this._saveData(await H_Code_hgt().catch(err => { throw new Error('下载沪港通代码异常：' + err) }));
                await this._saveData(await H_Code_sgt().catch(err => { throw new Error('下载深港通代码异常：' + err) }));
                await this._saveData(H_Index_Code_zx());

                //上海期货交易所 主连列表
                await this._saveData(SH_Future_Index());

                //郑州商品交易所 主连列表
                await this._saveData(ZZ_Future_Index());

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
            await this._downloader();
        }

        //每周星期五的晚上10点钟更新
        this._timer = schedule.scheduleJob({ hour: 22, dayOfWeek: 5 }, () => this._downloader().catch(err => this.emit('error', err)));
    }

    async onStop() {
        this._timer && this._timer.cancel();
    }
}
