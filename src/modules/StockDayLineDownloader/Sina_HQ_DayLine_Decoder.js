/**
 * 这段代码是我在"http://finance.sina.com.cn/sinafinancesdk/js/sf_sdk.js"下找到的。
 * 按照新浪那种组织包的方式，改代码位于"utils.util"包下的"this.xh5_S_KLC_D"方法。
 * 
 * 说说我是怎么找到的：
 *   打开F12控制台，切换到Network下开始抓包，发现有一条数据("http://finance.sina.com.cn/realstock/company/sz300359/hisdata/klc_kl.js?d=2018_1_10")
 *   非常可疑，数据大小较大，内容全部是乱码。其中定义了一个变量来保存数据"var KLC_KL_sz300359='...';"。然后开始全文搜索所有新浪财经传递过来的文件。
 *   在控制台的右上角，打开"More tools"下的"Search"，然后搜索"KLC_KL"，然后发现"http://finance.sina.com.cn/sinafinancesdk/js/sf_sdk.js"这个js文件
 *   中用到了"KLC_KL"，然后就是读代码。
 * 
 * 心得体会：
 *   一般遇到加密的数据，解密很可能会用到位运算符('~','&','|','^','<<','>>','>>>'),所以当不太清楚时可以先从哪些地方使用了位运算符开始找。
 */

/**
 * 新浪财经日线行情数据解密器
 * @param {string} t 加密字符串
 */
