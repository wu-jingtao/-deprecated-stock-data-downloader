"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 创建表
 */
exports.create = "\
    CREATE TABLE IF NOT EXISTS `stock`.`_system_status` (\
        `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',\
        `module_name` varchar(255) NOT NULL COMMENT '系统模块的名称',\
        `start_time` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '模块执行任务的开始时间戳',\
        `end_time` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '模块执行任务的结束时间戳',\
        `error` varchar(2000) DEFAULT NULL COMMENT '记录模块执行任务的过程发生的错误',\
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZXMvTW9kdWxlU3RhdHVzUmVjb3JkZXIvU3FsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7O0dBRUc7QUFDVSxRQUFBLE1BQU0sR0FBRzs7Ozs7Ozs7Ozs7Ozs7OztDQWdCckIsQ0FBQztBQUVGOztHQUVHO0FBQ1UsUUFBQSxVQUFVLEdBQUc7Ozs7OztDQU16QixDQUFDO0FBRUY7O0dBRUc7QUFDVSxRQUFBLG9CQUFvQixHQUFHOzs7Ozs7Q0FNbkMsQ0FBQztBQUVGOztHQUVHO0FBQ1UsUUFBQSxpQkFBaUIsR0FBRzs7O0NBR2hDLENBQUM7QUFFRjs7R0FFRztBQUNVLFFBQUEsZUFBZSxHQUFHOzs7O0NBSTlCLENBQUM7QUFFRjs7R0FFRztBQUNVLFFBQUEsWUFBWSxHQUFHOzs7O0NBSTNCLENBQUMiLCJmaWxlIjoibW9kdWxlcy9Nb2R1bGVTdGF0dXNSZWNvcmRlci9TcWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICog5Yib5bu66KGoXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgY3JlYXRlID0gXCJcXFxyXG4gICAgQ1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMgYHN0b2NrYC5gX3N5c3RlbV9zdGF0dXNgIChcXFxyXG4gICAgICAgIGBpZGAgaW50KDExKSBOT1QgTlVMTCBBVVRPX0lOQ1JFTUVOVCBDT01NRU5UICfkuLvplK4nLFxcXHJcbiAgICAgICAgYG1vZHVsZV9uYW1lYCB2YXJjaGFyKDI1NSkgTk9UIE5VTEwgQ09NTUVOVCAn57O757uf5qih5Z2X55qE5ZCN56ewJyxcXFxyXG4gICAgICAgIGBzdGFydF90aW1lYCBpbnQoMTApIHVuc2lnbmVkIE5PVCBOVUxMIERFRkFVTFQgJzAnIENPTU1FTlQgJ+aooeWdl+aJp+ihjOS7u+WKoeeahOW8gOWni+aXtumXtOaIsycsXFxcclxuICAgICAgICBgZW5kX3RpbWVgIGludCgxMCkgdW5zaWduZWQgTk9UIE5VTEwgREVGQVVMVCAnMCcgQ09NTUVOVCAn5qih5Z2X5omn6KGM5Lu75Yqh55qE57uT5p2f5pe26Ze05oizJyxcXFxyXG4gICAgICAgIGBlcnJvcmAgdmFyY2hhcigyMDAwKSBERUZBVUxUIE5VTEwgQ09NTUVOVCAn6K6w5b2V5qih5Z2X5omn6KGM5Lu75Yqh55qE6L+H56iL5Y+R55Sf55qE6ZSZ6K+vJyxcXFxyXG4gICAgICAgIFBSSU1BUlkgS0VZIChgaWRgKSxcXFxyXG4gICAgICAgIEtFWSBgbW9kdWxlX25hbWVgIChgbW9kdWxlX25hbWVgKVxcXHJcbiAgICApIENPTU1FTlQ9J1xcXHJcbiAgICAgICAg5L+d5a2Y57O757uf5qih5Z2X55qE6L+Q6KGM54q25oCB44CCXFxcclxuICAgICAgICDlpoLmnpwgYHN0YXJ0X3RpbWVgID4gYGVuZF90aW1lYCDooajnpLrmraPlnKjov5DooYzjgIJcXFxyXG4gICAgICAgIOWmguaenCBgZW5kX3RpbWVgID4gYHN0YXJ0X3RpbWVgIOihqOekuuaJp+ihjOe7k+adn+OAguWmguaenOezu+e7n+WPkeeUn+i/h+W0qea6g++8jOWImeWPr+iDveS4ujBcXFxyXG4gICAgICAgIOWmguaenCBgZXJyb3JgIOS4jeS4uuepuuWImeihqOekuuaJp+ihjOS7u+WKoeeahOi/h+eoi+WPkeeUn+S6humUmeivr+OAglxcXHJcbiAgICAgICAg5o+Q56S677ya5aaC5p6c6KaB6K6p5p+Q5Liq5qih5Z2X6YeN5paw5LiL6L2977yM5pyA566A5Y2V55qE5pa55byP5bCx5piv5Yig6Zmk6K+l5qih5Z2X55qE5omA5pyJ54q25oCB6K6w5b2V44CCXFxcclxuICAgICc7XFxcclxuXCI7XHJcblxyXG4vKipcclxuICog5p+l6K+i5pyA6L+R5LiA5p2h6K6w5b2VXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgcXVlcnlfbGFzdCA9IFwiXFxcclxuICAgIFNFTEVDVCBgaWRgLCBgc3RhcnRfdGltZWAsIGBlbmRfdGltZWAsIGBlcnJvcmBcXFxyXG4gICAgRlJPTSBgc3RvY2tgLmBfc3lzdGVtX3N0YXR1c2BcXFxyXG4gICAgV0hFUkUgYG1vZHVsZV9uYW1lYCA9ID9cXFxyXG4gICAgT1JERVIgQlkgYGlkYCBERVNDXFxcclxuICAgIExJTUlUIDE7XFxcclxuXCI7XHJcblxyXG4vKipcclxuICog5p+l6K+i5pyA6L+R5LiA5qyh5omn6KGM5oiQ5Yqf55qE6K6w5b2VXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgcXVlcnlfbGF0ZXN0X3N1Y2Nlc3MgPSBcIlxcXHJcbiAgICBTRUxFQ1QgYGlkYCwgYHN0YXJ0X3RpbWVgLCBgZW5kX3RpbWVgLCBgZXJyb3JgXFxcclxuICAgIEZST00gYHN0b2NrYC5gX3N5c3RlbV9zdGF0dXNgXFxcclxuICAgIFdIRVJFIGBtb2R1bGVfbmFtZWAgPSA/IEFORCBgZW5kX3RpbWVgID4gYHN0YXJ0X3RpbWVgIEFORCBgZXJyb3JgID0gbnVsbFxcXHJcbiAgICBPUkRFUiBCWSBgaWRgIERFU0NcXFxyXG4gICAgTElNSVQgMTtcXFxyXG5cIjtcclxuXHJcbi8qKlxyXG4gKiDmj5LlhaXmlrDnmoTov5DooYzlvIDlp4vml7bpl7RcclxuICovXHJcbmV4cG9ydCBjb25zdCBpbnNlcnRfc3RhcnRfdGltZSA9IFwiXFxcclxuICAgIElOU0VSVCBJTlRPIGBzdG9ja2AuYF9zeXN0ZW1fc3RhdHVzYCAoYG1vZHVsZV9uYW1lYCwgYHN0YXJ0X3RpbWVgKVxcXHJcbiAgICBWQUxVRVMgKD8sID8pO1xcXHJcblwiO1xyXG5cclxuLyoqXHJcbiAqIOabtOaWsOi/kOihjOe7k+adn+aXtumXtFxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IHVwZGF0ZV9lbmRfdGltZSA9IFwiXFxcclxuICAgIFVQREFURSBgc3RvY2tgLmBfc3lzdGVtX3N0YXR1c2BcXFxyXG4gICAgU0VUIGBlbmRfdGltZWAgPSA/XFxcclxuICAgIFdIRVJFIGBpZGAgPSA/O1xcXHJcblwiO1xyXG5cclxuLyoqXHJcbiAqIOabtOaWsOi/kOihjOW8guW4uOS/oeaBr1xyXG4gKi9cclxuZXhwb3J0IGNvbnN0IHVwZGF0ZV9lcnJvciA9IFwiXFxcclxuICAgIFVQREFURSBgc3RvY2tgLmBfc3lzdGVtX3N0YXR1c2BcXFxyXG4gICAgU0VUIGBlbmRfdGltZWAgPSA/LCBgZXJyb3JgID0gP1xcXHJcbiAgICBXSEVSRSBgaWRgID0gPztcXFxyXG5cIjsiXX0=
