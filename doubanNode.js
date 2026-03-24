//import cheerio from "assets://js/lib/cheerio.min.js";
//import "assets://js/lib/crypto-js.js";

/**
 * 豆瓣插件 - 最终排查版
 * 仿 apple.js / JpysQ.js 结构
 */

var HOST = "https://frodo.douban.com/api/v2";
var APIKEY = "0ac44ae016490db2204ce0a042db2916";
var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.27(0x18001b33) NetType/WIFI Language/zh_CN";

function init(cfg) {
    // 确保返回的是标准 JSON 字符串
    return JSON.stringify({
        class: [
            { "type_id": "movie", "type_name": "豆瓣电影" },
            { "type_id": "tv", "type_name": "豆瓣剧集" }
        ]
    });
}

function home(filter) {
    var url = HOST + "/subject_collection/subject_real_time_hotest/items?count=20&apikey=" + APIKEY;
    var headers = { 
        "User-Agent": UA, 
        "Referer": "https://servicewechat.com/wx2f9b06c1de1ccfca/84/page-frame.html" 
    };
    
    // 使用 Fongmi 内核同步 req
    var response = req(url, { headers: headers });
    var data = JSON.parse(response.content);
    var items = data.subject_collection_items || [];
    var list = [];
    
    for (var i = 0; i < items.length; i++) {
        var it = items[i];
        list.push({
            vod_name: it.title,
            vod_pic: it.pic.normal + "@Referer=https://api.douban.com/",
            vod_remarks: it.rating ? "⭐" + it.rating.value : "",
            vod_id: (it.type || "movie") + "$" + it.id
        });
    }
    return JSON.stringify({ list: list });
}

function category(tid, pg, filter, extend) {
    var page = parseInt(pg || 1);
    var start = (page - 1) * 20;
    var tag = (tid === "movie" ? "电影" : "电视剧");
    var url = HOST + "/" + tid + "/recommend?tags=" + encodeURIComponent(tag) + "&start=" + start + "&count=20&apikey=" + APIKEY;
    
    var response = req(url, { headers: { "User-Agent": UA, "Referer": "https://servicewechat.com/wx2f9b06c1de1ccfca/84/page-frame.html" } });
    var data = JSON.parse(response.content);
    var items = data.items || data.subject_collection_items || [];
    var list = [];
    
    for (var i = 0; i < items.length; i++) {
        var it = items[i].subject || items[i];
        list.push({
            vod_name: it.title,
            vod_pic: it.pic.normal + "@Referer=https://api.douban.com/",
            vod_remarks: it.rating ? "⭐" + it.rating.value : "",
            vod_id: (it.type || "movie") + "$" + it.id
        });
    }
    return JSON.stringify({ page: page, list: list });
}

function detail(id) {
    var parts = id.split('$');
    var url = HOST + "/" + parts[0] + "/" + parts[1] + "?apikey=" + APIKEY;
    var response = req(url, { headers: { "User-Agent": UA } });
    var it = JSON.parse(response.content);
    var vod = {
        vod_id: id,
        vod_name: it.title,
        vod_pic: it.pic.normal,
        vod_actor: (it.actors || []).map(function(a){return a.name}).join("/"),
        vod_content: it.intro || "",
        vod_play_from: "豆瓣",
        vod_play_url: "立即播放$https://www.douban.com/search?q=" + encodeURIComponent(it.title)
    };
    return JSON.stringify({ list: [vod] });
}

function search(wd) {
    var url = HOST + "/search/wxapp?q=" + encodeURIComponent(wd) + "&apikey=" + APIKEY;
    var response = req(url, { headers: { "User-Agent": UA } });
    var data = JSON.parse(response.content);
    var items = data.items || [];
    var list = [];
    for (var i = 0; i < items.length; i++) {
        var it = items[i];
        list.push({
            vod_name: it.title,
            vod_pic: it.pic.normal,
            vod_id: (it.type || "movie") + "$" + it.id
        });
    }
    return JSON.stringify({ list: list });
}