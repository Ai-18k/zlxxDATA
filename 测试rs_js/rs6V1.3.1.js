

const v8 = require("v8");
const vm = require("vm");
// 允许使用 V8 内置函数（需启用 --allow-natives-syntax 标志）
v8.setFlagsFromString("--allow-natives-syntax");
// 创建不可检测对象
let all = vm.runInThisContext("%GetUndetectable()");
// 恢复标志禁用（可选）
v8.setFlagsFromString("--no-allow-natives-syntax");

content="content_code"
// content="KwRCZngsudXJKHFs4rN9Np0Cm7_.EL4WJmlxRUwb2i35gsoHI17q4MS3VCsm7H7h7OvPoiy20fHsmd.3doqTnG"

delete __filename
delete __dirname

// 工具，hook
// !function (){
//     delete global;
//     delete Buffer;
//     delete process;
//     delete setImmediate;
//     delete clearImmediate;
//     exports = undefined;
//     module = undefined;

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

function watch(obj, name, visited = new WeakSet()) {
// 防止循环引用导致无限递归
if (obj === null || typeof obj !== 'object' || visited.has(obj)) {
    return obj;
}

visited.add(obj);

// 检查原型链访问
const checkPrototypeChain = (target, property) => {
    let current = target;
    while (current) {
        if (Object.prototype.hasOwnProperty.call(current, property)) {
            return false; // 属性直接存在于当前对象上
        }
        current = Object.getPrototypeOf(current);
        if (current && current !== Object.prototype && current !== null) {
            console.log(`原型链检测:true (对象: ${name}, 属性: ${property})`);
            return true;
        }
    }
    return false;
};

return new Proxy(obj, {
    get: function (target, property, receiver) {
        try {
            // 排除一些不常见的或可能导致问题的属性
            if (typeof property === 'symbol' || property === 'constructor' || property === '__proto__') {
                return Reflect.get(target, property, receiver);
            }

            if (property === 'crypto' || property === 'navigator' || property === 'window') {
                return target[property];
            }
            const value = Reflect.get(target, property, receiver);
            if (!value) {
                // 深度监听嵌套对象
                if (typeof value === 'object' && value !== null) {
                    // 为嵌套对象生成一个更具体的名称
                    const nestedName = `${name}.${String(property)}`;
                    return watch(value, nestedName, visited);
                }
                // 打印属性访问信息
                console.log(`对象 => ${name}, 读取属性: ${String(property)}, 值为: ${typeof value === 'function' ? 'function' : value}, 类型为: ${typeof value}`);

                // 检测原型链访问
                // 如果属性不在 target 上，但通过原型链访问到，则标记为 true
                if (!Object.prototype.hasOwnProperty.call(target, property)) {
                    checkPrototypeChain(target, property);
                }

                // 检测描述符
                const descriptor = Object.getOwnPropertyDescriptor(target, property);
                if (descriptor) {
                    if (descriptor.get || descriptor.set) {

                        console.log(`特殊检测: 存在Getter/Setter (对象: ${name}, 属性: ${String(property)})`);
                    }
                    if (!descriptor.writable && !descriptor.get) {

                        console.log(`特殊检测: 只读属性 (对象: ${name}, 属性: ${String(property)})`);
                    }
                    if (!descriptor.configurable) {

                        console.log(`特殊检测: 不可配置属性 (对象: ${name}, 属性: ${String(property)})`);
                    }
                }
            }
        } catch (e) {
            console.error(`Error in get trap for ${name}.${String(property)}:`, e);
        }
        return Reflect.get(target, property, receiver);
    },
    set: (target, property, newValue, receiver) => {
        try {
            console.log(`对象 => ${name}, 设置属性: ${String(property)}, 值为: ${typeof newValue === 'function' ? 'function' : newValue}, 类型为: ${typeof newValue}`);
        } catch (e) {
            console.error(`Error in set trap for ${name}.${String(property)}:`, e);
        }
        return Reflect.set(target, property, newValue, receiver);
    },
    // 捕获 in 操作符
    has: function (target, property) {
        console.log(`对象 => ${name}, in 操作符检测属性: ${String(property)}`);
        console.log(Reflect.has(target, property))
        return Reflect.has(target, property);
    },
    // 捕获 delete 操作符
    deleteProperty: function (target, property) {
        console.log(`对象 => ${name}, 删除属性: ${String(property)}`);
        return Reflect.deleteProperty(target, property);
    },
    // 捕获 Object.keys(), Object.values(), Object.entries() 等操作
    ownKeys: function (target) {
        console.log(`对象 => ${name}, 获取自身所有键`);
        return Reflect.ownKeys(target);
    },
    // 捕获 Object.defineProperty()
    defineProperty: function (target, property, descriptor) {
        console.log(`对象 => ${name}, 定义属性: ${String(property)}`);
        return Reflect.defineProperty(target, property, descriptor);
    },
    // 捕获 Object.setPrototypeOf()
    setPrototypeOf: function (target, prototype) {
        console.log(`特殊检测: setPrototypeOf 被调用 (对象: ${name})`);
        return Reflect.setPrototypeOf(target, prototype);
    },
    // 捕获 Object.getPrototypeOf()
    getPrototypeOf: function (target) {
        console.log(`特殊检测: getPrototypeOf 被调用 (对象: ${name})`);
        return Reflect.getPrototypeOf(target);
    },
    getOwnPropertyDescriptor: function (target, property) {
        console.log(`特殊检测: getOwnPropertyDescriptor 被调用 (对象: ${name}, 属性: ${String(property)})`);
        return Reflect.getOwnPropertyDescriptor(target, property);
    },
    toString: function (target) {
        console.log(`特殊检测: toString 被调用 (对象: ${name})`);
        return Reflect.toString(target);
    }
});
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
    // console.log(`调用 ==> Object.prototype.toString ==> `, this, '==>', res);
    return res;
}; set_func_native(Object.prototype.toString);

