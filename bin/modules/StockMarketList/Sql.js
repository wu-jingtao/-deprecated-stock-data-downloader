"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 创建表
 */
exports.create_table = "\
    CREATE TABLE IF NOT EXISTS `stock`.`stock_market` (\
        `id` INT UNSIGNED NOT NULL COMMENT '主键',\
        `name` VARCHAR(255) NOT NULL COMMENT '市场名称',\
        `start_time` TIME NOT NULL COMMENT '开市时间。时间统一为北京时间',\
        `end_time` TIME NOT NULL COMMENT '收市时间',\
        `day_of_week` VARCHAR(45) NOT NULL COMMENT '每周哪几日交易。格式为：1,2,3,4,5,6,7',\
        PRIMARY KEY (`id`),\
        UNIQUE INDEX `name_UNIQUE` (`name` ASC))\
    COMMENT = '交易市场列表';\
";
/**
 * 插入或更新数据
 */
exports.insert_data = "\
    INSERT INTO `stock`.`stock_market`\
    (`id`, `name`, `start_time`, `end_time`, `day_of_week`)\
    VALUES\
    (?, ?, ?, ?, ?)\
    ON duplicate key update \
    `name` = ?,`start_time` = ?,`end_time` = ?,`day_of_week` = ?;\
";

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZXMvU3RvY2tNYXJrZXRMaXN0L1NxbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOztHQUVHO0FBQ1UsUUFBQSxZQUFZLEdBQUc7Ozs7Ozs7Ozs7Q0FVM0IsQ0FBQztBQUVGOztHQUVHO0FBQ1UsUUFBQSxXQUFXLEdBQUc7Ozs7Ozs7Q0FPMUIsQ0FBQyIsImZpbGUiOiJtb2R1bGVzL1N0b2NrTWFya2V0TGlzdC9TcWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICog5Yib5bu66KGoXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgY3JlYXRlX3RhYmxlID0gXCJcXFxyXG4gICAgQ1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMgYHN0b2NrYC5gc3RvY2tfbWFya2V0YCAoXFxcclxuICAgICAgICBgaWRgIElOVCBVTlNJR05FRCBOT1QgTlVMTCBDT01NRU5UICfkuLvplK4nLFxcXHJcbiAgICAgICAgYG5hbWVgIFZBUkNIQVIoMjU1KSBOT1QgTlVMTCBDT01NRU5UICfluILlnLrlkI3np7AnLFxcXHJcbiAgICAgICAgYHN0YXJ0X3RpbWVgIFRJTUUgTk9UIE5VTEwgQ09NTUVOVCAn5byA5biC5pe26Ze044CC5pe26Ze057uf5LiA5Li65YyX5Lqs5pe26Ze0JyxcXFxyXG4gICAgICAgIGBlbmRfdGltZWAgVElNRSBOT1QgTlVMTCBDT01NRU5UICfmlLbluILml7bpl7QnLFxcXHJcbiAgICAgICAgYGRheV9vZl93ZWVrYCBWQVJDSEFSKDQ1KSBOT1QgTlVMTCBDT01NRU5UICfmr4/lkajlk6rlh6Dml6XkuqTmmJPjgILmoLzlvI/kuLrvvJoxLDIsMyw0LDUsNiw3JyxcXFxyXG4gICAgICAgIFBSSU1BUlkgS0VZIChgaWRgKSxcXFxyXG4gICAgICAgIFVOSVFVRSBJTkRFWCBgbmFtZV9VTklRVUVgIChgbmFtZWAgQVNDKSlcXFxyXG4gICAgQ09NTUVOVCA9ICfkuqTmmJPluILlnLrliJfooagnO1xcXHJcblwiO1xyXG5cclxuLyoqXHJcbiAqIOaPkuWFpeaIluabtOaWsOaVsOaNrlxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGluc2VydF9kYXRhID0gXCJcXFxyXG4gICAgSU5TRVJUIElOVE8gYHN0b2NrYC5gc3RvY2tfbWFya2V0YFxcXHJcbiAgICAoYGlkYCwgYG5hbWVgLCBgc3RhcnRfdGltZWAsIGBlbmRfdGltZWAsIGBkYXlfb2Zfd2Vla2ApXFxcclxuICAgIFZBTFVFU1xcXHJcbiAgICAoPywgPywgPywgPywgPylcXFxyXG4gICAgT04gZHVwbGljYXRlIGtleSB1cGRhdGUgXFxcclxuICAgIGBuYW1lYCA9ID8sYHN0YXJ0X3RpbWVgID0gPyxgZW5kX3RpbWVgID0gPyxgZGF5X29mX3dlZWtgID0gPztcXFxyXG5cIjsiXX0=
