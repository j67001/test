{
//"spider":"https://files.zohopublic.com.cn/public/workdrive-public/download/uyv0t678c488189af47bb91dc108484d17431;md5;b3a5a49c793dd82c3fd04e75d3071b20",
//"spider":"https://files.zohopublic.com.cn/public/workdrive-public/download/uyv0t678c488189af47bb91dc108484d17431;md5;55894a9f32ba4201a1e2b157bb2e5c91",
//"spider": "https://fongmi.cachefly.net/FongMi/CatVodSpider/main/jar/custom_spider.jar;md5;1de1a94d0429f343a35986ef5e9145d6",
"spider": "https://github.com/FongMi/CatVodSpider/raw/main/jar/custom_spider.jar;md5;9420d75153250b3e5d548637b60f66ee",
//"wallpaper":"http://饭.eu.org/深色壁纸/api.php",
"wallpaper":"http://img.fongmi.eu.org",
//"wallpaper":"https://github.com/j67001/test/raw/main/B.jpg",
//"warningText": "接口完全免费，切勿付费购买。",
"warningText": "",

"lives":[
 {
  "name":"smart",
  "type":0,
  //"url":"http://home.jundie.top:81/Cat/tv/live.txt",
  "url":"https://raw.githubusercontent.com/j67001/test/main/tw.swf",
  //"ua": "UBlive/2.3.8 (Linux;Android 12)",
  "ua": "okhttp/3.12.13",
  "playerType":1,
  "epg":"http://epg.112114.xyz/?ch={name}&amp;date={date}",
  "logo": "https://epg.112114.xyz/logo/{name}.png"
},
{
  "name":"嗅探",
  "boot":"true",
  "url":"https://github.com/j67001/test/raw/main/ts.swf",
  //"url":"http://home.jundie.top:81/Cat/tv/live.txt",
  "epg":"http://epg.112114.xyz/?ch={name}&amp;date={date}",
  "ua": "Mozilla/5.0 (iPad; CPU OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/87.0.4280.77 Mobile/15E148 Safari/604.1",
  "playerType":1,
  "logo": "https://epg.112114.xyz/logo/{name}.png"
},
{
  "name":"maotv",
  "url":"https://github.com/LinWei0718/iptvtw/raw/main/maotv.txt",
  //"url":"https://agit.ai/ddx/TVBox/raw/branch/master/js/zb.txt",
  "ua": "okhttp/3.12.13",
  "playerType":1,
  "epg":"http://epg.112114.xyz/?ch={name}&amp;date={date}",
  "logo": "https://epg.112114.xyz/logo/{name}.png"
},
{
  "name":"ubtv",
  "boot":"true",
  "url":"https://github.com/j67001/test/raw/main/ip.swf",
  "epg":"http://epg.112114.xyz/?ch={name}&amp;date={date}",
  "ua": "okhttp/3.12.13",
  //"ua": "UBlive/2.3.8 (Linux;Android 12)",
  "playerType":1,
  "logo": "https://epg.112114.xyz/logo/{name}.png"
},
//{"name":"oklive","type":0,"url":"https://jihulab.com/my-program/zhiboyuan/-/raw/main/zhiboyuan.txt","playerType":1,"ua":"okhttp/3.15","epg":"http://epg.112114.xyz/?ch={name}&date={date}","logo":"https://epg.112114.xyz/logo/{name}.png","timeout":10},
//{"name":"oktv","type":0,"url":"https://jihulab.com/okcaptain/kko/-/raw/main/mt.txt","playerType":1,"ua":"okhttp/3.15","epg":"http://epg.112114.xyz/?ch={name}&date={date}","logo":"https://epg.112114.xyz/logo/{name}.png","timeout":10}
{"name":"tvlive","type":0,"url":"https://raw.githubusercontent.com/dxawi/0/main/tvlive.txt","playerType":1,"ua":"okhttp/3.15","epg":"http://epg.112114.xyz/?ch={name}&date={date}","logo":"https://epg.112114.xyz/logo/{name}.png"}
],  
//"ads":["mozai.4gtv.tv"],

//ETH TV
//"lives":[{"group":"redirect","channels":[{"name":"redirect","urls":["proxy://do=live&type=eth"]}]}],
//吾愛
//"lives":[{"group":"redirect","channels":[{"name":"redirect","urls":["proxy://do=live&type=txt&ext=aHR0cDovLzUyYnNqLnZpcDo4MS9hcGkvdjMvZmlsZS9nZXQvODIwNTIvJUU3JTlCJUI0JUU2JTkyJUFELnR4dD9zaWduPWItYl9VQjZ3NDJXOE5KSEZ3aW1NNEtaVFNTUHpQZmNtOC13R1NaNE5YYU0lM0QlM0Ew"]}]}],


"sites":[
{"key":"Douban","name":"🥜豆瓣","type": 3, "api": "csp_Douban","searchable": 0,"quickSearch": 0,"filterable": 0,"ext": "https://github.com/j67001/test/raw/main/douban.json"},
//{"key":"drpy_js_豆瓣","name":"🥜豆瓣","type":3,"api":"https://github.com/gaotianliuyun/gao/raw/master/lib/drpy2.min.js","ext":"https://github.com/j67001/test/raw/main/drpy.js","searchable": 1,"quickSearch": 0,"filterable": 0}, 
//{"key": "豆瓣","name": "🥜豆瓣2","type": 3,"api": "csp_Douban","searchable": 0,"changeable": 1,"indexs":1,"ext": "https://github.com/guot55/yg/raw/main/pg/lib/douban.json"},
{"key":"Auete","name":"🏝奧特","type": 3,"api":"csp_Auete","timeout":15,"searchable":1,"quickSearch":1,"changeable":1,"ext":"https://auete.pro/","jar": "https://fs-im-kefu.7moor-fs1.com/ly/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1720763657384/fan.txt;md5;026629a5c54494dc8ae9bd38d0a1a1f6"},
{"key":"drpy_js_小宝影院[飞]","name":"🧸小寶","type":3,"api":"https://github.com/gaotianliuyun/gao/raw/master/lib/drpy2.min.js","ext":"https://github.com/gaotianliuyun/gao/raw/master/js/小宝影院[飞].js"}, 
{"key": "csp_LiteApple","name": "🍎蘋果","type": 3,"playerType": "2","api": "csp_LiteApple","jar": "https://github.com/guot55/yg/raw/main/pg/lib/ap.jar","searchable": 1,"quickSearch": 1,"filterable": 1 },
//{"key":"小苹果","name":"🍎小蘋果","type":3,"api":"csp_LiteApple","searchable":1,"quickSearch":1,"filterable":1,"jar":"http://tipu.xjqxz.top/1119/xpg240228.jar;md5;e98a7f7d8ab52fa6d6ddd3ca12c0de0a"},
{"key":"原創","name":"☀原創","type":3,"api":"csp_YCyz","timeout":15,"playerType":1,"searchable":1,"quickSearch":1,"changeable":1,"jar": "https://fs-im-kefu.7moor-fs1.com/ly/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1720763657384/fan.txt;md5;026629a5c54494dc8ae9bd38d0a1a1f6"},
{"key":"文采","name":"💮文采","type":3,"api":"csp_Jpys","playerType":2,"searchable":1,"quickSearch":1,"changeable":1,"jar": "https://fs-im-kefu.7moor-fs1.com/ly/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1720763657384/fan.txt;md5;026629a5c54494dc8ae9bd38d0a1a1f6"},
{"key":"drpy_js_LIBVIO","name":"🦄利播","type":3,"api":"https://github.com/gaotianliuyun/gao/raw/master/lib/drpy2.min.js","ext":"https://raw.githubusercontent.com/j67001/test/main/LIBVIO.js"},
//{"key":"drpy_js_LIBVIO","name":"🦄利播","type":3,"api":"https://github.com/hjdhnx/dr_py/raw/main/libs/drpy2.min.js","ext":"https://github.com/hjdhnx/dr_py/raw/main/js/LIBVIO.js"},
//{"key":"libvio_js","name":"🦄利播","type": 3,"searchable":1,"quickSearch":1,"filterable":1,"api": "https://jihulab.com/okcaptain/kko/-/raw/main/drpy/drpy2.min.js", "ext": "https://jihulab.com/okcaptain/kko/-/raw/main/js/libvio.js", "timeout": 15},
//{"key":"Lib","name":"🦄利播","type": 3,"api": "csp_Libvio","searchable": 1,"quickSearch": 1,"changeable":1,"ext":"https://www.libvio.la/"},
//{"key":"Lib","name": "🦄利播2","type": 3,"api": "csp_Libvio","searchable": 1,"quickSearch": 1,"changeable":1,"ext":"https://www.libvio.pro/","jar": "https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1705832521307/fan.txt;md5;c309b0f793045f88f75aa088cd0cc7b5"},
//{"key":"csp_Lib","name": "🦄利播","type": 3,"api": "csp_Libvio","searchable": 1,"quickSearch": 1,"changeable":1,"ext":"https://www.libvio.fun/"},	
{"key":"星星","name":"⭐️星視界","type":3,"api":"csp_Star","searchable":1,"changeable":1,"timeout":25},
{"key":"drpy_js_唐人街影视[飞]","name":"⛩️唐人街","type":3,"api":"https://github.com/gaotianliuyun/gao/raw/master/lib/drpy2.min.js","ext":"https://github.com/j67001/test/raw/main/唐人街影视[飞].js"},	  
//{"key":"drpy_js_唐人街影视[飞]","name":"⛩️唐人","type":3,"api":"https://github.com/gaotianliuyun/gao/raw/master/lib/drpy2.min.js","ext":"https://github.com/gaotianliuyun/gao/raw/master/js/唐人街影视[飞].js"},	  
//{"key":"csp_trj","name": "🛫唐人街","type": 3,"api": "csp_Tangrenjie","searchable": 1,"quickSearch": 1,"changeable":1},	
//{"key":"drpy_js_if101[飞]","name":"🐶101","type":3,"api":"https://github.com/gaotianliuyun/gao/raw/master/lib/drpy2.min.js","ext":"https://github.com/gaotianliuyun/gao/raw/master/js/if101[飞].js"},
//{"key":"drpy_js_555影视[飞]","name":"🦧555","type":3,"api":"https://github.com/gaotianliuyun/gao/raw/master/lib/drpy2.min.js","ext":"https://github.com/gaotianliuyun/gao/raw/master/js/555影视[飞].js"},
{"key":"drpy_js_duck","name":"🦆小鴨","type":3,"api":"https://github.com/gaotianliuyun/gao/raw/master/lib/drpy2.min.js","ext":"https://github.com/j67001/test/raw/main/duck.js"}, 
{"key":"drpy_js_剧迷","name":"🎭劇迷","type":3,"api":"https://github.com/gaotianliuyun/gao/raw/master/lib/drpy2.min.js","ext":"https://github.com/j67001/test/raw/main/剧迷.js"}, 
//{"key":"drpy_js_剧迷su","name":"🎭劇迷2","type":3,"api":"https://github.com/gaotianliuyun/gao/raw/master/lib/drpy2.min.js","ext":"https://github.com/j67001/test/raw/main/剧迷su.js"},
{"key":"快看影视","name":"👀快看","type":3,"api":"csp_Kuaikan","searchable":1,"quickSearch":1,"filterable":1,"jar": "https://github.com/guot55/yg/raw/main/pg/lib/o.jar"},
{"key":"热播影视","name":"📽熱播","type":3,"api":"csp_AppRB","searchable":1,"quickSearch":1,"filterable":1,"jar": "https://github.com/guot55/yg/raw/main/pg/lib/o.jar"},
//{"key": "xcys","name": "🌌星辰","type": 3,"api": "csp_XBPQ","jar": "https://github.com/guot55/yg/raw/main/pg/lib/XBPQ.jar","ext": {"分类url": "http://m.disc800.com/species/{cateId}/area/{area}/by/{by}/class/{class}/lang/{lang}/page/{catePg}/year/{year}.html","分类": "电影$1#连续剧$2#动漫$3#综艺$4#纪录片$5"}}, 
{"key":"drpy_js_飞兔影视","name":"🐇飛兔","type":3,"api":"https://github.com/gaotianliuyun/gao/raw/master/lib/drpy2.min.js","ext":"https://github.com/gaotianliuyun/gao/raw/master/js/飞兔影视.js"}, 
{"key":"drpy_js_海兔影院","name":"🐰海兔","type":3,"api":"https://github.com/gaotianliuyun/gao/raw/master/lib/drpy2.min.js","ext":"https://github.com/j67001/test/raw/main/海兔影院.js"}, 
//{"key":"drpy_js_海兔影院","name":"🐰海兔","type":3,"api":"https://github.com/gaotianliuyun/gao/raw/master/lib/drpy2.min.js","ext":"https://github.com/gaotianliuyun/gao/raw/master/js/海兔影院.js"}, 
//{"key":"drpy_js_欧乐影院[飞]","name":"😹歐樂","type":3,"api":"https://github.com/gaotianliuyun/gao/raw/master/lib/drpy2.min.js","ext":"https://github.com/gaotianliuyun/gao/raw/master/js/欧乐影院[飞].js"},
{"key":"drpy_js_欧帝影院","name":"👑歐帝","type":3,"api":"https://github.com/gaotianliuyun/gao/raw/master/lib/drpy2.min.js","ext":"https://github.com/gaotianliuyun/gao/raw/master/js/欧帝影院.js"},
//{"key":"drpy_js_兰花影院","name":"🎋蘭花","type":3,"api":"https://github.com/gaotianliuyun/gao/raw/master/lib/drpy2.min.js","ext":"https://github.com/hjdhnx/dr_py/raw/main/js/兰花影院.js"}, 
//{"key":"drpy_js_吼吼[飞]","name":"🗿吼吼","type":3,"api":"https://github.com/gaotianliuyun/gao/raw/master/lib/drpy2.min.js","ext":"https://github.com/gaotianliuyun/gao/raw/master/js/吼吼[飞].js"},
//{"key":"快帆","name":"🚤快帆","type":1,"api":"https://api.kuaifan.tv/api.php/provide/vod","categories":["动作片","喜剧片","爱情片","科幻片","恐怖片","剧情片","战争片","惊悚片","家庭片","古装片","历史片","悬疑片","犯罪片","灾难片","记录片","短片","动画片","国产剧","香港剧","韩国剧","欧美剧","台湾剧","日本剧","海外剧","泰国剧","大陆综艺","港台综艺","日韩综艺","欧美综艺","国产动漫","欧美动漫","日本动漫"]},
//{"key":"kyB","name":"🦅快鷹","type":1,"api":"http://savviuux.hk3.345888.xyz.cdn.cloudflare.net/api.php/provide/vod/?ac=list","searchable":1,"quickSearch":1,"playUrl":"json:https://stray.serv00.net/ky.php?url="},
{"key": "黑木耳","name": "🍄黑木耳","type": 1,"api": "https://json.heimuer.xyz/api.php/provide/vod","searchable": 1,"changeable": 1,"header": {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"},"categories": ["国产剧","欧美剧","韩剧","日剧","台剧","港剧","泰剧","日本动漫","欧美动漫","国产动漫","韩国综艺","日本综艺","国产综艺","欧美综艺","动画电影","冒险片","剧情片","动作片","同性片","喜剧片","奇幻片","恐怖片","悬疑片","惊悚片","战争片","歌舞片","灾难片","爱情片","犯罪片","科幻片","纪录片","经典片"]},
//{"key": "黑木耳","name": "🍄黑木耳","type": 1,"api": "https://json.heimuer.xyz/api.php/provide/vod","searchable": 1,"changeable": 1},
//{"key": "黑木","name": "🍄黑木","type": 3,"api":"https://github.com/gaotianliuyun/gao/raw/master/lib/drpy2.min.js","ext":"file://$MuMu12Shared/[test]/heimuer.js"},
//{"key":"海外看","name":"🌼海外看","type":1,"api":"http://api.haiwaikan.com/v1/vod?ac=list","searchable":1,"quickSearch":1,"changeable":1},
{"key":"SNzy","name":"✨索尼","type":1,"api":"https://suoniapi.com/api.php/provide/vod/?ac=list","searchable":1,"changeable":1,"quickSearch":1,"filterable":1,"categories":["国产剧","欧美剧","韩剧","日剧","台剧","港剧","泰剧","海外剧","日韩动漫","欧美动漫","国产动漫","动画片","港台动漫","海外动漫","日韩综艺","港台综艺","大陆综艺","欧美综艺","动作片","喜剧片","爱情片","科幻片","恐怖片","剧情片","战争片","纪录片","4K电影","邵氏电影","影视解说","演唱会","篮球","足球"]},
{"key":"Xinsj","name":"🧿新視覺","type":3,"api":"csp_Xinsj","searchable":1,"quickSearch":1,"changeable":1,"ext":"https://www.hdmyy.com/","jar": "https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1708249660012/fan.txt;md5;87d5916b7bb5c8acacac5490e802828e"},
//{"key": "老張實驗","name": "老張實驗","type": 1,"api": "http://zhangqun66.serv00.net/158.php","searchable": 1,"changeable": 1,"categories": ["电影","连续剧","大陆综艺","国产动漫","日韩动漫","NBA","爽文短剧","年代穿越","成长逆袭"]},

//{"key":"一起看 ","name":"🎉一起看","type":3,"api":"csp_YQKan","searchable":1,"quickSearch":1,"changeable":1,"jar":"https://github.com/gaotianliuyun/gao/raw/master/jar/fan.txt;md5;c0a0999c670692bb297b38981fe6de9b"},
//{"key":"csp_YQKAPP","name":"🎉一起看","type":3,"api":"csp_YQKAPP","playerType":2,"searchable":1,"quickSearch":1,"changeable":1,"ext":"https://api-aws.11ty.top"},	
{"key":"drpy_js_KUBO影视[飞]","name":"📀酷播","type":3,"api":"https://github.com/gaotianliuyun/gao/raw/master/lib/drpy2.min.js","ext":"https://github.com/gaotianliuyun/gao/raw/master/js/KUBO影视[飞].js"},
//{"key":"drpy_js_独播库[飞]","name":"💿獨播庫","type":3,"api":"https://github.com/gaotianliuyun/gao/raw/master/lib/drpy2.min.js","ext":"https://github.com/gaotianliuyun/gao/raw/master/js/独播库[飞].js"},
//{"key":"csp_Czsapp","name":"🏭厂长┃直连","type":3,"api":"csp_Czsapp","playerType":2,"searchable":1,"quickSearch":1,"changeable":1},
//{"key":"drpy_js_厂长资源","name":"🏭廠長","type":3,"api":"https://github.com/gaotianliuyun/gao/raw/master/lib/drpy2.min.js","ext":"https://github.com/gaotianliuyun/gao/raw/master/js/厂长资源.js"}, 
//{"key":"drpy_js_豆瓣","name":"🥜豆瓣","type":3,"api":"https://github.com/gaotianliuyun/gao/raw/master/lib/drpy2.min.js","ext":"https://github.com/j67001/test/raw/main/drpy.js","searchable": 1,"quickSearch": 0,"filterable": 0}, 

//{ "key":"萌番","name":"🐹萌番","type":1,"searchable":1,"quickSearch":1,"playerType":1,"api":"https://www.mengfan.tv/api.php/provide/vod/","header":{"user-agent":"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36"}},
//{"key":"drpy_js_hdtoday","name":"🦄🏫hdtoday","type":3,"api":"https://github.com/gaotianliuyun/gao/raw/master/lib/drpy2.min.js","ext":"https://github.com/j67001/test/raw/main/hdtoday.js"}, 
//{"key": "drpy_js_Alist","name": "📽4K雲端","type": 3,"api": "https://github.com/gaotianliuyun/gao/raw/master/lib/alist.min.js","searchable": 2,"quickSearch": 0,"filterable": 1,"ext": "https://github.com/j67001/test/raw/main/alist.json"},
//{"key": "drpy_js_Alist","name": "📽4K雲端","type": 3,"api": "http://81.68.148.203/aytv/data/json/dr/lib/alist.min.js","searchable": 2,"quickSearch": 0,"filterable": 1,"ext": "http://81.68.148.203/tv/ext/khari.json"},
{"key":"lf_js_lf_live","name":"📻Radio廣播","type":3,"api":"https://github.com/gaotianliuyun/gao/raw/master/lib/lf_live_min.js","style":{ "type":"oval"},"searchable":1,"changeable":0,"quickSearch":1,"filterable":1,"ext":"https://github.com/gaotianliuyun/gao/raw/master/js/lf_live.txt"},

{"key":"drpy_js_我的哔哩","name":"🤖嗶哩嗶哩","type":3,"api":"https://github.com/gaotianliuyun/gao/raw/master/lib/drpy2.min.js","style":{"type":"rect","ratio":1.597},"changeable":0,"ext":"https://github.com/j67001/test/raw/main/bilibili.js"},
//{"key":"drpy_js_我的哔哩","name":"🤖嗶哩嗶哩","type":3,"api":"https://github.com/gaotianliuyun/gao/raw/master/lib/drpy2.min.js","style":{"type":"rect","ratio":1.597},"changeable":0,"ext":"https://github.com/gaotianliuyun/gao/raw/master/js/我的哔哩.js"},
{"key":"drpy_js_哔哩影视","name":"🤖嗶哩影視","type":3,"api":"https://github.com/gaotianliuyun/gao/raw/master/lib/drpy2.min.js","style":{"type":"rect","ratio":1.597},"changeable":0,"ext":"https://github.com/j67001/test/raw/main/biliys.js"},
//{"key":"drpy_js_哔哩影视","name":"🤖嗶哩影視","type":3,"api":"https://github.com/gaotianliuyun/gao/raw/master/lib/drpy2.min.js","style":{"type":"rect","ratio":1.597},"changeable":0,"ext":"https://github.com/gaotianliuyun/gao/raw/master/js/哔哩影视.js"},
{"key":"drpy_js_哔哩直播","name":"🤖嗶哩直播","type":3,"api":"https://github.com/gaotianliuyun/gao/raw/master/lib/drpy2.min.js","style":{"type":"rect","ratio":1.597},"changeable":0,"ext":"https://github.com/gaotianliuyun/gao/raw/master/js/哔哩直播.js"},
{"key": "软件","name": " 🖤軟體教學","type": 3,"api": "csp_Bili","searchable":0,"quickSearch": 0,"filterable": 1,"ext": "https://itvbox.cc/tvbox/云星日记/sh/Bilibili/软件教程.json","jar":"https://github.com/gaotianliuyun/gao/raw/master/jar/fan.txt;md5;c0a0999c670692bb297b38981fe6de9b"},
{"key": "PS","name": "🎉PS教學","type": 3,"api": "csp_Bili","searchable": 0,"quickSearch": 0,"filterable": 1,"ext": "https://itvbox.cc/tvbox/云星日记/sh/Bilibili/哔哩PS.json","jar":"https://github.com/gaotianliuyun/gao/raw/master/jar/fan.txt;md5;c0a0999c670692bb297b38981fe6de9b"},
{"key": "EXCEL","name": "🏢Excel教學","type": 3,"api": "csp_Bili","searchable": 0,"quickSearch": 0,"filterable": 1,"ext": "http://itvbox.cc/tvbox/云星日记/sh/Bilibili/哔哩Excel教程.json","jar":"https://github.com/gaotianliuyun/gao/raw/master/jar/fan.txt;md5;c0a0999c670692bb297b38981fe6de9b"},
{"key": "外语","name": "🏠外語課程","type": 3,"api": "csp_Bili","searchable":0,"quickSearch": 0,"filterable": 1,"ext": "https://itvbox.cc/tvbox/云星日记/sh/Bilibili/哔哩外语.json","jar":"https://github.com/gaotianliuyun/gao/raw/master/jar/fan.txt;md5;c0a0999c670692bb297b38981fe6de9b"},
{"key": "学堂","name": "🍉學堂教育","type": 3,"api": "csp_Bili","searchable":0,"quickSearch": 0,"filterable": 1,"ext": "http://itvbox.cc/tvbox/云星日记/sh/Bilibili/哔哩学堂.json","jar":"https://github.com/gaotianliuyun/gao/raw/master/jar/fan.txt;md5;c0a0999c670692bb297b38981fe6de9b"},
//{"key":"drpy_js_B站影视","name":"🤖B站影視","type":3,"api":"https://github.com/gaotianliuyun/gao/raw/master/lib/drpy2.min.js","style":{"type":"rect","ratio":1.597},"changeable":0,"ext":"https://github.com/gaotianliuyun/gao/raw/master/js/B站影视.js"},
//{"key":"csp_Bili","name":"🅱嗶哩┃合集","type": 3,"api": "csp_Bili","style":{"type":"rect","ratio":1.597},"searchable":1,"quickSearch":0,"changeable":0,"ext":"http://饭.eu.org/x/json/bilibili.json"},
//{"key":"csp_Biliych","name":"🅱嗶哩┃演唱會","type": 3,"api": "csp_Bili","style":{"type":"rect","ratio":1.597},"searchable":1,"quickSearch":0,"changeable":0,"ext":"http://饭.eu.org/x/json/bilibili.json"},
{"key":"ktv","name":"🎤KTV","type":3,"api":"https://github.com/myhomebox/tv/raw/main/js/ktv_open.js"},
//{"key":"MV_vod","name":"🎸明星┃MV","type":1,"api":"https://mv.wogg.link/mv/vod","style":{"type":"oval"},"searchable":1,"quickSearch":0,"changeable":0},
{"key":"MTV","name":"🎸明星┃MV","type":3,"api":"csp_Bili","style":{"type":"rect","ratio":1.597},"searchable":0,"quickSearch":0,"changeable":0,"ext":"https://agit.ai/fantaiying/fty/raw/branch/master/ext/MTV.json","jar": "https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1708249660012/fan.txt;md5;87d5916b7bb5c8acacac5490e802828e"},
{"key":"csp_YGP","name":"🚀新片┃速递","type":3,"api":"csp_YGP","searchable":0,"quickSearch":0,"changeable":0,"jar":"https://github.com/gaotianliuyun/gao/raw/master/jar/fan.txt;md5;c0a0999c670692bb297b38981fe6de9b"},
{"key":"drpy_js_博看听书","name":"🎧博看聽書","type":3,"api":"https://raw.githubusercontent.com/hjdhnx/dr_py/main/libs/drpy2.min.js","ext":"https://raw.githubusercontent.com/hjdhnx/dr_py/main/js/博看听书.js","playerType":"2"},
{"key":"drpy_js_喜马拉雅","name":"🎧喜馬拉雅","type":3,"api":"https://raw.githubusercontent.com/hjdhnx/dr_py/main/libs/drpy2.min.js","ext":"https://raw.githubusercontent.com/hjdhnx/dr_py/main/js/喜马拉雅.js","playerType":"2"},
//{"key":"laobaigushi","name":"🎧老白故事","type":3,"api":"https://raw.githubusercontent.com/j67001/test/main/cat.js","ext":"https://raw.githubusercontent.com/j67001/test/main/lbgs_open.js","playerType":"2"},
{"key":"drpy_js_听书网","name":"🎧聽書網","type":3,"api":"https://raw.githubusercontent.com/hjdhnx/dr_py/main/libs/drpy2.min.js","ext":"https://raw.githubusercontent.com/hjdhnx/dr_py/main/js/听书网.js","playerType":"2"},
{"key": "應用商店","name": "🏪應用商店","type": 3,"api": "csp_Market","searchable": 0,"changeable": 0,"ext": "https://github.com/j67001/test/raw/main/market.json"}
//{"key": "應用商店","name": "🏪應用商店","type": 3,"api": "csp_Market","searchable": 0,"changeable": 0,"ext": "https://raw.githubusercontent.com/FongMi/CatVodSpider/main/json/market.json"}
//{"key":"drpy_js_i275听书","name":"🎧i275聽書","type":3,"api":"https://raw.githubusercontent.com/hjdhnx/dr_py/main/libs/drpy2.min.js","ext":"https://raw.githubusercontent.com/hjdhnx/dr_py/main/js/i275听书.js","playerType":"2"},
//{"key":"drpy_js_六月听书","name":"🎧六月聽書","type":3,"api":"https://raw.githubusercontent.com/hjdhnx/dr_py/main/libs/drpy2.min.js","ext":"https://raw.githubusercontent.com/hjdhnx/dr_py/main/js/六月听书.js","playerType":"2"},
//{"key":"drpy_js_海洋听书","name":"🎧海洋聽書","type":3,"api":"https://raw.githubusercontent.com/hjdhnx/dr_py/main/libs/drpy2.min.js","ext":"https://raw.githubusercontent.com/hjdhnx/dr_py/main/js/海洋听书.js","playerType":"2"},
//{"key":"drpy_js_有声小说","name":"🎧有聲小說","type":3,"api":"https://raw.githubusercontent.com/hjdhnx/dr_py/main/libs/drpy2.min.js","ext":"https://raw.githubusercontent.com/hjdhnx/dr_py/main/js/有声小说吧.js","playerType":"2"}

/*,
//{"key":"csp_Nbys","name":"🥔泥巴","type":3,"api":"csp_NiNi","searchable": 1,"quickSearch": 1,"changeable":1,"categories":["电影","电视剧","综艺","动漫","体育","短剧","短视频","纪录片"]}, 
//{ "key": "泥巴", "name": "🥔泥巴", "type": 3, "api": "csp_NiNi", "searchable": 1, "style":{ "type":"rect", "ratio":0.8 },"jar": "https://fongmi.cachefly.net/FongMi/CatVodSpider/main/jar/custom_spider.jar;md5;eea22614c071a32c3624ca99691f491a", "ext": "1" },
//{"key":"csp_Nbys","name":"🥔泥巴","type":3,"api":"csp_NiNi","searchable": 1,"quickSearch": 1,"changeable":1,"jar": "https://fongmi.cachefly.net/FongMi/CatVodSpider/main/jar/custom_spider.jar;md5;1de1a94d0429f343a35986ef5e9145d6"},	
//{"key":"drpy_js_爱壹帆[飞]","name":"⛵愛壹帆","type":3,"api":"https://github.com/hjdhnx/dr_py/raw/main/libs/drpy2.min.js","ext":"https://github.com/hjdhnx/dr_py/raw/main/js/爱壹帆[飞].js"},
//{"key":"drpy_js_爱壹帆[飞]","name":"⛵愛壹帆","type":3,"api":"https://github.com/gaotianliuyun/gao/raw/master/lib/drpy2.min.js","ext":"https://github.com/j67001/test/raw/main/爱壹帆[飞].js"},
//{"key": "Yingtan","name": "🎬影探4K","type": 3,"api": "csp_Yingtantv2","searchable": 1,"changeable": 0,"jar": "https://d.kstore.space/download/6128/TVBOX/jar/追忆影探布蕾带自动追踪.jar"},

//{"key":"csp_woggcli","name":"😈玩偶1","type":4,"api":"http://home.jundie.top:9520/spider/csp_Wogg?sort=原画,蓝光,超清,高清&token=cd6f4c6641e4426db997ce82cb930269","searchable":1,"quickSearch":1,"filterable":1,"changeable":0},
//{"key":"csp_Woggcli","name":"👽玩偶2","type":4,"api":"http://home.jundie.top:9520/spider/csp_Wogg?sort=原画,蓝光,超清,高清&token=0bec59716cbd492796ea1d5b14f2ca67","searchable":1,"quickSearch":1,"filterable":1,"changeable":0},
//{"key":"csp_WoGG","name":"👽玩偶哥哥","type":3,"api":"csp_WoGG","searchable":1,"quickSearch":1,"changeable":0,"ext": "https://dpaste.com/7TWX659XA.txt"}, 
//{"key":"csp_WoGG","name":"👽玩偶哥哥┃4K","type":3,"api":"csp_WoGG","searchable":1,"quickSearch":1,"changeable":0,"ext":"http://127.0.0.1:9978/file/tvfan/token.txt+4k|fhd|auto$$$http://tvfan.xxooo.cf/"}, 
//{"key": "csp_woggcli","name": "♻️业余|玩偶(cli)","type": 4,"api": "http://home.jundie.top:9520/spider/csp_Wogg","searchable": 1,"quickSearch": 1,"filterable": 1,"changeable": 0,"ext": "./token.txt"}, 

{"key":"陌陌","name":"🍄陌陌┃直連","type":3,"api":"csp_AppYsV2","searchable":1,"quickSearch":1,"changeable":1,"ext":"http://wushutvcms.byzz.top/api.php/app/"},
{"key":"迪迪","name":"😎迪迪┃App","api":"csp_AppYsV2","type":3,"searchable":1,"quickSearch":1,"changeable":1,"ext":"https://api123.adys.app/xgapp.php/v3/"},
{"key":"csp_77","name":"👒七七┃App","type":3,"api":"csp_Kunyu77","searchable":1,"quickSearch":1,"changeable":1},
{"key":"csp_DiDuan" ,"name":"⏮️低端┃直連","type":3,"api":"csp_Ddrk","searchable":1,"quickSearch":1,"changeable":1},
{"key":"贱贱","name":"🐭賤賤┃p2p","type":3,"playerType":"1","api":"http://xhww.fun:63/js/drpy1.min.js","ext":"http://smallmi.xiaohewanwan.love:63/jp.js"},
{"key":"酷酷","name":"💡酷酷┃App","type":3,"api":"csp_Kuying","searchable":1,"quickSearch":1,"changeable":1},
{"key":"探探","name":"🏵探探┃App","type":3,"playerType":"1","api":"csp_YT","searchable":1,"quickSearch":1,"changeable":1},
{"key":"csp_kuaikan","name":"👀快看┃App","type":3,"api":"csp_Kuaikan","searchable":1,"quickSearch":1,"changeable":1},
{"key":"csp_AppMr","name":"👻明明┃App","type":3,"api":"csp_AppMr","searchable":1,"quickSearch":1,"changeable":1},
{"key":"csp_Xinsj","name":"🐼視覺┃直連","type":3,"api":"csp_Xinsj","searchable":1,"quickSearch":1,"changeable":1,"ext":"https://www.6080yy3.com/"},
{"key":"csp_fantuan","name":"🍙飯糰┃直連","type":3,"api":"csp_Fantuan","searchable":1,"quickSearch":1,"changeable":1,"ext":"https://www.fantuan3.com"},
{"key":"csp_Cokemv","name":"📕可樂┃直連","type":3,"api":"csp_Cokemv","playerType":2,"searchable":1,"quickSearch":1,"changeable":1},
{"key":"csp_Bttoo","name":"✌比特┃直連","type":3,"api":"csp_Bttwoo","searchable":1,"quickSearch":1,"changeable":1},
{"key":"drpy_js_农民","name":"🌾農民┃直連","type":3,"api":"https://github.com/gaotianliuyun/gao/raw/master/lib/drpy2.min.js","ext":"https://github.com/gaotianliuyun/gao/raw/master/js/农民影视.js"},
//{"key":"csp_Nmys","name":"🌾農民┃直連","type":3,"api":"csp_Nmys","searchable":1,"quickSearch":1,"changeable":1,"ext":"http://饭太硬.top/tv/nmys.json"},
{"key":"csp_Dy1010","name":"❤️双十┃直連","type":3,"api":"csp_Dy1010","searchable":1,"quickSearch":1,"changeable":1},
{"key":"csp_Vofl","name":"🎈Vofl┃直連","type":3,"api":"csp_Voflix","searchable":1,"quickSearch":1,"changeable":1},
{"key":"csp_Auete","name":"🏝奥特┃直連","type": 3,"api":"csp_Auete","searchable":1,"quickSearch":1,"changeable":1},
{"key":"csp_zxzj","name":"📗在線┃直連","type":3,"api":"csp_Zxzj","searchable":1,"quickSearch":1,"changeable":1,"ext":"https://www.zxzj.pro/"},
{"key":"csp_Lgyy","name":"🌀藍光┃直連","type":3,"api":"csp_Lgyy","searchable":1,"quickSearch":1,"changeable":1,"ext":"https://www.lgyy.vip"},
{"key":"csp_Ysgc","name":"🏭工場┃直連","type":3,"api":"csp_Ysgc","searchable":1,"quickSearch":1,"changeable":1,"ext":"https://www.ysgc.vip"},

{"key":"csp_SP33","name":"📺三三┃解析","type":3,"api":"csp_SP33","searchable":1,"quickSearch":1,"filterable":1,"changeable":0},
{"key":"Qtv","name":"🐧騰騰┃解析","type": 3,"api":"csp_Qtv","searchable": 1,"quickSearch": 1,"filterable":1,"changeable":0},
{"key":"Itv","name":"🥝愛愛┃解析","type":3,"api":"csp_Itv","quickSearch":1,"searchable":1,"filterable":1,"changeable":0},
{"key":"Mtv","name":"🍋芒芒┃解析","type":3,"api":"csp_Mtv","searchable":1,"quickSearch":1,"filterable":1,"changeable":0},

{"key":"csp_Dm84","name":"🚌動漫┃巴士","type":3,"api":"csp_Dm84","searchable":1,"quickSearch":1,"changeable":1},
{"key":"csp_Ying","name":"💮櫻花┃動漫","type":3,"api":"csp_Ying","searchable":1,"quickSearch":1,"changeable":1},
{"key":"csp_Ysj","name":"🎀異界┃動漫","type":3,"api":"csp_Ysj","searchable":1,"quickSearch":1,"changeable":1},
{"key":"csp_Anime1","name":"🐾日本┃動漫","type": 3,"api": "csp_Anime1","searchable": 1,"quickSearch": 1,"changeable":1},
{"key":"csp_Yj1211","name":"📽️網紅┃直播","type": 3,"api": "csp_Yj1211","searchable": 1,"quickSearch": 1,"changeable":1},

{"key":"drpy_js_88看球","name":"⚽ 88┃看球","type":3,"api":"https://github.com/gaotianliuyun/gao/raw/master/lib/drpy2.min.js","changeable":0,"style":{"type":"rect","ratio":1},"ext":"https://github.com/gaotianliuyun/gao/raw/master/js/88看球.js"},
{"key":"csp_xp_qiumi","name":"⚽ Jrs┃球迷","type": 3,"api": "csp_XPath","style":{"type":"rect","ratio":1},"searchable": 0,"quickSearch": 0,"changeable":0,"ext": "http://饭太硬.top/x/xp/dj看球.json"},
{"key":"drpy_js_310直播","name":"⚽310┃看球","type":3,"api":"https://github.com/gaotianliuyun/gao/raw/master/lib/drpy2.min.js","changeable":0,"style":{"type":"rect","ratio":1},"ext":"https://github.com/gaotianliuyun/gao/raw/master/js/310直播.js"},
{"key":"csp_XPath_企鹅体育","name":"🐧企鵝┃體育","type":3,"api":"csp_XPath","style":{"type":"rect","ratio":1.597},"searchable":0,"quickSearch":0,"changeable":0,"ext":"http://饭太硬.top/x/xp/企鹅直播.json"},
{"key":"MV_vod","name":"🎶明星┃MV","type":1,"api":"https://mv.wogg.link/mv/vod","style":{"type":"oval"},"searchable":1,"quickSearch":0,"changeable":0},
{"key":"酷奇js","name":"🎤酷奇┃MV","type": 3,"api":"http://xhww.fun:63/js/drpy1.min.js","ext":"https://agit.ai/fantaiying/dr_py/raw/branch/main/js/酷奇MV.js","style":{"type":"rect","ratio":1.597},"searchable": 0,"quickSearch": 0,"changeable":0},
{"key":"虎牙直播js","name":"🐯虎牙┃直播","type":3,"api":"http://xhww.fun:63/js/drpy1.min.js","ext":"https://agit.ai/fantaiying/dr_py/raw/branch/main/js/虎牙直播.js","style":{"type":"rect","ratio":1.755},"searchable": 0,"quickSearch": 0,"changeable":0},
{"key":"csp_XYQBiu_斗鱼","name":"🐟鬥魚┃直播","type":3,"api":"http://xhww.fun:63/js/drpy1.min.js","ext":"https://agit.ai/fantaiying/dr_py/raw/branch/main/js/斗鱼直播.js","style":{"type":"rect","ratio":1.755},"searchable": 0,"quickSearch": 0,"changeable":0},
{"key":"csp_XBPQ_聚短视频","name":"📽️聚短┃視頻","type":3,"api":"csp_XBPQ","searchable":0,"quickSearch":0,"changeable":0,"ext":"http://饭太硬.top/x/xbpq/短视频.json"},
{"key":"有声小说js","name":"🎧有聲┃小說","type":3,"api":"http://xhww.fun:63/js/drpy1.min.js","ext":"https://agit.ai/fantaiying/dr_py/raw/branch/main/js/有声小说吧.js","style":{"type":"rect","ratio":1},"searchable": 0,"quickSearch": 0,"changeable":0},

{"key":"YiSo","name":"😹易搜┃搜索","type":3,"api":"csp_YiSo","searchable":1,"quickSearch":1,"changeable":0,"ext":"http://127.0.0.1:9978/file/tvfan/token.txt+4k|fhd|auto"},
{"key":"Zhaozy","name":"🐺找資源┃搜索","type":3,"api":"csp_Zhaozy","searchable":1,"quickSearch":1,"changeable":0,"ext":"http://127.0.0.1:9978/file/tvfan/token.txt+4k|fhd|auto$$$fanfan$$$qqq111"},
{"key":"PanSou","name":"🦊盤搜┃搜索","type":3,"api":"csp_PanSou","searchable":1,"quickSearch":1,"changeable":0,"ext":"http://127.0.0.1:9978/file/tvfan/token.txt+4k|fhd|auto"},
{"key":"UpYun","name":"😻Up搜┃搜索","type":3,"api":"csp_UpYun","searchable":1,"quickSearch":1,"changeable":0,"ext":"http://127.0.0.1:9978/file/tvfan/token.txt+4k|fhd|auto"},
{"key":"PanSearch","name":"🙀盤se┃搜索","type":3,"api":"csp_PanSearch","searchable":1,"quickSearch":1,"changeable":0,"ext":"http://127.0.0.1:9978/file/tvfan/token.txt+4k|fhd|auto"},
{"key":"七夜","name":"😾七夜┃搜索","type":3,"api":"csp_Dovx","searchable":1,"quickSearch":1,"changeable":0,"ext":"http://127.0.0.1:9978/file/tvfan/token.txt+4k|fhd|auto"},
{"key":"push_agent","name":"🛴手機┃推送","type":3,"api":"csp_Push","searchable":0,"quickSearch":0,"ext":"http://127.0.0.1:9978/file/tvfan/token.txt+4k|fhd|auto"},

{"key":"dr_兔小贝","name":"📚兒童┃啟蒙","type":3,"api":"http://xhww.fun:63/js/drpy1.min.js","ext":"https://agit.ai/fantaiying/dr_py/raw/branch/main/js/%E5%85%94%E5%B0%8F%E8%B4%9D.js","style":{"type":"rect","ratio":1.597},"searchable": 0,"quickSearch": 0,"changeable":0},
{"key":"少儿教育","name":"📚少兒┃教育","type":3,"api":"csp_Bili","style":{"type":"rect","ratio":1.597},"searchable":0,"quickSearch":0,"changeable":0,"ext":"http://饭太硬.top/x/json/少儿教育.json"},
{"key":"小学课堂","name":"📚小學┃課堂","type":3,"api":"csp_Bili","style":{"type":"rect","ratio":1.597},"searchable":0,"quickSearch":0,"changeable":0,"ext":"http://饭太硬.top/x/json/小学课堂.json"},
{"key":"初中课堂","name":"📚初中┃課堂","type":3,"api":"csp_Bili","style":{"type":"rect","ratio":1.597},"searchable":0,"quickSearch":0,"changeable":0,"ext":"http://饭太硬.top/x/json/初中课堂.json"},
{"key":"高中教育","name":"📚高中┃課堂","type":3,"api":"csp_Bili","style":{"type":"rect","ratio":1.597},"searchable":0,"quickSearch":0,"changeable":0,"ext":"http://饭太硬.top/x/json/高中课堂.json"}
//{"key":"ext_live_protocol","name":"","type":3,"api":"csp_XPath","searchable":1,"quickSearch":1,"changeable":1},
//{"key":"cc","name":"","type":3,"api":"csp_XPath","searchable": 0,"quickSearch": 0}
*/
], 

"parses":[
{"name":"聚合1","type":3,"url":"Demo"},
{"name":"聚合0","type":3,"url":"Web"},
{"name":"刚佬","type":1,"url":"http://json.g9.pub:66/?url=","ext":{"flag":["qq","腾讯","qiyi","爱奇艺","奇艺","youku","优酷","mgtv","imgo","芒果","letv","乐视","pptv","PPTV","sohu","bilibili","哔哩哔哩","哔哩"],"header":{"User-Agent":"okhttp/4.1.0"}}},
{"name":"全部","type":0,"url":"https://yun.ckmov.com/?url=","ext":{"flag":["qq","腾讯","qiyi","爱奇艺","奇艺","youku","优酷","mgtv","imgo","芒果","letv","乐视","pptv","PPTV","sohu","bilibili","哔哩哔哩","哔哩"],"header":{"User-Agent":"okhttp/4.1.0"}}},
{"name":"来自","type":0,"url":"https://jx.zhanlangbu.com/?url=","ext":{"flag":["qq","腾讯","qiyi","爱奇艺","奇艺","youku","优酷","sohu","搜狐","letv","乐视","mgtv","芒果","imgo","rx","ltnb","bilibili","1905","xigua"]}},
{"name":"网络","type":1,"url":"https://api.cygc.xyz/analysis/?url=","ext":{"flag":["qq","腾讯","qiyi","爱奇艺","奇艺","youku","优酷","sohu","搜狐","letv","乐视","imgo","mgtv","芒果","rx","ltnb","bilibili","1905","xigua"]}},
{"name":"大家","type":0,"url":"https://jx.xmflv.com/?url=","ext":{"flag":["qq","腾讯","qiyi","爱奇艺","奇艺","youku","优酷","mgtv","芒果","imgo","letv","乐视","pptv","PPTV","sohu","bilibili","哔哩哔哩","哔哩"],"header":{"User-Agent":"okhttp/4.1.0"}}},
{"name": "随便用","type": 1,"url": "https://jx.ccabc.cc/xc/?key=5567332json&amp;url="},
{"name":"坏了","type":0,"url":"http://27.124.4.42:4567/jhjson/ceshi.php?url=","ext":{"flag":["qq","腾讯","qiyi","爱奇艺","奇艺","youku","优酷","mgtv","imgo","芒果","letv","乐视","pptv","PPTV","sohu","bilibili","哔哩哔哩","哔哩"],"header":{"User-Agent":"okhttp/4.1.0"}}},
{"name":"我再找来","type":1,"url":"https://b.umkan.cc/API.php?url=","ext":{"flag":["qq","腾讯","企鹅","IQiYi","qiyi","imgo","爱奇艺","奇艺","youku","YouKu","优酷","sohu","SoHu","搜狐","letv","LeShi","乐视","imgo","mgtv","MangGuo","芒果","SLYS4k","BYGA","luanzi","AliS","dxzy","bilibili","QEYSS","xigua","西瓜视频","腾讯视频","奇艺视频","优酷视频","芒果视频","乐视视频"]}}
], 

//"rules":[{"name":"量子","hosts":["vip.lz","hd.lz"],"regex":["#EXT-X-DISCONTINUITY\\r*\\n*#EXTINF:6.433333,[\\s\\S]*?#EXT-X-DISCONTINUITY","#EXTINF.*?\\s+.*?1o.*?\\.ts\\s+"]},{"name":"非凡","hosts":["vip.ffzy","hd.ffzy"],"regex":["#EXT-X-DISCONTINUITY\\r*\\n*#EXTINF:6.666667,[\\s\\S]*?#EXT-X-DISCONTINUITY","#EXTINF.*?\\s+.*?1o.*?\\.ts\\s+"]},{"name":"火山","hosts":["huoshan.com"],"regex":["item_id="]},{"name":"抖音","hosts":["douyin.com"],"regex":["is_play_url="]}],
//"lives":[{"name":"live","type":0,"url":"https://ghproxy.com/raw.githubusercontent.com/dxawi/0/main/tvlive.txt","playerType":1,"epg":"http://epg.112114.xyz/?ch={name}&amp;date={date}","logo": "https://epg.112114.xyz/logo/{name}.png"}], 
"flags":["youku","优酷","优 酷","优酷视频", "qq","腾讯","腾 讯","腾讯视频", "iqiyi", "qiyi","奇艺","爱奇艺","爱 奇 艺", "m1905", "xigua", "letv","leshi","乐视","乐 视", "sohu","搜狐","搜 狐","搜狐视频", "tudou", "pptv", "mgtv","芒果","imgo","芒果TV","芒 果 T V", "bilibili","哔 哩","哔 哩 哔 哩"], 
//"ads":["wan.51img1.com","iqiyi.hbuioo.com","vip.ffzyad.com","https://lf1-cdn-tos.bytegoofy.com/obj/tos-cn-i-dy/455ccf9e8ae744378118e4bd289288dd"]
"ads":["mozai.4gtv.tv",
    "static-mozai.4gtv.tv",
    "mozai.ofiii.com",
    "wan.51img1.com",
    "iqiyi.hbuioo.com",
    "vip.ffzyad.com",
    "https://lf1-cdn-tos.bytegoofy.com/obj/tos-cn-i-dy/455ccf9e8ae744378118e4bd289288dd","mimg.0c1q0l.cn","www.googletagmanager.com","www.google-analytics.com","mc.usihnbcq.cn","mg.g1mm3d.cn","mscs.svaeuzh.cn","cnzz.hhttm.top","tp.vinuxhome.com","cnzz.mmstat.com","www.baihuillq.com","s23.cnzz.com","z3.cnzz.com","c.cnzz.com","stj.v1vo.top","z12.cnzz.com","img.mosflower.cn","tips.gamevvip.com","ehwe.yhdtns.com","xdn.cqqc3.com","www.jixunkyy.cn","sp.chemacid.cn","hm.baidu.com","s9.cnzz.com","z6.cnzz.com","um.cavuc.com","mav.mavuz.com","wofwk.aoidf3.com","z5.cnzz.com","xc.hubeijieshikj.cn","tj.tianwenhu.com","xg.gars57.cn","k.jinxiuzhilv.com","cdn.bootcss.com","ppl.xunzhuo123.com","xomk.jiangjunmh.top","img.xunzhuo123.com","z1.cnzz.com","s13.cnzz.com","xg.huataisangao.cn","z7.cnzz.com","xg.huataisangao.cn","z2.cnzz.com","s96.cnzz.com","q11.cnzz.com","thy.dacedsfa.cn","xg.whsbpw.cn","s19.cnzz.com","z8.cnzz.com","s4.cnzz.com","f5w.as12df.top","ae01.alicdn.com","www.92424.cn","k.wudejia.com","vivovip.mmszxc.top","qiu.xixiqiu.com","cdnjs.hnfenxun.com","cms.qdwght.com"
  ],

  "doh": [
    {
      "name": "Google",
      "url": "https://dns.google/dns-query",
      "ips": [
        "8.8.4.4",
        "8.8.8.8"
      ]
    },
    {
      "name": "Cloudflare",
      "url": "https://cloudflare-dns.com/dns-query",
      "ips": [
        "1.1.1.1",
        "1.0.0.1",
        "2606:4700:4700::1111",
        "2606:4700:4700::1001"
      ]
    },
    {
      "name": "AdGuard",
      "url": "https://dns.adguard.com/dns-query",
      "ips": [
        "94.140.14.140",
        "94.140.14.141"
      ]
    },
    {
      "name": "DNSWatch",
      "url": "https://resolver2.dns.watch/dns-query",
      "ips": [
        "84.200.69.80",
        "84.200.70.40"
      ]
    },
    {
      "name": "Quad9",
      "url": "https://dns.quad9.net/dns-quer",
      "ips": [
        "9.9.9.9",
        "149.112.112.112"
      ]
    }
  ],
  "rules": [
     {
      "name": "海外看廣告",
      "hosts": [
        "m3u.haiwaikan.com"
      ],
      "regex": [
        "#EXT-X-DISCONTINUITY\\r*\\n*#EXTINF:(2.002000|3.970633|5.939267|7.907899|8.174833|2.002|3.970|5.939|7.907|8.174|2.00|3.97|5.93|7.90|8.17),[\\s\\S]*?#EXT-X-DISCONTINUITY",
        "#EXT-X-DISCONTINUITY\\r*\\n*#EXTINF:(2.039999|4.039999|6.019999|8.020000|10.020000|12.020000|14.039999|16.020000|16.099999|2.039|4.039|6.019|8.020|10.020|12.020|14.039|16.020|16.099|2.03|4.03|6.01|8.02|10.02|12.02|14.03|16.02|16.09),[\\s\\S]*?#EXT-X-DISCONTINUITY",
        "#EXT-X-DISCONTINUITY\\r*\\n*#EXTINF:(2.936266|5.538866|8.641966|2.936|5.538|8.641|2.93|5.53|8.64),[\\s\\S]*?#EXT-X-DISCONTINUITY",
        "#EXT-X-DISCONTINUITY\\r*\\n*#EXTINF:(2.033333|4.033332|5.133333|7.133333|9.133333|9.899999|2.033|4.033|5.133|7.133|9.133|9.899|2.03|4.03|5.13|7.13|9.13|9.89),[\\s\\S]*?#EXT-X-DISCONTINUITY",
        "#EXT-X-DISCONTINUITY\\r*\\n*#EXTINF:(12.333333|10.056777|10.039999|9.023221|8.233332|6.716667|12.333|10.056|10.039|9.023|8.233|6.716|12.33|10.05|10.03|9.02|8.23|6.71),[\\s\\S]*?#EXT-X-DISCONTINUITY",
        "#EXT-X-DISCONTINUITY\\r*\\n*#EXT-X-DISCONTINUITY\\r*\\n*[\\s\\S]*?#EXT-X-DISCONTINUITY"
      ]
    },
    {
      "name": "夜市點擊",
      "hosts": [
        "yeslivetv.com"
      ],
      "script": [
        "document.getElementsByClassName('vjs-big-play-button')[0].click()"
      ]
    },
     {
      "name": "黑木耳廣告",
      "hosts": [
        "m3u8.heimuertv.com"
      ],
      "regex": [
        "#EXT-X-DISCONTINUITY\\r*\\n*#EXTINF:(1.500000|8.008000|16.683|16.667|12.77|12.44|12.42|11.96|12.20|12.15|12.11|12.09|12.54|12.17|16.683333|15.000476|15.000449|14.973455|14.996484|14.972387|14.959250|14.985295|15.012363|11.65|11.90|11.94|11.92|11.76|11.52|11.68|11.71|11.72|11.65|11.82|11.77|11.80|11.79|11.57|11.55|11.63|10|9.058835|9.039479|9.039217|9.039213|9.038679|9.038676|9.026875|10.010000),[\\s\\S]*?#EXT-X-DISCONTINUITY",
        "#EXT-X-DISCONTINUITY\\r*\\n*#EXT-X-DISCONTINUITY\\r*\\n*[\\s\\S]*?#EXT-X-DISCONTINUITY",
        "#EXT-X-DISCONTINUITY\\r*\\n*#EXTINF:1.500000,[\\s\\S]*?#EXT-X-ENDLIST"
      ]
    },
/*
    {
      "name": "星星廣告",
      "hosts": [
        "aws.ulivetv.net"
      ],
      "regex": [
        "#EXT-X-DISCONTINUITY\\r*\\n*#EXTINF:8,[\\s\\S]*?#EXT-X-DISCONTINUITY"
      ]
    },
    {
      "name": "量子廣告",
      "hosts": [
        "vip.lz",
        "hd.lz"
      ],
      "regex": [
        "#EXT-X-DISCONTINUITY\\r*\\n*#EXTINF:6.433333,[\\s\\S]*?#EXT-X-DISCONTINUITY",
        "#EXTINF.*?\\s+.*?1o.*?\\.ts\\s+"
      ]
    },
    {
      "name": "非凡廣告",
      "hosts": [
        "vip.ffzy",
        "hd.ffzy"
      ],
      "regex": [
        "#EXT-X-DISCONTINUITY\\r*\\n*#EXTINF:6.666667,[\\s\\S]*?#EXT-X-DISCONTINUITY",
        "#EXTINF.*?\\s+.*?1o.*?\\.ts\\s+"
      ]
    },
*/

    {
      "name": "火山嗅探",
      "hosts": [
        "huoshan.com"
      ],
      "regex": [
        "item_id="
      ]
    },
    {
      "name": "抖音嗅探",
      "hosts": [
        "douyin.com"
      ],
      "regex": [
        "is_play_url="
      ]
    }
  ]
}
