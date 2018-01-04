"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 创建表
 */
exports.create_table = "\
    CREATE TABLE IF NOT EXISTS `stock`.`stock_code` (\
        `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',\
        `code` varchar(45) NOT NULL COMMENT '股票代码',\
        `name` varchar(255) NOT NULL COMMENT '股票名称',\
        `market` int(11) unsigned NOT NULL COMMENT '所属市场',\
        `is_index` tinyint(4) NOT NULL COMMENT '是不是指数, true：1 , false:0',\
        PRIMARY KEY (`id`),\
        KEY `code` (`code`),\
        KEY `market` (`market`),\
        CONSTRAINT `market` FOREIGN KEY (`market`) REFERENCES `stock_market` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION\
    ) COMMENT='股票代码列表';\
";
/**
 * 查询ID
 */
exports.get_id = "\
    SELECT `id` FROM `stock`.`stock_code`\
    WHERE `code` = ? AND `market` = ? AND `is_index` = ?;\
";
/**
 * 保存数据
 */
exports.insert_data = "\
    INSERT INTO `stock`.`stock_code` (`code`, `name`, `market`, `is_index`)\
    VALUES (?, ?, ?, ?);\
";
/**
 * 更新股票名称
 */
exports.update_data = "\
    UPDATE `stock`.`stock_code`\
    SET `name` = ?\
    WHERE `id` = ?;\
";

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZXMvU3RvY2tDb2RlRG93bmxvYWRlci9TcWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7R0FFRztBQUNVLFFBQUEsWUFBWSxHQUFHOzs7Ozs7Ozs7Ozs7Q0FZM0IsQ0FBQztBQUVGOztHQUVHO0FBQ1UsUUFBQSxNQUFNLEdBQUc7OztDQUdyQixDQUFDO0FBRUY7O0dBRUc7QUFDVSxRQUFBLFdBQVcsR0FBRzs7O0NBRzFCLENBQUM7QUFFRjs7R0FFRztBQUNVLFFBQUEsV0FBVyxHQUFHOzs7O0NBSTFCLENBQUMiLCJmaWxlIjoibW9kdWxlcy9TdG9ja0NvZGVEb3dubG9hZGVyL1NxbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiDliJvlu7rooahcclxuICovXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVfdGFibGUgPSBcIlxcXHJcbiAgICBDUkVBVEUgVEFCTEUgSUYgTk9UIEVYSVNUUyBgc3RvY2tgLmBzdG9ja19jb2RlYCAoXFxcclxuICAgICAgICBgaWRgIGludCgxMCkgdW5zaWduZWQgTk9UIE5VTEwgQVVUT19JTkNSRU1FTlQgQ09NTUVOVCAn5Li76ZSuJyxcXFxyXG4gICAgICAgIGBjb2RlYCB2YXJjaGFyKDQ1KSBOT1QgTlVMTCBDT01NRU5UICfogqHnpajku6PnoIEnLFxcXHJcbiAgICAgICAgYG5hbWVgIHZhcmNoYXIoMjU1KSBOT1QgTlVMTCBDT01NRU5UICfogqHnpajlkI3np7AnLFxcXHJcbiAgICAgICAgYG1hcmtldGAgaW50KDExKSB1bnNpZ25lZCBOT1QgTlVMTCBDT01NRU5UICfmiYDlsZ7luILlnLonLFxcXHJcbiAgICAgICAgYGlzX2luZGV4YCB0aW55aW50KDQpIE5PVCBOVUxMIENPTU1FTlQgJ+aYr+S4jeaYr+aMh+aVsCwgdHJ1Ze+8mjEgLCBmYWxzZTowJyxcXFxyXG4gICAgICAgIFBSSU1BUlkgS0VZIChgaWRgKSxcXFxyXG4gICAgICAgIEtFWSBgY29kZWAgKGBjb2RlYCksXFxcclxuICAgICAgICBLRVkgYG1hcmtldGAgKGBtYXJrZXRgKSxcXFxyXG4gICAgICAgIENPTlNUUkFJTlQgYG1hcmtldGAgRk9SRUlHTiBLRVkgKGBtYXJrZXRgKSBSRUZFUkVOQ0VTIGBzdG9ja19tYXJrZXRgIChgaWRgKSBPTiBERUxFVEUgTk8gQUNUSU9OIE9OIFVQREFURSBOTyBBQ1RJT05cXFxyXG4gICAgKSBDT01NRU5UPSfogqHnpajku6PnoIHliJfooagnO1xcXHJcblwiO1xyXG5cclxuLyoqXHJcbiAqIOafpeivoklEXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgZ2V0X2lkID0gXCJcXFxyXG4gICAgU0VMRUNUIGBpZGAgRlJPTSBgc3RvY2tgLmBzdG9ja19jb2RlYFxcXHJcbiAgICBXSEVSRSBgY29kZWAgPSA/IEFORCBgbWFya2V0YCA9ID8gQU5EIGBpc19pbmRleGAgPSA/O1xcXHJcblwiO1xyXG5cclxuLyoqXHJcbiAqIOS/neWtmOaVsOaNrlxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGluc2VydF9kYXRhID0gXCJcXFxyXG4gICAgSU5TRVJUIElOVE8gYHN0b2NrYC5gc3RvY2tfY29kZWAgKGBjb2RlYCwgYG5hbWVgLCBgbWFya2V0YCwgYGlzX2luZGV4YClcXFxyXG4gICAgVkFMVUVTICg/LCA/LCA/LCA/KTtcXFxyXG5cIjtcclxuXHJcbi8qKlxyXG4gKiDmm7TmlrDogqHnpajlkI3np7BcclxuICovXHJcbmV4cG9ydCBjb25zdCB1cGRhdGVfZGF0YSA9IFwiXFxcclxuICAgIFVQREFURSBgc3RvY2tgLmBzdG9ja19jb2RlYFxcXHJcbiAgICBTRVQgYG5hbWVgID0gP1xcXHJcbiAgICBXSEVSRSBgaWRgID0gPztcXFxyXG5cIjsiXX0=
