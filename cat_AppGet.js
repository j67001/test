/*
title: 'AppGet模板', author: '小可乐/v5.11.3'
更新说明: 优化部分函数代码，支持带验证码搜索，自建搜索改为并发，提高搜索速度
ext参数标准格式:
"ext": {
    "host": "https://ceshi307386.oss-cn-beijing.aliyuncs.com/ceshi421.txt",
    "dataKey": "da61247f5b662597",
    "apiFlag": "1",
    "sechMode": "1",
    "showBans": "直播",
    "catesDeal": "全部,直播@电影>电视剧>综艺@电视剧>>剧集",
    "tabsDeal": "仓鼠原画@蓝光2K>HD高码率①@FF资源>>非凡",
    "playParse": "非凡$dplay",
    "siteName": "仓鼠"
}

ext各参数说明
host: 站点域名或跳转至站点域名的链接
dataKey: aes加密解密的密钥
dataIv: aes加密解密的向量，不写默认值与dataKey相同
apiFlag: qiji模板开关，默认为关，设为'1'后打开，切换为qiji模板
apiV: api的版本号，如'http…initV120'，apiV为V120，一般不用填，不知道不要乱填，会起反作用
ua: 自定义User-Agent，格式字符串，不写为模板内置的ua
timeout: 超时，格式字符串，不写为模板内置的参数
deviceId: 请求头app-user-device-id的值,根据需要填写
version: 请求头app-version-code的值,根据需要填写
token: 请求头app-user-token的值,根据需要填写
sechMode: 自建搜索模式开关，默认为关，设为'1'后打开，搜索会利用分类搜100页，站点搜索不可用可以切换为此模式
showBans: 推荐页禁止显示的分类内容，填写需禁止的分类名称(改名前的分类名)，多个分类用&分隔，模糊匹配所填分类名
catesSet: 自定义分类，按照所填的分类和顺序显示，用&分隔，如："电影&剧集&动漫"，catesSet优先级高于catesDeal
catesDeal: 分类处理，优先级低于自定义分类，包含分类删除，分类排序，分类改名，优先级从高到低，参数格式"删除@排序@改名"，如："catesDeal": "¥准:短剧,直播@电影>电视剧#综艺<动漫@电视剧>>剧集&电影解说>>解说"，分类删除默认是模糊匹配模式，加了'¥准:'变为精准匹配模式：模糊匹配只要分类名含有删除词，该分类就会被删除，精准匹配要分类名和删除词一样才会删除。如："catesDeal": "电@@"，模糊匹配模式下，电影和电视剧分类都会被删除，精准模式下都不会被删。如只需分类排序可写成"@电影>电视剧#综艺<动漫@"，排序中的#分隔符表示反向排序从此开始，无反向排序可以不写，@分隔符号不能丢，分类不需处理，此参数可不写
tabsDeal: 线路处理，包含线路删除，线路排序，线路改名，优先级从高到低，参数格式"删除@排序@改名"，如："tabsDeal": "¥准:量子,非凡@极速>新浪@优质>>优质无广&暴风>>暴风无广"，功能类同catesDeal，参考catesDeal参数说明
"playParse": 线路播放解析, 格式："线路$解析"，线路名如果改过名，写改名后的线路名，如果多个线路共用一个解析，可写成"线路1#线路2$解析"，"¥默认"表示除指定线路外的所有其它线路，线路$解析 之间用@分隔，如："¥默认$解析1@极速#新浪$解析2@非凡$解析3@轮播$dplay"，表示极速线路和新浪线路用解析2，非凡线路用解析3，轮播线路用dplay(使用二级的播放链接直接播放)，默认的其余所有线路用解析1。如不写"¥默认$解析1"，其余线路则不会调用解析
siteName: 站点名称，写了会显示在第一个分类名称上，不想显示，可以不写此参数
*/
import {Crypto} from 'assets://js/lib/cat.js';

