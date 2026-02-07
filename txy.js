/**
 * 排除 drpy2.min.js 的原生 JS 脚本
 * 使用原生请求函数 req() 与 正则表达式解析
 */

let rule = {
    title: '腾云驾雾[原生版]',
    host: 'https://v.qq.com',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
};

// 1. 初始化函数
async function init(config) {
    // 原生初始化逻辑
}

// 2. 首页分类列表
async function home(filter) {
    let classes = [
        {"type_id": "movie", "type_name": "电影"},
        {"type_id": "tv", "type_name": "电视剧"},
        {"type_id": "variety", "type_name": "综艺"},
        {"type_id": "cartoon", "type_name": "动漫"}
    ];
    return JSON.stringify({ class: classes });
}

// 3. 一级分页内容解析 (原生正则替代 pdfa)
async function category(tid, pg, filter, extend) {
    let page = parseInt(pg) || 1;
    let offset = (page - 1) * 21;
    let url = `${rule.host}/x/bu/pagesheet/list?_all=1&append=1&channel=${tid}&listpage=1&offset=${offset}&pagesize=21`;
    
    let res = await req(url, { headers: rule.headers });
    let html = res.content;
    let list = [];

    // 使用原生正则提取数据块
    let itemRegex = /<div class="list_item"([\s\S]*?)<\/div>/g;
    let match;
    while ((match = itemRegex.exec(html)) !== null) {
        let block = match[1];
        let title = block.match(/title="([^"]+)"/)?.[1] || block.match(/alt="([^"]+)"/)?.[1];
        let pic = block.match(/src="([^"]+)"/)?.[1];
        let cid = block.match(/data-float="([^"]+)"/)?.[1];
        
        if (title && cid) {
            list.push({
                vod_id: cid,
                vod_name: title,
                vod_pic: pic,
                vod_remarks: ""
            });
        }
    }
    return JSON.stringify({ list: list, page: page });
}

// 4. 二级详情页解析
async function detail(id) {
    let url = `https://node.video.qq.com/x/api/float_vinfo2?cid=${id}`;
    let res = await req(url, { headers: rule.headers });
    let jsonStr = res.content;
    
    // 清理腾讯 QZOutputJson 格式
    jsonStr = jsonStr.substring(jsonStr.indexOf('{'), jsonStr.lastIndexOf('}') + 1);
    let json = JSON.parse(jsonStr);
    
    let vod = {
        vod_id: id,
        vod_name: json.c.title,
        vod_pic: json.c.pic,
        type_name: json.typ ? json.typ.join(",") : "",
        vod_year: json.c.year,
        vod_content: json.c.description,
        vod_play_from: "腾讯视频"
    };

    let playUrls = [];
    if (json.c.video_ids && json.c.video_ids.length > 0) {
        json.c.video_ids.forEach((vid, index) => {
            playUrls.push(`${index + 1}$https://v.qq.com/x/cover/${id}/${vid}.html`);
        });
    } else {
        playUrls.push(`正片$https://v.qq.com/x/cover/${id}.html`);
    }
    vod.vod_play_url = playUrls.join("#");

    return JSON.stringify({ list: [vod] });
}

// 5. 搜索功能
async function search(wd, quick) {
    let url = `${rule.host}/x/search/?q=${encodeURIComponent(wd)}`;
    let res = await req(url, { headers: rule.headers });
    let html = res.content;
    let list = [];

    let searchRegex = /<div class="result_item_v"([\s\S]*?)<\/div>/g;
    let match;
    while ((match = searchRegex.exec(html)) !== null) {
        let block = match[1];
        let title = block.match(/title="([^"]+)"/)?.[1];
        let cid = block.match(/cid=([a-zA-Z0-9]+)/)?.[1];
        if (title && cid) {
            list.push({
                vod_id: cid,
                vod_name: title,
                vod_pic: block.match(/src="([^"]+)"/)?.[1]
            });
        }
    }
    return JSON.stringify({ list: list });
}

// 6. 播放解析 (原生 Lazy)
async function play(flag, id, flags) {
    // 这里直接对接您的解析接口
    let jxUrl = "https://cache.json.icu/home/api?type=ys&uid=292796&key=fnoryABDEFJNPQV269&url=" + id;
    let res = await req(jxUrl);
    let json = JSON.parse(res.content);
    
    return JSON.stringify({
        parse: 0,
        url: json.url || id,
        header: rule.headers
    });
}

// 导出函数
export default {
    init,
    home,
    category,
    detail,
    search,
    play
};