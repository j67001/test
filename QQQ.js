var rule = {
    title: '腾讯视频[PB-QuickJS]',
    host: 'https://v.qq.com',
    apihost: 'https://pbaccess.video.qq.com',
    searchable: 2,
    filterable: 1, // 必须开启此开关
    multi: 1,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Origin': 'https://v.qq.com',
        'Referer': 'https://v.qq.com/'
    },
    timeout: 5000,
    class_name: '电视剧&电影&综艺&纪录片&动漫&少儿&短剧',
    class_url: '100113&100173&100109&100105&100119&100150&110755',
    
    // 补全 Filter 数据，防止页面空白
    filter: {
        "100113": [{"key":"sort","name":"排序","value":[{"n":"最热","v":"75"},{"n":"最新","v":"79"}]},{"key":"iarea","name":"地区","value":[{"n":"全部","v":"-1"},{"n":"内地","v":"1"},{"n":"香港","v":"2"},{"n":"台湾","v":"3"}]}],
        "100173": [{"key":"sort","name":"排序","value":[{"n":"最热","v":"75"},{"n":"最新","v":"83"}]}],
        "100119": [{"key":"sort","name":"排序","value":[{"n":"最热","v":"75"},{"n":"最新","v":"83"}]}]
    },

    推荐: $js.toString(() => {
        let vlist = [];
        try {
            // 注意：这里要用 rule.host
            let html = request(rule.host, {headers: rule.headers});
            let script = pdfh(html, "script:contains('window.__INITIAL_STATE__')&&Text");
            if (script) {
                let jsonStr = script.substring(script.indexOf('=') + 1);
                let sd = JSON.parse(jsonStr);
                let cards = sd.storeModulesData.channelsModulesMap.choice.cardListData;
                cards.forEach(card => {
                    if (card.children_list && card.children_list.list && card.children_list.list.cards) {
                        card.children_list.list.cards.forEach(it => {
                            let p = it.params;
                            if (p && p.title && p.cid) {
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
        } catch (e) {
            log("推荐解析错误: " + e.message);
        }
        setResult(vlist);
    }),

    一级: $js.toString(() => {
        let vlist = [];
        try {
            let body = {
                "page_params": {
                    "channel_id": input,
                    "filter_params": "sort=" + (MY_FL.sort || "75") + "&iyear=" + (MY_FL.iyear || "-1") + "&iarea=" + (MY_FL.iarea || "-1"),
                    "page_type": "channel_operation",
                    "page_id": "channel_list_second_page"
                }
            };
            if (parseInt(MY_PAGE) > 1) {
                body.page_params.page_context = "page_num=" + (parseInt(MY_PAGE) - 1);
            }

            let apiUrl = 'https://pbaccess.video.qq.com/trpc.universal_backend_service.page_server_rpc.PageServer/GetPageData?video_appid=1000005&vplatform=2';
            let res = post(apiUrl, {
                body: body,
                headers: rule.headers
            });
            let data = JSON.parse(res).data;
            let moduleList = data.module_list_datas;
            let items = moduleList[moduleList.length - 1].module_datas[0].item_data_lists.item_datas;
            
            items.forEach(it => {
                let p = it.item_params;
                if (p && p.cid) {
                    vlist.push({
                        vod_id: p.cid,
                        vod_name: p.mz_title || p.title,
                        vod_pic: p.new_pic_vt || p.new_pic_hz,
                        vod_remarks: p.update_info || ""
                    });
                }
            });
        } catch (e) {
            log("一级解析错误: " + e.message);
        }
        setResult(vlist);
    }),

    二级: $js.toString(() => {
        VOD = {};
        try {
            let cid = input;
            let infoBody = { "page_params": { "req_from": "web", "cid": cid, "page_type": "detail_operation", "page_id": "detail_page_introduction" } };
            let infoRes = post('https://pbaccess.video.qq.com/trpc.universal_backend_service.page_server_rpc.PageServer/GetPageData?video_appid=3000010&vplatform=2', {
                body: infoBody,
                headers: rule.headers
            });
            let infoJson = JSON.parse(infoRes).data;
            let d = infoJson.module_list_datas[0].module_datas[0].item_data_lists.item_datas[0].item_params;

            VOD.vod_name = d.title;
            VOD.vod_pic = d.new_pic_vt;
            VOD.vod_type = d.sub_genre;
            VOD.vod_year = d.year;
            VOD.vod_area = d.area_name;
            VOD.vod_content = d.cover_description;
            VOD.vod_remarks = d.hotval || "";

            let epBody = { "page_params": { "req_from": "web_vsite", "page_id": "vsite_episode_list", "page_type": "detail_operation", "cid": cid, "id_type": "1" } };
            let epRes = post('https://pbaccess.video.qq.com/trpc.universal_backend_service.page_server_rpc.PageServer/GetPageData?video_appid=3000010&vplatform=2', {
                body: epBody,
                headers: rule.headers
            });
            let epJson = JSON.parse(epRes).data;
            let epItems = epJson.module_list_datas[epJson.module_list_datas.length - 1].module_datas[0].item_data_lists.item_datas;
            
            let playUrls = epItems.map(it => {
                let title = it.item_params.union_title || it.item_params.title;
                return title + "$" + cid + "@" + it.item_id;
            });

            VOD.vod_play_from = "腾讯视频";
            VOD.vod_play_url = playUrls.join("#");
        } catch (e) {
            log("二级解析错误: " + e.message);
        }
    }),

    搜索: $js.toString(() => {
        let vlist = [];
        try {
            let body = { "version": "24072901", "query": input, "pagenum": 0, "pagesize": 30, "clientType": 1 };
            let res = post('https://pbaccess.video.qq.com/trpc.videosearch.mobile_search.MultiTerminalSearch/MbSearch?vplatform=2', {
                body: body,
                headers: rule.headers
            });
            let data = JSON.parse(res).data;
            data.areaBoxList[data.areaBoxList.length - 1].itemList.forEach(it => {
                if (it.doc && it.doc.id) {
                    vlist.push({
                        vod_id: it.doc.id,
                        vod_name: it.videoInfo.title,
                        vod_pic: it.videoInfo.imgUrl,
                        vod_remarks: it.videoInfo.publishInfo || ""
                    });
                }
            });
        } catch (e) {
            log("搜索错误: " + e.message);
        }
        setResult(vlist);
    }),

    lazy: $js.toString(() => {
        let ids = input.split('@');
        let url = "https://v.qq.com/x/cover/" + ids[0] + "/" + ids[1] + ".html";
        input = {
            url: "https://jx.xmflv.com/?url=" + url,
            header: rule.headers,
            parse: 1
        };
    }),
}
