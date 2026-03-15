import 'assets://js/lib/crypto-js.js';
import 'assets://js/lib/cat.js';
let HOST = 'https://api-h5.uvod.tv';
let WEB_HOST = 'https://m.uvod.tv';
let token = '';
let show_adult = false;

// RSA 公鑰與 AES IV (與原文一致)
let SERVER_PUBLIC_KEY = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCeBQWotWOpsuPn3PAA+bcmM8YDfEOzPz7hb/vItV43vBJV2FcM72Hdcv3DccIFuEV9LQ8vcmuetld98eksja9vQ1Ol8rTnjpTpMbd4HedevSuIhWidJdMAOJKDE3AgGFcQvQePs80uXY2JhTLkRn2ICmDR/fb32OwWY3QGOvLcuQIDAQAB';
let AES_IV = 'abcdefghijklmnop';

// 1. 初始化
async function init(ext) {
    if (ext === true || ext === 'true') {
        show_adult = true;
    }
}

// 2. 核心加密與請求函式
async function postApi(path, payload) {
    let ts = new Date().getTime().toString();
    
    // 簽名邏輯
    let signText = "";
    if (path === '/video/list') {
        let keys = Object.keys(payload).sort();
        let queryParts = [];
        keys.forEach(k => {
            let v = payload[k];
            if (v !== undefined && v !== null && v !== '' && v !== 0) {
                if (k === 'keyword' || k === 'region') {
                    v = encodeURIComponent(v).toLowerCase();
                }
                queryParts.push(k + "=" + v);
            }
        });
        signText = "-" + queryParts.join('&') + "-" + ts;
    } else {
        signText = token + "-" + "" + "-" + ts; 
    }
    
    let signature = _.md5(signText);
    
    let headers = {
        'X-TOKEN': token,
        'X-TIMESTAMP': ts,
        'X-SIGNATURE': signature,
        'Referer': WEB_HOST + '/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36'
    };

    // AES 加密與 RSA 封裝 (Fongmi 環境通常提供 _.aesEncode 或類似工具)
    let aesKey = _.random(32);
    let body = _.aesEncode(JSON.stringify(payload), aesKey, AES_IV) + "." + _.rsaEncode(aesKey, SERVER_PUBLIC_KEY);

    let res = await req(HOST + path, {
        method: 'POST',
        data: body,
        headers: headers
    });

    let data = JSON.parse(_.aesDecode(res.content, aesKey, AES_IV));
    return data.error === 0 ? data.data : null;
}

// 3. 首頁分類
async function home(filter) {
    let classes = [
        { type_id: '100', type_name: '电影' },
        { type_id: '101', type_name: '电视剧' },
        { type_id: '102', type_name: '综艺' },
        { type_id: '103', type_name: '动漫' },
        { type_id: '104', type_name: '体育' },
        { type_id: '105', type_name: '纪录片' },
        { type_id: '106', type_name: '粤台专区' },
        { type_id: '107', type_name: '儿童' }
    ];
    if (show_adult) classes.push({ type_id: '108', type_name: '午夜' });

    // 完整篩選配置 (對應原文 Mapping)
    let filterObj = {};
    let common_regions = [{ n: "全部", v: "" }, { n: "大陆", v: "大陆" }, { n: "欧美", v: "欧美" }, { n: "香港", v: "香港" }, { n: "台湾", v: "台湾" }, { n: "日本", v: "日本" }, { n: "韩国", v: "韩国" }];
    let common_years = [{ n: "全部", v: "" }];
    for (let y = 2026; y >= 2010; y--) common_years.push({ n: y.toString(), v: y.toString() });
    let common_sorts = [{ n: "最新", v: "create_time" }, { n: "更新", v: "update_time" }, { n: "最热", v: "hits" }, { n: "评分", v: "score" }];

    let cate_mapping = {
            "100": [{n: "全部", v: ""},{n: "喜剧", v: "109"},{n: "爱情", v: "110"},{n: "动作", v: "111"},{n: "犯罪", v: "112"},{n: "科幻", v: "113"},{n: "奇幻", v: "114"},{n: "冒险", v: "115"},{n: "灾难", v: "116"},{n: "惊悚", v: "117"},{n: "剧情", v: "118"},{n: "战争", v: "119"},{n: "经典", v: "120"},{n: "悬疑", v: "210"},{n: "历史", v: "211"},{n: "粤语", v: "122"},{n: "预告片", v: "121"}],
            "101": [{n: "全部", v: ""},{n: "短剧", v: "207"},{n: "国产剧", v: "123"},{n: "港台剧", v: "125"},{n: "日韓劇", v: "126"},{n: "歐美劇", v: "124"},{n: "新馬泰", v: "127"},{n: "其它劇", v: "128"}],
            "102": [{n: "全部", v: ""},{n: "搞笑", v: "129"},{n: "情感", v: "130"},{n: "选秀", v: "131"},{n: "访谈", v: "132"},{n: "时尚", v: "133"},{n: "演唱会", v: "136"},{n: "脱口秀", v: "135"},{n: "真人秀", v: "134"}],
            "103": [{n: "全部", v: ""},{n: "冒险", v: "137"},{n: "格斗", v: "138"},{n: "科幻", v: "139"},{n: "恋爱", v: "140"},{n: "校园", v: "141"},{n: "后宫", v: "142"},{n: "异界", v: "143"},{n: "美食", v: "144"},{n: "歌舞", v: "145"},{n: "運動", v: "146"},{n: "競技", v: "147"},{n: "魔幻", v: "148"},{n: "奇幻", v: "149"},{n: "搞笑", v: "209"},{n: "熱血", v: "151"},{n: "歷史", v: "152"},{n: "戰爭", v: "153"},{n: "機戰", v: "154"},{n: "爆笑", v: "155"},{n: "治癒", v: "156"},{n: "勵志", v: "157"},{n: "懸疑", v: "158"},{n: "少女", v: "159"},{n: "推理", v: "160"},{n: "恐怖", v: "161"},{n: "神鬼", v: "162"},{n: "日常", v: "208"},{n: "百合", v: "150"}],
            "104": [{n: "全部", v: ""},{n: "足球", v: "163"},{n: "篮球", v: "164"},{n: "综合", v: "165"},{n: "探索", v: "166"},{n: "奥运", v: "167"}],
            "105": [{n: "全部", v: ""},{n: "文化", v: "168"},{n: "科技", v: "169"},{n: "历史", v: "170"},{n: "军事", v: "171"},{n: "人物", v: "172"},{n: "解密", v: "173"},{n: "自然", v: "174"}],
            "106": [{n: "全部", v: ""},{n: "电影", v: "175"},{n: "电视剧-国产", v: "176"},{n: "电视剧-外产", v: "177"},{n: "动画", v: "179"},{n: "综艺", v: "178"}],
            "107": [{n: "全部", v: ""},{n: "儿歌", v: "187"},{n: "故事", v: "188"},{n: "学英语", v: "189"},{n: "动作", v: "190"},{n: "百科", v: "191"},{n: "国学", v: "192"},{n: "手工", v: "193"},{n: "识字", v: "194"},{n: "数学", v: "195"},{n: "美术", v: "196"},{n: "舞蹈", v: "197"},{n: "音乐", v: "198"},{n: "诗词", v: "199"},{n: "运动", v: "200"},{n: "口才", v: "201"},{n: "益智", v: "202"},{n: "玩具", v: "203"},{n: "游戏", v: "204"},{n: "母婴", v: "205"},{n: "识物", v: "206"}],
            "108": [{n: "全部", v: ""},{n: "日韓", v: "180"},{n: "卡通", v: "182"},{n: "国产", v: "183"},{n: "欧美", v: "181"},{n: "VR", v: "186"},{n: "免费", v: "185"},{n: "其它", v: "184"}]
    };

    classes.forEach(cls => {
        filterObj[cls.type_id] = [
            { key: "category_id", name: "类型", value: cate_mapping[cls.type_id] || [{ n: "全部", v: "" }] },
            { key: "region", name: "地区", value: common_regions },
            { key: "year", name: "年份", value: common_years },
            { key: "sort_field", name: "排序", value: common_sorts }
        ];
    });

    return JSON.stringify({ class: classes, filters: filterObj });
}

