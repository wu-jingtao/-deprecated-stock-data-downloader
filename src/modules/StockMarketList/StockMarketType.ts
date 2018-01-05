/**
 * 市场列表
 */
export const StockMarketType = {
    'sh': {
        id: 1,  //注意ID不能变动
        name: '上海A股',
        start_time: '09:15:00',
        end_time: '15:00:00',
        day_of_week: '1,2,3,4,5'
    },
    'sz': {
        id: 2,
        name: '深圳A股',
        start_time: '09:15:00',
        end_time: '15:00:00',
        day_of_week: '1,2,3,4,5'
    },
    'xg': {
        id: 3,
        name: '港股',
        start_time: '09:00:00',
        end_time: '16:10:00',
        day_of_week: '1,2,3,4,5'
    },
    'NYSE': {   //暂时还用不上，所以就没有下载美股
        id: 4,
        name: '纽交所',
        start_time: '22:30:00', //按照北京时间计算，并且未考录夏令时冬令时，与同花顺保持一致
        end_time: '05:00:00',
        day_of_week: '1,2,3,4,5'
    },
    'NASDAQ': {
        id: 5,
        name: '纳斯达克',
        start_time: '22:30:00',
        end_time: '05:00:00',
        day_of_week: '1,2,3,4,5'
    },
    'sqs': {
        id: 6,
        name: '上海期货交易所',
        start_time: '21:00:00', //该时间是参考新浪的，与交易所规定的开始并不相同
        end_time: '15:00:00',
        day_of_week: '1,2,3,4,5'
    },
    'zss': {
        id: 7,
        name: '郑州商品交易所',
        start_time: '21:00:00',
        end_time: '15:00:00',
        day_of_week: '1,2,3,4,5'
    },
    'dss': {
        id: 8,
        name: '大连商品交易所',
        start_time: '21:00:00',
        end_time: '15:00:00',
        day_of_week: '1,2,3,4,5'
    },
    'zjs': {
        id: 9,
        name: '中国金融期货交易所',
        start_time: '09:30:00',
        end_time: '15:00:00',
        day_of_week: '1,2,3,4,5'
    },
    'wh': {
        id: 10,
        name: '外汇',
        start_time: '00:00:00',
        end_time: '24:00:00',
        day_of_week: '1,2,3,4,5,6,7'
    }
};