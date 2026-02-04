var rule = {
    title: '腾云驾雾[官]',
    host: 'https://v.%71%71.com',
    // homeUrl: '/x/bu/pagesheet/list?_all=1&append=1&channel=choice&listpage=1&offset=0&pagesize=21&iarea=-1&sort=18',
    homeUrl: '/x/bu/pagesheet/list?_all=1&append=1&channel=cartoon&listpage=1&offset=0&pagesize=21&iarea=-1&sort=18',
    detailUrl: 'https://node.video.%71%71.com/x/api/float_vinfo2?cid=fyid',
    searchUrl: '/x/search/?q=**&stag=fypage',
    searchable: 2,
    filterable: 1,
    multi: 1,
    // url:'/channel/fyclass?listpage=fypage&channel=fyclass&sort=18&_all=1',
    url: '/x/bu/pagesheet/list?_all=1&append=1&channel=fyclass&listpage=1&offset=((fypage-1)*21)&pagesize=21&iarea=-1',
    // filter_url: 'sort={{fl.sort or 18}}&year={{fl.year}}&pay={{fl.pay}}',
    // filter_url: 'sort={{fl.sort or 75}}&year={{fl.year}}&pay={{fl.pay}}',
    filter_url: 'sort={{fl.sort or 75}}&iyear={{fl.iyear}}&year={{fl.year}}&itype={{fl.type}}&ifeature={{fl.feature}}&iarea={{fl.area}}&itrailer={{fl.itrailer}}&gender={{fl.sex}}',
    // filter: 'H4sIAAAAAAAAA+2UzUrDQBCA32XOEZLUJrGvIj0saaDBNisxBkIJCG3Fi4oepIg3EQoieqiH+vM23Zq+hRuaZLZ4ce9z2/lmd2d2+NgR+H0e+gF0DkdwFGTQgRMeJ2BAxIaSwvrqVnxcyzhlg9PttqjED2c/45cSy8DyIDcavr57q/lBw8XTd/E6qbnT8M3zTFyc72RtC/Jumd+2c8wy7KZ4nxSL5Z9uxHS+Gc+r83sWVp1eVttl4Dluk1h93YubWZVwduplAYuxoFguVp+P/y5om/Z+/YxyqfAW8pbKbeS2yi3kO/ebyE2Fy1nXXBm7DDzknspd5K7KHeSOytvI2+XAugYkKWlD2mhrM+RpSB8OmaNvTsriMEgycofc0XbHZ3HCeUTukDv67vTDQY/MIXO0zelxn5M4JI6mOPkvgswSEpgPAAA=',
    //DevToys Gzip解压 https://devtoys.app/download
    filter: 'H4sIAAAAAAAACu1Y308aWRT+X+ZZEwYQpI9us+lmk+3LZh9248PEzkZSlYaiqWlMoAgiNuOPWnArUn+Ulaogdl0Xh0L/mbl3Zv6LvYNczplebEla9EWeZr7Lvfece875vnPnuTQxGQlPqNK9P55Lj9V56Z70NBKNSUPSjDLNUIlqG0RfZe9zytTs1d9mHLgQN5MVB2YvwRFpYaiL01ytg4/6ujgpNa3TRY7L0sK4M3K1YXheVaKwI7k8NxoHwo4kVbaT5c4Kw3J3Za/HG+ig7UeEjwAOFrIXP+B+jPsAB8vZixdwL8ZlwF32eAD3IFwOdXH2iPBRwEcxHgQ8iHHwlz0iHPxlj+yEx4ek2NxAIhsM9Y6sYw+K7J+qEpuNqrCnedYgxZW+Y2tmzmgyxdeGLVffWQcchojQFydmbr0DQwDtZJPUX3RgiDepXhCd+wluklyBLB92YDhd4+MuKS1x72HLyt9Ga5enNSyS3qZ5biAcFd1JWrUV7g6khr3znqw3OY7c12qkWuQ48mhng26VOA4umS81MNJJAY4frpPLBgoRx4+LNBvnOHhlaovo/8ytu2K9kWKdjsyFb5WJY/NPvqFYs6dm80iss+wZ+ZQXitVVZ7KH/VAeJyvWXjcv2VBA7l3k7Xmha+jCGbuuBtiQjIgjsUbjOTwGtUmyZXPTNQ8dcWbL0JfxfoHe9NKeB1nBHHfbiWSFFfBndgZ6s017DHGiliarH/CaMGbFE+byEp4H6WCVPkE0EVytkeZr9yxHzFCy3Kn2wIhgTomG1dj8QKjAaW3u+PxG+HxCicYikZnbZHQlqiqotS7UyEu9b0Yn6RSbIbRfNF+ihROx/To5NFuawCQkdWE0OLn6v6Pc4CYl1Jvn/ddQJ7IuvWH/9V4wmjE7zXHRQhFYK5onXfFB+rHCpEdoDu3KJphyTdeFLghuZUM9Zr5E6nWxq6O7e2S7qzBo/cJbQ9dR98b/r5XNtbTYNbqVA51kY5Wk6l+OpyOid2RyM2QyGZ56NJjLXKA3lXym90/VZ2i/+CHJHPfPJKV/SIWXGarhzf8A9g6IuHxfIy53Rn8loe3WIq3+27clnmEf+ZAQHPcPBwAGS4LDIYDBbtnDUKNRMupZsb1OlV1WXTFQO2MeRSYig0kYN42HY1ElPKXic1rSyasEzV32fU5jYz+I1/ztptNFF2pAW+D3g7GH/JxkZOcvD34W49smOHt/3U68Ekj6p19/4+uM+BAZa/vm+b5rDtsHtv/9/o8AQ/1YqZZVPbWWjkjmQmRsspYxmgVa0GmR11igdxaOfD+dZMaYi9wYdMdqafbB2253D/i7lvHxjZCCTFFojl8GkNEu7cDfPwydf+iAQDBtBuUDfrTO95nWiMLEYgDajD9nNI/oXkaIpPtrBupL8ikK+tmu7/GF/wEtl6Q8+BQAAA==',
    headers: {
        'User-Agent': 'PC_UA'
    },
    timeout: 5000,
    // class_parse:'.site_channel a;a&&Text;a&&href;channel/(.*)',
    cate_exclude: '会员|游戏|全部',
    // class_name: '精选&电视剧&电影&综艺&动漫&少儿&纪录片',
    // class_url: 'choice&tv&movie&variety&cartoon&child&doco',
    class_name: '电影&电视剧&综艺&动漫&少儿&纪录片',
    class_url: 'movie&tv&variety&cartoon&child&doco',
    limit: 20,
    play_parse: true,
    lazy: $js.toString(() => {
  let d = [];
    const blockedField = 'https://123.yp22.cn/d/le/53SqFaimyxG6LrduZ';
  try {
    // 发起请求并获取响应，添加请求头
    let headers = {
      'User-Agent': 'okhttp/4.12.0'
      
    };
    let responseText = request("http://150.158.112.123/%E5%85%AC%E4%BC%97%E5%8F%B7~%E7%8E%89%E7%8E%89%E5%BA%94%E7%94%A8%E7%AC%94%E8%AE%B0/jiexi.php?url=" + input, { headers: headers });
    console.log("响应文本:", responseText); // 查看原始响应内容
//备用http://llyh.xn--yi7aa.top/api/?key=5b317c16d457b31a3150d87c0a362a9e&url=
    // 解析 JSON 数据
    let response = JSON.parse(responseText);

    // 查找以 'url' 开头的字段
    let urlField = Object.keys(response).find(key => key.startsWith('url'));

    // 提取找到的字段值
    let urlValue = urlField ? response[urlField] : null;

    console.log("提取的随机字段值:", urlValue); // 查看提取的值
        if (response.url.includes(blockedField)) {
        throw new Error('该链接已被屏蔽');
    };
    if (urlValue) {
      // 处理 urlValue，或将其用于 input
      input = {
        url: urlValue,
        parse: 0,
        header: rule.headers
      };
    } else {
      // 处理没有找到字段的情况
      console.error("没有找到以 'url' 开头的字段");
    }
  } catch (error) {
    console.error("处理请求或数据时发生错误：", error);
  }

  setResult(d);
}),

    //lazy:'js:input="http:\\/\\/43.248.100.147:6068\\/KEY\\/XGJ\\/root\\/key\\/60.php?url="+input.split("?")[0];log(input);let html=JSON.parse(request(input));log(html);input=html.url||input',
    lazy: 'js:input="https://cache.json.icu/home/api?type=ys&uid=292796&key=fnoryABDEFJNPQV269&url="+input.split("?")[0];log(input);let html=JSON.parse(request(input));log(html);input=html.url||input',
    推荐: '.list_item;img&&alt;img&&src;a&&Text;a&&data-float',
    一级: '.list_item;img&&alt;img&&src;a&&Text;a&&data-float',
    二级: $js.toString(() => {
        VOD = {};
        let d = [];
        let video_list = [];
        let video_lists = [];
        let list = [];
        let QZOutputJson;
        let html = fetch(input, fetch_params);
        let sourceId = /get_playsource/.test(input) ? input.match(/id=(\d*?)&/)[1] : input.split("cid=")[1];
        let cid = sourceId;
        let detailUrl = "https://v.%71%71.com/detail/m/" + cid + ".html";
        log("详情页:" + detailUrl);
        pdfh = jsp.pdfh;
        pd = jsp.pd;
        try {
            let json = JSON.parse(html);
            VOD = {
                vod_url: input,
                vod_name: json.c.title,
                type_name: json.typ.join(","),
                vod_actor: json.nam.join(","),
                vod_year: json.c.year,
                vod_content: json.c.description,
                vod_remarks: json.rec,
                vod_pic: urljoin2(input, json.c.pic)
            }
        } catch (e) {
            log("解析片名海报等基础信息发生错误:" + e.message)
        }
        if (/get_playsource/.test(input)) {
            eval(html);
            let indexList = QZOutputJson.PlaylistItem.indexList;
            indexList.forEach(function(it) {
                let dataUrl = "https://s.video.qq.com/get_playsource?id=" + sourceId + "&plat=2&type=4&data_type=3&range=" + it + "&video_type=10&plname=qq&otype=json";
                eval(fetch(dataUrl, fetch_params));
                let vdata = QZOutputJson.PlaylistItem.videoPlayList;
                vdata.forEach(function(item) {
                    d.push({
                        title: item.title,
                        pic_url: item.pic,
                        desc: item.episode_number + "\t\t\t播放量：" + item.thirdLine,
                        url: item.playUrl
                    })
                });
                video_lists = video_lists.concat(vdata)
            })
        } else {
            let json = JSON.parse(html);
            video_lists = json.c.video_ids;
            let url = "https://v.qq.com/x/cover/" + sourceId + ".html";
            if (video_lists.length === 1) {
                let vid = video_lists[0];
                url = "https://v.qq.com/x/cover/" + cid + "/" + vid + ".html";
                d.push({
                    title: "在线播放",
                    url: url
                })
            } else if (video_lists.length > 1) {
                for (let i = 0; i < video_lists.length; i += 30) {
                    video_list.push(video_lists.slice(i, i + 30))
                }
                video_list.forEach(function(it, idex) {
                    let o_url = "https://union.video.qq.com/fcgi-bin/data?otype=json&tid=1804&appid=20001238&appkey=6c03bbe9658448a4&union_platform=1&idlist=" + it.join(",");
                    let o_html = fetch(o_url, fetch_params);
                    eval(o_html);
                    QZOutputJson.results.forEach(function(it1) {
                        it1 = it1.fields;
                        let url = "https://v.qq.com/x/cover/" + cid + "/" + it1.vid + ".html";
                        d.push({
                            title: it1.title,
                            pic_url: it1.pic160x90.replace("/160", ""),
                            desc: it1.video_checkup_time,
                            url: url,
                            type: it1.category_map && it1.category_map.length > 1 ? it1.category_map[1] : ""
                        })
                    })
                })
            }
        }
        let yg = d.filter(function(it) {
            return it.type && it.type !== "正片"
        });
        let zp = d.filter(function(it) {
            return !(it.type && it.type !== "正片")
        });
        VOD.vod_play_from = yg.length < 1 ? "正片" : "正片$$$预告及花絮";
        VOD.vod_play_url = yg.length < 1 ? d.map(function(it) {
            return it.title + "$" + it.url
        }).join("#") : [zp, yg].map(function(it) {
            return it.map(function(its) {
                return its.title + "$" + its.url
            }).join("#")
        }).join("$$$");
    }),
    搜索: $js.toString(() => {
        let d = [];
        pdfa = jsp.pdfa;
        pdfh = jsp.pdfh;
        pd = jsp.pd;
        let html = request(input);
        let baseList = pdfa(html, "body&&.result_item_v");
        log(baseList.length);
        baseList.forEach(function(it) {
            let longText = pdfh(it, ".result_title&&a&&Text");
            let shortText = pdfh(it, ".type&&Text");
            let fromTag = pdfh(it, ".result_source&&Text");
            let score = pdfh(it, ".figure_info&&Text");
            let content = pdfh(it, ".desc_text&&Text");
            // let url = pdfh(it, ".result_title&&a&&href");
            let url = pdfh(it, "div&&r-data");
            // log(longText);
            // log(shortText);
            // log('url:'+url);
            let img = pd(it, ".figure_pic&&src");
            url = "https://node.video.qq.com/x/api/float_vinfo2?cid=" + url.match(/.*\/(.*?)\.html/)[1];
            log(shortText + "|" + url);
            if (fromTag.match(/腾讯/)) {
                d.push({
                    title: longText.split(shortText)[0],
                    img: img,
                    url: url,
                    content: content,
                    desc: shortText + " " + score
                })
            }
        });
        setResult(d);
    }),
}



