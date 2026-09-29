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
        result = {'list': []}
        ids = array[0] if isinstance(array, list) else array # 容錯：/detail/202658234.html
        
        try:
            # 1. 精準自網址中擷取出影片純數位 ID (例如: 202658234)
            vod_id_match = re.search(r'/detail/(\d+)\.html', ids)
            if not vod_id_match:
                # 備用相容舊版：如果直接傳入純 ID 則不需匹配
                vod_id_str = ids.replace('/', '').replace('.html', '')
            else:
                vod_id_str = vod_id_match.group(1)

            # 2. 核心突破：直接請求泥視頻新版詳情頁的後端 API (xhr_playinfo 帶 ep1 作為初始化基礎)
            # 這能一次性拿到該影片所有的「播放線路」、「各線路擁有的集數列表」與影片基本資訊
            api_url = f"{self.home_url}/xhr_playinfo/{vod_id_str}-ep1"
            
            res = requests.get(api_url, headers=self.headers, timeout=5)
            res.encoding = 'utf-8'
            data = res.json() # 直接解析 JSON 資料，不再依賴不穩定的網頁 DOM 節點

            # 3. 解析影片基本資訊 (優先從 API 中讀取，若無則提供預設)
            vod_name = data.get('vod_name', '未知')
            if vod_name == '未知' and 'current_vod' in data:
                vod_name = data['current_vod'].get('vod_name', '未知')

            vod_pic = data.get('vod_pic', self.placeholder_pic)
            if vod_pic.startswith('/'):
                vod_pic = self.home_url + vod_pic

            vod_year = data.get('vod_year', '')
            vod_area = data.get('vod_area', '')
            vod_actor = data.get('vod_actor', '')
            vod_director = data.get('vod_director', '')
            vod_content = data.get('vod_content', '')
            vod_remarks = data.get('vod_remarks', '')

            # 4. 解析多線路與集數列表
            # 泥視頻的線路儲存在 'pdatas' (包含所有來源，如多個不同的雲端播放器)
            # 各集數列表儲存在 'episodes' 中
            play_from_list = []
            play_url_list = []

            # 情況 A：網站返回了複數播放來源線路 (pdatas)
            if 'pdatas' in data and isinstance(data['pdatas'], list):
                # 遍歷所有可用的片源線路 (例如: 泥巴雲、海外雲)
                for source in data['pdatas']:
                    source_name = source.get('from', '泥視頻')
                    play_from_list.append(source_name)
                    
                    # 泥視頻新版 API 架構：如果集數在各線路內
                    ep_list = source.get('episodes', [])
                    if not ep_list and 'episodes' in data:
                        # Fallback: 如果線路內沒有，改拿外層公用的集數列表
                        ep_list = data['episodes']

                    urls = []
                    for ep in ep_list:
                        # 格式化集數名稱與最終識別碼
                        ep_name = ep.get('title', f"第{ep.get('id', '')}集")
                        ep_id = ep.get('id', 'ep1')
                        # 核心格式：將影片 ID 與集數 ID 用底線或特定符號傳遞給播放器，防止出錯
                        urls.append(f"{ep_name}${vod_id_str}#{ep_id}")
                    
                    play_url_list.append('#'.join(urls))

            # 情況 B：若無 pdatas，嘗試直接解析公用集數 (外層 episodes)
            elif 'episodes' in data and isinstance(data['episodes'], list):
                play_from_list.append('泥視頻')
                urls = []
                for ep in data['episodes']:
                    ep_name = ep.get('title', f"第{ep.get('id', '')}集")
                    ep_id = ep.get('id', 'ep1')
                    urls.append(f"{ep_name}${vod_id_str}#{ep_id}")
                play_url_list.append('#'.join(urls))

            # 情況 C：完全無集數資料時的防錯安全網
            if not play_from_list:
                play_from_list.append('泥視頻')
                play_url_list.append(f"正片${vod_id_str}#ep1")

            vod_play_from = '$$$'.join(play_from_list)
            vod_play_url = '$$$'.join(play_url_list)

            vod = {
                'vod_id': ids,
                'vod_name': vod_name,
                'vod_pic': vod_pic,
                'type_name': '',
                'vod_year': str(vod_year),
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
                'vod_play_url': f'播放${ids}#ep1'
            })
        return result

    def playerContent(self, flag, id, vipFlags):
        """
        當用戶真正點擊某一集時，動態發送 XHR 請求獲取真正的直鏈
        id: 格式為上方定義的 "影片ID#集數ID"，例如 "202658234#ep24"
        """
        result = {}
        try:
            # 1. 拆解我們在 detailContent 封裝的參數
            if '#' in id:
                vod_id_str, ep_id = id.split('#', 1)
            else:
                vod_id_str = id
                ep_id = 'ep1'
                
            # 2. 精準向後端請求該特定集數的最終播放 URL
            xhr_url = f"{self.home_url}/xhr_playinfo/{vod_id_str}-{ep_id}"
            
            xhr_res = requests.get(xhr_url, headers=self.headers, timeout=5)
            xhr_res.encoding = 'utf-8'
            data = xhr_res.json()
            
            play_url = ""
            # 3. 優先從回傳的 pdatas 列表匹配與選中線路對應的直鏈
            if 'pdatas' in data and isinstance(data['pdatas'], list):
                for source in data['pdatas']:
                    # 匹配當前 TVBox 選擇的線路標籤 (flag)
                    if source.get('from') == flag or len(data['pdatas']) == 1:
                        play_url = source.get('playurl', '')
                        break
                if not play_url:
                    play_url = data['pdatas'][0].get('playurl', '')

            # 4. 備用讀取方案
            if not play_url:
                play_url = data.get('url', '')

            result = {
                'url': play_url if play_url else f"{self.home_url}/detail/{vod_id_str}.html",
                'header': json.dumps(self.headers),
                'parse': 0 if play_url else 1, # 如果有成功取到 m3u8 則直接播放(0)，否則交付系統嗅探(1)
                'playUrl': ''
            }
        except Exception as e:
            print(f"Error in playerContent: {e}")
            result = {'url': id, 'parse': 1}
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

    def localProxy(self, param):
        return [200, "video/MP2T", {}, b""]

    def destroy(self):
        pass
