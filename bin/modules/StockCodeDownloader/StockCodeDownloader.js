"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const service_starter_1 = require("service-starter");
const crontab = require('node-crontab');
const createTable = "\
    CREATE TABLE IF NOT EXISTS `stock`.`stock_code` (\
        `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',\
        `code` varchar(45) NOT NULL COMMENT '股票代码',\
        `name` varchar(255) NOT NULL COMMENT '股票名称',\
        `market` int(11) unsigned NOT NULL COMMENT '所属市场',\
        `is_index` tinyint(4) NOT NULL COMMENT '是不是指数, true：1 , false:0',\
        PRIMARY KEY (`id`),\
        KEY `code` (`code`),\
        KEY `market` (`market`),\
        KEY `is_index` (`is_index`),\
        CONSTRAINT `market` FOREIGN KEY (`market`) REFERENCES `stock_market` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION\
    ) COMMENT='股票代码列表';\
";
/**
 * 股票代码下载器
 */
class StockCodeDownloader extends service_starter_1.BaseServiceModule {
    constructor() {
        super(...arguments);
        this.timer = []; //保存计时器
    }
    async onStart() {
        const con = this.services.MysqlConnection;
        await con.asyncQuery(createTable); //创建数据表
    }
}
exports.StockCodeDownloader = StockCodeDownloader;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZXMvU3RvY2tDb2RlRG93bmxvYWRlci9TdG9ja0NvZGVEb3dubG9hZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscURBQW9EO0FBQ3BELE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUl4QyxNQUFNLFdBQVcsR0FBRzs7Ozs7Ozs7Ozs7OztDQWFuQixDQUFDO0FBRUY7O0dBRUc7QUFDSCx5QkFBaUMsU0FBUSxtQ0FBaUI7SUFBMUQ7O1FBRUksVUFBSyxHQUFVLEVBQUUsQ0FBQyxDQUFDLE9BQU87SUFROUIsQ0FBQztJQU5HLEtBQUssQ0FBQyxPQUFPO1FBQ1QsTUFBTSxHQUFHLEdBQW9CLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDO1FBQzNELE1BQU0sR0FBRyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFFLE9BQU87SUFHL0MsQ0FBQztDQUNKO0FBVkQsa0RBVUMiLCJmaWxlIjoibW9kdWxlcy9TdG9ja0NvZGVEb3dubG9hZGVyL1N0b2NrQ29kZURvd25sb2FkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCYXNlU2VydmljZU1vZHVsZSB9IGZyb20gXCJzZXJ2aWNlLXN0YXJ0ZXJcIjtcclxuY29uc3QgY3JvbnRhYiA9IHJlcXVpcmUoJ25vZGUtY3JvbnRhYicpO1xyXG5cclxuaW1wb3J0IHsgTXlzcWxDb25uZWN0aW9uIH0gZnJvbSBcIi4uL015c3FsQ29ubmVjdGlvbi9NeXNxbENvbm5lY3Rpb25cIjtcclxuXHJcbmNvbnN0IGNyZWF0ZVRhYmxlID0gXCJcXFxyXG4gICAgQ1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMgYHN0b2NrYC5gc3RvY2tfY29kZWAgKFxcXHJcbiAgICAgICAgYGlkYCBpbnQoMTApIHVuc2lnbmVkIE5PVCBOVUxMIEFVVE9fSU5DUkVNRU5UIENPTU1FTlQgJ+S4u+mUricsXFxcclxuICAgICAgICBgY29kZWAgdmFyY2hhcig0NSkgTk9UIE5VTEwgQ09NTUVOVCAn6IKh56Wo5Luj56CBJyxcXFxyXG4gICAgICAgIGBuYW1lYCB2YXJjaGFyKDI1NSkgTk9UIE5VTEwgQ09NTUVOVCAn6IKh56Wo5ZCN56ewJyxcXFxyXG4gICAgICAgIGBtYXJrZXRgIGludCgxMSkgdW5zaWduZWQgTk9UIE5VTEwgQ09NTUVOVCAn5omA5bGe5biC5Zy6JyxcXFxyXG4gICAgICAgIGBpc19pbmRleGAgdGlueWludCg0KSBOT1QgTlVMTCBDT01NRU5UICfmmK/kuI3mmK/mjIfmlbAsIHRydWXvvJoxICwgZmFsc2U6MCcsXFxcclxuICAgICAgICBQUklNQVJZIEtFWSAoYGlkYCksXFxcclxuICAgICAgICBLRVkgYGNvZGVgIChgY29kZWApLFxcXHJcbiAgICAgICAgS0VZIGBtYXJrZXRgIChgbWFya2V0YCksXFxcclxuICAgICAgICBLRVkgYGlzX2luZGV4YCAoYGlzX2luZGV4YCksXFxcclxuICAgICAgICBDT05TVFJBSU5UIGBtYXJrZXRgIEZPUkVJR04gS0VZIChgbWFya2V0YCkgUkVGRVJFTkNFUyBgc3RvY2tfbWFya2V0YCAoYGlkYCkgT04gREVMRVRFIENBU0NBREUgT04gVVBEQVRFIE5PIEFDVElPTlxcXHJcbiAgICApIENPTU1FTlQ9J+iCoeelqOS7o+eggeWIl+ihqCc7XFxcclxuXCI7XHJcblxyXG4vKipcclxuICog6IKh56Wo5Luj56CB5LiL6L295ZmoXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgU3RvY2tDb2RlRG93bmxvYWRlciBleHRlbmRzIEJhc2VTZXJ2aWNlTW9kdWxlIHtcclxuXHJcbiAgICB0aW1lcjogYW55W10gPSBbXTsgLy/kv53lrZjorqHml7blmahcclxuXHJcbiAgICBhc3luYyBvblN0YXJ0KCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGNvbnN0IGNvbjogTXlzcWxDb25uZWN0aW9uID0gdGhpcy5zZXJ2aWNlcy5NeXNxbENvbm5lY3Rpb247XHJcbiAgICAgICAgYXdhaXQgY29uLmFzeW5jUXVlcnkoY3JlYXRlVGFibGUpOyAgLy/liJvlu7rmlbDmja7ooahcclxuICAgICAgICBcclxuXHJcbiAgICB9XHJcbn1cclxuIl19
