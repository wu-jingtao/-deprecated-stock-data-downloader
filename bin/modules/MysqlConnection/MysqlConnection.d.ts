import * as mysql from 'mysql';
import { BaseServiceModule } from "service-starter";
/**
 * 连接mysql并创建数据库
 */
export declare class MysqlConnection extends BaseServiceModule {
    connection: mysql.Connection;
    /**
     * 对mysql的query方法进行了一下包装，使之支持Promise
     */
    asyncQuery(sql: string, values?: any[]): Promise<any>;
    onStart(): Promise<void>;
    onStop(): Promise<void>;
    onHealthCheck(): Promise<void>;
}