module.exports = function Sina_HQ_DayLine_Decoder(t) {
    var e, i, n, r, a, o, s, l = 864e5,
        u = 7657,
        c = [],
        h = [],
        d = ~(3 << 30),
        f = 1 << 30,
        p = [0, 3, 5, 6, 9, 10, 12, 15, 17, 18, 20, 23, 24, 27, 29, 30],
        m = Math,
        g = function () {
            var l, u;
            for (l = 0; 64 > l; l++) h[l] = m.pow(2, l),
                26 > l && (c[l] = v(l + 65), c[l + 26] = v(l + 97), 10 > l && (c[l + 52] = v(l + 48)));
            for (c.push("+", "/"), c = c.join(""), i = t.split(""), n = i.length, l = 0; n > l; l++) i[l] = c.indexOf(i[l]);
            return r = {},
                e = o = 0,
                a = {},
                u = w([12, 6]),
                s = 63 ^ u[1],
                {
                    _1479: T,
                    _136: S,
                    _200: _,
                    _139: k,
                    _197: C
                }["_" + u[0]] ||
                function () {
                    return []
                }
        },
        v = String.fromCharCode,
        b = function (t) {
            return t === {}._
        },
        y = function () {
            var t, e;
            for (t = N(), e = 1; ;) {
                if (!N()) return e * (2 * t - 1);
                e++
            }
        },
        N = function () {
            var t;
            return e >= n ? 0 : (t = i[e] & 1 << o, o++ , o >= 6 && (o -= 6, e++), !!t)
        },
        w = function (t, r, a) {
            var s, l, u, c, d;
            for (l = [], u = 0, r || (r = []), a || (a = []), s = 0; s < t.length; s++) if (c = t[s], u = 0, c) {
                if (e >= n) return l;
                if (t[s] <= 0) u = 0;
                else if (t[s] <= 30) {
                    for (; d = 6 - o, d = c > d ? d : c, u |= (i[e] >> o & (1 << d) - 1) << t[s] - c, o += d, o >= 6 && (o -= 6, e++), c -= d, !(0 >= c););
                    r[s] && u >= h[t[s] - 1] && (u -= h[t[s]])
                } else u = w([30, t[s] - 30], [0, r[s]]),
                    a[s] || (u = u[0] + u[1] * h[30]);
                l[s] = u
            } else l[s] = 0;
            return l
        },
        x = function (t) {
            var e, i, n, a;
            for (t > 1 && (e = 0), e = 0; t > e; e++) r.d++ ,
                n = r.d % 7,
                (3 == n || 4 == n) && (r.d += 5 - n);
            return i = new Date,
                a = 60 * i.getTimezoneOffset() * 1e3,
                i.setTime((u + r.d) * l + a),
                i.setHours(i.getHours() + 8),
                i
        },
        _ = function () {
            var t, i, a, o, l;
            if (s >= 1) return [];
            for (r.d = w([18], [1])[0] - 1, a = w([3, 3, 30, 6]), r.p = a[0], r.ld = a[1], r.cd = a[2], r.c = a[3], r.m = m.pow(10, r.p), r.pc = r.cd / r.m, i = [], t = 0; o = {
                d: 1
            },
                N() && (a = w([3])[0], 0 == a ? o.d = w([6])[0] : 1 == a ? (r.d = w([18])[0], o.d = 0) : o.d = a), l = {
                    date: x(o.d)
                },
                N() && (r.ld += y()), a = w([3 * r.ld], [1]), r.cd += a[0], l.close = r.cd / r.m, i.push(l), !(e >= n) && (e != n - 1 || 63 & (r.c ^ t + 1)); t++);
            return i[0].prevclose = r.pc,
                i
        },
        S = function () {
            var t, i, a, o, l, u, c, h, d, f, p;
            if (s >= 2) return [];
            for (c = [], d = {
                v: "volume",
                p: "price",
                a: "avg_price"
            },
                r.d = w([18], [1])[0] - 1, h = {
                    date: x(1)
                },
                a = w(1 > s ? [3, 3, 4, 1, 1, 1, 5] : [4, 4, 4, 1, 1, 1, 3]), t = 0; 7 > t; t++) r[["la", "lp", "lv", "tv", "rv", "zv", "pp"][t]] = a[t];
            for (r.m = m.pow(10, r.pp), s >= 1 ? (a = w([3, 3]), r.c = a[0], a = a[1]) : (a = 5, r.c = 2), r.pc = w([6 * a])[0], h.pc = r.pc / r.m, r.cp = r.pc, r.da = 0, r.sa = r.sv = 0, t = 0; !(e >= n) && (e != n - 1 || 7 & (r.c ^ t)); t++) {
                for (l = {},
                    o = {},
                    f = r.tv ? N() : 1, i = 0; 3 > i; i++) if (p = ["v", "p", "a"][i], (f ? N() : 0) && (a = y(), r["l" + p] += a), u = "v" == p && r.rv ? N() : 1, a = w([3 * r["l" + p] + ("v" == p ? 7 * u : 0)], [!!i])[0] * (u ? 1 : 100), o[p] = a, "v" == p) {
                        if (!(l[d[p]] = a) && 241 > t && (r.zv ? !N() : 1)) {
                            o.p = 0;
                            break
                        }
                    } else "a" == p && (r.da = (1 > s ? 0 : r.da) + o.a);
                r.sv += o.v,
                    l[d.p] = (r.cp += o.p) / r.m,
                    r.sa += o.v * r.cp,
                    l[d.a] = b(o.a) ? t ? c[t - 1][d.a] : l[d.p] : r.sv ? ((m.floor((r.sa * (2e3 / r.m) + r.sv) / r.sv) >> 1) + r.da) / 1e3 : l[d.p] + r.da / 1e3,
                    c.push(l)
            }
            return c[0].date = h.date,
                c[0].prevclose = h.pc,
                c
        },
        T = function () {
            var t, e, i, n, a, o, l;
            if (s >= 1) return [];
            for (r.lv = 0, r.ld = 0, r.cd = 0, r.cv = [0, 0], r.p = w([6])[0], r.d = w([18], [1])[0] - 1, r.m = m.pow(10, r.p), a = w([3, 3]), r.md = a[0], r.mv = a[1], t = []; a = w([6]), a.length;) {
                if (i = {
                    c: a[0]
                },
                    n = {},
                    i.d = 1, 32 & i.c) for (; ;) {
                        if (a = w([6])[0], 63 == (16 | a)) {
                            l = 16 & a ? "x" : "u",
                                a = w([3, 3]),
                                i[l + "_d"] = a[0] + r.md,
                                i[l + "_v"] = a[1] + r.mv;
                            break
                        }
                        if (32 & a) {
                            o = 8 & a ? "d" : "v",
                                l = 16 & a ? "x" : "u",
                                i[l + "_" + o] = (7 & a) + r["m" + o];
                            break
                        }
                        if (o = 15 & a, 0 == o ? i.d = w([6])[0] : 1 == o ? (r.d = o = w([18])[0], i.d = 0) : i.d = o, !(16 & a)) break
                    }
                n.date = x(i.d);
                for (o in {
                    v: 0,
                    d: 0
                }) b(i["x_" + o]) || (r["l" + o] = i["x_" + o]),
                    b(i["u_" + o]) && (i["u_" + o] = r["l" + o]);
                for (i.l_l = [i.u_d, i.u_d, i.u_d, i.u_d, i.u_v], l = p[15 & i.c], 1 & i.u_v && (l = 31 - l), 16 & i.c && (i.l_l[4] += 2), e = 0; 5 > e; e++) l & 1 << 4 - e && i.l_l[e]++ ,
                    i.l_l[e] *= 3;
                i.d_v = w(i.l_l, [1, 0, 0, 1, 1], [0, 0, 0, 0, 1]),
                    o = r.cd + i.d_v[0],
                    n.open = o / r.m,
                    n.high = (o + i.d_v[1]) / r.m,
                    n.low = (o - i.d_v[2]) / r.m,
                    n.close = (o + i.d_v[3]) / r.m,
                    a = i.d_v[4],
                    "number" == typeof a && (a = [a, a >= 0 ? 0 : -1]),
                    r.cd = o + i.d_v[3],
                    l = r.cv[0] + a[0],
                    r.cv = [l & d, r.cv[1] + a[1] + !!((r.cv[0] & d) + (a[0] & d) & f)],
                    n.volume = (r.cv[0] & f - 1) + r.cv[1] * f,
                    t.push(n)
            }
            return t
        },
        k = function () {
            var t, e, i, n;
            if (s > 1) return [];
            for (r.l = 0, n = -1, r.d = w([18])[0] - 1, i = w([18])[0]; r.d < i;) e = x(1),
                0 >= n ? (N() && (r.l += y()), n = w([3 * r.l], [0])[0] + 1, t || (t = [e], n--)) : t.push(e),
                n--;
            return t
        },
        C = function () {
            var t, i, a, o;
            if (s >= 1) return [];
            for (r.f = w([6])[0], r.c = w([6])[0], a = [], r.dv = [], r.dl = [], t = 0; t < r.f; t++) r.dv[t] = 0,
                r.dl[t] = 0;
            for (t = 0; !(e >= n) && (e != n - 1 || 7 & (r.c ^ t)); t++) {
                for (o = [], i = 0; i < r.f; i++) N() && (r.dl[i] += y()),
                    r.dv[i] += w([3 * r.dl[i]], [1])[0],
                    o[i] = r.dv[i];
                a.push(o)
            }
            return a
        };
    return g()()
};