var HOST;
var urlApi;
const MOBILE_UA = "Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36";
var DefHeader = {'User-Agent': MOBILE_UA};
var CachedPlayUrls = {};
var KParams = {
    host: "https://tiantangyoulu.oss-cn-beijing.aliyuncs.com/tengxunyun.txt",//http://211.154.22.153:9876
    dataKey: "seb5tq9mykp2w9ry",
    apiFlag: "1",
    sechMode: "1",
    apiV: "V120",
    lang: "0", // "1" 顯示語言篩選, "0" 隱藏語言篩選
    catesDeal: "@全部>电影>剧集>综艺>动漫>短剧@",
    tabsDeal: "@@广告勿信>> &廣告勿信>> ",
    headers: {'User-Agent': 'okhttp/3.14.9'},
    api: {
        '0': 'getappapi',
        '1': 'qijiappapi'
    }
};

async function init(cfg) {
    try {
        // 1. 修正：移除 throw Error，改為初始化 ext 物件，實現內外合併
        let ext = {}; 
        if (cfg && cfg.ext) {
            if (typeof cfg.ext === 'string') {
                let extStr = decodeBase64(cfg.ext.trim());
                ext = safeParseJSON(extStr) || {};
            } else {
                ext = cfg.ext;
            }
        }
        
        // 2. 修正賦值邏輯：外部傳入優先，否則使用 KParams 預設值
        KParams.lang = ext.lang?.trim() || KParams.lang || "1"; // <--- 加入這一行lang設定
        KParams.headers['User-Agent'] = ext.ua?.trim() || KParams.headers['User-Agent'];
        KParams.timeout = parseInt(ext.timeout?.trim(), 10) || 5000;
        
        // 修正：Host 若外部沒有則抓內部的
        let host = ext.host?.trim() || KParams.host || ''; 
        if (host && !/^https?:\/\/([a-zA-Z0-9-\u4e00-\u9fa5]+\.)*[a-zA-Z0-9-\u4e00-\u9fa5]+(:\d{1,5})?(\/)?$/.test(host)) {       
            let _host = await request(host);
            host = _host.split('\n')[0].trim();
        }
        if (!host || !host.startsWith('http')) {throw new Error('获取host失败');}
        
        HOST = getHome(host);  
        KParams.headers['Referer'] = HOST;
        
        // 修正：其餘參數比照辦理 (外部 || 內部)
        KParams.key = ext.dataKey || KParams.dataKey || '';
        KParams.iv = ext.dataIv || KParams.key;
        KParams.apiFlag = ext.apiFlag?.trim() || KParams.apiFlag || '';
        
        urlApi = KParams.apiFlag === '1' ? KParams.api['1'] : KParams.api['0'];
        let apv = ext.apiV?.trim() ?? '';
        KParams.apiV = apv !== '' ? apv : (KParams.apiFlag === '1' ? '' : 'V119');

        KParams.deviceId = ext.deviceId || '';
        if (KParams.deviceId) { KParams.headers['app-user-device-id'] = KParams.deviceId; }
        KParams.version = ext.version || '';
        if (KParams.version) { KParams.headers['app-version-code'] = KParams.version; }
        KParams.token = ext.token || '';
        if (KParams.token) { KParams.headers['app-user-token'] = KParams.token; }
        
        KParams.headers['app-api-verify-time'] = Math.floor(Date.now()/1000);
        
        // 修正：剩餘功能參數
        KParams.sechMode = ext.sechMode?.trim() || KParams.sechMode || '';
        KParams.showBans = ext.showBans?.trim() || KParams.showBans || '';
        KParams.catesSet = ext.catesSet?.trim() || KParams.catesSet || '';
        KParams.catesDeal = ext.catesDeal?.trim() || KParams.catesDeal || '';
        KParams.tabsDeal = ext.tabsDeal?.trim() || KParams.tabsDeal || '';
        KParams.playParse = ext.playParse?.trim() || KParams.playParse || '';
        KParams.siteName = ext.siteName?.trim() || KParams.siteName || '';
        
    } catch (e) {
        console.error('初始化参数失败：', e.message);
    }
}

