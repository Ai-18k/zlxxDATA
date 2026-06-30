import time
from curl_cffi import requests
from loguru import logger
# import requests
from lxml import etree
import subprocess
from functools import partial
subprocess.Popen = partial(subprocess.Popen, encoding='utf-8')
import execjs
cookies = {}
session = requests.Session()


def get_cookies(response):
    tree = etree.HTML(response.text)
    contentStr = tree.xpath('//meta[2]/@content')[0]
    content = f'content="{contentStr}";'


    scriptStr = tree.xpath('//script[1]/text()')[0]
    js_code = session.get(url='https://autopp.tpi.cntaiping.com' + tree.xpath('//script[2]/@src')[0], headers=headers).text
    with open(r'D:\瑞数6\太平洋_rs6\content.js', 'w', encoding='utf-8') as f:
        f.write(content)

    with open(r'D:\瑞数6\太平洋_rs6\core.js', 'w', encoding='utf-8') as f:
        f.write(scriptStr)

    with open(r'D:\瑞数6\太平洋_rs6\ts.js', 'w', encoding='utf-8') as f:
        f.write(js_code)
    logger.info('content/ts/js保存成功！')

    cookies = {
        'xxuhoztF0eZsO':response.cookies.get_dict()['xxuhoztF0eZsO'],
    }
    return cookies


headers = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Pragma": "no-cache",
    "Referer": "https://autopp.tpi.cntaiping.com/web/home/index.html",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
    "sec-ch-ua": "\"Google Chrome\";v=\"137\", \"Chromium\";v=\"137\", \"Not/A)Brand\";v=\"24\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\""
}
url = "https://autopp.tpi.cntaiping.com/web/home/index.html"
response = session.get(url, headers=headers)

logger.info(f'第一次访问状态：{response.status_code}')

cookies = get_cookies(response)

cookies['xxuhoztF0eZsP'] = execjs.compile(open(r'D:\瑞数6\太平洋_rs6\env.js', 'r', encoding='utf-8').read()).call('get_ck')
# print(len(cookies['xxuhoztF0eZsP']))

response = session.get(url, headers=headers, cookies=cookies)
print(response.url)
logger.info(f'第二次访问状态：{response.status_code}')
logger.info(response.text)


