/**
 * 由于网页上表示空的方式各不相同，通过该方法来统一数据格式
 */
export function normalizeNull(data: any): string | undefined {
    switch (data) {
        case undefined:
        case null:
        case '':
        case '-':
        case '—':
        case '--':
            return undefined;

        default:
            if (typeof data !== 'string')
                return data.toString();
            else
                return data;
    }
}

/**
 * 统一单位到万
 */
export function normalizeAmountToWan(data?: string): number | undefined {
    if (data = normalizeNull(data)) {
        let temp: any = data.match(/-?[0-9\.]+/);
        if (temp) {
            if (data.includes('亿')) {
                return temp[0] * 10000;
            } else if (data.includes('万')) {
                return temp[0] * 1;
            } else {
                return temp[0] / 10000;
            }
        }
    }
}

/**
 * 统一单位到一
 */
export function normalizeAmountToYi(data?: string): number | undefined {
    if (data = normalizeNull(data)) {
        let temp: any = data.match(/-?[0-9\.]+/);
        if (temp) {
            if (data.includes('亿')) {
                return temp[0] * 10000 * 10000;
            } else if (data.includes('万')) {
                return temp[0] * 10000;
            } else {
                return temp[0] * 1;
            }
        }
    }
}

/**
 * 统一百分比到0-1
 */
export function normalizePercent(data?: string) {
    let temp = normalizeAmountToYi(data);
    if (temp != null) {
        if ((<string>data).includes('%')) {
            return temp / 100;
        } else {
            return temp * 1;
        }
    }
}