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
        import re
        result = {'list': []}
        
        if isinstance(array, list):
            ids = array[0] if len(array) > 0 else ''
        else:
            ids = str(array)
            
        if not ids:
            return {'list': []}
            
        detail_url = f"{self.home_url}{ids}" if not ids.startswith('http') else ids

        try:
            # 1. 抓取子站主頁面基礎資訊 (秒開，通常 0.2~0.3 秒完成)
            res = requests.get(detail_url, headers=self.headers, timeout=3)
            res.encoding = 'utf-8'
            root = etree.HTML(res.text)
            
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

            # 精準定位劇集清單
            episodes = root.xpath('//ul[@id="play_list_0"]/li[contains(@class, "select-item")]')
            if not episodes:
                all_possible_eps = root.xpath('//ul[contains(@class, "qy-episode-num")]/li[contains(@class, "select-item")]')
                episodes = []
                for ep in all_possible_eps:
                    txt = ep.xpath('.//a/text()')
                    txt_str = txt[0].strip() if txt else ""
                    if "线路" in txt_str or "線路" in txt_str or "中字" in txt_str:
                        continue
                    episodes.append(ep)
        except Exception as e:
            print(f"Error extracting html base info: {e}")
            result['list'].append({
                'vod_id': ids, 'vod_name': '未知影音', 'vod_pic': self.placeholder_pic,
                'vod_play_from': '線路LZ', 'vod_play_url': ''
            })
            return result

        try:
            # 從網址精準提取影片數位 ID
            vod_id_str = ids.split('/')[-1].replace('.html', '')

            # 2. 【徹底取代多執行緒】常規單次請求第一集 API，0.1秒極速撈取所有可用線路標籤
            detected_sources = []
            if episodes:
                try:
                    # 網頁預設是倒序，第一集通常在最底端，使用倒序後的第 0 個節點
                    first_ep = episodes[::-1][0]
                    first_ep_id = first_ep.get('slug', '').strip()
                    if not first_ep_id:
                        href_nodes = first_ep.xpath('.//a/@href')
                        href = href_nodes[0] if href_nodes else ''
                        first_ep_id = href.replace('#', '') if '#' in href else 'ep1'
                    
                    detect_url = f"{self.home_url}/d0vod/{vod_id_str}-{first_ep_id}"
                    detect_res = requests.get(detect_url, headers=self.headers, timeout=1.5)
                    detect_data = detect_res.json()
                    
                    if 'aps' in detect_data and isinstance(detect_data['aps'], list):
                        for cc in detect_data['aps']:
                            raw_ss = cc.get('ss', '1')
                            src_tag = raw_ss[:2].upper()
                            source_name = f"線路{src_tag}"
                            if source_name not in detected_sources:
                                detected_sources.append(source_name)
                except Exception:
                    pass

            # 保底機制
            if not detected_sources:
                detected_sources = ['線路LZ', '線路FF', '線路MD']

            # 🌟 核心排序機制：精準置頂包含 LZ、FF、MD 的子站線路標籤
            def get_sort_weight(x):
                if 'LZ' in x.upper(): return 0
                if 'FF' in x.upper(): return 1
                if 'MD' in x.upper(): return 2
                return 3
            
            detected_sources = sorted(detected_sources, key=get_sort_weight)

            # 3. 封裝延遲載入 (Lazy Load) 選集網址
            ep_urls = []
            if not episodes:
                ep_urls.append(f"正片$LAZY_{vod_id_str}-index")
            else:
                for idx, ep in enumerate(episodes[::-1]):
                    a_nodes = ep.xpath('.//a/text()')
                    ep_name = a_nodes[0].strip() if a_nodes else f"第{idx+1}集"
                    
                    ep_id = ep.get('slug', '').strip()
                    if not ep_id:
                        href_nodes = ep.xpath('.//a/@href')
                        href = href_nodes[0] if href_nodes else ''
                        ep_id = href.replace('#', '') if '#' in href else f'ep{idx+1}'
                    
                    ep_urls.append(f"{ep_name}$LAZY_{vod_id_str}-{ep_id}")
            
            single_play_url = '#'.join(ep_urls)
            
            # 多線路結構複製宣告，完美對齊
            vod_play_from = '$$$'.join(detected_sources)
            vod_play_url = '$$$'.join([single_play_url for _ in detected_sources])

            vod = {
                'vod_id': ids, 'vod_name': vod_name, 'vod_pic': vod_pic, 'type_name': '',
                'vod_year': vod_year, 'vod_area': vod_area, 'vod_remarks': vod_remarks,
                'vod_actor': vod_actor, 'vod_director': vod_director, 'vod_content': vod_content,
                'vod_play_from': vod_play_from, 'vod_play_url': vod_play_url
            }
            result['list'].append(vod)
        except Exception as e:
            print(f"Error in lazy load multi-source detail process: {e}")
            result['list'].append({
                'vod_id': ids, 'vod_name': vod_name if vod_name else '未知影音', 'vod_pic': vod_pic if vod_pic else self.placeholder_pic,
                'vod_year': vod_year, 'vod_area': vod_area, 'vod_content': vod_content,
                'vod_play_from': '線路LZ', 'vod_play_url': ''
            })
        return result

    def playerContent(self, flag, id, vipFlags):
        result = {'url': '', 'parse': 0}
        try:
            play_url = id.split('$')[1] if '$' in id else id
            
            # 攔截動態延遲解析標籤
            if play_url.startswith('LAZY_'):
                lazy_params = play_url.replace('LAZY_', '')
                d0_url = f"{self.home_url}/d0vod/{lazy_params}"
                
                # 用戶真正點擊集數的瞬間，極速請求單集 XHR JSON
                xhr_res = requests.get(d0_url, headers=self.headers, timeout=2)
                xhr_res.encoding = 'utf-8'
                data = xhr_res.json()
                
                actual_pd = ""
                if 'aps' in data and isinstance(data['aps'], list):
                    # 1. 精確比對當前點選切換的 flag 線路名稱 (例如：線路LZ、線路FF)
                    for cc in data['aps']:
                        raw_ss = cc.get('ss', '1')
                        src_tag = raw_ss[:2].upper()
                        source_name = f"線路{src_tag}"
                        
                        if source_name == flag and cc.get('pd', ''):
                            actual_pd = cc.get('pd', '')
                            break
                    
                    # 2. 自動保底機制：若此片源名稱比對失敗，抓取該集第一個有播放網址的線路
                    if not actual_pd:
                        for cc in data['aps']:
                            if cc.get('pd', ''):
                                actual_pd = cc.get('pd', '')
                                break
                                
                play_url = actual_pd if actual_pd else self.home_url

            result = {
                'url': play_url,
                'header': json.dumps(self.headers),
                'parse': 0,
                'playUrl': ''
            }
        except Exception as e:
            print(f"Error in playerContent dynamic loading: {e}")
            result = {'url': '', 'parse': 0}
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
