# stock-data-downloader
股票数据下载器

### 目前支持下载
* A股基本面数据
* A股、港股(沪港通) 日线与后复权日线数据
* 国内期货、外汇日线数据

### 环境变量配置
* `MYSQL_HOST_ADDR` 主机地址 (默认 localhost)
* `MYSQL_HOST_PORT` 连接端口 (默认 3306)
* `MYSQL_USERNAME` 用户名 (默认 root)
* `MYSQL_PASSWORD` 登陆密码 (默认 root)
* `TZ` 时区 (默认上海)

### Docker Image
> docker pull registry.cn-hangzhou.aliyuncs.com/wujingtao/stock-data-downloader

> [用法参考](./test/remote_debug_config/debug.sh)
