

from curl_cffi import requests
import re
from lxml import etree
import subprocess
import urllib.parse
from bs4 import BeautifulSoup
import execjs
import math
import io
from concurrent.futures import ThreadPoolExecutor, as_completed
from pymongo import errors
from loguru import logger


class Rs6Th:

    def __init__(self):
        self.session = requests.Session(impersonate="chrome110")
        self.start_url = "http://epub.cnipa.gov.cn/"
    #     self.proxies = {
    #     'http': 'http://E2304118:C575BACB1E7D@tun-buhuph.qg.net:14358',
    #     'https': 'http://E2304118:C575BACB1E7D@tun-buhuph.qg.net:14358',
    #     # 'http': None,
    #     # 'https': None,
    # }
        self.proxies =None
        self.index_url = self.start_url  + "Dxb/IndexQuery"  #检索页 / 首查（POST 表单）
        self.page_url = self.start_url + "dxb/PageQuery" #分页页请求
        self.domain = urllib.parse.urlparse(self.start_url).netloc
        self.start_template = "env_start_template_my.js"  # 首页环境模板
        self.index_template = "env_index_tempate.js" #搜索页环境模板
        self.details_template = "env_details_tempate.js" #详情页环境模板

        # ⚠️ 【极其重要】这里的 UA 必须和你 env_start_template_.js 里手写的 navigator.userAgent 一字不差！
        self.user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36'
        self.headers = {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Accept-Language': 'zh-CN,zh;q=0.9',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Pragma': 'no-cache',
            'Referer': 'http://epub.cnipa.gov.cn/',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': self.user_agent,
        }








    def fetch_get(self, url):
        """第一次获取反爬页面，要求状态码必须为202"""
        resp = self.session.get(url, proxies=self.proxies,headers=self.headers)
        return resp.text

    def get_page(self, url):
        """普通页面请求，不限制状态码，返回响应对象"""
        resp = self.session.get(url, proxies=self.proxies,headers=self.headers)
        return resp

    def extract_info(self, html):
        """从 202 页面中提取 content, ts_code, js_path"""
        match = re.search(r'<meta id="K5MK4FPPNWrv" content="([^"]+)"', html)
        content = match.group(1) if match else ""
        tree = etree.HTML(html)
        scripts = tree.xpath('//script/text()')
        ts_code = scripts[0] if scripts else ""
        
        # 提取外链 JS (通常是第二个script，但最好做个判空)
        js_path_list = tree.xpath('//script[2]/@src')
        js_path = js_path_list[0] if js_path_list else ""
        return content, ts_code, js_path

    def start_response(self):
        # 第一步：第一次请求，必须拿到 202 页面
        html = self.fetch_get(self.start_url)
        if not html:
            return 
            
        content, ts_code, js_path = self.extract_info(html)
        if not js_path:
            print("❌ 未提取到远程 JS 路径")
            return

        # 第二步：请求远程 JS 文件 (已修复 URL 拼接 Bug)
        js_url = urllib.parse.urljoin(self.start_url, js_path)
        js_resp = self.session.get(js_url, headers=self.headers)
        remote_js = js_resp.text

        # 第三步：读取补环境模板并替换占位符
        try:
            with open(self.start_template, "r", encoding="utf-8") as f:
                env_template = f.read()
        except FileNotFoundError:
            print(f"❌ 找不到模板文件: {self.start_template}")
            return
            
        env_template = env_template.replace("content_code", content)
        env_template = env_template.replace("TS_CODE_PLACEHOLDER", ts_code)
        env_template = env_template.replace("CORE_JS_PLACEHOLDER", remote_js)

        # 第四步：保存并执行拼接后的JS，获取 T Cookie
        with open("start.js", "w", encoding="utf-8") as f:
            f.write(env_template)

        process = subprocess.run(
            ["node", "start.js"],
            capture_output=True,
            text=True,
            encoding='utf-8'
        )
        
        if process.returncode != 0:
            return
            
        # 逐行处理，更准确
        matches = []
        for line in process.stdout.split('\n'):
            # 只匹配包含 cookie 设置的日志行
            if 'NOh8RTWx6K2dT=' in line and '设置属性: cookie' in line:
                match = re.search(r'NOh8RTWx6K2dT=([^;]+)', line)
                if match:
                    matches.append(match.group(1))
            # 或者匹配 cookie 读取的日志
            elif '读取 cookie:' in line and 'NOh8RTWx6K2dT=' in line:
                match = re.search(r'NOh8RTWx6K2dT=([^;\s]+)', line)
                if match:
                    matches.append(match.group(1))

        # 去重
        content = list(dict.fromkeys(matches)) if matches else []
        t_cookie = 'NOh8RTWx6K2dT='+content[0]
        if '=' in t_cookie:
            # 去除可能存在的无用属性，只保留键值对
            main_part = t_cookie.split(';')[0].strip()
            if '=' in main_part:
                k, v = main_part.split('=', 1)
                # 写入 session
                self.session.cookies.set(k, v, domain=self.domain)

        # 【关键排查点】发起请求前，检查 Session 里的全部 Cookie
        all_cookies = self.session.cookies.get_dict()
        if len(all_cookies) < 2:
            print("⚠️ 警告：当前 Cookie 数量不足2个！")
        # 第六步：用新的 Cookie 第二次请求首页，预期得到 200
        resp_2 = self.get_page(self.start_url)
        if resp_2 is not None:
            if resp_2.status_code == 200:
                content, ts_code, js_path = self.extract_info(resp_2.text)
                token = re.search(r'name="__RequestVerificationToken"[^>]*value="([^"]+)"', resp_2.text).group(1)
                return token, content, ts_code, js_path

    def index_response(self,token, content, ts_code, js_path):
        self.generate_cookie(content, ts_code, js_path)
        all_cookies = self.session.cookies.get_dict()
        if len(all_cookies) < 2:
            print("当前cookie数量不足2个")
        data = [
            ('searchStr', '阿里巴巴'),
            ('fmgb', 'true'),
            ('fmsq', 'true'),
            ('xxsq', 'true'),
            ('wgsq', 'true'),
            ('trsSql', ''),
            ('__RequestVerificationToken', f'{token}'),
            ('fmgb', 'false'),
            ('fmsq', 'false'),
            ('xxsq', 'false'),
            ('wgsq', 'false'),
        ]
        resp_2 = self.session.post(self.index_url,proxies=self.proxies, data=data, headers=self.headers)
        if resp_2 is not None:
            print(f"第二次请求状态码: {resp_2.status_code}")
            if resp_2.status_code == 200:
                html = etree.HTML(resp_2.text)
                jscode = html.xpath('//div[@id="result"]/script/text()')[0]
                config = re.findall('var obj_2 = (.*?);', jscode, re.S)[0]
                code = execjs.eval(config)
                totalpage = int(code['total_item'])
                if totalpage <2:
                    return self.params_data(resp_2.text),None,None,None,None,None,None,None
                content, ts_code, js_path = self.extract_info(resp_2.text)
                lastAn,lastGgr=self.get_searchAfter(resp_2.text)
                token = re.search(r'name="__RequestVerificationToken"[^>]*value="([^"]+)"', resp_2.text).group(1)
                data=self.params_data(resp_2.text)
                ## 从每页3三条数据切换每页10条数据的页数
                totalpage = math.ceil(int(code['total_item']) * 3 / 10)
                return totalpage,token,content, ts_code, js_path,data,lastAn,lastGgr


    @staticmethod
    def upload_bytes(data: bytes, filename: str = "data.jpg"):
        import requests
        MAX_RETRIES = 3
        for attempt in range(MAX_RETRIES):
            try:
                # base_url = "https://www.qqbx.net/interface/dataCleaning/file/upload"
                base_url = "http://192.168.5.192:8095/interface/dataCleaning/file/upload"
                bio = io.BytesIO(data)
                bio.name = filename  # 有些服务端会读这个名字（可选）
                resp = requests.post(
                    base_url,
                    files={"file": (filename, bio, "application/octet-stream")},
                    timeout=(10, 20),
                    verify=False  # 忽略证书验证
                )
                resp.raise_for_status()
                if resp.status_code == 200:
                    url = resp.json()["data"]["url"]
                    return url
                return None
            except Exception as e:
                print(f"请求失败（尝试 {attempt + 1}/{MAX_RETRIES}）: {str(e)}")
                if attempt == MAX_RETRIES - 1:
                    return None

    @staticmethod
    def clean_key(text):
        """清洗字段名中的特殊空白字符（BeautifulSoup已将&emsp;/&thinsp;/&nbsp;解码为Unicode）"""
        text = re.sub(r'[\s\u00a0\u2002\u2003\u2009]+', '', text)
        text = text.replace("：", "").replace(":", "").strip()
        return text


    def getpic(self,src):
        for _ in range(5):
            try:
                headers = {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
                    "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
                    "Accept-Encoding": "gzip, deflate",
                    "Pragma": "no-cache",
                    "Cache-Control": "no-cache",
                    "Referer": "http://epub.cnipa.gov.cn/Dxb/IndexQuery",
                    "Accept-Language": "zh-CN,zh;q=0.9"
                }
                response = self.session.get(src, headers=headers)
                name=src.split('/')[-1]
                if response.status_code == 200:
                    url=self.upload_bytes(response.content,name)
                    return url
            except Exception as e:
                print(e)

    def params_data(self,html):
        items = []
        field_map = {
            "申请公布号": "zlOpenNum",
            "授权公告号": "zlOpenNum",
            "申请公布日": "gainDate",
            "授权公告日": "gainDate",
            "申请号": "propertyNum",
            "申请日": "filingDate",
            "申请人": "relationCompanyName",
            "专利权人": "relationCompanyName",
            "发明人": "zlInventor",
            "摘要": "content",
        }
        soup = BeautifulSoup(html, "html.parser")
        result_div = soup.find("div", class_="overview-default")
        if result_div:
            h1_list = result_div.find_all("div", class_="item")
            for h1 in h1_list:
                patent_result = {
                    "propertyTitle": "",  # 专利名称
                    "infoType": "",  # 发明公布
                    "zlOpenNum": "",  # 申请公布号
                    "gainDate": "",  # 申请公布日
                    "propertyNum": "",  # 申请号
                    "filingDate": "",  # 申请日
                    "relationCompanyName": "",  # 申请人
                    "zlInventor": "",  # 发明人
                    "content": ""  # 摘要
                }
                src_value = h1.select_one('img#pic_name')['src']
                pic_href=src_value.replace("..","http://epub.cnipa.gov.cn")
                url=self.getpic(pic_href)
                patent_result["sbImageUrl"]=url
                title = h1.find("h1")
                if title:
                    txt = title.get_text(" ", strip=True)
                    patent_result["propertyTitle"] = re.sub(r"^\[.*?\]\s*", "", txt)
                    m = re.search(r"\[(.*?)\]", txt)
                    if m:
                        patent_result["infoType"] = m.group(1)
                try:
                    for div in h1.find_all("div", class_=["info", "intro"]):
                        for dl in div.find_all("dl", recursive=False):
                            dt = dl.find("dt")
                            dd = dl.find("dd")
                            if not dt or not dd:
                                continue
                            key = self.clean_key(dt.get_text())
                            # 去掉冒号
                            key = key.replace("：", "").replace(":", "")
                            value = dd.get_text(" ", strip=True)
                            if not value:
                                continue
                            matched = False
                            for fk, fv in field_map.items():
                                if fk in key:
                                    if fv in ("gainDate", "filingDate"):
                                        value = value.replace(".", "-")
                                    patent_result[fv] = value
                                    matched = True
                                    break
                            if not matched:
                                with open("未匹配到的字段信息.txt", "a", encoding="utf-8") as f:
                                    f.write(f"{key} -> {value}\n")
                    print(patent_result)
                    items.append(patent_result)
                except Exception as e:
                    print(e)
        return items


    def generate_cookie(self,content, ts_code, js_path):
        js_url = urllib.parse.urljoin(self.start_url, js_path)
        js_resp = self.session.get(js_url, headers=self.headers)
        remote_js = js_resp.text
        try:
            with open(self.details_template, "r", encoding="utf-8") as f:
                env_template = f.read()
        except FileNotFoundError:
            return

        link = "/dxb/PageQuery"
        env_template = env_template.replace("content_code", content)
        env_template = env_template.replace("TS_CODE_PLACEHOLDER", ts_code)
        env_template = env_template.replace("CORE_JS_PLACEHOLDER", remote_js)
        env_template = env_template.replace("CORE_URl_link", self.page_url)
        env_template = env_template.replace("CORE_link", link)
        with open("details.js", "w", encoding="utf-8") as f:
            f.write(env_template)

        process = subprocess.run(
            ["node", "details.js"],
            capture_output=True,
            text=True,
            encoding='utf-8'
        )
        if process.returncode != 0:
            return
        output_lines = [line for line in process.stdout.split('\n') if line.strip()]
        if not output_lines:
            return
        t_cookie = output_lines[-2]
        Suffix = output_lines[-1]
        if '=' in t_cookie:
            # 去除可能存在的无用属性，只保留键值对
            main_part = t_cookie.split(';')[0].strip()
            if '=' in main_part:
                k, v = main_part.split('=', 1)
                # 写入 session
                self.session.cookies.set(k, v, domain=self.domain)
        return Suffix


    @staticmethod
    def get_searchAfter(html):
        # 提取 lastAn
        lastAn = re.search(r'id="lastAn"\s+type="hidden"\s+value="([^"]*)"',html)
        if lastAn:
            lastAn = lastAn.group(1)  # 输出: 202610209435X

        # 提取 lastGgr
        lastGgr = re.search(r'id="lastGgr"\s+type="hidden"\s+value="([^"]*)"',html)
        if lastGgr:
            lastGgr = lastGgr.group(1)  # 输出: 20260630
        return lastAn,lastGgr


    def details_response (self,totalpage,token, content, ts_code, js_path,company,info,lastAn,lastGgr,type):
        all_cookies = self.session.cookies.get_dict()
        if len(all_cookies) < 2:
            print("当前cookie数量不足2个！！")
        print(f"总共是【{totalpage}】页数据")
        for page in range(1, int(totalpage) + 1):
            data = {
                'searchCatalogInfo.Pubtype': type,
                'searchCatalogInfo.Ggr_Begin': '',
                'searchCatalogInfo.Ggr_End': '',
                'searchCatalogInfo.Pd_Begin': '',
                'searchCatalogInfo.Pd_End': '',
                'searchCatalogInfo.An': '',
                'searchCatalogInfo.Pn': '',
                'searchCatalogInfo.Ad_Begin': '',
                'searchCatalogInfo.Ad_End': '',
                'searchCatalogInfo.E71_73': company,
                'searchCatalogInfo.E72': company,
                'searchCatalogInfo.Edz': company,
                'searchCatalogInfo.E51': '',
                'searchCatalogInfo.Ti': company,
                'searchCatalogInfo.Abs': company,
                'searchCatalogInfo.Edl': company,
                'searchCatalogInfo.E74': company,
                'searchCatalogInfo.E30': '',
                'searchCatalogInfo.E66': '',
                'searchCatalogInfo.E62': '',
                'searchCatalogInfo.E83': '',
                'searchCatalogInfo.E85': '',
                'searchCatalogInfo.E86': '',
                'searchCatalogInfo.E87': '',
                'pageModel.pageNum': str(page),
                'pageModel.pageSize': '10',
                'sortFiled': 'ggr_desc',
                'searchAfter': f'{lastGgr};{lastAn}',
                'showModel': '1',
                'isOr': 'True',
                '__RequestVerificationToken': token,
            }
            print(f'{lastGgr};{lastAn}')
            Suffix=self.generate_cookie(content, ts_code, js_path)
            url = 'http://epub.cnipa.gov.cn'+Suffix
            resp_2 = self.session.post(url, proxies=self.proxies,data=data, headers=self.headers)
            lastAn,lastGgr=self.get_searchAfter(resp_2.text)
            with open("1.html", "w", encoding="utf-8") as f:
                f.write(resp_2.text)
            if resp_2 is not None:
                items=self.params_data(resp_2.text)
                if page == 1:
                    items.extend(info)
                print(items)


    def main(self):
        with ThreadPoolExecutor(max_workers=3) as executor:
            self.copydata(executor)
            flist = []
            _ = 0
            processed_companies = set()  # 用于记录已处理的公司

            while True:
                comp = self.local_conn.lpop(self.zlxx_comp_key)
                if not comp:
                    break  # 如果没有更多公司，退出循环
                comp_name = comp.decode()
                try:
                    self.zlxx_filter_key.insert_one({"company": comp_name})
                    if comp_name in processed_companies:
                        continue  # 如果公司已经处理过，跳过
                    else:
                        print(comp_name)
                        self.processed_ids.add(comp_name)
                        processed_companies.add(comp_name)  # 记录已处理的公司
                        flist.append(executor.submit(self.spider, comp_name))
                        _ += 1
                        if len(flist) >= 5:
                            for future in as_completed(flist):
                                future.result()
                            flist.clear()  # 清空已完成的任务列表
                        print(f"这是第 【{_}】 家公司！！")
                except errors.DuplicateKeyError:
                    logger.warning(f"【*】专利已过滤:{comp_name}")

            for future in flist:
                future.result()



if __name__ == "__main__":
    client = Rs6Th()
    # client.start_response()
    token, content, ts_code, js_path = client.start_response()
    totalpage,token1, content1, ts_code1, js_path1,data,lastAn,lastGgr = client.index_response(token, content, ts_code, js_path)
    if token1 and content1 and ts_code1 and js_path1:
        for type in [
            # "1",
            "3","4","6","9","10"]:
            client.details_response(totalpage,token1, content1, ts_code1, js_path1,"阿里巴巴",data,lastAn,lastGgr,type)