async function home(filter) {
    try {
        let typeUrl = `/api.php/${urlApi}.index/init${KParams.apiV}`;
        let ktypeObj = await getdata(typeUrl);
        KParams.searchVerify = ktypeObj?.config?.system_search_verify_status || false;
        let classes = (ktypeObj?.type_list || []).map((item) => { return {type_name: item.type_name, type_id: item.type_id}; });
        if (KParams.catesSet) {
            let arrclsNames = KParams.catesSet.split('&');
            if (Array.isArray(arrclsNames) && arrclsNames.length) {
                let tclasses = [];
                arrclsNames.map((item) => { 
                    let target = classes.find(it => it.type_name === item); 
                    if (target) { tclasses.push(target);}
                });
                if (tclasses.length) {classes = tclasses;}
            }
        }
        if (KParams.catesDeal) {        
            let [x = '', y = '', z = ''] = KParams.catesDeal.split('@');
            let cate_remove = ['','¥准:'].includes(x.trim()) ? '' : x.trim();
            let cate_order = ['','#'].includes(y.trim()) ? '' : y.trim();
            let cate_rename = z.trim();
            classes = dorDeal(classes, cate_remove, cate_order, cate_rename);
        }
        if (KParams.siteName) { classes[0].type_name = `${classes[0].type_name}<${KParams.siteName}>`; }
        let filters = {};
        try {
            let nameObj = { class: 'class,剧情', area: 'area,地区', lang: 'lang,语言', year: 'year,年份', sort: 'by,排序' };
            for (let it of classes) {
                let kflArr = ((ktypeObj?.type_list ?? []).find(tlst => tlst.type_id == it.type_id))?.filter_type_list ?? [];

                // --- 關鍵修改處：根據 KParams.lang 決定是否保留語言篩選 ---
                filters[it.type_id] = kflArr
                    .filter((jit) => {
                        // 如果 jit.name 是 lang 且 KParams.lang 不等於 "1"，則過濾掉
                        if (jit.name === 'lang' && KParams.lang !== "1") return false;
                        return true;
                    })
                    .map((jit) => {
                    let [kkey, kname] = nameObj[jit.name].split(',');
                    let kval = jit.list ?? [];
                    let kvalue = kval.map((item) => { return {n: item, v: item}; });
                    return { key: kkey, name: kname, value: kvalue };
                }).filter((item) => item.value.length > 0);
            }
        } catch (e) {}
        
        return JSON.stringify({ class: classes, filters: filters });
    } catch (e) {
        console.error('首页获取分类失败：', e.message);
        return JSON.stringify({
            class: [], 
            filters: {}
        });
    }
}

async function homeVod() {
    try {
        let bansStr = KParams.showBans ? KParams.showBans.replace(/&/g, '|') : /^$/;
        let bansReg = new RegExp(bansStr);
        let homeUrl = `/api.php/${urlApi}.index/init${KParams.apiV}`;    
        let khomeObj = await getdata(homeUrl);
        let VODS = khomeObj?.recommend_list || [];
        (khomeObj?.type_list || []).forEach((item) => { if (Array.isArray(item.recommend_list) && item.recommend_list.length && !bansReg.test(item.type_name)) { VODS = VODS.concat(item.recommend_list);} });
        return JSON.stringify({list: VODS});
    } catch (e) {
        console.error('推荐页获取失败：', e.message);
        return JSON.stringify({list: []});
    }
}

async function category(tid, pg, filter, extend) {
    try {
        let pgParse = parseInt(pg, 10);
        pg = pgParse < 1 || isNaN(pgParse) ? 1 : pgParse;
        let cateBody = {
            type_id: tid,
            class: extend?.class || '全部',
            area: extend?.area || '全部',
            lang: extend?.lang || '全部',
            year: extend?.year || '全部',
            sort: extend?.by || '最新',
            page: pg
        };
        let cateUrl = `/api.php/${urlApi}.index/typeFilterVodList`;
        let kcateObj = await getdata(cateUrl, '', 'post', cateBody);
        let VODS = kcateObj?.recommend_list || [];
        let pagecount = 999;
        return JSON.stringify({
            list: VODS,
            page: pg,
            pagecount: pagecount,
            limit: 30,
            total: 30*pagecount
        });
    } catch (e) {
        console.error('分类页获取失败：', e.message);
        return JSON.stringify({
            list: [],
            page: 1,
            pagecount: 0,
            limit: 30,
            total: 0
        });
    }
}

