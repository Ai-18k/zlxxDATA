
import threading
from typing import Optional
import iv8
import requests
from loguru import logger
from lxml import etree
import re
import execjs
from concurrent.futures import ThreadPoolExecutor, as_completed
from tqdm import tqdm
from pymongo import ASCENDING,errors
from PikaUse import MQConnectionPool
from config import Config
import urllib.parse
import html as _html
import time
from bs4 import BeautifulSoup



UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
ORIGIN = "http://epub.cnipa.gov.cn"
HOME_URL = ORIGIN + "/"                 # 瑞数挑战入口（首页）
INDEX_URL = ORIGIN + "/Dxb/IndexQuery"  # 检索页 / 首查（POST 表单）
# 翻页接口：精确大小写 /Dxb/PageQuery 被瑞数 WAF 拦截（400 空壳），
# 改用小写 /dxb/PageQuery 绕过，ASP.NET 路由大小写不敏感照常返回数据。
PAGE_URL = ORIGIN + "/dxb/PageQuery"
KEYWORD = "阿里巴巴"                        # 检索关键词
START_PAGE = 1                          # 起始页
PAGE_SIZE = 20                          # 每页条数（最大 20 减少翻页请求）

# 重试次数（瑞数稳定时减少重试）
SOLVE_RETRIES = 5                       # solve_challenge 重试次数
SIGN_RETRIES = 3                        # post_signed 签名重试次数

