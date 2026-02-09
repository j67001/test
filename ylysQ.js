let host = 'https://www.ylys.tv';
let headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Referer": host + "/",
    "Accept-Language": "zh-CN,zh;q=0.9"
};

/**
 * 核心：封裝通用的視頻列表提取邏輯
 */
async function extractVideos(html) {
    if (!html) return [];
    try {
        let items = pdfa(html, '.module-item, .module-card-item');
        return items.map(it => {
            const href = pdfh(it, 'a&&href') || '';
            const idMatch = href.match(/voddetail\/(\d+)/);
            if (!idMatch) return null;
            
            const name = pdfh(it, 'a&&title') || pdfh(it, '.module-item-title&&Text') || pdfh(it, 'strong&&Text') || "";
            const pic = pdfh(it, 'img&&data-original') || pdfh(it, 'img&&src') || "";
            const remarks = pdfh(it, '.module-item-text&&Text') || pdfh(it, '.module-item-note&&Text') || "";
            
            if (!name) return null;

            return {
                vod_id: idMatch[1],
                vod_name: name.trim(),
                vod_pic: pic.startsWith('/') ? host + pic : pic,
                vod_remarks: remarks.trim()
            };
        }).filter(Boolean);
    } catch (e) {
        return [];
    }
}

async function init(config) {
    // 初始化邏輯
}

async function generateFilters() {
    const currentYear = new Date().getFullYear();
    const years = [{n:"全部",v:""}, ...Array.from({length:15},(_,i)=>{const y=currentYear-i;return{n:y+"",v:y+""}})];
    return {
        "1": [{"key":"class","name":"类型","value":[{"n":"全部","v":""},{"n":"动作片","v":"6"},{"n":"喜剧片","v":"7"},{"n":"爱情片","v":"8"},{"n":"科幻片","v":"9"},{"n":"恐怖片","v":"11"}]},{"key":"year","name":"年份","value":years}],
        "2": [{"key":"class","name":"类型","value":[{"n":"全部","v":""},{"n":"国产剧","v":"13"},{"n":"港台剧","v":"14"},{"n":"日剧","v":"15"},{"n":"韩剧","v":"33"},{"n":"欧美剧","v":"16"}]},{"key":"year","name":"年份","value":years}],
        "3": [{"key":"class","name":"类型","value":[{"n":"全部","v":""},{"n":"内地综艺","v":"27"},{"n":"港台综艺","v":"28"},{"n":"日本综艺","v":"29"},{"n":"韩国综艺","v":"36"}]},{"key":"year","name":"年份","value":years}],
        "4": [{"key":"class","name":"类型","value":[{"n":"全部","v":""},{"n":"国产动漫","v":"31"},{"n":"日本动漫","v":"32"},{"n":"欧美动漫","v":"42"},{"n":"其他动漫","v":"43"}]},{"key":"year","name":"年份","value":years}]
    };
}

async function homeVod() {
    try {
        const resp = await req(host, { headers });
        const list = await extractVideos(resp?.content || '');
        return JSON.stringify({ list });
    } catch (e) {
        return JSON.stringify({ list: [] });
    }
}

async function home() {
    try {
        const resp = await req(host, { headers });
        const list = await extractVideos(resp?.content || '');
        const filters = await generateFilters();
        return JSON.stringify({
            class: [
                {type_id:"1",type_name:"电影"},
                {type_id:"2",type_name:"剧集"},
                {type_id:"3",type_name:"综艺"},
                {type_id:"4",type_name:"动漫"}
            ],
            filters: filters,
            list: list
        });
    } catch (e) {
        return JSON.stringify({ list: [] });
    }
}

async function category(tid, pg, filter, extend) {
    try {
        const cat = extend?.class || tid;
        const year = extend?.year || '';
        const url = `${host}/vodshow/${cat}--------${pg}---${year}/`;
        const resp = await req(url, { headers });
        const html = resp?.content || '';
        const list = await extractVideos(html);
        
        // 判定總頁數
        const lastPageMatch = html.match(/page\/(\d+)\/[^>]*>尾页/);
        const pagecount = lastPageMatch ? parseInt(lastPageMatch[1]) : (list.length > 0 ? parseInt(pg) + 1 : parseInt(pg));

        return JSON.stringify({ 
            list, 
            page: parseInt(pg), 
            pagecount, 
            limit: 20 
        });
    } catch (e) {
        return JSON.stringify({ list: [], page: parseInt(pg), pagecount: 1 });
    }
}

async function detail(id) {
    try {
        const url = `${host}/voddetail/${id}/`;
        const resp = await req(url, { headers });
        const html = resp?.content || '';
        if (!html) return JSON.stringify({ list: [] });

        const tabs = pdfa(html, '.module-tab-item');
        const lists = pdfa(html, '.module-play-list-content');
        
        // 處理播放源
        let playFrom = tabs.map(t => pdfh(t, 'span&&Text') || "线路").join('$$$');
        if (!playFrom && lists.length > 0) playFrom = "默认";

        const playUrl = lists.map(l => {
            return pdfa(l, 'a').map(a => {
                const name = pdfh(a, 'span&&Text') || "播放";
                const href = pdfh(a, 'a&&href') || "";
                const vidMatch = href.match(/play\/([^\/]+)/);
                return vidMatch ? `${name}$${vidMatch[1]}` : null;
            }).filter(Boolean).join('#');
        }).join('$$$');

        // 演員與簡介 (使用更穩定的正則)
        const vod_name = (html.match(/<h1>(.*?)<\/h1>/) || ["", ""])[1];
        const vod_pic = host + (html.match(/data-original="(.*?)"/)?.[1] || "");
        const vod_content = (html.match(/introduction-content">.*?<p>(.*?)<\/p>/s) || ["", ""])[1]?.replace(/<.*?>/g, "") || "暂无简介";

        return JSON.stringify({
            list: [{
                vod_id: id,
                vod_name: vod_name.trim(),
                vod_pic: vod_pic,
                vod_content: vod_content.trim(),
                vod_play_from: playFrom,
                vod_play_url: playUrl
            }]
        });
    } catch (e) {
        return JSON.stringify({ list: [] });
    }
}

async function search(wd, quick, pg) {
    try {
        const page = pg || 1;
        const url = `${host}/vodsearch/${encodeURIComponent(wd)}----------${page}---/`;
        const resp = await req(url, { headers });
        const list = await extractVideos(resp?.content || '');
        return JSON.stringify({ list });
    } catch (e) {
        return JSON.stringify({ list: [] });
    }
}

async function play(flag, id, flags) {
    try {
        const url = `${host}/play/${id}/`;
        const resp = await req(url, { headers });
        const content = resp?.content || "";
        
        let playUrl = "";
        // 優先從 player_aaaa 獲取
        const playerMatch = content.match(/player_aaaa\s*=\s*({.*?})/);
        if (playerMatch) {
            const config = JSON.parse(playerMatch[1]);
            playUrl = config.url || "";
        }

        // 備選正則提取 m3u8
        if (!playUrl) {
            const m3u8 = content.match(/"url"\s*:\s*"([^"]+\.m3u8[^"]*)"/);
            if (m3u8) playUrl = m3u8[1].replace(/\\/g, "");
        }

        if (playUrl) {
            return JSON.stringify({
                parse: 0,
                url: playUrl,
                header: { ...headers, "Referer": url }
            });
        }
        return JSON.stringify({ parse: 1, url: url, header: headers });
    } catch (e) {
        return JSON.stringify({ parse: 1, url: `${host}/play/${id}/` });
    }
}

export default { init, home, homeVod, category, detail, search, play };
