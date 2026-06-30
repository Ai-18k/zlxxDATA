def demo19():
    import asyncio
    import aiohttp
    import random
    import json
    import time
    from lxml import etree
    import ddddocr
    import execjs
    from redis import Redis
    import aiofiles

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

    conn = Redis("127.0.0.1", 10238, 0, "vi4*87taTZBel&DyWL)A", socket_connect_timeout=1170)

    def main_rs_info(rs6):
        html_data = etree.HTML(rs6)
        content = html_data.xpath('//meta[2]/@content')[0]
        ts_js = html_data.xpath('//script[1]/text()')[0]
        return content, ts_js

    async def execjs_data(content, ts_js, session):
        urls = "https://www.creditchina.gov.cn/z9ItHZeV1nhb/0IdCO1Ghjkrh.d07207d.js"
        async with session.get(urls, headers=headers, cookies=cookies) as respones:
            print("execjs_data状态码:", respones.status)
            text = await respones.text()
            with open("execjs_data_error.html", "w", encoding="utf-8") as f:
                f.write(text)
            if respones.status == 200:
                with open("rsdemo.js", mode="r", encoding="utf-8") as f:
                    cookie_doc = f.read().replace('content_code', content).replace("'ts_code'", ts_js).replace(
                        "'functo_code'", text)
                cookie = {
                    "6BVIhF5m7wQjP": execjs.compile(cookie_doc).call("rs6").split(';')[0].split("=")[-1],
                }
                cookies.update(cookie)

    async def demo_1(session):
        while True:
            cookie = {
                "insert_cookie": "25029492",
                "cookienum": cookienum
            }
            url = "https://public.creditchina.gov.cn/private-api/verify/getVerify"
            params = {
                "_v": str(random.random())
            }
            # proxy = "http://E82EF04F:97D673246CD6@tun-igkddr.qg.net:13423"
            proxy = None
            async with session.get(url, headers=headers, cookies=cookie, params=params, proxy=proxy) as response:
                content = await response.read()
                ocr = ddddocr.DdddOcr()
                result = ocr.classification(content)
                print(result.upper())

            url = "https://public.creditchina.gov.cn/private-api/verify/checkVerify"
            params = {
                "_v": str(random.random())
            }
            data = {
                "verifyInput": result.upper()
            }
            async with session.post(url, headers=headers, cookies=cookies, params=params, data=data, proxy=proxy) as response:
                text = await response.text()
                print(text)
                try:
                    response_data = await response.json()
                    if response_data.get("code") == 0 and response_data.get("msg") == "验证成功":
                        print("验证码验证成功！")
                        cookies.update(response.cookies)
                        break
                    else:
                        print("验证码验证失败，重新识别...")
                        await asyncio.sleep(1)
                except Exception as e:
                    print(f"解析响应失败: {e}")
                    await asyncio.sleep(1)

    async def demo_3(company, session, sem):
        url = "https://public.creditchina.gov.cn/private-api/catalogSearchHome"
        params = {
            "tableName": "credit_xyzx_tyshxydm",
            "searchState": "2",
            "keyword": company,
        }
        async with sem:
            try:
                async with session.get(url, headers=headers, cookies=cookies, params=params) as response:
                    if response.status == 200:
                        resp_json = await response.json()
                        data = resp_json["data"]["list"]
                        if data:
                            name = data[0]["name"]
                            code = data[0]["accurate_entity_code"]
                            print("------------------>", name, code)
                            async with aiofiles.open("credit_xyzx_tyshxydm.txt", "a", encoding="utf-8") as f:
                                await f.write(json.dumps({"name": name, "code": code}) + "\n")

                        else:
                            print("不存在！！")
                    elif response.status == 412:
                        text = await response.text()
                        content, ts_js = main_rs_info(text)
                        await execjs_data(content, ts_js, session)
                        await demo_3(company, session, sem)
                    elif response.status == 400:
                        await demo_1(session)
                        await demo_3(company, session, sem)
                    elif response.status == 403:
                        print(response)
                        await asyncio.sleep(10)
                        await demo_3(company, session, sem)
            except Exception as e:
                print(f"demo_3 error: {e}")

    async def get_next_company():
        """获取下一个公司名称"""
        while True:
            try:
                code = conn.lpop("test:test")
                if code is None:
                    await asyncio.sleep(2)
                    continue
                else:
                    company = code.decode("utf-8")
                    print(f"获取到公司: {company}")
                    return company
            except Exception as e:
                print(f"Redis读取错误: {e}")
                await asyncio.sleep(5)

    async def main():
        sem = asyncio.Semaphore(3)  # 控制并发量
        async with aiohttp.ClientSession() as session:
            while True:
                try:
                    # 获取公司名称
                    company = await get_next_company()
                    if company:
                        # 创建任务
                        task = demo_3(company, session, sem)
                        await task
                except Exception as e:
                    print(f"主循环错误: {e}")
                    await asyncio.sleep(5)

    # 运行异步主函数
    asyncio.run(main())