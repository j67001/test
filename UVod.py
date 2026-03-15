# -*- coding: utf-8 -*-
import sys,json,time,base64,random,string,hashlib
from urllib.parse import urlencode,quote
from base.spider import Spider
from Crypto.Cipher import AES,PKCS1_v1_5
from Crypto.PublicKey import RSA
from Crypto.Util.Padding import pad,unpad

class Spider(Spider):
    def __init__(self):
        super().__init__()
        self.base_url = 'https://api-h5.uvod.tv'; self.web_url = 'https://www.uvod.tv'; self.token = ''; self._iv = b"abcdefghijklmnop"
        self._client_private = """-----BEGIN PRIVATE KEY-----
MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAJ4FBai1Y6my4+fc
8AD5tyYzxgN8Q7M/PuFv+8i1Xje8ElXYVwzvYd1y/cNxwgW4RX0tDy9ya562V33x
6SyNr29DU6XytOeOlOkxt3gd5169K4iFaJ0l0wA4koMTcCAYVxC9B4+zzS5djYmF
MuRGfYgKYNH99vfY7BZjdAY68ty5AgMBAAECgYB1rbvHJj5wVF7Rf4Hk2BMDCi9+
zP4F8SW88Y6KrDbcPt1QvOonIea56jb9ZCxf4hkt3W6foRBwg86oZo2FtoZcpCJ+
rFqUM2/wyV4CuzlL0+rNNSq7bga7d7UVld4hQYOCffSMifyF5rCFNH1py/4Dvswm
pi5qljf+dPLSlxXl2QJBAMzPJ/QPAwcf5K5nngQtbZCD3nqDFpRixXH4aUAIZcDz
S1RNsHrT61mEwZ/thQC2BUJTQNpGOfgh5Ecd1MnURwsCQQDFhAFfmvK7svkygoKX
t55ARNZy9nmme0StMOfdb4Q2UdJjfw8+zQNtKFOM7VhB7ijHcfFuGsE7UeXBe20n
g/XLAkEAv9SoT2hgJaQxxUk4MCF8pgddstJlq8Z3uTA7JMa4x+kZfXTm/6TOo6I8
2VbXZLsYYe8op0lvsoHMFvBSBljV0QJBAKhxyoYRa98dZB5qZRskciaXTlge0WJk
kA4vvh3/o757izRlQMgrKTfng1GVfIZFqKtnBiIDWTXQw2N9cnqXtH8CQAx+CD5t
l1iT0cMdjvlMg2two3SnpOjpo7gALgumIDHAmsVWhocLtcrnJI032VQSUkNnLq9z
EIfmHDz0TPTNHBQ=
-----END PRIVATE KEY-----
"""
        self._client_public = """-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCeBQWotWOpsuPn3PAA+bcmM8YD
fEOzPz7hb/vItV43vBJV2FcM72Hdcv3DccIFuEV9LQ8vcmuetld98eksja9vQ1Ol
8rTnjpTpMbd4HedevSuIhWidJdMAOJKDE3AgGFcQvQePs80uXY2JhTLkRn2ICmDR
/fb32OwWY3QGOvLcuQIDAQAB
-----END PUBLIC KEY-----
"""
        self._server_public = """-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCeBQWotWOpsuPn3PAA+bcmM8YD
fEOzPz7hb/vItV43vBJV2FcM72Hdcv3DccIFuEV9LQ8vcmuetld98eksja9vQ1Ol
8rTnjpTpMbd4HedevSuIhWidJdMAOJKDE3AgGFcQvQePs80uXY2JhTLkRn2ICmDR
/fb32OwWY3QGOvLcuQIDAQAB
-----END PUBLIC KEY-----
"""

    def getName(self): return "UVOD"

    def init(self, extend=""):
        try: cfg = json.loads(extend) if isinstance(extend, str) and extend.strip().startswith('{') else extend if isinstance(extend, dict) else {}
        except Exception: cfg = {}
        self.base_url = cfg.get('base_url', self.base_url); self.token = cfg.get('token', self.token)
        # --- 新增：判斷 ext 是否開啟了午夜模式 ---
        # 這裡判斷 extend 是否直接等於 True (對應 JSON 中的 "ext": true)
        # 或者 cfg 字典中是否有自定義開關
        self.show_adult = (extend is True or str(extend).lower() == "true")
        return self.homeContent(False)

    def isVideoFormat(self, url): return any(x in url.lower() for x in ['.m3u8', '.mp4']) if url else False
    def manualVideoCheck(self): return False
    def destroy(self): pass

    def _random_key(self, n=32):
        chars = string.ascii_letters + string.digits
        return ''.join(random.choice(chars) for _ in range(n))

    def _encrypt(self, plain_text: str) -> str:
        aes_key = self._random_key(32).encode('utf-8')
        cipher = AES.new(aes_key, AES.MODE_CBC, iv=self._iv)
        ct_b64 = base64.b64encode(cipher.encrypt(pad(plain_text.encode('utf-8'), AES.block_size))).decode('utf-8')
        rsa_pub = RSA.import_key(self._server_public); rsa_cipher = PKCS1_v1_5.new(rsa_pub)
        rsa_b64 = base64.b64encode(rsa_cipher.encrypt(aes_key)).decode('utf-8')
        return f"{ct_b64}.{rsa_b64}"

    def _decrypt(self, enc_text: str) -> str:
        try:
            parts = enc_text.split('.'); ct_b64, rsa_b64 = parts
            rsa_priv = RSA.import_key(self._client_private)
            aes_key = PKCS1_v1_5.new(rsa_priv).decrypt(base64.b64decode(rsa_b64), None)
            cipher = AES.new(aes_key, AES.MODE_CBC, iv=self._iv)
            pt = unpad(cipher.decrypt(base64.b64decode(ct_b64)), AES.block_size)
            return pt.decode('utf-8', 'ignore')
        except Exception: return enc_text

    def _build_headers(self, path: str, payload: dict):
        ts = str(int(time.time() * 1000))
        token = self.token or ''
        
        # 過濾無效參數
        filtered = {k: v for k, v in payload.items() if v not in (0, '0', '', False, None)}
        
        if path == '/video/list':
            query_parts = []
            for k in sorted(filtered.keys()):
                v = filtered[k]
                # 關鍵修復：除了 keyword，region 等中文參數通常也要進行編碼才能通過簽名校驗
                if k in ['keyword', 'region']:
                    v = quote(str(v), safe='').lower()
                query_parts.append(f"{k}={v}")
            query_str = "&".join(query_parts)
            text = f"-{query_str}-{ts}"
            
        elif path == '/video/latest':
            parent_id = filtered.get('parent_category_id', 101)
            text = f"-parent_category_id={parent_id}-{ts}"
            
        elif path == '/video/info':
            text = f"-id={filtered.get('id', '')}-{ts}"
            
        elif path == '/video/source':
            q = filtered.get('quality', '')
            fid = filtered.get('video_fragment_id', '')
            vid = filtered.get('video_id', '')
            text = f"-quality={q}&video_fragment_id={fid}&video_id={vid}-{ts}"
            
        else:
            query = urlencode(sorted(filtered.items())).lower()
            text = f"{token}-{query}-{ts}"

        sig = hashlib.md5(text.encode('utf-8')).hexdigest()
        
        return {
            'Content-Type': 'application/json',
            'X-TOKEN': token,
            'X-TIMESTAMP': ts,
            'X-SIGNATURE': sig,
            'Origin': self.web_url,
            'Referer': self.web_url + '/',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36'
        }

    def _post_api(self, path: str, payload: dict):
        url = self.base_url.rstrip('/') + path
        try:
            headers = self._build_headers(path, payload)
            body = self._encrypt(json.dumps(payload, ensure_ascii=False))
            rsp = self.post(url, data=body, headers=headers, timeout=15)
            if rsp.status_code != 200: return None
            
            txt = rsp.text.strip()
            try:
                dec = self._decrypt(txt)
                obj = json.loads(dec)
            except:
                obj = json.loads(txt)
                
            if isinstance(obj, dict) and obj.get('error') == 0:
                return obj.get('data')
            return None
        except:
            return None

    def homeContent(self, filter):
        data = self._post_api('/video/category', {})
        classes = []
        if data:
            lst = data.get('list') or data.get('category') or []
            for it in lst:
                cid = it.get('id') or it.get('category_id') or it.get('value')
                name = it.get('name') or it.get('label')
                
                 # --- 核心修改：判斷是否隱藏午夜 ---
                if not self.show_adult and (cid == '108' or '午夜' in name):
                    continue
                
                if cid and name:
                    classes.append({'type_name': str(name), 'type_id': str(cid)})
        
        if not classes: classes = [{'type_name': '电影', 'type_id': '100'}, {'type_name': '电视剧', 'type_id': '101'}, {'type_name': '综艺', 'type_id': '102'}, {'type_name': '动漫', 'type_id': '103'}, {'type_name': '体育', 'type_id': '104'}, {'type_name': '纪录片', 'type_id': '105'}, {'type_name': '粤台专区', 'type_id': '106'}, {'type_name': '儿童', 'type_id': '107'}]
            # 如果開啟了，手動補上
        if self.show_adult: classes.append({'type_name': '午夜', 'type_id': '108'})
        # 1. 定義各主分類專屬的子類型 (category_id)
        cate_mapping = {
            "100": [{"n": "全部", "v": ""},{"n": "喜剧", "v": "109"},{"n": "爱情", "v": "110"},{"n": "动作", "v": "111"},{"n": "犯罪", "v": "112"},{"n": "科幻", "v": "113"},{"n": "奇幻", "v": "114"},{"n": "冒险", "v": "115"},{"n": "灾难", "v": "116"},{"n": "惊悚", "v": "117"},{"n": "剧情", "v": "118"},{"n": "战争", "v": "119"},{"n": "经典", "v": "120"},{"n": "悬疑", "v": "210"},{"n": "历史", "v": "211"},{"n": "粤语", "v": "122"},{"n": "预告片", "v": "121"}],
            "101": [{"n": "全部", "v": ""},{"n": "短剧", "v": "207"},{"n": "国产剧", "v": "123"},{"n": "港台剧", "v": "125"},{"n": "日韓劇", "v": "126"},{"n": "歐美劇", "v": "124"},{"n": "新馬泰", "v": "127"},{"n": "其它劇", "v": "128"}],
            "102": [{"n": "全部", "v": ""},{"n": "搞笑", "v": "129"},{"n": "情感", "v": "130"},{"n": "选秀", "v": "131"},{"n": "访谈", "v": "132"},{"n": "时尚", "v": "133"},{"n": "演唱会", "v": "136"},{"n": "脱口秀", "v": "135"},{"n": "真人秀", "v": "134"}],
            "103": [{"n": "全部", "v": ""},{"n": "冒险", "v": "137"},{"n": "格斗", "v": "138"},{"n": "科幻", "v": "139"},{"n": "恋爱", "v": "140"},{"n": "校园", "v": "141"},{"n": "后宫", "v": "142"},{"n": "异界", "v": "143"},{"n": "美食", "v": "144"},{"n": "歌舞", "v": "145"},{"n": "運動", "v": "146"},{"n": "競技", "v": "147"},{"n": "魔幻", "v": "148"},{"n": "奇幻", "v": "149"},{"n": "搞笑", "v": "209"},{"n": "熱血", "v": "151"},{"n": "歷史", "v": "152"},{"n": "戰爭", "v": "153"},{"n": "機戰", "v": "154"},{"n": "爆笑", "v": "155"},{"n": "治癒", "v": "156"},{"n": "勵志", "v": "157"},{"n": "懸疑", "v": "158"},{"n": "少女", "v": "159"},{"n": "推理", "v": "160"},{"n": "恐怖", "v": "161"},{"n": "神鬼", "v": "162"},{"n": "日常", "v": "208"},{"n": "百合", "v": "150"}],
            "104": [{"n": "全部", "v": ""},{"n": "足球", "v": "163"},{"n": "篮球", "v": "164"},{"n": "综合", "v": "165"},{"n": "探索", "v": "166"},{"n": "奥运", "v": "167"}],
            "105": [{"n": "全部", "v": ""},{"n": "文化", "v": "168"},{"n": "科技", "v": "169"},{"n": "历史", "v": "170"},{"n": "军事", "v": "171"},{"n": "人物", "v": "172"},{"n": "解密", "v": "173"},{"n": "自然", "v": "174"}],
            "106": [{"n": "全部", "v": ""},{"n": "电影", "v": "175"},{"n": "电视剧-国产", "v": "176"},{"n": "电视剧-外产", "v": "177"},{"n": "动画", "v": "179"},{"n": "综艺", "v": "178"}],
            "107": [{"n": "全部", "v": ""},{"n": "儿歌", "v": "187"},{"n": "故事", "v": "188"},{"n": "学英语", "v": "189"},{"n": "动作", "v": "190"},{"n": "百科", "v": "191"},{"n": "国学", "v": "192"},{"n": "手工", "v": "193"},{"n": "识字", "v": "194"},{"n": "数学", "v": "195"},{"n": "美术", "v": "196"},{"n": "舞蹈", "v": "197"},{"n": "音乐", "v": "198"},{"n": "诗词", "v": "199"},{"n": "运动", "v": "200"},{"n": "口才", "v": "201"},{"n": "益智", "v": "202"},{"n": "玩具", "v": "203"},{"n": "游戏", "v": "204"},{"n": "母婴", "v": "205"},{"n": "识物", "v": "206"}],
            "108": [{"n": "全部", "v": ""},{"n": "日韓", "v": "180"},{"n": "卡通", "v": "182"},{"n": "国产", "v": "183"},{"n": "欧美", "v": "181"},{"n": "VR", "v": "186"},{"n": "免费", "v": "185"},{"n": "其它", "v": "184"}]
        }

        # 2. 定義固定不變的篩選項
        common_regions = [{"n": "全部", "v": ""}, {"n": "大陆", "v": "大陆"}, {"n": "欧美", "v": "欧美"}, {"n": "香港", "v": "香港"}, {"n": "台湾", "v": "台湾"}, {"n": "日本", "v": "日本"}, {"n": "韩国", "v": "韩国"}, {"n": "新马泰", "v": "新马泰"}, {"n": "其他", "v": "其他"}]
        common_years = [{"n": "全部", "v": ""}] + [{"n": str(y), "v": str(y)} for y in range(2026, 2009, -1)]
        common_sorts = [{"n": "最新", "v": "create_time"}, {"n": "更新", "v": "update_time"}, {"n": "最热", "v": "hits"}, {"n": "评分", "v": "score"}]

        filters = {}
        for cls in classes:
            tid = cls['type_id']
            # 根據 tid 獲取子分類，若無匹配則顯示 "全部"
            sub_categories = cate_mapping.get(tid, [{"n": "全部", "v": ""}])
            
            filters[tid] = [
                {
                    "key": "category_id",
                    "name": "类型",
                    "value": sub_categories
                },
                {
                    "key": "region",
                    "name": "地区",
                    "value": common_regions
                },
                {
                    "key": "year",
                    "name": "年份",
                    "value": common_years
                },
                {
                    "key": "sort_field",
                    "name": "排序",
                    "value": common_sorts
                }
            ]
            
        return {'class': classes, 'filters': filters}

    def homeVideoContent(self):
        data = self._post_api('/video/latest', {'parent_category_id': 101})
        if isinstance(data, dict): lst = data.get('video_latest_list') or data.get('list') or data.get('rows') or data.get('items') or []
        elif isinstance(data, list): lst = data
        else: lst = []
        videos = []
        for k in lst:
            vid = k.get('id') or k.get('video_id') or k.get('videoId')
            if vid: 
                state = k.get('state') or ''
                # 2. 處理評分 (確保顯示為 4.0 格式)
                raw_score = k.get('score') or k.get('fraction') or 0
                try:
                    # 轉化為浮點數並格式化為一位小數
                    score = "{:.1f}".format(float(raw_score))
                except (ValueError, TypeError):
                    score = ""
                                # 3. 組合副標題：已完結 ✨ 4.0
                if state and score and float(raw_score) > 0:
                    remarks = f"{state} ✨ {score}"
                else:
                    remarks = state or score # 如果其中一個不滿足，就只顯示有的那個
            videos.append({'vod_id': str(vid), 'vod_name': k.get('title') or k.get('name') or '', 'vod_pic': k.get('poster') or k.get('cover') or k.get('pic') or '', 'vod_remarks': remarks })
        return {'list': videos}

    def categoryContent(self, tid, pg, filter, extend):
        page = int(pg) if str(pg).isdigit() else 1
        # 1. 保持基礎參數，確保包含 need_fragment 等關鍵字
        payload = {
            'parent_category_id': str(tid), 
            'page': page, 
            'pagesize': 42, 
            'sort_type': 'desc',
            'need_fragment': 1 # 某些版本 API 需要這個才能正確返回
        }
        
        # 2. 注入篩選參數 (保持與原文一致的 key)
        if isinstance(extend, dict):
            for k in ['category_id', 'year', 'region', 'state', 'sort_field']:
                if extend.get(k): 
                    payload[k] = extend[k]

        data = self._post_api('/video/list', payload)
        
        # 3. 兼容多種數據格式
        if isinstance(data, dict):
            lst = data.get('video_list') or data.get('list') or []
            total = data.get('total', 9999)
        elif isinstance(data, list):
            lst = data
            total = 9999
        else:
            lst, total = [], 0
            
        videos = []
        for k in lst:
            vid = k.get('id') or k.get('video_id') or k.get('videoId')
            if vid:
            	# 獲取狀態標籤（如：已完結、更新至18集）
                state = k.get('state') or ''
                # 獲取評分（如：4.0）
                # 2. 處理評分 (確保顯示為 4.0 格式)
                raw_score = k.get('score') or k.get('fraction') or 0
                try:
                # 轉化為浮點數並格式化為一位小數
                    score = "{:.1f}".format(float(raw_score))
                except (ValueError, TypeError):
                    score = ""
                # 3. 組合副標題：已完結 ✨ 4.0
                if state and score and float(raw_score) > 0:
                    remarks = f"{state} ✨ {score}"
                else:
                    remarks = state or score # 如果其中一個不滿足，就只顯示有的那個
                # 4. 直接使用原文獲取圖片的邏輯 (不使用容易出錯的 _fix_url)
                # 如果圖片還是不出來，請確保 _build_headers 裡的簽名包含 region
                videos.append({
                    'vod_id': str(vid), 
                    'vod_name': k.get('title') or k.get('name') or '', 
                    'vod_pic': k.get('poster') or k.get('cover') or k.get('pic') or '', 
                    'vod_remarks': remarks # 這裡現在顯示 "已完結 4.0"
                })
                
        return {'list': videos, 'page': page, 'pagecount': (total // 42) + 1, 'limit': 42, 'total': total}

    def detailContent(self, ids):
        vid = ids[0]; data = self._post_api('/video/info', {'id': vid}) or {}; video_info = data.get('video', {}) if isinstance(data, dict) else {}; fragments = data.get('video_fragment_list', []) if isinstance(data, dict) else []; play_urls = []
        if fragments:
            for fragment in fragments:
                name = fragment.get('symbol', '播放'); fragment_id = fragment.get('id', ''); qualities = fragment.get('qualities', [])
                if fragment_id and qualities: 
                    
                    max_quality = max(qualities) if qualities else 4
                    play_urls.append(f"{name}${vid}|{fragment_id}|[{max_quality}]")
        if not play_urls: play_urls.append(f"播放${vid}")
        vod = {'vod_id': str(vid), 'vod_name': video_info.get('title') or video_info.get('name') or '', 'vod_pic': video_info.get('poster') or video_info.get('cover') or video_info.get('pic') or '', 'vod_year': video_info.get('year') or '', 'vod_remarks': video_info.get('duration') or '', 'vod_content': video_info.get('description') or video_info.get('desc') or '', 'vod_play_from': '优视频', 'vod_play_url': '#'.join(play_urls) + '$$$'}
        return {'list': [vod]}

    def searchContent(self, key, quick, pg="1"):
        page = int(pg) if str(pg).isdigit() else 1
        payload = {'parent_category_id': None, 'category_id': None, 'language': None, 'year': None, 'region': None, 'state': None, 'keyword': key, 'paid': None, 'page': page, 'pagesize': 42, 'sort_field': '', 'sort_type': 'desc', 'need_fragment': 1}
        data = self._post_api('/video/list', payload)
        if isinstance(data, dict): lst = data.get('video_list') or data.get('list') or data.get('rows') or data.get('items') or []
        elif isinstance(data, list): lst = data
        else: lst = []
        videos = []
        for k in lst:
            vid = k.get('id') or k.get('video_id') or k.get('videoId')
            if vid: 
                # --- 修正處：合併 狀態 與 評分 ---
                state = k.get('state') or k.get('remarks') or ''
                # 2. 處理評分 (確保顯示為 4.0 格式)
                raw_score = k.get('score') or k.get('fraction') or 0
                try:
                # 轉化為浮點數並格式化為一位小數
                    score = "{:.1f}".format(float(raw_score))
                except (ValueError, TypeError):
                    score = ""
                # 3. 組合副標題：已完結 ✨ 4.0
                if state and score and float(raw_score) > 0:
                    remarks = f"{state} ✨ {score}"
                else:
                    remarks = state or score # 如果其中一個不滿足，就只顯示有的那個
                
            videos.append({'vod_id': str(vid), 'vod_name': k.get('title') or k.get('name') or '', 'vod_pic': k.get('poster') or k.get('cover') or k.get('pic') or '', 'vod_remarks': remarks })
        return {'list': videos}

    def _extract_first_media(self, obj):
        if not obj: return None
        if isinstance(obj, str): s = obj.strip(); return s if self.isVideoFormat(s) else None
        if isinstance(obj, (dict, list)):
            for v in (obj.values() if isinstance(obj, dict) else obj):
                r = self._extract_first_media(v)
                if r: return r
        return None

    def playerContent(self, flag, id, vipFlags):
        parts = id.split('|'); video_id = parts[0]
        if len(parts) >= 3:
            fragment_id = parts[1]; qualities_str = parts[2].strip('[]').replace(' ', ''); qualities = [q.strip() for q in qualities_str.split(',') if q.strip()]; quality = qualities[0] if qualities else '4'
            payload = {'video_id': video_id, 'video_fragment_id': int(fragment_id) if str(fragment_id).isdigit() else fragment_id, 'quality': int(quality) if str(quality).isdigit() else quality, 'seek': None}
        else: payload = {'video_id': video_id, 'video_fragment_id': 1, 'quality': 4, 'seek': None}
        data = self._post_api('/video/source', payload) or {}
        url = (data.get('video', {}).get('url', '') or data.get('url') or data.get('playUrl') or data.get('play_url') or self._extract_first_media(data) or '')
        if not url: return {'parse': 1, 'url': id}
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36', 'Referer': self.web_url + '/', 'Origin': self.web_url}
        return {'parse': 0, 'url': url, 'header': headers}

    def localProxy(self, param): return None
