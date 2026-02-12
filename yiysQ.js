import 'assets://js/lib/crypto-js.js';

// 假設環境中有提供 RSA 加解密工具，若無，此處邏輯需根據具體殼取代
const { HOST, PUBLIC_KEY, USER_AGENT } = {
    HOST: 'https://aleig4ah.yiys05.com',
    PUBLIC_KEY: "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAw4qpeOgv+MeXi57MVPqZF7SRmHR3FUelCTfrvI6vZ8kgTPpe1gMyP/8ZTvedTYjTDMqZBmn8o8Ym98yTx3zHaskPpmDR80e+rcRciPoYZcWNpwpFkrHp1l6Pjs9xHLXzf3U+N3a8QneY+jSMvgMbr00DC4XfvamfrkPMXQ+x9t3gNcP5YtuRhGFREBKP2q20gP783MCOBFwyxhZTIAsFiXrLkgZ97uaUAtqW6wtKR4HWpeaN+RLLxhBdnVjuMc9jaBl6sHMdSvTJgAajBTAd6LLA9cDmbGTxH7RGp//iZU86kFhxGl5yssZvBcx/K95ADeTmLKCsabexZVZ0Fu3dDQIDAQAB\n-----END PUBLIC KEY-----",
    USER_AGENT: 'Android/OkHttp'
};

let token = '';
let appId = '';

const sha256 = s => CryptoJS.SHA256(s).toString(CryptoJS.enc.Hex);

const getAppId = () => {
    let id = local.get('yiys_zNiOFyj0r4ux');
    if (!id) {
        id = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        local.set('yiys_zNiOFyj0r4ux', id);
    }
    appId = id;
    return id;
};

// 模擬 Python 中的 rsa_public_decrypt
// 注意：TVBox 環境通常不直接支援 RSA，這部分通常需要依賴內置的 rsa 函數或特定庫
function rsaDecrypt(ciphertext) {
    try {
        // 這裡假設環境支持 RSA 解密，或通過外部接口獲取
        // 如果是標準 JS 环境，需引入 jsrsasign
        return rsa(ciphertext, PUBLIC_KEY); 
    } catch (e) {
        return "";
    }
}

