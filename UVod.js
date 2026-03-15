var key = "Uvod_JS";
var HOST = "https://api-h5.uvod.tv";
var WEB_HOST = "https://m.uvod.tv";
var SERVER_PUBLIC_KEY = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCeBQWotWOpsuPn3PAA+bcmM8YDfEOzPz7hb/vItV43vBJV2FcM72Hdcv3DccIFuEV9LQ8vcmuetld98eksja9vQ1Ol8rTnjpTpMbd4HedevSuIhWidJdMAOJKDE3AgGFcQvQePs80uXY2JhTLkRn2ICmDR/fb32OwWY3QGOvLcuQIDAQAB";
var CLIENT_PRIVATE_KEY = "......"; // 由於JS環境限制，RSA解密通常由系統封裝函式處理

var show_adult = false;
var token = "";

async function request(url, data, headers, method) {
    let res = await req(url, {
        method: method || 'GET',
        headers: headers || {},
        data: data || {}
    });
    return res.content;
}

// 模擬 Python 的加密邏輯
function encrypt(text) {
    // 注意：JS版通常調用內建的 aes 與 rsa 函式
    // 這裡演示邏輯流
    let aesKey = _.randomString(32);
    let iv = "abcdefghijklmnop";
    let encryptedData = _.aesEncrypt(text, aesKey, iv);
    let encryptedKey = _.rsaEncrypt(aesKey, SERVER_PUBLIC_KEY);
    return encryptedData + "." + encryptedKey;
}

async function postApi(path, payload) {
    let ts = new Date().getTime().toString();
    let signText = "";
    
    // 簽名邏輯 (對應 _build_headers)
    if (path === '/video/list') {
        let keys = Object.keys(payload).sort();
        let query = keys.map(k => k + "=" + (['keyword', 'region'].includes(k) ? encodeURIComponent(payload[k]).toLowerCase() : payload[k])).join('&');
        signText = "-" + query + "-" + ts;
    } else {
        signText = token + "--" + ts; // 簡化處理
    }
    
    let signature = _.md5(signText);
    let headers = {
        'X-TOKEN': token,
        'X-TIMESTAMP': ts,
        'X-SIGNATURE': signature,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36'
    };

    let body = encrypt(JSON.stringify(payload));
    let content = await request(HOST + path, body, headers, 'POST');
    // JS 端解密處理
    let resJson = JSON.parse(_.decrypt(content)); 
    return resJson.error === 0 ? resJson.data : null;
}

async function init(ext) {
    if (ext === true || ext === "true") show_adult = true;
}

async function home(filter) {
    let data = await postApi('/video/category', {});
    let classes = [];
    if (data && data.list) {
        data.list.forEach(it => {
            let cid = it.id || it.category_id;
            let name = it.name;
            if (!show_adult && (cid == '108' || name.includes('午夜'))) return;
            classes.push({ type_id: cid.toString(), type_name: name });
        });
    }
    return JSON.stringify({ class: classes });
}

async function homeVod() {
    let data = await postApi('/video/latest', { parent_category_id: 101 });
    let list = (data.list || []).map(it => {
        let state = it.state || it.remarks || "";
        let score = it.score ? parseFloat(it.score).toFixed(1) : "0.0";
        return {
            vod_id: it.id.toString(),
            vod_name: it.title,
            vod_pic: it.poster,
            vod_remarks: score > 0 ? state + " ✨ " + score : state
        };
    });
    return JSON.stringify({ list: list });
}

async function category(tid, pg, filter, extend) {
    let payload = {
        parent_category_id: tid,
        page: parseInt(pg),
        pagesize: 42,
        need_fragment: 1
    };
    Object.assign(payload, extend);
    let data = await postApi('/video/list', payload);
    let list = (data.list || []).map(it => {
        let state = it.state || it.remarks || "";
        let score = it.score ? parseFloat(it.score).toFixed(1) : "0.0";
        return {
            vod_id: it.id.toString(),
            vod_name: it.title,
            vod_pic: it.poster,
            vod_remarks: score > 0 ? state + " ✨ " + score : state
        };
    });
    return JSON.stringify({
        list: list,
        page: pg,
        total: data.total
    });
}

async function detail(id) {
    let data = await postApi('/video/info', { id: id });
    let video = data.video;
    let playUrls = data.video_fragment_list.map(f => f.symbol + "$" + id + "|" + f.id + "|" + f.qualities[0]);
    let vod = {
        vod_id: id,
        vod_name: video.title,
        vod_pic: video.poster,
        vod_content: video.description,
        vod_play_from: "优视频",
        vod_play_url: playUrls.join('#')
    };
    return JSON.stringify({ list: [vod] });
}

async function play(flag, id, vipFlags) {
    let parts = id.split('|');
    let payload = {
        video_id: parts[0],
        video_fragment_id: parts[1],
        quality: parts[2] || 4
    };
    let data = await postApi('/video/source', payload);
    return JSON.stringify({
        parse: 0,
        url: data.video.url,
        header: { 'User-Agent': 'Mozilla/5.0...' }
    });
}

async function search(wd, quick, pg) {
    let data = await postApi('/video/list', { keyword: wd, page: parseInt(pg || 1) });
    // ... 映射邏輯同 category ...
}

export default { init, home, homeVod, category, detail, play, search };
