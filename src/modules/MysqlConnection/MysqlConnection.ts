import * as mysql from 'mysql';
import { BaseServiceModule, RunningStatus } from "service-starter";

/**
 * 连接mysql并创建数据库
 */
export class MysqlConnection extends BaseServiceModule {

    connection: mysql.Connection;

    /**
     * 对mysql的query方法进行了一下包装，使之支持Promise
     */
    asyncQuery(sql: string, values?: any[]) {
        return new Promise<any>((resolve, reject) => {
            this.connection.query(sql, values, function (err, result, filed) {
                err ? reject(err) : resolve(result);
            });
        });
    }

    onStart(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.connection = mysql.createConnection({
                multipleStatements: true,                           //允许多语句查询
                host: process.env.MYSQL_HOST_ADDR || 'localhost',   //主机地址
                port: process.env.MYSQL_HOST_PORT || 3306,          //连接端口
                user: process.env.MYSQL_USERNAME || 'root',         //用户名
                password: process.env.MYSQL_PASSWORD || 'root'      //登陆密码
            });

            this.connection.connect(err => {
                if (err) {
                    reject(err);
                } else {    //创建系统所需的数据库
                    this.connection.query("CREATE SCHEMA IF NOT EXISTS `stock` DEFAULT CHARACTER SET utf8;", err => err ? reject(err) : resolve());
                }
            });

            this.connection.on("end", (err) => {
                if (err) this.emit('error', err);

                if (this.servicesManager.status !== RunningStatus.stopping && this.servicesManager.status !== RunningStatus.stopped)
                    this.servicesManager.stop();
            });

            this.connection.on("error", err => this.emit("error", err));
        });
    }

    onStop() {
        return new Promise<void>((resolve, reject) => {
            this.connection.end(err => err ? reject(err) : resolve());
        });
    }

    async onHealthCheck() {
        try {
            await this.asyncQuery("SELECT 'OK';");
        } catch (error) {
            throw new Error('数据库连接状态异常：' + error);
        }
    }
}