import 'assets://js/lib/crypto-js.js';

const { HOST, PUBLIC_KEY_N, PUBLIC_KEY_E, USER_AGENT } = {
    HOST: 'https://aleig4ah.yiys05.com',
    PUBLIC_KEY_N: 'c38aa978e82ff8c7978b9ecc35fa9917b4919874771547a50937ebb88eaf67c9204cfa5ed603323fff194ef79d4d88d30ccca99669fca3c626f7cc93c77cc76ac90fa660d1f347beadc45c88fa1865c58da70a4592b1e9d65e8f8ecf711cb5f37f753e3776bc427798fa348cbe031baf4d030b85dfbda99fae43cc5d0fb1f6dde035c3f962db9184615110128fdaadb480fefcdc02041c32c61653200b05897acb92067deee69402da96eb0b4a4781d6a5e68df912cbc6105d9d58ee31cf6368197ab0731d4af4c98006a305301de8b2c0f5c0e66c64f11fb446a7ffa2654f3a9058711a5e72b2c66f05cc63b8c73d8da065eac1cc752bd326001a8c14c077a2cb03',
    PUBLIC_KEY_E: '10001', 
    USER_AGENT: 'Android/OkHttp'
};

let token = '';
let appId = '';

// --- RSA 核心解密工具 ---
function powerMod(base, exp, mod) {
    let res = 1n, b = BigInt(base) % BigInt(mod), e = BigInt(exp), m = BigInt(mod);
    while (e > 0n) {
        if (e % 2n === 1n) res = (res * b) % m;
        b = (b * b) % m;
        e = e / 2n;
    }
    return res;
}

function rsaPublicDecrypt(base64Str) {
    try {
        const c = BigInt('0x' + CryptoJS.enc.Base64.parse(base64Str).toString(CryptoJS.enc.Hex));
        const n = BigInt('0x' + PUBLIC_KEY_N), e = BigInt('0x' + PUBLIC_KEY_E);
        let mHex = powerMod(c, e, n).toString(16);
        while (mHex.length < 512) mHex = '0' + mHex; // 補足位數
        const hex = mHex.toLowerCase();
        // 尋找 PKCS1 分隔符 00 (通常在 00 02 ... 之後)
        const idx = hex.indexOf('00', 4); 
        return CryptoJS.enc.Hex.parse(hex.substring(idx + 2)).toString(CryptoJS.enc.Utf8);
    } catch (e) { return ""; }
}

// --- 通用請求封裝 ---
async function refreshToken() {
    appId = appId || local.get('yiys_zNiOFyj0r4ux') || Array.from({length:16},()=>Math.floor(Math.random()*16).toString(16)).join('');
    local.set('yiys_zNiOFyj0r4ux', appId);
    const ts = Math.floor(Date.now() / 1000).toString();
    try {
        const res = await req(`${HOST}/vod-app/index/getGenerateKey`, {
            method: 'post', data: { 'appID': appId, 'timestamp': ts },
            headers: { 'User-Agent': USER_AGENT, 'APP-ID': appId, 'X-Auth-Flow': '1' }
        });
        const json = JSON.parse(res.content);
        if (json.data) {
            token = rsaPublicDecrypt(json.data);
            return !!token;
        }
    } catch (e) {}
    return false;
}

async function smartRequest(url, method = 'get', data = null) {
    const getHeaders = (params) => {
        const h = { 'User-Agent': USER_AGENT, 'APP-ID': appId, 'Authorization': '' };
        if (params) {
            const query = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
            h['X-HASH-Data'] = CryptoJS.SHA256(query + '&token=' + token).toString();
        }
        return h;
    };
    let res = await req(url, { method: method, data: data, headers: getHeaders(data) });
    if (res.status === 400 || !res.content) {
        if (await refreshToken()) res = await req(url, { method: method, data: data, headers: getHeaders(data) });
    }
    return JSON.parse(res.content || '{}');
}

// --- TVBox 接口實現 ---

async function init() {
    await refreshToken();
    return true;
}

