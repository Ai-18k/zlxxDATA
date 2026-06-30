import json
import threading
from typing import Optional

import requests
import retrying
from loguru import logger
from lxml import etree
import re
import execjs
from concurrent.futures import ThreadPoolExecutor, as_completed
from tqdm import tqdm
from pymongo import ASCENDING,errors
from PikaUse import MQConnectionPool
from config import Config


session = requests.session()


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

    @retrying.retry(wait_fixed=5)
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
        max_workers = 10  # 最大线程数
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            while page <= total_pages:
                futures = []
                # 动态调整线程数，确保不超过总页数
                current_workers = min(max_workers, total_pages - page + 1)
                for _ in range(current_workers):
                    future = executor.submit(self.fetch_page, company, page)
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

            while True:
                comp = self.local_conn.lpop(self.comp_key)
            # with open(r"C:\Users\Administrator\Desktop\company\__0.json","r", encoding="utf-8") as f:
            #     datas=json.loads(f.read())
            #     for comp in datas:
                # if not comp:
                #     break  # 如果没有更多公司，退出循环
                # comp_name = comp.decode()
                print(comp)
                comp_name=comp["company_name"]
                try:
                    # self.zlxx_filter_key.insert_one({"company": comp_name})
                    if comp_name in processed_companies:
                        pass
                        # continue  # 如果公司已经处理过，跳过
                    else:
                        self.processed_ids.add(comp_name)
                        processed_companies.add(comp_name)  # 记录已处理的公司
                        flist.append(executor.submit(self.spider, comp_name))
                        _ += 1
                        if len(flist) >= 5:
                            for future in as_completed(flist):
                                future.result()
                            flist.clear()  # 清空已完成的任务列表
                        print(f"这是第 【{_}】 家公司！！")
                except errors.DuplicateKeyError:
                    logger.warning(f"【*】专利已过滤:{comp_name}")

            for future in flist:
                future.result()


if __name__ == '__main__':
    Patentspider("fujian").main()























