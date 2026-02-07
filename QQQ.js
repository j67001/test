var rule = {
    title: '腾讯视频[PB-QuickJS-Filter]',
    host: 'https://v.qq.com',
    apihost: 'https://pbaccess.video.qq.com',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Origin': 'https://v.qq.com',
        'Referer': 'https://v.qq.com/'
    },
    timeout: 5000,
    class_name: '电视剧&电影&综艺&纪录片&动漫&少儿&短剧',
    class_url: '100113&100173&100109&100105&100119&100150&110755',
    
    // 筛选器配置 (对应 Python 版 get_filter_data 解析后的结果)
    filter: {
        "100113": [{"key": "sort", "name": "排序", "value": [{"n": "最热", "v": "75"}, {"n": "最新", "v": "79"}]}, {"key": "iarea", "name": "地区", "value": [{"n": "全部", "v": "-1"}, {"n": "内地", "v": "1"}, {"n": "香港", "v": "2"}, {"n": "台湾", "v": "3"}]}, {"key": "iyear", "name": "年份", "value": [{"n": "全部", "v": "-1"}, {"n": "2024", "v": "2024"}, {"n": "2023", "v": "2023"}, {"n": "2022", "v": "2022"}]}],
        "100173": [{"key": "sort", "name": "排序", "value": [{"n": "最热", "v": "75"}, {"n": "最新", "v": "83"}]}, {"key": "iarea", "name": "地区", "value": [{"n": "全部", "v": "-1"}, {"n": "内地", "v": "1"}, {"n": "美国", "v": "3"}, {"n": "香港", "v": "2"}]}],
        "100119": [{"key": "sort", "name": "排序", "value": [{"n": "最热", "v": "75"}, {"n": "最新", "v": "83"}]}, {"key": "itype", "name": "类型", "value": [{"n": "全部", "v": "-1"}, {"n": "玄幻", "v": "9"}, {"n": "热血", "v": "4"}]}]
    },

    推荐: $js.toString(() => {
        let vlist = [];
        try {
            let html = request(HOST);
            let script = pdfh(html, "script:contains('window.__INITIAL_STATE__')&&Text");
            if (script) {
                let jsonStr = script.split('window.__INITIAL_STATE__=')[1].split(';</script>')[0];
                let sd = JSON.parse(jsonStr);
                let cards = sd.storeModulesData.channelsModulesMap.choice.cardListData;
                cards.forEach(card => {
                    if (card.children_list?.list?.cards) {
                        card.children_list.list.cards.forEach(it => {
                            let p = it.params;
                            if (p?.title && p?.cid) {
                                vlist.push({
                                    vod_id: p.cid,
                                    vod_name: p.title,
                                    vod_pic: p.image_url || p.new_pic_vt,
                                    vod_remarks: p.mz_subtitle || ""
                                });
                            }
                        });
                    }
                });
            }
        } catch (e) {}
        setResult(vlist);
    }),

    一级: $js.toString(() => {
        // 拼接动态筛选参数 (对应 Python 的 josn_to_params)
        let filterParams = [];
        filterParams.push("sort=" + (MY_FL.sort || "75"));
        if (MY_FL.iarea) filterParams.push("iarea=" + MY_FL.iarea);
        if (MY_FL.iyear) filterParams.push("iyear=" + MY_FL.iyear);
        if (MY_FL.itype) filterParams.push("itype=" + MY_FL.itype);

        let body = {
            "page_params": {
                "channel_id": input,
                "filter_params": filterParams.join("&"),
                "page_type": "channel_operation",
                "page_id": "channel_list_second_page"
            }
        };
        
        if (parseInt(MY_PAGE) > 1) {
            body.page_context = "page_num=" + (parseInt(MY_PAGE) - 1);
        }

        let res = post('https://pbaccess.video.qq.com/trpc.universal_backend_service.page_server_rpc.PageServer/GetPageData?video_appid=1000005&vplatform=2', {
            body: body,
            headers: rule.headers
        });
        
        let vlist = [];
        try {
            let data = JSON.parse(res).data;
            let moduleList = data.module_list_datas;
            let items = moduleList[moduleList.length - 1].module_datas[0].item_data_lists.item_datas;
            items.forEach(it => {
                let p = it.item_params;
                if (p?.cid) {
                    vlist.push({
                        vod_id: p.cid,
                        vod_name: p.mz_title || p.title,
                        vod_pic: p.new_pic_vt || p.new_pic_hz,
                        vod_remarks: p.update_info || ""
                    });
                }
            });
        } catch (e) {}
        setResult(vlist);
    }),

    二级: $js.toString(() => {
        VOD = {};
        let cid = input;
        let infoBody = { "page_params": { "req_from": "web", "cid": cid, "page_type": "detail_operation", "page_id": "detail_page_introduction" } };
        let infoRes = post('https://pbaccess.video.qq.com/trpc.universal_backend_service.page_server_rpc.PageServer/GetPageData?video_appid=3000010&vplatform=2', { body: infoBody, headers: rule.headers });
        
        let epBody = { "page_params": { "req_from": "web_vsite", "page_id": "vsite_episode_list", "page_type": "detail_operation", "cid": cid, "id_type": "1" } };
        let epRes = post('https://pbaccess.video.qq.com/trpc.universal_backend_service.page_server_rpc.PageServer/GetPageData?video_appid=3000010&vplatform=2', { body: epBody, headers: rule.headers });

        try {
            let info = JSON.parse(infoRes).data.module_list_datas[0].module_datas[0].item_data_lists.item_datas[0].item_params;
            VOD = {
                vod_name: info.title,
                vod_pic: info.new_pic_vt,
                type_name: info.sub_genre,
                vod_year: info.year,
                vod_area: info.area_name,
                vod_content: info.cover_description,
                vod_remarks: info.hotval || ""
            };

            let epData = JSON.parse(epRes).data;
            let epItems = epData.module_list_datas[epData.module_list_datas.length - 1].module_datas[0].item_data_lists.item_datas;
            let playUrls = epItems.map(it => (it.item_params.union_title || it.item_params.title) + "$" + cid + "@" + it.item_id);
            VOD.vod_play_from = "腾讯视频";
            VOD.vod_play_url = playUrls.join("#");
        } catch (e) {
            VOD.vod_name = "解析失败";
            VOD.vod_play_url = "请更换接口#error";
        }
    }),

    搜索: $js.toString(() => {
        let body = { "version": "24072901", "query": input, "pagenum": 0, "pagesize": 30, "clientType": 1 };
        let res = post('https://pbaccess.video.qq.com/trpc.videosearch.mobile_search.MultiTerminalSearch/MbSearch?vplatform=2', { body: body, headers: rule.headers });
        let vlist = [];
        try {
            let data = JSON.parse(res).data;
            data.areaBoxList[data.areaBoxList.length - 1].itemList.forEach(it => {
                if (it.doc?.id) {
                    vlist.push({
                        vod_id: it.doc.id,
                        vod_name: it.videoInfo.title,
                        vod_pic: it.videoInfo.imgUrl,
                        vod_remarks: it.videoInfo.publishInfo || ""
                    });
                }
            });
        } catch (e) {}
        setResult(vlist);
    }),

    lazy: $js.toString(() => {
        let ids = input.split('@');
        let url = "https://v.qq.com/x/cover/" + ids[0] + (ids[1] ? "/" + ids[1] : "") + ".html";
        input = { url: "https://jx.xmflv.com/?url=" + url, header: rule.headers, parse: 1 };
    }),
};
