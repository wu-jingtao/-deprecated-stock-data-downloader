"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expect = require("expect.js");
const iconv = require("iconv-lite");
const $ = require("cheerio");
const HttpDownloader = require("../../../tools/HttpDownloader");
const StockMarket_1 = require("../../StockMarketDownloader/StockMarket");
const Retry_1 = require("../../../tools/Retry");
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
                market: StockMarket_1.StockMarket[href.match(/([a-z]{2})(?:\d{6})/)[1]].id,
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
        expect(item.market === StockMarket_1.StockMarket.sh.id || item.market === StockMarket_1.StockMarket.sz.id).to.be.ok();
    });
    return data;
}
/**
 * 上海A股代码下载器
 */
exports.SH_SZ_A_Code_dfcf = Retry_1.Retry3(async () => test(await download()));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZXMvU3RvY2tDb2RlRG93bmxvYWRlci9kb3dubG9hZGVyL1NIX1NaX0FfQ29kZV9kZmNmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0NBQXFDO0FBQ3JDLG9DQUFvQztBQUNwQyw2QkFBNkI7QUFFN0IsZ0VBQWdFO0FBQ2hFLHlFQUFzRTtBQUV0RSxnREFBOEM7QUFFOUM7Ozs7O0dBS0c7QUFFSCxNQUFNO0FBQ04sTUFBTSxPQUFPLEdBQUcsMkNBQTJDLENBQUM7QUFFNUQsTUFBTTtBQUNOLEtBQUs7SUFDRCxNQUFNLElBQUksR0FBRyxNQUFNLGNBQWMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDL0MsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBSyxJQUFJO0lBRWhELE1BQU0sTUFBTSxHQUFxQixFQUFFLENBQUM7SUFFcEMsQ0FBQyxDQUFDLDhCQUE4QixFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQztRQUN6QyxNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBUSxDQUFDO1FBQ3pDLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQVMsQ0FBQztRQUVuQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBRTNDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQ1IsSUFBSTtnQkFDSixJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUU7Z0JBQ3hDLE1BQU0sRUFBRyx5QkFBbUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUNyRSxPQUFPLEVBQUUsS0FBSzthQUNqQixDQUFDLENBQUM7UUFDUCxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ2xCLENBQUM7QUFFRCxhQUFhO0FBQ2IsY0FBYyxJQUFzQjtJQUNoQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFdEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNoQixNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUUsTUFBTTtRQUMxRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQVMsV0FBVztRQUMvRCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyx5QkFBVyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyx5QkFBVyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO0lBQzdGLENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLElBQUksQ0FBQztBQUNoQixDQUFDO0FBRUQ7O0dBRUc7QUFDVSxRQUFBLGlCQUFpQixHQUFHLGNBQU0sQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiJtb2R1bGVzL1N0b2NrQ29kZURvd25sb2FkZXIvZG93bmxvYWRlci9TSF9TWl9BX0NvZGVfZGZjZi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBleHBlY3QgPSByZXF1aXJlKCdleHBlY3QuanMnKTtcclxuaW1wb3J0ICogYXMgaWNvbnYgZnJvbSAnaWNvbnYtbGl0ZSc7XHJcbmltcG9ydCAqIGFzICQgZnJvbSAnY2hlZXJpbyc7XHJcblxyXG5pbXBvcnQgKiBhcyBIdHRwRG93bmxvYWRlciBmcm9tICcuLi8uLi8uLi90b29scy9IdHRwRG93bmxvYWRlcic7XHJcbmltcG9ydCB7IFN0b2NrTWFya2V0IH0gZnJvbSAnLi4vLi4vU3RvY2tNYXJrZXREb3dubG9hZGVyL1N0b2NrTWFya2V0JztcclxuaW1wb3J0IHsgRG93bmxvYWRlZERhdGEgfSBmcm9tICcuLi9Eb3dubG9hZGVkRGF0YSc7XHJcbmltcG9ydCB7IFJldHJ5MyB9IGZyb20gJy4uLy4uLy4uL3Rvb2xzL1JldHJ5JztcclxuXHJcbi8qKlxyXG4gKiDkuJzmlrnotKLlr4zvvIzogqHnpajliJfooajmlbDmja5cclxuICogXHJcbiAqIOaVsOaNruagvOW8j2BIVE1MYFxyXG4gKiDkuIvovb3lnLDlnYDvvJpodHRwOi8vcXVvdGUuZWFzdG1vbmV5LmNvbS9zdG9ja2xpc3QuaHRtbFxyXG4gKi9cclxuXHJcbi8v5LiL6L295Zyw5Z2AXHJcbmNvbnN0IGFkZHJlc3MgPSAnaHR0cDovL3F1b3RlLmVhc3Rtb25leS5jb20vc3RvY2tsaXN0Lmh0bWwnO1xyXG5cclxuLy/kuIvovb3mlbDmja5cclxuYXN5bmMgZnVuY3Rpb24gZG93bmxvYWQoKTogUHJvbWlzZTxEb3dubG9hZGVkRGF0YVtdPiB7XHJcbiAgICBjb25zdCBmaWxlID0gYXdhaXQgSHR0cERvd25sb2FkZXIuR2V0KGFkZHJlc3MpO1xyXG4gICAgY29uc3QgZGF0YSA9IGljb252LmRlY29kZShmaWxlLCAnZ2JrJyk7ICAgICAvL+i9rOeggVxyXG5cclxuICAgIGNvbnN0IHJlc3VsdDogRG93bmxvYWRlZERhdGFbXSA9IFtdO1xyXG5cclxuICAgICQoXCIjcXVvdGVzZWFyY2ggdWwgbGkgYVt0YXJnZXRdXCIsIGRhdGEpLmVhY2goZnVuY3Rpb24gKHRoaXM6IENoZWVyaW9FbGVtZW50KSB7XHJcbiAgICAgICAgY29uc3QgaHJlZiA9ICQodGhpcykuYXR0cignaHJlZicpIGFzIGFueTtcclxuICAgICAgICBjb25zdCB0ZXh0ID0gJCh0aGlzKS50ZXh0KCkgYXMgYW55O1xyXG5cclxuICAgICAgICBjb25zdCBjb2RlID0gdGV4dC5tYXRjaCgvXFxkezZ9LylbMF0udHJpbSgpO1xyXG5cclxuICAgICAgICBpZiAoL15bMzYwXS8udGVzdChjb2RlKSkgeyAgLy/lj6ropoFB6IKhXHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGNvZGUsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiB0ZXh0Lm1hdGNoKC8oLispKD86XFwoKS8pWzFdLnRyaW0oKSxcclxuICAgICAgICAgICAgICAgIG1hcmtldDogKFN0b2NrTWFya2V0IGFzIGFueSlbaHJlZi5tYXRjaCgvKFthLXpdezJ9KSg/OlxcZHs2fSkvKVsxXV0uaWQsXHJcbiAgICAgICAgICAgICAgICBpc0luZGV4OiBmYWxzZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTsgXHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuLy/mo4DmtYvkuIvovb3nmoTmlbDmja7mmK/lkKbmraPnoa5cclxuZnVuY3Rpb24gdGVzdChkYXRhOiBEb3dubG9hZGVkRGF0YVtdKSB7XHJcbiAgICBleHBlY3QoZGF0YS5sZW5ndGgpLnRvLmdyZWF0ZXJUaGFuKDApO1xyXG5cclxuICAgIGRhdGEuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICBleHBlY3QoL15bMzYwXVxcZHs1fSQvLnRlc3QoaXRlbS5jb2RlKSkudG8uYmUub2soKTsgIC8v6IKh56Wo5Luj56CBXHJcbiAgICAgICAgZXhwZWN0KGl0ZW0ubmFtZS5sZW5ndGgpLnRvLmdyZWF0ZXJUaGFuKDApOyAgICAgICAgIC8v56Gu5L+d5YWs5Y+45ZCN56ew5LiN5Li656m6XHJcbiAgICAgICAgZXhwZWN0KGl0ZW0ubWFya2V0ID09PSBTdG9ja01hcmtldC5zaC5pZCB8fCBpdGVtLm1hcmtldCA9PT0gU3RvY2tNYXJrZXQuc3ouaWQpLnRvLmJlLm9rKClcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBkYXRhO1xyXG59XHJcblxyXG4vKipcclxuICog5LiK5rW3QeiCoeS7o+eggeS4i+i9veWZqFxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IFNIX1NaX0FfQ29kZV9kZmNmID0gUmV0cnkzKGFzeW5jICgpID0+IHRlc3QoYXdhaXQgZG93bmxvYWQoKSkpOyJdfQ==
