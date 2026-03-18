/*
title: 'AppV2模板', author: '小可乐/v5.11.2'
更新说明: 优化部分函数代码，分类和线路支持正反混合排序
ext参数标准格式:
"ext": {
    "host": "https://app.4kwo.com/api.php/app",
    "ua": "Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36",
    "timeout": "6000",
    "showBans": "福利",
    "catesSet": "电影&电视剧&短剧&综艺&福利",
    "catesDeal": "福利,短剧@电视剧>综艺@电视剧>>剧集",
    "tabsDeal": "量子,非凡@极速>新浪@优质>>优质无广&暴风>>暴风无广",
    "playParse": "¥默认$解析1@极速#新浪$解析2@非凡$解析3@轮播$dplay",
    "siteName": "稀饭"
}
或者
"ext": {
    "host": "https://app.4kwo.com/api.php/app"
}
ext各参数说明
host: 带站点域名的api
ua: 自定义User-Agent，格式字符串，不写为模板内置的ua
timeout: 超时，格式字符串，不写为模板内置的参数
showBans: 推荐页禁止显示的分类内容，填写需禁止的分类名称(改名前的分类名)，多个分类用&分隔，模糊匹配所填分类名
catesSet: 自定义分类，按照所填的分类和顺序显示，用&分隔，如：电影&剧集&动漫，catesSet优先级高于catesDeal
catesDeal: 分类处理，优先级低于自定义分类，包含分类删除，分类排序，分类改名，优先级从高到低，参数格式"删除@排序@改名"，如："catesDeal": "¥准:短剧,直播@电影>电视剧#综艺<动漫@电视剧>>剧集&电影解说>>解说"，分类删除默认是模糊匹配模式，加了'¥准:'变为精准匹配模式：模糊匹配只要分类名含有删除词，该分类就会被删除，精准匹配要分类名和删除词一样才会删除。如："catesDeal": "电@@"，模糊匹配模式下，电影和电视剧分类都会被删除，精准模式下都不会被删。如只需分类排序可写成"@电影>电视剧#综艺<动漫@"，排序中的#分隔符表示反向排序从此开始，无反向排序可以不写，@分隔符号不能丢，分类不需处理，此参数可不写
tabsDeal: 线路处理，包含线路删除，线路排序，线路改名，优先级从高到低，参数格式"删除@排序@改名"，如："tabsDeal": "¥准:量子,非凡@极速>新浪@优质>>优质无广&暴风>>暴风无广"，功能类同catesDeal，参考catesDeal参数说明
"playParse": 线路播放解析, 格式："线路$解析"，线路名如果改过名，写改名后的线路名，如果多个线路共用一个解析，可写成"线路1#线路2$解析"，"¥默认"表示除指定线路外的所有其它线路，线路$解析 之间用@分隔，如："¥默认$解析1@极速#新浪$解析2@非凡$解析3@轮播$dplay"，表示极速线路和新浪线路用解析2，非凡线路用解析3，轮播线路用dplay(使用二级的播放链接直接播放)，默认的其余所有线路用解析1。如不写"¥默认$解析1"，其余线路则不会调用解析
siteName: 站点名称，写了会显示在第一个分类名称上，不想显示，可以不写此参数
除host参数必填之外，其余都是非必要参数
*/
import { Crypto, _ } from 'assets://js/lib/cat.js';

var HOST;
var hApi;
const MOBILE_UA = "Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36";
const DefHeader = {'User-Agent': MOBILE_UA};
const CachedPlayUrls = {};
const KParams = {
    host: "https://tiantangyoulu.oss-cn-beijing.aliyuncs.com/tengxunyun.txt",//http://211.154.22.153:9876
    dataKey: "seb5tq9mykp2w9ry",
    apiFlag: "1",
    sechMode: "1",
    apiV: "V120",
    lang: "0", // "1" 顯示語言篩選, "0" 隱藏語言篩選
    catesDeal: "@全部>电影>剧集>综艺>动漫>短剧@",
    tabsDeal: "@@广告勿信>> &廣告勿信>> ",
    headers: {'User-Agent': 'Dart/2.14 (dart:io)'}
};

