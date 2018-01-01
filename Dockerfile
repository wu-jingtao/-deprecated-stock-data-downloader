FROM registry.cn-hangzhou.aliyuncs.com/wujingtao/node:8.9.0

WORKDIR /app

COPY bin /app/bin
COPY package.json /app/package.json

RUN npm install --production 

# 确保可执行
RUN chmod 755 /app/node_modules/service-starter/src/Docker/health_check.sh

HEALTHCHECK \
    # 每次检查的间隔时间
    --interval=2m \
    # 单次检查的超时时长
    --timeout=30s \
    # 这个可以理解为在开始正式检查之前容器所需要的启动时间
    --start-period=2m \
    # 连续多少次检查失败可判定该服务是unhealthy
    --retries=3 \
    # 调用程序所暴露出的健康检查接口(要使用绝对路径)
    CMD /app/node_modules/service-starter/src/Docker/health_check.sh

CMD ["node", "."]