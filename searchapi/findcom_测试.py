import json
import random

import ddddocr
import execjs
import requests
from lxml import etree
from redis.client import Redis

ocr = ddddocr.DdddOcr()

def demo18():
    """
    高效批量处理Redis队列中的公司名，查询接口并写入结果文件。
    使用线程池并发处理，提升效率。
    """

    cookienum = str(random.random())
    headers = {
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "DNT": "1",
        "Origin": "https://www.creditchina.gov.cn",
        "Pragma": "no-cache",
        "Referer": "https://www.creditchina.gov.cn/",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
        "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\""
    }
    cookies = {
        "cookienum": cookienum,
        "6BVIhF5m7wQjO": "60vAiaCE31EZJDWJzYa.oLt0ghwACxYfy2HdfEF9fOEmUtMurYazB3tgOmOvoO6w73dYf6R32wkaprIvkXR9SA3G"
    }

    def main_rs_info(rs6):
        html_data = etree.HTML(rs6)
        content = html_data.xpath('//meta[2]/@content')[0]
        ts_js = html_data.xpath('//script[1]/text()')[0]
        jsurl = html_data.xpath('//script[2]/@src')[0]
        return content, ts_js

    def execjs_data(content, ts_js):
        urls = "https://www.creditchina.gov.cn/z9ItHZeV1nhb/0IdCO1Ghjkrh.d07207d.js"
        respones = requests.get(url=urls, headers=headers, cookies=cookies)
        print("execjs_data状态码:", respones)
        if respones.status_code == 200:
            with open("rsdemo.js", mode="r", encoding="utf-8") as f:
                cookie_doc = f.read().replace('content_code', content).replace("'ts_code'", ts_js).replace(
                    "'functo_code'", respones.text)  # '"function_code"' 记一下
            cookie = {
                "6BVIhF5m7wQjP": execjs.compile(cookie_doc).call("rs6").split(';')[0].split("=")[-1],  # 瑞数 的 cookie
            }
            cookies.update(cookie)

    def demo_1():
        while True:
            cookie = {
                "insert_cookie": "25029492",
                "cookienum": cookienum
            }
            url = "https://public.creditchina.gov.cn/private-api/verify/getVerify"
            params = {
                "_v": str(random.random())
            }
            response = requests.get(url, headers=headers, cookies=cookie, params=params,proxies={
                    "http": "http://E82EF04F:97D673246CD6@tun-igkddr.qg.net:13423",
                    # "https": "http://E82EF04F:97D673246CD6@tun-igkddr.qg.net:13423"
                })
            # image = Image.open(BytesIO(response.content))
            # image.show()
            result = ocr.classification(response.content)
            print(result.upper())
            url = "https://public.creditchina.gov.cn/private-api/verify/checkVerify"
            params = {
                "_v": str(random.random())
            }
            data = {
                "verifyInput": result.upper()
            }
            response = requests.post(url, headers=headers, cookies=cookies, params=params, data=data,proxies={
                    "http": "http://E82EF04F:97D673246CD6@tun-igkddr.qg.net:13423"
                })
            print(response.text)
            # 检查验证码是否验证成功
            try:
                response_data = response.json()
                if response_data.get("code") == 0 and response_data.get("msg") == "验证成功":
                    print("验证码验证成功！")
                    cookies.update(response.cookies)
                    break  # 验证成功，跳出循环
                else:
                    print("验证码验证失败，重新识别...")
                    time.sleep(1)  # 等待1秒后重新识别
            except Exception as e:
                print(f"解析响应失败: {e}")
                time.sleep(1)  # 等待1秒后重新识别

    @retry(wait_fixed=1000, stop_max_attempt_number=3)
    def demo_3(company):
        url = "https://public.creditchina.gov.cn/private-api/catalogSearchHome"
        params = {
            "tableName": "credit_xyzx_tyshxydm",
            "searchState": "2",
            "keyword": company,
        }
        response = requests.get(url, headers=headers, cookies=cookies, params=params)
        if response.status_code == 200:
            data = response.json()["data"]["list"]
            if data:
                name = data[0]["accurate_entity_name"]
                code = data[0]["accurate_entity_code"]
                print("------------------>", name, code)
                with open("credit_xyzx_tyshxydm.txt", "a", encoding="utf-8") as f:
                    f.write(json.dumps({"name": name, "code": code},ensure_ascii=False) + "\n")
            else:
                print("不存在！！")
        elif response.status_code == 412:
            content, ts_js = main_rs_info(response.text)
            execjs_data(content, ts_js)
            demo_3(company)
        elif response.status_code == 400:
            demo_1()
            return demo_3(company)
        elif response.status_code == 403:
            print(response)
            time.sleep(10)
            return demo_3(company)

    conn = Redis("127.0.0.1", 10238, 0, "vi4*87taTZBel&DyWL)A", socket_connect_timeout=1170)
    import time

    def demo_4():
        # while True:
        #     code = conn.lpop("test:test")
        #     if code is None:
        #         time.sleep(2)
        #     else:
        #         print(code.decode("utf-8"))
        #         yield code.decode("utf-8")
        for i in [
            "91330304MAEL9F0R2W",
            "91370800MAEP6YR371",
            "91371000MAEMAR2T09",
            "91371621MAENC44U0C",
            "91360981MAEH5FRN69",
        ]:
            yield i

    for code in demo_4():
        demo_3(code)