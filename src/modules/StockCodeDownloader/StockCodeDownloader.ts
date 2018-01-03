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

    private readonly _timer: any[] = [];    //保存计时器

    private _connection: MysqlConnection;
    private _statusRecorder: ModuleStatusRecorder;

    private readonly _downloader = async () => {  //下载器
        await SH_A_Code_sjs();
        await SZ_A_Code_sjs();
    };

    async onStart(): Promise<void> {
        this._connection = this.services.MysqlConnection;
        await this._connection.asyncQuery(createTable);  //创建数据表


    }
}
