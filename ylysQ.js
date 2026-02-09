let host = 'https://www.ylys.tv';
let headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Referer": host + "/",
    "Accept-Language": "zh-CN,zh;q=0.9"
};

const init = async (config) => {
    // 新版建議保留 config 傳入，即便目前沒用到
};

const extractVideos = (html) => {
    if (!html) return [];
    // 修正選擇器可能存在的空格問題
    let items = pdfa(html, '.module-item, .module-card-item');
    return items.map(it => {
        const href = pdfh(it, 'a&&href') || '';
        const idMatch = href.match(/voddetail\/(\d+)/);
        if (!idMatch) return null;
        
        const name = pdfh(it, 'a&&title') || pdfh(it, '.module-item-title&&Text') || "";
        const pic = pdfh(it, 'img&&data-original') || pdfh(it, 'img&&src') || "";
        const remarks = pdfh(it, '.module-item-text&&Text') || pdfh(it, '.module-item-note&&Text') || "";
        
        return {
            vod_id: idMatch[1],
            vod_name: name.trim(),
            vod_pic: pic.startsWith('/') ? host + pic : pic,
            vod_remarks: remarks.trim()
        };
    }).filter(it => it !== null);
};

const home = async () => {
    try {
        const resp = await req(host, { headers });
        const list = extractVideos(resp?.content || '');
        return JSON.stringify({
            class: [
                {type_id:"1",type_name:"电影"},
                {type_id:"2",type_name:"剧集"},
                {type_id:"3",type_name:"综艺"},
                {type_id:"4",type_name:"动漫"}
            ],
            filters: generateFilters(),
            list: list
        });
    } catch (e) {
        return JSON.stringify({ list: [] });
    }
};

const category = async (tid, pg, filter, extend) => {
    const cat = extend?.class || tid;
    const year = extend?.year || '';
    // 修正 URL 拼接，確保分頁參數正確
    const url = `${host}/vodshow/${cat}--------${pg}---${year}/`;
    const resp = await req(url, { headers });
    const html = resp?.content || '';
    const list = extractVideos(html);
    
    // 更加魯棒的總頁數判定
    let pageCount = 1;
    const lastPageMatch = html.match(/page\/(\d+)\/[^>]*>尾页/);
    if (lastPageMatch) {
        pageCount = parseInt(lastPageMatch[1]);
    } else {
        // 如果找不到尾頁，檢查當前是否有列表，有則假設還有下一頁
        pageCount = list.length > 0 ? parseInt(pg) + 1 : parseInt(pg);
    }

    return JSON.stringify({
        list: list,
        page: parseInt(pg),
        pagecount: pageCount,
        limit: 20
    });
};

const detail = async (id) => {
    try {
        const url = `${host}/voddetail/${id}/`;
        const resp = await req(url, { headers });
        const html = resp?.content || '';
        if (!html) return JSON.stringify({ list: [] });

        const tabs = pdfa(html, '.module-tab-item');
        const lists = pdfa(html, '.module-play-list-content');
        
        const playFrom = tabs.map(t => pdfh(t, 'span&&Text') || "线路").join('$$$');
        const playUrl = lists.map(l => {
            return pdfa(l, 'a').map(a => {
                const name = pdfh(a, 'span&&Text') || "播放";
                const href = pdfh(a, 'a&&href') || "";
                const vidMatch = href.match(/play\/([^\/]+)/);
                return vidMatch ? `${name}$${vidMatch[1]}` : null;
            }).filter(Boolean).join('#');
        }).join('$$$');

        // 修正演員抓取方式，避免使用 matchAll
        const actorMatch = html.match(/主演：(.*?)<\/div>/);
        const actors = actorMatch ? actorMatch[1].replace(/<[^>]+>/g, "").trim() : "";

        return JSON.stringify({
            list: [{
                vod_id: id,
                vod_name: pdfh(html, 'h1&&Text') || "",
                vod_pic: host + (html.match(/data-original="(.*?)"/)?.[1] || ""),
                vod_content: pdfh(html, '.introduction-content&&Text')?.trim() || "暂无简介",
                vod_play_from: playFrom,
                vod_play_url: playUrl,
                vod_actor: actors
            }]
        });
    } catch (e) {
        return JSON.stringify({ list: [] });
    }
};

// ... generateFilters, search, play 保持邏輯但加上 try-catch ...

export default { init, home, category, detail, search, play };
