import requests
import hashlib
import math
import uuid

def rpc_test(arg, arg1, content):
    data = {
        "group": "rs_test",
        "action": "rs_ajax",
        "arg": arg,
        "arg1": arg1,
        "arg2": content
    }
    res = requests.get("http://127.0.0.1:5620/business-demo/invoke", params=data)
    return res.json()

def rpc_send_chunk(ts_code: str, url: str, chunk_id: str, seq: int, total: int, chunk: str):
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

def send_long_text(ts_code: str, url: str, text: str, chunk_size: int = 800):
    if not text:
        return rpc_test(ts_code, url, "")
    chunk_id = uuid.uuid4().hex
    total = math.ceil(len(text) / chunk_size)
    last_resp = None
    for i in range(total):
        start = i * chunk_size
        end = start + chunk_size
        piece = text[start:end]
        last_resp = rpc_send_chunk(ts_code, url, chunk_id, i + 1, total, piece)
    return last_resp

# 读取文件内容
# with open("ts.js", "r", encoding="utf-8") as f:
#     ts = f.read()

with open("encode.js", "r", encoding="utf-8") as f1:
    ts = f1.read()
#     print(len(encodejs))
encodejs="/z5gPWiiwO6ht/2HA1rNA9S1Ml.b4c45da.js"

#长度控制在1690
text = "5y8Dy5avdvC1eeLkS0jNkWTZYtq.6gGGTiZEG3e1asR95W3WQ0DLPv3RWeyAONvU8ZnW8EhdaWOcam2XMiQrtq"

print("\n调用 RPC 接口（分片发送长文本）...")
resp = send_long_text(ts, encodejs, text, chunk_size=800)
print(resp)


