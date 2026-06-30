"""
@FileName：PikaUse.py
@Description：优化版MQ发送工具，支持连接复用和批量发送
@Author：18k
@Time：2024/6/14 17:15
@Department：部门
@Website：站点
@Copyright：©2019-2024 职业
:return:
"""

import json
import pika
import threading
import time
from loguru import logger
from typing import List, Dict,Optional

from pymongo import MongoClient


class MQConnectionPool:
    """全局MQ连接池管理器 - 所有线程共享一个连接"""

    # 队列名称映射
    QUEUE_MAPPING = {
        0: 'qqbx.dc.company',
        1: 'qqbx.dc.industry',
        2: 'qqbx.dc.qualification',
        3: 'qqbx.dc.judicial',
        4: 'qqbx.dc.property',
        5: 'qqbx.dc.licence',
        6: 'qqbx.dc.certificate',
        7: 'qqbx.dc.shareholderInfo'
    }

    # MongoDB集合映射
    COLLECTION_MAPPING = {}

    def __init__(self, host='139.9.70.234', port=5672, username='user', password='user123',
                 virtual_host='/'):
        self.host = host
        self.port = port
        self.username = username
        self.password = password
        self.virtual_host = virtual_host
        self._lock = threading.Lock()  # 保护连接和通道的锁
        self._connection: Optional[pika.BlockingConnection] = None
        self._channels: Dict[str, pika.channel.Channel] = {}
        self._closed = False
        self._init_mongodb_collections()

    def _init_mongodb_collections(self):
        """初始化MongoDB集合"""
        try:
            client = MongoClient(host='192.168.5.167', port=27017)
            db = client["fail_MQ"]
            self.COLLECTION_MAPPING = {
                0: db["fail_MQ_company"],
                1: db["fail_MQ_company_with"],
                2: db["fail_MQ_qualification"],
                3: db["fail_MQ_judicial"],
                4: db["fail_MQ_property"],
                5: db["fail_MQ_licence"],
                6: db["fail_MQ_certificate"],
                7: db["fail_MQ_shareholderInfo"]
            }
        except Exception as e:
            logger.error(f"初始化MongoDB集合失败: {e}")

    def _create_connection(self):
        """创建新的MQ连接"""
        credentials = pika.PlainCredentials(self.username, self.password)
        parameters = pika.ConnectionParameters(
            host=self.host,
            port=self.port,
            virtual_host=self.virtual_host,
            credentials=credentials,
            socket_timeout=10,
            heartbeat=60,  # 60秒心跳，保持连接活跃
            blocked_connection_timeout=300,
            connection_attempts=3,
            retry_delay=2,
            stack_timeout=20
        )
        try:
            connection = pika.BlockingConnection(parameters)
            logger.info("创建RabbitMQ连接成功")
            return connection
        except Exception as e:
            logger.error(f"创建RabbitMQ连接失败: {e}")
            raise

    def _ensure_connection(self):
        """确保连接存在且有效（必须在锁保护下调用）"""
        if self._closed:
            raise RuntimeError("连接池已关闭")

        if self._connection is None or self._connection.is_closed:
            # 关闭旧的通道
            for channel in self._channels.values():
                try:
                    if not channel.is_closed:
                        channel.close()
                except:
                    pass
            self._channels.clear()

            # 创建新连接
            self._connection = self._create_connection()
            logger.info("重新创建RabbitMQ连接")

    def _get_channel(self, queue_name: str) -> pika.channel.Channel:
        """获取指定队列的通道（线程安全）"""
        with self._lock:
            if self._closed:
                raise RuntimeError("连接池已关闭")

            # 确保连接有效
            if self._connection is None or self._connection.is_closed:
                self._ensure_connection()

            # 检查通道是否存在且有效
            if queue_name in self._channels:
                channel = self._channels[queue_name]
                try:
                    if channel.is_closed:
                        # 通道已关闭，重新创建
                        del self._channels[queue_name]
                    else:
                        return channel
                except Exception:
                    # 通道可能已损坏，删除并重新创建
                    del self._channels[queue_name]

            # 创建新通道
            try:
                channel = self._connection.channel()
                channel.queue_declare(queue=queue_name, durable=True)
                self._channels[queue_name] = channel
                logger.debug(f"为队列 {queue_name} 创建channel成功")
                return channel
            except Exception as e:
                logger.error(f"创建channel失败: {e}")
                # 如果连接已关闭，尝试重新连接
                if self._connection.is_closed:
                    self._ensure_connection()
                    channel = self._connection.channel()
                    channel.queue_declare(queue=queue_name, durable=True)
                    self._channels[queue_name] = channel
                    return channel
                raise

    def publish(self, flg: int, item_info: List[Dict]) -> bool:
        """发布消息到MQ（线程安全）"""
        if flg not in self.QUEUE_MAPPING:
            logger.error(f"无效的flg值: {flg}，有效范围: 0-7")
            return False

        queue_name = self.QUEUE_MAPPING[flg]
        max_retries = 3

        for attempt in range(max_retries):
            try:
                # 使用锁保护发布操作
                with self._lock:
                    if self._closed:
                        raise RuntimeError("连接池已关闭")

                    # 确保连接有效
                    if self._connection is None or self._connection.is_closed:
                        self._ensure_connection()

                    # 获取或创建通道
                    if queue_name in self._channels:
                        channel = self._channels[queue_name]
                        try:
                            if channel.is_closed:
                                del self._channels[queue_name]
                                channel = None
                        except Exception:
                            del self._channels[queue_name]
                            channel = None
                    else:
                        channel = None

                    if channel is None:
                        channel = self._connection.channel()
                        channel.queue_declare(queue=queue_name, durable=True)
                        self._channels[queue_name] = channel

                    # 发布消息
                    channel.basic_publish(
                        exchange='',
                        routing_key=queue_name,
                        body=json.dumps(item_info, ensure_ascii=False),
                        properties=pika.BasicProperties(
                            delivery_mode=2,  # 消息持久化
                        )
                    )
                return True

            except (pika.exceptions.AMQPConnectionError,
                    pika.exceptions.StreamLostError,
                    pika.exceptions.ConnectionClosed,
                    pika.exceptions.ChannelClosed,
                    OSError) as e:
                logger.warning(f"发送消息失败（尝试 {attempt + 1}/{max_retries}）: {e}")

                # 清除连接和通道，下次会自动重建
                with self._lock:
                    if queue_name in self._channels:
                        try:
                            if not self._channels[queue_name].is_closed:
                                self._channels[queue_name].close()
                        except:
                            pass
                        del self._channels[queue_name]

                    if self._connection and self._connection.is_closed:
                        self._connection = None

                if attempt == max_retries - 1:
                    logger.error(f"发送消息到队列 {queue_name} 失败，已重试 {max_retries} 次")
                    return False
                else:
                    time.sleep(0.5 * (attempt + 1))

            except Exception as e:
                logger.error(f"发送消息到队列 {queue_name} 失败: {e}")
                return False

        return False

    def save_to_mongodb(self, flg: int, item_info: List[Dict]):
        """保存失败的数据到MongoDB"""
        try:
            collection = self.COLLECTION_MAPPING.get(flg)
            if collection is None:
                logger.warning(f"未找到flg={flg}对应的MongoDB集合")
                return

            def remove_id(data):
                """移除_id字段，避免重复键错误"""
                if isinstance(data, dict):
                    data = data.copy()
                    data.pop('_id', None)
                return data

            if item_info:
                clean_items = [remove_id(i) for i in item_info]
                try:
                    collection.insert_many(clean_items, ordered=False)
                    logger.warning(f"flg={flg} 批量数据({len(clean_items)}条)保存到MongoDB失败集合")
                except Exception as insert_error:
                    # 如果批量插入失败，尝试逐条插入
                    success_count = 0
                    for clean_item in clean_items:
                        try:
                            collection.insert_one(clean_item)
                            success_count += 1
                        except Exception as single_error:
                            if 'duplicate key' in str(single_error).lower() or 'E11000' in str(single_error):
                                logger.debug(f"数据已存在，跳过: {single_error}")
                            else:
                                logger.error(f"保存单条数据失败: {single_error}")
                    if success_count > 0:
                        logger.warning(f"flg={flg} 部分数据({success_count}/{len(clean_items)}条)保存到MongoDB失败集合")
        except Exception as e:
            logger.error(f"保存数据到MongoDB失败: {e}")

    def close(self):
        """关闭所有连接和通道"""
        with self._lock:
            if self._closed:
                return

            self._closed = True

            # 关闭所有通道
            for queue_name, channel in self._channels.items():
                try:
                    if not channel.is_closed:
                        channel.close()
                    logger.debug(f"关闭通道: {queue_name}")
                except Exception as e:
                    logger.error(f"关闭通道 {queue_name} 时出错: {e}")
            self._channels.clear()

            # 关闭连接
            if self._connection and not self._connection.is_closed:
                try:
                    self._connection.close()
                    logger.info("RabbitMQ连接已关闭")
                except Exception as e:
                    logger.error(f"关闭连接时出错: {e}")

            self._connection = None

    def __del__(self):
        """析构函数，确保资源释放"""
        try:
            self.close()
        except:
            pass


