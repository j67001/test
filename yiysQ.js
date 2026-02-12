import 'assets://js/lib/crypto-js.js';

const { HOST, PUBLIC_KEY_N, PUBLIC_KEY_E, USER_AGENT } = {
    HOST: 'https://aleig4ah.yiys05.com',
    // 從原公鑰提取的模數 (N) 和指數 (E)
    PUBLIC_KEY_N: 'c38aa978e82ff8c7978b9ecc35fa9917b4919874771547a50937ebb88eaf67c9204cfa5ed603323fff194ef79d4d88d30ccca99669fca3c626f7cc93c77cc76ac90fa660d1f347beadc45c88fa1865c58da70a4592b1e9d65e8f8ecf711cb5f37f753e3776bc427798fa348cbe031baf4d030b85dfbda99fae43cc5d0fb1f6dde035c3f962db9184615110128fdaadb480fefcdc02041c32c61653200b05897acb92067deee69402da96eb0b4a4781d6a5e68df912cbc6105d9d58ee31cf6368197ab0731d4af4c98006a305301de8b2c0f5c0e66c64f11fb446a7ffa2654f3a9058711a5e72b2c66f05cc63b8c73d8da065eac1cc752bd326001a8c14c077a2cb03',
    PUBLIC_KEY_E: '10001', 
    USER_AGENT: 'Android/OkHttp'
};

let token = '';
let appId = '';

// --- 工具函數 ---
const sha256 = s => CryptoJS.SHA256(s).toString(CryptoJS.enc.Hex);

// 簡易大數運算（用於 RSA 解密：m = c^e mod n）
function powerMod(base, exp, mod) {
    let res = BigInt(1);
    base = BigInt(base) % BigInt(mod);
    exp = BigInt(exp);
    let m = BigInt(mod);
    while (exp > 0n) {
        if (exp % 2n === 1n) res = (res * base) % m;
        base = (base * base) % m;
        exp = exp / 2n;
    }
    return res;
}

function rsaPublicDecrypt(ciphertextBase64) {
    try {
        const cipherBytes = CryptoJS.enc.Base64.parse(ciphertextBase64);
        const c = BigInt('0x' + cipherBytes.toString(CryptoJS.enc.Hex));
        const n = BigInt('0x' + PUBLIC_KEY_N);
        const e = BigInt('0x' + PUBLIC_KEY_E);
        
        // 執行 m = c^e mod n
        let m = powerMod(c, e, n);
        let mHex = m.toString(16);
        if (mHex.length % 2 !== 0) mHex = '0' + mHex;
        
        // 轉換回字符串並處理填充 (PKCS1 格式通常從 00 02... 開始)
        let bin = CryptoJS.enc.Hex.parse(mHex).toString(CryptoJS.enc.Utf8);
        // 根據 Python 代碼邏輯，尋找分隔符後的數據
        const rawBytes = CryptoJS.enc.Hex.parse(mHex);
        const hexStr = rawBytes.toString();
        const idx = hexStr.indexOf('00', 4); // 略過開頭尋找分隔
        if (idx !== -1) {
            return CryptoJS.enc.Hex.parse(hexStr.substring(idx + 2)).toString(CryptoJS.enc.Utf8);
        }
        return bin;
    } catch (err) {
        return "";
    }
}

// --- 核心邏輯 ---

async function refreshToken() {
    if (!appId) {
        appId = local.get('yiys_zNiOFyj0r4ux') || Array.from({length:16},()=>Math.floor(Math.random()*16).toString(16)).join('');
        local.set('yiys_zNiOFyj0r4ux', appId);
    }
    
    const ts = Math.floor(Date.now() / 1000).toString();
    const payload = { 'appID': appId, 'timestamp': ts };
    const headers = { 'User-Agent': USER_AGENT, 'APP-ID': appId, 'X-Auth-Flow': '1' };
    
    try {
        const res = await req(`${HOST}/vod-app/index/getGenerateKey`, {
            method: 'post',
            data: payload,
            headers: headers
        });
        const json = JSON.parse(res.content);
        if (json.data) {
            token = rsaPublicDecrypt(json.data);
            return !!token;
        }
    } catch (e) {}
    return false;
}

