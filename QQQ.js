var rule = {
    title: '腾讯视频[PBACCESS]',
    host: 'https://v.qq.com',
    apihost: 'https://pbaccess.video.qq.com',
    // 腾讯 PB 接口需要较真实的 UA
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Origin': 'https://v.qq.com',
        'Referer': 'https://v.qq.com/'
    },
    timeout: 5000,
    
    // 分类定义
    class_name: '电视剧&电影&综艺&纪录片&动漫&少儿&短剧',
    class_url: '100113&100173&100109&100105&100119&100150&110755',
    
    /* 首页内容解析 (模拟 Python 的 homeVideoContent) */
    推荐: $js.toString(() => {
        let vlist = [];
        let html = request(HOST);
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
        setResult(vlist);
    }),

    /* 分类页解析 (模拟 Python 的 categoryContent) */
    一级: $js.toString(() => {
        let body = {
            "page_params": {
                "channel_id": input,
                "filter_params": "sort=" + (MY_FL.sort || "75") + "&iyear=" + (MY_FL.iyear || "-1") + "&iarea=" + (MY_FL.iarea || "-1"),
                "page_type": "channel_operation",
                "page_id": "channel_list_second_page"
            }
        };
        // 处理分页
        if (MY_PAGE > 1) {
            body.page_context = "page_num=" + MY_PAGE; // 实际开发中需根据 GetPageData 返回的 next_page_context 获取
        }

        let url = 'https://pbaccess.video.qq.com/trpc.universal_backend_service.page_server_rpc.PageServer/GetPageData?video_appid=1000005&vplatform=2';
        let res = post(url, {
            body: body,
            headers: rule.headers
        });
        let data = JSON.parse(res).data;
        let vlist = [];
        let items = data.module_list_datas[data.module_list_datas.length - 1].module_datas[0].item_data_lists.item_datas;
        
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
        setResult(vlist);
    }),

    /* 详情页解析 (模拟 Python 的 detailContent) */
    二级: $js.toString(() => {
        VOD = {};
        let cid = input;
        
        // 获取基本信息
        let infoBody = {
            "page_params": {
                "req_from": "web",
                "cid": cid,
                "page_type": "detail_operation",
                "page_id": "detail_page_introduction"
            }
        };
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

        // 获取选集列表 (模拟 VSITE EPISODE LIST)
        let epBody = {
            "page_params": {
                "req_from": "web_vsite",
                "page_id": "vsite_episode_list",
                "page_type": "detail_operation",
                "cid": cid,
                "id_type": "1"
            }
        };
        let epRes = post('https://pbaccess.video.qq.com/trpc.universal_backend_service.page_server_rpc.PageServer/GetPageData?video_appid=3000010&vplatform=2', {
            body: epBody,
            headers: rule.headers
        });
        let epJson = JSON.parse(epRes).data;
        let epItems = epJson.module_list_datas[epJson.module_list_datas.length - 1].module_datas[0].item_data_lists.item_datas;
        
        let playUrls = epItems.map(it => {
            let title = it.item_params.union_title || it.item_params.title;
            let vid = it.item_id;
            return title + "$" + cid + "@" + vid;
        });

        VOD.vod_play_from = "腾讯视频";
        VOD.vod_play_url = playUrls.join("#");
    }),

    /* 搜索解析 */
    搜索: $js.toString(() => {
        let body = {
            "version": "24072901",
            "query": input,
            "pagenum": 0,
            "pagesize": 30,
            "clientType": 1
        };
        let res = post('https://pbaccess.video.qq.com/trpc.videosearch.mobile_search.MultiTerminalSearch/MbSearch?vplatform=2', {
            body: body,
            headers: rule.headers
        });
        let data = JSON.parse(res).data;
        let vlist = [];
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
        setResult(vlist);
    }),

    /* 播放解析 */
    lazy: $js.toString(() => {
        let ids = input.split('@');
        let cid = ids[0];
        let vid = ids[1];
        let url = "https://v.qq.com/x/cover/" + cid + "/" + vid + ".html";
        
        // 使用您原本 Python 脚本中的解析接口
        input = {
            url: "https://jx.xmflv.com/?url=" + url,
            header: rule.headers,
            parse: 1
        };
    }),
}