// 4. 首頁推薦
async function homeVod() {
    let data = await postApi('/video/latest', { parent_category_id: 101 });
    return JSON.stringify({ list: formatList(data.video_latest_list || []) });
}

// 5. 分類列表
async function category(tid, pg, filter, extend) {
    let payload = {
        parent_category_id: tid,
        page: parseInt(pg),
        pagesize: 42,
        need_fragment: 1
    };
    if (extend) Object.assign(payload, extend);
    
    let data = await postApi('/video/list', payload);
    return JSON.stringify({
        list: formatList(data.video_list || []),
        page: pg,
        pagecount: Math.ceil(data.total / 42),
        total: data.total
    });
}

// 6. 搜尋
async function search(wd, quick, pg) {
    let data = await postApi('/video/list', { keyword: wd, page: parseInt(pg || 1), need_fragment: 1 });
    return JSON.stringify({ list: formatList(data.video_list || []) });
}

// 7. 詳情
async function detail(id) {
    let data = await postApi('/video/info', { id: id });
    let video = data.video;
    let playUrls = data.video_fragment_list.map(f => {
        let maxQ = f.qualities ? Math.max(...f.qualities) : 4;
        return f.symbol + "$" + id + "|" + f.id + "|" + maxQ;
    });
    return JSON.stringify({
        list: [{
            vod_id: id,
            vod_name: video.title,
            vod_pic: video.poster,
            vod_year: video.year,
            vod_remarks: video.duration,
            vod_content: video.description,
            vod_play_from: "优视频JS",
            vod_play_url: playUrls.join('#')
        }]
    });
}

// 8. 播放
async function play(flag, id, vipFlags) {
    let parts = id.split('|');
    let payload = { video_id: parts[0], video_fragment_id: parts[1], quality: parts[2] };
    let data = await postApi('/video/source', payload);
    return JSON.stringify({
        parse: 0,
        url: data.video.url,
        header: { 'User-Agent': 'Mozilla/5.0...', 'Referer': WEB_HOST + '/' }
    });
}

// 輔助函式：統一列表格式 (含 ✨ 4.0 邏輯)
function formatList(lst) {
    return lst.map(k => {
        let state = k.state || k.remarks || "";
        let rawScore = parseFloat(k.score || k.fraction || 0);
        let score = rawScore > 0 ? rawScore.toFixed(1) : "";
        let remarks = (state && score) ? `${state} ✨ ${score}` : (state || score);
        return {
            vod_id: k.id.toString(),
            vod_name: k.title || k.name,
            vod_pic: k.poster || k.cover,
            vod_remarks: remarks
        };
    });
}

export default { init, home, homeVod, category, detail, play, search };
