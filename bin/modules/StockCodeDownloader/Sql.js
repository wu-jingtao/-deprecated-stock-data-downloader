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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZXMvU3RvY2tDb2RlRG93bmxvYWRlci9TcWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7R0FFRztBQUNVLFFBQUEsWUFBWSxHQUFHOzs7Ozs7Ozs7Ozs7Q0FZM0IsQ0FBQyIsImZpbGUiOiJtb2R1bGVzL1N0b2NrQ29kZURvd25sb2FkZXIvU3FsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIOWIm+W7uuihqFxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGNyZWF0ZV90YWJsZSA9IFwiXFxcclxuICAgIENSRUFURSBUQUJMRSBJRiBOT1QgRVhJU1RTIGBzdG9ja2AuYHN0b2NrX2NvZGVgIChcXFxyXG4gICAgICAgIGBpZGAgaW50KDEwKSB1bnNpZ25lZCBOT1QgTlVMTCBBVVRPX0lOQ1JFTUVOVCBDT01NRU5UICfkuLvplK4nLFxcXHJcbiAgICAgICAgYGNvZGVgIHZhcmNoYXIoNDUpIE5PVCBOVUxMIENPTU1FTlQgJ+iCoeelqOS7o+eggScsXFxcclxuICAgICAgICBgbmFtZWAgdmFyY2hhcigyNTUpIE5PVCBOVUxMIENPTU1FTlQgJ+iCoeelqOWQjeensCcsXFxcclxuICAgICAgICBgbWFya2V0YCBpbnQoMTEpIHVuc2lnbmVkIE5PVCBOVUxMIENPTU1FTlQgJ+aJgOWxnuW4guWcuicsXFxcclxuICAgICAgICBgaXNfaW5kZXhgIHRpbnlpbnQoNCkgTk9UIE5VTEwgQ09NTUVOVCAn5piv5LiN5piv5oyH5pWwLCB0cnVl77yaMSAsIGZhbHNlOjAnLFxcXHJcbiAgICAgICAgUFJJTUFSWSBLRVkgKGBpZGApLFxcXHJcbiAgICAgICAgS0VZIGBjb2RlYCAoYGNvZGVgKSxcXFxyXG4gICAgICAgIEtFWSBgbWFya2V0YCAoYG1hcmtldGApLFxcXHJcbiAgICAgICAgQ09OU1RSQUlOVCBgbWFya2V0YCBGT1JFSUdOIEtFWSAoYG1hcmtldGApIFJFRkVSRU5DRVMgYHN0b2NrX21hcmtldGAgKGBpZGApIE9OIERFTEVURSBOTyBBQ1RJT04gT04gVVBEQVRFIE5PIEFDVElPTlxcXHJcbiAgICApIENPTU1FTlQ9J+iCoeelqOS7o+eggeWIl+ihqCc7XFxcclxuXCI7Il19
