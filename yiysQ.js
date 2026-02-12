import 'assets://js/lib/crypto-js.js';

var resType = 'json';
var HOST = 'https://aleig4ah.yiys05.com';

/**
 * 签名函数：使用 crypto-js 进行 SHA256
 */
function getSign(params, token) {
    let keys = Object.keys(params).sort();
    let queryStr = keys.map(k => k + "=" + params[k]).join("&");
    let signStr = queryStr + "&token=" + token;
    return CryptoJS.SHA256(signStr).toString(CryptoJS.enc.Hex);
}

/**
 * RSA 公钥解密 (利用 DRPY 系统内置函数)
 */
function rsaDecrypt(ciphertext) {
    const pubKey = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAw4qpeOgv+MeXi57MVPqZF7SRmHR3FUelCTfrvI6vZ8kgTPpe1gMyP/8ZTvedTYjTDMqZBmn8o8Ym98yTx3zHaskPpmDR80e+rcRciPoYZcWNpwpFkrHp1l6Pjs9xHLXzf3U+N3a8QneY+jSMvgMbr00DC4XfvamfrkPMXQ+x9t3gNcP5YtuRhGFREBKP2q20gP783MCOBFwyxhZTIAsFiXrLkgZ97uaUAtqW6wtKR4HWpeaN+RLLxhBdnVjuMc9jaBl6sHMdSvTJgAajBTAd6LLA9cDmbGTxH7RGp//iZU86kFhxGl5yssZvBcx/K95ADeTmLKCsabexZVZ0Fu3dDQIDAQAB";
    return rsa(ciphertext, pubKey, false, "RSA/ECB/PKCS1Padding");
}

