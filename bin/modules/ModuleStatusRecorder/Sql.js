"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 创建表
 */
exports.create = "\
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
exports.query_last = "\
    SELECT `id`, `start_time`, `end_time`, `error`\
    FROM `stock`.`_system_status`\
    WHERE `module_name` = ?\
    ORDER BY `id` DESC\
    LIMIT 1;\
";
/**
 * 查询最近一次执行成功的记录
 */
exports.query_latest_success = "\
    SELECT `id`, `start_time`, `end_time`, `error`\
    FROM `stock`.`_system_status`\
    WHERE `module_name` = ? AND `end_time` > `start_time` AND `error` = null\
    ORDER BY `id` DESC\
    LIMIT 1;\
";
/**
 * 插入新的运行开始时间
 */
exports.insert_start_time = "\
    INSERT INTO `stock`.`_system_status` (`module_name`, `start_time`)\
    VALUES (?, ?);\
";
/**
 * 更新运行结束时间
 */
exports.update_end_time = "\
    UPDATE `stock`.`_system_status`\
    SET `end_time` = ?\
    WHERE `id` = ?;\
";
/**
 * 更新运行异常信息
 */
exports.update_error = "\
    UPDATE `stock`.`_system_status`\
    SET `end_time` = ?, `error` = ?\
    WHERE `id` = ?;\
";

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZXMvTW9kdWxlU3RhdHVzUmVjb3JkZXIvU3FsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7O0dBRUc7QUFDVSxRQUFBLE1BQU0sR0FBRzs7Ozs7Ozs7Ozs7Ozs7OztDQWdCckIsQ0FBQztBQUVGOztHQUVHO0FBQ1UsUUFBQSxVQUFVLEdBQUc7Ozs7OztDQU16QixDQUFDO0FBRUY7O0dBRUc7QUFDVSxRQUFBLG9CQUFvQixHQUFHOzs7Ozs7Q0FNbkMsQ0FBQztBQUVGOztHQUVHO0FBQ1UsUUFBQSxpQkFBaUIsR0FBRzs7O0NBR2hDLENBQUM7QUFFRjs7R0FFRztBQUNVLFFBQUEsZUFBZSxHQUFHOzs7O0NBSTlCLENBQUM7QUFFRjs7R0FFRztBQUNVLFFBQUEsWUFBWSxHQUFHOzs7O0NBSTNCLENBQUMiLCJmaWxlIjoibW9kdWxlcy9Nb2R1bGVTdGF0dXNSZWNvcmRlci9TcWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICog5Yib5bu66KGoXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgY3JlYXRlID0gXCJcXFxyXG4gICAgQ1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMgYHN0b2NrYC5gX3N5c3RlbV9zdGF0dXNgIChcXFxyXG4gICAgICAgIGBpZGAgaW50KDExKSBOT1QgTlVMTCBBVVRPX0lOQ1JFTUVOVCBDT01NRU5UICfkuLvplK4nLFxcXHJcbiAgICAgICAgYG1vZHVsZV9uYW1lYCB2YXJjaGFyKDI1NSkgTk9UIE5VTEwgQ09NTUVOVCAn57O757uf5qih5Z2X55qE5ZCN56ewJyxcXFxyXG4gICAgICAgIGBzdGFydF90aW1lYCBCSUdJTlQgdW5zaWduZWQgTk9UIE5VTEwgREVGQVVMVCAnMCcgQ09NTUVOVCAn5qih5Z2X5omn6KGM5Lu75Yqh55qE5byA5aeL5pe26Ze05oizJyxcXFxyXG4gICAgICAgIGBlbmRfdGltZWAgQklHSU5UIHVuc2lnbmVkIE5PVCBOVUxMIERFRkFVTFQgJzAnIENPTU1FTlQgJ+aooeWdl+aJp+ihjOS7u+WKoeeahOe7k+adn+aXtumXtOaIsycsXFxcclxuICAgICAgICBgZXJyb3JgIFRFWFQgREVGQVVMVCBOVUxMIENPTU1FTlQgJ+iusOW9leaooeWdl+aJp+ihjOS7u+WKoeeahOi/h+eoi+WPkeeUn+eahOmUmeivrycsXFxcclxuICAgICAgICBQUklNQVJZIEtFWSAoYGlkYCksXFxcclxuICAgICAgICBLRVkgYG1vZHVsZV9uYW1lYCAoYG1vZHVsZV9uYW1lYClcXFxyXG4gICAgKSBDT01NRU5UPSdcXFxyXG4gICAgICAgIOS/neWtmOezu+e7n+aooeWdl+eahOi/kOihjOeKtuaAgeOAglxcXHJcbiAgICAgICAg5aaC5p6cIGBzdGFydF90aW1lYCA+IGBlbmRfdGltZWAg6KGo56S65q2j5Zyo6L+Q6KGM44CCXFxcclxuICAgICAgICDlpoLmnpwgYGVuZF90aW1lYCA+IGBzdGFydF90aW1lYCDooajnpLrmiafooYznu5PmnZ/jgILlpoLmnpzns7vnu5/lj5HnlJ/ov4fltKnmuoPvvIzliJnlj6/og73kuLowXFxcclxuICAgICAgICDlpoLmnpwgYGVycm9yYCDkuI3kuLrnqbrliJnooajnpLrmiafooYzku7vliqHnmoTov4fnqIvlj5HnlJ/kuobplJnor6/jgIJcXFxyXG4gICAgICAgIOaPkOekuu+8muWmguaenOimgeiuqeafkOS4quaooeWdl+mHjeaWsOS4i+i9ve+8jOacgOeugOWNleeahOaWueW8j+WwseaYr+WIoOmZpOivpeaooeWdl+eahOaJgOacieeKtuaAgeiusOW9leOAglxcXHJcbiAgICAnO1xcXHJcblwiO1xyXG5cclxuLyoqXHJcbiAqIOafpeivouacgOi/keS4gOadoeiusOW9lVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IHF1ZXJ5X2xhc3QgPSBcIlxcXHJcbiAgICBTRUxFQ1QgYGlkYCwgYHN0YXJ0X3RpbWVgLCBgZW5kX3RpbWVgLCBgZXJyb3JgXFxcclxuICAgIEZST00gYHN0b2NrYC5gX3N5c3RlbV9zdGF0dXNgXFxcclxuICAgIFdIRVJFIGBtb2R1bGVfbmFtZWAgPSA/XFxcclxuICAgIE9SREVSIEJZIGBpZGAgREVTQ1xcXHJcbiAgICBMSU1JVCAxO1xcXHJcblwiO1xyXG5cclxuLyoqXHJcbiAqIOafpeivouacgOi/keS4gOasoeaJp+ihjOaIkOWKn+eahOiusOW9lVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IHF1ZXJ5X2xhdGVzdF9zdWNjZXNzID0gXCJcXFxyXG4gICAgU0VMRUNUIGBpZGAsIGBzdGFydF90aW1lYCwgYGVuZF90aW1lYCwgYGVycm9yYFxcXHJcbiAgICBGUk9NIGBzdG9ja2AuYF9zeXN0ZW1fc3RhdHVzYFxcXHJcbiAgICBXSEVSRSBgbW9kdWxlX25hbWVgID0gPyBBTkQgYGVuZF90aW1lYCA+IGBzdGFydF90aW1lYCBBTkQgYGVycm9yYCA9IG51bGxcXFxyXG4gICAgT1JERVIgQlkgYGlkYCBERVNDXFxcclxuICAgIExJTUlUIDE7XFxcclxuXCI7XHJcblxyXG4vKipcclxuICog5o+S5YWl5paw55qE6L+Q6KGM5byA5aeL5pe26Ze0XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgaW5zZXJ0X3N0YXJ0X3RpbWUgPSBcIlxcXHJcbiAgICBJTlNFUlQgSU5UTyBgc3RvY2tgLmBfc3lzdGVtX3N0YXR1c2AgKGBtb2R1bGVfbmFtZWAsIGBzdGFydF90aW1lYClcXFxyXG4gICAgVkFMVUVTICg/LCA/KTtcXFxyXG5cIjtcclxuXHJcbi8qKlxyXG4gKiDmm7TmlrDov5DooYznu5PmnZ/ml7bpl7RcclxuICovXHJcbmV4cG9ydCBjb25zdCB1cGRhdGVfZW5kX3RpbWUgPSBcIlxcXHJcbiAgICBVUERBVEUgYHN0b2NrYC5gX3N5c3RlbV9zdGF0dXNgXFxcclxuICAgIFNFVCBgZW5kX3RpbWVgID0gP1xcXHJcbiAgICBXSEVSRSBgaWRgID0gPztcXFxyXG5cIjtcclxuXHJcbi8qKlxyXG4gKiDmm7TmlrDov5DooYzlvILluLjkv6Hmga9cclxuICovXHJcbmV4cG9ydCBjb25zdCB1cGRhdGVfZXJyb3IgPSBcIlxcXHJcbiAgICBVUERBVEUgYHN0b2NrYC5gX3N5c3RlbV9zdGF0dXNgXFxcclxuICAgIFNFVCBgZW5kX3RpbWVgID0gPywgYGVycm9yYCA9ID9cXFxyXG4gICAgV0hFUkUgYGlkYCA9ID87XFxcclxuXCI7Il19