async function init(cfg) {
    try {
        // 解析外部參數，若無則為空物件
        let ext = {};
        if (cfg && cfg.ext) {
            if (typeof cfg.ext === 'string') {
                try {
                    let extStr = cfg.ext.trim();
                    extStr = decodeBase64(extStr);
                    ext = JSON.parse(extStr);
                } catch (e) { ext = {}; };
            } else {
                ext = cfg.ext;
            }
        }

        // 優先讀取外部參數，否則抓 KParams 內部預設
        KParams.lang = ext.lang?.trim() || KParams.lang || "1"; 
        
        hApi = ext.host?.trim().replace(/\/+$/,'') || KParams.host || '';
        if (!hApi.startsWith('http')) {throw new Error('获取host失败');}
        
        HOST = getHome(hApi);
        KParams.headers['Referer'] = HOST;
        KParams.apiFlag = ( hApi.endsWith('v1.vod') || hApi.endsWith('v1.xvod') ) ? 'V1' : 'V2';

        KParams.headers['User-Agent'] = ext.ua?.trim() || KParams.headers['User-Agent'];
        KParams.timeout = parseInt(ext.timeout?.trim(), 10) || 5000;
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
        let hPath, kres, ktypeObj;
        if ( KParams.apiFlag === 'V1' ) {
            hPath = '/types';
            kres = await request(`${hApi}${hPath}`);
            if (!kres) {throw new Error('请求失败');}
            ktypeObj = JSON.parse(kres)?.data || {};
        } else {
            hPath = '/nav?token=';
            kres = await request(`${hApi}${hPath}`);
            if (!kres) {throw new Error('请求失败');}
            ktypeObj = JSON.parse(kres) || {};
        }
        
        let classes = (ktypeObj.typelist || ktypeObj.list || ktypeObj.data || []).map((item) => { return {type_name: item.type_name, type_id: item.type_id}; });
        
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
            let nameObj = { class: 'class,剧情', area: 'area,地区', lang: 'lang,语言', year: 'year,年份' };
            let kflsObj = ktypeObj.typelist || ktypeObj.list || ktypeObj.data || {};
            
            for (let [idx, it] of classes.entries()) {
                // 核心修改：先過濾掉 lang，再進行 map
                let nameArr = Object.keys(nameObj).filter((key) => {
                    if (key === 'lang' && KParams.lang !== "1") return false;
                    return true;
                });
                
                let filter_data = [];
                let kflObj = kflsObj[idx]?.type_extend || {}; // 加入安全選取符 ?

                if (kflObj) {
                    filter_data = nameArr.map((jit) => {
                        let [kkey, kname] = nameObj[jit].split(',');
                        let kval = kflObj[jit] ? ("全部,".concat(kflObj[jit])).split(',').filter((ft) => { return ft != ''}) : [];
                        let kvalue = (kval && kval.length) ? kval.map((item) => { let itemV = (item != '全部') ? item : ''; return {n: item, v: itemV}; }) : [];
                        return { key: kkey, name: kname, value: kvalue };
                    });
                }
                filters[it.type_id] = filter_data.filter((item) => item.value.length > 0);
            }
        } catch (e) {}
        return JSON.stringify({ class: classes, filters: filters });
    } catch (e) {
        console.error('首页获取分类失败：', e.message);
        return JSON.stringify({ class: [], filters: {} });
    }
}

async function homeVod() {
    try {
        let hPath, kres, khomeObj, kvods;        
        let bansStr = KParams.showBans ? KParams.showBans.replace(/&/g, '|') : /^$/;
        let bansReg = new RegExp(bansStr, '');
        if ( KParams.apiFlag === 'V1' ) {
            hPath = '/vodPhbAll';
            kres = await request(`${hApi}${hPath}`);
            if (!kres) {throw new Error('请求失败');}
            khomeObj = JSON.parse(kres)?.data || {};
            kvods = khomeObj?.zhui?.[0]?.vod_list || [];
            (khomeObj.list || []).forEach((item) => { 
                if (Array.isArray(item.vod_list) && item.vod_list.length&&!bansReg.test(item.vod_type_name)) { kvods = kvods.concat(item.vod_list); };
            });
        } else {
            hPath = '/index_video?token=';
            kres = await request(`${hApi}${hPath}`);
            if (!kres) {throw new Error('请求失败');}
            khomeObj = JSON.parse(kres) || {};
            kvods = [];
            (khomeObj.list || khomeObj.data || []).forEach((item) => { 
                if (Array.isArray(item.vlist) && item.vlist.length&&!bansReg.test(item.type_name)) { kvods = kvods.concat(item.vlist); };
            });
        }
        let VODS= getVodList(kvods);
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
        let hPath, kres, kcateObj;
        if ( KParams.apiFlag === 'V1' ) {
            hPath = `?type=${tid}&class=${extend?.class || ''}&area=${extend?.area || ''}&lang=${extend?.lang || ''}&year=${extend?.year || ''}&by=&limit=20&page=${pg}`;
            kres = await request(`${hApi}${hPath}`);
            if (!kres) {throw new Error('请求失败');}
            kcateObj = JSON.parse(kres)?.data || {};
        } else {
            hPath = `/video?tid=${tid}&class=${extend?.class || ''}&area=${extend?.area || ''}&lang=${extend?.lang || ''}&year=${extend?.year || ''}&limit=20&pg=${pg}`;
            kres = await request(`${hApi}${hPath}`);
            if (!kres) {throw new Error('请求失败');}
            kcateObj = JSON.parse(kres) || {};
        }
        let kvods = kcateObj.list || kcateObj.data || [];
        let VODS = getVodList(kvods);
        let pagecount = kcateObj.pagecount || 999;
        return JSON.stringify({
            list: VODS,
            page: pg,
            pagecount: pagecount,
            limit: 20,
            total: 20*pagecount
        });
    } catch (e) {
        console.error('分类页获取失败：', e.message);
        return JSON.stringify({
            list: [],
            page: 1,
            pagecount: 0,
            limit: 20,
            total: 0
        });
    }
}

