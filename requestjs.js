// ==UserScript==
// @name         rs_环境检测
// @namespace    http://tampermonkey.net/
// @version      2025-10-28
// @description  try to take over the world!
// @author       You
// @match        http://epub.cnipa.gov.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=epub.cnipa.gov.cn
// @grant        none
// ==/UserScript==



(function() {
    // 'use strict';
function SekiroClient(e) {
    if (this.wsURL = e, this.handlers = {},
    this.socket = {},
    !e) throw new Error("wsURL can not be empty!!");
    this.webSocketFactory = this.resolveWebSocketFactory(),
    this.connect()
}
SekiroClient.prototype.resolveWebSocketFactory = function() {
    if ("object" == typeof window) {
        var e = window.WebSocket ? window.WebSocket: window.MozWebSocket;
        return function(o) {
            function t(o) {
                this.mSocket = new e(o)
            }
            return t.prototype.close = function() {
                this.mSocket.close()
            },
            t.prototype.onmessage = function(e) {
                this.mSocket.onmessage = e
            },
            t.prototype.onopen = function(e) {
                this.mSocket.onopen = e
            },
            t.prototype.onclose = function(e) {
                this.mSocket.onclose = e
            },
            t.prototype.send = function(e) {
                this.mSocket.send(e)
            },
            new t(o)
        }
    }
    if ("object" == typeof weex) try {
        console.log("test webSocket for weex");
        var o = weex.requireModule("webSocket");
        return console.log("find webSocket for weex:" + o),
        function(e) {
            try {
                o.close()
            } catch(e) {}
            return o.WebSocket(e, ""),
            o
        }
    } catch(e) {
        console.log(e)
    }
    if ("object" == typeof WebSocket) return function(o) {
        return new e(o)
    };
    throw new Error("the js environment do not support websocket")
},
SekiroClient.prototype.connect = function() {
    console.log("sekiro: begin of connect to wsURL: " + this.wsURL);
    var e = this;
    try {
        this.socket = this.webSocketFactory(this.wsURL)
    } catch(o) {
        return console.log("sekiro: create connection failed,reconnect after 2s:" + o),
        void setTimeout(function() {
            e.connect()
        },
        2e3)
    }
    this.socket.onmessage(function(o) {
        e.handleSekiroRequest(o.data)
    }),
    this.socket.onopen(function(e) {
        console.log("sekiro: open a sekiro client connection")
    }),
    this.socket.onclose(function(o) {
        console.log("sekiro: disconnected ,reconnection after 2s"),
        setTimeout(function() {
            e.connect()
        },
        2e3)
    })
},
SekiroClient.prototype.handleSekiroRequest = function(e) {
    console.log("receive sekiro request: " + e);
    var o = JSON.parse(e),
    t = o.__sekiro_seq__;
    if (o.action) {
        var n = o.action;
        if (this.handlers[n]) {
            var s = this.handlers[n],
            i = this;
            try {
                s(o,
                function(e) {
                    try {
                        i.sendSuccess(t, e)
                    } catch(e) {
                        i.sendFailed(t, "e:" + e)
                    }
                },
                function(e) {
                    i.sendFailed(t, e)
                })
            } catch(e) {
                console.log("error: " + e),
                i.sendFailed(t, ":" + e)
            }
        } else this.sendFailed(t, "no action handler: " + n + " defined")
    } else this.sendFailed(t, "need request param {action}")
},
SekiroClient.prototype.sendSuccess = function(e, o) {
    var t;
    if ("string" == typeof o) try {
        t = JSON.parse(o)
    } catch(e) { (t = {}).data = o
    } else "object" == typeof o ? t = o: (t = {}).data = o; (Array.isArray(t) || "string" == typeof t) && (t = {
        data: t,
        code: 0
    }),
    t.code ? t.code = 0 : (t.status, t.status = 0),
    t.__sekiro_seq__ = e;
    var n = JSON.stringify(t);
    console.log("response :" + n),
    this.socket.send(n)
},
SekiroClient.prototype.sendFailed = function(e, o) {
    "string" != typeof o && (o = JSON.stringify(o));
    var t = {};
    t.message = o,
    t.status = -1,
    t.__sekiro_seq__ = e;
    var n = JSON.stringify(t);
    console.log("sekiro: response :" + n),
    this.socket.send(n)
},
SekiroClient.prototype.registerAction = function(e, o) {
    if ("string" != typeof e) throw new Error("an action must be string");
    if ("function" != typeof o) throw new Error("a handler must be function");
    return console.log("sekiro: register action: " + e),
    this.handlers[e] = o,
    this
};
function guid() {
    function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
// 连接服务端
var client = new SekiroClient("ws://127.0.0.1:5620/business-zlssSpider/register?group=rs_test&clientId="+guid());
// 业务接口
client.registerAction("rs_ajax",function(request, resolve, reject){
    var ts_code = request['arg']
    var url = request['arg1']
    var content = request['arg2']

    // 分片接收与聚合
    var chunk_id = request['chunk_id']
    var seq = request['seq']
    var total = request['total']
    var chunk = request['chunk']

    if (chunk_id) {
        // 初始化缓冲区
        if (!window.__chunkStore) {
            window.__chunkStore = {}
        }
        if (!window.__chunkStore[chunk_id]) {
            window.__chunkStore[chunk_id] = { parts: [], received: 0, total: 0 }
        }
        var bucket = window.__chunkStore[chunk_id]
        var s = parseInt(seq || '0', 10)
        var t = parseInt(total || '0', 10)
        if (t > 0) bucket.total = t
        if (s > 0) {
            // 仅在第一次写入该序号时计数
            if (!bucket.parts[s - 1]) {
                bucket.received += 1
            }
            bucket.parts[s - 1] = chunk || ''
        }
        // 未接收完整，返回进度
        if (!(bucket.total > 0 && bucket.received >= bucket.total)) {
            resolve(JSON.stringify({ status: 0, message: 'chunk ok', received: bucket.received, total: bucket.total }))
            return
        }
        // 已接收完整，拼接得到完整 content
        try {
            content = bucket.parts.join('')
        } catch (e) {
            reject('分片拼接失败: ' + e)
            return
        } finally {
            // 释放内存
            delete window.__chunkStore[chunk_id]
        }
    }

    function get_code(url) {
      return fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'Accept-Language': 'zh-CN,zh;q=0.9',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36'
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .catch(error => {
        console.error('请求失败:', error);
        throw error;
      });
    }


    // 异步获取代码并执行（此时 content 可能来自分片聚合）
    get_code(url).then(function(functo_code) {
        // 构建要执行的代码字符串：先定义变量，然后执行代码
        var codeToEval = ts_code + '\n' +functo_code + '\n' +'function get_cookies() { return document.cookie; }';
        // 执行代码
        console.log(functo_code)
        eval(codeToEval);
        // 获取 cookies
        var cookies = get_cookies();
        resolve(cookies);
    }).catch(function(error) {
        reject('获取代码失败: ' + error);
    });
})
})();