async function search(wd, quick, pg) {
    try {
        let VODS = [], searchUrl = '';
        pg = parseInt(pg, 10);
        if ( pg <= 0 || isNaN(pg) ) { pg = 1 };
        if (KParams.sechMode === '1') {
            searchUrl = `/api.php/${urlApi}.index/typeFilterVodList?type_id=0&sort=最新`;
            VODS = await bSearch(searchUrl, wd, 100);
        } else {
            if (!KParams.searchVerify) {
                searchUrl = `/api.php/${urlApi}.index/searchList?keywords=${wd}&type_id=0&page=${pg}`;
            } else {
                let rdUuid = genUUID();
                let verifyUrl = `${HOST}/api.php/${urlApi}.verify/create?key=${rdUuid}`;              
                let b64Img = await request(verifyUrl, '', '', '', '', true);
                if (!b64Img) { throw new Error('无效的验证码图片数据'); }
                b64Img = b64Img.replace(/\n/g, '');
                let ocrUrl = 'https://api.nn.ci/ocr/b64/text';
                let ocrResult = await request(ocrUrl, DefHeader, 'post', b64Img, 'raw');
                ocrResult = ocrResult?.trim().replace(/\s+/g, '') ?? '';
                if (!ocrResult) { throw new Error('ocr识别失败'); }             
                searchUrl = `/api.php/${urlApi}.index/searchList?keywords=${wd}&type_id=0&code=${ocrResult}&key=${rdUuid}&page=${pg}`;
            }
            let ksechObj = await getdata(searchUrl);
            VODS = ksechObj?.search_list || [];
            VODS.forEach((it) => {
                it.vod_remarks = it.vod_remarks || it.vod_class || '无状态';
            });
        }
        return JSON.stringify({
            list: VODS,
            page: pg,
            pagecount: 10,
            limit: 30,
            total: 300
        });
    } catch (e) {
        console.error('搜索页获取失败：', e.message);
        return JSON.stringify({
            list: [],
            page: 1,
            pagecount: 0,
            limit: 30,
            total: 0
        });
    }
}

async function detail(id) {
    try {
        let detailUrl = `/api.php/${urlApi}.index/vodDetail?vod_id=${id}`;
        let kdetlObj = await getdata(detailUrl);
        let kvod = kdetlObj?.vod || null;
        if (!kvod) {throw new Error('kvod解析失败');}
        let ktabs = (kdetlObj?.vod_play_list || []).map((it) => { return `${it.player_info.show}`; });
        let kurls = (kdetlObj?.vod_play_list || []).map((item) => {
            let kurl = (item.urls ?? []).map((it) => { return `${it.name}$${it.from}@${it.url}@${it.token}@${item.player_info.parse}@${item.player_info.show}`; });
            return kurl.join('#');
        });
        ktabs = dealSameElements(ktabs);
        if (KParams.tabsDeal) {     
            let [x = '', y = '', z = ''] = KParams.tabsDeal.split('@');
            let tab_remove = ['','¥准:'].includes(x.trim()) ? '' : x.trim();
            let tab_order = ['','#'].includes(y.trim()) ? '' : y.trim();
            let tab_rename = z.trim();
            let ktus = ktabs.map((it, idx) => { return {"type_name": it, "type_value": kurls[idx]} });
            ktus = dorDeal(ktus, tab_remove, tab_order, tab_rename);
            ktabs = ktus.map(it => it.type_name);
            kurls = ktus.map(it => it.type_value);
        }
        if (KParams.playParse) {
            KParams.fromToTab = {};
            KParams.pparses = {};
            kurls.forEach((it, idx) => { 
                let kk = it.split('#')[0].split('$')[1].split('@')[0];
                KParams.fromToTab[kk] = ktabs[idx] 
            });
            try {
                KParams.playParse.split('@').forEach((it) => {
                    let [t, p] = it.split('$');
                    t.split('#').forEach(it => { if (it) { KParams.pparses[it.trim()] = p.trim(); } })
                });
            } catch (e) {
                KParams.pparses = {};
            }
        }
        let VOD = {
            vod_id: kvod.vod_id,
            vod_name: kvod.vod_name,
            vod_pic: kvod.vod_pic,
            type_name: kvod.vod_class || '类型',
            vod_remarks: kvod.vod_remarks || '状态',
            vod_year: kvod.vod_year || '0000',
            vod_area: kvod.vod_area || '年份',
            vod_lang: kvod.vod_lang || '地区',
            vod_director: kvod.vod_director || '导演',
            vod_actor: kvod.vod_actor || '主演',
            vod_content: kvod.vod_content.replace(/<[^>]*>/g, '') || '简介',
            vod_play_from: ktabs.join('$$$'),
            vod_play_url: kurls.join('$$$')
        };
        return JSON.stringify({list: [VOD]});
    } catch (e) {
        console.error('详情页获取失败：', e.message);
        return JSON.stringify({list: []});
    }
}

