// 引入必要的库 (Node.js 环境)
// const axios = require('axios');
// const cheerio = require('cheerio');

const rule = {
    title: '腾云驾雾[官]',
    host: 'https://v.qq.com',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    },

    // --- 分类列表 (对应原本的一级) ---
    async getCategoryList(channel = 'movie', page = 1) {
        const offset = (page - 1) * 21;
        const url = `${this.host}/x/bu/pagesheet/list?_all=1&append=1&channel=${channel}&listpage=1&offset=${offset}&pagesize=21&iarea=-1`;
        
        try {
            const { data } = await axios.get(url, { headers: this.headers });
            const $ = cheerio.load(data);
            let results = [];

            $('.list_item').each((i, el) => {
                const img = $(el).find('img');
                const link = $(el).find('a');
                results.push({
                    title: img.attr('alt'),
                    pic: img.attr('src'),
                    text: link.text().trim(),
                    cid: link.attr('data-float') // 腾讯的 ID
                });
            });
            return results;
        } catch (err) {
            console.error("抓取分布列表错误:", err);
        }
    },

    // --- 详情与选集 (对应原本的二级) ---
    async getDetail(cid) {
        // 腾讯视频的 API 接口
        const detailApi = `https://node.video.qq.com/x/api/float_vinfo2?cid=${cid}`;
        
        try {
            const { data } = await axios.get(detailApi, { headers: this.headers });
            
            // 基础信息
            const vod = {
                vod_name: data.c.title,
                type_name: data.typ.join(","),
                vod_actor: data.nam.join(","),
                vod_year: data.c.year,
                vod_content: data.c.description,
                vod_remarks: data.rec,
                vod_pic: data.c.pic
            };

            // 处理选集 (简化原本复杂的逻辑)
            let videoIds = data.c.video_ids;
            let playlist = [];

            if (videoIds && videoIds.length > 0) {
                videoIds.forEach(vid => {
                    playlist.push({
                        title: vid, // 原本需要透过 union API 获取具体标题，此处简化
                        url: `https://v.qq.com/x/cover/${cid}/${vid}.html`
                    });
                });
            }

            return { vod, playlist };
        } catch (err) {
            console.error("获取详情错误:", err);
        }
    },

    // --- 搜索功能 ---
    async search(keyword) {
        const searchUrl = `${this.host}/x/search/?q=${encodeURIComponent(keyword)}`;
        
        try {
            const { data } = await axios.get(searchUrl, { headers: this.headers });
            const $ = cheerio.load(data);
            let results = [];

            $('.result_item_v').each((i, el) => {
                const fromTag = $(el).find('.result_source').text();
                // 仅保留腾讯视频来源的结果
                if (fromTag.includes('腾讯')) {
                    const rData = $(el).find('div[r-data]').attr('r-data');
                    const cidMatch = rData ? rData.match(/cid=(.*?)&/) : null;
                    
                    results.push({
                        title: $(el).find('.result_title').text().trim(),
                        img: $(el).find('.figure_pic').attr('src'),
                        cid: cidMatch ? cidMatch[1] : '',
                        desc: $(el).find('.type').text().trim()
                    });
                }
            });
            return results;
        } catch (err) {
            console.error("搜索错误:", err);
        }
    },

    // --- 解析地址 (对应原本的 lazy) ---
    async getPlayUrl(rawUrl) {
        // 原本规则中使用了多个第三方解析接口
        // 这里展示如何发起请求获取解析后的位址
        const jxApi = "https://cache.json.icu/home/api?type=ys&uid=292796&key=fnoryABDEFJNPQV269&url=";
        
        try {
            const { data } = await axios.get(jxApi + encodeURIComponent(rawUrl));
            return data.url || rawUrl;
        } catch (err) {
            return rawUrl;
        }
    }
};
