import itertools
import math
import re
import subprocess
import threading
import uuid
from typing import List, Dict
import execjs
from curl_cffi import requests
# import requests
from lxml import etree
from retrying import retry
import json

class ProxyManager:
    """可配置的代理通道管理器，采用轮询分配与失败切换"""

    def __init__(self, channels: List[Dict]):
        self._lock = threading.Lock()
        self._proxies_list: List[Dict[str, str]] = self._expand_channels(channels)
        # 使用 cycle 实现轮询
        self._cycle = itertools.cycle(range(len(self._proxies_list)))
        self._current_index = 0

    def _expand_channels(self, channels: List[Dict]) -> List[Dict[str, str]]:
        expanded: List[Dict[str, str]] = []
        for ch in channels:
            tunnel = ch["tunnel"]
            username = ch["username"]
            if "password_template" in ch and "password_range" in ch:
                start, end = ch["password_range"]
                for n in range(start, end + 1):
                    password = ch["password_template"] % n
                    expanded.append(self._build_proxy_dict(username, password, tunnel))
            else:
                password = ch["password"]
                expanded.append(self._build_proxy_dict(username, password, tunnel))
        if not expanded:
            raise ValueError("Proxy channels list is empty")
        return expanded

    def _build_proxy_dict(self, username: str, password: str, tunnel: str) -> Dict[str, str]:
        auth = f"{username}:{password}@{tunnel}"
        return {
            "http": f"http://{auth}/",
            "https": f"http://{auth}/",
        }

    def next(self) -> Dict[str, str]:
        """获取下一个通道，轮询分配"""
        with self._lock:
            self._current_index = next(self._cycle)
            return self._proxies_list[self._current_index].copy()

    def current(self) -> Dict[str, str]:
        """获取当前通道"""
        with self._lock:
            return self._proxies_list[self._current_index].copy()

    def failover(self) -> Dict[str, str]:
        """失败时切换到下一个通道"""
        return self.next()


# 可在此配置多个通道；示例：一个通道，按密码后缀 1..8 轮询
PROXY_CHANNELS = [
    {
        "tunnel": "x878.kdltps.com:15818",
        "username": "t15307733710599",
        "password_template": "2u9rtuoa:%d",
        "password_range": (1, 8),
    },
    # 可追加更多通道：
    # {"tunnel": "x999.kdltps.com:15818", "username": "user2", "password": "pass2"},
]

_GLOBAL_PROXY_MANAGER = ProxyManager(PROXY_CHANNELS)


def proxy_list():
    """提供一个确定性的轮询代理，而非随机密码"""
    # return _GLOBAL_PROXY_MANAGER.next()
    return None


rs_content=""

