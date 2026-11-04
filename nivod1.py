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
                {'key': 'year', 'name': '年份', 'value': [{'n': v, 'v': v} for v in ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "lt__2015"]]}
            ],
            'tv': [
                {'key': 'class', 'name': '剧情', 'value': [{'n': v.split('$')[0], 'v': v.split('$')[1]} for v in "剧情$ju-qing#动作$dong-zuo#历史$li-shi#历险$mao-xian#古装$gu-zhuang#同性$tong-xing#喜剧$xi-ju#奇幻$qi-huan#家庭$jia-ting#悬疑$xuan-yi#惊悚$jing-song#战争$zhan-zheng#武侠$wu-xia#爱情$ai-qing#科幻$ke-huan#罪案$zui-an".split('#')]},
                {'key': 'area', 'name': '地区', 'value': [{'n': v.split('$')[0], 'v': v.split('$')[1]} for v in "大陆$cn#香港$hk#台湾$tw#日本$jp#韩国$kr#欧美$west#泰国$th#新马$sg-my".split('#')]},
                {'key': 'year', 'name': '年份', 'value': [{'n': v, 'v': v} for v in ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "lt__2015"]]}
            ],
            'anime': [
                {'key': 'class', 'name': '剧情', 'value': [{'n': v.split('$')[0], 'v': v.split('$')[1]} for v in "冒险$mao-xian#动画电影$movie#推理$tui-li#校园$xiao-yuan#治愈$zhi-yu#泡面$pao-mian#热血$re-xue#科幻$ke-huan#魔幻$mo-huan".split('#')]},
                {'key': 'area', 'name': '地区', 'value': [{'n': v.split('$')[0], 'v': v.split('$')[1]} for v in "大陆$cn#日本$jp#欧美$west".split('#')]},
                {'key': 'year', 'name': '年份', 'value': [{'n': v, 'v': v} for v in ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "lt__2015"]]}
            ],
            'show': [
                {'key': 'class', 'name': '剧情', 'value': [{'n': v.split('$')[0], 'v': v.split('$')[1]} for v in "搞笑$gao-xiao#音乐$yin-yue#真人秀$zhen-ren-xiu#脱口秀$tuo-kou-xiu".split('#')]},
                {'key': 'area', 'name': '地区', 'value': [{'n': v.split('$')[0], 'v': v.split('$')[1]} for v in "大陆$cn#韩国$kr#欧美$west#其它$other".split('#')]},
                {'key': 'year', 'name': '年份', 'value': [{'n': v, 'v': v} for v in ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "lt__2015"]]}
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
        
        if int(pg) > 5:
            result['page'] = int(pg)
            result['pagecount'] = 5
            result['limit'] = 0
            result['total'] = 240
            return result
        
        try:
            res = requests.get(url, headers=self.headers)
            res.encoding = 'utf-8'
            root = etree.HTML(res.text)
            data_list = root.xpath('//li[contains(@class, "qy-mod-li")]')
            
            for i in data_list:
                href_nodes = i.xpath('.//a/@href')
                vod_id = href_nodes[0] if href_nodes else ''
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
            
            current_items = len(data_list)
            total_pages = 5
            if current_items < 48:
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
        ids = array[0] if isinstance(array, list) and array else str(array)
        detail_url = f"{self.home_url}{ids}"
        
        try:
            # 1. 抓取主頁面基礎資訊 (秒開，通常 0.2~0.3 秒)
            res = requests.get(detail_url, headers=self.headers, timeout=3)
            res.encoding = 'utf-8'
            root = etree.HTML(res.text)
            
            name_nodes = root.xpath('//div[@class="right-title"]/text()')
            vod_name = name_nodes[0].strip() if name_nodes else "未知"
            
            year_nodes = root.xpath('//div[@id="postYear"]/text()')
            vod_year = year_nodes[0].strip() if year_nodes else ""
            
            area_nodes = root.xpath('//div[@id="region"]/text()')
            vod_area = area_nodes[0].strip() if area_nodes else ""
            
            content_nodes = root.xpath('//div[@id="show-desc"]/text()')
            vod_content = content_nodes[0].strip() if content_nodes else ""
            
            remark_nodes = root.xpath('//div[@id="updateTxt"]/text()')
            vod_remarks = remark_nodes[0].strip() if remark_nodes else ""
            
            actor_nodes = root.xpath('//div[@id="actors"]/text()')
            vod_actor = actor_nodes[0].strip() if actor_nodes else ""
            
            director_nodes = root.xpath('//div[@id="director"]/text()')
            vod_director = director_nodes[0].strip() if director_nodes else ""
            
            pic_nodes = root.xpath('//img[@class="left-img"]/@src')
            vod_pic = pic_nodes[0] if pic_nodes else self.placeholder_pic
            if vod_pic.startswith('/'):
                vod_pic = self.home_url + vod_pic
                
            episodes = root.xpath('//div[@id="list-jj"]/a')
        except Exception as e:
            print(f"Error extracting html base info: {e}")
            result['list'].append({
                'vod_id': ids, 'vod_name': '未知', 'vod_pic': self.placeholder_pic,
                'vod_play_from': 'LZ云', 'vod_play_url': ''
            })
            return result

        try:
            # 提取劇集主 ID
            vod_id_str = ""
            for part in str(ids).split('/'):
                if part.isdigit():
                    vod_id_str = part
                    break
            if not vod_id_str:
                reg_match = re.search(r'(\d+)', str(ids))
                vod_id_str = reg_match.group(1) if reg_match else "未知"

            # 2. 動態偵測真實線路線索
            detected_sources = []
            if episodes:
                try:
                    first_ep = episodes[::-1][0]
                    first_ep_url = first_ep.get('href', '')
                    first_ep_id = first_ep_url.split('/')[-1] if '/' in first_ep_url else first_ep_url
                    
                    detect_url = f"{self.home_url}/xhr_playinfo/{vod_id_str}-{first_ep_id}"
                    detect_res = requests.get(detect_url, headers=self.headers, timeout=1.5)
                    detect_data = detect_res.json()
                    
                    if 'pdatas' in detect_data and detect_data['pdatas']:
                        for source in detect_data['pdatas']:
                            source_name = source.get('from', '').strip()
                            if not source_name:
                                continue
                            
                            # 統一標準化名稱命名 (如 wjzy -> WJ云)
                            if 'zy' in source_name.lower():
                                idx = source_name.lower().find('zy')
                                if idx > 0:
                                    source_name = source_name[:idx].upper() + '云'
                            if source_name not in detected_sources:
                                detected_sources.append(source_name)
                except Exception:
                    pass

            # 保底機制
            if not detected_sources:
                detected_sources = ['LZ云', 'FF云', 'MD云']

            # 🌟 核心排序機制：設定前三名優先權重 (LZ云->0, FF云->1, MD云->2, 其餘->3)
            sort_order = {'LZ云': 0, 'FF云': 1, 'MD云': 2}
            detected_sources = sorted(detected_sources, key=lambda x: sort_order.get(x, 3))

            # 3. 依據排序後的線路，生成對齊的延遲播放網址字串
            ep_urls = []
            if not episodes:
                ep_urls.append(f"第1集$LAZY_{vod_id_str}-index")
            else:
                for ep in episodes[::-1]:
                    ep_name_nodes = ep.xpath('.//div[@class="item"]/text()')
                    ep_name = ep_name_nodes[0].strip() if ep_name_nodes else "未知"
                    ep_url = ep.get('href', '')
                    ep_id = ep_url.split('/')[-1] if '/' in ep_url else ep_url
                    ep_urls.append(f"{ep_name}$LAZY_{vod_id_str}-{ep_id}")
            
            single_play_url = '#'.join(ep_urls)
            
            # 多線路完美對齊宣告
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
            print(f"Error in dynamic lazy-load detail process: {e}")
            result['list'].append({
                'vod_id': ids, 'vod_name': vod_name if vod_name else '未知', 'vod_pic': vod_pic if vod_pic else self.placeholder_pic,
                'vod_year': vod_year, 'vod_area': vod_area, 'vod_content': vod_content,
                'vod_play_from': 'LZ云', 'vod_play_url': ''
            })
        return result

    def playerContent(self, flag, id, vipFlags):
        result = {'url': '', 'parse': 0}
        try:
            play_url = id.split('$')[1] if '$' in id else id
            
            if play_url.startswith('LAZY_'):
                lazy_params = play_url.replace('LAZY_', '')
                xhr_url = f"{self.home_url}/xhr_playinfo/{lazy_params}"
                
                # 用戶點擊集數時，精確獲取當前點選的 flag 線路
                xhr_res = requests.get(xhr_url, headers=self.headers, timeout=2)
                xhr_res.encoding = 'utf-8'
                data = xhr_res.json()
                
                real_url = ""
                if 'pdatas' in data and data['pdatas']:
                    # 1. 精確過濾電視盒當前所切換點選的 flag 線路名稱 (如：LZ云、MD云、IK云)
                    for source in data['pdatas']:
                        source_name = source.get('from', '').strip()
                        if 'zy' in source_name.lower():
                            idx = source_name.lower().find('zy')
                            if idx > 0:
                                source_name = source_name[:idx].upper() + '云'
                                
                        if source_name == flag and source.get('playurl', ''):
                            real_url = source.get('playurl', '')
                            break
                            
                    # 2. 自動保底機制：若此片源名稱比對失敗，抓取該集第一個有播放網址的線路
                    if not real_url:
                        for source in data['pdatas']:
                            if source.get('playurl', ''):
                                real_url = source.get('playurl', '')
                                break
                                
                play_url = real_url if real_url else self.home_url

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
                    name_title = item.xpath('./@title')
                    vod_name = name_title[0].strip() if name_title else "未知"
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