async function play(flag, id, flags) {
    try {
        let res = '', jx = 0, kp = 0, pparse ='';
        if (CachedPlayUrls[id]) {return CachedPlayUrls[id];}
        let [kfrom, kurl, ktoken, kparse, ktab] = id.split('@');
        const jurl = kurl;
        if (KParams.playParse) {
            let ptab = KParams.fromToTab[kfrom];
            if (KParams.pparses.hasOwnProperty(ptab)) {
                pparse = KParams.pparses[ptab];
            } else if (KParams.pparses.hasOwnProperty('¥默认')) {
                pparse = KParams.pparses['¥默认'];
            }
        }
        if (/^dplay$/.test(pparse)) {
            kurl = jurl;
        } else if (/^http/.test(pparse)) {
            kurl = pparse + kurl;
            res = await request(kurl, DefHeader);
            kurl = safeParseJSON(res)?.url || '';
            if (!/^http/.test(kurl)) {
                kurl = jurl;
                kp = 1;
                jx = 1;
            }
        } else if (/\.(m3u8|mp4|mkv)/.test(kurl)) {
            kurl = jurl;
        } else if (kparse.trim()) {
            if (/^http/.test(kparse)) {
                kurl = kparse + kurl;
                res = await request(kurl, DefHeader);
                kurl = safeParseJSON(res)?.url || '';
                if (!/^http/.test(kurl)) {
                    kurl = jurl;
                    kp = 1;
                    jx = 1;
                }
            } else {
                kurl = await getpurl(kurl, kparse, ktoken);
                if (!/^http/.test(kurl)) {
                    kurl = jurl;
                    kp = 1;
                    jx = 1;
                }
            }
        } else {
            kurl = jurl;
            kp = 1;
            jx = 1;
        }  
        let playObj = { jx: jx, parse: kp, url: kurl, header: DefHeader };
        let playJson = JSON.stringify(playObj);
        if (playObj.parse === 0) {CachedPlayUrls[id] = playJson};
        return playJson;
    } catch (e) {
        console.error('播放失败：', e.message);
        return JSON.stringify({
            jx: 0,
            parse: 0,
            url: '', 
            header: {} 
        });
    }
}

function decodeBase64(str) {
    try {
        return Crypto.enc.Utf8.stringify(Crypto.enc.Base64.parse(str));
    } catch (e) {
        return str;
    }
}

function safeParseJSON(jStr) {
    try {
        return JSON.parse(jStr);
    } catch(e) {
        return null;
    }
}

function getHome(url) {
    if (!url || typeof url !== 'string') {return '';}
    const ourl = url;
    try {
        url = /%[0-9A-Fa-f]{2}/.test(url) ? decodeURIComponent(url) : url;
        let [proPart, rest = ''] = url.includes('//') ? url.split('//') : [url, ''];
        let domain = rest.split('/')[0] || '';
        url = domain ? `${proPart}//${domain}` : proPart;
        return url.trim() || ourl;
    } catch (e) {
        return ourl;
    }
}

