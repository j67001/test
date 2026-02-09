let host = 'https://www.ylys.tv';

async function init() {
  return true; // 確保init()返回true
}

async function extractVideos(html) {
  if (!html) return [];

  // 解析頁面，提取影片資料
  return pdfa(html, '.module-item,.module-card-item').map(function(it) {
    const href = pdfh(it, 'a&&href') || '';
    const idMatch = href.match(/voddetail\/(\d+)/);
    const id = idMatch ? idMatch[1] : null;

    let name = pdfh(it, '.module-item-title&&Text') || 
               pdfh(it, '.module-card-item-title&&Text') || 
               pdfh(it, 'a&&title') || 
               pdfh(it, 'strong&&Text') || '';

    let pic = pdfh(it, 'img&&data-original') || 
              pdfh(it, 'img&&data-src') || 
              pdfh(it, 'img&&src') || '';

    const remarks = pdfh(it, '.module-item-note&&Text') || 
                    pdfh(it, '.module-item-text&&Text') || '';

    if (!id || !name) return null;

    return {
      vod_id: id,
      vod_name: name.trim(),
      vod_pic: pic.startsWith('/') ? host + pic : pic,
      vod_remarks: remarks.trim()
    };
  }).filter(Boolean);
}

async function homeVod() {
  const resp = await req(host, { headers });
  return JSON.stringify({ list: await extractVideos(resp && resp.content ? resp.content : '') });
}

async function home() {
  const { list } = JSON.parse(await homeVod());
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
  const cat = extend && extend.class ? extend.class : tid;
  const year = extend && extend.year ? extend.year : '';
  const url = `${host}/vodshow/${cat}--------${pg}---${year}/`;
  const html = (await req(url, { headers })) && (await req(url, { headers })).content || '';
  const list = await extractVideos(html);
  const pagecount = html.match(/page\/(\d+)\/[^>]*>尾页/) ? +RegExp.$1 : 999;
  return JSON.stringify({ list, page: +pg, pagecount, limit: 20 });
}

async function detail(id) {
  const html = (await req(`${host}/voddetail/${id}/`, { headers })) && (await req(`${host}/voddetail/${id}/`, { headers })).content || '';
  if (!html) return JSON.stringify({ list: [] });

  let tabs = pdfa(html, '.module-tab-item');
  const lists = pdfa(html, '.module-play-list-content');
  if (tabs.length === 0 && lists.length > 0) tabs = ["默认"];

  const playFrom = tabs.map(function(t) {
    return pdfh(t, 'span&&Text') || "线路";
  }).join('$$$');

  const playUrl = lists.slice(0, tabs.length).map(function(l) {
    return pdfa(l, 'a').map(function(a) {
      const name = pdfh(a, 'span&&Text') || "播放";
      const vid = (pdfh(a, 'a&&href') || "").match(/play\/([^\/]+)/) ? RegExp.$1 : null;
      return vid ? `${name}$${vid}` : null;
    }).filter(Boolean).join('#');
  }).join('$$$');

  if (!playFrom || !playUrl) return JSON.stringify({ list: [] });

  const vod_name = (html.match(/<h1>(.*?)<\/h1>/) || ["", ""])[1];
  const vod_pic = (() => {
    const pic = (html.match(/data-original="(.*?)"/) || ["", ""])[1];
    return pic && pic.startsWith('/') ? host + pic : pic || "";
  })();

  const vod_content = ((html.match(/introduction-content">.*?<p>(.*?)<\/p>/s) || ["", ""])[1]?.replace(/<.*?>/g, "") || "暂无简介");
  const vod_year = (html.match(/href="\/vodshow\/\d+-----------(\d{4})\//) || ["", ""])[1] || "";
  const vod_director = (html.match(/导演：.*?<a[^>]*>([^<]+)<\/a>/) || ["", ""])[1] || "";
  const vod_actor = [...html.matchAll(/主演：.*?<a[^>]*>([^<]+)<\/a>/g)].map(function(m) {
    return m[1];
  }).filter(Boolean).join(" / ");

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
  return JSON.stringify({ list: await extractVideos(resp && resp.content ? resp.content : '') });
}

async function play(flag, id, flags) {
  const url = `${host}/play/${id}/`;
  const resp = await req(url, { headers });
  const content = resp && resp.content || "";

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

// 最後確保回傳__jsEvalReturn()
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
