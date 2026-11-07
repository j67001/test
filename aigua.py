# -*- coding: utf-8 -*-
# by @嗷呜
# 温馨提示：搜索只能搜拼音联想
# 播放需要挂代理
import sys
import time
import uuid
from Crypto.Hash import MD5
sys.path.append('..')
from base.spider import Spider


class Spider(Spider):

    def init(self, extend=""):
        self.uid = self.getuid()
        self.token, self.code = self.getuserinfo()
        pass

    def getName(self):
        pass

    def isVideoFormat(self, url):
        pass

    def manualVideoCheck(self):
        pass

    def destroy(self):
        pass

    # 內置輕量級中文轉拼音首字母函數（免安裝第三方庫，100% 安全不崩潰）
    def get_pinyin_first_letters(self, text):
        # 建立常用中文字符與首字母對照表 (基於 GBK 編碼區間的快捷映射)
        result = list()
        for char in text:
            # 如果是英文或數字，直接保留
            if 'a' <= char.lower() <= 'z' or '0' <= char <= '9':
                result.append(char.lower())
                continue
            
            try:
                # 轉成 gbk 編碼進行區間定位
                gbk_val = char.encode('gbk')
                if len(gbk_val) < 2:
                    continue
                code = gbk_val[0] * 256 + gbk_val[1]
                
                # 根據 GBK 常用漢字首字母編碼區間進行快速判斷
                if 45217 <= code <= 45252: result.append('a')
                elif 45253 <= code <= 45760: result.append('b')
                elif 45761 <= code <= 46317: result.append('c')
                elif 46318 <= code <= 46825: result.append('d')
                elif 46826 <= code <= 47009: result.append('e')
                elif 47010 <= code <= 47296: result.append('f')
                elif 47297 <= code <= 47613: result.append('g')
                elif 47614 <= code <= 48118: result.append('h')
                elif 48119 <= code <= 49061: result.append('j')
                elif 49062 <= code <= 49323: result.append('k')
                elif 49324 <= code <= 49895: result.append('l')
                elif 49896 <= code <= 50370: result.append('m')
                elif 50371 <= code <= 50613: result.append('n')
                elif 50614 <= code <= 50621: result.append('o')
                elif 50622 <= code <= 50905: result.append('p')
                elif 50906 <= code <= 51386: result.append('q')
                elif 51387 <= code <= 51445: result.append('r')
                elif 51446 <= code <= 52217: result.append('s')
                elif 52218 <= code <= 52697: result.append('t')
                elif 52698 <= code <= 52979: result.append('w')
                elif 52980 <= code <= 53688: result.append('x')
                elif 53689 <= code <= 54480: result.append('y')
                elif 54481 <= code <= 55289: result.append('z')
            except Exception:
                continue
        return "".join(result)

    host = 'https://tvapi211.magicetech.com'

    headers = {'User-Agent': 'okhttp/3.11.0'}

    def homeContent(self, filter):
        body = {'token': self.token, 'authcode': self.code}
        data = self.post(f'{self.host}/hr_1_1_0/apptvapi/web/index.php/video/filter-header', json=self.getbody(body),
                         headers=self.headers).json()
        result = {}
        classes = list()
        filters = {}
        for k in data['data']:
            classes.append({
                'type_name': k['channel_name'],
                'type_id': str(k['channel_id']),
            })
            
            # 建立獨立列表，精準控制各排篩選的上下堆疊順序
            normal_filters = list()
            sort_filters = list()
            
            for i in k['search_box']:
                # 1. 刪除「完成、更新中」篩選（欄位名稱為 status）
                if i['field'] == 'status':
                    continue
                    
                if len(i['list']):
                    item = {
                        'key': i['field'],
                        'name': i['label'],
                        'value': [{'n': j['display'], 'v': str(j['value'])} for j in i['list'] if j['value']]
                    }
                    # 2. 精準識別：只有將「熱門、最新、評分」（欄位名稱為 sort）單獨抽出來放到最下面
                    if i['field'] == 'sort':
                        sort_filters.append(item)
                    else:
                        # 包含「類型 (tag)」、「地區 (area)」、「年份 (year)」都保留在上方最前面
                        normal_filters.append(item)
            
            # 3. 完美拼接：普通篩選（類型在最前、隨後地區與年份）在前，排序按鈕嚴格在最後一行
            filters[str(k['channel_id'])] = normal_filters + sort_filters

        result['class'] = classes
        result['filters'] = filters
        return result

    def homeVideoContent(self):
        body = {'token': self.token, 'authcode': self.code}
        data = self.post(f'{self.host}/hr_1_1_0/apptvapi/web/index.php/video/index-tv', json=self.getbody(body),
                         headers=self.headers).json()
        return {'list': self.getlist(data['data'][0]['banner'])}

    def categoryContent(self, tid, pg, filter, extend):
        body = {'token': self.token, 'authcode': self.code, 'channel_id': tid, 'area': extend.get('area', '0'),
                'year': extend.get('year', '0'), 'sort': extend.get('sort', '0'), 'tag': extend.get('tag', 'hot'),
                'status': extend.get('status', '0'), 'page_num': pg, 'page_size': '24'}
        data = self.post(f'{self.host}/hr_1_1_0/apptvapi/web/index.php/video/filter-video', json=self.getbody(body),
                         headers=self.headers).json()
        result = {}
        result['list'] = self.getlist(data['data']['list'])
        result['page'] = pg
        result['pagecount'] = 9999
        result['limit'] = 90
        result['total'] = 999999
        return result

    def detailContent(self, ids):
        ids = ids[0].split('@')
        body = {'token': self.token, 'authcode': self.code, 'channel_id': ids[0], 'video_id': ids[1]}
        data = self.post(f'{self.host}/hr_1_1_0/apptvapi/web/index.php/video/detail', json=self.getbody(body),
                         headers=self.headers).json()
        vdata = {}
        for k in data['data']['chapters']:
            i = k['sourcelist']
            for j in i:
                if j['source_name'] not in vdata: vdata[j['source_name']] = []
                vdata[j['source_name']].append(f"{k['title']}${j['source_url']}")
        plist, names = [], []
        for key, value in vdata.items():
            names.append(key)
            plist.append('#'.join(value))
        vod = {
            'vod_play_from': '$$$'.join(names),
            'vod_play_url': '$$$'.join(plist),
        }
        return {'list': [vod]}

    def searchContent(self, key, quick, pg="1"):
        # 1. 呼叫內部原生對照表轉首字母 (如: "蘭香如故" -> "lxrg")
        raw_pinyin = self.get_pinyin_first_letters(key)
        
        # 2. 嚴格截取前三碼聯想碼 (如 "lxrg" -> "lxr")
        three_letter_key = raw_pinyin[:3]
        
        body = {'token': self.token, 'authcode': self.code, 'keyword': three_letter_key, 'page_num': pg}
        data = self.post(f'{self.host}/hr_1_1_0/apptvapi/web/index.php/search/letter-result', json=self.getbody(body),
                         headers=self.headers).json()
        return {'list': self.getlist(data['data']['list'])}

    def playerContent(self, flag, id, vipFlags):
        # https://rysp.tv
        # https://aigua.tv
        result = {
            "parse": 0,
            "url": id,
            "header": {
                "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 11; M2012K10C Build/RP1A.200720.011)",
                "Origin": "https://aigua.tv",
                "Referer": "https://aigua.tv/"
            }
        }
        return result

    def localProxy(self, param):
        pass

    def getuserinfo(self):
        data = self.post(f'{self.host}/hr_1_1_0/apptvapi/web/index.php/user/auth-login', json=self.getbody(),
                         headers=self.headers).json()
        v = data['data']
        return v['user_token'], v['authcode']

    def getuid(self):
        uid = self.getCache('uid')
        if not uid:
            uid = str(uuid.uuid4())
            self.setCache('uid', uid)
        return uid

    def getbody(self, json_data=None):
        if json_data is None: json_data = {}
        params = {"product": "4", "ver": "1.1.0", "debug": "1", "appId": "1", "osType": "3", "marketChannel": "tv",
                  "sysVer": "11", "time": str(int(time.time())), "packageName": "com.gzsptv.gztvvideo",
                  "udid": self.uid, }
        json_data.update(params)
        sorted_json = dict(sorted(json_data.items(), key=lambda item: item[0]))
        text = '&'.join(f"{k}={v}" for k, v in sorted_json.items() if v != '')
        md5_hash = self.md5(f"jI7POOBbmiUZ0lmi{text}D9ShYdN51ksWptpkTu11yenAJu7Zu3cR").upper()
        json_data.update({'sign': md5_hash})
        return json_data

    def md5(self, text):
        h = MD5.new()
        h.update(text.encode('utf-8'))
        return h.hexdigest()

    def getlist(self, data):
        videos = []
        for i in data:
            if type(i.get('video')) == dict: i = i['video']
            videos.append({
                'vod_id': f"{i.get('channel_id')}@{i.get('video_id')}",
                'vod_name': i.get('video_name'),
                'vod_pic': i.get('cover'),
                'vod_year': i.get('score'),
                'vod_remarks': i.get('flag'),
            })
        return videos
