var rule = {
    title: '腾云驾雾[QuickJS版]',
    host: 'https://v.qq.com',
    homeUrl: '/x/bu/pagesheet/list?_all=1&append=1&channel=cartoon&listpage=1&offset=0&pagesize=21&iarea=-1&sort=18',
    detailUrl: 'https://node.video.qq.com/x/api/float_vinfo2?cid=fyid',
    searchUrl: '/x/search/?q=**&stag=fypage',
    searchable: 2,
    filterable: 1,
    multi: 1,
    url: '/x/bu/pagesheet/list?_all=1&append=1&channel=fyclass&listpage=1&offset=((fypage-1)*21)&pagesize=21&iarea=-1',
    filter_url: 'sort={{fl.sort or 75}}&iyear={{fl.iyear}}&year={{fl.year}}&itype={{fl.type}}&ifeature={{fl.feature}}&iarea={{fl.area}}&itrailer={{fl.itrailer}}&gender={{fl.sex}}',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },
    timeout: 5000,
    class_name: '电影&电视剧&综艺&动漫&少儿&纪录片',
    class_url: 'movie&tv&variety&cartoon&child&doco',
    play_parse: true,

    /* 修正一：优化播放地址获取 (Lazy Load)
       移除 eval，改用严格的 JSON 提取
    */
    lazy: $js.toString(() => {
        let url = input.split("?")[0];
        // 这里可以配置多个备用解析接口
        let jxUrl = "https://cache.json.icu/home/api?type=ys&uid=292796&key=fnoryABDEFJNPQV269&url=" + url;
        
        try {
            let responseText = request(jxUrl, { timeout: 5000 });
            let json = JSON.parse(responseText);
            if (json && json.url) {
                input = {
                    url: json.url,
                    header: rule.headers,
                    parse: 0
                };
            }
        } catch (e) {
            console.log("解析出错: " + e.message);
        }
    }),

    /* 修正二：一级列表解析 
    */
    推荐: '.list_item;img&&alt;img&&src;a&&Text;a&&data-float',
    一级: '.list_item;img&&alt;img&&src;a&&Text;a&&data-float',

    /* 修正三：二级详情页解析
       移除 eval()，手动解析腾讯非标准 JSON (QZOutputJson)
    */
    二级: $js.toString(() => {
        VOD = {};
        let html = request(input);
        
        // 提取影片 ID
        let cid = input.includes("cid=") ? input.match(/cid=(\w+)/)[1] : input.split("/").pop().replace(".html", "");

        try {
            // 清理腾讯 API 返回的非标格式（如 var QZOutputJson = ... ;）
            let jsonStr = html.substring(html.indexOf('{'), html.lastIndexOf('}') + 1);
            let json = JSON.parse(jsonStr);
            
            VOD = {
                vod_name: json.c.title,
                type_name: json.typ ? json.typ.join(",") : "类型未知",
                vod_actor: json.nam ? json.nam.join(",") : "主演未知",
                vod_year: json.c.year,
                vod_content: json.c.description,
                vod_remarks: json.rec || "",
                vod_pic: json.c.pic
            };

            let playUrls = [];
            // 处理选集逻辑
            if (json.c.video_ids && json.c.video_ids.length > 0) {
                json.c.video_ids.forEach((vid, index) => {
                    let title = (index + 1).toString();
                    let playUrl = `https://v.qq.com/x/cover/${cid}/${vid}.html`;
                    playUrls.push(title + "$" + playUrl);
                });
            } else {
                playUrls.push("正片$https://v.qq.com/x/cover/" + cid + ".html");
            }
            
            VOD.vod_play_from = "腾讯视频";
            VOD.vod_play_url = playUrls.join("#");
            
        } catch (e) {
            console.log("详情页解析失败: " + e.message);
        }
    }),

    /* 修正四：搜索逻辑
    */
    搜索: $js.toString(() => {
        let d = [];
        let html = request(input);
        // 使用 FongMi 内置的 pdfa 提取列表
        let items = pdfa(html, 'body&&.result_item_v');
        
        items.forEach(it => {
            let title = pdfh(it, '.result_title&&a&&Text').replace(/\s+/g, "");
            let img = pd(it, '.figure_pic&&src');
            let content = pdfh(it, '.desc_text&&Text');
            let rData = pdfh(it, 'div&&r-data');
            
            // 使用正则安全提取 CID
            let cidMatch = rData.match(/cid=(.*?)&/) || rData.match(/\/([a-zA-Z0-9]+)\.html/);
            if (cidMatch) {
                let cid = cidMatch[1];
                d.push({
                    title: title,
                    img: img,
                    content: content,
                    url: "https://node.video.qq.com/x/api/float_vinfo2?cid=" + cid
                });
            }
        });
        setResult(d);
    }),
}
