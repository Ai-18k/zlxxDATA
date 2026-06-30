import requests
import subprocess
from lxml import etree


with open('0_demo.js', 'r', encoding='utf-8') as f:
    js_code = f.read()


headers = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Pragma": "no-cache",
    "Referer": "http://www.ccgp-jiangxi.gov.cn/web/",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36"
}
url = "http://www.ccgp-jiangxi.gov.cn/web/"
response = requests.get(url, headers=headers)
print(response)

name, value = response.headers['set-cookie'].split('; Path')[0].split('=', 1)
cookies = {
    name: value
}

html = etree.HTML(response.text)
content = html.xpath('//meta[@id="7jldb1RArSsa"]/@content')[0]
ts = html.xpath('//script')[0].text
js_file = 'http://www.ccgp-jiangxi.gov.cn' + html.xpath('//script')[1].attrib['src']
function_call = html.xpath('//script')[2].text

response = requests.get(js_file, headers=headers)
js_file = response.text

js_code = js_code.replace('占位符content', content).replace('占位符ts', ts).replace('占位符jsfile', js_file)
# .replace('占位符function_call', function_call))

with open('当前.js', 'w', encoding='utf-8') as f:
    f.write(js_code)

result = subprocess.run(['node', './当前.js'], capture_output=True, text=True)
name, value = result.stdout.split('; path')[0].split('=', 1)
cookies[name] = value

print(cookies)
response = requests.get(url, headers=headers, cookies=cookies)

print(response)
