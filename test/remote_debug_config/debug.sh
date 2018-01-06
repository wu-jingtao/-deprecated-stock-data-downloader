# 在远程调试过程中可能会用到的命令

# 创建容器
docker run -it -p 9229:9229 --name test-stock-data-downloader \
-e MYSQL_HOST_ADDR='localhost' \
-e MYSQL_HOST_PORT='3306' \
-e MYSQL_USERNAME='root' \
-e MYSQL_PASSWORD='root' \
registry.cn-hangzhou.aliyuncs.com/wujingtao/stock-data-downloader:latest /bin/bash

# 进入容器后开启调试
node --inspect-brk=0.0.0.0:9229 .

# 删除容器
docker rm test-stock-data-downloader