function getSignedHeaders(params) {
    const headers = { 'User-Agent': USER_AGENT, 'APP-ID': appId, 'Authorization': '' };
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
    let res = await req(url, { method: method, data: data, headers: headers });

    // 400 錯誤或內容為空時嘗試刷新 Token
    if (res.status === 400 || !res.content) {
        if (await refreshToken()) {
            headers = getSignedHeaders(data);
            res = await req(url, { method: method, data: data, headers: headers });
        }
    }
    return JSON.parse(res.content || '{}');
}

// --- 導出接口 ---

async function init(extend) {
    await refreshToken();
    return true;
}

async function home() {
    const res = await smartRequest(`${HOST}/vod-app/type/list`, 'get', { timestamp: Math.floor(Date.now()/1000) });
    const classes = (res.data || []).map(i => ({ type_id: i.typeId.toString(), type_name: i.typeName }));
    const filters = {};
    // ... 這裡可根據 01.js 邏輯繼續填充過濾器 ...
    return JSON.stringify({ class: classes, filters });
}

async function homeVod() {
    const res = await smartRequest(`${HOST}/vod-app/rank/hotHits`, 'get', { timestamp: Math.floor(Date.now()/1000) });
    let list = [];
    (res.data || []).forEach(i => {
        if (i.vodBeans) {
            list.push(...i.vodBeans.map(v => ({
                vod_id: v.id,
                vod_name: v.name,
                vod_pic: v.vodPic,
                vod_remarks: v.vodRemarks || ''
            })));
        }
    });
    return JSON.stringify({ list });
}

async function category(tid, pg, filter, extend) {
    const payload = {
        tid: tid, page: pg.toString(), limit: '12',
        timestamp: Math.floor(Date.now() / 1000).toString(),
        classType: extend.class || '', area: extend.area || '', by: extend.sort || 'time'
    };
    const res = await smartRequest(`${HOST}/vod-app/vod/list`, 'post', payload);
    const data = res.data || {};
    return JSON.stringify({
        list: (data.data || []).map(v => ({ vod_id: v.id, vod_name: v.name, vod_pic: v.vodPic, vod_remarks: v.vodRemarks })),
        page: parseInt(pg),
        pagecount: data.totalPageCount || 1
    });
}

async function detail(id) {
    const res = await smartRequest(`${HOST}/vod-app/vod/info`, 'post', {
        vodId: id.toString(), timestamp: Math.floor(Date.now() / 1000).toString()
    });
    const d = res.data;
    const playFrom = [], playUrl = [];
    (d.vodSources || []).forEach(src => {
        playFrom.push(src.sourceName);
        playUrl.push(src.vodPlayList.urls.map(u => `${u.name}$${src.sourceCode}@${u.url}`).join('#'));
    });
    return JSON.stringify({ list: [{
        vod_id: d.vodId, vod_name: d.vodName, vod_pic: d.vodPic,
        vod_remarks: d.vodRemark, vod_content: d.vodContent,
        vod_play_from: playFrom.join('$$$'), vod_play_url: playUrl.join('$$$')
    }]});
}

async function play(flag, id) {
    const [sourceCode, rawUrl] = id.split('@');
    const res = await smartRequest(`${HOST}/vod-app/vod/playUrl`, 'post', {
        sourceCode, urlEncode: rawUrl, timestamp: Math.floor(Date.now()/1000).toString()
    });
    return JSON.stringify({ parse: 0, url: res.data?.url || rawUrl, header: { 'User-Agent': USER_AGENT } });
}

async function search(wd, quick, pg) {
    const res = await smartRequest(`${HOST}/vod-app/vod/segSearch`, 'post', {
        key: wd, limit: '20', page: pg.toString(), timestamp: Math.floor(Date.now()/1000).toString()
    });
    return JSON.stringify({ list: (res.data?.data || []).map(v => ({ vod_id: v.id, vod_name: v.name, vod_pic: v.vodPic, vod_remarks: v.vodRemarks })) });
}

export function __jsEvalReturn() {
    return { init, home, homeVod, category, detail, play, search };
}
