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
        self.home_url = 'https://www.nivod.cc'
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
            'class': _class,
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
        ids = array
        detail_url = f"{self.home_url}{ids}"
        try:
            # 1. 請求詳情網頁 HTML
            res = requests.get(detail_url, headers=self.headers)
            res.encoding = 'utf-8'
            root = etree.HTML(res.text)
            vod_name = root.xpath('//div[@class="right-title"]/text()').strip() if root.xpath('//div[@class="right-title"]') else "未知"
            vod_year = root.xpath('//div[@id="postYear"]/text()').strip() if root.xpath('//div[@id="postYear"]') else ""
            vod_area = root.xpath('//div[@id="region"]/text()').strip() if root.xpath('//div[@id="region"]') else ""
            vod_content = root.xpath('//div[@id="show-desc"]/text()').strip() if root.xpath('//div[@id="show-desc"]') else ""
            vod_remarks = root.xpath('//div[@id="updateTxt"]/text()').strip() if root.xpath('//div[@id="updateTxt"]') else ""
            vod_actor = root.xpath('//div[@id="actors"]/text()').strip() if root.xpath('//div[@id="actors"]') else ""
            vod_director = root.xpath('//div[@id="director"]/text()').strip() if root.xpath('//div[@id="director"]') else ""
            vod_pic = root.xpath('//img[@class="left-img"]/@src') if root.xpath('//img[@class="left-img"]') else self.placeholder_pic
            if vod_pic.startswith('/'):
                vod_pic = self.home_url + vod_pic
            
            episodes = root.xpath('//div[@id="list-jj"]/a')
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
                
                # --- 【核心修正】精確提取影片純數字 ID，修正原碼 list 拼接導致超時 18 秒的 Bug ---
                vod_id_match = re.search(r'\d+', str(ids))
                vod_pure_id = vod_id_match.group(0) if vod_id_match else "0"
                
                # --- 【極致加速】僅透過第一集發送 1 次正確的 XHR，動態把網站所有的真實片源通通撈出來 ---
                first_ep = episodes[-1] # 取得第一集節點
                first_ep_url = self.home_url + first_ep.get('href', '')
                first_ep_id = first_ep_url.split('/')[-1]
                
                # 拼接成 100% 正確的探測網址，伺服器會瞬間秒回 JSON
                sample_xhr = f"{self.home_url}/xhr_playinfo/{vod_pure_id}-{first_ep_id}"
                try:
                    xhr_res = requests.get(sample_xhr, headers=self.headers, timeout=5)
                    xhr_res.encoding = 'utf-8'
                    data = xhr_res.json()
                    if 'pdatas' in data and data['pdatas']:
                        for source in data['pdatas']:
                            source_name = source['from']
                            play_from.add(source_name)
                            if source_name not in play_urls:
                                play_urls[source_name] = []
                except Exception as e:
                    print(f"動態獲取片源失敗: {e}")
                
                # 保底機制：若 XHR 意外失敗，填入原本的泥視頻作防禦
                if not play_from:
                    play_from.add('泥視頻')
                    play_urls['泥視頻'] = []

                # --- 2. 恢復您原碼的倒序遍歷邏輯，在本地快速複製分發，不再發送網路請求 ---
                for ep in episodes[::-1]:
                    ep_name = ep.xpath('.//div[@class="item"]/text()').strip() if ep.xpath('.//div[@class="item"]') else "未知"
                    ep_url = self.home_url + ep.get('href', '')
                    ep_id = ep_url.split('/')[-1]
                    
                    # 動態適配撈到的所有片源（7-8個或更多都會完美呈現）
                    for source_name in play_from:
                        # 將播放時需要的參數包裝進 URL 欄位中，交給 playerContent 點擊時解析
                        play_urls[source_name].append(f"{ep_name}${vod_pure_id}-{ep_id}_{source_name}")
                
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
            play_id = id.split('$') if '$' in id else id
            
            # 解析參數：vod_id-ep_id_sourceName
            if "_" in play_id:
                target_ids, target_source = play_id.split('_', 1)
            else:
                target_ids = play_id
                target_source = None
                
            # 使用者真正點擊某個片源的某一集時，才發送這 1 次正確的請求
            xhr_url = f"{self.home_url}/xhr_playinfo/{target_ids}"
            
            play_headers = self.headers.copy()
            play_headers["Referer"] = f"{self.home_url}/vodplay/{target_ids}.html"
            
            res = requests.get(xhr_url, headers=play_headers, timeout=6)
            res.encoding = 'utf-8'
            data = res.json()
            
            final_url = ""
            if 'pdatas' in data and data['pdatas']:
                pdatas = data['pdatas']
                
                if isinstance(pdatas, list):
                    # 精準匹配使用者在畫面上切換的真實片源名稱
                    for source in pdatas:
                        if target_source and source.get('from') == target_source:
                            final_url = source.get('playurl', '')
                            break
                    if not final_url and len(pdatas) > 0:
                        final_url = pdatas.get('playurl', '')
                elif isinstance(pdatas, dict):
                    final_url = pdatas.get('playurl', '')

            if final_url:
                is_video = final_url.endswith('.m3u8') or final_url.endswith('.mp4') or 'playlist' in final_url
                result = {
                    'url': final_url,
                    'header': json.dumps(self.headers),
                    'parse': 0 if is_video else 1,
                    'playUrl': ''
                }
            else:
                result = {'url': f"{self.home_url}/vodplay/{target_ids}.html", 'parse': 1}
        except Exception as e:
            print(f"Error in playerContent: {e}")
            result = {'url': '', 'parse': 0}
        return result

    def localProxy(self, param):
        return [200, "video/MP2T", {}, b""]

    def destroy(self):
        pass
