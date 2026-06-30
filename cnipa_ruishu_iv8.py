# ============================================================
# 国家知识产权局 专利公布公告查询 (http://epub.cnipa.gov.cn/Dxb/IndexQuery)
# 瑞数(Ruishu) + iv8：iv8 执行页面 JS 生成 cookie 与 POST URL 后缀，
# requests 同 session 回放首查并按 searchAfter 游标翻页，
# 解析 标题 / 申请公布号 / 申请公布日。
#
# 单文件自包含，运行过程不创建任何额外文件。
# 仅供学习 iv8 / 瑞数对抗原理参考，使用者须遵守目标网站服务条款与当地法律。
# ============================================================
import html as _html
import io
import logging
import re
import sys
import time
import urllib.parse
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests
from pymongo import ASCENDING,errors


# ---------- 静默导入 iv8（屏蔽 import 时的版本横幅） ----------
def _import_iv8_silent():
    _o, _e = sys.stdout, sys.stderr
    sys.stdout, sys.stderr = io.StringIO(), io.StringIO()
    try:
        import iv8
    finally:
        sys.stdout, sys.stderr = _o, _e
    return iv8


iv8 = _import_iv8_silent()

# ---------- 极简 logger（仅控制台，不写文件） ----------
logging.basicConfig(level=logging.INFO,
                    format="%(asctime)s | %(levelname)-7s | %(message)s",
                    datefmt="%H:%M:%S")
logger = logging.getLogger("cnipa")

# ------------------------- 可编辑常量 -------------------------
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
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


processed_ids = set()


def _cookie_header(session):
    """把 session jar 拼成 Cookie 请求头字符串。"""
    return "; ".join(f"{k}={v}" for k, v in session.cookies.get_dict().items())


def _merge_cookie(session, cookie_str):
    """把 iv8 算出的 cookie 字符串合并回 session jar（瑞数 cookie 每次请求会轮换）。"""
    for kv in (cookie_str or "").split("; "):
        if "=" in kv:
            k, v = kv.split("=", 1)
            session.cookies.set(k.strip(), v, domain="epub.cnipa.gov.cn")


def solve_challenge(session, ctx, url, referer=None):
    """带瑞数挑战地 GET：202 挑战页喂 iv8 算 cookie，400 空壳带新 ck 重试，直到 200 真实页。"""
    text = ""
    for i in range(8):
        cur = _cookie_header(session)
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
            _merge_cookie(session, ctx.eval(
                "window.__iv8__.netLog.entries[window.__iv8__.netLog.entries.length - 1].cookieHeader"))
            continue
        if r.status_code in (400, 502):
            continue
        return text
    return text


def sign_request(ctx, target_url, body):
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


def post_signed(session, ctx, target_url, body, retries=4):
    """iv8 签名 + requests 回放。每次尝试都【重新签名】（新后缀+新轮换 cookie）——
    瑞数后缀被服务器消费一次后失效。对超时/4xx/5xx 重新签名重试；
    502（网关限流）退避更久，避免把站点打挂。不重发旧后缀。"""
    last_resp = None
    for attempt in range(retries):
        signed_url, doc_cookie = sign_request(ctx, target_url, body)
        _merge_cookie(session, doc_cookie)
        try:
            r = session.post(
                signed_url, data=body,
                headers={**BASE_HEADERS, "Cookie": _cookie_header(session), "Origin": ORIGIN,
                         "Referer": INDEX_URL, "Content-Type": "application/x-www-form-urlencoded",
                         "X-Requested-With": "XMLHttpRequest"},
                timeout=(10,20))
            last_resp = r
            if r.status_code == 200 and len(r.text) > 1000:
                return r
            wait = 8 if r.status_code == 502 else 2
            logger.info("响应异常重新签名重试 %s/%s: status=%s len=%s（等待 %ss）",
                        attempt + 1, retries, r.status_code, len(r.text), wait)
            time.sleep(wait)
        except requests.exceptions.RequestException as e:
            logger.info("请求超时重新签名重试 %s/%s: %s", attempt + 1, retries, type(e).__name__)
            time.sleep(3)
    return last_resp


