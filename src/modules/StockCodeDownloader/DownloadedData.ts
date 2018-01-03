/**
 * 下载到的数据
 */
export interface DownloadedData {
    code: string,       //股票代码
    name: string,       //股票名称
    market: number,     //所属市场ID
    isIndex: boolean    //是不是指数
}