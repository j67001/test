var rule = {
    title: '腾讯视频[PBACCESS-QuickJS]',
    host: 'https://v.qq.com',
    apihost: 'https://pbaccess.video.qq.com',
    // 模拟真实浏览器环境，避免被 gRPC 网关拒绝
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Origin': 'https://v.qq.com',
        'Referer': 'https://v.qq.com/'
    },
    timeout: 5000,

    // 分类配置（对应 Python 版的 cdata）
    class_name: '电视剧&电影&综艺&纪录片&动漫&少儿&短剧',
    class_url: '100113&100173&100109&100105&100119&100150&110755',

    /* 1. 首页推荐 (对应 Python homeVideoContent) */
    推荐: $js.toString(() => {
        let vlist = [];
        try {
            let html = request(HOST);
            // 提取 window.__INITIAL_STATE__
            let script = pdfh(html, "script:contains('window.__INITIAL_STATE__')&&Text");
            if (script) {
                let jsonStr = script.split('window.__INITIAL_STATE__=')[1].split(';</script>')[0];
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
                                    vod_remarks: p.mz_subtitle || (p.imgtag ? JSON.parse(p.imgtag).tag_4.text : "")
                                });
                            }
                        });
                    }
                });
            }
        } catch (e) {
            log("首页解析失败: " + e.message);
        }
        setResult(vlist);
    }),

    /* 2. 一级分页 (对应 Python categoryContent) */
    一级: $js.toString(() => {
        let body = {
            "page_params": {
                "channel_id": input,
                "filter_params": "sort=" + (MY_FL.sort || "75"),
                "page_type": "channel_operation",
                "page_id": "channel_list_second_page"
            }
        };
        // 处理分页 (QuickJS 环境下通常使用 MY_PAGE 变量)
        if (parseInt(MY_PAGE) > 1) {
            body.page_context = "page_num=" + (parseInt(MY_PAGE) - 1); 
        }

        let apiUrl = 'https://pbaccess.video.qq.com/trpc.universal_backend_service.page_server_rpc.PageServer/GetPageData?video_appid=1000005&vplatform=2';
        let res = post(apiUrl, {
            body: body,
            headers: rule.headers
        });
        
        let vlist = [];
        try {
            let data = JSON.parse(res).data;
            let moduleList = data.module_list_datas;
            // 获取最后一个模块（通常是列表数据）
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
            log("一级解析失败: " + e.message);
        }
        setResult(vlist);
    }),

    /* 3. 二级详情 (对应 Python detailContent) */
    二级: $js.toString(() => {
        VOD = {};
        let cid = input;
        
        // A. 获取影片基本信息
        let infoBody = {
            "page_params": { "req_from": "web", "cid": cid, "page_type": "detail_operation", "page_id": "detail_page_introduction" }
        };
        let infoRes = post('https://pbaccess.video.qq.com/trpc.universal_backend_service.page_server_rpc.PageServer/GetPageData?video_appid=3000010&vplatform=2', {
            body: infoBody, headers: rule.headers
        });
        
        // B. 获取剧集列表 (vsite_episode_list)
        let epBody = {
            "page_params": { "req_from": "web_vsite", "page_id": "vsite_episode_list", "page_type": "detail_operation", "cid": cid, "id_type": "1" }
        };
        let epRes = post('https://pbaccess.video.qq.com/trpc.universal_backend_service.page_server_rpc.PageServer/GetPageData?video_appid=3000010&vplatform=2', {
            body: epBody, headers: rule.headers
        });

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
            
            let playUrls = epItems.map(it => {
                let title = it.item_params.union_title || it.item_params.title;
                let vid = it.item_id;
                // 拼接 ID 供播放器解析
                return title + "$" + cid + "@" + vid;
            });

            VOD.vod_play_from = "腾讯视频";
            VOD.vod_play_url = playUrls.join("#");
        } catch (e) {
            log("详情解析失败: " + e.message);
        }
    }),

    /* 4. 搜索解析 (对应 Python searchContent) */
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
        
        let vlist = [];
        try {
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
            log("搜索解析失败: " + e.message);
        }
        setResult(vlist);
    }),

    /* 5. 播放解析 (对应 Python playerContent) */
    lazy: $js.toString(() => {
        let ids = input.split('@');
        let url = "https://v.qq.com/x/cover/" + ids[0] + "/" + ids[1] + ".html";
        
        // 直接返回解析接口
        input = {
            url: "https://jx.xmflv.com/?url=" + url,
            header: rule.headers,
            parse: 1
        };
    }),
};