let func_to_str = Function.prototype.toString;
Function.prototype.toString = function toString(){
    let res = func_to_str.call(this, ...arguments);
    // console.log(`调用 ==> Function.prototype.toString ==> `, this, '==>', res);
    return res;
}; set_func_native(Function.prototype.toString);

let getOwnPropertyNames_ = Object.getOwnPropertyNames;
Object.getOwnPropertyNames = function getOwnPropertyNames(obj){
    // console.log("调用 ==> Object.getOwnPropertyNames ==> ", obj);
    return getOwnPropertyNames_(obj);
}

let keys_ = Object.keys;
Object.keys = function keys(obj){
    // console.log("调用 ==> Object.keys ==> ", obj);
    return keys_(obj);
}

let getOwnPropertyDescriptor_ = Object.getOwnPropertyDescriptor;
Object.getOwnPropertyDescriptor = function getOwnPropertyDescriptor(obj, attr){
    // console.log("调用 ==> Object.getOwnPropertyDescriptor ==> ", obj, attr);
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
    // console.log("调用 ==> Object.getOwnPropertyDescriptors ==> ", obj);
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
// }();

let removeChild = function removeChild(child){
    console.log("调用 ==> document.removeChild", child);
    return child;
}

setTimeout = function setTimeout(){}; set_func_native(setTimeout);
setInterval = function setInterval(){}; set_func_native(setInterval);
DOMParser = function DOMParser(){};
Request = function Request(){};
fetch = function fetch(){};
XMLHttpRequest = function XMLHttpRequest(){};
open = function open(){}; set_func_native(open);
Event = function Event(){}; set_func_native(Event);
webkitRequestFileSystem = function webkitRequestFileSystem(arg1, arg2, arg3){};
CanvasRenderingContext2D = function CanvasRenderingContext2D(){}
let getImageData = function getImageData(){}; set_func_native(getImageData);
CanvasRenderingContext2D.prototype.getImageData = getImageData;
let toBlob = function(){}; set_func_native(toBlob);
let toDataURL = function(){}; set_func_native(toDataURL);
HTMLCanvasElement = function HTMLCanvasElement(){

}
HTMLCanvasElement.prototype.toBlob = toBlob;
HTMLCanvasElement.prototype.toDataURL = toDataURL;
WebSocket = function WebSocket(){}
let send = function(){}; set_func_native(send);
WebSocket = function WebSocket(arg1){

}
WebSocket.prototype.send = send;
MutationObserver = function MutationObserver(arg1){
    return watch({
        observe: function (){}
    }, "new MutationObserver");
}
prompt = function prompt(){}; set_func_native(prompt);
HTMLFormElement = function HTMLFormElement(){};
addEventListener = function addEventListener(type, func){};

EventTarget = function EventTarget(){};
Node = function Node(){}; Node.prototype.__proto__ = EventTarget.prototype;
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
        //
        return arg;
    }