function genUUID() {
    const chars = '0123456789abcdef';
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => chars[c === 'x' ? (Math.random() * 16 | 0) : (Math.random() * 16 | 0) & 0x3 | 0x8]);
}

function dealSameElements(arr) {
    try {
        if (!Array.isArray(arr)) {throw new Error('输入参数非数组');}
        const countMap = new Map();
        let newArr = arr.map(item => {
            let count = countMap.get(item) || 0;
            let currentCount = count + 1;
            countMap.set(item, currentCount);
            return currentCount > 1 ? `${item}线${currentCount}` : item;
        });
        return newArr;
    } catch (e) {
        console.error('相同元素处理失败：', e.message);
        return [];
    }
}

function dorDeal(kArr, strRemove, strOrder, strRename) {
    let dealed_arr = kArr;
    if (strRemove) {
        try {
            let filtered_arr;
            if (/^¥准:/.test(strRemove)) {
                let removeArr = strRemove.split(',');
                const removeSet = new Set(removeArr);
                filtered_arr = dealed_arr.filter(it => !removeSet.has(it.type_name));
            } else {
                let removeStr = strRemove.replace(/,/g, '|');
                let removeReg = new RegExp(removeStr);
                filtered_arr = dealed_arr.filter(it => !removeReg.test(it.type_name));
            }
            let retained_arr = filtered_arr.length ? filtered_arr : [dealed_arr[0]];
            dealed_arr = retained_arr;
        } catch (e) {
            console.error('删除失败：', e);
        }
    }
    if (strOrder) {
        try {
            let [a = '', b = ''] = strOrder.split('#', 2);
            let arrA = a.split('>').filter(it => it !== '');
            let arrB = b.split('<').filter(it => it !== ''); 
            let uqArrB = arrB.filter(it => !arrA.includes(it));
            let twMap = new Map();
            arrA.forEach((item, idx) => {twMap.set(item, { weight: 1, index: idx }); });
            uqArrB.forEach((item, idx) => {twMap.set(item, { weight: 3, index: idx }); });
            dealed_arr.forEach((it, idx) => { if (!twMap.has(it.type_name)) {twMap.set(it.type_name, { weight: 2, index: idx });} });
            let ordered_arr = [...dealed_arr].sort((a, b) => {
                let { weight: ta = 2, index: idxA = 0 } = twMap.get(a.type_name) ?? {};
                let { weight: tb = 2, index: idxB = 0 } = twMap.get(b.type_name) ?? {};
                if (ta !== tb) return ta - tb;
                return ta === 3 ? idxB - idxA : idxA - idxB;
            });                        
            dealed_arr = ordered_arr;
        } catch (e) {
            console.error('排序失败：', e);
        }
    }
    if (strRename) {
        try {
            const objRename = {};
            for ( let p of strRename.split('&') ) {
                let [k, v] = p.split('>>', 2);
                (k ?? '') + (v ?? '') && (objRename[k ?? ''] = v ?? '');
            }        
            let renamed_arr = dealed_arr.map(it => { return { ...it, type_name: objRename[it.type_name] || it.type_name } });
            dealed_arr = renamed_arr;
        } catch (e) {
            console.error('改名失败：', e);
        }
    }
    return dealed_arr;
}

async function bSearch(url, wd, pgMax) {
    try {
        if (!url || typeof url !== 'string' || !wd || typeof wd !== 'string' || !Number.isInteger(pgMax) || pgMax < 1) {throw new Error('入参异常：URL/搜索词需为非空字符串，最大页数需为≥1整数');}
        let searchStop = false, cPage = 1, kvods = [];
        while (!searchStop && cPage <= pgMax) {
            let batchEnd = Math.min(cPage + 4, pgMax);
            let batchTasks = [];
            for (let page = cPage; page <= batchEnd; page++) {
                let bUrl = `${url}&page=${page}`;
                batchTasks.push(getdata(bUrl));
            }
            let batchResults = await Promise.all(batchTasks);
            batchResults.forEach(ksechObj => {
                let svods = (ksechObj?.recommend_list || []).filter(it => it.vod_name.includes(wd));
                if (svods.length) kvods.push(...svods);
            });
            if (kvods.length) searchStop = true;
            cPage = batchEnd + 1;
        }
        return kvods;
    } catch (e) {
        console.error('自建搜索获取结果失败：', e.message);
        return [];
    }
}

