import { MysqlConnection } from './../MysqlConnection/MysqlConnection';
import { BaseServiceModule } from "service-starter";

import * as sql from './Sql';

/**
 * 为了方便使用，创建一些数据库视图
 */
export class CreateSqlView extends BaseServiceModule {

    async onStart(): Promise<void> {
        const con: MysqlConnection = this.services.MysqlConnection;

        await con.asyncQuery(sql.view_day_line);
        await con.asyncQuery(sql.view_fq_day_line);
        await con.asyncQuery(sql.view_a_stock_fq_day_line);
        await con.asyncQuery(sql.procedure_fq_week_line);
        await con.asyncQuery(sql.procedure_fq_month_line);
        await con.asyncQuery(sql.procedure_fq_quarter_line);
        await con.asyncQuery(sql.procedure_fq_year_line);
    }
}