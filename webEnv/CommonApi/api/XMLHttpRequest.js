const {
    addObjProp,
    setFunctionPrototype,
    getPrivateProp,
    setPrivateProp,
    chalkLog
} = require("../../utility.js");
const XMLHttpRequestEventTarget = require("./XMLHttpRequestEventTarget.js");

function XMLHttpRequest() {
}

addObjProp(XMLHttpRequest, {
    name: 'UNSENT',
    value: 0
});
addObjProp(XMLHttpRequest, {
    name: 'OPENED',
    value: 1
});
addObjProp(XMLHttpRequest, {
    name: 'HEADERS_RECEIVED',
    value: 2
});
addObjProp(XMLHttpRequest, {
    name: 'LOADING',
    value: 3
});
addObjProp(XMLHttpRequest, {
    name: 'DONE',
    value: 4
});

setFunctionPrototype(XMLHttpRequest, () => {
    addObjProp(XMLHttpRequest.prototype, {
        name: 'onreadystatechange',
        get: function onreadystatechange() {
            return getPrivateProp(this, 'onreadystatechange');
        },
        set: function onreadystatechange(value) {
            return setPrivateProp(this, 'onreadystatechange', value);
        }
    });
    addObjProp(XMLHttpRequest.prototype, {
        name: 'readyState',
        get: function readyState() {
            return getPrivateProp(this, 'readyState');
        }
    });
    addObjProp(XMLHttpRequest.prototype, {
        name: 'timeout',
        get: function timeout() {
            return getPrivateProp(this, 'timeout');
        },
        set: function timeout(value) {
            return setPrivateProp(this, 'timeout', value);
        }
    });
    addObjProp(XMLHttpRequest.prototype, {
        name: 'withCredentials',
        get: function withCredentials() {
            return getPrivateProp(this, 'withCredentials');
        },
        set: function withCredentials(value) {
            return setPrivateProp(this, 'withCredentials', value);
        }
    });
    addObjProp(XMLHttpRequest.prototype, {
        name: 'upload',
        get: function upload() {
            return getPrivateProp(this, 'upload');
        }
    });
    addObjProp(XMLHttpRequest.prototype, {
        name: 'responseURL',
        get: function responseURL() {
            return getPrivateProp(this, 'responseURL');
        }
    });
    addObjProp(XMLHttpRequest.prototype, {
        name: 'status',
        get: function status() {
            return getPrivateProp(this, 'status');
        }
    });
    addObjProp(XMLHttpRequest.prototype, {
        name: 'statusText',
        get: function statusText() {
            return getPrivateProp(this, 'statusText');
        }
    });
    addObjProp(XMLHttpRequest.prototype, {
        name: 'responseType',
        get: function responseType() {
            return getPrivateProp(this, 'responseType');
        },
        set: function responseType(value) {
            return setPrivateProp(this, 'responseType', value);
        }
    });
    addObjProp(XMLHttpRequest.prototype, {
        name: 'response',
        get: function response() {
            return getPrivateProp(this, 'response');
        }
    });
    addObjProp(XMLHttpRequest.prototype, {
        name: 'responseText',
        get: function statusText() {
            return getPrivateProp(this, 'responseText');
        }
    });
    addObjProp(XMLHttpRequest.prototype, {
        name: 'UNSENT',
        value: XMLHttpRequest.UNSENT
    });
    addObjProp(XMLHttpRequest.prototype, {
        name: 'OPENED',
        value: XMLHttpRequest.OPENED
    });
    addObjProp(XMLHttpRequest.prototype, {
        name: 'HEADERS_RECEIVED',
        value: XMLHttpRequest.HEADERS_RECEIVED
    });
    addObjProp(XMLHttpRequest.prototype, {
        name: 'LOADING',
        value: XMLHttpRequest.LOADING
    });
    addObjProp(XMLHttpRequest.prototype, {
        name: 'DONE',
        value: XMLHttpRequest.DONE
    });
    addObjProp(XMLHttpRequest.prototype, {name: 'abort'});
    addObjProp(XMLHttpRequest.prototype, {name: 'getAllResponseHeaders'});
    addObjProp(XMLHttpRequest.prototype, {name: 'getResponseHeader'});
    addObjProp(XMLHttpRequest.prototype, {
        name: 'open',
        value: function open(method, url, async, user, password) {
            chalkLog('red', `XMLHttpRequest中open接受的值是：method === ${method}, url === ${url}, async === ${async}, user === ${user},password === ${password}`);
            const open = getPrivateProp(this, 'open');
            if(open){
                open(method, url, async, user, password);
            }else{
                chalkLog('red',"暂未配置open方法，如果需要额外的逻辑处理，可通过setPrivateProp(obj, 'open', fun)进行配置")
            }
        }
    });
    addObjProp(XMLHttpRequest.prototype, {name: 'overrideMimeType'});
    addObjProp(XMLHttpRequest.prototype, {
        name: 'send',
        value: function send(data){
            chalkLog('red',`XMLHttpRequest中send接受的值是：data === ${data}`);
            const send = getPrivateProp(this, 'send');
            if(send){
                send(data);
            }else{
                chalkLog('red',"暂未配置send方法，如果需要额外的逻辑处理，可通过setPrivateProp(obj, 'send', fun)进行配置")
            }
        }
    });
    addObjProp(XMLHttpRequest.prototype, {name: 'setRequestHeader'});
    addObjProp(XMLHttpRequest.prototype, {name: 'abort'});
    addObjProp(XMLHttpRequest.prototype, {
        name: 'constructor',
        value: XMLHttpRequest,
        enumerable: false
    });
    addObjProp(XMLHttpRequest.prototype, {
        name: 'responseXML',
        get: function statusText() {
            return getPrivateProp(this, 'responseXML');
        }
    });
    addObjProp(XMLHttpRequest.prototype, {name: 'setAttributionReporting'});
    addObjProp(XMLHttpRequest.prototype, {name: 'setPrivateToken'});
}, XMLHttpRequestEventTarget);

module.exports = XMLHttpRequest;