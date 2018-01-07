# 在远程调试过程中可能会用到的命令

# 拉取新镜像
docker pull registry.cn-hangzhou.aliyuncs.com/wujingtao/stock-data-downloader:latest

# 创建调试容器
docker run -it -p 9229:9229 --name test-stock-data-downloader \
-e MYSQL_HOST_ADDR='localhost' \
-e MYSQL_HOST_PORT='3306' \
-e MYSQL_USERNAME='root' \
-e MYSQL_PASSWORD='root' \
registry.cn-hangzhou.aliyuncs.com/wujingtao/stock-data-downloader:latest /bin/bash

# 进入容器后开启调试
node --inspect-brk=0.0.0.0:9229 .

# 删除调试容器
docker rm -f test-stock-data-downloader

# 创建或更新正式上线的容器
docker rm -f stock-data-downloader; \
docker run -d --restart=always --name stock-data-downloader \
-e MYSQL_HOST_ADDR='localhost' \
-e MYSQL_HOST_PORT='3306' \
-e MYSQL_USERNAME='root' \
-e MYSQL_PASSWORD='root' \
registry.cn-hangzhou.aliyuncs.com/wujingtao/stock-data-downloader:latest