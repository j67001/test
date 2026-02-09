let host = 'https://www.ylys.tv';
// 建議使用更通用的 UA
const headers = {
  "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
  "Referer": host + "/"
};

// 1. 適配新版 init
async function init() {
  return true;
}

// 2. 抽離重複的請求邏輯，增加防錯
async function request(url) {
  try {
    const res = await req(url, { headers: headers });
    return res && res.content ? res.content : "";
  } catch (e) {
    return "";
  }
}

async function extractVideos(html) {
  if (!html) return [];
  // 確保 pdfa 存在，新版通常由內核注入
  return pdfa(html, '.module-item,.module-card-item').map(it => {
    const href = pdfh(it, 'a&&href') || '';
    const idMatch = href.match(/voddetail\/(\d+)/);
    const id = idMatch ? idMatch[1] : null;

    let name = pdfh(it, '.module-item-title&&Text') || 
               pdfh(it, '.module-card-item-title&&Text') || 
               pdfh(it, 'a&&title') || '';

    let pic = pdfh(it, 'img&&data-original') || 
              pdfh(it, 'img&&data-src') || 
              pdfh(it, 'img&&src') || '';

    const remarks = pdfh(it, '.module-item-note&&Text') || '';

    if (!id || !name) return null;

    return {
      vod_id: id,
      vod_name: name.trim(),
      vod_pic: pic.startsWith('/') ? host + pic : pic,
      vod_remarks: remarks.trim()
    };
  }).filter(Boolean);
}

// ... generateFilters 保持不變 ...

async function home() {
  const html = await request(host);
  const list = await extractVideos(html);
  return JSON.stringify({
    class: [
      { type_id: "1", type_name: "电影" },
      { type_id: "2", type_name: "剧集" },
      { type_id: "3", type_name: "综艺" },
      { type_id: "4", type_name: "动漫" }
    ],
    filters: await generateFilters(),
    list: list
  });
}

async function category(tid, pg, _, extend) {
  const cat = extend.class || tid;
  const year = extend.year || '';
  const url = `${host}/vodshow/${cat}--------${pg}---${year}/`;
  const html = await request(url);
  const list = await extractVideos(html);
  // 改進分頁匹配邏輯
  let pagecount = 1;
  const pgMatch = html.match(/page\/(\d+)\/[^>]*>尾页/);
  if (pgMatch) pagecount = parseInt(pgMatch[1]);
  
  return JSON.stringify({ list, page: parseInt(pg), pagecount, limit: 20 });
}

async function detail(id) {
    const html = await request(`${host}/voddetail/${id}/`);
    if (!html) return JSON.stringify({ list: [] });

    let tabs = pdfa(html, '.module-tab-item');
    const lists = pdfa(html, '.module-play-list-content');
    
    // 適配無 Tab 情況
    const playFrom = tabs.length > 0 ? tabs.map(t => pdfh(t, 'span&&Text') || "线路").join('$$$') : "播放列表";
    const playUrl = lists.map(l =>
        pdfa(l, 'a').map(a => {
            const name = pdfh(a, 'span&&Text') || "播放";
            const href = pdfh(a, 'a&&href') || "";
            const vid = href.match(/play\/([^\/]+)/)?.[1];
            return vid ? `${name}$${vid}` : null;
        }).filter(Boolean).join('#')
    ).join('$$$');

    // 使用更健壯的正則匹配
    const getMatch = (reg, str, index = 1) => {
        const m = str.match(reg);
        return m ? m[index] : "";
    };

    return JSON.stringify({
        list: [{
            vod_id: id,
            vod_name: getMatch(/<h1>(.*?)<\/h1>/, html),
            vod_pic: getMatch(/data-original="(.*?)"/, html),
            vod_content: getMatch(/introduction-content">.*?<p>(.*?)<\/p>/s, html).replace(/<.*?>/g, ""),
            vod_year: getMatch(/-----------(\d{4})\//, html),
            vod_director: getMatch(/导演：.*?<a[^>]*>([^<]+)<\/a>/, html),
            vod_actor: [...html.matchAll(/主演：.*?<a[^>]*>([^<]+)<\/a>/g)].map(m => m[1]).join(" / "),
            vod_play_from: playFrom,
            vod_play_url: playUrl
        }]
    });
}

// play 函式建議增加 parse: 1 作為備份
async function play(flag, id, flags) {
  const url = `${host}/play/${id}/`;
  const content = await request(url);

  let playUrl = "";
  try {
      const playerMatch = content.match(/player_aaaa\s*=\s*({.*?})/);
      if (playerMatch) {
          const config = JSON.parse(playerMatch[1]);
          playUrl = config.url;
      }
  } catch (e) {}

  if (playUrl) {
    return JSON.stringify({
      parse: 0,
      url: playUrl,
      header: { ...headers, "Referer": url }
    });
  }
  // 萬一解析不到，交給 FongMi 內置解析
  return JSON.stringify({ parse: 1, url: url });
}

export function __jsEvalReturn() {
  return {
    init,
    home,
    homeVod,
    category,
    detail,
    search,
    play
  };
}
