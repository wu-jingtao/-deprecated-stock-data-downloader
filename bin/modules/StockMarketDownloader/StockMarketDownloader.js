"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const service_starter_1 = require("service-starter");
const _ = require("lodash");
const StockMarket_1 = require("./StockMarket");
//创建表
const createTable = "\
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
//插入或更新数据
const insertData = "\
    INSERT INTO `stock`.`stock_market`\
    (`id`, `name`, `start_time`, `end_time`, `day_of_week`)\
    VALUES\
    (?, ?, ?, ?, ?)\
    ON duplicate key update \
    `name` = ?,`start_time` = ?,`end_time` = ?,`day_of_week` = ?;\
";
/**
 * 股票市场列表。
 * 该模块目前的主要目的就是创建`stock_market`数据表，并且将StockMarket.ts中的数据保存到数据库中
 */
class StockMarketDownloader extends service_starter_1.BaseServiceModule {
    async onStart() {
        const con = this.services.MysqlConnection;
        await con.asyncQuery(createTable); //创建数据表
        for (const item of _.values(StockMarket_1.StockMarket)) {
            await con.asyncQuery(insertData, [
                item.id, item.name, item.start_time, item.end_time, item.day_of_week,
                item.name, item.start_time, item.end_time, item.day_of_week
            ]);
        }
    }
}
exports.StockMarketDownloader = StockMarketDownloader;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZXMvU3RvY2tNYXJrZXREb3dubG9hZGVyL1N0b2NrTWFya2V0RG93bmxvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHFEQUFvRDtBQUNwRCw0QkFBNEI7QUFFNUIsK0NBQTRDO0FBRTVDLEtBQUs7QUFDTCxNQUFNLFdBQVcsR0FBRzs7Ozs7Ozs7OztDQVVuQixDQUFDO0FBRUYsU0FBUztBQUNULE1BQU0sVUFBVSxHQUFHOzs7Ozs7O0NBT2xCLENBQUM7QUFFRjs7O0dBR0c7QUFDSCwyQkFBbUMsU0FBUSxtQ0FBaUI7SUFDeEQsS0FBSyxDQUFDLE9BQU87UUFDVCxNQUFNLEdBQUcsR0FBb0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUM7UUFDM0QsTUFBTSxHQUFHLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUUsT0FBTztRQUMzQyxHQUFHLENBQUMsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLHlCQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkMsTUFBTSxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRTtnQkFDN0IsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsV0FBVztnQkFDcEUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFdBQVc7YUFDOUQsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztJQUNMLENBQUM7Q0FDSjtBQVhELHNEQVdDIiwiZmlsZSI6Im1vZHVsZXMvU3RvY2tNYXJrZXREb3dubG9hZGVyL1N0b2NrTWFya2V0RG93bmxvYWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE15c3FsQ29ubmVjdGlvbiB9IGZyb20gJy4vLi4vTXlzcWxDb25uZWN0aW9uL015c3FsQ29ubmVjdGlvbic7XHJcbmltcG9ydCB7IEJhc2VTZXJ2aWNlTW9kdWxlIH0gZnJvbSBcInNlcnZpY2Utc3RhcnRlclwiO1xyXG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XHJcblxyXG5pbXBvcnQgeyBTdG9ja01hcmtldCB9IGZyb20gJy4vU3RvY2tNYXJrZXQnO1xyXG5cclxuLy/liJvlu7rooahcclxuY29uc3QgY3JlYXRlVGFibGUgPSBcIlxcXHJcbiAgICBDUkVBVEUgVEFCTEUgSUYgTk9UIEVYSVNUUyBgc3RvY2tgLmBzdG9ja19tYXJrZXRgIChcXFxyXG4gICAgICAgIGBpZGAgSU5UIFVOU0lHTkVEIE5PVCBOVUxMIENPTU1FTlQgJ+S4u+mUricsXFxcclxuICAgICAgICBgbmFtZWAgVkFSQ0hBUigyNTUpIE5PVCBOVUxMIENPTU1FTlQgJ+W4guWcuuWQjeensCcsXFxcclxuICAgICAgICBgc3RhcnRfdGltZWAgVElNRSBOT1QgTlVMTCBDT01NRU5UICflvIDluILml7bpl7TjgILml7bpl7Tnu5/kuIDkuLrljJfkuqzml7bpl7QnLFxcXHJcbiAgICAgICAgYGVuZF90aW1lYCBUSU1FIE5PVCBOVUxMIENPTU1FTlQgJ+aUtuW4guaXtumXtCcsXFxcclxuICAgICAgICBgZGF5X29mX3dlZWtgIFZBUkNIQVIoNDUpIE5PVCBOVUxMIENPTU1FTlQgJ+avj+WRqOWTquWHoOaXpeS6pOaYk+OAguagvOW8j+S4uu+8mjEsMiwzLDQsNSw2LDcnLFxcXHJcbiAgICAgICAgUFJJTUFSWSBLRVkgKGBpZGApLFxcXHJcbiAgICAgICAgVU5JUVVFIElOREVYIGBuYW1lX1VOSVFVRWAgKGBuYW1lYCBBU0MpKVxcXHJcbiAgICBDT01NRU5UID0gJ+S6pOaYk+W4guWcuuWIl+ihqCc7XFxcclxuXCI7XHJcblxyXG4vL+aPkuWFpeaIluabtOaWsOaVsOaNrlxyXG5jb25zdCBpbnNlcnREYXRhID0gXCJcXFxyXG4gICAgSU5TRVJUIElOVE8gYHN0b2NrYC5gc3RvY2tfbWFya2V0YFxcXHJcbiAgICAoYGlkYCwgYG5hbWVgLCBgc3RhcnRfdGltZWAsIGBlbmRfdGltZWAsIGBkYXlfb2Zfd2Vla2ApXFxcclxuICAgIFZBTFVFU1xcXHJcbiAgICAoPywgPywgPywgPywgPylcXFxyXG4gICAgT04gZHVwbGljYXRlIGtleSB1cGRhdGUgXFxcclxuICAgIGBuYW1lYCA9ID8sYHN0YXJ0X3RpbWVgID0gPyxgZW5kX3RpbWVgID0gPyxgZGF5X29mX3dlZWtgID0gPztcXFxyXG5cIjtcclxuXHJcbi8qKlxyXG4gKiDogqHnpajluILlnLrliJfooajjgIJcclxuICog6K+l5qih5Z2X55uu5YmN55qE5Li76KaB55uu55qE5bCx5piv5Yib5bu6YHN0b2NrX21hcmtldGDmlbDmja7ooajvvIzlubbkuJTlsIZTdG9ja01hcmtldC50c+S4reeahOaVsOaNruS/neWtmOWIsOaVsOaNruW6k+S4rVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFN0b2NrTWFya2V0RG93bmxvYWRlciBleHRlbmRzIEJhc2VTZXJ2aWNlTW9kdWxlIHtcclxuICAgIGFzeW5jIG9uU3RhcnQoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgY29uc3QgY29uOiBNeXNxbENvbm5lY3Rpb24gPSB0aGlzLnNlcnZpY2VzLk15c3FsQ29ubmVjdGlvbjtcclxuICAgICAgICBhd2FpdCBjb24uYXN5bmNRdWVyeShjcmVhdGVUYWJsZSk7ICAvL+WIm+W7uuaVsOaNruihqFxyXG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBfLnZhbHVlcyhTdG9ja01hcmtldCkpIHsgLy/lkJHooajkuK3mj5LlhaXmlbDmja5cclxuICAgICAgICAgICAgYXdhaXQgY29uLmFzeW5jUXVlcnkoaW5zZXJ0RGF0YSwgW1xyXG4gICAgICAgICAgICAgICAgaXRlbS5pZCwgaXRlbS5uYW1lLCBpdGVtLnN0YXJ0X3RpbWUsIGl0ZW0uZW5kX3RpbWUsIGl0ZW0uZGF5X29mX3dlZWssXHJcbiAgICAgICAgICAgICAgICBpdGVtLm5hbWUsIGl0ZW0uc3RhcnRfdGltZSwgaXRlbS5lbmRfdGltZSwgaXRlbS5kYXlfb2Zfd2Vla1xyXG4gICAgICAgICAgICBdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iXX0=
