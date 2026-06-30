import re
import subprocess
import time
from curl_cffi import requests


def execute_js_via_pipe(js_code: str):
    """通过管道传递 JavaScript 代码"""

    # 使用管道方式执行
    process = subprocess.Popen(['node'],
                               stdin=subprocess.PIPE,
                               stdout=subprocess.PIPE,
                               stderr=subprocess.PIPE,
                               text=True,
                               encoding='utf-8')

    stdout, stderr = process.communicate(input=js_code)

    return {
        'stdout': stdout,
        'stderr': stderr,
        'returncode': process.returncode
    }



session=requests.Session()
session.impersonate = 'chrome124'
headers = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Pragma": "no-cache",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36",
    "sec-ch-ua": "\"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"144\", \"Google Chrome\";v=\"144\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\""
}

url = "https://fj.189.cn/ic/RechargeIndex"
response = session.get(url, headers=headers)

# print(response.text)
# print(response.cookies.get_dict())
print(response)

_content = ''.join(re.search(r'"KrwhDtI7LTJG" content="(.*?)"', response.text).groups())
_ts1 = re.search(r"\$_ts=window.*_ts.lcd\(\);", response.text, re.DOTALL).group(0)
print(_content, _ts1,sep="\n")


with open("content.js", "w", encoding="utf-8") as f:
    f.write(f'content="{_content}"')

with open("ts.js", "w", encoding="utf-8") as f:
    f.write(_ts1)

time.sleep(1)
with open("env.js", "r", encoding="utf-8") as f:
    js_code = f.read()


res=execute_js_via_pipe(js_code)
print(res['stdout'])
session.cookies.update({'l3KivyH2h0m6T': res['stdout'].strip()})


response2 = session.get(url, headers=headers)

# print(response2.text[:1000])
print(response2)
