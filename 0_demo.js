console.log = function(){};

// 工具，hook
!function (){
    delete global;
    delete Buffer;
    delete process;
    delete setImmediate;
    delete clearImmediate;
    exports = undefined;
    module = undefined;

    let proxy_config = {
        // 取某个对象的特定属性时断住
        debugger_attr: '',
        debugger_name: "",
        // 打印时排除无价值信息，根据属性名排除
        exclude_array_attr: ["Math", "isNaN", "encodeURI", "Uint8Array", "Float32Array", "ArrayBuffer", "Float32Array", "Uint32Array", "Int32Array", "Int16Array", "JSON", "Symbol", "Promise", "Float64Array", "Uint16Array", "Int8Array", "Array", "valueOf", "setPrototypeOf", "defineProperty", Symbol.hasInstance, Symbol.toPrimitive, Symbol.toStringTag, "is_debug"],
        // 常见的浏览器环境没有，但其他环境有的环境检测变量名，会提示浏览器不存在
        browserless_array: ['Dispatch', '__VUE_DEVTOOLS_GLOBAL_HOOK__', 'standalone', 'QObject', 'CSSValueList', 'ClientRectList', 'PaintRequestList', 'SVGPathSegList', 'ActiveXObject', 'rawWindow', 'callPhantom', '_phantom', 'mozPaintCount', 'mozInnerScreenX', 'Debug', 'WebKitPlaybackTargetAvailabilityEvent', 'attachEvent', '__wxjs_environment', '__wxWebEnv', '__wxjs_is_wkwebview', 'WeixinJSBridge', 'aef', 'AlipayJSBridge', '_mqqWebViewJSInterface', 'qb_Notify', 'ApplePaySession', 'ApplePayError', 'ucapi', 'UCCoreJava', 'oscpu', 'ClientUtils', 'sampleContent', 'webkitConnection', 'mozConnection'],
        // 打印时排除无价值信息，根据对象和属性名排除
        exclude_array: ["document.createElement('div').childNodes"]
    }
    watch = function (obj, name){
        return new Proxy(obj, {
            get(target, p, receiver){
                // 断住
                if (proxy_config.debugger_attr && p === proxy_config.debugger_attr && name === proxy_config.debugger_name){
                    debugger;
                }
                // 不进行打印的属性名
                if (proxy_config.exclude_array_attr.indexOf(p) !== -1){
                    return target[p];
                // 不进行打印的取值操作
                } else if (typeof p !== 'symbol' && proxy_config.exclude_array.indexOf(name+'.'+p) !== -1){
                    return target[p];
                // 打印提示
                } else if (proxy_config.browserless_array.indexOf(p) !== -1) {
                    let val = target[p];
                    console.log('取值: (浏览器环境不存在) ',name, '.', p, ' =>', val);
                    return val;
                // 正常打印
                } else {
                    let val = target[p];
                    try {
                        console.log('取值:', name, '.', p, ' =>', val);
                    } catch (e){
                        console.log('取值:', name, '.', p, ' =>', val+'');
                    }
                    return val;
                }
            },
            set(target, p, value, receiver){
                if (proxy_config.debugger_attr && p === proxy_config.debugger_attr && name === proxy_config.debugger_name){
                    debugger;
                }
                let val = target[p];
                console.log('设置值:', name, '.', p, '=', value, '<==', val);
                // return target[p] = value;
                return Reflect.set(...arguments);
            }
        })
    }

    set_func_name = function(func, name){
        Object.defineProperty(func, 'name', {
            configurable: true,
            value: name
        });
    }

    // 设置 toString 名称
    set_toString = function (obj, s){
        Object.defineProperty(obj, Symbol.toStringTag, {
            value: s,
            configurable: true
        });
    }

    // 设置属性为不可枚举
    let set_native = function set_native(func, key, value) {
        Object.defineProperty(func, key, {
            "enumerable": false,
            'configurable': true,
            'writable': true,
            'value': value
        })
    }

    // function 补 toString
    let toString_ = Function.prototype.toString;
    let my_symbol = Symbol('(HD 236300)_' + Math.random());
    // 调用此方法为函数设置 myFunction_toString_symbol 属性
    set_func_native = (func) => {
        set_native(func, my_symbol, `function ${func.name || ''}() { [native code] }`);
    }
    // 重写的 toString 方法，如果 this 拥有 my_symbol 属性，则返回 native code
    let toString = function toString() {
        return typeof this == 'function' && this[my_symbol] || toString_.call(this);
    }

    delete Function.prototype.toString;
    // 重写原型上的 toString
    set_native(Function.prototype, 'toString', toString);
    // 套娃给 toString 方法设置一个 toString
    set_func_native(Function.prototype.toString);
    // 删除 toString 的原型
    Function.prototype.toString.prototype = undefined;

    set_getter = function (obj, attr, val){
        Object.defineProperty(obj, attr, {
            configurable: true,
            enumerable: true,
            get: function (){
                return val;
            }
        })
    }

    let obj_to_str = Object.prototype.toString;
    Object.prototype.toString = function toString(){
        let res = obj_to_str.call(this, ...arguments);
        console.log(`调用 ==> Object.prototype.toString ==> `, this, '==>', res);
        return res;
    }; set_func_native(Object.prototype.toString);

    let func_to_str = Function.prototype.toString;
    Function.prototype.toString = function toString(){
        let res = func_to_str.call(this, ...arguments);
        console.log(`调用 ==> Function.prototype.toString ==> `, this, '==>', res);
        return res;
    }; set_func_native(Function.prototype.toString);

    let getOwnPropertyNames_ = Object.getOwnPropertyNames;
    Object.getOwnPropertyNames = function getOwnPropertyNames(obj){
        console.log("调用 ==> Object.getOwnPropertyNames ==> ", obj);
        return getOwnPropertyNames_(obj);
    }

    let keys_ = Object.keys;
    Object.keys = function keys(obj){
        console.log("调用 ==> Object.keys ==> ", obj);
        return keys_(obj);
    }

    let getOwnPropertyDescriptor_ = Object.getOwnPropertyDescriptor;
    Object.getOwnPropertyDescriptor = function getOwnPropertyDescriptor(obj, attr){
        console.log("调用 ==> Object.getOwnPropertyDescriptor ==> ", obj, attr);
        if (obj === navigator){
            return undefined;
        }
        if (obj === navigator.__proto__ && attr === 'webdriver'){
            let get = function(){};
            set_func_name(get, 'get webdriver'); set_func_native(get);
            return watch({
                get: watch(get, `Object.getOwnPropertyDescriptor(navigator.__proto__).get`)
            }, `Object.getOwnPropertyDescriptor(navigator.__proto__)`);
        }
        return getOwnPropertyDescriptor_(obj, attr);
    }

    let getOwnPropertyDescriptors_ = Object.getOwnPropertyDescriptors;
    Object.getOwnPropertyDescriptors = function getOwnPropertyDescriptors(obj){
        console.log("调用 ==> Object.getOwnPropertyDescriptors ==> ", obj);
        if (obj === Navigator.prototype){
            let get_vendor = function(){};
            let get_languages = function(){};
            set_func_name(get_vendor, "get vendor"); set_func_native(get_vendor);
            set_func_name(get_languages, "get languages"); set_func_native(get_languages);
            return watch({
                "vendor": watch({
                    "enumerable": true,
                    "configurable": true,
                    "get": watch(get_vendor, `Object.getOwnPropertyDescriptors(Navigator.prototype).vendor.get`)
                }, `Object.getOwnPropertyDescriptors(Navigator.prototype).vendor`),
                "languages": watch({
                    "enumerable": true,
                    "configurable": true,
                    "get": watch(get_languages, `Object.getOwnPropertyDescriptors(Navigator.prototype).languages.get`)
                }, `Object.getOwnPropertyDescriptors(Navigator.prototype).languages`)
            }, `Object.getOwnPropertyDescriptors(Navigator.prototype)`);
        }
        return getOwnPropertyDescriptors_(obj);
    }

    // let eval_ = eval;
    // eval = function eval(str){
    //     str = str.replaceAll('debugger');
    //     eval_(str);
    // }; set_func_native(eval);
}();