function encryptAes(plaintext, key, iv, typeHex = false, mode = 'CBC') {
    try {
        if (!plaintext || typeof plaintext !== 'string') { throw new Error('明文不能为空且必须是字符串'); }
        key = key || KParams.key;
        if (!key || typeof key !== 'string') { throw new Error('密钥key不能为空且必须是字符串'); }
        const cleanKey = key.replace(/[\u0000-\u001F\u007F-\uFFFF]/g, '');
        if (cleanKey.length !== key.length) { console.warn('密钥已自动过滤不可见非法字符'); }
        if (!cleanKey) { throw new Error('密钥过滤后为空，无法加密'); }    
        const keyWordArr = Crypto.enc.Utf8.parse(cleanKey);
        if (![16, 24, 32].includes(keyWordArr.sigBytes)) { throw new Error('密钥需16/24/32个UTF8字符'); }
        const finalMode = mode.toUpperCase();
        let ivWordArr = null;   
        if (finalMode === 'CBC') {
            iv = iv || KParams.iv;
            if (!iv || typeof iv !== 'string') { throw new Error('CBC模式必须传入有效iv'); }      
            ivWordArr = Crypto.enc.Utf8.parse(iv);
            if (ivWordArr.sigBytes !== 16) { throw new Error('CBC模式iv需16个UTF8字符'); }
        } else if (finalMode === 'ECB') {
            iv && console.warn('ECB模式无需iv，传入值已忽略');
        } else {
            throw new Error(`仅支持 'CBC' 或 'ECB' 模式`);
        }
        const plaintextWordArr = Crypto.enc.Utf8.parse(plaintext);
        const encrypted = Crypto.AES.encrypt(plaintextWordArr, keyWordArr, {
            mode: Crypto.mode[finalMode],
            iv: ivWordArr,
            padding: Crypto.pad.Pkcs7,
            blockSize: 16
        });
        return typeHex ? encrypted.ciphertext.toString(Crypto.enc.Hex) : encrypted.ciphertext.toString(Crypto.enc.Base64);
    } catch (e) {
        console.error(`AES-${finalMode || '未知'}模式加密失败：${e.message}`);
        return null;
    }
}

function decryptAes(data, key, iv, typeHex = false, mode = 'CBC') {
    try {
        if (!data || typeof data !== 'string') { throw new Error('密文不能为空且必须是字符串'); }
        key = key || KParams.key;
        if (!key || typeof key !== 'string') { throw new Error('密钥key不能为空且必须是字符串'); }
        const cleanKey = key.replace(/[\u0000-\u001F\u007F-\uFFFF]/g, '');
        if (cleanKey.length !== key.length) { console.warn('密钥已自动过滤不可见非法字符'); }
        if (!cleanKey) { throw new Error('密钥过滤后为空，无法解密'); }
        const keyWordArr = Crypto.enc.Utf8.parse(cleanKey);
        if (![16, 24, 32].includes(keyWordArr.sigBytes)) { throw new Error('密钥需16/24/32个UTF8字符'); }
        const finalMode = mode.toUpperCase();
        let ivWordArr = null;
        if (finalMode === 'CBC') {
            iv = iv || KParams.iv;
            if (!iv || typeof iv !== 'string') { throw new Error('CBC模式必须传入有效iv'); }
            ivWordArr = Crypto.enc.Utf8.parse(iv);
            if (ivWordArr.sigBytes !== 16) { throw new Error('CBC模式iv需16个UTF8字符'); }
        } else if (finalMode === 'ECB') {
            iv && console.warn('ECB模式无需iv，传入值已忽略');
        } else {
            throw new Error(`仅支持 'CBC' 或 'ECB' 模式`);
        }
        let ciphertext;
        if (typeHex) {
            const cleanHex = data.replace(/[^0-9a-fA-F]/g, '');
            if (cleanHex.length % 2 !== 0) { throw new Error('Hex密文过滤后长度需为偶数'); }
            ciphertext = Crypto.enc.Hex.parse(cleanHex);
        } else {
            const cleanBase64 = data.replace(/^\uFEFF|<[^>]*>|[^A-Za-z0-9+/=]/g, '');
            const paddingCount = (cleanBase64.match(/=/g) || []).length;
            if (paddingCount > 2) { throw new Error('Base64密文末尾"="数量不能超过2个'); }
            ciphertext = Crypto.enc.Base64.parse(cleanBase64);
        }
        const decrypted = Crypto.AES.decrypt({ciphertext: ciphertext}, keyWordArr, {
            mode: Crypto.mode[finalMode],
            iv: ivWordArr,
            padding: Crypto.pad.Pkcs7,
            blockSize: 16
        });
        const plaintext = decrypted.toString(Crypto.enc.Utf8);
        if (!plaintext) { throw new Error('解密结果为空'); }
        return plaintext;
    } catch (e) {
        console.error(`AES-${finalMode || '未知'}模式解密失败：${e.message}`);
        return null;
    }
}

