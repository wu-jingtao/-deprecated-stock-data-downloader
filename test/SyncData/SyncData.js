const path = require('path');
const fs = require('fs');
const moment = require('moment');
const log = require('log-formatter').default;
const DbDataSynchronizer = require('db-data-synchronizer');

// 数据库连接参数
const connectionParams = {
    remoteHost: '127.0.0.1',
    remotePort: 3306,
    remoteUser: 'root',
    remotePassword: 'root',
    localHost: 'localhost',
    localPort: 3306,
    localUser: 'root',
    localPassword: 'root'
};

(async () => {
    //读取上次同步时保存的一些状态信息
    const stateFilePath = path.resolve(__dirname, './state.json');

    if (fs.existsSync(stateFilePath))
        var state = JSON.parse(fs.readFileSync(stateFilePath).toString()) || {};
    else
        var state = {};

    //初始化数据库连接
    const synchronizer = new DbDataSynchronizer(connectionParams);

    await synchronizer.sync("SELECT * FROM stock.stock_market").to();
    log('stock_market', '同步成功');

    await synchronizer.sync("SELECT * FROM stock.stock_code").to();
    log('stock_code', '同步成功');

    await synchronizer.sync("SELECT * FROM stock.stock_company_finance").to();
    log('stock_company_finance', '同步成功');

    await synchronizer.sync("SELECT * FROM stock.stock_company_information").to();
    log('stock_company_information', '同步成功');

    if (state.lastSyncTime) {   //上次同步时间
        const date = moment(state.lastSyncTime).subtract({ days: 7 }).format('YYYY-MM-DD'); //确保没有遗漏，同步最近七天

        await synchronizer.sync("SELECT * FROM stock.stock_day_line WHERE `date` >= ?", [date]).to();
        log('stock_day_line', '同步成功');

        await synchronizer.sync("SELECT * FROM stock.stock_fq_day_line WHERE `date` >= ?", [date]).to();
        log('stock_fq_day_line', '同步成功');
    } else {
        await synchronizer.sync("SELECT * FROM stock.stock_day_line").to();
        log('stock_day_line', '同步成功');

        await synchronizer.sync("SELECT * FROM stock.stock_fq_day_line").to();
        log('stock_fq_day_line', '同步成功');
    }

    state.lastSyncTime = moment().format('YYYY-MM-DD');

    //保存状态信息
    fs.writeFileSync(stateFilePath, JSON.stringify(state));
})().catch(err => log.error('同步失败', err))
    .then(() => process.exit());