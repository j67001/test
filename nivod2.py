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
        
        if isinstance(array, list):
            ids = array[0] if len(array) > 0 else ''
        else:
            ids = str(array)
            
        if not ids:
            return {'list': []}
            
        detail_url = f"{self.home_url}{ids}" if not ids.startswith('http') else ids

        try:
            res = requests.get(detail_url, headers=self.headers, timeout=5)
            res.encoding = 'utf-8'
            root = etree.HTML(res.text)
            
            # --- 1. 您測試完全正確的簡介與中繼資料解析區塊 ---
            vod_year = "未知"
            vod_area = "其他"
            
            tags = [t.strip() for t in root.xpath('//div[@class="qy-player-tag"]/span[@class="tag-item"]/text()')]
            for tag in tags:
                if tag.isdigit() and len(tag) == 4:
                    vod_year = tag
                elif tag in ["韩国", "大陆", "香港", "台湾", "美国", "日本", "英国", "智利", "巴西", "意大利", "瑞典", "印度", "爱尔兰", "澳大利亚", "泰国", "加拿大", "新加坡", "马来西亚", "其它"]: 
                    vod_area = tag
            
            name_nodes = root.xpath('//h1[@class="player-title"]/text()')
            vod_name = name_nodes[0].strip() if name_nodes else "未知"
            
            remarks_nodes = root.xpath('//div[@id="updateTxt"]/text()')
            vod_remarks = remarks_nodes[0].strip() if remarks_nodes else ""
            
            director_nodes = root.xpath('//li[contains(em/text(), "导演")]//span[@class="content-paragraph"]/text()')
            vod_director = director_nodes[0].strip() if director_nodes else ""
            
            actor_nodes = root.xpath('//li[contains(em/text(), "主演")]//span[@class="content-paragraph"]/text()')
            vod_actor = actor_nodes[0].strip() if actor_nodes else ""
            
            content_nodes = root.xpath('//li[contains(em/text(), "简介")]//span[@class="content-paragraph"]/text()')
            vod_content = content_nodes[0].strip() if content_nodes else ""
            
            pic_nodes = root.xpath('//img[@class="show-small"]/@src')
            vod_pic = pic_nodes[0] if pic_nodes else self.placeholder_pic
            if vod_pic.startswith('/'):
                vod_pic = self.home_url + vod_pic

            # --- 2. 關鍵修正：精準限制只定位 play_list 劇集，徹底排除隱藏線路 ---
            # 修改為 //ul[@id="play_list_0"]/li，這樣絕對不會抓到 route_list_0 裡的線路1-9
            episodes = root.xpath('//ul[@id="play_list_0"]/li[contains(@class, "select-item")]')
            
            # 備用安全網：萬一 id 叫其他名字，則利用文字特徵強制過濾掉含有「线路、線路、中字」的干擾節點
            if not episodes:
                all_possible_eps = root.xpath('//ul[contains(@class, "qy-episode-num")]/li[contains(@class, "select-item")]')
                episodes = []
                for ep in all_possible_eps:
                    txt = ep.xpath('.//a/text()')
                    txt_str = txt[0].strip() if txt else ""
                    # 如果文字裡面包含線路或中字，直接丟棄，只保留真正的集數
                    if "线路" in txt_str or "線路" in txt_str or "中字" in txt_str:
                        continue
                    episodes.append(ep)

            if not episodes:
                # 終極安全兜底：萬一真的空無一物，封裝單集
                vod = {
                    'vod_id': ids, 'vod_name': vod_name, 'vod_pic': vod_pic, 'type_name': '',
                    'vod_year': vod_year, 'vod_area': vod_area, 'vod_remarks': vod_remarks,
                    'vod_actor': vod_actor, 'vod_director': vod_director, 'vod_content': vod_content,
                    'vod_play_from': '泥視頻', 'vod_play_url': '正片$https://nbyy.cc'
                }
            else:
                play_from_order = []  # 存放解鎖出的線路標籤
                play_urls = {}       # 存放線路對應的純集數網址
                
                # 從網址精準提取影片純數位 ID (例如: 332776237)
                vod_id_str = ids.split('/')[-1].replace('.html', '')

                # --- 3. 您的單集解析多執行緒函數 ---
                def fetch_ep_info(item):
                    idx, ep = item
                    try:
                        a_nodes = ep.xpath('.//a/text()')
                        ep_name = a_nodes[0].strip() if a_nodes else f"第{idx+1}集"
                        
                        ep_id = ep.get('slug', '').strip()
                        if not ep_id:
                            href_nodes = ep.xpath('.//a/@href')
                            href = href_nodes[0] if href_nodes else ''
                            ep_id = href.replace('#', '') if '#' in href else f'ep{idx+1}'
                        
                        # 請求動態後端接口
                        d0_url = f"{self.home_url}/d0vod/{vod_id_str}-{ep_id}"
                        xhr_res = requests.get(d0_url, headers=self.headers, timeout=3)
                        data = xhr_res.json()
                        
                        return ep_name, data
                    except Exception:
                        return None, None

                # --- 4. 多執行緒併發 (網頁預設是倒序，用 [::-1] 把它轉回第01集在最前) ---
                with ThreadPoolExecutor(max_workers=15) as executor:
                    tasks = list(executor.map(fetch_ep_info, enumerate(episodes[::-1])))
                
                # --- 5. 數據收割與重新清洗 ---
                for ep_name, data in tasks:
                    if not ep_name or not data:
                        continue
                    
                    if 'aps' in data and isinstance(data['aps'], list):
                        for cc in data['aps']:
                            raw_ss = cc.get('ss', '1')
                            src_tag = raw_ss[:2].upper()
                            source_name = f"線路{src_tag}"
                            
                            actual_pd = cc.get('pd', '')
                            if not actual_pd:
                                continue
                                
                            if source_name not in play_urls:
                                play_urls[source_name] = []
                                play_from_order.append(source_name)
                            
                            # 正確打包：純集數名稱 (例如 第01集)$真實加密播放串
                            play_urls[source_name].append(f"{ep_name}${actual_pd}")

                # --- 6. 依據 TVBox 標準格式輸出 ---
                if play_from_order:
                    vod_play_from = '$$$'.join(play_from_order)
                    vod_play_url = '$$$'.join(['#'.join(play_urls[source]) for source in play_from_order])
                else:
                    # 備用機制
                    vod_play_from = '泥視頻'
                    vod_play_url = '#'.join([f"{ep.xpath('.//a/text()')[0].strip()}${self.home_url}{ids}#{ep.get('slug','')}" for ep in episodes[::-1]])

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
                'vod_id': ids, 'vod_name': '未知影音', 'vod_pic': self.placeholder_pic,
                'vod_play_from': '泥視頻', 'vod_play_url': f'正片${ids}'
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
