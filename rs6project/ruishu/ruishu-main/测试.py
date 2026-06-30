import requests


headers = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Connection": "keep-alive",
    "Content-Type": "application/json;charset=utf-8",
    "Referer": "https://autopp.tpi.cntaiping.com/web/home/index.html",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
    "appId": "NPC001",
    "reqTimestamp": "20250624093857",
    "sec-ch-ua": "\"Chromium\";v=\"135\", \"Not-A.Brand\";v=\"8\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "signature": "DC003DD33D2D1410FBF10FD03FCD0BDF"
}
cookies = {
    "xxuhoztF0eZsO": "600kbPqbKuOIaiQkZ_ueaWiSEgIEuEXfQrqss5ymVeP98QAvav9heQaE_bsurHN6ZXa.Aonh4Q3iUdZmrYm7cJ3q",
    "xxuhoztF0eZsP": "0WcLehCzFmvbkDiKaa3YCVzV4c8Dm_3dqUWwh2p0lQ9OwFOMB7dkdMlUmfQ.KMxskcVBnYHSNRDk6Qm9RVNRmbF.szNLcvkJXVqkO7if9Bw.9RzrpFt.L1oj8fuJXnrolCoUjPJF6VYfCRAGBpmvBZDRAH.fxHAnHtplx5E87AvF1OHA6plrSS6p9QNq4bb9NRrnGT2BcSzngRWF7QkkbJQqukFVWluotSOfUYBX0hTeWIGzNXbEOGBJVUuqURaAqT3dzJDGaKltQ13YiagR70yD0_FyF.iFBXKsyvtNxit8EGrLHtKjxtCLdaKGMgQzUk.Mb3OoiG_Bk9NrI5p8wKjvmOzN5uOnJOFg0FN7BxLm7xe8fZOfbWQCxY2tPo2g2Vr4z9UD.yd8urrLCFW4s8D4GjNiVsUT3OLo0MdUtdQS.OzakZYIWxpoSm1pH3.o0Hni5XN9ByU6VIUk7fbTUoq"
}
url = "https://autopp.tpi.cntaiping.com/api/system/jwt/verifyCode/91989a_65e1_3b90_89c6_5c5ef09f"
params = {
    "fN4B1rBS": "0WuEpzalqWtasd0KDqglof5x8PchmVShQnUKi4lZLLAXE8IcjmCKtdlgh9cWfSk0P32rA9ABIRcqi13rAiuuClyfmihSMPhetRslzOR4cPhv27oaErye_2a"
}
response = requests.get(url, headers=headers, cookies=cookies, params=params)

print(response.text)
print(response)