async function request(reqUrl, header, method, data, dataType, tobase64 = false) {
    if (!reqUrl || typeof reqUrl !== 'string') {
        console.error('reqUrl 不能为空且必须是字符串');
        return '';
    }
    if (typeof header !== 'object' || header === null) {
        header = KParams.headers;
    } else if (Object.keys(header).length ===0) {
        header = KParams.headers;
    }
    try {
        let optObj = {
            headers: header,
            method: method?.toLowerCase() || 'get',
            timeout: KParams.timeout || 5000,
            buffer: tobase64 ? 2 : 0
        };
        if (method === 'post') {
            optObj.data = data ?? '';
            optObj.postType = dataType?.toLowerCase() || 'form';
        }
        let res = await req(reqUrl, optObj);
        if (res === null || res === undefined || res.content === undefined) {
            console.warn('未找到 content 字段', res);
            return '';
        }
        return res.content;
    } catch (e) {
        console.error(`${method} 请求失败：`);
        return '';
    }
}

async function getdata(url, header, method, data, dataType) {
    try {
        url = !/^http/.test(url) ? `${HOST}${url}` : url;
        let kres = await request(url, header, method, data, dataType);
        if (!kres) {throw new Error('请求数据失败');}
        let kresObj = JSON.parse(kres);
        let kdata = kresObj.data || '';
        if (!kdata) {throw new Error('未获取到待解密数据');};
        let decrypted = decryptAes(kdata);
        if (!decrypted) {throw new Error('解密失败');};
        return JSON.parse(decrypted);
    } catch (e) {
        console.error('getdata数据失败：', e.message);
        return null;
    }
}

async function getpurl(furl, fparse, ftoken) {
    try {
        furl = encodeURIComponent(encryptAes(furl));
        let parseUrl = `${HOST}/api.php/${urlApi}.index/vodParse?parse_api=${fparse}&url=${furl}&token=${ftoken}`;
        let fres = await request(parseUrl);
        if (!fres) {throw new Error('请求播放数据失败');}
        let kdata = safeParseJSON(fres)?.data || '';
        if (!kdata) {throw new Error('未获取到待解密数据');}  
        let decrypted = decryptAes(kdata);
        if (!decrypted) {throw new Error('解密失败');}
        kdata = safeParseJSON(decrypted)?.json ?? '';
        return safeParseJSON(kdata.replace(/\\/g,''))?.url ?? '';
    } catch (e) {
        console.error('解析播放链接失败：', e.message);
        return '';
    }
}

export function __jsEvalReturn() {
    return {
        init: init,
        home: home,
        homeVod: homeVod,
        category: category,
        search: search,
        detail: detail,
        play: play,
        proxy: null
    };
}