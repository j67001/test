# -*- coding: utf-8 -*-
# @Author  : 老王叔叔 for 泥視頻.CC with Multi-Source Support
# @Time    : 2025/04/06

import sys
import requests
from lxml import etree
import json
import re
from urllib.parse import urlencode
sys.path.append('..')
from base.spider import Spider

class Spider(Spider):
    def __init__(self):
        self.home_url = 'https://www.nbyy.cc'
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
            "Referer": "https://www.nivod.cc/",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Connection": "keep-alive",
        }
        self.placeholder_pic = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/placeholder.jpg'

    def init(self, extend=""):
        pass

    def getName(self):
        return "泥視頻.CC"

    def getDependence(self):
        return []

    def isVideoFormat(self, url):
        return url.endswith('.m3u8') or url.endswith('.mp4')

    def manualVideoCheck(self):
        return False

    def homeContent(self, filter):
        categories = "电影$movie#电视剧$tv#动漫$anime#综艺$show"
        class_list = [{'type_id': v.split('$')[1], 'type_name': v.split('$')[0]} for v in categories.split('#')]
        filters = {
            'movie': [
                {'key': 'class', 'name': '剧情', 'value': [{'n': v.split('$')[0], 'v': v.split('$')[1]} for v in "冒险$mao-xian#剧情$ju-qing#动作$dong-zuo#同性$tong-xing#喜剧$xi-ju#奇幻$qi-huan#恐怖$kong-bu#悬疑$xuan-yi#惊悚$jing-song#战争$zhan-zheng#歌舞$ge-wu#灾难$zai-nan#爱情$ai-qing#犯罪$fan-zui#科幻$ke-huan".split('#')]},
                {'key': 'area', 'name': '地区', 'value': [{'n': v.split('$')[0], 'v': v.split('$')[1]} for v in "大陆$cn#香港$hk#台湾$tw#欧美$west#泰国$th#新马$sg-my#其他$other".split('#')]},
                {'key': 'year', 'name': '年份', 'value': [{'n': v, 'v': v} for v in ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019-2010", "2009-2000", "90年代", "80年代", "更早"]]}
            ],
            'tv': [
                {'key': 'class', 'name': '剧情', 'value': [{'n': v.split('$')[0], 'v': v.split('$')[1]} for v in "剧情$ju-qing#动作$dong-zuo#历史$li-shi#历险$mao-xian#古装$gu-zhuang#同性$tong-xing#喜剧$xi-ju#奇幻$qi-huan#家庭$jia-ting#悬疑$xuan-yi#惊悚$jing-song#战争$zhan-zheng#武侠$wu-xia#爱情$ai-qing#科幻$ke-huan#罪案$zui-an".split('#')]},
                {'key': 'area', 'name': '地区', 'value': [{'n': v.split('$')[0], 'v': v.split('$')[1]} for v in "大陆$cn#香港$hk#台湾$tw#日本$jp#韩国$kr#欧美$west#泰国$th#新马$sg-my".split('#')]},
                {'key': 'year', 'name': '年份', 'value': [{'n': v, 'v': v} for v in ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019-2015", "2014-2010", "2009-2000", "90年代", "80年代", "更早"]]}
            ],
            'anime': [
                {'key': 'class', 'name': '剧情', 'value': [{'n': v.split('$')[0], 'v': v.split('$')[1]} for v in "冒险$mao-xian#动画电影$movie#推理$tui-li#校园$xiao-yuan#治愈$zhi-yu#泡面$pao-mian#热血$re-xue#科幻$ke-huan#魔幻$mo-huan".split('#')]},
                {'key': 'area', 'name': '地区', 'value': [{'n': v.split('$')[0], 'v': v.split('$')[1]} for v in "大陆$cn#日本$jp#欧美$west".split('#')]},
                {'key': 'year', 'name': '年份', 'value': [{'n': v, 'v': v} for v in ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019-2015", "2014-2010", "2009-2000", "90年代", "80年代", "更早"]]}
            ],
            'show': [
                {'key': 'class', 'name': '剧情', 'value': [{'n': v.split('$')[0], 'v': v.split('$')[1]} for v in "搞笑$gao-xiao#音乐$yin-yue#真人秀$zhen-ren-xiu#脱口秀$tuo-kou-xiu".split('#')]},
                {'key': 'area', 'name': '地区', 'value': [{'n': v.split('$')[0], 'v': v.split('$')[1]} for v in "大陆$cn#韩国$kr#欧美$west#其它$other".split('#')]},
                {'key': 'year', 'name': '年份', 'value': [{'n': v, 'v': v} for v in ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019-2015", "2014-2010", "2009-2000", "90年代", "80年代", "更早"]]}
            ]
        }
        return {'class': class_list, 'filters': filters if filter else {}}

    def homeVideoContent(self):
        result = {'list': []}
        try:
            res = requests.get(self.home_url, headers=self.headers)
            res.encoding = 'utf-8'
            root = etree.HTML(res.text)
            data_list = root.xpath('//div[contains(@class, "qy-mod-link-wrap")]/a')
            for i in data_list:
                name_nodes = i.xpath('.//picture[@class="video-item-preview-img"]/img/@alt')
                vod_name = name_nodes[0].strip() if name_nodes else None
                if not vod_name:
                    vod_name = i.xpath('./@title')
                    vod_name = vod_name[0].strip() if vod_name else "未知"
                vod_id = i.get('href', '')
                pic_nodes = i.xpath('.//picture[@class="video-item-preview-img"]/img/@src')
                vod_pic = pic_nodes[0] if pic_nodes else self.placeholder_pic
                if vod_pic.startswith('/'):
                    vod_pic = self.home_url + vod_pic
                remark_nodes = i.xpath('.//span[contains(@class, "qy-mod-label")]/text()')
                vod_remarks = remark_nodes[0].strip() if remark_nodes else ''
                result['list'].append({
                    'vod_id': vod_id,
                    'vod_name': vod_name,
                    'vod_pic': vod_pic,
                    'vod_remarks': vod_remarks
                })
            result['list'] = result['list'][:10]
        except Exception as e:
            print(f"Error in homeVideoContent: {e}")
        return result

    def categoryContent(self, tid, pg, filter, ext):
        result = {'list': []}
        _year = ext.get('year', '')
        _class = ext.get('class', '')
        _area = ext.get('area', '')
        params = {
            'channel': tid,
            'region': _area,
            'showtype': _class,
            'year': _year,
            'page': pg
        }
        url = f"{self.home_url}/filter.html?{urlencode(params)}"
        
        # 如果頁碼超過 5，直接返回空結果
        if int(pg) > 5:
            result['page'] = int(pg)
            result['pagecount'] = 5
            result['limit'] = 0
            result['total'] = 240
            return result
        
        try:
            res = requests.get(url, headers=self.headers)
            res.encoding = 'utf-8'
            print(f"categoryContent URL: {url}")
            print(f"categoryContent Response Status: {res.status_code}")
            print(f"categoryContent HTML length: {len(res.text)}")
            
            root = etree.HTML(res.text)
            data_list = root.xpath('//li[contains(@class, "qy-mod-li")]')
            
            for i in data_list:
                vod_id = i.xpath('.//a/@href')[0] if i.xpath('.//a/@href') else ''
                name_nodes = i.xpath('.//a/@title')
                vod_name = name_nodes[0].strip() if name_nodes else "未知"
                pic_nodes = i.xpath('.//div[@class="qy-mod-cover"]/@style')
                vod_pic = None
                if pic_nodes:
                    style = pic_nodes[0]
                    match = re.search(r'url\((.*?)\)', style)
                    vod_pic = match.group(1).strip() if match else None
                if not vod_pic:
                    vod_pic = self.placeholder_pic
                if vod_pic.startswith('/'):
                    vod_pic = self.home_url + vod_pic
                remark_nodes = i.xpath('.//span[@class="qy-mod-label"]/text()')
                vod_remarks = remark_nodes[0].strip() if remark_nodes else ''
                
                result['list'].append({
                    'vod_id': vod_id,
                    'vod_name': vod_name,
                    'vod_pic': vod_pic,
                    'vod_remarks': vod_remarks
                })

            # 假設每頁最多 48 個項目，網站分頁上限為 5 頁
            current_items = len(data_list)
            total_pages = 5  # 網站分頁上限為 5
            if current_items < 48:  # 如果當前頁項目少於 48，假設是最後一頁
                total_pages = int(pg)
            total_items = (int(pg) - 1) * 48 + current_items if total_pages == int(pg) else total_pages * 48
            
            result['page'] = int(pg)
            result['pagecount'] = total_pages
            result['limit'] = current_items
            result['total'] = total_items
        except Exception as e:
            print(f"Error in categoryContent: {e}")
        
        return result

    def detailContent(self, array):
        from concurrent.futures import ThreadPoolExecutor  # 保持您原汁原味的加速庫

        result = {'list': []}
        ids = array[0] if isinstance(array, list) else array
        
        # 確保網址對接新版的 /detail/xxxx.html
        if not ids.startswith('http'):
            detail_url = f"{self.home_url}{ids}"
        else:
            detail_url = ids

        try:
            res = requests.get(detail_url, headers=self.headers, timeout=5)
            res.encoding = 'utf-8'
            root = etree.HTML(res.text)
            
            # --- 1. 重新校準新版靜態 HTML 的欄位解析 (加入多重容錯) ---
            vod_name = "未知"
            name_nodes = root.xpath('//h1/text()') or root.xpath('//h2/text()') or root.xpath('//div[@class="right-title"]/text()')
            if name_nodes:
                vod_name = name_nodes[0].strip()

            vod_year = root.xpath('//div[@id="postYear"]/text()')[0].strip() if root.xpath('//div[@id="postYear"]') else ""
            if not vod_year:
                # 新版可能直接寫在文字節點中，嘗試從純文字抽離年份
                year_match = re.search(r'(202\d)', res.text)
                vod_year = year_match.group(1) if year_match else ""

            vod_area = root.xpath('//div[@id="region"]/text()')[0].strip() if root.xpath('//div[@id="region"]') else ""
            if not vod_area and "大陆" in res.text:
                vod_area = "大陆"

            vod_content = root.xpath('//div[@id="show-desc"]/text()')[0].strip() if root.xpath('//div[@id="show-desc"]') else ""
            if not vod_content:
                content_nodes = root.xpath('//div[contains(text(), "描述")]/following-sibling::div/text()') or root.xpath('//div[contains(@class, "desc")]/text()')
                vod_content = content_nodes[0].strip() if content_nodes else ""

            vod_remarks = root.xpath('//div[@id="updateTxt"]/text()')[0].strip() if root.xpath('//div[@id="updateTxt"]') else ""
            vod_actor = root.xpath('//div[@id="actors"]/text()')[0].strip() if root.xpath('//div[@id="actors"]') else ""
            vod_director = root.xpath('//div[@id="director"]/text()')[0].strip() if root.xpath('//div[@id="director"]') else ""
            
            vod_pic = root.xpath('//img[@class="left-img"]/@src')[0] if root.xpath('//img[@class="left-img"]') else self.placeholder_pic
            if vod_pic == self.placeholder_pic:
                pic_nodes = root.xpath('//picture/img/@src') or root.xpath('//img[contains(@class, "img")]/@src')
                if pic_nodes:
                    vod_pic = pic_nodes[0]
            if vod_pic.startswith('/'):
                vod_pic = self.home_url + vod_pic

            # --- 2. 劇集列表解析校準 ---
            # 依據您上傳的新版源碼，劇集列表包裹在 <li> 或 <a> 標籤內
            episodes = root.xpath('//div[@id="list-jj"]/a') or root.xpath('//li[contains(text(), "第") and contains(text(), "集")]') or root.xpath('//a[contains(text(), "第") and contains(text(), "集")]')
            
            if not episodes:
                vod = {
                    'vod_id': ids,
                    'vod_name': vod_name,
                    'vod_pic': vod_pic,
                    'type_name': '',
                    'vod_year': vod_year,
                    'vod_area': vod_area,
                    'vod_remarks': vod_remarks,
                    'vod_actor': vod_actor,
                    'vod_director': vod_director,
                    'vod_content': vod_content,
                    'vod_play_from': '泥視頻',
                    'vod_play_url': '第1集$https://nivod.cc'
                }
            else:
                play_from = set()
                play_urls = {}
                
                # --- 3. 核心修正：精準提取新版影片 ID 的正則表達式 ---
                # 舊版 ids 格式: /voddetail/202658234 -> ids.split('/')[2] 拿到 202658234
                # 新版 ids 格式: /detail/202658234.html -> 必須用正則提取，否則 split 會出錯
                vod_id_match = re.search(r'/detail/(\d+)\.html', ids)
                vod_id_str = vod_id_match.group(1) if vod_id_match else ids.split('/')[-1].replace('.html', '')

                # --- 恢復您原本的單集解析邏輯，並對新版 HTML 節點做結構適應 ---
                def fetch_ep_info(index_and_ep):
                    # 為了保證新版網頁各種非標準 <a> 或 <li> 節點都能抓到正確的 ep_id，我們傳入 index
                    idx, ep = index_and_ep
                    try:
                        # 擷取集數名稱 (例如 "第24集")
                        ep_name = ep.xpath('.//div[@class="item"]/text()')
                        ep_name = ep_name[0].strip() if ep_name else ep.xpath('./text()')[0].strip()
                        
                        # 校準 ep_id：新版網頁網址直接附加網頁錨點（如 #ep24 或直接是 href="/detail/xxx.html#ep24"）
                        href = ep.get('href', '')
                        if '#' in href:
                            ep_id = href.split('#')[-1]
                        else:
                            # 萬一網頁源碼沒有 href，則依據迴圈序號自動組裝 ep1, ep2, ep3 傳給 API
                            # 若網頁為倒序排列（如您源碼中24集在最上面），則進行對應映射
                            ep_id = f"ep{len(episodes) - idx}" if "倒序" in res.text else f"ep{idx + 1}"
                        
                        # 完美恢復組裝您的核心 XHR 請求網址
                        xhr_url = f"{self.home_url}/xhr_playinfo/{vod_id_str}-{ep_id}"
                        
                        xhr_res = requests.get(xhr_url, headers=self.headers, timeout=3)
                        xhr_res.encoding = 'utf-8'
                        data = xhr_res.json()
                        return ep_name, data
                    except Exception as e:
                        return None, None

                # --- 4. 併發多執行緒（完全保留原有機制） ---
                # 使用 enumerate 包裹，把順序序號一起送進任務中，確保 ep_id 計算精準
                with ThreadPoolExecutor(max_workers=15) as executor:
                    tasks = list(executor.map(fetch_ep_info, enumerate(episodes[::-1])))
                
                # --- 按原本的倒序順序重新收割結果，確保集數順序不亂 ---
                for ep_name, data in tasks:
                    if not ep_name or not data:
                        continue
                    if 'pdatas' in data and data['pdatas']:
                        for source in data['pdatas']:
                            source_name = source['from']
                            play_from.add(source_name)
                            if source_name not in play_urls:
                                play_urls[source_name] = []
                            play_urls[source_name].append(f"{ep_name}${source['playurl']}")
                
                vod_play_from = '$$$'.join(play_from)
                vod_play_url = '$$$'.join(['#'.join(play_urls[source]) for source in play_from])
                
                vod = {
                    'vod_id': ids,
                    'vod_name': vod_name,
                    'vod_pic': vod_pic,
                    'type_name': '',
                    'vod_year': vod_year,
                    'vod_area': vod_area,
                    'vod_remarks': vod_remarks,
                    'vod_actor': vod_actor,
                    'vod_director': vod_director,
                    'vod_content': vod_content,
                    'vod_play_from': vod_play_from,
                    'vod_play_url': vod_play_url
                }
            result['list'].append(vod)
        except Exception as e:
            print(f"Error in detailContent: {e}")
            result['list'].append({
                'vod_id': ids,
                'vod_name': '未知',
                'vod_pic': self.placeholder_pic,
                'vod_play_from': '泥視頻',
                'vod_play_url': ''
            })
        return result

    def searchContent(self, key, quick, pg='1'):
        result = {'list': []}
        try:
            search_url = f"{self.home_url}/search_x.html?keyword={key}&page={pg}"
            res = requests.get(search_url, headers=self.headers)
            res.encoding = 'utf-8'
            root = etree.HTML(res.text)
            data_list = root.xpath('//a[contains(@class, "qy-mod-link")]')
            for item in data_list:
                name_nodes = item.xpath('.//picture[@class="video-item-preview-img"]/img/@alt')
                vod_name = name_nodes[0].strip() if name_nodes else None
                if not vod_name:
                    vod_name = item.xpath('./@title')
                    vod_name = vod_name[0].strip() if vod_name else "未知"
                vod_id = item.get('href', '')
                pic_nodes = item.xpath('.//picture[@class="video-item-preview-img"]/img/@src')
                vod_pic = pic_nodes[0] if pic_nodes else self.placeholder_pic
                if vod_pic.startswith('/'):
                    vod_pic = self.home_url + vod_pic
                vod_remarks = ''
                result['list'].append({
                    'vod_id': vod_id,
                    'vod_name': vod_name,
                    'vod_pic': vod_pic,
                    'vod_remarks': vod_remarks
                })
        except Exception as e:
            print(f"Error in searchContent: {e}")
        return result

    def playerContent(self, flag, id, vipFlags):
        result = {}
        try:
            play_url = id.split('$')[1] if '$' in id else id
            result = {
                'url': play_url,
                'header': json.dumps(self.headers),
                'parse': 0,
                'playUrl': ''
            }
        except Exception as e:
            print(f"Error in playerContent: {e}")
            result = {'url': '', 'parse': 0}
        return result

    def localProxy(self, param):
        return [200, "video/MP2T", {}, b""]

    def destroy(self):
        pass
