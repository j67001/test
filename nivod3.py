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
        result = {'list':}
        try:
            res = requests.get(self.home_url, headers=self.headers)
            res.encoding = 'utf-8'
            root = etree.HTML(res.text)
            data_list = root.xpath('//div[contains(@class, "qy-mod-link-wrap")]/a')
            for i in data_list:
                name_nodes = i.xpath('.//picture[@class="video-item-preview-img"]/img/@alt')
                vod_name = name_nodes.strip() if name_nodes else None
                if not vod_name:
                    vod_name = i.xpath('./@title')
                    vod_name = vod_name.strip() if vod_name else "未知"
                vod_id = i.get('href', '')
                pic_nodes = i.xpath('.//picture[@class="video-item-preview-img"]/img/@src')
                vod_pic = pic_nodes if pic_nodes else self.placeholder_pic
                if vod_pic.startswith('/'):
                    vod_pic = self.home_url + vod_pic
                remark_nodes = i.xpath('.//span[contains(@class, "qy-mod-label")]/text()')
                vod_remarks = remark_nodes.strip() if remark_nodes else ''
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
        result = {'list':}
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
                vod_id = href_nodes if href_nodes else ''
                name_nodes = i.xpath('.//a/@title')
                vod_name = name_nodes.strip() if name_nodes else "未知"
                pic_nodes = i.xpath('.//div[@class="qy-mod-cover"]/@style')
                vod_pic = None
                if pic_nodes:
                    style = pic_nodes
                    match = re.search(r'url\((.*?)\)', style)
                    vod_pic = match.group(1).strip() if match else None
                if not vod_pic:
                    vod_pic = self.placeholder_pic
                if vod_pic.startswith('/'):
                    vod_pic = self.home_url + vod_pic
                remark_nodes = i.xpath('.//span[@class="qy-mod-label"]/text()')
                vod_remarks = remark_nodes.strip() if remark_nodes else ''
                
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
        from concurrent.futures import ThreadPoolExecutor
        import re

        result = {'list':}
        ids = array if isinstance(array, list) and array else str(array)
        detail_url = f"{self.home_url}{ids}"
        
        # 1. 核心隔離機制：優先確保網頁基礎資料絕對能穩定抓到，免受多線程異常干擾
        try:
            # 詳情頁基本請求超時保護下調回最安全的 3.5 秒
            res = requests.get(detail_url, headers=self.headers, timeout=3.5)
            res.encoding = 'utf-8'
            root = etree.HTML(res.text)
            
            name_nodes = root.xpath('//div[@class="right-title"]/text()')
            vod_name = name_nodes.strip() if name_nodes else "未知"
            
            year_nodes = root.xpath('//div[@id="postYear"]/text()')
            vod_year = year_nodes.strip() if year_nodes else ""
            
            area_nodes = root.xpath('//div[@id="region"]/text()')
            vod_area = area_nodes.strip() if area_nodes else ""
            
            content_nodes = root.xpath('//div[@id="show-desc"]/text()')
            vod_content = content_nodes.strip() if content_nodes else ""
            
            remark_nodes = root.xpath('//div[@id="updateTxt"]/text()')
            vod_remarks = remark_nodes.strip() if remark_nodes else ""
            
            actor_nodes = root.xpath('//div[@id="actors"]/text()')
            vod_actor = actor_nodes.strip() if actor_nodes else ""
            
            director_nodes = root.xpath('//div[@id="director"]/text()')
            vod_director = director_nodes.strip() if director_nodes else ""
            
            pic_nodes = root.xpath('//img[@class="left-img"]/@src')
            vod_pic = pic_nodes if pic_nodes else self.placeholder_pic
            if vod_pic.startswith('/'):
                vod_pic = self.home_url + vod_pic
                
            episodes = root.xpath('//div[@id="list-jj"]/a')
        except Exception as e:
            print(f"Error extracting html base info: {e}")
            result['list'].append({
                'vod_id': ids,
                'vod_name': '未知',
                'vod_pic': self.placeholder_pic,
                'vod_play_from': '泥視頻',
                'vod_play_url': ''
            })
            return result

        # 2. 獨立且受保護的劇集與高速多線程收割模組（拒絕使用非線程安全的 Session）
        try:
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
                
                def fetch_ep_info(ep):
                    try:
                        ep_name_nodes = ep.xpath('.//div[@class="item"]/text()')
                        ep_name = ep_name_nodes.strip() if ep_name_nodes else "未知"
                        ep_url = self.home_url + ep.get('href', '')
                        
                        vod_id_str = ""
                        for part in str(ids).split('/'):
                            if part.isdigit():
                                vod_id_str = part
                                break
                        if not vod_id_str:
                            reg_match = re.search(r'(\d+)', str(ids))
                            vod_id_str = reg_match.group(1) if reg_match else "未知"
                            
                        ep_id = ep_url.split('/')[-1]
                        xhr_url = f"{self.home_url}/xhr_playinfo/{vod_id_str}-{ep_id}"
                        
                        # 【速度優化關鍵】：獨立線程超時精確下調至 1.2 秒且不進行重試，卡住立刻切斷，大幅提升電視盒加載體驗
                        xhr_res = requests.get(xhr_url, headers=self.headers, timeout=1.2)
                        xhr_res.encoding = 'utf-8'
                        data = xhr_res.json()
                        return ep_name, data
                    except Exception:
                        return None, None

                with ThreadPoolExecutor(max_workers=15) as executor:
                    tasks = list(executor.map(fetch_ep_info, episodes[::-1]))
                
                for ep_name, data in tasks:
                    if not ep_name or not data:
                        continue
                    if 'pdatas' in data and data['pdatas']:
                        for source in data['pdatas']:
                            source_name = source.get('from', '').strip()
                            if not source_name:
                                continue

                            if 'zy' in source_name.lower():
                                idx = source_name.lower().find('zy')
                                if idx > 0:
                                    source_name = source_name[:idx].upper() + '云'

                            play_from.add(source_name)
                            if source_name not in play_urls:
                                play_urls[source_name] =
                            play_urls[source_name].append(f"{ep_name}${source.get('playurl', '')}")
                
                sort_order = ['LZ云', 'FF云', 'MD云']
                sorted_play_from = sorted(list(play_from), key=lambda x: sort_order.index(x) if x in sort_order else len(sort_order))

                vod_play_from = '$$$'.join(sorted_play_from)
                vod_play_url = '$$$'.join(['#'.join(play_urls[source]) for source in sorted_play_from if play_urls.get(source)])
                
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
            print(f"Error in detail multithreading process: {e}")
            result['list'].append({
                'vod_id': ids,
                'vod_name': vod_name if vod_name else '未知',
                'vod_pic': vod_pic if vod_pic else self.placeholder_pic,
                'vod_year': vod_year,
                'vod_area': vod_area,
                'vod_content': vod_content,
                'vod_play_from': '泥視頻',
                'vod_play_url': ''
            })
        return result

    def searchContent(self, key, quick, pg='1'):
        result = {'list':}
        try:
            search_url = f"{self.home_url}/search_x.html?keyword={key}&page={pg}"
            res = requests.get(search_url, headers=self.headers)
            res.encoding = 'utf-8'
            root = etree.HTML(res.text)
            data_list = root.xpath('//a[contains(@class, "qy-mod-link")]')
            for item in data_list:
                name_nodes = item.xpath('.//picture[@class="video-item-preview-img"]/img/@alt')
                vod_name = name_nodes.strip() if name_nodes else None
                if not vod_name:
                    name_title = item.xpath('./@title')
                    vod_name = name_title.strip() if name_title else "未知"
                vod_id = item.get('href', '')
                pic_nodes = item.xpath('.//picture[@class="video-item-preview-img"]/img/@src')
                vod_pic = pic_nodes if pic_nodes else self.placeholder_pic
                if vod_pic.startswith('/'):
                    vod_pic = self.home_url + vod_pic
                vod_remarks = ''
                result['list'].append({
                    'vod_id': vod_id,
                    'vod_name': vod_name, # 【修正】：還原為標準抓取到的片名，不再強制塞入未知
                    'vod_pic': vod_pic,
                    'vod_remarks': vod_remarks
                })
        except Exception as e:
            print(f"Error in searchContent: {e}")
        return result

    def playerContent(self, flag, id, vipFlags):
        result = {}
        try:
            play_url = id.split('$') if '$' in id else id
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
