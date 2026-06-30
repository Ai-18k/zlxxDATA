
from curl_cffi import requests
import re
from lxml import etree
import subprocess
import urllib.parse
from bs4 import BeautifulSoup
import execjs
import math
import io
from loguru import logger
import threading
from PikaUse import MQConnectionPool
from typing import Optional


_MQ_POOL: Optional[MQConnectionPool] = None
_MQ_POOL_LOCK = threading.Lock()


def _get_mq_pool() -> MQConnectionPool:
    """获取全局MQ连接池实例（单例模式）"""
    global _MQ_POOL
    if _MQ_POOL is None:
        with _MQ_POOL_LOCK:
            if _MQ_POOL is None:
                _MQ_POOL = MQConnectionPool()
    return _MQ_POOL


def mongoToMQ(flg: int, item_info):
    """
    发送数据到RabbitMQ（使用全局连接池）

    Args:
        flg: 数据类型标识 (0-7)
        item_info: 单条数据（Dict）或批量数据（List）
    """
    # 转换为列表格式
    if not isinstance(item_info, list):
        if item_info is None:
            logger.warning(f"flg={flg} 收到None，跳过发送")
            return
        item_info = [item_info]

    if not item_info:
        logger.warning(f"flg={flg} 收到空列表，跳过发送")
        return

    pool = _get_mq_pool()

    # 数据类型名称映射（用于日志）
    data_type_names = {
        0: "公司基础信息",
        1: "行业关联数据",
        2: "科创资质数据",
        3: "司法数据",
        4: "专利数据",
        5: "许可证数据",
        6: "资质证书数据",
        7: "股东信息数据"
    }
    data_type = data_type_names.get(flg, f"类型{flg}")

    try:
        # 发送数据到MQ
        success = pool.publish(flg, item_info)

        if success:
            # 获取第一条数据的公司名称用于日志（如果存在）
            coms=[company["relationCompanyName"] for company in item_info]
            logger.success(
                f"【✅ 发送成功】"
                f"数据类型:{data_type} | "
                f"数量:{len(item_info)}条 | "
                f"公司:{coms}"
                # f"示例:{item_info}"
            )
        else:
            logger.error(f"发送数据到MQ失败，数据已保存到MongoDB失败集合")
            pool.save_to_mongodb(flg, item_info)

    except Exception as e:
        logger.error(f"mongoToMQ执行失败 (flg={flg}): {e}")
        pool.save_to_mongodb(flg, item_info)


def close_mq_pool():
    """关闭全局MQ连接池（程序退出时调用）"""
    global _MQ_POOL
    with _MQ_POOL_LOCK:
        if _MQ_POOL:
            _MQ_POOL.close()
            _MQ_POOL = None
            logger.info("全局MQ连接池已关闭")


