import * as _ from 'lodash';
import * as moment from 'moment';

/**
 * 提取最近一周的数据
 * @param data 要进行剪切的数据
 * @param dateKey 日期的键名
 * @param dateFormat 日期格式
 */
export function GetLatestWeekData<T>(data: T[], dateKey: string, dateFormat?: string) {
    return _.sortBy(data, (item: any) => -moment(item[dateKey], dateFormat).unix()).slice(0, 7);
}