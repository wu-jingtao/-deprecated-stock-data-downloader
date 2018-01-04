import { BaseServiceModule } from "service-starter";
const crontab = require('node-crontab');

import { MysqlConnection } from "../MysqlConnection/MysqlConnection";
import { ModuleStatusRecorder } from "../ModuleStatusRecorder/ModuleStatusRecorder";
import { SH_A_Code_sjs } from "./downloader/SH_A_Code_sjs";
import { SZ_A_Code_sjs } from "./downloader/SZ_A_Code_sjs";

const createTable = "\
    CREATE TABLE IF NOT EXISTS `stock`.`stock_code` (\
        `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',\
        `code` varchar(45) NOT NULL COMMENT '股票代码',\
        `name` varchar(255) NOT NULL COMMENT '股票名称',\
        `market` int(11) unsigned NOT NULL COMMENT '所属市场',\
        `is_index` tinyint(4) NOT NULL COMMENT '是不是指数, true：1 , false:0',\
        PRIMARY KEY (`id`),\
        KEY `code` (`code`),\
        KEY `market` (`market`),\
        KEY `is_index` (`is_index`),\
        CONSTRAINT `market` FOREIGN KEY (`market`) REFERENCES `stock_market` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION\
    ) COMMENT='股票代码列表';\
";

/**
 * 股票代码下载器
 */
export class StockCodeDownloader extends BaseServiceModule {

    private _timer: any;    //保存计时器
    private _connection: MysqlConnection;
    private _statusRecorder: ModuleStatusRecorder;

    private readonly _downloader = async (onStart?: boolean) => {  //下载器
        try {
            const status = await this._statusRecorder.getStatus(this);
            if (status.startTime === 0 || status.error != null) {   //如果没有下载过，或之前下载出现过异常，则立刻重新下载
    
            }

            await SH_A_Code_sjs().catch(err => { throw new Error('下载上交所股票代码异常：' + err) });
            await SZ_A_Code_sjs().catch(err => { throw new Error('下载深交所股票代码异常：' + err) });
        } catch (error) {
            if (onStart) {  //是不是模块启动阶段
                throw error;
            } else {
                this.emit('error', error);
            }
        }
    };

    async onStart(): Promise<void> {
        this._connection = this.services.MysqlConnection;
        this._statusRecorder = this.services.ModuleStatusRecorder;

        await this._connection.asyncQuery(createTable);  //创建数据表
        await this._downloader(true);

        //每周星期天的3点钟更新
        this._timer = crontab.scheduleJob("0 3 * * 7", this._downloader);
    }

    async onStop() {
        crontab.cancelJob(this._timer);
    }
}
