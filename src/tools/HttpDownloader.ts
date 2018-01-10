import * as request from 'request';
import { URL } from 'url';

import { Retry3 } from './Retry';

/**
 * @param method 方法
 * @param uri 地址
 * @param header 额外的请求头
 */
function fetch(method: string, uri: string, header: any = {}, form?: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        request(uri, {
            method,
            encoding: null,
            gzip: true,
            timeout: 120 * 1000,
            form,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Accept-Encoding': 'gzip, deflate, sdch, br',
                'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6',
                'Connection': 'keep - alive',
                'Host': (new URL(uri)).host,
                ...header
            }
        }, (err, response, body) => {
            err ? reject(err) : resolve(body);
        });
    });
}

export function Get(uri: string, header?: any) {
    return Retry3(fetch)('GET', uri, header);
}

export function Post(uri: string, form: any, header?: any) {
    return Retry3(fetch)('POST', uri, header, form);
}