// 对象
!function(){
    const v8 = require("v8");
    const vm = require("vm");
    // 允许使用 V8 内置函数（需启用 --allow-natives-syntax 标志）
    v8.setFlagsFromString("--allow-natives-syntax");
    // 创建不可检测对象
    let all = vm.runInThisContext("%GetUndetectable()");
    // 恢复标志禁用（可选）
    v8.setFlagsFromString("--no-allow-natives-syntax");

    name = "";
    TEMPORARY = 0;
    innerHeight = 865;
    innerWidth = 313;
    outerHeight = 952;
    outerWidth = 1600;
    let removeChild = function removeChild(child){
        console.log("调用 ==> document.removeChild", child);
        return child;
    }

    setTimeout = function setTimeout(){}; set_func_native(setTimeout);
    setInterval = function setInterval(){}; set_func_native(setInterval);
    DOMParser = function DOMParser(){debugger;};
    Request = function Request(){debugger;};
    fetch = function fetch(){debugger;};
    XMLHttpRequest = function XMLHttpRequest(){debugger;};
    open = function open(){debugger;}; set_func_native(open);
    Event = function Event(){debugger;}; set_func_native(Event);
    webkitRequestFileSystem = function webkitRequestFileSystem(arg1, arg2, arg3){};
    CanvasRenderingContext2D = function CanvasRenderingContext2D(){debugger;}
    let getImageData = function getImageData(){}; set_func_native(getImageData);
    CanvasRenderingContext2D.prototype.getImageData = getImageData;
    let toBlob = function(){}; set_func_native(toBlob);
    let toDataURL = function(){}; set_func_native(toDataURL);
    HTMLCanvasElement = function HTMLCanvasElement(){
        debugger;
    }
    HTMLCanvasElement.prototype.toBlob = toBlob;
    HTMLCanvasElement.prototype.toDataURL = toDataURL;
    WebSocket = function WebSocket(){debugger;}
    let send = function(){}; set_func_native(send);
    WebSocket = function WebSocket(arg1){
        debugger;
    }
    WebSocket.prototype.send = send;
    MutationObserver = function MutationObserver(arg1){
        return watch({
            observe: function (){}
        }, "new MutationObserver");
    }
    prompt = function prompt(){debugger;}; set_func_native(prompt);
    HTMLFormElement = function HTMLFormElement(){debugger;};
    addEventListener = function addEventListener(type, func){};

    EventTarget = function EventTarget(){debugger;};
    Node = function Node(){debugger;}; Node.prototype.__proto__ = EventTarget.prototype;
    Node.prototype.appendChild = function appendChild(arg){
            console.log("调用 ==> document.appendChild", arg);
            if (this === document.body){
                if (arg.id){
                    window[arg.id] = arg;
                }
            } else {
                if (arg.id){
                    this[arg.id] = arg;
                }
                if (arg.name){
                    this[arg.name] = arg;
                }
            }
            debugger;
            return arg;
        }
    Node.prototype.removeChild = function removeChild(arg){
        console.log("调用 removeChild ==>", arg);
        return arg;
    }
    Document = function Document(){debugger;}; Document.prototype.__proto__ = Node.prototype;
    HTMLDocument = function HTMLDocument(){debugger;}; HTMLDocument.prototype.__proto__ = Document.prototype;
    Element = function Element(){debugger;}; Element.prototype.__proto__ = Node.prototype;
    HTMLElement = function HTMLElement(){debugger;}; HTMLElement.prototype.__proto__ = Element.prototype;
    HTMLDivElement = function HTMLDivElement(){debugger;}; HTMLDivElement.prototype.__proto__ = HTMLElement.prototype;
    HTMLCollection = function HTMLCollection(){debugger;};
    HTMLDivElement.prototype.getElementsByTagName = function getElementsByTagName(tagName){
        let name = `document.createElement("div").getElementsByTagName("${tagName}")`;
        console.log(`调用 ==> ${name}`);
        switch (tagName){
            case "i":
                let i = {
                    length: 0,
                }; i.__proto__ = HTMLCollection.prototype;
                return watch(i, name);
        }
    }; set_func_native(HTMLDivElement.prototype.getElementsByTagName);
    HTMLAnchorElement = function HTMLAnchorElement(){debugger;}; HTMLAnchorElement.prototype.__proto__ = HTMLElement.prototype;
    HTMLFormElement = function HTMLFormElement(){debugger;}; HTMLFormElement.prototype.__proto__ = HTMLElement.prototype;
    HTMLInputElement = function HTMLInputElement(){debugger;}; HTMLInputElement.prototype.__proto__ = HTMLElement.prototype;
    HTMLIFrameElement = function HTMLIFrameElement(){debugger;}; HTMLIFrameElement.prototype.__proto__ = HTMLElement.prototype;
    HTMLAnchorElement.prototype.protocol = 'http:';
    HTMLAnchorElement.prototype.hostname = 'www.ccgp-jiangxi.gov.cn';
    HTMLAnchorElement.prototype.port = '';
    HTMLAnchorElement.prototype.search = '';
    HTMLAnchorElement.prototype.hash = '';
    HTMLAnchorElement.prototype.pathname = '/web/';
    Document.prototype.createElement = function createElement(tagName){
        let name = `document.createElement("${tagName}")`;
        console.log(`调用 ==> ${name}`);
        switch (tagName){
            case "div":
                let div = {}; div.__proto__ = HTMLDivElement.prototype;
                return watch(div, name);
            case "a":
                let a = {}; a.__proto__ = HTMLAnchorElement.prototype;
                return watch(a, name);
            case "form":
                let form = {}; form.__proto__
            case "iframe":
                let iframe = {}; iframe.__proto__ = HTMLIFrameElement.prototype;
                return watch(iframe, name);
            case "input":
                let input = {}; set_toString(input, 'HTMLInputElement'); input.__proto__ = HTMLInputElement.prototype;
                return watch(input, name);
        }
    }; set_func_native(Document.prototype.createElement);
    Document.prototype.getElementById = function getElementById(tagName){
        let name = `document.getElementById("${tagName}")`;
        console.log(`调用 ==> ${name}`);
        switch (tagName){
            case "7jldb1RArSsa":
                return watch({
                    getAttribute: function (name1){
                        console.log(`调用 ==> ${name}.getAttribute("${name1}")`);
                        if (name1 === 'r'){
                            return 'm';
                        }
                        return null;
                    },
                    parentNode: watch({
                        removeChild: removeChild
                    }, `${name}.parentNode`),
                    content: "占位符content",
                }, name);
            case "root-hammerhead-shadow-ui":
                return null
        }
    }; set_func_native(Document.prototype.getElementById);
    Document.prototype.getElementsByTagName = function getElementsByTagName(tagName){
        let name = `document.getElementsByTagName("${tagName}")`;
        console.log(`调用 ==> ${name}`);
        switch (tagName){
            case "base":
                let base = {
                    length: 0,
                }; base.__proto__ = HTMLCollection.prototype;
                return watch(base, name);
            case "script":
                let script = {
                    length: 3,
                    0: watch({
                        getAttribute: function getAttribute(attr){
                            let name1 = `${name}[0].getAttribute("${attr}")`;
                            console.log(`调用 ==> ${name1}`);
                            switch (attr) {
                                case 'r':
                                    return 'm'
                            }
                        },
                        parentElement: watch({
                            removeChild: removeChild
                        }, `${name}[0].parentElement`),
                        innerText: `占位符ts`,
                        src: ""
                    }, `${name}[0]`),
                    1: watch({
                        getAttribute: function getAttribute(attr){
                            let name1 = `${name}[1].getAttribute("${attr}")`;
                            console.log(`调用 ==> ${name1}`);
                            switch (attr) {
                                case 'r':
                                    return 'm'
                            }
                        },
                        parentElement: watch({
                            removeChild: removeChild
                        }, `${name}[1].parentElement`),
                    }, `${name}[1]`),
                    2: watch({
                        getAttribute: function getAttribute(attr){
                            let name1 = `${name}[2].getAttribute("${attr}")`;
                            console.log(`调用 ==> ${name1}`);
                            switch (attr) {
                                case 'r':
                                    return 'm'
                            }
                        },
                        parentElement: watch({
                            removeChild: removeChild
                        }, `${name}[2].parentElement`),
                    }, `${name}[2]`),
                }; script.__proto__ = HTMLCollection.prototype;
                return watch(script, name);
        }
    }; set_func_native(Document.prototype.getElementsByTagName);
    XPathExpression = function XPathExpression(){debugger;};
    Document.prototype.createExpression = function createExpression(tagName){
        let name = `document.createExpression("${tagName}")`;
        console.log(`调用 ==> ${name}`);
        switch (tagName){
            case "//html":
                let html = {
                    // length: 0,
                }; html.__proto__ = XPathExpression.prototype;
                return watch(html, name);
        }
    }; set_func_native(Document.prototype.createExpression);
    Document.prototype.visibilityState = 'visible';
    HTMLHtmlElement = function HTMLHtmlElement(){debugger;}; HTMLHtmlElement.prototype.__proto__ = HTMLElement.prototype;
    HTMLAllCollection = function HTMLAllCollection(){debugger;};
    HTMLHtmlElement.prototype.style = watch({}, ' document.documentElement.style ');
    let documentElement = {
        getAttribute: function(attr){
            console.log(`调用 ==> document.documentElement.getAttribute("${attr}")`);
            return null;
        }
    }; documentElement.__proto__ = HTMLHtmlElement.prototype;
    Document.prototype.documentElement = watch(documentElement, 'document.documentElement');
    all.length = 5; set_toString(all, 'HTMLAllCollection'); all.__proto__ = HTMLAllCollection.prototype;
    Document.prototype.all = all;
    HTMLBodyElement = function HTMLBodyElement(){debugger;}; HTMLBodyElement.prototype.__proto__ = HTMLElement.prototype;
    let body = {}; body.__proto__ = HTMLBodyElement.prototype;
    Document.prototype.body = watch(body, 'document.body');

    Location = function Location(){debugger;};
    Navigator = function Navigator(){debugger;};
    Navigator.prototype.sendBeacon = function sendBeacon(){debugger;};
    Navigator.prototype.userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36";
    Navigator.prototype.appVersion = '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36';
    Navigator.prototype.webdriver  = false;
    Navigator.prototype.platform  = 'Win32';
    Navigator.prototype.languages = [
    "zh-CN",
    "zh"
];
    Navigator.prototype.webkitPersistentStorage = watch({}, 'navigator.webkitPersistentStorage');
    Navigator.prototype.connection = watch({}, 'navigator.connection');
    Navigator.prototype.mimeTypes = watch({}, 'navigator.mimeTypes');
    Navigator.prototype.getBattery = function getBattery(){
        return new Promise(function(yes, no){
            yes(watch({}, 'navigator.getBattery().then()'))
        })
    }
    Screen = function Screen(){debugger;};
    Storage = function Storage(){debugger;};
    Storage.prototype.removeItem = function removeItem(key){
        delete this[key];
    }
    Storage.prototype.getItem = function getItem(key){
        if (this[key]) {
            return this[key];
        }
        return null;
    }
    Storage.prototype.setItem = function setItem(key, value){
        this[key] = value;
    }
    IDBFactory = function IDBFactory(){debugger;};
    History = function History(){debugger;};
    History.prototype.replaceState = function replaceState(){debugger;};

    let WindowProperties = {}; WindowProperties.__proto__ = EventTarget.prototype;
    Window = function Window(){debugger;}; Window.prototype.__proto__ = WindowProperties;
    EventTarget.prototype.addEventListener = function addEventListener(){};

    top = self = parent = window = globalThis; set_toString(window, 'Window'); window.__proto__ = Window.prototype;
    document = {}; document.__proto__ = HTMLDocument.prototype;
    location = {
        "ancestorOrigins": {},
        "href": "http://www.ccgp-jiangxi.gov.cn/web/",
        "origin": "http://www.ccgp-jiangxi.gov.cn",
        "protocol": "http:",
        "host": "www.ccgp-jiangxi.gov.cn",
        "hostname": "www.ccgp-jiangxi.gov.cn",
        "port": "",
        "pathname": "/web/",
        "search": "",
        "hash": ""
    }; location.__proto__ = Location.prototype;
    navigator = {}; navigator.__proto__ = Navigator.prototype;
    screen = {}; screen.__proto__ = Screen.prototype;
    localStorage = {}; localStorage.__proto__ = Storage.prototype;
    sessionStorage = {}; sessionStorage.__proto__ = Storage.prototype;
    indexedDB = {
        open: function(){
            return watch({}, 'indexedDB.open');
        }
    }; indexedDB.__proto__ = IDBFactory.prototype;
    history = {}; history.__proto__ = History.prototype;
    chrome = {};
    crypto = {};
    performance = {};

    globalThis = window = watch(window, 'window');
    document = watch(document, 'document');
    location = watch(location, 'location');
    navigator = watch(navigator, 'navigator');
    screen = watch(screen, 'screen');
    localStorage = watch(localStorage, 'localStorage');
    sessionStorage = watch(sessionStorage, 'sessionStorage');
    indexedDB = watch(indexedDB, 'indexedDB');
    history = watch(history, 'history');
    chrome = watch(chrome, 'chrome');
    crypto = watch(crypto, 'crypto');
    performance = watch(performance, 'performance');
    clientInformation = navigator;

    CanvasRenderingContext2D.prototype = watch(CanvasRenderingContext2D.prototype, 'CanvasRenderingContext2D.prototype');
    HTMLCanvasElement.prototype = watch(HTMLCanvasElement.prototype, 'HTMLCanvasElement.prototype');
    WebSocket.prototype = watch(WebSocket.prototype, 'WebSocket.prototype');
}();


占位符ts

占位符jsfile

get_cookie = function get_cookie(){
    console.debug(document.cookie);
}

get_cookie();