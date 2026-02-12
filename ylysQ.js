let host = 'https://www.ylys.tv';
const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.6478.61 Safari/537.36",
  "Referer": host + "/",
  "Accept-Language": "zh-CN,zh;q=0.9",
  "Connection": "keep-alive",
  "Upgrade-Insecure-Requests": "1",
  "Cache-Control": "max-age=0"
};


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

async function generateFilters() {
    const currentYear = new Date().getFullYear();
    const years = [{n:"全部",v:""}, ...Array.from({length:15},(_,i)=>{const y=currentYear-i;return{n:y+"",v:y+""}})];
    return {
            "1": [{"key":"class","name":"类型","value":[{"n":"全部","v":""},{"n":"动画","v":"26"},{"n":"动作","v":"6"},{"n":"喜剧","v":"7"},{"n":"爱情","v":"8"},{"n":"科幻","v":"9"},{"n":"奇幻","v":"10"},{"n":"恐怖","v":"11"},{"n":"剧情","v":"12"},{"n":"战争","v":"20"},{"n":"纪录","v":"21"},{"n":"悬疑","v":"22"},{"n":"冒险","v":"23"},{"n":"犯罪","v":"24"},{"n":"惊悚","v":"45"},{"n":"歌舞","v":"46"},{"n":"灾难","v":"47"},{"n":"网络","v":"48"}]},{"key":"area","name":"地區","value":[{"n":"全部","v":""},{"n":"美国","v":"美国"},{"n":"日本","v":"日本"},{"n":"韩国","v":"韩国"},{"n":"大陆","v":"大陆"},{"n":"香港","v":"香港"},{"n":"台湾","v":"台湾"},{"n":"法国","v":"法国"},{"n":"英国","v":"英国"},{"n":"德国","v":"德国"},{"n":"泰国","v":"泰国"},{"n":"印度","v":"印度"},{"n":"意大利","v":"意大利"},{"n":"西班牙","v":"西班牙"},{"n":"加拿大","v":"加拿大"},{"n":"其他","v":"其他"}]},{"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2026","v":"2026"},{"n":"2025","v":"2025"},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"更早","v":"更早"}]},{"key":"by","name":"排序","value":[{"n":"全部","v":""},{"n":"添加时间","v":"time_add"},{"n":"更新时间","v":"time_update"},{"n":"人气排序","v":"hits"},{"n":"评分排序","v":"score"}]}],
            "2": [{"key":"class","name":"类型","value":[{"n":"全部","v":""},{"n":"国产剧","v":"13"},{"n":"港台剧","v":"14"},{"n":"日剧","v":"15"},{"n":"韩剧","v":"33"},{"n":"欧美剧","v":"16"},{"n":"泰剧","v":"34"},{"n":"新马剧","v":"35"},{"n":"其他剧","v":"25"}]},{"key":"area","name":"地區","value":[{"n":"全部","v":""},{"n":"大陆","v":"大陆"},{"n":"香港","v":"香港"},{"n":"台湾","v":"台湾"},{"n":"韩国","v":"韩国"},{"n":"日本","v":"日本"},{"n":"美国","v":"美国"},{"n":"法国","v":"法国"},{"n":"英国","v":"英国"},{"n":"德国","v":"德国"},{"n":"泰国","v":"泰国"},{"n":"印度","v":"印度"},{"n":"意大利","v":"意大利"},{"n":"西班牙","v":"西班牙"},{"n":"加拿大","v":"加拿大"},{"n":"其他","v":"其他"}]},{"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2026","v":"2026"},{"n":"2025","v":"2025"},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010-2000","v":"2010-2000"},{"n":"90年代","v":"90年代"},{"n":"80年代","v":"80年代"},{"n":"更早","v":"更早"}]},{"key":"by","name":"排序","value":[{"n":"全部","v":""},{"n":"添加时间","v":"time_add"},{"n":"更新时间","v":"time_update"},{"n":"人气排序","v":"hits"},{"n":"评分排序","v":"score"}]}],
            "3": [{"key":"class","name":"类型","value":[{"n":"全部","v":""},{"n":"内地综艺","v":"27"},{"n":"港台综艺","v":"28"},{"n":"日本综艺","v":"29"},{"n":"韩国综艺","v":"36"}]},{"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2026","v":"2026"},{"n":"2025","v":"2025"},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010-2000","v":"2010-2000"},{"n":"90年代","v":"90年代"},{"n":"80年代","v":"80年代"},{"n":"更早","v":"更早"}]},{"key":"by","name":"排序","value":[{"n":"全部","v":""},{"n":"添加时间","v":"time_add"},{"n":"更新时间","v":"time_update"},{"n":"人气排序","v":"hits"},{"n":"评分排序","v":"score"}]}],
            "4": [{"key":"class","name":"类型","value":[{"n":"全部","v":""},{"n":"国产动漫","v":"31"},{"n":"日本动漫","v":"32"},{"n":"欧美动漫","v":"42"},{"n":"其他动漫","v":"43"}]},{"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2026","v":"2026"},{"n":"2025","v":"2025"},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"2010-2000","v":"2010-2000"},{"n":"90年代","v":"90年代"},{"n":"80年代","v":"80年代"},{"n":"更早","v":"更早"}]},{"key":"by","name":"排序","value":[{"n":"全部","v":""},{"n":"添加时间","v":"time_add"},{"n":"更新时间","v":"time_update"},{"n":"人气排序","v":"hits"},{"n":"评分排序","v":"score"}]}]
    };
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
  const area = extend && extend.area ? extend.area : '';
  const year = extend && extend.year ? extend.year : '';
  const by = extend && extend.by ? extend.by : '';
  const url = `${host}/vodshow/${cat}-${area}-${by}------${pg}---${year}/`;
  const html = (await req(url, { headers })) && (await req(url, { headers })).content || '';
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