def gv(html, name):
    """从 HTML 取某 id 的 input value。"""
    m = (re.search(rf'id="{name}"[^>]*value="([^"]*)"', html)
         or re.search(rf'value="([^"]*)"[^>]*id="{name}"', html))
    return m.group(1) if m else ""


def parse_form_template(index_html):
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


def build_page_body(template, cur_html, page, page_size):
    """用固定模板 + 当前页响应游标构造翻页 body。
    searchAfter = lastSort;lastAn（sortFiled 以 ggr 开头取 lastGgr，否则 lastAd）。"""
    last_ggr, last_an, last_ad = gv(cur_html, "lastGgr"), gv(cur_html, "lastAn"), gv(cur_html, "lastAd")
    sort = gv(cur_html, "sortFiled") or "ggr_desc"
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


def spider(company):
    session = requests.Session()
    session.trust_env = False  # 禁用系统代理，直连目标站（本机配了 127.0.0.1:7897 代理会干扰）
    with iv8.JSContext(environment=ENVIRONMENT, config={"timezone": "Asia/Shanghai"}) as ctx:
        # 1. 首页过瑞数挑战，拿到 S/T cookie
        logger.info("过首页瑞数挑战 ...")
        solve_challenge(session, ctx, HOME_URL)
        logger.info("首页 cookie: %s", list(session.cookies.get_dict().keys()))

        # 2. 进入检索页，取防伪 token
        index_html = solve_challenge(session, ctx, INDEX_URL, referer=HOME_URL)
        token = re.search(r'name="__RequestVerificationToken"[^>]*value="([^"]+)"', index_html).group(1)
        logger.info("检索页就绪，token=%s...", token[:24])

        # 3. 首查（POST /Dxb/IndexQuery）
        index_form = {
            "searchStr": company, "trsSql": "",
            "__RequestVerificationToken": token,
            "fmgb": "false", "fmsq": "false", "xxsq": "false", "wgsq": "false",
        }
        resp = post_signed(session, ctx, INDEX_URL, urllib.parse.urlencode(index_form))
        if resp is None or resp.status_code != 200:
            logger.error("首查失败，终止")
            return
        html = resp.text
        template = parse_form_template(html)  # query_form 固定模板（仅首查整页含）
        all_rows = [(START_PAGE, parse_list(html))]
        logger.info("[第%s页] status=%s len=%s 解析 %s 条（模板 %s 字段）",
                    START_PAGE, resp.status_code, len(html), len(all_rows[0][1]), len(template))

        # 4. 翻页（POST /dxb/PageQuery）：每页用当前页响应游标 + 固定模板重新签名
        cur_html = html
        for page in range(START_PAGE + 1, START_PAGE + PAGE_COUNT):
            body = build_page_body(template, cur_html, page, PAGE_SIZE)
            pr = post_signed(session, ctx, PAGE_URL, body)
            if pr is None:
                logger.error("[第%s页] 多次重试仍失败，跳过", page)
                continue
            rows = parse_list(pr.text)
            all_rows.append((page, rows))
            logger.info("[第%s页] status=%s len=%s 解析 %s 条",
                        page, pr.status_code, len(pr.text), len(rows))
            if pr.status_code == 200 and rows:
                cur_html = pr.text  # PageQuery 片段含 lastGgr/lastAn，更新游标来源
            time.sleep(3)  # 目标站较慢且有频率限流，页间间隔放大

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


def main():
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
        for comp_name in ["阿里巴巴", "腾讯", "华为", "小米", "格力", "宁德时代", "安徽佰恒建筑工程有限公司",
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
                    processed_ids.add(comp_name)
                    processed_companies.add(comp_name)  # 记录已处理的公司
                    # flist.append(executor.submit(spider, comp_name))
                    spider(comp_name)
                    _ += 1
                    # if len(flist) >= 5:
                    #     for future in as_completed(flist):
                    #         future.result()
                    #     flist.clear()  # 清空已完成的任务列表
                    print(f"这是第 【{_}】 家公司！！")
            except errors.DuplicateKeyError:
                logger.warning(f"【*】专利已过滤:{comp_name}")

        # if flist:
        #     for future in as_completed(flist):
        #         future.result()


if __name__ == "__main__":
    main()
