import * as _ from 'lodash';
import { BaseServiceModule } from "service-starter";

import { MysqlConnection } from "../MysqlConnection/MysqlConnection";
import * as sql from './Sql';

/**
 * 记录模块当前的运行状态
 */
export class ModuleStatusRecorder extends BaseServiceModule {

    private _connection: MysqlConnection;

    /**
     * 获取最近一次执行的状态信息。
     * 从未执行过，则返回void
     */
    async getStatus(module: BaseServiceModule) {
        const data = await this._connection.asyncQuery(sql.query_last, [module.name]);

        if (data.length > 0) {
            return {
                id: data[0].id,
                startTime: data[0].start_time,
                endTime: data[0].end_time,
                error: data[0].error
            };
        }
    }

    /**
     * 获取最近一次执行成功时的状态信息
     * 没有则返回void
     */
    async getLatestSuccessStatus(module: BaseServiceModule) {
        const data = await this._connection.asyncQuery(sql.query_latest_success, [module.name]);

        if (data.length > 0) {
            return {
                id: data[0].id,
                startTime: data[0].start_time,
                endTime: data[0].end_time,
                error: data[0].error
            };
        }
    }

    /**
     * 插入新的运行开始时间。
     * 发回插入行的id
     */
    async newStartTime(module: BaseServiceModule): Promise<number> {
        const result = await this._connection.asyncQuery(sql.insert_start_time, [module.name, Date.now()]);
        return result.insertId;
    }

    /**
     * 更新运行结束时间
     * 
     * @param id newStartTime返回的id
     */
    async updateEndTime(id: number) {
        await this._connection.asyncQuery(sql.update_end_time, [Date.now(), id]);
    }

    /**
     * 更新错误消息
     */
    async updateError(id: number, err: string) {
        await this._connection.asyncQuery(sql.update_error, [Date.now(), err, id]);
    }

    async onStart(): Promise<void> {
        this._connection = this.services.MysqlConnection;
        await this._connection.asyncQuery(sql.create);
    }
}