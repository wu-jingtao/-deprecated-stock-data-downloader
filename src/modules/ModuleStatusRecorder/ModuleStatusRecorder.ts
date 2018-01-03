import * as _ from 'lodash';
import { BaseServiceModule } from "service-starter";

import { MysqlConnection } from "../MysqlConnection/MysqlConnection";

//创建表
const create = "\
    CREATE TABLE IF NOT EXISTS `stock`.`_system_status` (\
        `module_name` varchar(255) NOT NULL COMMENT '系统模块的名称',\
        `start_time` int unsigned NOT NULL DEFAULT '0' COMMENT '该模块最近一次执行任务的开始时间戳',\
        `end_time` int unsigned NOT NULL DEFAULT '0' COMMENT '该模块最近一次执行任务的结束时间戳',\
        `error` varchar(2000) COMMENT '记录模块执行任务的过程发生的错误',\
        PRIMARY KEY (`module_name`)\
    ) COMMENT='\
        保存系统模块的状态。\
        如果 `start_time > end_time` 表示正在运行。\
        如果 `end_time > start_time` 表示执行结束。\
        如果 `start_time` 为0则表示从未下载过。\
        如果 `error` 不为空则表示执行任务的过程发生了错误。\
        提示：如果要让某个模块重新下载，最简单的方式就是删除模块名对应的那行数据。\
    ';\
";

//查询表
const query = "\
    SELECT `start_time`, `end_time`, `error`\
    FROM `stock`.`_system_status`\
    WHERE `module_name` = ?;\
";

//更新运行开始时间
const update_start_time = "\
    INSERT INTO `stock`.`_system_status` (`module_name`, `start_time`)\
    VALUES (?, ?)\
    ON duplicate key update `start_time` = ?,`error` = ;\
";

//更新运行结束时间
const update_end_time = "\
    UPDATE `stock`.`_system_status`\
    SET `end_time` = ?\
    WHERE `module_name` = ?;\
";

//更新运行异常信息
const update_error = "\
    UPDATE `stock`.`_system_status`\
    SET `error` = ?, `end_time` = ?\
    WHERE `module_name` = ?;\
";

/**
 * 记录模块当前的运行状态
 */
export class ModuleStatusRecorder extends BaseServiceModule {

    private _connection: MysqlConnection;

    /**
     * 获取上次执行的开始时间、结束时间、错误信息
     * 从未执行过，则startTime为0
     */
    async getStatus(module: BaseServiceModule): Promise<{ startTime: Date, endTime: Date, error?: string }> {
        const data = await this._connection.asyncQuery(query, [module.name]);

        if (data.length > 0) {
            return {
                startTime: new Date(data[0].start_time),
                endTime: new Date(data[0].end_time),
                error: data[0].error
            };
        } else {
            return {
                startTime: new Date(0),
                endTime: new Date(0)
            };
        }
    }

    /**
     * 更新运行开始时间
     */
    async updateStartTime(module: BaseServiceModule) {
        const start_time = Date.now();
        await this._connection.asyncQuery(update_start_time, [module.name, start_time, start_time]);
    }

    /**
     * 更新运行结束时间
     */
    async updateEndTime(module: BaseServiceModule) {
        await this._connection.asyncQuery(update_end_time, [Date.now(), module.name]);
    }

    /**
     * 更新错误消息
     */
    async updateError(module: BaseServiceModule, err: string) {
        await this._connection.asyncQuery(update_error, [err, Date.now(), module.name]);
    }

    async onStart(): Promise<void> {
        this._connection = this.services.MysqlConnection;
        await this._connection.asyncQuery(create);
    }
}