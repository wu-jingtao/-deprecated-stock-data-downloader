import * as mysql from 'mysql';
import { BaseServiceModule } from "service-starter";
export declare class MysqlConnection extends BaseServiceModule {
    connection: mysql.Connection;
    /**
     * 对mysql的query方法进行了一下包装
     */
    asyncQuery(sql: string): Promise<any>;
    onStart(): Promise<void>;
    onStop(): Promise<void>;
    onHealthCheck(): Promise<void>;
}