BASE_HEADERS = {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9",
}
ENVIRONMENT = {
    "location": {
        "href": HOME_URL, "origin": ORIGIN, "protocol": "http:",
        "host": "epub.cnipa.gov.cn", "hostname": "epub.cnipa.gov.cn",
        "port": "", "pathname": "/", "search": "", "hash": "",
    },
    "navigator": {"userAgent": UA},
}


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
            # coms=[company["companyName"] for company in item_info]

            logger.success(
                f"【✅ 发送成功】"
                f"数据类型:{data_type} | "
                f"数量:{len(item_info)}条 | "
                # f"示例:{coms}"
                f"示例:{item_info}"
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


# 瑞数请求全局锁：防止并发 solve/sign 触发服务器限流断开
_RUISHU_LOCK = threading.Lock()


class Patentspider(Config):

    def __init__(self, area):
        super().__init__(area)
        self.page = 2
        self.base_url = "http://epub.cnipa.gov.cn/Dxb/PageQuery"
        self.headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Content-Type": "application/x-www-form-urlencoded",
        "Origin": "http://epub.cnipa.gov.cn",
        "Pragma": "no-cache",
        "Referer": "http://epub.cnipa.gov.cn/Dxb/IndexQuery",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36"
    }
        self.cookies={
            "NOh8RTWx6K2dS": "607nHhTyRlsSI5WL0xI12tm_YZtNA7c0XoXyj4eL0zCmoO2I.ggd8j.3uN7seOVn_4818kjChEmhj.UzE4OWX7jA",
            "WEB": "20111132",
            ".AspNetCore.Antiforgery.VJ9V3gR6RkM": "CfDJ8DmajzUhF49Oo6dsdTmCn0-ZL3u9KFJqjbH0dCFyzyf85vcIusHPU5XVnzVYr1Tj_ANsMnQQJp3l4EiwlMLIJ0OReMIIgBwgeDHs-y6WJeg1foF-DE9SE3okA4XecTz_Dd3tZC73ao_r9yFteJHykaw",
            "NOh8RTWx6K2dT": "0HEAlvCZOOZv65owobC2XrjqOix5so1qmYa5QkvR8RVXzK4Tuj7Mm9AA6uBEv6Uv5sh4qHaPnOF5IkTRcmlZXl6ddpOj0CJ9lt3rZpj3LOKfm4t5SAFeVkdUcuIZoKeMYgczhuu4yJbXSZEmuFvxD2pMVmNwCW57C38.64wlkHQCyOBYIJWnb_kYPO96TntU1hX_QTPxUvFm8G5wuPxMR3dBup17u30PFl.3FTxBkW6tdehHcqjcry6FoVM.njflzyB.iMnC2WU5BP.z8Zve3Cq6F2TpH3XLTmfC8RAl7WnBatXeyQ6zMHBe90REFBxuygtj198tzxuTEobPG_RVhx_9iopitknJEnAGg5FYn7tFBDs4gWko.jNQcehRZ.NRpGn974SX8dzEFVwHqgThw802DoypJQvcxbxtbXFnuoHdRe7GltTzQa5F7Uu.BTROy"
        }

        self.session = requests.Session()
        self.zlxx_item = list()

        self.area_key=self.serv_client[area]["filter_company_id"]
        self.zlxx_comp_key = self.config["rkey"] + ":compList"

        self.cli_1 = self.client[self.config["rkey"]]["zlxx"]
        # self.coll_3 = self.client_01[self.config["rkey"]]["专利"]
        self.zlxx_filter_fail = self.config["rkey"] + ":filter:zlxx_com"

        self.zlxx_filter_key = self.serv_client[self.config["rkey"]]["filter_zlxx_com"]
        self.zlxx_filter_key.create_index([('company', ASCENDING)], unique=True)

        self.coll_3_1 = self.serv_client[self.config["rkey"]]["fails_专利"]
        self.coll_3_1.create_index([("company", ASCENDING)], unique=True)

        self.area_key=self.serv_client[area]["filter_company_id"]
        # self.comp_key = self.config["rkey"] + ":compList"
        self.comp_key = self.config["rkey"] + ":company_id1"
        self.processed_ids = set()  # 处理过的公司ID集合
        self.thread_local = threading.local()


    def fetch_page(self, company, page):
        plist = {
            "发明授权": {"searchCatalogInfo.Pubtype": "3"},
            "发明公布": {"searchCatalogInfo.Pubtype": "1"},
            "发明授权更正": {"searchCatalogInfo.Pubtype": "4"},
            "实用新型": {"searchCatalogInfo.Pubtype": "6"},
            "外观设计": {"searchCatalogInfo.Pubtype": "9"},
            "外观设计更正": {"searchCatalogInfo.Pubtype": "10"},
        }
        """请求单页数据"""
        base_data = {
            "searchCatalogInfo.Ggr_Begin": "",
            "searchCatalogInfo.Ggr_End": "",
            "searchCatalogInfo.Pd_Begin": "",
            "searchCatalogInfo.Pd_End": "",
            "searchCatalogInfo.An": "",
            "searchCatalogInfo.Pn": "",
            "searchCatalogInfo.Ad_Begin": "",
            "searchCatalogInfo.Ad_End": "",
            "searchCatalogInfo.E71_73": company,
            "searchCatalogInfo.E72": company,
            "searchCatalogInfo.Edz": company,
            "searchCatalogInfo.E51": "",
            "searchCatalogInfo.Ti": company,
            "searchCatalogInfo.Abs": company,
            "searchCatalogInfo.Edl": company,
            "searchCatalogInfo.E74": company,
            "searchCatalogInfo.E30": "",
            "searchCatalogInfo.E66": "",
            "searchCatalogInfo.E62": "",
            "searchCatalogInfo.E83": "",
            "searchCatalogInfo.E85": "",
            "searchCatalogInfo.E86": "",
            "searchCatalogInfo.E87": "",
            "pageModel.pageNum": page,
            "pageModel.pageSize": "10",
            "sortFiled": "ggr_desc",
            "searchAfter": "",
            "showModel": "1",
            "isOr": "True",
        }
        # 添加处理过的专利号集合进行去重
        if not hasattr(self, 'processed_patents'):
            self.processed_patents = set()

        for param in plist.keys():
            # 每次循环创建新的data字典，避免参数累加
            data = base_data.copy()
            data.update(plist[param])
            try:
                response = requests.post(self.base_url, headers=self.headers,cookies=self.cookies, data=data, verify=False, timeout=(5, 25))
            except requests.Timeout as e:
                print(e)
                raise "超时"
            print(response)
            print(response.text)
            if response.status_code == 200 and "抱歉，没有您要查询的结果！" not in response.text:
                html = etree.HTML(response.text)
                jscode = html.xpath('//script[@type="text/javascript"]/text()')[0]
                config = re.findall('var obj_2 = (.*?);', jscode, re.S)[0]
                code = execjs.eval(config)
                total_items = int(code['total_item'])
                self.page = total_items  # 更新总页数
                self.parse_page(param, html)
            else:
                print(f"{company}:没有 {param} 专利项目！！")
                continue


    @staticmethod
    def _cookie_header(session):
        """把 session jar 拼成 Cookie 请求头字符串。"""
        return "; ".join(f"{k}={v}" for k, v in session.cookies.get_dict().items())


    @staticmethod
    def _merge_cookie(session, cookie_str):
        """把 iv8 算出的 cookie 字符串合并回 session jar（瑞数 cookie 每次请求会轮换）。"""
        for kv in (cookie_str or "").split("; "):
            if "=" in kv:
                k, v = kv.split("=", 1)
                session.cookies.set(k.strip(), v, domain="epub.cnipa.gov.cn")


    def solve_challenge(self, session, ctx, url, referer=None):
        """带瑞数挑战地 GET：202 挑战页喂 iv8 算 cookie，400 空壳带新 ck 重试，直到 200 真实页。"""
        text = ""
        for i in range(SOLVE_RETRIES):
            cur = self._cookie_header(session)
            headers = {**BASE_HEADERS}
            if cur:
                headers["Cookie"] = cur
            if referer:
                headers["Referer"] = referer
            try:
                r = session.get(url, headers=headers, timeout=30)
            except requests.exceptions.RequestException as e:
                logger.warning(f"solve_challenge GET err ({i+1}/8): {type(e).__name__}")
                time.sleep(2)
                continue
            text = r.text
            if r.status_code == 200 and len(text) > 3000:
                return text
            m = re.search(r'src="([^"]+\.js)"[^>]*r=[\'"]m[\'"]', text)
            if m:
                js_url = urllib.parse.urljoin(url, m.group(1))
                try:
                    js_code = session.get(js_url, headers={**BASE_HEADERS, "Cookie": cur}, timeout=30).text
                except requests.exceptions.RequestException as e:
                    logger.warning(f"solve_challenge JS download err ({i+1}/8): {type(e).__name__}")
                    continue
                tag = f"slv{abs(hash(url + str(i))) % 99999}"
                ctx.expose({"baseURL": url, "html": text,
                            "headers": [[k, v] for k, v in r.raw.headers.items()],
                            "resources": {js_url: js_code}}, tag)
                ctx.eval(f"window.__iv8__.page.load(window.__iv8__.data.{tag})")
                ctx.eval("window.__iv8__.eventLoop.sleep(120)")
                self._merge_cookie(session, ctx.eval(
                    "window.__iv8__.netLog.entries[window.__iv8__.netLog.entries.length - 1].cookieHeader"))
                continue
            if r.status_code in (400, 502):
                continue
            # 200 短页面 / 其他状态码：不返回，继续重试
            time.sleep(2)
            continue
        logger.error(f"solve_challenge exhausted 8 retries: url={url[:60]} last_len={len(text)}")
        return text


    def sign_request(self,ctx, target_url, body):
        """在 iv8 内触发对 target_url 的 POST XHR，瑞数 hook 给 URL 加后缀。
        返回 (带后缀的最终 URL, iv8 轮换后的 document.cookie)。"""
        safe_body = body.replace("\\", "\\\\").replace("'", "\\'")
        ctx.eval(f"""
            var x = new XMLHttpRequest();
            x.open('POST', '{target_url}');
            x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            x.send('{safe_body}');
        """)
        ctx.eval("window.__iv8__.eventLoop.sleep(200)")
        n = ctx.eval("window.__iv8__.netLog.entries.length")
        entry = ctx.eval(f"window.__iv8__.netLog.entries[{n - 1}]")
        return entry["url"], ctx.eval("document.cookie")


    def post_signed(self, session, ctx, target_url, body, retries=SIGN_RETRIES):
        """iv8 签名 + requests 回放。每次尝试都【重新签名】（新后缀+新轮换 cookie）——
        瑞数后缀被服务器消费一次后失效。对超时/4xx/5xx 重新签名重试；
        502（网关限流）退避更久，避免把站点打挂。不重发旧后缀。"""
        last_resp = None
        for attempt in range(retries):
            with _RUISHU_LOCK:
                signed_url, doc_cookie = self.sign_request(ctx, target_url, body)
            self._merge_cookie(session, doc_cookie)
            try:
                r = session.post(
                    signed_url, data=body,
                    headers={**BASE_HEADERS, "Cookie": self._cookie_header(session), "Origin": ORIGIN,
                             "Referer": INDEX_URL, "Content-Type": "application/x-www-form-urlencoded",
                             "X-Requested-With": "XMLHttpRequest"},
                    timeout=60)
                last_resp = r
                if r.status_code == 200 and len(r.text) > 1000:
                    return r
                wait = 8 if r.status_code == 502 else 2
                logger.info("响应异常重新签名重试 %s/%s: status=%s len=%s（等待 %ss）"%(attempt + 1, retries, r.status_code, len(r.text), wait))
                time.sleep(wait)
            except requests.exceptions.RequestException as e:
                logger.info("请求超时重新签名重试 %s/%s: %s"%(attempt + 1, retries, type(e).__name__))
                time.sleep(3)
        return last_resp


    def parse_form_template(self,index_html):
        """从 IndexQuery 完整页提取 query_form 字段顺序模板（翻页时固定复用）。
        注意：PageQuery 返回的是 HTML 片段，不含 query_form，所以模板只能取自首查整页。"""
        seg_i = index_html.find('id="query_form"')
        seg = index_html[index_html.rfind("<form", 0, seg_i):index_html.find("</form>", seg_i)]
        pairs = []
        for m in re.finditer(r'<input\b[^>]*>', seg):
            tag = m.group()
            nm = re.search(r'name="([^"]+)"', tag)
            if not nm:
                continue
            vl = re.search(r'value="([^"]*)"', tag)
            pairs.append((nm.group(1), _html.unescape(vl.group(1)) if vl else ""))
        return pairs

    @staticmethod
    def clean_key(text):
        """清洗字段名中的特殊空白字符（BeautifulSoup已将&emsp;/&thinsp;/&nbsp;解码为Unicode）"""
        text = re.sub(r'[\s\u00a0\u2002\u2003\u2009]+', '', text)
        text = text.replace("：", "").replace(":", "").strip()
        return text


    def parse_list(self,html):
        """解析列表：标题、申请公布号、申请公布日。"""
        items = []
        patent_result = {
            "propertyTitle": "",  # 专利名称
            "infoType": "",  # 发明公布
            "zlOpenNum": "",  # 申请公布号
            "gainDate": "",  # 申请公布日
            "propertyNum": "",  # 申请号
            "filingDate": "",  # 申请日
            "relationCompanyName": "",  # 申请人
            "zlInventor": "",  # 发明人
            # "address": "",  # 地址
            # "classification": "",  # 分类号
            # "agency": "",  # 专利代理机构
            # "agent": "",  # 专利代理师
            "content": ""  # 摘要
        }

        field_map = {
            "申请公布号": "zlOpenNum",
            "申请公布日": "gainDate",
            "申请号": "propertyNum",
            "申请日": "filingDate",
            "申请人": "relationCompanyName",
            "发明人": "zlInventor",
            "摘要": "content",
        }

        soup=BeautifulSoup(html, "html.parser")
        for h1 in soup.find_all("h1", class_="title"):
            try:
                for div in h1.find_all("div", class_=["info", "intro"]):
                    title = soup.find("h1")
                    if title:
                        txt = title.get_text(" ", strip=True)
                        patent_result["propertyTitle"] = re.sub(r"^\[.*?\]\s*", "", txt)
                        m = re.search(r"\[(.*?)\]", txt)
                        if m:
                            patent_result["infoType"] = m.group(1)
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

                                if fv in ("publicationDate", "applicationDate"):
                                    value = value.replace(".", "-")

                                patent_result[fv] = value

                                matched = True
                                break

                        if not matched:
                            with open("未匹配到的字段信息.txt", "a",encoding="utf-8") as f:
                                f.write(f"{key} -> {value}\n")
                items.append(patent_result)
            except Exception as e:
                print(e)
            print(items)
            return items


    @staticmethod
    def gv(html, name):
        """从 HTML 取某 id 的 input value。"""
        m = (re.search(rf'id="{name}"[^>]*value="([^"]*)"', html)
             or re.search(rf'value="([^"]*)"[^>]*id="{name}"', html))
        return m.group(1) if m else ""


    def build_page_body(self,template, cur_html, page, page_size):
        """用固定模板 + 当前页响应游标构造翻页 body。
        searchAfter = lastSort;lastAn（sortFiled 以 ggr 开头取 lastGgr，否则 lastAd）。"""
        last_ggr, last_an, last_ad = self.gv(cur_html, "lastGgr"), self.gv(cur_html, "lastAn"), self.gv(cur_html, "lastAd")
        sort = self.gv(cur_html, "sortFiled") or "ggr_desc"
        last_sort = last_ggr if sort.startswith("ggr") else last_ad
        out = []
        for name, val in template:
            if name == "searchAfter":
                val = f"{last_sort};{last_an}"
            elif name == "pageModel.pageNum":
                val = str(page)
            elif name == "pageModel.pageSize":
                val = str(page_size)
            out.append((name, val))
        return urllib.parse.urlencode(out)


    def _setup_session(self):
        """创建共享 session + iv8 上下文，过瑞数首页挑战（仅调用一次）。
        返回 (session, ctx) 或 None。"""
        session = requests.Session()
        session.trust_env = False
        ctx = iv8.JSContext(environment=ENVIRONMENT, config={"timezone": "Asia/Shanghai"})
        ctx.__enter__()  # 手动管理上下文生命周期
        logger.info("【共享会话】过首页瑞数挑战 ...")
        with _RUISHU_LOCK:
            self.solve_challenge(session, ctx, HOME_URL)
        cookies = session.cookies.get_dict()
        t_keys = [k for k in cookies if k.endswith('T') and k.startswith('NOh')]
        if not t_keys:
            logger.error("【共享会话】瑞数挑战未通过：缺少 T cookie")
            ctx.__exit__(None, None, None)
            return None
        logger.info("【共享会话】cookie(%d): %s"%(len(cookies), list(cookies.keys())))
        return session, ctx

    def _teardown_session(self, ctx):
        """释放共享 iv8 上下文"""
        try:
            ctx.__exit__(None, None, None)
        except Exception:
            pass

    def fetch_patents(self, KEYWORD, page, shared_sess=None, shared_ctx=None):
        """采集单个公司的专利数据。
        shared_sess/shared_ctx: 可选共享 session，传入则跳过 HOME 挑战。
        page 参数保留兼容旧接口，实际翻页从首页开始。
        """
        print(f"正在获取:{KEYWORD}数据")
        own_session = shared_sess is None
        if own_session:
            session = requests.Session()
            session.trust_env = False
            ctx = iv8.JSContext(environment=ENVIRONMENT, config={"timezone": "Asia/Shanghai"})
            ctx.__enter__()
        else:
            session = shared_sess
            ctx = shared_ctx

        try:
            if own_session:
                # 独立模式：完整流程（兼容旧调用）
                logger.info("过首页瑞数挑战 ...")
                with _RUISHU_LOCK:
                    self.solve_challenge(session, ctx, HOME_URL)
                cookies = session.cookies.get_dict()
                t_keys = [k for k in cookies if k.endswith('T') and k.startswith('NOh')]
                if not t_keys:
                    logger.error("瑞数挑战未通过：缺少 T cookie，跳过 %s" % KEYWORD)
                    return

            # 进入检索页，取防伪 token
            with _RUISHU_LOCK:
                index_html = self.solve_challenge(session, ctx, INDEX_URL, referer=HOME_URL)
            token_match = re.search(r'name="__RequestVerificationToken"[^>]*value="([^"]+)"',
                                    index_html or "")
            if not token_match:
                logger.error("无法提取 __RequestVerificationToken (len=%d)，跳过 %s" %
                             (len(index_html or ""), KEYWORD))
                return
            token = token_match.group(1)
            logger.info("检索页就绪，token=%s..." % token[:24])

            # 首查（POST /Dxb/IndexQuery）
            index_form = {
                "searchStr": KEYWORD, "trsSql": "",
                "__RequestVerificationToken": token,
                "fmgb": "false", "fmsq": "false", "xxsq": "false", "wgsq": "false",
            }
            resp = self.post_signed(session, ctx, INDEX_URL, urllib.parse.urlencode(index_form))
            if resp is None or resp.status_code != 200:
                logger.error("首查失败，终止")
                return

            html = resp.text
            template = self.parse_form_template(html)
            # 从 JS 提取总数自动计算页数
            total_match = re.search(r'total_item["\']?\s*:\s*(\d+)', html)
            total_items = int(total_match.group(1)) if total_match else 0
            total_pages = max(1, (total_items + PAGE_SIZE - 1) // PAGE_SIZE) if total_items else 1
            rows_page1 = self.parse_list(html)
            all_rows = [(1, rows_page1)]
            logger.info("[第1页] status=%s len=%s 解析 %s 条 total=%s pages=%s"%(resp.status_code, len(html), len(rows_page1), total_items, total_pages))

            # 翻页
            cur_html = html
            for pg in range(2, total_pages + 1):
                body = self.build_page_body(template, cur_html, pg, PAGE_SIZE)
                pr = self.post_signed(session, ctx, PAGE_URL, body)
                if pr is None:
                    logger.error("[第%s页] 多次重试仍失败，跳过" % pg)
                    continue
                rows = self.parse_list(pr.text)
                all_rows.append((pg, rows))
                logger.info("[第%s/%s页] status=%s len=%s 解析 %s 条"%(pg, total_pages, pr.status_code, len(pr.text), len(rows)))
                if pr.status_code == 200 and rows:
                    cur_html = pr.text

            # 打印结果
            print("\n" + "=" * 72)
            seen = set()
            for pg, rows in all_rows:
                print(f"\n------ 第 {pg} 页（{len(rows)} 条）------")
                for it in rows:
                    print(f"  标题      : {it['标题']}")
                    print(f"  申请公布号: {it['申请公布号']}")
                    print(f"  申请公布日: {it['申请公布日']}")
                    print("  " + "-" * 40)
                    seen.add(it["申请公布号"])
            total = sum(len(r) for _, r in all_rows)
            print(f"\n共 {len(all_rows)} 页，{total} 条记录，去重 {len(seen)} 个公布号。")

        finally:
            if own_session:
                try:
                    ctx.__exit__(None, None, None)
                except Exception:
                    pass


    def saveDate(self, item):
        try:
            self.cli_1.insert_one(item)
            print("-----------【%s】保存本地数据库成功！！" % item["relationCompanyName"])
        except Exception as e:
            print("-----------!!!【%s】保存本地失败：" % item["relationCompanyName"], e)
        # try:
        #     self.coll_3.insert_one(item)
        #     print("-----------【%s】保存服务器数据库成功！！" % item["relationCompanyName"])
        # except Exception as e:
        #     print("-----------!!!【%s】保存服务器失败：" % item["relationCompanyName"], e)
        # self.local_conn.lrem(self.comp_key, 1, company)


    def parse_page(self, type, html):
        reExp = {
            "发明授权": ["dl[7]", "dl[8]", "dl[3]"],
            "发明公布": ["dl[5]", "dl[6]", "dl[3]"],
            "发明授权更正": ["dl[6]", "dl[7]", "dl[4]"],
            "实用新型": ["dl[5]", "dl[6]", "dl[3]"],
            "外观设计": ["dl[5]", "dl[6]", "dl[3]"],
            "外观设计更正": ["dl[6]", "dl[7]", "dl[4]"]
        }
        """解析单页数据"""
        items = html.xpath("//div[@class='item']")
        infoStatus = str(html.xpath("//div[@class='func']/a/text()")[0]).split()
        for info in items:
            item = dict()
            item["propertyType"] = "专利"
            item["propertyTitle"] = str(info.xpath("./h1/text()")[0]).strip()
            item["zlOpenNum"] = str(info.xpath("./div[@class='info']/dl[1]/dd/text()")[0]).strip()
            item["filingDate"] = str(info.xpath("./div[@class='info']/dl[4]/dd/text()")[0]).strip()
            item["gainDate"] = str(info.xpath("./div[@class='info']/dl[2]/dd/text()")[0]).strip()
            item["infoType"] = type
            item["infoStatus"] = infoStatus[0]
            item["relationCompanyName"] = str(info.xpath(f"./div[@class='info']/{reExp[type][0]}/dd/text()")[0]).strip()
            item["zlInventor"] = str(info.xpath(f"./div[@class='info']/{reExp[type][1]}/dd/text()")[0]).strip()
            item["propertyNum"] = str(info.xpath("./div[@class='info']/dl[3]/dd/text()")[0]).strip()

            # 添加去重逻辑
            if item["zlOpenNum"] in self.processed_patents:
                print(f"跳过重复专利: {item['zlOpenNum']}")
                continue
            else:
                self.processed_patents.add(item["zlOpenNum"])

                try:
                    self.send_data(item)
                except Exception as e:
                    print("【！！】发送服务器失败！！", e)
                print(item)
                self.saveDate(item)
                del item["_id"]


    def spider(self, company, shared_sess=None, shared_ctx=None):
        """单公司采集：直接调用 fetch_patents（支持共享 session 复用）。
        共享模式下跳过 HOME 挑战（~15s/公司 → 0s/公司）。"""
        try:
            self.fetch_patents(company, page=1, shared_sess=shared_sess, shared_ctx=shared_ctx)
        except Exception as e:
            logger.error(f"[{company}] 采集异常: {type(e).__name__}: {e}")

    def send_data(self, item):
        # if "_id" in item:
        #     del item["_id"]
        print("记录打点:", len(self.zlxx_item))
        self.zlxx_item.append(item)
        if len(self.zlxx_item) >= 10:
            mongoToMQ(4, self.zlxx_item)
            print(f"【*】发送成功：{self.zlxx_item}")
            self.zlxx_item.clear()

    def _pushcom(self, comp):
        self.local_conn.lpush(self.comp_key, comp.decode())


    def copydata(self,executor):
        if not self.local_conn.exists(self.comp_key):
            num = self.area_key.estimated_document_count()
            print("找到: 【", num, "】 个文档！！")
            comps = self.area_key.find()
            futures = []
            _ = 1
            for comp in tqdm(comps, desc="处理进度", leave=True):
                # print(comp["company"])
                # self.local_conn.lpush(self.zlxx_comp_key, comp["company"])
                futures.append(executor.submit(self._pushcom,comp["company"]))
                _ += 1
            for future in as_completed(futures):
                try:
                    future.result()
                except Exception as e:
                    print(e)
            print(f"=========实际：{num}，成功导入【{_}】公司成功！！")


    def main(self):
        # 一次性创建共享 session + iv8 上下文，所有公司复用
        shared = self._setup_session()
        if not shared:
            logger.error("共享会话初始化失败，终止")
            return
        shared_sess, shared_ctx = shared

        try:
            flist = []
            _ = 0
            for comp_name in ["阿里巴巴", "腾讯", "华为", "小米", "格力",
                              "宁德时代", "安徽佰恒建筑工程有限公司",
                              "安徽诺达佳智能制造科技有限公司"]:
                try:
                    self.processed_ids.add(comp_name)
                    # 直接调用（单线程，不复用 ThreadPoolExecutor）
                    self.spider(comp_name, shared_sess=shared_sess, shared_ctx=shared_ctx)
                    _ += 1
                    print(f"这是第 【{_}】 家公司！！")
                except Exception as e:
                    logger.error(f"main 异常: {type(e).__name__}: {e}")
        finally:
            self._teardown_session(shared_ctx)
            self._flush_mq()


if __name__ == '__main__':
    Patentspider("fujian").main()























