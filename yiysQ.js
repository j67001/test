var resType = 'json';
var HOST = 'https://aleig4ah.yiys05.com';

/**
 * 封装 RSA 公钥解密逻辑 (方案一)
 */
function rsaDecrypt(ciphertext) {
    const pubKey = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAw4qpeOgv+MeXi57MVPqZF7SRmHR3FUelCTfrvI6vZ8kgTPpe1gMyP/8ZTvedTYjTDMqZBmn8o8Ym98yTx3zHaskPpmDR80e+rcRciPoYZcWNpwpFkrHp1l6Pjs9xHLXzf3U+N3a8QneY+jSMvgMbr00DC4XfvamfrkPMXQ+x9t3gNcP5YtuRhGFREBKP2q20gP783MCOBFwyxhZTIAsFiXrLkgZ97uaUAtqW6wtKR4HWpeaN+RLLxhBdnVjuMc9jaBl6sHMdSvTJgAajBTAd6LLA9cDmbGTxH7RGp//iZU86kFhxGl5yssZvBcx/K95ADeTmLKCsabexZVZ0Fu3dDQIDAQAB";
    try {
        // 调用 DRPY 内置 RSA 接口，解密模式通常为 PKCS1
        return rsa(ciphertext, pubKey, false, "RSA/ECB/PKCS1Padding");
    } catch (e) {
        log("RSA解密失败: " + e.message);
        return "";
    }
}

/**
 * 获取签名 Headers
 */
function getHeaders(params, token, appId) {
    let headers = {
        'User-Agent': 'Android/OkHttp',
        'APP-ID': appId,
        'Connection': 'Keep-Alive'
    };
    if (token) {
        let keys = Object.keys(params).sort();
        let queryStr = keys.map(k => k + "=" + params[k]).join("&");
        let signStr = queryStr + "&token=" + token;
        headers['X-HASH-Data'] = sha256(signStr);
    } else {
        headers['X-Auth-Flow'] = '1';
    }
    return headers;
}

var spider = {
    // 全局变量存储
    token: '',
    appId: '',

    init: function (ext) {
        this.host = ext || HOST;
        // 获取或生成设备 ID
        this.appId = getItem('yiys_app_id', '');
        if (!this.appId) {
            this.appId = Math.random().toString(16).slice(2, 18);
            setItem('yiys_app_id', this.appId);
        }
        this.refreshToken();
    },

    refreshToken: function () {
        let ts = Math.floor(new Date().getTime() / 1000).toString();
        let payload = { 'appID': this.appId, 'timestamp': ts };
        let headers = getHeaders(payload, '', this.appId);
        
        try {
            let res = post(this.host + '/vod-app/index/getGenerateKey', { body: payload, headers: headers });
            let json = JSON.parse(res);
            if (json.data) {
                this.token = rsaDecrypt(json.data);
                return true;
            }
        } catch (e) {
            log("刷新Token异常: " + e.message);
        }
        return false;
    },

    home: function (filter) {
        let ts = Math.floor(new Date().getTime() / 1000).toString();
        let params = { 'timestamp': ts };
        let headers = getHeaders(params, this.token, this.appId);
        
        let res = request(this.host + '/vod-app/type/list?timestamp=' + ts, { headers: headers });
        let json = JSON.parse(res);
        
        let classes = [];
        let filters = {};

        json.data.forEach(it => {
            let tid = it.typeId.toString();
            classes.push({ type_id: tid, type_name: it.typeName });

            // 处理筛选逻辑
            if (it.type_extend_obj) {
                let ext = it.type_extend_obj;
                let filterArr = [];

                // 1. 类型筛选
                if (ext.class) {
                    filterArr.push({
                        key: "class", name: "类型",
                        value: [{ n: "全部", v: "" }].concat(ext.class.split(',').map(v => ({ n: v, v: v })))
                    });
                }
                // 2. 地区筛选
                if (ext.area) {
                    filterArr.push({
                        key: "area", name: "地区",
                        value: [{ n: "全部", v: "" }].concat(ext.area.split(',').map(v => ({ n: v, v: v })))
                    });
                }
                // 3. 年份筛选 (包含您要求的 2026 补齐逻辑)
                if (ext.year) {
                    let years = ext.year;
                    if (!years.includes('2026') && years.includes('2025')) {
                        years = '2026,2025' + years.split('2025')[1];
                    }
                    filterArr.push({
                        key: "year", name: "年份",
                        value: [{ n: "全部", v: "" }].concat(years.split(',').map(v => ({ n: v, v: v })))
                    });
                }
                // 4. 排序筛选 (固定项)
                filterArr.push({
                    key: "sort", name: "排序",
                    value: [
                        { n: "新上线", v: "time" },
                        { n: "热播榜", v: "hits_day" },
                        { n: "好评榜", v: "score" }
                    ]
                });

                filters[tid] = filterArr;
            }
        });

        return JSON.stringify({ class: classes, filters: filters });
    },

    homeVod: function () {
        let ts = Math.floor(new Date().getTime() / 1000).toString();
        let headers = getHeaders({ 'timestamp': ts }, this.token, this.appId);
        let res = JSON.parse(request(this.host + '/vod-app/rank/hotHits?timestamp=' + ts, { headers: headers }));
        
        let list = [];
        res.data.forEach(box => {
            if (box.vodBeans) {
                box.vodBeans.forEach(v => {
                    list.push({
                        vod_id: v.id,
                        vod_name: v.name,
                        vod_pic: v.vodPic,
                        vod_remarks: v.vodRemarks || v.vodYear
                    });
                });
            }
        });
        return JSON.stringify({ list: list });
    },

    category: function (tid, pg, filter, extend) {
        let ts = Math.floor(new Date().getTime() / 1000).toString();
        let body = {
            'tid': tid,
            'page': pg.toString(),
            'limit': '12',
            'timestamp': ts,
            'by': extend.sort || 'time'
        };
        if (extend.class) body.classType = extend.class;
        if (extend.area) body.area = extend.area;
        if (extend.year) body.year = extend.year;

        let headers = getHeaders(body, this.token, this.appId);
        let res = JSON.parse(post(this.host + '/vod-app/vod/list', { body: body, headers: headers }));
        
        let list = res.data.data.map(v => ({
            vod_id: v.id,
            vod_name: v.name,
            vod_pic: v.vodPic,
            vod_remarks: v.vodRemarks
        }));

        return JSON.stringify({
            list: list,
            page: pg,
            pagecount: res.data.totalPageCount
        });
    },

    detail: function (id) {
        let ts = Math.floor(new Date().getTime() / 1000).toString();
        let body = { 'tid': '', 'timestamp': ts, 'vodId': id.toString() };
        let headers = getHeaders(body, this.token, this.appId);
        
        let res = JSON.parse(post(this.host + '/vod-app/vod/info', { body: body, headers: headers }));
        let it = res.data;

        let from = [];
        let urls = [];

        it.vodSources.sort((a, b) => (a.sort || 0) - (b.sort || 0)).forEach(src => {
            from.push(src.sourceName.replace(/（视频内广告勿信）/g, ''));
            let subUrls = src.vodPlayList.urls.map(u => u.name + '$' + src.sourceCode + '@' + u.url);
            urls.push(subUrls.join('#'));
        });