class Patentspider():

    def __init__(self):
        self.session = requests.Session(impersonate="chrome110")
        self.start_url = "http://epub.cnipa.gov.cn/"
        self.proxies = {
        'http': 'http://E2304118:C575BACB1E7D@tun-buhuph.qg.net:14358',
        'https': 'http://E2304118:C575BACB1E7D@tun-buhuph.qg.net:14358',
        # 'http': None,
        # 'https': None,
    }
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

    def index_response(self,data,content, ts_code, js_path):
        self.generate_cookie(content, ts_code, js_path)
        all_cookies = self.session.cookies.get_dict()
        if len(all_cookies) < 2:
            print("当前cookie数量不足2个")
        resp_2 = self.session.post(self.index_url,proxies=self.proxies, data=data, headers=self.headers)
        if resp_2 is not None:
            print(f"第二次请求状态码: {resp_2.status_code}")
            if resp_2.status_code == 200:
                if "抱歉，没有您要查询的结果！" in resp_2.text:
                    return None,None,None,None,None,None,None,None,None
                html = etree.HTML(resp_2.text)
                jscode = html.xpath('//div[@id="result"]/script/text()')[0]
                config = re.findall('var obj_2 = (.*?);', jscode, re.S)[0]
                code = execjs.eval(config)
                totalpage = int(code['total_item'])
                if totalpage <2:
                    return self.params_data(resp_2.text),None,None,None,None,None,None,None,None
                content, ts_code, js_path = self.extract_info(resp_2.text)
                lastAn,lastGgr=self.get_searchAfter(resp_2.text)
                token = re.search(r'name="__RequestVerificationToken"[^>]*value="([^"]+)"', resp_2.text).group(1)
                ols=html.xpath('//ol[@class="overview-menu"]//a/text()')
                data=self.params_data(resp_2.text)
                ## 从每页3三条数据切换每页10条数据的页数
                totalpage = math.ceil(int(code['total_item']) * 3 / 10)
                return totalpage,token,content, ts_code, js_path,data,ols,lastAn,lastGgr

    @staticmethod
    def upload_bytes(data: bytes, filename: str = "data.jpg"):
        import requests
        MAX_RETRIES = 3
        for attempt in range(MAX_RETRIES):
            try:
                base_url = "https://www.qqbx.net/interface/dataCleaning/file/upload"
                # base_url = "http://192.168.5.192:8095/interface/dataCleaning/file/upload"
                bio = io.BytesIO(data)
                bio.name = filename  # 有些服务端会读这个名字（可选）
                resp = requests.post(
                    base_url,
                    files={"file": (filename, bio, "application/octet-stream")},
                    timeout=(10, 20),
                    # verify=False  # 忽略证书验证
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
                    "infoType": "",  # 专利类型
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
                    # print(patent_result)
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


    def details_response (self,totalpage,token, content, ts_code, js_path,company,info,lastAn,lastGgr,_type):
        all_cookies = self.session.cookies.get_dict()
        if len(all_cookies) < 2:
            print("当前cookie数量不足2个！！")
        print(f"总共是【{totalpage}】页数据")
        for page in range(1, int(totalpage) + 1):
            data = {
                'searchCatalogInfo.Pubtype': _type,
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
                mongoToMQ(4,items)


if __name__ == "__main__":
    # client = Patentspider()
    # token, content, ts_code, js_path = client.start_response()
    # company="厦门市鑫尚华威科技有限公司"
    # # company="泉州市八玺生物科技有限公司"
    # # company="阿里巴巴"
    # for company in ["厦门市鑫尚华威科技有限公司","泉州市八玺生物科技有限公司","阿里巴巴"]:
    #     type_list={
    #         '发明公布':1,'发明公布更正':2, '发明授权':3, '发明授权更正':4, '实用新型':6, '外观设计':9, '外观设计更正':10
    #     }
    #     index_type_list={
    #               '发明公布': 1,"发明授权":2,"实用新型":3,"外观设计":4
    #             }
    #     params = [
    #         ('searchStr', company),
    #         ('fmgb', 'true'),
    #         ('fmsq', 'true'),
    #         ('xxsq', 'true'),
    #         ('wgsq', 'true'),
    #         ('trsSql', ''),
    #         ('__RequestVerificationToken', f'{token}'),
    #         ('fmgb', 'false'),
    #         ('fmsq', 'false'),
    #         ('xxsq', 'false'),
    #         ('wgsq', 'false'),
    #     ]
    #     data,token1, content1, ts_code1, js_path1,item,tp,lastAn,lastGgr = client.index_response(params, content, ts_code, js_path)
    #     if not data:
    #         print(f"跳过！未匹配到【{company}】 专利数据！！")
    #         continue
    #     if token1 and content1 and ts_code1 and js_path1 and item and tp and lastAn and lastGgr:
    #         if not isinstance(data,list):
    #             for rge in tp:
    #                 _type=type_list[rge]
    #                 client.details_response(data,token1, content1, ts_code1, js_path1,company,item,lastAn,lastGgr,_type)
    #         else:
    #             del params[index_type_list[data["infoType"]]]
    #             data, token1, content1, ts_code1, js_path1, item, tp, lastAn, lastGgr = client.index_response(params,content,ts_code,js_path)
    #             if not data:
    #                 print(f"跳过！未匹配到【{company}】 专利数据！！")
    #                 continue
    #             if token1 and content1 and ts_code1 and js_path1 and item and tp and lastAn and lastGgr:
    #                 if not isinstance(data, list):
    #                     for rge in tp:
    #                         _type = type_list[rge]
    #                         client.details_response(data, token1, content1, ts_code1, js_path1, company, item, lastAn,
    #                                                 lastGgr, _type)
    #                 else:
    #                     params.remove(index_type_list[data["infoType"]])
    #                     data, token1, content1, ts_code1, js_path1, item, tp, lastAn, lastGgr = client.index_response(
    #                         params, content, ts_code, js_path)
    #                     if not data:
    #                         print(f"跳过！未匹配到【{company}】 专利数据！！")
    #                         continue
    #                     if token1 and content1 and ts_code1 and js_path1 and item and tp and lastAn and lastGgr:
    #                         if not isinstance(data, list):
    #                             for rge in tp:
    #                                 _type = type_list[rge]
    #                                 client.details_response(data, token1, content1, ts_code1, js_path1, company, item,
    #                                                         lastAn,
    #                                                         lastGgr, _type)
    #                     # .
    #                     # .
    #                     # .
    #                     # .
    #                     # .
    #                     # 直到paramsremove完
    #     else:
    #         mongoToMQ(4, data)
    #         del params[index_type_list[data[0]["infoType"]]]
    #         data, token1, content1, ts_code1, js_path1, item, tp, lastAn, lastGgr = client.index_response(params,content,ts_code,js_path)
    #         if not data:
    #             print(f"跳过！未匹配到【{company}】 专利数据！！")
    #             continue
    #         if token1 and content1 and ts_code1 and js_path1 and item and tp and lastAn and lastGgr:
    #             if not isinstance(data, list):
    #                 for rge in tp:
    #                     _type = type_list[rge]
    #                     client.details_response(data, token1, content1, ts_code1, js_path1, company, item, lastAn,
    #                                             lastGgr, _type)
    #         else:
    #             mongoToMQ(4, data)
    #             del params[index_type_list[data[0]["infoType"]]]
    #             data, token1, content1, ts_code1, js_path1, item, tp, lastAn, lastGgr = client.index_response(params,
    #                                                                                                           content,
    #                                                                                                           ts_code,js_path)
    #             if not data:
    #                 print(f"跳过！未匹配到【{company}】 专利数据！！")
    #                 continue

    def process_company(client, company, token, content, ts_code, js_path):
        type_list = {
            '发明公布': 1,
            '发明公布更正': 2,
            '发明授权': 3,
            '发明授权更正': 4,
            '实用新型': 6,
            '外观设计': 9,
            '外观设计更正': 10
        }

        # 对应params里面true参数的位置
        param_index = {
            "发明公布": 1,
            "发明授权": 2,
            "实用新型": 3,
            "外观设计": 4
        }

        params = [
            ('searchStr', company),
            ('fmgb', 'true'),
            ('fmsq', 'true'),
            ('xxsq', 'true'),
            ('wgsq', 'true'),
            ('trsSql', ''),
            ('__RequestVerificationToken', token),
            ('fmgb', 'false'),
            ('fmsq', 'false'),
            ('xxsq', 'false'),
            ('wgsq', 'false'),
        ]

        # 已经关闭的类型
        removed = set()

        while len(removed) < len(param_index):

            (
                data,
                token1,
                content1,
                ts_code1,
                js_path1,
                item,
                tp,
                lastAn,
                lastGgr
            ) = client.index_response(
                params,
                content,
                ts_code,
                js_path
            )

            # 没数据
            if not data:
                print(f"跳过！未匹配到【{company}】专利数据！")
                return

            success = all([
                token1,
                content1,
                ts_code1,
                js_path1,
                item,
                tp,
                lastAn,
                lastGgr
            ])

            # =======================
            # 成功
            # =======================
            if success and not isinstance(data, list):

                for patent_type in tp:
                    client.details_response(
                        data,
                        token1,
                        content1,
                        ts_code1,
                        js_path1,
                        company,
                        item,
                        lastAn,
                        lastGgr,
                        type_list[patent_type]
                    )

                return

            # =======================
            # 失败，需要关闭一个类型
            # =======================

            if not success:
                mongoToMQ(4, data)

            if isinstance(data, list):
                info_type = data[0]["infoType"]
            else:
                info_type = data["infoType"]

            if info_type in removed:
                print(f"{info_type} 已关闭，结束")
                return

            removed.add(info_type)

            idx = param_index[info_type]

            # 防止越界
            if idx < len(params):
                del params[idx]

            print(f"关闭检索类型：{info_type}")

        print(f"{company} 所有检索类型均已关闭")


    client = Patentspider()

    token, content, ts_code, js_path = client.start_response()

    companies = [
        "厦门市鑫尚华威科技有限公司",
        "泉州市八玺生物科技有限公司",
        "阿里巴巴"
    ]

    for company in companies:
        process_company(
            client,
            company,
            token,
            content,
            ts_code,
            js_path
        )