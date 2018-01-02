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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZXMvU3RvY2tNYXJrZXQvU3RvY2tNYXJrZXREb3dubG9hZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EscURBQW9EO0FBQ3BELDRCQUE0QjtBQUU1QiwrQ0FBNEM7QUFFNUMsS0FBSztBQUNMLE1BQU0sV0FBVyxHQUFHOzs7Ozs7Ozs7O0NBVW5CLENBQUM7QUFFRixTQUFTO0FBQ1QsTUFBTSxVQUFVLEdBQUc7Ozs7Ozs7Q0FPbEIsQ0FBQztBQUVGOzs7R0FHRztBQUNILDJCQUFtQyxTQUFRLG1DQUFpQjtJQUN4RCxLQUFLLENBQUMsT0FBTztRQUNULE1BQU0sR0FBRyxHQUFvQixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQztRQUMzRCxNQUFNLEdBQUcsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBRSxPQUFPO1FBQzNDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMseUJBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QyxNQUFNLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFO2dCQUM3QixJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxXQUFXO2dCQUNwRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsV0FBVzthQUM5RCxDQUFDLENBQUM7UUFDUCxDQUFDO0lBQ0wsQ0FBQztDQUNKO0FBWEQsc0RBV0MiLCJmaWxlIjoibW9kdWxlcy9TdG9ja01hcmtldC9TdG9ja01hcmtldERvd25sb2FkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNeXNxbENvbm5lY3Rpb24gfSBmcm9tICcuLy4uL015c3FsQ29ubmVjdGlvbi9NeXNxbENvbm5lY3Rpb24nO1xyXG5pbXBvcnQgeyBCYXNlU2VydmljZU1vZHVsZSB9IGZyb20gXCJzZXJ2aWNlLXN0YXJ0ZXJcIjtcclxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xyXG5cclxuaW1wb3J0IHsgU3RvY2tNYXJrZXQgfSBmcm9tICcuL1N0b2NrTWFya2V0JztcclxuXHJcbi8v5Yib5bu66KGoXHJcbmNvbnN0IGNyZWF0ZVRhYmxlID0gXCJcXFxyXG4gICAgQ1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMgYHN0b2NrYC5gc3RvY2tfbWFya2V0YCAoXFxcclxuICAgICAgICBgaWRgIElOVCBVTlNJR05FRCBOT1QgTlVMTCBDT01NRU5UICfkuLvplK4nLFxcXHJcbiAgICAgICAgYG5hbWVgIFZBUkNIQVIoMjU1KSBOT1QgTlVMTCBDT01NRU5UICfluILlnLrlkI3np7AnLFxcXHJcbiAgICAgICAgYHN0YXJ0X3RpbWVgIFRJTUUgTk9UIE5VTEwgQ09NTUVOVCAn5byA5biC5pe26Ze044CC5pe26Ze057uf5LiA5Li65YyX5Lqs5pe26Ze0JyxcXFxyXG4gICAgICAgIGBlbmRfdGltZWAgVElNRSBOT1QgTlVMTCBDT01NRU5UICfmlLbluILml7bpl7QnLFxcXHJcbiAgICAgICAgYGRheV9vZl93ZWVrYCBWQVJDSEFSKDQ1KSBOT1QgTlVMTCBDT01NRU5UICfmr4/lkajlk6rlh6Dml6XkuqTmmJPjgILmoLzlvI/kuLrvvJoxLDIsMyw0LDUsNiw3JyxcXFxyXG4gICAgICAgIFBSSU1BUlkgS0VZIChgaWRgKSxcXFxyXG4gICAgICAgIFVOSVFVRSBJTkRFWCBgbmFtZV9VTklRVUVgIChgbmFtZWAgQVNDKSlcXFxyXG4gICAgQ09NTUVOVCA9ICfkuqTmmJPluILlnLrliJfooagnO1xcXHJcblwiO1xyXG5cclxuLy/mj5LlhaXmiJbmm7TmlrDmlbDmja5cclxuY29uc3QgaW5zZXJ0RGF0YSA9IFwiXFxcclxuICAgIElOU0VSVCBJTlRPIGBzdG9ja2AuYHN0b2NrX21hcmtldGBcXFxyXG4gICAgKGBpZGAsIGBuYW1lYCwgYHN0YXJ0X3RpbWVgLCBgZW5kX3RpbWVgLCBgZGF5X29mX3dlZWtgKVxcXHJcbiAgICBWQUxVRVNcXFxyXG4gICAgKD8sID8sID8sID8sID8pXFxcclxuICAgIE9OIGR1cGxpY2F0ZSBrZXkgdXBkYXRlIFxcXHJcbiAgICBgbmFtZWAgPSA/LGBzdGFydF90aW1lYCA9ID8sYGVuZF90aW1lYCA9ID8sYGRheV9vZl93ZWVrYCA9ID87XFxcclxuXCI7XHJcblxyXG4vKipcclxuICog6IKh56Wo5biC5Zy65YiX6KGo44CCXHJcbiAqIOivpeaooeWdl+ebruWJjeeahOS4u+imgeebrueahOWwseaYr+WIm+W7umBzdG9ja19tYXJrZXRg5pWw5o2u6KGo77yM5bm25LiU5bCGU3RvY2tNYXJrZXQudHPkuK3nmoTmlbDmja7kv53lrZjliLDmlbDmja7lupPkuK1cclxuICovXHJcbmV4cG9ydCBjbGFzcyBTdG9ja01hcmtldERvd25sb2FkZXIgZXh0ZW5kcyBCYXNlU2VydmljZU1vZHVsZSB7XHJcbiAgICBhc3luYyBvblN0YXJ0KCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGNvbnN0IGNvbjogTXlzcWxDb25uZWN0aW9uID0gdGhpcy5zZXJ2aWNlcy5NeXNxbENvbm5lY3Rpb247XHJcbiAgICAgICAgYXdhaXQgY29uLmFzeW5jUXVlcnkoY3JlYXRlVGFibGUpOyAgLy/liJvlu7rmlbDmja7ooahcclxuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgXy52YWx1ZXMoU3RvY2tNYXJrZXQpKSB7IC8v5ZCR6KGo5Lit5o+S5YWl5pWw5o2uXHJcbiAgICAgICAgICAgIGF3YWl0IGNvbi5hc3luY1F1ZXJ5KGluc2VydERhdGEsIFtcclxuICAgICAgICAgICAgICAgIGl0ZW0uaWQsIGl0ZW0ubmFtZSwgaXRlbS5zdGFydF90aW1lLCBpdGVtLmVuZF90aW1lLCBpdGVtLmRheV9vZl93ZWVrLFxyXG4gICAgICAgICAgICAgICAgaXRlbS5uYW1lLCBpdGVtLnN0YXJ0X3RpbWUsIGl0ZW0uZW5kX3RpbWUsIGl0ZW0uZGF5X29mX3dlZWtcclxuICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Il19
