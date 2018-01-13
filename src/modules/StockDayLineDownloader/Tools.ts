//将数字转换成以万的形式表示
export function exchangeToWan(data?: string) {
    if (data) {
        return Number.parseFloat(data) / 10000;
    }
}

//将数字转换成以一的形式表示
export function exchangeToYi(data?: string) {
    if (data) {
        return Number.parseFloat(data);
    }
}