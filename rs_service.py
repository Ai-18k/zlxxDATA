from flask import Flask, request, jsonify, Response
import os
import webbrowser
from typing import Dict
from uuid import uuid4
import base64
import re

try:
    # 轻量 JS 引擎用于在服务端执行简单脚本，避免浏览器自动化
    from py_mini_racer import py_mini_racer
    _HAS_JS_ENGINE = True
except Exception:
    _HAS_JS_ENGINE = False

app = Flask(__name__)

# 简单内存存储：page_id -> html
HTML_STORE: Dict[str, str] = {}

SCRIPT_RE = re.compile(r"<script\\b[^>]*>([\\s\\S]*?)</script>", re.IGNORECASE)
BODY_RE = re.compile(r"<body\\b[^>]*>([\\s\\S]*?)</body>", re.IGNORECASE)

def _extract_first(body: str, start_tag: str, end_tag: str) -> str:
    # Prefer regex for body extraction
    if start_tag.lower().startswith("<body"):
        m = BODY_RE.search(body)
        if m:
            return m.group(1)
    si = body.lower().find(start_tag.lower())
    if si == -1:
        return ""
    ei = body.lower().find(end_tag.lower(), si + len(start_tag))
    if ei == -1:
        return ""
    return body[si + len(start_tag):ei]


def _extract_all(body: str, start_tag: str, end_tag: str) -> list:
    # Use regex to capture all script contents, including with attributes/newlines
    return [m.group(1) for m in SCRIPT_RE.finditer(body)]


@app.route('/upload', methods=['POST'])
def upload_html():
    """
    上传一个 HTML 页面，返回 page_id、原始访问地址和渲染结果地址。
    支持以下三种方式之一：
    - Content-Type: application/json, body: {"html": "<!DOCTYPE html>..."}
    - multipart/form-data, file 字段：file: index.html
    - text/html 原始请求体
    """
    html = None

    # JSON 方式
    if request.is_json:
        data = request.get_json(silent=True) or {}
        html = data.get('html')

    # 文件上传
    if html is None and 'file' in request.files:
        file = request.files['file']
        html = file.read().decode('utf-8', errors='ignore')

    # 原始文本
    if html is None and request.data:
        # 当 Content-Type 为 text/html 或其它时，直接取原始体
        html = request.data.decode('utf-8', errors='ignore')

    if not html:
        return jsonify({'error': '未提供 HTML 内容'}), 400

    page_id = uuid4().hex
    HTML_STORE[page_id] = html
    return jsonify({
        'page_id': page_id,
        'page_url': f'/page/{page_id}',
        'render_url': f'/render/{page_id}'
    })


@app.route('/page/<page_id>', methods=['GET'])
def get_page(page_id: str):
    html = HTML_STORE.get(page_id)
    if html is None:
        return Response('<h1>页面未找到</h1>', status=404, mimetype='text/html; charset=utf-8')
    return Response(html, status=200, mimetype='text/html; charset=utf-8')


@app.route('/render/<page_id>', methods=['GET'])
def render_page(page_id: str):
    """
    在服务端执行页面中的第一个 <script>，返回 document.body.innerHTML。
    若页面无 <script>，尝试返回 <body> 内容，否则返回原始 HTML。
    """
    if not _HAS_JS_ENGINE:
        return jsonify({'error': '服务器未安装JS引擎，请先安装 py-mini-racer'}), 500

    html = HTML_STORE.get(page_id)
    if html is None:
        return jsonify({'error': '页面未找到'}), 404

    script_codes = _extract_all(html, '<script>', '</script>')
    if not script_codes:
        body_content = _extract_first(html, '<body>', '</body>')
        return body_content if body_content else html

    ctx = py_mini_racer.MiniRacer()
    bootstrap_js = """
        var __cookie = "";
        var document = {
            get cookie() { return __cookie; },
            set cookie(v) { __cookie = v; },
            body: { innerHTML: "" }
        };
        var navigator = {
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
            platform: "Win32",
            language: "zh-CN",
            languages: ["zh-CN","zh"],
            vendor: "Google Inc."
        };
        var location = {
            href: "http://localhost/",
            origin: "http://localhost",
            hostname: "localhost",
            protocol: "http:",
            host: "localhost",
            pathname: "/"
        };
        function atob(a){return Buffer.from(a,'base64').toString('binary');}
        function btoa(b){return Buffer.from(b,'binary').toString('base64');}
        var screen = { width: 1920, height: 1080, colorDepth: 24, pixelDepth: 24, availWidth: 1920, availHeight: 1040 };
        var performance = { now: function(){ return Date.now(); } };
        var __timers = [];
        function setTimeout(fn, t){ var id = __timers.length; __timers.push(fn); return id; }
        function clearTimeout(id){ __timers[id]=null; }
        function setInterval(fn, t){ var id = __timers.length; __timers.push(fn); return id; }
        function clearInterval(id){ __timers[id]=null; }
        var crypto = { getRandomValues: function(arr){ for (var i=0;i<arr.length;i++){ arr[i] = Math.floor(Math.random()*256);} return arr; } };
        var window = { document: document, navigator: navigator, location: location };
    """
    try:
        ctx.eval(bootstrap_js)
        for code in script_codes:
            if code and code.strip():
                ctx.eval(code)
        ctx.eval("document.body.innerHTML = document.cookie;")
        body_text = ctx.eval("document.body.innerHTML;")
        return body_text
    except Exception as e:
        return jsonify({'error': f'脚本执行失败: {str(e)}'}), 500


def start_flask_server(port=8000):
    print(f"Flask服务器正在运行，访问地址: http://localhost:{port}")
    print("按Ctrl+C停止服务器")
    try:
        webbrowser.open(f"http://localhost:{port}")
    except:
        pass
    app.run(port=port, debug=False)


if __name__ == "__main__":
    start_flask_server()