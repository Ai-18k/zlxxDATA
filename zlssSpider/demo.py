import itertools
import hashlib
import math
import re
import subprocess
import threading
import time
import uuid
from typing import List, Dict
from pathlib import Path
from urllib.parse import urlencode, parse_qsl
import json
import requests
from lxml import etree
from retrying import retry

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
        self.base_dir = Path(__file__).resolve().parent
        self.headers = {
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.9",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "DNT": "1",
            "Origin": "http://epub.cnipa.gov.cn",
            "Pragma": "no-cache",
            "Referer": "http://epub.cnipa.gov.cn/Dxb/IndexQuery",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
            "X-Requested-With": "XMLHttpRequest"
        }
        self.cookies = {}
        self.proxy=proxy_list()
        self.session=requests.Session()
        self.session.trust_env = False
        self.ts_js=None
        self.jsurl=None
        self.content=None
        self.page_form_data = []
        self.page_rs_info = None
        self.current_token = None
        self.index_search_data = []
        self._debug_skip_page_ownrl = False
        self.rs_js_cache = {}

    def _script_path(self, filename: str) -> Path:
        return self.base_dir / filename

    def _request(self, method: str, url: str, **kwargs):
        self.session.cookies.clear()
        ordered_names = []
        ordered_names.extend(name for name in self.cookies if name.startswith("NOh8RTWx6K2dS"))
        if "WEB" in self.cookies:
            ordered_names.append("WEB")
        ordered_names.extend(name for name in self.cookies if name.startswith("NOh8RTWx6K2dT"))
        if "enable_NOh8RTWx6K2d" in self.cookies:
            ordered_names.append("enable_NOh8RTWx6K2d")
        ordered_names.extend(name for name in self.cookies if name.startswith(".AspNetCore.Antiforgery"))
        ordered_names.extend(
            name for name in self.cookies
            if name not in set(ordered_names)
        )
        headers = dict(kwargs.get("headers") or {})
        if ordered_names:
            headers["Cookie"] = "; ".join(f"{name}={self.cookies[name]}" for name in ordered_names)
            kwargs["headers"] = headers
        response = self.session.request(method, url, **kwargs)
        self.cookies.update(response.cookies.get_dict())
        return response

    def _update_cookie_from_string(self, cookie_text: str):
        if not cookie_text:
            raise ValueError("瑞数 JS 未生成 document.cookie")
        first_cookie = cookie_text.split(";", 1)[0]
        name, sep, value = first_cookie.partition("=")
        if not sep or not name or not value:
            raise ValueError(f"瑞数 Cookie 格式异常: {cookie_text!r}")
        self.cookies[name] = value
        if name.startswith("NOh8RTWx6K2d"):
            self.cookies["enable_NOh8RTWx6K2d"] = "true"

    def _update_cookies_from_string(self, cookie_text: str):
        if not cookie_text:
            return
        ignored = {"path", "expires", "max-age", "domain", "samesite", "secure", "httponly"}
        for item in cookie_text.split(";"):
            name, sep, value = item.strip().partition("=")
            if not sep or not name or name.lower() in ignored:
                continue
            self.cookies[name] = value
            if name.startswith("NOh8RTWx6K2d"):
                self.cookies["enable_NOh8RTWx6K2d"] = "true"

    def _cookie_prelude_js(self) -> str:
        return "\n".join(
            f"document.cookie = {json.dumps(f'{name}={value}', ensure_ascii=False)};"
            for name, value in self.cookies.items()
        )

    def _visible_cookie_prelude_js(self) -> str:
        visible = {}
        for name, value in self.cookies.items():
            if name == "WEB" or name.startswith("NOh8RTWx6K2dT"):
                visible[name] = value
        return "\n".join(
            f"document.cookie = {json.dumps(f'{name}={value}', ensure_ascii=False)};"
            for name, value in visible.items()
        )

    def _run_cookie_js(self, cookie_doc: str, output_filename: str) -> str:
        marker = "__RS_COOKIE__"
        output_path = self._script_path(output_filename)
        output_path.write_text(
            cookie_doc + f'\n;console.log("{marker}" + rs6());\n',
            encoding="utf-8",
        )
        result = subprocess.run(
            ["node", str(output_path)],
            cwd=str(self.base_dir),
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="ignore",
            timeout=30,
        )
        if result.returncode != 0:
            raise RuntimeError(f"Node 执行瑞数 JS 失败: {result.stderr[-1000:]}")
        for line in reversed(result.stdout.splitlines()):
            if marker in line:
                return line.split(marker, 1)[1].strip()
        raise RuntimeError(f"Node 输出中未找到瑞数 Cookie，stdout 尾部: {result.stdout[-1000:]}")

    def _run_cookie_and_xhr_js(self, cookie_doc: str, output_filename: str, xhr_url: str):
        cookie_marker = "__RS_COOKIE__"
        url_marker = "__RS_XHR_URL__"
        output_path = self._script_path(output_filename)
        probe = f'''
;try {{
  var __xhr = new XMLHttpRequest();
  __xhr.open("POST", "{xhr_url}", true);
  __xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
  __xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  __xhr.send("");
}} catch (e) {{
  console.log("__RS_XHR_ERROR__" + (e && (e.stack || e.message) || e));
}}
console.log("{cookie_marker}" + rs6());
'''
        output_path.write_text(cookie_doc + probe, encoding="utf-8")
        result = subprocess.run(
            ["node", str(output_path)],
            cwd=str(self.base_dir),
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="ignore",
            timeout=30,
        )
        if result.returncode != 0:
            raise RuntimeError(f"Node 执行瑞数 XHR Probe 失败: {result.stderr[-1000:]}")
        cookie_value = ""
        rewritten_url = ""
        for line in result.stdout.splitlines():
            if cookie_marker in line:
                cookie_value = line.split(cookie_marker, 1)[1].strip()
            if url_marker in line:
                rewritten_url = line.split(url_marker, 1)[1].strip()
        if not cookie_value:
            raise RuntimeError(f"Node 输出中未找到瑞数 Cookie，stdout 尾部: {result.stdout[-1000:]}")
        return cookie_value, rewritten_url

    def _run_env2_xhr_js(
        self,
        content: str,
        ts_js: str,
        jsurl: str,
        functo_js: str,
        token: str,
        page_query_body: str,
    ) -> str:
        marker = "__RS_XHR_URL__"
        cookie_marker = "__RS_COOKIE__"
        output_path = self._script_path("测试_env2_xhr.js")
        env_doc = self._script_path("env2.js").read_text(encoding="utf-8")
        env_doc = re.sub(
            r'var\s+_content\s*=\s*"[^"]*"',
            f"var _content={json.dumps(content, ensure_ascii=False)}",
            env_doc,
            count=1,
        )
        env_doc = re.sub(
            r'var\s+corsToken\s*=\s*"[^"]*"',
            f"var corsToken={json.dumps(token, ensure_ascii=False)}",
            env_doc,
            count=1,
        )
        env_doc = re.sub(
            r'Navigator\.prototype\.appVersion\s*=\s*\n\s*"[^"]*";',
            f"Navigator.prototype.appVersion = {json.dumps(self.headers['User-Agent'].replace('Mozilla/', ''), ensure_ascii=False)};",
            env_doc,
            count=1,
        )
        env_doc = re.sub(
            r'Navigator\.prototype\.userAgent\s*=\s*\n\s*"[^"]*";',
            f"Navigator.prototype.userAgent = {json.dumps(self.headers['User-Agent'], ensure_ascii=False)};",
            env_doc,
            count=1,
        )
        env_doc = env_doc.replace('Navigator.prototype.language = "zh-CN";', 'Navigator.prototype.language = "en-US";')
        env_doc = env_doc.replace('Navigator.prototype.maxTouchPoints = 0;', 'Navigator.prototype.maxTouchPoints = 0;\nNavigator.prototype.languages = ["en-US"];\nNavigator.prototype.hardwareConcurrency = 2;')
        env_doc = env_doc.replace("window.innerWidth = 1536;", "window.innerWidth = 784;")
        env_doc = env_doc.replace("window.outerWidth = 1536;", "window.outerWidth = 160;")
        env_doc = env_doc.replace("window.innerHeight = 824;", "window.innerHeight = 574;")
        env_doc = env_doc.replace("window.outerHeight = 864;", "window.outerHeight = 28;")
        env_doc = re.sub(
            r"const\s+scriptsData\s*=\s*\[[\s\S]*?\];\s*\n\s*elements\s*=\s*scriptsData\.map",
            (
                "const scriptsData = [\n"
                '                { type: "text/javascript", r: "m", innerHTML: __rs_ts_js },\n'
                f'                {{ type: "text/javascript", charset: "utf-8", src: {json.dumps(jsurl, ensure_ascii=False)}, r: "m" }}\n'
                "            ];\n"
                "            elements = scriptsData.map"
            ),
            env_doc,
            count=1,
        )
        env_doc = env_doc.replace(
            "let match =  arguments[1].match(regex);\n"
            '    console.log("[Native Call] 匹配到的后缀: ",match[1]);\n'
            "    window._url = match[1];",
            "let match = String(arguments[1] || '').match(regex);\n"
            "    if (match) {\n"
            '        console.log("[Native Call] 匹配到的后缀: ", match[1]);\n'
            "        window._url = match[1];\n"
            "        window._rewritten_url = arguments[1];\n"
            "    }",
        )
        env_doc = env_doc.replace(
            'return corsToken\n\n    }\n\n    debugger;',
            'return { name: "__RequestVerificationToken", value: corsToken };\n\n    }\n\n    return null;',
        )
        env_doc = env_doc.replace(
            'HTMLAnchorElement.prototype.addEventListener=function(type, listener) {\n'
            '    console.log(\'打印：HTMLAnchorElement.addEventListener("\' + type + \'", \' + (listener) + \')\');\n'
            '};',
            'HTMLAnchorElement.prototype.addEventListener=function(type, listener) {\n'
            '    console.log(\'打印：HTMLAnchorElement.addEventListener("\' + type + \'", \' + (listener) + \')\');\n'
            '};\n'
            'HTMLAnchorElement.prototype.setAttribute = function(name, value) {\n'
            '    console.log(\'打印：HTMLAnchorElement.setAttribute("\' + name + \'", "\' + value + \'")\');\n'
            '    this[name] = value;\n'
            '    if (String(name).toLowerCase() === "href") {\n'
            '        const parsed = new URL(value, "http://epub.cnipa.gov.cn/Dxb/IndexQuery");\n'
            '        this.href = parsed.href;\n'
            '        this.protocol = parsed.protocol;\n'
            '        this.host = parsed.host;\n'
            '        this.hostname = parsed.hostname;\n'
            '        this.port = parsed.port;\n'
            '        this.pathname = parsed.pathname;\n'
            '        this.search = parsed.search;\n'
            '        this.hash = parsed.hash;\n'
            '        this.origin = parsed.origin;\n'
            '    }\n'
            '};\n'
            'HTMLAnchorElement.prototype.getAttribute = function(name) {\n'
            '    console.log(\'打印：HTMLAnchorElement.getAttribute("\' + name + \'")\');\n'
            '    return this[name] || "";\n'
            '};',
        )
        env_doc = env_doc.replace(
            "    this.protocol='http:'\n"
            "    this.hostname='epub.cnipa.gov.cn'\n"
            "    this.port=''\n"
            "    this.pathname='/Dxb/PageQuery/'\n"
            "    this.search=''\n",
            "    this.href='http://epub.cnipa.gov.cn/Dxb/IndexQuery'\n"
            "    this.protocol='http:'\n"
            "    this.host='epub.cnipa.gov.cn'\n"
            "    this.hostname='epub.cnipa.gov.cn'\n"
            "    this.port=''\n"
            "    this.pathname='/Dxb/IndexQuery'\n"
            "    this.search=''\n"
            "    this.hash=''\n"
            "    this.origin='http://epub.cnipa.gov.cn'\n",
        )
        env_doc = env_doc.replace(
            'baseURI = "http://epub.cnipa.gov.cn/Dxb/PageQuery"',
            'baseURI = "http://epub.cnipa.gov.cn/Dxb/IndexQuery"',
        )
        env_doc = env_doc.replace(
            'baseURI= "http://epub.cnipa.gov.cn/Dxb/PageQuery"',
            'baseURI= "http://epub.cnipa.gov.cn/Dxb/IndexQuery"',
        )
        env_doc = env_doc.replace(
            'this.href = "http://epub.cnipa.gov.cn/Dxb/PageQuery";\n'
            '  this.origin = "http://epub.cnipa.gov.cn";\n'
            '  this.pathname = "/Dxb/PageQuery";',
            'this.href = "http://epub.cnipa.gov.cn/Dxb/IndexQuery";\n'
            '  this.origin = "http://epub.cnipa.gov.cn";\n'
            '  this.pathname = "/Dxb/IndexQuery";',
        )
        env_doc = env_doc.replace(
            'Navigator.prototype.getBattery = function() {\n'
            '  console.log("打印：navigator.getBattery()");\n'
            '  return new Promise(function(yes,no){\n'
            '    yes (watch({}, "navigator.getBattery()"));\n'
            '  });\n'
            '};',
            'Navigator.prototype.getBattery = function() {\n'
            '  console.log("打印：navigator.getBattery()");\n'
            '  const battery = {\n'
            '    charging: true,\n'
            '    chargingTime: 0,\n'
            '    dischargingTime: Infinity,\n'
            '    level: 1,\n'
            '    addEventListener: function() {},\n'
            '    removeEventListener: function() {},\n'
            '    then: function(callback) { callback(this); return this; },\n'
            '    onchange: null,\n'
            '    onchargingchange: null,\n'
            '    onchargingtimechange: null,\n'
            '    ondischargingtimechange: null,\n'
            '    onlevelchange: null\n'
            '  };\n'
            '  return watch(battery, "navigator.getBattery()");\n'
            '};',
        )
        env_doc = re.sub(
            r'Navigator\.prototype\.getBattery\s*=\s*function\(\)\s*\{[\s\S]*?\n\};',
            'delete Navigator.prototype.getBattery;',
            env_doc,
            count=1,
        )
        env_doc = env_doc.replace(
            '''function Screen() {
  this.availHeight = 824;
  this.availWidth = 1536;
  this.colorDepth = 32;
  this.height = 864;
  this.pixelDepth = 32;
  this.width = 1536;
  this.availLeft=0;
  this.availTop=0
}''',
            '''function Screen() {
  this.availHeight = 661;
  this.availWidth = 1356;
  this.colorDepth = 32;
  this.height = 701;
  this.pixelDepth = 32;
  this.width = 1356;
  this.availLeft=0;
  this.availTop=0
}''',
        )
        env_doc = env_doc.replace(
            'let _cookie = "";',
            '''let _cookie = "";
let __cookie_store = {};
Object.defineProperty(document, "cookie", {
  configurable: true,
  enumerable: true,
  get: function() {
    return Object.keys(__cookie_store).map(function(k) { return k + "=" + __cookie_store[k]; }).join("; ");
  },
  set: function(value) {
    const raw = String(value || "");
    const parts = raw.split(";").map(function(part) { return part.trim(); });
    const item = parts[0];
    if (!item) return;
    const idx = item.indexOf("=");
    if (idx < 0) return;
    const name = item.slice(0, idx).trim();
    const val = item.slice(idx + 1).trim();
    if (!name || /^(path|expires|max-age|domain|samesite)$/i.test(name)) return;
    for (var i = 1; i < parts.length; i++) {
      var part = parts[i];
      var pidx = part.indexOf("=");
      var attrName = (pidx >= 0 ? part.slice(0, pidx) : part).trim().toLowerCase();
      var attrVal = pidx >= 0 ? part.slice(pidx + 1).trim() : "";
      if (attrName === "max-age" && /^-?\\d+$/.test(attrVal) && parseInt(attrVal, 10) <= 0) {
        delete __cookie_store[name];
        _cookie = document.cookie;
        return;
      }
      if (attrName === "expires") {
        var expiresTime = Date.parse(attrVal);
        if (!isNaN(expiresTime) && expiresTime <= Date.now()) {
          delete __cookie_store[name];
          _cookie = document.cookie;
          return;
        }
      }
    }
    __cookie_store[name] = val;
    _cookie = document.cookie;
  }
});''',
        )
        env_doc = env_doc.replace('require("./endr_js.js");', "")
        env_doc = env_doc.replace('require("./dey_js.js");', "")
        field_by_name = dict(parse_qsl(page_query_body, keep_blank_values=True))
        field_by_id = {
            "pubtype": field_by_name.get("searchCatalogInfo.Pubtype", ""),
            "pageNum": field_by_name.get("pageModel.pageNum", ""),
            "pageSize": field_by_name.get("pageModel.pageSize", ""),
            "sortFiled": field_by_name.get("sortFiled", ""),
            "searchAfter": field_by_name.get("searchAfter", ""),
            "showModel": field_by_name.get("showModel", ""),
            "isOr": field_by_name.get("isOr", ""),
        }
        if field_by_id["searchAfter"] and ";" in field_by_id["searchAfter"]:
            last_sort, last_an = field_by_id["searchAfter"].split(";", 1)
            field_by_id["lastGgr"] = last_sort
            field_by_id["lastAd"] = last_sort
            field_by_id["lastAn"] = last_an
        dynamic_dom_js = f"""
var __cnipaFormFieldsByName = {json.dumps(field_by_name, ensure_ascii=False)};
var __cnipaFormFieldsById = {json.dumps(field_by_id, ensure_ascii=False)};
function __cnipaInput(id, name, value) {{
    return {{
        id: id || "",
        name: name || "",
        value: value == null ? "" : String(value),
        type: "hidden",
        tagName: "INPUT",
        localName: "input",
        nodeType: 1,
        getAttribute: function(attr) {{ return this[attr] || ""; }},
        setAttribute: function(attr, val) {{ this[attr] = val; }}
    }};
}}
function __cnipaInputByName(name) {{
    return __cnipaInput("", name, __cnipaFormFieldsByName[name] || "");
}}
function __cnipaInputById(id) {{
    return __cnipaInput(id, "", __cnipaFormFieldsById[id] || "");
}}
function __cnipaQueryForm() {{
    var form = new HTMLFormElement();
    form.id = "query_form";
    form.action = "/Dxb/PageQuery";
    form.method = "post";
    form.elements = Object.keys(__cnipaFormFieldsByName).map(function(name) {{
        return __cnipaInput("", name, __cnipaFormFieldsByName[name]);
    }});
    form.length = form.elements.length;
    form.querySelector = function(selector) {{
        if (selector === 'input[name="__RequestVerificationToken"]') return __cnipaInput("", "__RequestVerificationToken", __cnipaFormFieldsByName.__RequestVerificationToken || corsToken);
        var m = String(selector || "").match(/^input\\[name=["']([^"']+)["']\\]$/);
        if (m) return __cnipaInputByName(m[1]);
        return null;
    }};
    form.querySelectorAll = function(selector) {{
        if (selector === "input") return form.elements;
        return [];
    }};
    form.getAttribute = function(attr) {{ return this[attr] || ""; }};
    return form;
}}
var __cnipaOriginalGetElementById = HTMLDocument.prototype.getElementById;
HTMLDocument.prototype.getElementById = function(id) {{
    if (id === "query_form") return watch(__cnipaQueryForm(), "HTMLFormElement");
    if (Object.prototype.hasOwnProperty.call(__cnipaFormFieldsById, id)) return watch(__cnipaInputById(id), "HTMLInputElement");
    return __cnipaOriginalGetElementById.call(this, id);
}};
var __cnipaOriginalQuerySelector = HTMLDocument.prototype.querySelector;
HTMLDocument.prototype.querySelector = function(selector) {{
    if (selector === "#query_form") return watch(__cnipaQueryForm(), "HTMLFormElement");
    var idMatch = String(selector || "").match(/^#([A-Za-z0-9_-]+)$/);
    if (idMatch && Object.prototype.hasOwnProperty.call(__cnipaFormFieldsById, idMatch[1])) return watch(__cnipaInputById(idMatch[1]), "HTMLInputElement");
    var nameMatch = String(selector || "").match(/^input\\[name=["']([^"']+)["']\\]$/);
    if (nameMatch) return watch(__cnipaInputByName(nameMatch[1]), "HTMLInputElement");
    return __cnipaOriginalQuerySelector.call(this, selector);
}};
"""
        env_doc = env_doc.split("// ==================== 3. 在后面：正确的后缀提取函数", 1)[0]
        runner = f"""
var __rs_ts_js = {json.dumps(ts_js, ensure_ascii=False)};
{dynamic_dom_js}
{self._visible_cookie_prelude_js()}

{ts_js}

{functo_js}

function get_suffix(method, url, data) {{
    const xhr = new window.XMLHttpRequest();
    xhr.open(method, url, true, undefined, undefined);
    if (typeof xhr.setRequestHeader === "function") {{
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        xhr.setRequestHeader("Accept", "*/*");
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    }}
    if (typeof xhr.send === "function") {{
        xhr.send(data);
    }}
    const rewritten = window._rewritten_url || (window._url ? url + "?OWNRL2Cu=" + window._url : "");
    return rewritten && rewritten.charAt(0) === "/" ? "http://epub.cnipa.gov.cn" + rewritten : rewritten;
}}

setTimeout(function() {{
    try {{
        var __mouseEvents = [];
        for (var __i = 0; __i < 18; __i++) {{
            __mouseEvents.push({{
                type: "mousemove",
                clientX: 480 + __i * 3,
                clientY: 290 + (__i % 5) * 4,
                buttons: 0
            }});
        }}
        __mouseEvents.push({{type: "mousedown", clientX: 527, clientY: 317, buttons: 1}});
        __mouseEvents.push({{type: "mousemove", clientX: 529, clientY: 318, buttons: 1}});
        __mouseEvents.push({{type: "mouseup", clientX: 529, clientY: 318, buttons: 0}});
        __mouseEvents.push({{type: "click", clientX: 529, clientY: 318, buttons: 0}});
        __mouseEvents.forEach(function(evt) {{
            try {{
                var eventInit = {{
                    isTrusted: true,
                    screenX: evt.clientX + 131,
                    screenY: evt.clientY + 135,
                    clientX: evt.clientX,
                    clientY: evt.clientY,
                    pageX: evt.clientX,
                    pageY: evt.clientY,
                    button: 0,
                    buttons: evt.buttons,
                    which: 1
                }};
                if (document.body && typeof document.body.dispatchEvent === "function") {{
                    document.body.dispatchEvent(new EventTarget(evt.type, eventInit));
                }}
                document.dispatchEvent(new EventTarget(evt.type, eventInit));
                if (typeof window.dispatchEvent === "function") {{
                    window.dispatchEvent(new EventTarget(evt.type, eventInit));
                }}
            }} catch (e) {{}}
        }});
        const __url = get_suffix("POST", "/Dxb/PageQuery", {json.dumps(page_query_body, ensure_ascii=False)});
        console.log("{marker}" + __url);
        console.log("{cookie_marker}" + document.cookie);
    }} catch (e) {{
        console.log("__RS_XHR_ERROR__" + (e && (e.stack || e.message) || e));
    }}
}}, 2000);
"""
        output_path.write_text(env_doc + runner, encoding="utf-8")
        result = subprocess.run(
            ["node", str(output_path)],
            cwd=str(self.base_dir),
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="ignore",
            timeout=30,
        )
        if result.returncode != 0:
            raise RuntimeError(f"Node 执行 env2 XHR Probe 失败: {result.stderr[-1000:]}")
        rewritten_url = ""
        cookie_text = ""
        for line in reversed(result.stdout.splitlines()):
            if marker in line:
                rewritten_url = line.split(marker, 1)[1].strip()
            if cookie_marker in line:
                cookie_text = line.split(cookie_marker, 1)[1].strip()
            if rewritten_url and cookie_text:
                break
        if cookie_text:
            self._update_cookies_from_string(cookie_text)
        if rewritten_url:
            return rewritten_url
        raise RuntimeError(f"env2 未生成 OWNRL2Cu，stdout 尾部: {result.stdout[-1500:]}")

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
        response = self._request("GET", url, headers=self.headers, timeout=(5, 20))
        response.raise_for_status()
        self.rs_js_cache[jsurl] = response.text
        with self._script_path("简易版本能过.js").open(mode="r", encoding="utf-8") as f:
            cookie_doc = (f.read()
                          .replace("content_code", content)
                          .replace('"ts_code"', self._cookie_prelude_js() + "\n" + ts_js)
                          .replace('"functo_code"', response.text))
        cookie_value = self._run_cookie_js(cookie_doc, "测试.js")
        self._update_cookie_from_string(cookie_value)

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

    def execjs_data_next(self, content: str, ts_js: str, jsurl: str):
        url = "http://epub.cnipa.gov.cn" + jsurl
        response = self._request("GET", url, headers=self.headers, timeout=(5, 20))
        response.raise_for_status()
        self.rs_js_cache[jsurl] = response.text
        with self._script_path("get_cookie.js").open(mode="r", encoding="utf-8") as f:
            cookie_doc = (f.read()
                          .replace("content_code", content)
                          .replace('"ts_code"', self._cookie_prelude_js() + "\n" + ts_js)
                          .replace('"functo_code"', response.text))
        cookie_value = self._run_cookie_js(cookie_doc, "测试1.js")
        self._update_cookie_from_string(cookie_value)
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

    def _extract_token(self, html: str) -> str:
        token_list = re.findall('<input name="__RequestVerificationToken" type="hidden" value="(.*?)"', html)
        if not token_list:
            raise ValueError("页面中未找到 __RequestVerificationToken")
        return token_list[0]

    def _solve_rs_from_html(self, html: str, use_next_template: bool = False):
        content, ts_js, jsurl = self.main_rs_info(html)
        if use_next_template:
            self.execjs_data_next(content, ts_js, jsurl)
        else:
            self.execjs_data(content, ts_js, jsurl)

    def _make_page_query_url(self, token: str, page_query_body: str) -> str:
        base_url = "http://epub.cnipa.gov.cn/Dxb/PageQuery"
        if getattr(self, "_debug_skip_page_ownrl", False):
            return base_url
        if not self.page_rs_info:
            return base_url
        content, ts_js, jsurl = self.page_rs_info
        functo_js = self.rs_js_cache.get(jsurl)
        if functo_js is None:
            url = "http://epub.cnipa.gov.cn" + jsurl
            response = self._request("GET", url, headers=self.headers, timeout=(5, 20))
            response.raise_for_status()
            functo_js = response.text
            self.rs_js_cache[jsurl] = functo_js
        rewritten_url = self._run_env2_xhr_js(
            content=content,
            ts_js=ts_js,
            jsurl=jsurl,
            functo_js=functo_js,
            token=token,
            page_query_body=page_query_body,
        )
        return rewritten_url or base_url

    def _extract_search_after(self, html: str, sort_field: str = "ggr_desc") -> str:
        html_data = etree.HTML(html)
        if html_data is None:
            return ""
        last_an = html_data.xpath('string(//input[@id="lastAn"]/@value)')
        if sort_field.startswith("ggr"):
            last_sort_value = html_data.xpath('string(//input[@id="lastGgr"]/@value)')
        else:
            last_sort_value = html_data.xpath('string(//input[@id="lastAd"]/@value)')
        if not last_an or not last_sort_value:
            return ""
        return f"{last_sort_value};{last_an}"

    def _extract_patents(self, html: str) -> List[Dict[str, str]]:
        html_data = etree.HTML(html)
        if html_data is None:
            return []
        items = []
        for item in html_data.xpath('//div[contains(concat(" ", normalize-space(@class), " "), " overview-default ")]/div[contains(concat(" ", normalize-space(@class), " "), " item ")]'):
            title = " ".join("".join(item.xpath('.//h1[contains(@class, "title")]//text()')).split())
            pub_no = item.xpath('string(.//div[contains(@class, "qrcode")]/@id)')
            app_no = item.xpath('string(.//dl[dt[contains(normalize-space(.), "申请号")]]/dd[1])')
            pub_date = item.xpath('string(.//dl[dt[contains(normalize-space(.), "申请公布日")]]/dd[1])')
            applicant = " ".join("".join(item.xpath('.//dl[dt[contains(normalize-space(.), "申请人")]]/dd//text()')).split())
            if title or pub_no or app_no:
                items.append({
                    "title": title,
                    "pub_no": pub_no.strip(),
                    "app_no": app_no.strip(),
                    "pub_date": pub_date.strip(),
                    "applicant": applicant,
                })
        return items

    def _extract_query_form_data(self, html: str) -> List[tuple]:
        html_data = etree.HTML(html)
        if html_data is None:
            return []
        data = []
        for node in html_data.xpath('//form[@id="query_form"]//input[@name]'):
            name = node.xpath('string(@name)')
            data.append((name, node.xpath('string(@value)')))
        return data

    def _build_page_data(self, token: str, page: int, search_after: str):
        if not self.page_form_data:
            raise ValueError("缺少 query_form 表单数据，无法构造 PageQuery")
        data = []
        for name, value in self.page_form_data:
            if name == 'pageModel.pageNum':
                value = str(page)
            elif name == 'searchAfter':
                value = search_after
            elif name == '__RequestVerificationToken':
                value = token
            data.append((name, value))
        return data

    def _build_index_page_data(self, token: str, page: int, search_after: str):
        data = []
        for name, value in self.index_search_data:
            if name == '__RequestVerificationToken':
                value = token
            data.append((name, value))
        data.extend([
            ("pageModel.pageNum", str(page)),
            ("pageModel.pageSize", "3"),
            ("sortFiled", "ggr_desc"),
            ("searchAfter", search_after),
            ("showModel", "1"),
            ("isOr", "True"),
        ])
        return data

    def _request_page(self, token: str, page: int, search_after: str) -> str:
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
            'RequestVerificationToken': token,
            'User-Agent': self.headers["User-Agent"],
            'X-Requested-With': 'XMLHttpRequest'
        }
        data = self._build_page_data(token, page, search_after)
        page_query_body = urlencode(data, doseq=True)
        url = self._make_page_query_url(token, page_query_body)
        print("PageQuery调试:", {
            "page": page,
            "url_has_ownrl": "OWNRL2Cu=" in url,
            "T_len": len(self.cookies.get("NOh8RTWx6K2dT", "")),
            "has_enable": "enable_NOh8RTWx6K2d" in self.cookies,
            "cookie_order": [
                name for name in self.cookies
                if name.startswith("NOh8RTWx6K2dS")
                or name == "WEB"
                or name.startswith(".AspNetCore.Antiforgery")
                or name.startswith("NOh8RTWx6K2dT")
            ],
        })
        response = self._request("POST", url, headers=headers, data=page_query_body, verify=False, timeout=(5, 20))
        if response.status_code == 202:
            self._solve_rs_from_html(response.text, use_next_template=True)
            url = self._make_page_query_url(token, page_query_body)
            response = self._request("POST", url, headers=headers, data=page_query_body, verify=False, timeout=(5, 20))
        if response.status_code >= 400:
            print("PageQuery失败详情:", {
                "status": response.status_code,
                "url": url,
                "body": page_query_body,
                "text": response.text[:1000],
            })
            fallback_headers = {
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                "Accept-Language": "zh-CN,zh;q=0.9",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Content-Type": "application/x-www-form-urlencoded",
                "DNT": "1",
                "Origin": "http://epub.cnipa.gov.cn",
                "Pragma": "no-cache",
                "Referer": "http://epub.cnipa.gov.cn/Dxb/IndexQuery",
                "Upgrade-Insecure-Requests": "1",
                "User-Agent": self.headers["User-Agent"],
            }
            fallback_url = "http://epub.cnipa.gov.cn/Dxb/IndexQuery"
            fallback_body = urlencode(self._build_index_page_data(token, page, search_after), doseq=True)
            fallback_response = self._request(
                "POST",
                fallback_url,
                headers=fallback_headers,
                data=fallback_body,
                verify=False,
                timeout=(5, 20),
            )
            if fallback_response.status_code == 202:
                self._solve_rs_from_html(fallback_response.text, use_next_template=True)
                fallback_response = self._request(
                    "POST",
                    fallback_url,
                    headers=fallback_headers,
                    data=fallback_body,
                    verify=False,
                    timeout=(5, 20),
                )
            if fallback_response.status_code < 400:
                html = fallback_response.text
                self.current_token = self._extract_token(html)
                self.page_form_data = self._extract_query_form_data(html)
                self.page_rs_info = self.main_rs_info(html)
                return html
            print("IndexQuery回退失败详情:", {
                "status": fallback_response.status_code,
                "body": fallback_body,
                "text": fallback_response.text[:1000],
            })
        response.raise_for_status()
        return response.text


    def fechcom(self, token, first_html: str, max_pages: int = 10):
        search_after = ""
        for page in range(1, max_pages + 1):
            if page == 1:
                html = first_html
            else:
                try:
                    html = self._request_page(token, page, search_after)
                except requests.RequestException as exc:
                    print(f"第 {page} 页请求失败，停止翻页: {exc}")
                    break
            patents = self._extract_patents(html)
            print(f"第 {page} 页数据: {len(patents)} 条")
            for patent in patents:
                print(f"{patent['pub_no']} | {patent['app_no']} | {patent['pub_date']} | {patent['title']}")
            token = self.current_token or token
            search_after = self._extract_search_after(html)
            if not search_after:
                print("未提取到下一页 searchAfter，停止翻页")
                break


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
            "User-Agent": self.headers["User-Agent"]
        }
        url = "http://epub.cnipa.gov.cn/Dxb/IndexQuery"
        data = {
            "indexSearchModel.searchStr": "阿里巴巴",
            "indexSearchModel.fmgb": [
                "true",
                "false"
            ],
            "indexSearchModel.fmsq": [
                "true",
                "false"
            ],
            "indexSearchModel.xxsq": [
                "true",
                "false"
            ],
            "indexSearchModel.wgsq": [
                "true",
                "false"
            ],
            "trsSql": "",
            "pageModel.pageNum": "1",
            "pageModel.pageSize": "10",
            "sortFiled": "ggr_desc",
            "searchAfter": "",
            "showModel": "1",
            "isOr": "True",
            "__RequestVerificationToken":token
        }
        self.index_search_data = [
            ("indexSearchModel.searchStr", "阿里巴巴"),
            ("indexSearchModel.fmgb", "true"),
            ("indexSearchModel.fmgb", "false"),
            ("indexSearchModel.fmsq", "true"),
            ("indexSearchModel.fmsq", "false"),
            ("indexSearchModel.xxsq", "true"),
            ("indexSearchModel.xxsq", "false"),
            ("indexSearchModel.wgsq", "true"),
            ("indexSearchModel.wgsq", "false"),
            ("trsSql", ""),
            ("pageModel.pageNum", "1"),
            ("pageModel.pageSize", "10"),
            ("sortFiled", "ggr_desc"),
            ("searchAfter", ""),
            ("showModel", "1"),
            ("isOr", "True"),
            ("__RequestVerificationToken", token),
        ]
        print("数据请求:",self.cookies)
        response = self._request("POST", url, headers=headers, data=data, verify=False, timeout=(5,20))
        if response.status_code == 202:
            self._solve_rs_from_html(response.text, use_next_template=True)
            response = self._request("POST", url, headers=headers, data=data, verify=False, timeout=(5,20))
        response.raise_for_status()
        print("第三次获取cookies信息:", self.cookies)
        print(response)
        with self._script_path("demo.html").open("w", encoding="utf-8") as f:
            f.write(response.text)
        global rs_content
        rs_content=response.text
        token = self._extract_token(response.text)
        self.current_token = token
        self.page_form_data = self._extract_query_form_data(response.text)
        if not self.page_form_data:
            raise ValueError("IndexQuery 响应中未找到 query_form 表单")
        self.page_rs_info = self.main_rs_info(rs_content)
        print("第四次获取cookies信息:", self.cookies)
        return token, response.text


    @retry(wait_fixed=1000, stop_max_attempt_number=5)
    def get_cookie(self):
        url = "http://epub.cnipa.gov.cn/"
        response = self._request("GET", url, headers=self.headers, verify=False, timeout=(5, 20))
        print(response)
        if response.status_code == 200:
            token=self._extract_token(response.text)
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
        self.search_gjzwfw(keyword="阿里巴巴", max_pages=10, page_size=10)

    def search_gjzwfw(self, keyword: str, max_pages: int = 1, page_size: int = 10):
        """国家政务服务平台的同源 CNIPA 公布公告接口，纯协议请求。"""
        url = "https://app.gjzwfw.gov.cn/jimps/link.do"
        headers = {
            "Accept": "*/*",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://app.gjzwfw.gov.cn",
            "Referer": "https://app.gjzwfw.gov.cn/jmopen/webapp/html5/zlgbggcx/index.html",
            "User-Agent": self.headers["User-Agent"],
            "X-Requested-With": "XMLHttpRequest",
        }
        all_rows = []
        for page in range(max_pages):
            offset = page * page_size
            request_time = int(time.time() * 1000)
            payload = {
                "from": "1",
                "key": "6f0c5ce612ba4471acce875dd7e6f6a2",
                "sign": hashlib.md5(f"zscqgbgg{request_time}".encode()).hexdigest(),
                "requestTime": request_time,
                "raw": {
                    "searchStr": keyword,
                    "from": offset,
                    "size": page_size,
                    "pubtypeList": ["1"],
                },
            }
            response = requests.post(
                url,
                headers=headers,
                data={"param": json.dumps(payload, ensure_ascii=False, separators=(",", ":"))},
                timeout=(5, 20),
            )
            response.raise_for_status()
            data = response.json()
            if "error_code" in data:
                raise RuntimeError(f"政务服务接口返回错误: {data}")
            rows = data.get("patentList") or []
            print(f"第 {page + 1} 页数据: {len(rows)} 条 / 总数: {data.get('allCount')}")
            for row in rows:
                item = {
                    "pub_no": row.get("pn", ""),
                    "app_no": row.get("an", ""),
                    "pub_date": str(row.get("pd", "")),
                    "title": row.get("ti", ""),
                    "applicant": row.get("e71_73", ""),
                    "code_url": row.get("codeUrl", ""),
                }
                all_rows.append(item)
                print(f"{item['pub_no']} | {item['app_no']} | {item['pub_date']} | {item['title']}")
            if len(rows) < page_size:
                break
        return all_rows


if __name__ == "__main__":
    client = CnipaClient()
    client.main()