var spider = {
    token: '',
    appId: '',

    async init(ext) {
        this.host = ext || HOST;
        this.appId = getItem('yiys_app_id', '');
        if (!this.appId) {
            this.appId = Math.random().toString(16).slice(2, 18);
            setItem('yiys_app_id', this.appId);
        }
        await this.refreshToken();
    },

    async refreshToken() {
        let ts = Math.floor(new Date().getTime() / 1000).toString();
        let payload = { 'appID': this.appId, 'timestamp': ts };
        let headers = {
            'User-Agent': 'Android/OkHttp',
            'APP-ID': this.appId,
            'X-Auth-Flow': '1'
        };
        try {
            let res = await post(this.host + '/vod-app/index/getGenerateKey', { body: payload, headers: headers });
            let json = JSON.parse(res);
            if (json.data) {
                this.token = rsaDecrypt(json.data);
                return true;
            }
        } catch (e) {}
        return false;
    },

    async home(filter) {
        let ts = Math.floor(new Date().getTime() / 1000).toString();
        let params = { 'timestamp': ts };
        let headers = {
            'User-Agent': 'Android/OkHttp',
            'APP-ID': this.appId,
            'X-HASH-Data': getSign(params, this.token)
        };
        
        let res = await request(this.host + '/vod-app/type/list?timestamp=' + ts, { headers: headers });
        let json = JSON.parse(res);
        let classes = [], filters = {};

        json.data.forEach(it => {
            let tid = it.typeId.toString();
            classes.push({ type_id: tid, type_name: it.typeName });

            if (it.type_extend_obj) {
                let ext = it.type_extend_obj;
                let filterArr = [];
                if (ext.class) filterArr.push({ key: "class", name: "类型", value: [{ n: "全部", v: "" }].concat(ext.class.split(',').map(v => ({ n: v, v: v }))) });
                if (ext.area) filterArr.push({ key: "area", name: "地区", value: [{ n: "全部", v: "" }].concat(ext.area.split(',').map(v => ({ n: v, v: v }))) });
                
                if (ext.year) {
                    let years = ext.year;
                    if (!years.includes('2026')) years = '2026,2025,' + years.replace('2025,', '');
                    filterArr.push({ key: "year", name: "年份", value: [{ n: "全部", v: "" }].concat(years.split(',').map(v => ({ n: v, v: v }))) });
                }
                filterArr.push({ key: "sort", name: "排序", value: [{ n: "新上线", v: "time" }, { n: "热播榜", v: "hits_day" }, { n: "好评榜", v: "score" }] });
                filters[tid] = filterArr;
            }
        });
        return { class: classes, filters: filters };
    },

    async category(tid, pg, filter, extend) {
        let ts = Math.floor(new Date().getTime() / 1000).toString();
        let body = {
            'tid': tid, 'page': pg.toString(), 'limit': '12', 'timestamp': ts,
            'by': extend.sort || 'time'
        };
        if (extend.class) body.classType = extend.class;
        if (extend.area) body.area = extend.area;
        if (extend.year) body.year = extend.year;

        let headers = {
            'User-Agent': 'Android/OkHttp',
            'APP-ID': this.appId,
            'X-HASH-Data': getSign(body, this.token)
        };
        let res = await post(this.host + '/vod-app/vod/list', { body: body, headers: headers });
        let json = JSON.parse(res);
        return {
            list: json.data.data.map(v => ({ vod_id: v.id, vod_name: v.name, vod_pic: v.vodPic, vod_remarks: v.vodRemarks })),
            page: pg,
            pagecount: json.data.totalPageCount
        };
    },

    async detail(id) {
        let ts = Math.floor(new Date().getTime() / 1000).toString();
        let body = { 'tid': '', 'timestamp': ts, 'vodId': id.toString() };
        let headers = { 'User-Agent': 'Android/OkHttp', 'APP-ID': this.appId, 'X-HASH-Data': getSign(body, this.token) };
        
        let res = await post(this.host + '/vod-app/vod/info', { body: body, headers: headers });
        let it = JSON.parse(res).data;

        let from = [], urls = [];
        it.vodSources.sort((a, b) => (a.sort || 0) - (b.sort || 0)).forEach(src => {
            from.push(src.sourceName.replace(/（视频内广告勿信）/g, ''));
            let subUrls = src.vodPlayList.urls.map(u => u.name + '$' + src.sourceCode + '@' + u.url);
            urls.push(subUrls.join('#'));
        });

        return {
            list: [{
                vod_id: it.vodId, vod_name: it.name, vod_pic: it.vodPic,
                vod_remarks: it.vodRemark, vod_year: it.vodYear, vod_area: it.vodArea,
                vod_actor: it.vodActor, vod_content: it.vodContent,
                vod_play_from: from.join('$$$'), vod_play_url: urls.join('$$$')
            }]
        };
    },

    async search(wd, quick, pg) {
        let ts = Math.floor(new Date().getTime() / 1000).toString();
        let body = { 'key': wd, 'limit': '20', 'page': pg.toString(), 'timestamp': ts };
        let headers = { 'User-Agent': 'Android/OkHttp', 'APP-ID': this.appId, 'X-HASH-Data': getSign(body, this.token) };
        let res = await post(this.host + '/vod-app/vod/segSearch', { body: body, headers: headers });
        let json = JSON.parse(res);
        return {
            list: json.data.data.map(v => ({ vod_id: v.id, vod_name: v.name, vod_pic: v.vodPic, vod_remarks: v.vodRemarks }))
        };
    },

    async play(flag, id, flags) {
        let ts = Math.floor(new Date().getTime() / 1000).toString();
        let parts = id.split('@'); 
        let body = { 'sourceCode': parts[0], 'timestamp': ts, 'urlEncode': parts[1] };
        let headers = { 'User-Agent': 'Android/OkHttp', 'APP-ID': this.appId, 'X-HASH-Data': getSign(body, this.token) };
        
        let res = await post(this.host + '/vod-app/vod/playUrl', { body: body, headers: headers });
        let playUrl = JSON.parse(res).data.url || parts[1];

        return {
            parse: 0,
            url: playUrl,
            header: { 'User-Agent': 'Android/OkHttp' }
        };
    }
};

/**
 * 导出 DRPY 接口
 */
export function __jsEvalReturn() {
    return spider;
}
