import requests
import json
import re
from urllib.parse import quote

class TengYunGuaWu:
    def __init__(self):
        self.title = '腾云驾雾[官]'
        # 原始码中的 %71%71 是 qq 的 URL 编码
        self.host = 'https://v.qq.com'
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
        # 分类映射
        self.class_dict = {
            "电影": "movie",
            "电视剧": "tv",
            "综艺": "variety",
            "动漫": "cartoon",
            "少儿": "child",
            "纪录片": "doco"
        }

    def get_category_url(self, tid, pg=1, filters=None):
        """
        对应原规则中的 url 和 filter_url 逻辑
        """
        offset = (int(pg) - 1) * 21
        # 提取筛选参数，若无则使用默认值
        sort = filters.get('sort', '75') if filters else '75'
        area = filters.get('area', '-1') if filters else '-1'
        year = filters.get('year', '-1') if filters else '-1'
        
        # 构造腾讯视频的分类 API 链接
        url = f"{self.host}/x/bu/pagesheet/list?_all=1&append=1&channel={tid}&listpage=1&offset={offset}&pagesize=21&iarea={area}&sort={sort}&year={year}"
        return url

    def get_detail(self, cid):
        """
        对应 detailUrl，获取视频详情及剧集 ID
        """
        url = f"https://node.video.qq.com/x/api/float_vinfo2?cid={cid}"
        try:
            res = requests.get(url, headers=self.headers, timeout=5)
            return res.json()
        except Exception as e:
            return {"error": str(e)}

    def search(self, keyword):
        """
        对应 searchUrl
        """
        encoded_wd = quote(keyword)
        url = f"{self.host}/x/search/?q={encoded_wd}&stag=fypage"
        return url

    def lazy_parse(self, video_url):
        """
        对应原规则中的 lazy 逻辑（即解析接口）
        原脚本中第二个 lazy 覆盖了第一个，因此这里实现 cache.json.icu 的逻辑
        """
        # 移除 URL 中的多余参数，仅保留基础链接
        clean_url = video_url.split('?')[0]
        # 解析接口地址
        api_url = f"https://cache.json.icu/home/api?type=ys&uid=292796&key=fnoryABDEFJNPQV269&url={clean_url}"
        
        try:
            # 模拟原脚本 headers
            parse_headers = {'User-Agent': 'okhttp/4.12.0'}
            res = requests.get(api_url, headers=parse_headers, timeout=8)
            res_json = res.json()
            
            # 返回解析后的真实播放地址，如果失败则返回原链接
            return res_json.get('url', video_url)
        except Exception as e:
            print(f"解析出错: {e}")
            return video_url
