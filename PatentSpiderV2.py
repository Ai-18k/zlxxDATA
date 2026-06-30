
import threading
from typing import Optional
import iv8
# import requests
from curl_cffi import requests
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
from user_agent import get


# UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
UA=get('chrome')

ORIGIN = "http://epub.cnipa.gov.cn"
HOME_URL = ORIGIN + "/"                 # 瑞数挑战入口（首页）
INDEX_URL = ORIGIN + "/Dxb/IndexQuery"  # 检索页 / 首查（POST 表单）
# 翻页接口：精确大小写 /Dxb/PageQuery 被瑞数 WAF 拦截（400 空壳），
# 改用小写 /dxb/PageQuery 绕过，ASP.NET 路由大小写不敏感照常返回数据。
PAGE_URL = ORIGIN + "/dxb/PageQuery"
KEYWORD = "阿里巴巴"                        # 检索关键词
START_PAGE = 1                          # 起始页
PAGE_COUNT = 5                          # 抓取页数
PAGE_SIZE = 3                           # 每页条数（showModel=1 时站点默认 3）

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


def proxy_list():
    return {
        "http": "http://%(user)s:%(pwd)s@%(proxy)s/" % {"user":"17773711437", "pwd":"PSFRaaAo", "proxy": "t153.juliangip.cc:18948"},
        "https": "http://%(user)s:%(pwd)s@%(proxy)s/" % {"user":"17773711437", "pwd":"PSFRaaAo", "proxy": "t153.juliangip.cc:18948"},
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
        self.proxy=proxy_list()
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


    def solve_challenge(self,session, ctx, url, referer=None):
        """带瑞数挑战地 GET：202 挑战页喂 iv8 算 cookie，400 空壳带新 ck 重试，直到 200 真实页。"""
        text = ""
        for i in range(8):
            cur = self._cookie_header(session)
            headers = {**BASE_HEADERS}
            if cur:
                headers["Cookie"] = cur
            if referer:
                headers["Referer"] = referer
            r = session.get(url, headers=headers, timeout=30)
            text = r.text
            if r.status_code == 200 and len(text) > 3000:
                return text
            m = re.search(r'src="([^"]+\.js)"[^>]*r=[\'"]m[\'"]', text)
            if m:
                js_url = urllib.parse.urljoin(url, m.group(1))
                js_code = session.get(js_url, headers={**BASE_HEADERS, "Cookie": cur}, timeout=30).text
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
            return text
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


    def post_signed(self,session, ctx, target_url, body, retries=4):
        """iv8 签名 + requests 回放。每次尝试都【重新签名】（新后缀+新轮换 cookie）——
        瑞数后缀被服务器消费一次后失效。对超时/4xx/5xx 重新签名重试；
        502（网关限流）退避更久，避免把站点打挂。不重发旧后缀。"""
        last_resp = None
        for attempt in range(retries):
            signed_url, doc_cookie = self.sign_request(ctx, target_url, body)
            self._merge_cookie(session, doc_cookie)
            try:
                r = session.post(
                    signed_url, data=body,
                    headers={**BASE_HEADERS, "Cookie": self._cookie_header(session), "Origin": ORIGIN,
                             "Referer": INDEX_URL, "Content-Type": "application/x-www-form-urlencoded",
                             "X-Requested-With": "XMLHttpRequest"},
                    timeout=60,proxies=self.proxy)
                last_resp = r
                if r.status_code == 200 and len(r.text) > 1000:
                    return r
                wait = 8 if r.status_code == 502 else 2
                logger.info("响应异常重新签名重试 %s/%s: status=%s len=%s（等待 %ss）"%(attempt + 1, retries, r.status_code, len(r.text), wait))
                time.sleep(wait)
            except requests.exceptions.RequestException as e:
                logger.info("请求超时重新签名重试 %s/%s: %s", attempt + 1, retries, type(e).__name__)
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
    def parse_list(html):
        """解析列表：标题、申请公布号、申请公布日。"""
        items = []
        for block in re.split(r'<h1 class="title">', html)[1:]:
            title = re.sub(r"\s+", " ", block.split("</h1>")[0]).strip()
            pub_no = re.search(r"申请公布号：</dt><dd>(.*?)</dd>", block)
            pub_date = re.search(r"申请公布日：</dt><dd>(.*?)</dd>", block)
            items.append({
                "标题": title,
                "申请公布号": pub_no.group(1).strip() if pub_no else "",
                "申请公布日": pub_date.group(1).strip() if pub_date else "",
            })
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


    def fetch_patents(self,KEYWORD,page):
        print(f"正在获取:{KEYWORD}数据")
        session = requests.Session(impersonate="chrome146")
        session.trust_env = False  # 禁用系统代理，直连目标站（本机配了 127.0.0.1:7897 代理会干扰）
        with iv8.JSContext(environment=ENVIRONMENT, config={"timezone": "Asia/Shanghai"}) as ctx:
            # 1. 首页过瑞数挑战，拿到 S/T cookie
            logger.info("过首页瑞数挑战 ...")
            self.solve_challenge(session, ctx, HOME_URL)
            logger.info("首页 cookie: %s" % list(session.cookies.get_dict().keys()))

            # 2. 进入检索页，取防伪 token
            index_html = self.solve_challenge(session, ctx, INDEX_URL, referer=HOME_URL)
            token = re.search(r'name="__RequestVerificationToken"[^>]*value="([^"]+)"', index_html).group(1)
            logger.info("检索页就绪，token=%s..."%token[:24])

            # 3. 首查（POST /Dxb/IndexQuery）
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
            template = self.parse_form_template(html)  # query_form 固定模板（仅首查整页含）
            all_rows = [(START_PAGE, self.parse_list(html))]
            logger.info("[第%s页] status=%s len=%s 解析 %s 条（模板 %s 字段）"%(START_PAGE, resp.status_code, len(html), len(all_rows[0][1]), len(template)))

            # 4. 翻页（POST /dxb/PageQuery）：每页用当前页响应游标 + 固定模板重新签名
            cur_html = html
            for page in range(START_PAGE + 1, START_PAGE + PAGE_COUNT):
                body = self.build_page_body(template, cur_html, page, PAGE_SIZE)
                pr = self.post_signed(session, ctx, PAGE_URL, body)
                if pr is None:
                    logger.error("[第%s页] 多次重试仍失败，跳过" % page)
                    continue
                rows = self.parse_list(pr.text)
                all_rows.append((page, rows))
                logger.info("[第%s页] status=%s len=%s 解析 %s 条"%(page, pr.status_code, len(pr.text), len(rows)))
                if pr.status_code == 200 and rows:
                    cur_html = pr.text  # PageQuery 片段含 lastGgr/lastAn，更新游标来源
                # time.sleep(3)  # 目标站较慢且有频率限流，页间间隔放大

            # 5. 打印结果
            print("\n" + "=" * 72)
            seen = set()
            for page, rows in all_rows:
                print(f"\n------ 第 {page} 页（{len(rows)} 条）------")
                for it in rows:
                    print(f"  标题      : {it['标题']}")
                    print(f"  申请公布号: {it['申请公布号']}")
                    print(f"  申请公布日: {it['申请公布日']}")
                    print("  " + "-" * 40)
                    seen.add(it["申请公布号"])
            total = sum(len(r) for _, r in all_rows)
            print(f"\n共 {len(all_rows)} 页，{total} 条记录，去重 {len(seen)} 个公布号。")

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

    def spider(self, company):
        page = 1
        total_pages = 1  # 初始总页数
        max_workers = 1  # 最大线程数
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            while page <= total_pages:
                futures = []
                self.fetch_patents(company, page)
                # 动态调整线程数，确保不超过总页数
                current_workers = min(max_workers, total_pages - page + 1)
                for _ in range(current_workers):
                    future = executor.submit(self.fetch_patents, company, page)
                    futures.append(future)
                    page += 1
                # 处理已完成的任务
                for future in as_completed(futures):
                    future.result()
                    # 更新总页数
                total_pages = self.page

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
        with ThreadPoolExecutor(max_workers=3) as executor:
            # self.copydata(executor)
            flist = []
            _ = 0
            processed_companies = set()  # 用于记录已处理的公司
            # while True:
                # 从 Redis 队列 pop 公司
                # comp_data = self.local_conn.lpop(self.comp_key)
                # if not comp_data:
                #     logger.info("队列已空，等待中...")
                #     # 处理完剩余任务
                #     for future in as_completed(flist):
                #         future.result()
                #     flist.clear()
                #     time.sleep(10)
                #     continue
            for comp_name in ["阿里巴巴", "腾讯", "华为", "小米", "格力","宁德时代", "安徽佰恒建筑工程有限公司",
                      "安徽诺达佳智能制造科技有限公司"]:

                # try:
                #     # comp = json.loads(comp_data.decode() if isinstance(comp_data, bytes) else comp_data)
                #     # comp_name = comp["company_name"]
                #     comp_name = comp_data.decode("utf-8")
                # except (json.JSONDecodeError, KeyError, TypeError):
                #     # 兼容纯字符串格式
                #     comp_name = comp_data.decode() if isinstance(comp_data, bytes) else str(comp_data)
                try:
                    # self.zlxx_filter_key.insert_one({"company": comp_name})
                    if comp_name in processed_companies:
                        pass
                        # continue  # 如果公司已经处理过，跳过
                    else:
                        self.processed_ids.add(comp_name)
                        processed_companies.add(comp_name)  # 记录已处理的公司
                        self.spider(comp_name)
                        flist.append(executor.submit(self.spider, comp_name))
                        _ += 1
                        # if len(flist) >= 5:
                        #     for future in as_completed(flist):
                        #         future.result()
                        #     flist.clear()  # 清空已完成的任务列表
                        print(f"这是第 【{_}】 家公司！！")
                except errors.DuplicateKeyError:
                    logger.warning(f"【*】专利已过滤:{comp_name}")

            if flist:
                for future in as_completed(flist):
                    future.result()


if __name__ == '__main__':
    Patentspider("fujian").main()























