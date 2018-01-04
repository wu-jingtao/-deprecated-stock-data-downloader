import { BaseServiceModule } from "service-starter";
/**
 * 记录模块当前的运行状态
 */
export declare class ModuleStatusRecorder extends BaseServiceModule {
    private _connection;
    /**
     * 获取最近一次执行的状态信息。
     * 从未执行过，则返回void
     */
    getStatus(module: BaseServiceModule): Promise<{
        id: number;
        startTime: number;
        endTime: number;
        error: string | undefined;
    } | undefined>;
    /**
     * 获取最近一次执行成功时的状态信息
     * 没有则返回void
     */
    getLatestSuccessStatus(module: BaseServiceModule): Promise<{
        id: number;
        startTime: number;
        endTime: number;
        error: string | undefined;
    } | undefined>;
    /**
     * 插入新的运行开始时间。
     * 发回插入行的id
     */
    newStartTime(module: BaseServiceModule): Promise<number>;
    /**
     * 更新运行结束时间
     *
     * @param id newStartTime返回的id
     */
    updateEndTime(module: BaseServiceModule, id: number): Promise<void>;
    /**
     * 更新错误消息
     */
    updateError(module: BaseServiceModule, id: number, err: Error): Promise<void>;
    onStart(): Promise<void>;
}