Node.prototype.removeChild = function removeChild(arg){
    console.log("调用 removeChild ==>", arg);
    return arg;
}
Document = function Document(){}; Document.prototype.__proto__ = Node.prototype;
HTMLDocument = function HTMLDocument(){}; HTMLDocument.prototype.__proto__ = Document.prototype;
Element = function Element(){}; Element.prototype.__proto__ = Node.prototype;
HTMLElement = function HTMLElement(){}; HTMLElement.prototype.__proto__ = Element.prototype;
HTMLDivElement = function HTMLDivElement(){}; HTMLDivElement.prototype.__proto__ = HTMLElement.prototype;
HTMLCollection = function HTMLCollection(){};
HTMLDivElement.prototype.getElementsByTagName = function getElementsByTagName(tagName){
    let name = `document.createElement("div").getElementsByTagName("${tagName}")`;
    console.log(`调用 ==> ${name}`);
    switch (tagName){
        case "i":
            debugger
            let i =[]; i.__proto__ = HTMLCollection.prototype;
            return watch(i,name);
    }
}; set_func_native(HTMLDivElement.prototype.getElementsByTagName);
HTMLAnchorElement = function HTMLAnchorElement(){}; HTMLAnchorElement.prototype.__proto__ = HTMLElement.prototype;
HTMLFormElement = function HTMLFormElement(){}; HTMLFormElement.prototype.__proto__ = HTMLElement.prototype;
HTMLInputElement = function HTMLInputElement(){}; HTMLInputElement.prototype.__proto__ = HTMLElement.prototype;
HTMLIFrameElement = function HTMLIFrameElement(){}; HTMLIFrameElement.prototype.__proto__ = HTMLElement.prototype;
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
            CSSStyleDeclaration=function CSSStyleDeclaration() {}
            let div = {
                style:new CSSStyleDeclaration(),
                setAttribute:function(name, value){
                    console.log('div.setAttribute("' + name +value + '")')
                },
                // addBehavior:function (name, value) {
                //     console.log('div.addBehavior("' + name + value + '")')
                // }
            }; div.__proto__ = HTMLDivElement.prototype;
            return watch(div, name);
        case "a":
            let a = {}; a.__proto__ = HTMLAnchorElement.prototype;
            return watch(a, name);
        case "form":
            let form = {}; form.__proto__=HTMLFormElement.prototype;
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
        case "K5MK4FPPNWrv":
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
                content: content
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
                    innerText: `ts_code`,
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
XPathExpression = function XPathExpression(){};
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
HTMLHtmlElement = function HTMLHtmlElement(){}; HTMLHtmlElement.prototype.__proto__ = HTMLElement.prototype;
HTMLAllCollection = function HTMLAllCollection(){};
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
HTMLBodyElement = function HTMLBodyElement(){}; HTMLBodyElement.prototype.__proto__ = HTMLElement.prototype;
let body = {}; body.__proto__ = HTMLBodyElement.prototype;
Document.prototype.body = watch(body, 'document.body');