async function search(wd, quick, pg) {
    try {
        let pgParse = parseInt(pg, 10);
        pg = pgParse < 1 || isNaN(pgParse) ? 1 : pgParse;
        let hPath, kres, ksechObj;
        if ( KParams.apiFlag === 'V1' ) {
            hPath = `?wd=${wd}&page=${pg}`;
            kres = await request(`${hApi}${hPath}`);
            if (!kres) {throw new Error('请求失败');}
            ksechObj = JSON.parse(kres)?.data || {};
        } else {
            hPath = `/search?text=${wd}&pg=${pg}`;
            kres = await request(`${hApi}${hPath}`);
            if (!kres) {throw new Error('请求失败');}
            ksechObj = JSON.parse(kres) || {};
        }
        let kvods = ksechObj.list || ksechObj.data || [];
        let VODS = getVodList(kvods);
        return JSON.stringify({
            list: VODS,
            page: pg,
            pagecount: 10,
            limit: 20,
            total: 200
        });
    } catch (e) {
        console.error('搜索页获取失败：', e.message);
        return JSON.stringify({
            list: [],
            page: 1,
            pagecount: 0,
            limit: 20,
            total: 0
        });
    }
}

async function detail(id) {
    try {
        let ktabs, kurls, dparseStr;
        let hPath = ( KParams.apiFlag === 'V1' ) ? `/detail?vod_id=${id}` :  `/video_detail?id=${id}`;
        let kres = await request(`${hApi}${hPath}`);
        if (!kres) {throw new Error('请求失败');}
        let kdetlObj = JSON.parse(kres) || {};
        let kvod = kdetlObj.data?.vod_info || kdetlObj.data || '';
        if (!kvod) {throw new Error('kvod解析失败');}
        if ( KParams.apiFlag === 'V1' ) {
            let kVPL = kvod.vod_play_list || [];
            ktabs = _.map(kVPL, (it,idx) => { return `${it.player_info.show}` });
            kurls = _.map(kVPL, (it,idx) => { 
                let tparseArr = [it.player_info.parse, it.player_info.parse2];
                let dparseArr = tparseArr.map((pas) => { 
                    if (pas && pas.startsWith('http')) {
                        return pas.replace(/\.\./g, '.');
                    } else {
                        return '';
                    }
                });
                dparseStr = dparseArr.join(',');
                let kurl = _.map(it.urls,(item,idy) => { return `${item.name}$${item.url}@${dparseStr}@${item.from}` });
                return kurl.join('#') 
            });
        } else {
            let kVUWP = kvod.vod_url_with_player || [];
            ktabs = _.map(kVUWP,(it,idx) => { return `${it.name}` });
            kurls = _.map(kVUWP,(it,idx) => {
                dparseStr = it.parse_api || '';
                if (!(dparseStr && dparseStr.startsWith('http'))) {dparseStr = '';}
                let kurl = _.map(it.url.split('#'), (item,idy) => { return `${item}@${dparseStr}@${it.code}` });
                return kurl.join('#') 
            });
        }
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
                let kk = it.split('#')[0].split('@')[2];
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
            vod_area: kvod.vod_area || '地区',
            vod_lang: kvod.vod_lang || '语言',
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
        if (CachedPlayUrls[id]) { return CachedPlayUrls[id];};
        let [kurl, kparse, kfrom] = id.split('@');
        let jurl = kurl;        
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
            if (!res) {res = '{}';}
            kurl = JSON.parse(res)?.url ?? '';
            if (!/^http/.test(kurl)) {
                kurl = jurl;
                kp = 1;
                jx = 1;
            }
        } else if (/\.(m3u8|mp4|mkv)/.test(kurl)) {
            kurl = jurl;
        } else if (kparse.trim()) {
            let kparseArr = kparse.split(',');
            let kflag = false;
            for (let pjx of kparseArr) {
                try {
                    res = await request(`${pjx}${kurl}`, DefHeader);
                    if (!res) {throw new Error();}
                    res = res.replace(/^\ufeff/,'');
                    let purl = JSON.parse(res)?.url ?? '';
                    if (typeof purl === 'string' && /^http/.test(purl)) {
                        kflag = true;
                        kurl = purl;
                        break;
                    }
                } catch (e) {
                    continue;
                }
            }
            if (!kflag) {
                kurl = jurl;
                kp = 1;
                jx = 1;
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

function getVodList(vods) {
    try {
        if (!Array.isArray(vods)) {throw new Error();}
        let fvods = [];
        vods.forEach((it) => {
            fvods.push({
                vod_name: it.vod_name,
                vod_pic: /^http/.test(it.vod_pic)? it.vod_pic : `${HOST}/${it.vod_pic.replace(/^\/+/,'')}`,
                vod_remarks: it.vod_remarks || it.vod_class || '无状态',
                vod_year: it.vod_year || '',
                vod_id: it.vod_id
            })
        });
        return fvods;
    } catch (e) {
        return vods;
    }
}

async function request(reqUrl, header, method, data, dataType) {
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