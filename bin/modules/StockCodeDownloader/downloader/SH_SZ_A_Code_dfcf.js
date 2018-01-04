"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expect = require("expect.js");
const iconv = require("iconv-lite");
const $ = require("cheerio");
const HttpDownloader = require("../../../tools/HttpDownloader");
const Retry_1 = require("../../../tools/Retry");
const StockMarketType_1 = require("../../StockMarketList/StockMarketType");
/**
 * 东方财富，股票列表数据
 *
 * 数据格式`HTML`
 * 下载地址：http://quote.eastmoney.com/stocklist.html
 */
//下载地址
const address = 'http://quote.eastmoney.com/stocklist.html';
//下载数据
async function download() {
    const file = await HttpDownloader.Get(address);
    const data = iconv.decode(file, 'gbk'); //转码
    const result = [];
    $("#quotesearch ul li a[target]", data).each(function () {
        const href = $(this).attr('href');
        const text = $(this).text();
        const code = text.match(/\d{6}/)[0].trim();
        if (/^[360]/.test(code)) {
            result.push({
                code,
                name: text.match(/(.+)(?:\()/)[1].trim(),
                market: StockMarketType_1.StockMarketType[href.match(/([a-z]{2})(?:\d{6})/)[1]].id,
                isIndex: false
            });
        }
    });
    return result;
}
//检测下载的数据是否正确
function test(data) {
    expect(data.length).to.greaterThan(0);
    data.forEach(item => {
        expect(/^[360]\d{5}$/.test(item.code)).to.be.ok(); //股票代码
        expect(item.name.length).to.greaterThan(0); //确保公司名称不为空
        expect(item.market === StockMarketType_1.StockMarketType.sh.id || item.market === StockMarketType_1.StockMarketType.sz.id).to.be.ok();
    });
    return data;
}
/**
 * 上海A股代码下载器
 */
exports.SH_SZ_A_Code_dfcf = Retry_1.Retry3(async () => test(await download()));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZXMvU3RvY2tDb2RlRG93bmxvYWRlci9kb3dubG9hZGVyL1NIX1NaX0FfQ29kZV9kZmNmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0NBQXFDO0FBQ3JDLG9DQUFvQztBQUNwQyw2QkFBNkI7QUFFN0IsZ0VBQWdFO0FBQ2hFLGdEQUE4QztBQUU5QywyRUFBd0U7QUFFeEU7Ozs7O0dBS0c7QUFFSCxNQUFNO0FBQ04sTUFBTSxPQUFPLEdBQUcsMkNBQTJDLENBQUM7QUFFNUQsTUFBTTtBQUNOLEtBQUs7SUFDRCxNQUFNLElBQUksR0FBRyxNQUFNLGNBQWMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDL0MsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBSyxJQUFJO0lBRWhELE1BQU0sTUFBTSxHQUFvQixFQUFFLENBQUM7SUFFbkMsQ0FBQyxDQUFDLDhCQUE4QixFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQztRQUN6QyxNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBUSxDQUFDO1FBQ3pDLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQVMsQ0FBQztRQUVuQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBRTNDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQ1IsSUFBSTtnQkFDSixJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUU7Z0JBQ3hDLE1BQU0sRUFBRyxpQ0FBdUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUN6RSxPQUFPLEVBQUUsS0FBSzthQUNqQixDQUFDLENBQUM7UUFDUCxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ2xCLENBQUM7QUFFRCxhQUFhO0FBQ2IsY0FBYyxJQUFxQjtJQUMvQixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFdEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNoQixNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUUsTUFBTTtRQUMxRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQVMsV0FBVztRQUMvRCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxpQ0FBZSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxpQ0FBZSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO0lBQ3JHLENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLElBQUksQ0FBQztBQUNoQixDQUFDO0FBRUQ7O0dBRUc7QUFDVSxRQUFBLGlCQUFpQixHQUFHLGNBQU0sQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiJtb2R1bGVzL1N0b2NrQ29kZURvd25sb2FkZXIvZG93bmxvYWRlci9TSF9TWl9BX0NvZGVfZGZjZi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBleHBlY3QgPSByZXF1aXJlKCdleHBlY3QuanMnKTtcclxuaW1wb3J0ICogYXMgaWNvbnYgZnJvbSAnaWNvbnYtbGl0ZSc7XHJcbmltcG9ydCAqIGFzICQgZnJvbSAnY2hlZXJpbyc7XHJcblxyXG5pbXBvcnQgKiBhcyBIdHRwRG93bmxvYWRlciBmcm9tICcuLi8uLi8uLi90b29scy9IdHRwRG93bmxvYWRlcic7XHJcbmltcG9ydCB7IFJldHJ5MyB9IGZyb20gJy4uLy4uLy4uL3Rvb2xzL1JldHJ5JztcclxuaW1wb3J0IHsgU3RvY2tDb2RlVHlwZSB9IGZyb20gJy4uL1N0b2NrQ29kZVR5cGUnO1xyXG5pbXBvcnQgeyBTdG9ja01hcmtldFR5cGUgfSBmcm9tICcuLi8uLi9TdG9ja01hcmtldExpc3QvU3RvY2tNYXJrZXRUeXBlJztcclxuXHJcbi8qKlxyXG4gKiDkuJzmlrnotKLlr4zvvIzogqHnpajliJfooajmlbDmja5cclxuICogXHJcbiAqIOaVsOaNruagvOW8j2BIVE1MYFxyXG4gKiDkuIvovb3lnLDlnYDvvJpodHRwOi8vcXVvdGUuZWFzdG1vbmV5LmNvbS9zdG9ja2xpc3QuaHRtbFxyXG4gKi9cclxuXHJcbi8v5LiL6L295Zyw5Z2AXHJcbmNvbnN0IGFkZHJlc3MgPSAnaHR0cDovL3F1b3RlLmVhc3Rtb25leS5jb20vc3RvY2tsaXN0Lmh0bWwnO1xyXG5cclxuLy/kuIvovb3mlbDmja5cclxuYXN5bmMgZnVuY3Rpb24gZG93bmxvYWQoKTogUHJvbWlzZTxTdG9ja0NvZGVUeXBlW10+IHtcclxuICAgIGNvbnN0IGZpbGUgPSBhd2FpdCBIdHRwRG93bmxvYWRlci5HZXQoYWRkcmVzcyk7XHJcbiAgICBjb25zdCBkYXRhID0gaWNvbnYuZGVjb2RlKGZpbGUsICdnYmsnKTsgICAgIC8v6L2s56CBXHJcblxyXG4gICAgY29uc3QgcmVzdWx0OiBTdG9ja0NvZGVUeXBlW10gPSBbXTtcclxuXHJcbiAgICAkKFwiI3F1b3Rlc2VhcmNoIHVsIGxpIGFbdGFyZ2V0XVwiLCBkYXRhKS5lYWNoKGZ1bmN0aW9uICh0aGlzOiBDaGVlcmlvRWxlbWVudCkge1xyXG4gICAgICAgIGNvbnN0IGhyZWYgPSAkKHRoaXMpLmF0dHIoJ2hyZWYnKSBhcyBhbnk7XHJcbiAgICAgICAgY29uc3QgdGV4dCA9ICQodGhpcykudGV4dCgpIGFzIGFueTtcclxuXHJcbiAgICAgICAgY29uc3QgY29kZSA9IHRleHQubWF0Y2goL1xcZHs2fS8pWzBdLnRyaW0oKTtcclxuXHJcbiAgICAgICAgaWYgKC9eWzM2MF0vLnRlc3QoY29kZSkpIHsgIC8v5Y+q6KaBQeiCoVxyXG4gICAgICAgICAgICByZXN1bHQucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBjb2RlLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogdGV4dC5tYXRjaCgvKC4rKSg/OlxcKCkvKVsxXS50cmltKCksXHJcbiAgICAgICAgICAgICAgICBtYXJrZXQ6IChTdG9ja01hcmtldFR5cGUgYXMgYW55KVtocmVmLm1hdGNoKC8oW2Etel17Mn0pKD86XFxkezZ9KS8pWzFdXS5pZCxcclxuICAgICAgICAgICAgICAgIGlzSW5kZXg6IGZhbHNlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pOyBcclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG4vL+ajgOa1i+S4i+i9veeahOaVsOaNruaYr+WQpuato+ehrlxyXG5mdW5jdGlvbiB0ZXN0KGRhdGE6IFN0b2NrQ29kZVR5cGVbXSkge1xyXG4gICAgZXhwZWN0KGRhdGEubGVuZ3RoKS50by5ncmVhdGVyVGhhbigwKTtcclxuXHJcbiAgICBkYXRhLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgZXhwZWN0KC9eWzM2MF1cXGR7NX0kLy50ZXN0KGl0ZW0uY29kZSkpLnRvLmJlLm9rKCk7ICAvL+iCoeelqOS7o+eggVxyXG4gICAgICAgIGV4cGVjdChpdGVtLm5hbWUubGVuZ3RoKS50by5ncmVhdGVyVGhhbigwKTsgICAgICAgICAvL+ehruS/neWFrOWPuOWQjeensOS4jeS4uuepulxyXG4gICAgICAgIGV4cGVjdChpdGVtLm1hcmtldCA9PT0gU3RvY2tNYXJrZXRUeXBlLnNoLmlkIHx8IGl0ZW0ubWFya2V0ID09PSBTdG9ja01hcmtldFR5cGUuc3ouaWQpLnRvLmJlLm9rKClcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBkYXRhO1xyXG59XHJcblxyXG4vKipcclxuICog5LiK5rW3QeiCoeS7o+eggeS4i+i9veWZqFxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IFNIX1NaX0FfQ29kZV9kZmNmID0gUmV0cnkzKGFzeW5jICgpID0+IHRlc3QoYXdhaXQgZG93bmxvYWQoKSkpOyJdfQ==