Location = function Location(){};
Navigator = function Navigator(){};
Navigator.prototype.sendBeacon = function sendBeacon(){};
Navigator.prototype.userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36";
Navigator.prototype.appVersion = '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36';
Navigator.prototype.webdriver  = false;
Navigator.prototype.platform  = 'Win32';
Navigator.prototype.maxTouchPoints  = 0;
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
Screen = function Screen(){};
Storage = function Storage(){};
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
IDBFactory = function IDBFactory(){};
History = function History(){};
History.prototype.replaceState = function replaceState(){};

let WindowProperties = {}; WindowProperties.__proto__ = EventTarget.prototype;
Window = function Window(){}; Window.prototype.__proto__ = WindowProperties;
Window.prototype.outerWidth= 1536
Window.prototype.innerHeight=695
Window.prototype.innerWidth=587
Window.prototype.outerHeight=816
Window.prototype.history={
            length: 7,
            scrollRestoration: "auto",
            state: null
        }
Window.prototype.TEMPORARY=0
Window.prototype.name=""
Window.prototype.ActiveXObject=undefined
EventTarget.prototype.addEventListener = function addEventListener(){};
top = self = parent = window = globalThis; set_toString(window, 'Window'); window.__proto__ = Window.prototype;

document = {}; document.__proto__ = HTMLDocument.prototype;
location = {
    "ancestorOrigins": {},
    "href": "http://epub.cnipa.gov.cn/Dxb/IndexQuery",
    "origin": "http://epub.cnipa.gov.cn",
    "protocol": "http:",
    "host":"epub.cnipa.gov.cn",
    // "hostname": "www.ccgp-jiangxi.gov.cn",
    "hostname": "www.epub.cnipa.gov.cn",
    "port": "",
    "pathname": "/web/",
    "search": "",
    "hash": ""
};

location.__proto__ = Location.prototype;
navigator = {}; navigator.__proto__ = Navigator.prototype;
screen = {}; screen.__proto__ = Screen.prototype;
localStorage = {
    "_$rc":'jO3AYuFGo4C0jr7m_e.PzNSAqkf8GO9nEJysolNvtKj6cieUGdX6Xu.hErO_6kxIsQfyDttgQOMRQMLFGh1h8HEC8.x9vGwmrU_TR8Wlo9qScjRkVp9KIw4C3jAi679Uf_9Mm.jBwS022qEvsVwFRycBw10hf4YojrKlgfThGsC9ZmK8o3w5LvNEr1YO2KcsAPYZov0Z.THrm_kj1fJNXSsxTPsKvKW2YbOHulG9DseTLgNDhilB1lyVumW1DJK2AwdFEj3caERv6VPIodzLTYZzm5iJpl2U055BRded754R9XHFXT2uia0vBEJnhfjwpWEKmuBgF.JSSVSoso_THsk3tnGPBvlt3k_dzBPeEOSakivmfkjEjZC2stKmysv5Tz9vDZ60NI8qP9GGF3U8qd7mnSAMMAtcqm51BI0mwFyECZsIgTGNb7lr.tgU.Cl9tSX0N3k3eb5LdGKrbOXbcUZejf8hzSwexSq3YHvgoBUOGwEcc4NrMnZENp2kEhBOKEqtR9fZlT8SSTYShIrfDI44JUxQOjGdf4Mh297jjFVzDX3rhRyi0pNtDRxXM0Y7VumUYe2VKjmz0U6dDR8SDt8t5GVQI9NKesBioQNYxebuOUY.K5L3Ap09GUJ5QhPtPWlSz6OM4eDW9_w03Cc6w1pkDNuJMrNV.Ems9UC1s.rnHldtijFs1Ibobslno9TcHIV9nJdyHxzeneI_SuMitbYHu4c5PiEECkIHSry063.1tuy_azD7TD0ubnXl5LsA4CrWwq'
}; localStorage.__proto__ = Storage.prototype;
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


"ts_code"

"functo_code"

// require('../rs-code/专利')

function rs6(){
    // console.debug(document.cookie);
    return document.cookie
}
// cook=rs6()
// console.log(cook.length+" | "+ cook );

// rs6()
