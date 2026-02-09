let host = 'https://www.ylys.tv';
let headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Referer": host + "/",
    "Accept-Language": "zh-CN,zh;q=0.9"
};

async function init() {}

async function extractVideos(html) {
    if (!html) return [];
    
    return pdfa(html, '.module-item,.module-card-item').map(it => {
        const href = pdfh(it, 'a&&href') || '';
        const idMatch = href.match(/voddetail\/(\d+)/);
        const id = idMatch ? idMatch[1] : null;

        let name = pdfh(it, '.module-item-title&&Text') || 
                   pdfh(it, '.module-card-item-title&&Text') || 
                   pdfh(it, 'a&&title') || 
                   pdfh(it, 'strong&&Text') || "";
        
        let pic = pdfh(it, 'img&&data-original') || 
                  pdfh(it, 'img&&data-src') || 
                  pdfh(it, 'img&&src') || "";

        const remarks = pdfh(it, '.module-item-note&&Text') || 
                        pdfh(it, '.module-item-text&&Text') || "";

        if (!id || !name) return null;

        return {
            vod_id: id,
            vod_name: name.trim(),
            vod_pic: pic.startsWith('/') ? host + pic : pic,
            vod_remarks: remarks.trim()
        };
    }).filter(Boolean);
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
    const resp = await req(host, { headers });
    return JSON.stringify({ list: await extractVideos(resp?.content || '') });
}

async function home() {
    const resp = await req(host, { headers });
    const list = await extractVideos(resp?.content || '');

    return JSON.stringify({
        class: [
            { type_id: "1", type_name: "电影" },
            { type_id: "2", type_name: "剧集" },
            { type_id: "3", type_name: "综艺" },
            { type_id: "4", type_name: "动漫" }
        ],
        filters: await generateFilters(),
        list
    });
}

async function category(tid, pg, _, extend) {
    const cat = extend?.class || tid;
    const year = extend?.year || '';
    const url = `${host}/vodshow/${cat}--------${pg}---${year}/`;
    const html = (await req(url, { headers }))?.content || '';
    const list = await extractVideos(html);
    const pagecount = html.match(/page\/(\d+)\/[^>]*>尾页/) ? +RegExp.$1 : 999;
    return JSON.stringify({ list, page: +pg, pagecount, limit: 20 });
}

async function detail(id) {
    const html = (await req(`${host}/voddetail/${id}/`, { headers }))?.content || '';
    if (!html) return JSON.stringify({ list: [] });
    let tabs = pdfa(html, '.module-tab-item');
    const lists = pdfa(html, '.module-play-list-content');
    if (tabs.length === 0 && lists.length > 0) tabs = ["默认"];
    const playFrom = tabs.map(t => pdfh(t, 'span&&Text') || "线路").join('$$$');
    const playUrl = lists.slice(0, tabs.length).map(l =>
        pdfa(l, 'a').map(a => {
            const name = pdfh(a, 'span&&Text') || "播放";
            const vid = (pdfh(a, 'a&&href') || "").match(/play\/([^\/]+)/)?.[1];
            return vid ? `${name}$${vid}` : null;
        }).filter(Boolean).join('#')
    ).join('$$$');
    if (!playFrom || !playUrl) return JSON.stringify({ list: [] });
    
    // 這裡保留你的原始正則邏輯
    const vod_name = (html.match(/<h1>(.*?)<\/h1>/) || ["", ""])[1];
    const vod_pic = (() => {
        const pic = (html.match(/data-original="(.*?)"/) || ["", ""])[1];
        return pic?.startsWith('/') ? host + pic : pic || "";
    })();
    const vod_content = ((html.match(/introduction-content">.*?<p>(.*?)<\/p>/s) || ["", ""])[1]?.replace(/<.*?>/g, "") || "暂无简介");
    const vod_year = (html.match(/href="\/vodshow\/\d+-----------(\d{4})\//) || ["", ""])[1] || "";
    const vod_director = (html.match(/导演：.*?<a[^>]*>([^<]+)<\/a>/) || ["", ""])[1] || "";
    const vod_actor = [...html.matchAll(/主演：.*?<a[^>]*>([^<]+)<\/a>/g)].map(m => m[1]).filter(Boolean).join(" / ");

    return JSON.stringify({
        list: [{
            vod_id: id,
            vod_name,
            vod_pic,
            vod_content,
            vod_year,
            vod_director,
            vod_actor,
            vod_play_from: playFrom,
            vod_play_url: playUrl
        }]
    });
}

async function search(wd, _, pg = 1) {
    const url = `${host}/vodsearch/${encodeURIComponent(wd)}----------${pg}---/`;
    const resp = await req(url, { headers });
    return JSON.stringify({ list: await extractVideos(resp?.content || '') });
}

async function play(flag, id, flags) {
    const url = `${host}/play/${id}/`;
    const resp = await req(url, { headers });
    const content = resp?.content || "";
    
    let playUrl = "";
    const playerMatch = content.match(/player_aaaa\s*=\s*({.*?})/);
    if (playerMatch) {
        try {
            const config = JSON.parse(playerMatch[1]);
            playUrl = config.url;
        } catch (e) { }
    }

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
}

export default { init, home, homeVod, category, detail, search, play };