async function refreshToken() {
    const ts = Math.floor(Date.now() / 1000).toString();
    const payload = { 'appID': appId, 'timestamp': ts };
    const headers = {
        'User-Agent': USER_AGENT,
        'APP-ID': appId,
        'X-Auth-Flow': '1',
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    
    try {
        const res = await req(`${HOST}/vod-app/index/getGenerateKey`, {
            method: 'post',
            data: payload,
            headers: headers
        });
        const json = JSON.parse(res.content);
        if (json.data) {
            token = rsaDecrypt(json.data);
            return true;
        }
    } catch (e) {}
    return false;
}

function getSignedHeaders(params) {
    const headers = {
        'User-Agent': USER_AGENT,
        'APP-ID': appId,
        'Authorization': ''
    };
    if (params) {
        const sortedKeys = Object.keys(params).sort();
        const queryStr = sortedKeys.map(k => `${k}=${params[k]}`).join('&');
        const signStr = `${queryStr}&token=${token}`;
        headers['X-HASH-Data'] = sha256(signStr);
    }
    return headers;
}

async function smartRequest(url, method = 'get', data = null) {
    let headers = getSignedHeaders(data);
    let res = await req(url, {
        method: method,
        data: data,
        headers: headers
    });

    if (res.status === 400 || !res.content) {
        if (await refreshToken()) {
            headers = getSignedHeaders(data);
            res = await req(url, {
                method: method,
                data: data,
                headers: headers
            });
        }
    }
    return JSON.parse(res.content);
}

// --- 接口實現 ---

async function init(extend) {
    if (extend && extend.startsWith('http')) {
        // 自定義 HOST 邏輯
    }
    getAppId();
    await refreshToken();
}

async function home(filter) {
    const ts = Math.floor(Date.now() / 1000).toString();
    const res = await smartRequest(`${HOST}/vod-app/type/list`, 'get', { timestamp: ts });
    
    const classes = [];
    const filters = {};

    res.data.forEach(i => {
        const tid = i.typeId.toString();
        classes.push({ type_id: tid, type_name: i.typeName });
        
        if (i.type_extend_obj) {
            const ext = i.type_extend_obj;
            const typeFilters = [];
            const build = (key, name, str, isSort = false) => {
                let values = [{ n: '全部', v: '' }];
                if (isSort) {
                    values = [{ n: '新上线', v: 'time' }, { n: '热播榜', v: 'hits_day' }, { n: '好评榜', v: 'score' }];
                } else if (str) {
                    str.split(',').forEach(s => values.push({ n: s.trim(), v: s.trim() }));
                }
                return { key, name, value: values, init: isSort ? 'time' : '' };
            };

            if (ext.class) typeFilters.push(build('class', '类型', ext.class));
            if (ext.area) typeFilters.push(build('area', '地区', ext.area));
            if (ext.lang) typeFilters.push(build('lang', '语言', ext.lang));
            if (ext.year) typeFilters.push(build('year', '年份', ext.year));
            typeFilters.push(build('sort', '排序', '', true));
            filters[tid] = typeFilters;
        }
    });

    return JSON.stringify({ class: classes, filters });
}

async function homeVod() {
    const ts = Math.floor(Date.now() / 1000).toString();
    const res = await smartRequest(`${HOST}/vod-app/rank/hotHits`, 'get', { timestamp: ts });
    const list = [];
    res.data.forEach(i => {
        if (i.vodBeans) {
            i.vodBeans.forEach(v => {
                list.push({
                    vod_id: v.id,
                    vod_name: v.name,
                    vod_pic: v.vodPic,
                    vod_remarks: v.vodRemarks || '',
                    vod_content: v.vodBlurb || ''
                });
            });
        }
    });
    return JSON.stringify({ list });
}

async function category(tid, pg, filter, extend) {
    const payload = {
        tid: tid,
        page: pg.toString(),
        limit: '12',
        timestamp: Math.floor(Date.now() / 1000).toString(),
        classType: extend.class || '',
        area: extend.area || '',
        lang: extend.lang || '',
        year: extend.year || '',
        by: extend.sort || 'time'
    };
    // 移除空值
    Object.keys(payload).forEach(k => !payload[k] && delete payload[k]);

    const res = await smartRequest(`${HOST}/vod-app/vod/list`, 'post', payload);
    const list = res.data.data.map(v => ({
        vod_id: v.id,
        vod_name: v.name,
        vod_pic: v.vodPic,
        vod_remarks: v.vodRemarks || ''
    }));
    return JSON.stringify({
        list: list,
        page: parseInt(pg),
        pagecount: res.data.totalPageCount || 1
    });
}

async function detail(id) {
    const payload = {
        tid: '',
        timestamp: Math.floor(Date.now() / 1000).toString(),
        vodId: id.toString()
    };
    const res = await smartRequest(`${HOST}/vod-app/vod/info`, 'post', payload);
    const data = res.data;
    
    const playFrom = [];
    const playUrl = [];

    if (data.vodSources) {
        data.vodSources.sort((a, b) => (a.sort || 0) - (b.sort || 0));
        data.vodSources.forEach(src => {
            playFrom.push(src.sourceName);
            const urls = src.vodPlayList.urls.map(u => `${u.name}$${src.sourceCode}@${u.url}`);
            playUrl.push(urls.join('#'));
        });
    }

    const vod = {
        vod_id: data.vodId,
        vod_name: data.vodName,
        vod_pic: data.vodPic,
        vod_remarks: data.vodRemark || '',
        vod_year: data.vodYear || '',
        vod_area: data.vodArea || '',
        vod_actor: data.vodActor || '',
        vod_content: data.vodContent || '',
        vod_play_from: playFrom.join('$$$'),
        vod_play_url: playUrl.join('$$$'),
        type_name: data.vodClass || ''
    };
    return JSON.stringify({ list: [vod] });
}

async function play(flag, id, flags) {
    const parts = id.split('@');
    const sourceCode = parts[0];
    const rawUrl = parts[1];
    
    const payload = {
        sourceCode: sourceCode,
        timestamp: Math.floor(Date.now() / 1000).toString(),
        urlEncode: rawUrl
    };

    let finalUrl = rawUrl;
    try {
        const res = await smartRequest(`${HOST}/vod-app/vod/playUrl`, 'post', payload);
        finalUrl = res.data.url || rawUrl;
    } catch (e) {}

    const jx = /(iqiyi|qq|youku|mgtv|bilibili)/.test(finalUrl) ? 1 : 0;

    return JSON.stringify({
        parse: 0,
        jx: jx,
        url: finalUrl,
        header: { 'User-Agent': USER_AGENT }
    });
}

async function search(wd, quick, pg) {
    const payload = {
        key: wd,
        limit: '20',
        page: pg ? pg.toString() : '1',
        timestamp: Math.floor(Date.now() / 1000).toString()
    };
    const res = await smartRequest(`${HOST}/vod-app/vod/segSearch`, 'post', payload);
    const list = res.data.data.map(v => ({
        vod_id: v.id,
        vod_name: v.name,
        vod_pic: v.vodPic,
        vod_remarks: v.vodRemarks || ''
    }));
    return JSON.stringify({ list, page: parseInt(pg || '1') });
}

export function __jsEvalReturn() {
    return { init, home, homeVod, category, detail, play, proxy: null, search };
}