async function home() {
    const res = await smartRequest(`${HOST}/vod-app/type/list`, 'get', { timestamp: Math.floor(Date.now()/1000) });
    const classes = [], filters = {};

    const buildFilter = (key, name, valuesStr, isSort = false) => {
        let valArr = isSort ? [] : [{ n: '全部', v: '' }];
        if (isSort) {
            valArr.push({ n: '新上线', v: 'time' }, { n: '热播榜', v: 'hits_day' }, { n: '好评榜', v: 'score' });
        } else if (valuesStr) {
            valuesStr.split(',').filter(v => v.trim()).forEach(v => valArr.push({ n: v.trim(), v: v.trim() }));
        }
        return { key, name, value: valArr, init: isSort ? 'time' : '' };
    };

    (res.data || []).forEach(i => {
        const tid = i.typeId.toString();
        classes.push({ type_id: tid, type_name: i.typeName });
        const ext = i.type_extend_obj;
        if (ext) {
            const f = [];
            if (ext.class) f.push(buildFilter('class', '類型', ext.class));
            if (ext.area) f.push(buildFilter('area', '地區', ext.area));
            if (ext.lang) f.push(buildFilter('lang', '語言', ext.lang));
            if (ext.year) f.push(buildFilter('year', '年份', ext.year));
            f.push(buildFilter('sort', '排序', '', true));
            filters[tid] = f;
        }
    });
    return JSON.stringify({ class: classes, filters });
}

async function homeVod() {
    const res = await smartRequest(`${HOST}/vod-app/rank/hotHits`, 'get', { timestamp: Math.floor(Date.now()/1000) });
    const list = [];
    (res.data || []).forEach(i => {
        if (i.vodBeans) {
            i.vodBeans.forEach(v => list.push({
                vod_id: v.id, vod_name: v.name, vod_pic: v.vodPic,
                vod_remarks: v.vodRemarks || '', vod_content: v.vodBlurb || ''
            }));
        }
    });
    return JSON.stringify({ list });
}

async function category(tid, pg, filter, extend) {
    const payload = {
        tid: tid, page: pg.toString(), limit: '12',
        timestamp: Math.floor(Date.now() / 1000).toString(),
        classType: extend.class || '', area: extend.area || '',
        lang: extend.lang || '', year: extend.year || '', by: extend.sort || 'time'
    };
    Object.keys(payload).forEach(k => !payload[k] && delete payload[k]);
    const res = await smartRequest(`${HOST}/vod-app/vod/list`, 'post', payload);
    const d = res.data || {};
    return JSON.stringify({
        list: (d.data || []).map(v => ({ vod_id: v.id, vod_name: v.name, vod_pic: v.vodPic, vod_remarks: v.vodRemarks })),
        page: parseInt(pg), pagecount: d.totalPageCount || 1
    });
}

async function detail(id) {
    const res = await smartRequest(`${HOST}/vod-app/vod/info`, 'post', {
        vodId: id.toString(), timestamp: Math.floor(Date.now() / 1000).toString()
    });
    const d = res.data || {};
    const playFrom = [], playUrl = [];
    (d.vodSources || []).sort((a,b)=>a.sort-b.sort).forEach(src => {
        playFrom.push(src.sourceName);
        playUrl.push(src.vodPlayList.urls.map(u => `${u.name}$${src.sourceCode}@${u.url}`).join('#'));
    });
    return JSON.stringify({ list: [{
        vod_id: d.vodId, vod_name: d.vodName, vod_pic: d.vodPic,
        vod_remarks: d.vodRemark, vod_year: d.vodYear, vod_area: d.vodArea,
        vod_actor: d.vodActor, vod_content: d.vodContent,
        vod_play_from: playFrom.join('$$$'), vod_play_url: playUrl.join('$$$')
    }]});
}

async function play(flag, id) {
    const [sc, raw] = id.split('@');
    const res = await smartRequest(`${HOST}/vod-app/vod/playUrl`, 'post', {
        sourceCode: sc, urlEncode: raw, timestamp: Math.floor(Date.now()/1000).toString()
    });
    const finalUrl = res.data?.url || raw;
    return JSON.stringify({ parse: 0, jx: /(iqiyi|qq|youku|mgtv)/.test(finalUrl)?1:0, url: finalUrl, header: { 'User-Agent': USER_AGENT } });
}

async function search(wd, quick, pg) {
    const res = await smartRequest(`${HOST}/vod-app/vod/segSearch`, 'post', {
        key: wd, limit: '20', page: (pg||1).toString(), timestamp: Math.floor(Date.now()/1000).toString()
    });
    return JSON.stringify({ list: (res.data?.data || []).map(v => ({ vod_id: v.id, vod_name: v.name, vod_pic: v.vodPic, vod_remarks: v.vodRemarks })) });
}

export function __jsEvalReturn() {
    return { init, home, homeVod, category, detail, play, search };
}
