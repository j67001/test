import requests
import json
import re
from urllib.parse import quote

class TengYunGuaWu:
    def __init__(self):
        self.title = '腾云驾雾[官]'
        self.host = 'https://v.qq.com'
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
        self.class_name = "电影&电视剧&综艺&动漫&少儿&纪录片"
        self.class_url = "movie&tv&variety&cartoon&child&doco"

    def get_home_url(self, category='cartoon'):
        return f"{self.host}/x/bu/pagesheet/list?_all=1&append=1&channel={category}&listpage=1&offset=0&pagesize=21&iarea=-1&sort=18"

    def category_page(self, tid, pg=1, filter_data=None):
        """
        Corresponds to the 'url' and 'filter_url' logic in JS
        """
        offset = (int(pg) - 1) * 21
        # Simplified filter handling
        sort = filter_data.get('sort', '75') if filter_data else '75'
        area = filter_data.get('area', '-1') if filter_data else '-1'
        
        url = f"{self.host}/x/bu/pagesheet/list?_all=1&append=1&channel={tid}&listpage=1&offset={offset}&pagesize=21&iarea={area}&sort={sort}"
        return url

    def detail_page(self, cid):
        """
        Corresponds to 'detailUrl'
        """
        url = f"https://node.video.qq.com/x/api/float_vinfo2?cid={cid}"
        res = requests.get(url, headers=self.headers)
        return res.json()

    def search(self, wd):
        """
        Corresponds to 'searchUrl'
        """
        encoded_wd = quote(wd)
        url = f"{self.host}/x/search/?q={encoded_wd}&stag=fypage"
        # In a real scenario, you would parse the HTML here using BeautifulSoup
        return url

    def lazy_parse(self, video_url):
        """
        Replicates the 'lazy' JS logic using the external API
        """
        api_url = f"https://cache.json.icu/home/api?type=ys&uid=292796&key=fnoryABDEFJNPQV269&url={video_url}"
        try:
            res = requests.get(api_url, timeout=5)
            data = res.json()
            return data.get('url', video_url)
        except Exception as e:
            print(f"Error in lazy parse: {e}")
            return video_url
