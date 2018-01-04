/**
 * 创建表
 */
export const create = "\
    CREATE TABLE IF NOT EXISTS `stock`.`_system_status` (\
        `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',\
        `module_name` varchar(255) NOT NULL COMMENT '系统模块的名称',\
        `start_time` BIGINT unsigned NOT NULL DEFAULT '0' COMMENT '模块执行任务的开始时间戳',\
        `end_time` BIGINT unsigned NOT NULL DEFAULT '0' COMMENT '模块执行任务的结束时间戳',\
        `error` TEXT DEFAULT NULL COMMENT '记录模块执行任务的过程发生的错误',\
        PRIMARY KEY (`id`),\
        KEY `module_name` (`module_name`)\
    ) COMMENT='\
        保存系统模块的运行状态。\
        如果 `start_time` > `end_time` 表示正在运行。\
        如果 `end_time` > `start_time` 表示执行结束。如果系统发生过崩溃，则可能为0\
        如果 `error` 不为空则表示执行任务的过程发生了错误。\
        提示：如果要让某个模块重新下载，最简单的方式就是删除该模块的所有状态记录。\
    ';\
";

/**
 * 查询最近一条记录
 */
export const query_last = "\
    SELECT `id`, `start_time`, `end_time`, `error`\
    FROM `stock`.`_system_status`\
    WHERE `module_name` = ?\
    ORDER BY `id` DESC\
    LIMIT 1;\
";

/**
 * 查询最近一次执行成功的记录
 */
export const query_latest_success = "\
    SELECT `id`, `start_time`, `end_time`, `error`\
    FROM `stock`.`_system_status`\
    WHERE `module_name` = ? AND `end_time` > `start_time` AND `error` = null\
    ORDER BY `id` DESC\
    LIMIT 1;\
";

/**
 * 插入新的运行开始时间
 */
export const insert_start_time = "\
    INSERT INTO `stock`.`_system_status` (`module_name`, `start_time`)\
    VALUES (?, ?);\
";

/**
 * 更新运行结束时间
 */
export const update_end_time = "\
    UPDATE `stock`.`_system_status`\
    SET `end_time` = ?\
    WHERE `id` = ?;\
";

/**
 * 更新运行异常信息
 */
export const update_error = "\
    UPDATE `stock`.`_system_status`\
    SET `end_time` = ?, `error` = ?\
    WHERE `id` = ?;\
";