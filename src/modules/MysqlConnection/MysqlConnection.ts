import * as mysql from 'mysql';
import { BaseServiceModule } from "service-starter";

export class MysqlConnection extends BaseServiceModule {

    connection: mysql.Connection;

    /**
     * 对mysql的query方法进行了一下包装
     */
    asyncQuery(sql: string) {
        return new Promise<any>((resolve, reject) => {
            this.connection.query(sql, function (err, result, filed) {
                err ? reject(err) : resolve(result);
            });
        });
    }

    onStart(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.connection = mysql.createConnection({
                host: process.env.MYSQL_HOST_ADDR || 'localhost',   //主机地址
                port: process.env.MYSQL_HOST_PORT || 3306,          //连接端口
                user: process.env.MYSQL_USERNAME || 'root',         //用户名
                password: process.env.MYSQL_PASSWORD || 'root'      //登陆密码
            });

            this.connection.connect(err => err ? reject(err) : resolve());

            this.connection.on("end", err => err && this.emit("error", err));
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