class CnipaClient:

    def __init__(self):
        self.headers = {
            "Accept": "*/*",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "DNT": "1",
            "Origin": "http://epub.cnipa.gov.cn",
            "Pragma": "no-cache",
            "Referer": "http://epub.cnipa.gov.cn/Dxb/IndexQuery",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
            "X-Requested-With": "XMLHttpRequest"
        }
        self.cookies = {
            "NOh8RTWx6K2dS": "60U.u0XI_mfqAsOYjB306a.aS3A78H6M8cM.3LFsCgydM1lbbmjd1f5UjUgq9G9.LNIOgw2kLB4m.1j7nI60RkiA",
        }
        self.proxy=proxy_list()
        self.session=requests.Session()
        # self.session=requests.Session()
        self.ts_js=None
        self.jsurl=None
        self.content=None

    def rpc_test(self,arg, arg1, content):
        data = {
            "group": "rs_test",
            "action": "rs_ajax",
            "arg": arg,
            "arg1": arg1,
            "arg2": content
        }
        res = requests.get("http://127.0.0.1:5620/business-demo/invoke", params=data)
        return res.json()

    def rpc_send_chunk(self,ts_code: str, url: str, chunk_id: str, seq: int, total: int, chunk: str):
        data = {
            "group": "rs_test",
            "action": "rs_ajax",
            "arg": ts_code,
            "arg1": url,
            "arg2": "",
            "chunk_id": chunk_id,
            "seq": str(seq),
            "total": str(total),
            "chunk": chunk,
        }
        res = requests.get("http://127.0.0.1:5620/business-demo/invoke", params=data)
        return res.json()


    def send_long_text(self,ts_code: str, url: str, text: str, chunk_size: int = 800):
        if not text:
            return self.rpc_test(ts_code, url, "")
        chunk_id = uuid.uuid4().hex
        total = math.ceil(len(text) / chunk_size)
        last_resp = None
        for i in range(total):
            start = i * chunk_size
            end = start + chunk_size
            piece = text[start:end]
            last_resp = self.rpc_send_chunk(ts_code, url, chunk_id, i + 1, total, piece)
        return last_resp

    def main_rs_info(self,rs6: str):
        html_data = etree.HTML(rs6)
        # content_list = html_data.xpath('//meta[2]/@content')
        pattern = r'<meta id="K5MK4FPPNWrv" content="([^"]+)"'
        match = re.search(pattern, rs6)
        content = match.group(1) if match else ""
        ts_js_list = html_data.xpath('//script[1]/text()')
        jsurl_list = html_data.xpath('//script[2]/@src')
        # content = content_list[0]
        ts_js = ts_js_list[0]
        jsurl = jsurl_list[0]
        return content, ts_js, jsurl

    def execjs_data(self, content: str, ts_js: str, jsurl: str):
        url = "http://epub.cnipa.gov.cn" + jsurl
        response = requests.get(url=url, headers=self.headers, cookies=self.cookies)
        if response.status_code == 200:
            # with open("./测试rs_js/zlzz.js", mode="r", encoding="utf-8") as f:
            with open("测试rs_js/简易版本能过.js", mode="r", encoding="utf-8") as f:
            # with open("测试rs_js/rs6V1.3.1.1.js", mode="r", encoding="utf-8") as f:
                cookie_doc = (f.read()
                              .replace("content_code", content)
                              .replace('"ts_code"', ts_js)
                              .replace('"functo_code"', response.text))
            with open("测试.js", mode="w", encoding="utf-8") as f:
                f.write(cookie_doc)
            cookie_value = execjs.compile(cookie_doc).call("rs6")
            # cookie_value = subprocess.run(['node', './测试.js'], capture_output=True, text=True)
            # print(cookie_value)
            # name, value = cookie_value.stdout.split('; path')[0].split('=', 1)
            # new_cookie={name:value}
            new_cookie = {
                "NOh8RTWx6K2dT": cookie_value.split(';')[0].split("=")[-1],
            }
            self.cookies.update(new_cookie)

    ### 补环境
    # def execjs_data_next(self, content: str, ts_js: str, jsurl: str):
    #     # 准备请求数据
    #     payload = {
    #         "content":content,
    #         "ts_code": ts_js,
    #         "functo_code": jsurl
    #     }
    #     # 发送POST请求
    #     response = requests.post(
    #         url="http://127.0.0.1:3000/text",
    #         headers={"Content-Type": "application/json"},
    #         data=json.dumps(payload)  # 或者使用 json=payload 参数
    #     )
    #     # 将响应转换为JSON并打印
    #     result = response.json()
    #     print(json.dumps(result, indent=2, ensure_ascii=False))
    #     new_cookie = {
    #         "NOh8RTWx6K2dT": result["text"].split(';')[0].split("=")[-1],
    #     }
    #     self.cookies.update(new_cookie)

    def execjs_data_next(self, content: str, ts_js: str, jsurl: str,token: str):
        url = "http://epub.cnipa.gov.cn" + jsurl
        response = self.session.get(url=url, headers=self.headers, cookies=self.cookies)
        if response.status_code == 200:
            # with open("./测试rs_js/zlzz.js", mode="r", encoding="utf-8") as f:
            # with open("测试rs_js/简易版本能过.js", mode="r", encoding="utf-8") as f:
            with open("测试rs_js/env3.js", mode="r", encoding="utf-8") as f:
                cookie_doc = (f.read()
                              .replace('"content_code"', content)
                              .replace('"auth_token"', token)
                              .replace('"ts_code"', ts_js.replace("'",'"'))
                              .replace('"functo_code"', response.text))
            with open("测试1.js", mode="w", encoding="utf-8") as f:
                f.write(cookie_doc)
            # cookie_value = execjs.compile(cookie_doc).call("rs6")
            cookie_value = subprocess.run(['node', './测试1.js'], capture_output=True, text=True)
            print(cookie_value)

            # stdout 中去掉最后的换行，按换行分割
            lines = cookie_value.stdout.strip().split('\n')

            # 第一段：第一行链接后缀值
            url_suffix= "http://epub.cnipa.gov.cn"+lines[0]
            print(url_suffix)
            # 第二段：第二行是完整的 cookie 字符串（含 path、expires 等）
            name, value = lines[1].split('; path')[0].split('=', 1)
            new_cookie={name:value}
            print(new_cookie)
            # new_cookie = {
            #     "NOh8RTWx6K2dT": cookie_value.split(';')[0].split("=")[-1],
            # }
            self.cookies.update(new_cookie)
            return url_suffix

    ###  rpc
    # def execjs_data1(self, content: str, ts_js: str, jsurl: str):
    #     resp = self.send_long_text(ts_js,jsurl,content, chunk_size=800)
    #     cook=str(resp['data']).split(";")
    #     new_cookie = {}
    #     for item in cook:
    #         item = item.strip()
    #         if '=' in item:
    #             # 使用partition确保只分割第一个等号
    #             key, _, value = item.partition('=')
    #             if key:  # 确保key不为空
    #                 new_cookie[key] = value
    #     print(new_cookie)
    #     self.cookies.update(new_cookie)

    ####  selenium 驱动本地文件
    # def execjs_data(self, content: str, ts_js: str, jsurl: str):
    #     resp = self.send_long_text(ts_js,jsurl,content, chunk_size=800)
    #     cook=str(resp['data']).split(";")
    #     new_cookie = {}
    #     for item in cook:
    #         item = item.strip()
    #         if '=' in item:
    #             # 使用partition确保只分割第一个等号
    #             key, _, value = item.partition('=')
    #             if key:  # 确保key不为空
    #                 new_cookie[key] = value
    #     print(new_cookie)
    #     self.cookies.update(new_cookie)

    @property
    def cookie(self):
        """每次访问cookies属性时都会调用这个方法"""
        return self.get_fresh_cookie()


    def get_fresh_cookie(self):
        """
        获取新的cookies的逻辑

        Returns:
            dict: cookies字典，确保返回的是字典类型
        """
        try:
            content, ts_js, jsurl = self.main_rs_info(rs_content)
            self.execjs_data(content, ts_js, jsurl)
        except Exception as e:
            print(f"get_fresh_cookie 处理异常: {e}")

        # 确保返回的是字典类型
        if isinstance(self.cookies, dict):
            return self.cookies.copy()
        else:
            print(f"self.cookies 类型错误: {type(self.cookies)}，返回空字典")
            return {}


    def fechcom(self,token,url):
        headers = {
            'Accept': '*/*',
            'Accept-Language': 'zh-CN,zh;q=0.9',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'DNT': '1',
            'Origin': 'http://epub.cnipa.gov.cn',
            'Pragma': 'no-cache',
            'Referer': 'http://epub.cnipa.gov.cn/Dxb/IndexQuery',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
            'X-Requested-With': 'XMLHttpRequest'
        }
        for page in range(2, 11):
            data = {
                "searchCatalogInfo.Pubtype": "1",
                "searchCatalogInfo.Ggr_Begin": "",
                "searchCatalogInfo.Ggr_End": "",
                "searchCatalogInfo.Pd_Begin": "",
                "searchCatalogInfo.Pd_End": "",
                "searchCatalogInfo.An": "",
                "searchCatalogInfo.Pn": "",
                "searchCatalogInfo.Ad_Begin": "",
                "searchCatalogInfo.Ad_End": "",
                "searchCatalogInfo.E71_73": "阿里巴巴",
                "searchCatalogInfo.E72": "阿里巴巴",
                "searchCatalogInfo.Edz": "阿里巴巴",
                "searchCatalogInfo.E51": "",
                "searchCatalogInfo.Ti": "阿里巴巴",
                "searchCatalogInfo.Abs": "阿里巴巴",
                "searchCatalogInfo.Edl": "阿里巴巴",
                "searchCatalogInfo.E74": "阿里巴巴",
                "searchCatalogInfo.E30": "",
                "searchCatalogInfo.E66": "",
                "searchCatalogInfo.E62": "",
                "searchCatalogInfo.E83": "",
                "searchCatalogInfo.E85": "",
                "searchCatalogInfo.E86": "",
                "searchCatalogInfo.E87": "",
                "pageModel.pageNum": "2",
                "pageModel.pageSize": "3",
                "sortFiled": "ggr_desc",
                "searchAfter": "20260619;2024118748839",
                "showModel": "1",
                "isOr": "True",
                "__RequestVerificationToken": token
            }
            response = self.session.post(url, headers=headers, cookies=self.cookies,data=data,verify=False)
            print("翻页数据:",response)

    def searchapi(self,token):
        headers = {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Cache-Control": "no-cache",
            "Content-Type": "application/x-www-form-urlencoded",
            "DNT": "1",
            "Origin": "http://epub.cnipa.gov.cn",
            "Pragma": "no-cache",
            "Proxy-Connection": "keep-alive",
            "Referer": "http://epub.cnipa.gov.cn/",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36"
        }
        url = "http://epub.cnipa.gov.cn/Dxb/IndexQuery"
        data = {
            "searchStr": "阿里巴巴",
            "fmgb": [
                "true",
                "false"
            ],
            "fmsq": [
                "true",
                "false"
            ],
            "xxsq": [
                "true",
                "false"
            ],
            "wgsq": [
                "true",
                "false"
            ],
            "trsSql": "",
            "__RequestVerificationToken":token
        }
        print("数据请求:",self.cookies)
        response = requests.post(url, headers=headers, cookies=self.cookie, data=data,verify=False,timeout=(5,20))
        print("第三次获取cookies信息:", self.cookies)
        print(response)
        with open("zlssSpider.html","w",encoding="utf-8") as f:
            f.write(response.text)
        global rs_content
        rs_content=response.text
        content, ts_js, jsurl = self.main_rs_info(rs_content)
        token = re.findall('<input name="__RequestVerificationToken" type="hidden" value="(.*?)" />', response.text)[0]
        url_suffix=self.execjs_data_next(content, ts_js, jsurl,token)
        print("第四次获取cookies信息:", self.cookies)
        return url_suffix,token

    @retry(wait_fixed=1000)
    def get_cookie(self):
        url = "http://epub.cnipa.gov.cn/"
        response = self.session.get(url, headers=self.headers, cookies=self.cookies,verify=False)
        print(response)
        if response.status_code == 200:
            token=re.findall('<input name="__RequestVerificationToken" type="hidden" value="(.*?)" />', response.text)[0]
            print("鉴权值:",token)
            content, ts_js, jsurl = self.main_rs_info(response.text)
            content = re.findall('<meta id="K5MK4FPPNWrv" content="(.*?)"', response.text)[0]
            self.execjs_data(content, ts_js, jsurl)
            self.cookies.update(response.cookies.get_dict())
            print("第二次获取cookies信息:", self.cookies)
            return token
        elif response.status_code == 202:
            global rs_content
            rs_content = response.text
            content, ts_js, jsurl = self.main_rs_info(rs_content)
            self.execjs_data(content, ts_js, jsurl)
            print("第一次获取cookies信息:", self.cookies)
            raise ConnectionError
        else:
            print(response)
            raise ConnectionError


    def main(self):
        token=self.get_cookie()
        url_suffix,token=self.searchapi(token)
        self.fechcom(token,url_suffix)



if __name__ == "__main__":
    client = CnipaClient()
    client.main()


