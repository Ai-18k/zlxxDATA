const { createCanvas } = require('canvas');
global.process = undefined;
global.dirname = undefined;
global.__filename = undefined;
global.globalthis = undefined;

console.log=function (){}


var _content='"content_code"'
// var corsToken='"auth_token"'

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
                            debugger;
                            console.log(`特殊检测: 存在Getter/Setter (对象: ${name}, 属性: ${String(property)})`);
                        }
                        if (!descriptor.writable && !descriptor.get) {
                            debugger;
                            console.log(`特殊检测: 只读属性 (对象: ${name}, 属性: ${String(property)})`);
                        }
                        if (!descriptor.configurable) {
                            debugger;
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

// toString
// 替换原有的 obj_toString 实现
const originalToString = Function.prototype.toString;
const protectedFunctions = new WeakMap();

Function.prototype.toString = function() {
    // 拦截被保护的函数
    if (protectedFunctions.has(this)) {
        return `function ${protectedFunctions.get(this)}() { [native code] }`;
    }
    // 保护 toString 自己
    if (this === Function.prototype.toString) {
        return 'function toString() { [native code] }';
    }
    // 默认走原生
    return originalToString.call(this);
};

const obj_toString = (func, name) => {
    let funcName = name || func.name;
    Object.defineProperty(func, 'name', { value: funcName, configurable: true });
    // 将该函数加入保护名单
    protectedFunctions.set(func, funcName);
};



function Window(){}
window = globalThis;
window.top = window;
window.self = window;
window.webkitRequestFileSystem=function(args){ console.log('打印：window.webkitRequestFileSystem("' + args + '")'); };
window.ScreenOrientation=function(args){
     console.log('打印：window.ScreenOrientation("' + args + '")');
}
window.PerformancePaintTiming=function(args){
    console.log('打印：window.PerformancePaintTiming("' + args + '")');
}
window.MediaEncryptedEvent=function(args){
    console.log('打印：window.MediaEncryptedEvent("' + args + '")');
}
window.Notification=function(args){
    console.log('打印：window.Notification("' + args + '")');
}
window.HTMLFrameSetElement=function(args){
    console.log('打印：window.HTMLFrameSetElement("' + args + '")');
}
window.chrome={
    "app": {
        "isInstalled": false,
        "InstallState": {
            "DISABLED": "disabled",
            "INSTALLED": "installed",
            "NOT_INSTALLED": "not_installed"
        },
        "RunningState": {
            "CANNOT_RUN": "cannot_run",
            "READY_TO_RUN": "ready_to_run",
            "RUNNING": "running"
        }
    }
}


window.SVGGraphicsElement = function (args) {
    console.log('打印：window.SVGGraphicsElement("' + args + '")');
}

window.matchMedia = function (args) {
    console.log('打印：window.matchMedia("' + args + '")');
}
window.SourceBuffer = function (args) {
    console.log('打印：window.SourceBuffer("' + args + '")');
}
window.Path2D = function (args) {
    console.log('打印：window.Path2D("' + args + '")');
}
window.SVGPatternElement = function (args) {
    console.log('打印：window.SVGPatternElement("' + args + '")');
}
window.ActiveXObject = undefined
window.devicePixelRatio=1.25
BeforeInstallPromptEvent = function (args) {
    console.log('打印：BeforeInstallPromptEvent("' + args + '")');
}

Window.prototype.DOMParser = function (args) {
  console.log('打印：window.DOMParser("' + args + '")');
}
Window.prototype.ActiveXObject = undefined
window.innerWidth = 1536;
window.innerHeight = 750;      // 留出合理空间

window.outerWidth = 1536;
window.outerHeight = 860;      // 比 inner 大约多 100-110px
window.TEMPORARY = 0;
window.indexedDB={
    open: function (args,n) {
        let name= 'indexedDB.open("' + args + '")';
        console.log(name);
        return watch({}, name);
    }
}
external =  watch({
    IsSearchProviderInstalled:function(){
        debugger;
    },
    AddFavorite:function(){
        debugger;
    }
},'external')
locationbar = watch({
    visible: true
}, 'locationbar')
menubar = watch({
    visible: true
}, 'menubar')
personalbar = watch({
    visible: true
}, 'personalbar')
scrollbars = watch({
    visible: true
}, 'scrollbars')
toolbar = watch({
    visible: true
}, 'toolbar')
statusbar = watch({
    visible: true
}, 'statusbar')
TextTrackList=function(){
    debugger;
}
CloseEvent = function () {
    debugger;
}
CDATASection = function () {
    debugger;
}
window.XMLHttpRequest = function XMLHttpRequest() { }
// watch(window.XMLHttpRequestwatch(window, "window"), "XMLHttpRequest");
prompt = function prompt() {
    debugger;
}
Object.setPrototypeOf(window,Window.prototype)
obj_toString(window, "Window")



// 完整的事件系统实现
function EventTarget(type, eventInitDict) {

    // 添加检查
    if (type == null) {                    // null 或 undefined
        console.log('EventTarget created with null/undefined type → 使用 "unknown"');
        // console.trace();                // 调试时打开这行看调用栈
        type = 'unknown';
    } else if (typeof type !== 'string') {
        type = String(type);
    }
     this.type = String(type);
    this.target = null;
    this.currentTarget = null;
    this.bubbles = false;
    this.cancelable = false;
    this.defaultPrevented = false;
    this.isTrusted = eventInitDict && eventInitDict.isTrusted !== undefined ? eventInitDict.isTrusted : false;
    this.timeStamp = Date.now();

    this.preventDefault = function() {
        if (this.cancelable) {
            this.defaultPrevented = true;
        }
    };

    this.stopPropagation = function() {
        // 简单实现
    };

    this.stopImmediatePropagation = function() {
        // 简单实现
    };
}
obj_toString(new EventTarget, "EventTarget")

// 为 Window 添加事件系统
if (!Window.prototype._eventListeners) {
    Window.prototype._eventListeners = {};
}

// 重写 window.addEventListener
Window.prototype.addEventListener = function(type, listener, options) {
    console.log('打印：window.addEventListener("' + type + '")');

    if (!this._eventListeners) {
        this._eventListeners = {};
    }

    if (!this._eventListeners[type]) {
        this._eventListeners[type] = [];
    }

    // 避免重复添加相同的监听器
    if (this._eventListeners[type].indexOf(listener) === -1) {
        this._eventListeners[type].push({
            listener: listener,
            options: options || false
        });
    }

    // 对于 load 和 popstate 事件，我们可能需要特殊处理
    if (type === "load") {
        // 如果页面已经加载完成，立即触发
        if (document.readyState === 'complete') {
            setTimeout(() => {
                if (typeof listener === 'function') {
                    listener.call(this, new EventTarget("load", {isTrusted: true}));
                }
            }, 0);
        }
    }
};

// 为 window 添加 dispatchEvent 方法
Window.prototype.dispatchEvent = function(event) {
    console.log('打印：window.dispatchEvent("' + event.type + '")');

    if (!this._eventListeners || !this._eventListeners[event.type]) {
        return true;
    }

    event.target = this;
    event.currentTarget = this;

    const listeners = this._eventListeners[event.type];
    for (let i = 0; i < listeners.length; i++) {
        const listenerObj = listeners[i];
        try {
            if (typeof listenerObj.listener === 'function') {
                listenerObj.listener.call(this, event);
            } else if (typeof listenerObj.listener === 'object' && typeof listenerObj.listener.handleEvent === 'function') {
                listenerObj.listener.handleEvent(event);
            }
        } catch (e) {
            console.error('Error in window event listener:', e);
        }
    }

    return !event.defaultPrevented;
};
Window.prototype.SpeechSynthesisUtterance = function() {
    debugger;
};




OffscreenCanvasRenderingContext2D = function() {
    debugger;
}

function WEBGL_debug_renderer_info() {
    this.UNMASKED_VENDOR_WEBGL = 37445;
    this.UNMASKED_RENDERER_WEBGL = 37446;
}

function WebGLRenderingContext() {
    this.canvas=createCanvas(300, 150);
    this.drawingBufferFormat = 32856;
    this.drawingBufferHeight = 150;
    this.drawingBufferWidth = 300;
    this.unpackColorSpace = "srgb";
    this.getExtension = function(args) {
        console.log('document.createElement("canvas").getContext("webgl").getExtension("' + args + '")');
        if (args == "WEBGL_debug_renderer_info") {
            WEBGL_debug_renderer = watch(new WEBGL_debug_renderer_info(), "WEBGL_debug_renderer_info");
            obj_toString(WEBGL_debug_renderer, "WEBGL_debug_renderer_info");
            return WEBGL_debug_renderer;
        }
    };
    this.getParameter = function(args) {
        console.log('document.createElement("canvas").getContext("webgl").getParameter("' + args + '")');
        if (args == 37445) {
            return "Google Inc. (Intel)";
        }
        if (args == 37446) {
            return "ANGLE (Intel, Intel(R) Iris(R) Xe Graphics (0x00009A49) Direct3D11 vs_5_0 ps_5_0, D3D11)";
        }
    };
}
function CanvasRenderingContext2D() {
    this.canvas=createCanvas(300, 150);
    this.fillStyle = "#000000";
    this.filter = "none";
    this.font = "10px sans-serif";
    this.fontKerning = "auto";
    this.fontStretch = "normal";
    this.fontVariantCaps = "normal";
    this.globalAlpha = 1;
    this.globalCompositeOperation = "source-over";
    this.imageSmoothingEnabled = true;
    this.imageSmoothingQuality = "low";
    this.lang = "inherit";
    this.letterSpacing = "0px";
    this.lineCap = "butt";
    this.lineJoin = "miter";
    this.lineWidth = 1;
    this.miterLimit = 10;
    this.shadowColor = "rgba(0, 0, 0, 0)";
    this.strokeStyle = "#000000";
    this.textAlign = "start";
    this.textBaseline = "alphabetic";
    this.textRendering = "auto";
    this.wordSpacing = "0px";
    this.fillRect = function(args) {
        console.log('document.createElement("canvas").getContext("2d").fillRect(' + args + ')');
    };
    this.fillText = function(args) {
        console.log('document.createElement("canvas").getContext("2d").clearRect(' + args + ')');
    };
    this.getImageData=function(args) {
        console.log('document.createElement("canvas").getContext("2d").getImageData(' + args + ')');
    };
}
window.CanvasRenderingContext2D = CanvasRenderingContext2D;
function HTMLCanvasElement() {
    // 内部维护一个真实的 node-canvas 实例
    this._realCanvas = createCanvas(300, 150);
    this.width = 300;
    this.height = 150;

    this.getContext = function(type) {
        console.log(`[Mock] canvas.getContext('${type}')`);
        if (type === '2d') {
            // 直接返回 node-canvas 提供的真实 2D 上下文
            // 瑞数在上面 fillText 产生的数据将是基于真实图形引擎渲染出来的
            const ctx = this._realCanvas.getContext('2d');
            // 可以用你的 watch 包裹它以观察瑞数画了什么
            return watch(ctx, "CanvasRenderingContext2D");
        }
        if (type === 'webgl') {
            // webgl 比较复杂，通常纯 node 库很难完美模拟，维持你原来的假装逻辑即可
            return watch(new WebGLRenderingContext(), "WebGLRenderingContext");
        }
        return null;
    };

    this.toDataURL = function(...args) {
        console.log(`[Mock] canvas.toDataURL() 被调用`);
        // 让 node-canvas 生成真实的 Base64 图片哈希
        return this._realCanvas.toDataURL(...args);
    };
}
Object.defineProperty(HTMLCanvasElement.prototype, Symbol.toStringTag, {
    value: 'HTMLCanvasElement',
    configurable: true
});

window.HTMLCanvasElement = HTMLCanvasElement;

// 1. 定义 BatteryManager 原型
function BatteryManager() {
    this.charging = true;
    this.chargingTime = 0;
    this.dischargingTime = Infinity;
    this.level = 1.0; // 满电
    this.onchargingchange = null;
    this.onchargingtimechange = null;
    this.ondischargingtimechange = null;
    this.onlevelchange = null;
}
// 继承你之前写好的 EventTarget
Object.setPrototypeOf(BatteryManager.prototype, EventTarget.prototype);
// 修复 toStringTag
Object.defineProperty(BatteryManager.prototype, Symbol.toStringTag, {
    value: 'BatteryManager',
    configurable: true
});
obj_toString(BatteryManager, "BatteryManager");

function CSSStyleDeclaration() {
  this.cssText = "";
  this.length = 0;
  this.lineBreak = '';
  this.textAlignLast = ''
  this.minWidth = ''
  this.backgroundBlendMode = ''
  this.fontVariantNumeric = ''
}

styles = watch(new CSSStyleDeclaration(), "CSSStyleDeclaration");



function HTMLHeadElement() {
  this.baseURI = "http://epub.cnipa.gov.cn/Dxb/PageQuery";
  this.localName = "head";
  this.namespaceURI = "http://www.w3.org/1999/xhtml";
  this.tagName = "HEAD";
  this.nodeType = 1;
  this.outerHTML = "<head></head>";
  this.spellcheck = true;
  this.style = styles;
}
Object.defineProperty(HTMLHeadElement.prototype, Symbol.toStringTag, {
    value: 'HTMLHeadElement',
    configurable: true
});
HTMLHeadElement.prototype.removeChild = function removeChild(child) {
  console.log('打印：document.head.removeChild("' + child + '")');
};
HTMLHeadElement.prototype.getAttribute = function getAttribute(child) {
  console.log('打印：document.head.getAttribute("' + child + '")');
};
head = watch(new HTMLHeadElement(), "HTMLHeadElement");
obj_toString(head, "HTMLHeadElement");

function HTMLScriptElement() {
    this.baseURI = "http://epub.cnipa.gov.cn/Dxb/PageQuery";
    this.type = "text/javascript";
    this.r = "m";
    this.charset = "utf-8";
    this.localName = "script";
    this.namespaceURI = "http://www.w3.org/1999/xhtml";
    this.tagName = "SCRIPT";
    this.nodeType = 1;
    this.spellcheck = true;
    this.parentElement = head;
    this.textContent = "";
    this.src = "";
    this.async = true;
    this.defer = false;
}
HTMLScriptElement.prototype = {
    getAttribute: function(attrName) {
        console.log('打印：HTMLScriptElement.getAttribute("' + attrName + '")');
        switch(attrName) {
            case 'r':
                return this.r;
            case 'type':
                return this.type;
            case 'src':
                return this.src;
            case 'charset':
                return this.charset;
            default:
                return null;
        }
    },

    setAttribute: function(attrName, value) {
        console.log('打印：HTMLScriptElement.setAttribute("' + attrName + '", "' + value + '")');
        switch(attrName) {
            case 'r':
                this.r = value;
                break;
            case 'type':
                this.type = value;
                break;
            case 'src':
                this.src = value;
                break;
            case 'charset':
                this.charset = value;
                break;
        }
    },

    hasAttribute: function(attrName) {
        return this.hasOwnProperty(attrName) || this.getAttribute(attrName) !== null;
    }
};
Object.defineProperty(HTMLScriptElement.prototype, Symbol.toStringTag, {
    value: 'HTMLScriptElement',
    configurable: true
});
// 完善的 HTMLCollection 实现
function HTMLCollection(elements = []) {
    // 初始化数组特性
    Object.setPrototypeOf(this, HTMLCollection.prototype);

    // 添加元素到集合
    for (let i = 0; i < elements.length; i++) {
        this[i] = elements[i];
    }

    this.length = elements.length;
}
HTMLCollection.prototype = Object.create(Array.prototype);
HTMLCollection.prototype.constructor = HTMLCollection;

HTMLCollection.prototype.item = function(index) {
    return this[index] || null;
};

HTMLCollection.prototype.namedItem = function(name) {
    // 根据名称查找元素（例如通过id或name属性）
    for (let i = 0; i < this.length; i++) {
        const element = this[i];
        if (element.id === name || element.name === name) {
            return element;
        }
    }
    return null;
};

function HTMLMetaElement() {
    this.parentNode = head;
    this.baseURI = "http://epub.cnipa.gov.cn/Dxb/PageQuery";
    this.localName = "meta";
    this.namespaceURI = "http://www.w3.org/1999/xhtml";
    this.tagName = "META";
    this.nodeType = 1;
    this.content = _content;
var corsToken='"auth_token"';
    this.id = "K5MK4FPPNWrv";
    this.r = "m";
}

HTMLMetaElement.prototype.getAttribute = function(attrName) {
    console.log('打印：HTMLMetaElement.getAttribute("' + attrName + '")');
    switch(attrName) {
        case 'r':
            return this.r;
        case 'content':
            return this.content;
        case 'id':
            return this.id;
        default:
            return null;
    }
};

// 替换原有的 HTMLAnchorElement
function HTMLAnchorElement() {
    this._href = '';
    this.protocol = '';
    this.hostname = '';
    this.port = '';
    this.pathname = '';
    this.search = '';
    this.hash = '';
    this.host = '';
    this.style = styles;
}

Object.defineProperties(HTMLAnchorElement.prototype, {
    href: {
        get: function() { return this._href; },
        set: function(val) {
            this._href = val;
            // 瑞数经常赋相对路径，这里做个补全
            let parseUrl = val;
            if (val.startsWith('/')) {
                parseUrl = 'http://epub.cnipa.gov.cn' + val;
            }
            try {
                const parsed = new URL(parseUrl);
                this.protocol = parsed.protocol;
                this.hostname = parsed.hostname;
                this.port = parsed.port;
                this.pathname = parsed.pathname;
                this.search = parsed.search;
                this.hash = parsed.hash;
                this.host = parsed.host;
            } catch (e) {
                console.log(`[HTMLAnchorElement] URL解析异常: ${val}`);
            }
        }
    }
});

HTMLAnchorElement.prototype.addEventListener = function(type, listener) {
    console.log('打印：HTMLAnchorElement.addEventListener("' + type + '", ' + (listener) + ')');
};
watch(new HTMLAnchorElement(), "HTMLAnchorElement");

function HTMLFormElement() {
    this.action = "http://epub.cnipa.gov.cn/Dxb/PageQuery";
    this.method = "post";
    this.enctype = "application/x-www-form-urlencoded";
    this.target = "";
    this.noValidate = false;
    this.outerHTML = '<form></form>';
    this.length = 0;
    this.name = "";
}


window.HTMLFormElement = HTMLFormElement;

function HTMLInputElement() {
  this.baseURI= "http://epub.cnipa.gov.cn/Dxb/PageQuery";
  this.outerHTML='<input></input>';
}

function HTMLAudioElement(){
    this.baseURI= "http://epub.cnipa.gov.cn/Dxb/PageQuery";
    this.outerHTML="<audio></audio>"
}
HTMLAudioElement.prototype.canPlayType = function(attrName) {
    console.log('打印：HTMLAudioElement.canPlayType("' + attrName + '")');
}

function HTMLVideoElement(){
    this.baseURI= "http://epub.cnipa.gov.cn/Dxb/PageQuery";
    this.outerHTML="<video></video>"
}



function HTMLDivElement() {

}
Object.defineProperty(HTMLDivElement.prototype, Symbol.toStringTag, {
    value: 'HTMLDivElement',
    configurable: true
});
HTMLDivElement.prototype.getElementsByTagName = function getElementsByTagName(tagName) {
    console.log('打印：document.createElement("div").getElementsByTagName("' + tagName + '")')
    if (tagName === "i") {
        return [];
    }
}
function HTMLHtmlElement() {
    this.clientWidth = 1528;
    this.clientHeight = 836;
    this.nodeName = "HTML";
    this.tagName = "HTML";
    this.localName = "html";
    this.namespaceURI = "http://www.w3.org/1999/xhtml";
    this.nodeType = 1;
    this.style = styles;

    // 添加常见的 HTML 元素属性
    this.innerHTML = '<head>...</head><body>...</body>';
    this.outerHTML = '<html>...</html>';

    // 添加 getAttribute 方法
    this.getAttribute = function(name) {
        console.log('打印：document.documentElement.getAttribute("' + name + '")');
        if (name === 'lang') {
            return 'zh-CN';
        }
        return null;
    };

    // 添加 setAttribute 方法
    this.setAttribute = function(name, value) {
        console.log('打印：document.documentElement.setAttribute("' + name + '", "' + value + '")');
    };

    // 添加事件监听方法
    this.addEventListener = function(type, listener, options) {
        console.log('打印：document.documentElement.addEventListener("' + type + '")');
    };

    // 添加子节点管理
    this.appendChild = function(child) {
        console.log('打印：document.documentElement.appendChild("' + child + '")');
    };

    this.removeChild = function(child) {
        console.log('打印：document.documentElement.removeChild("' + child + '")');
    };

    // 添加样式表访问
    this.querySelectorAll = function(selector) {
        console.log('打印：document.documentElement.querySelectorAll("' + selector + '")');
        return new HTMLCollection([]);
    };

    this.querySelector = function(selector) {
        console.log('打印：document.documentElement.querySelector("' + selector + '")');
        return null;
    };
}

function HTMLBodyElement() {
    this.clientWidth = 1528;
    this.clientHeight = 836;
    this.scrollLeft = 0;
    this.scrollTop = 0;
    this.clientLeft = 0;
    this.clientTop = 0;
    // this.x-ms-acceleratorkey = "alt+f4";


    // 根据前端页面中的实际元素结构
    this.className = "wrap index-wrap";
    this.id = "";
    this.tagName = "BODY";
    this.localName = "body";
    this.nodeType = 1;

    // 创建页面实际存在的DOM元素
    const wrapDiv = new HTMLDivElement();
    wrapDiv.className = "wrap index-wrap";

    const headerDiv = new HTMLDivElement();
    headerDiv.className = "header";

    const sitebarDiv = new HTMLDivElement();
    sitebarDiv.className = "sitebar";

    const wDiv = new HTMLDivElement();
    wDiv.className = "w";
    wDiv.id = "logo";

    const navbarDiv = new HTMLDivElement();
    navbarDiv.className = "navbar";

    const navWDiv = new HTMLDivElement();
    navWDiv.className = "w";

    const nliUl = {
        className: "nli",
        tagName: "UL",
        localName: "ul",
        nodeType: 1
    };

    // 创建导航链接
    const navLinks = [
        { href: "/Index", className: "hover", innerHTML: "首页" },
        { href: "/SW", className: "", innerHTML: "事务查询" },
        { href: "/Gb", className: "", innerHTML: "专利公报查询" },
        { href: "/Advanced", className: "", innerHTML: "高级查询" },
        { href: "/Ipc", className: "", innerHTML: "IPC分类查询" },
        { href: "/Loc", className: "", innerHTML: "LOC分类查询" },
        { href: "/DataExplain", className: "", innerHTML: "数据说明" }
    ];

    const navItems = navLinks.map(link => {
        return {
            tagName: "LI",
            localName: "li",
            nodeType: 1,
            firstChild: {
                href: link.href,
                className: link.className,
                innerHTML: link.innerHTML,
                tagName: "A",
                localName: "a",
                nodeType: 1
            }
        };
    });

    // 创建主要内容区域
    const mainContentDiv = new HTMLDivElement();
    mainContentDiv.className = "content";
    mainContentDiv.style = { background: "none" };

    const contentWDiv = new HTMLDivElement();
    contentWDiv.className = "w";

    const overviewMainDiv = new HTMLDivElement();
    overviewMainDiv.className = "overview-main";

    const overviewSearchDiv = new HTMLDivElement();
    overviewSearchDiv.className = "overview-search";

    const innerDiv = new HTMLDivElement();
    innerDiv.className = "inner";

    // 创建表单
    const searchForm = {
        id: "query_form",
        action: "/Dxb/PageQuery",
        method: "post",
        tagName: "FORM",
        localName: "form",
        nodeType: 1
    };

    // 创建隐藏输入框
    const hiddenInputs = [
        { id: "pubtype", name: "searchCatalogInfo.Pubtype", value: "1" },
        { id: "searchCatalogInfo_E71_73", name: "searchCatalogInfo.E71_73", value: "阿里巴巴" },
        { id: "searchCatalogInfo_E72", name: "searchCatalogInfo.E72", value: "阿里巴巴" },
        { id: "searchCatalogInfo_Edz", name: "searchCatalogInfo.Edz", value: "阿里巴巴" },
        { id: "searchCatalogInfo_Ti", name: "searchCatalogInfo.Ti", value: "阿里巴巴" },
        { id: "searchCatalogInfo_Abs", name: "searchCatalogInfo.Abs", value: "阿里巴巴" },
        { id: "searchCatalogInfo_Edl", name: "searchCatalogInfo.Edl", value: "阿里巴巴" },
        { id: "searchCatalogInfo_E74", name: "searchCatalogInfo.E74", value: "阿里巴巴" },
        { id: "pageNum", name: "pageModel.pageNum", value: "1" },
        { id: "pageSize", name: "pageModel.pageSize", value: "3" },
        { id: "sortFiled", name: "sortFiled", value: "ggr_desc" },
        { id: "showModel", name: "showModel", value: "1" },
        { id: "isOr", name: "isOr", value: "True" }
    ];

    // 创建搜索输入框
    const searchInput = {
        id: "searchStr",
        className: "txt",
        type: "text",
        placeholder: "请输入专利关键字...",
        value: "阿里巴巴",
        name: "indexSearchModel.searchStr",
        tagName: "INPUT",
        localName: "input",
        nodeType: 1
    };

    // 将这些元素作为子节点
    this.childNodes = new HTMLCollection([
        wrapDiv,        // 0: <div class="wrap index-wrap">
        headerDiv,      // 1: <div class="header">
        mainContentDiv, // 2: <div class="content">
        searchForm,     // 3: <form id="query_form">
        searchInput     // 4: <input id="searchStr">
    ]);

    // 添加appendChild方法
    this.appendChild = function(child) {
        console.log('document.body.appendChild("' + child + '")');
        if (!this.childNodes) {
            this.childNodes = new HTMLCollection([child]);
        } else {
            const newArray = Array.from({length: this.childNodes.length}, (_, i) => this.childNodes[i]);
            newArray.push(child);
            this.childNodes = new HTMLCollection(newArray);
            this.childNodes.length = newArray.length;
        }
    };

    // 添加removeChild方法
    this.removeChild = function(child) {
        console.log('document.body.removeChild("' + child + '")');
        if (!this.childNodes) return null;

        const newArray = Array.from({length: this.childNodes.length}, (_, i) => this.childNodes[i])
            .filter(item => item !== child);
        this.childNodes = new HTMLCollection(newArray);
        this.childNodes.length = newArray.length;
        return child;
    };

    // 添加常见属性
    this.innerHTML = '<div class="wrap index-wrap">...</div>';
    this.outerHTML = '<body class="wrap index-wrap">...</body>';
    this.style = styles;
}
body= watch(new HTMLBodyElement(), "HTMLBodyElement")
obj_toString(body, "HTMLBodyElement");

function FontFaceSet() {
    this.size = 28
    this.status = 'loaded';
    const self = this;
    this.ready = Promise.resolve(self);
    this.onloading = null;
    this.onloadingdone = null;
    this.onloadingerror = null;
}

FontFaceSet.prototype.add = function(font) { console.log("document.fonts.add 被调用"); return this; };
FontFaceSet.prototype.clear = function() { console.log("document.fonts.clear 被调用"); };
FontFaceSet.prototype.delete = function(font) { console.log("document.fonts.delete 被调用"); return true; };
FontFaceSet.prototype.has = function(font) { console.log("document.fonts.has 被调用"); return false; };
FontFaceSet.prototype.keys = function() { return [].keys(); };
FontFaceSet.prototype.values = function() { return [].values(); };
FontFaceSet.prototype.entries = function() { return [].entries(); };
FontFaceSet.prototype.forEach = function(callback) { console.log("document.fonts.forEach 被调用"); };
FontFaceSet.prototype.load = function(font, text) {
    console.log("document.fonts.load 被调用");
    // 返回一个 Promise，模拟字体加载
    return Promise.resolve([font]);
};
Object.defineProperties(FontFaceSet.prototype, {
    ready: {
        get: function() {
            return Promise.resolve(this);
        }
    },
    status: {
        get: function() {
            return 'loaded'; // 或 'loading'
        }
    }
});
fonts = watch(new FontFaceSet(), "FontFaceSet");
obj_toString(fonts, "FontFaceSet");
window.fonts = fonts;


if (!HTMLDocument.prototype._eventListeners) {
    HTMLDocument.prototype._eventListeners = {};
}
function HTMLDocument() {
  this.visibilityState = "visible";
  this.characterSet="UTF-8";
  this.body = body; // 添加 body 属性
  this.head = new HTMLHeadElement();
  this.documentElement = new HTMLHtmlElement(); // 添加 documentElement 属性
  this.fonts = fonts;
  this.scrollingElement = new HTMLHtmlElement();

}
Object.defineProperties(HTMLDocument.prototype, {
    'hidden': {
        get: function() { return false; }, // 页面永远在前端显示
        enumerable: true
    },
    'visibilityState': {
        get: function() { return "visible"; },
        enumerable: true
    },
    // 兼容性前缀检测也是瑞数的最爱
    'webkitHidden': {
        get: function() { return false; },
        enumerable: true
    },
    'webkitVisibilityState': {
        get: function() { return "visible"; },
        enumerable: true
    }
});
HTMLDocument.prototype.createExpression = function createExpression(expression) {
  console.log('打印：document.createExpression("' + expression + '") ');
  return {}
};

HTMLDocument.prototype.appendChild = function appendChild(child) {
  console.log('打印：document.appendChild("' + child + '")');
  return child;
};
HTMLDocument.prototype.removeChild = function removeChild(child) {
  console.log('打印：document.removeChild("' + child + '")');
  return child;
};
Object.defineProperty(HTMLDocument.prototype, 'getElementsByTagName', {
    writable: true,
    enumerable: true,
    configurable: true,
    value: function getElementsByTagName(tagName) {
        console.log('打印document.getElementsByTagName("' + tagName + '")');

        let elements = [];

        if (tagName.toLowerCase() === "script") {
            // 创建多个脚本元素，对应HTML文档中的脚本
            const scriptsData = [
                { type: "text/javascript", r: "m", innerHTML: '"ts_code"'},
                { type: "text/javascript", charset: "utf-8", src: "/z5gPWiiwO6ht/2h9AIDg9eZgY.b4c45da.js", r: "m" }
            ];

            elements = scriptsData.map(data => {
                const script = new HTMLScriptElement();
                script.type = data.type || "text/javascript";
                script.r = data.r || "m";
                script.src = data.src || "";
                script.charset = data.charset || "utf-8";
                script.innerHTML = data.innerHTML || "";
                return watch(script, "HTMLScriptElement");
            });
        }
        else if (tagName.toLowerCase() === "meta") {
            // 如果需要处理 meta 标签
            const meta = new HTMLMetaElement();
            meta.id = "K5MK4FPPNWrv";
            meta.r = "m";
            elements = [watch(meta, "HTMLMetaElement")];
        }
        if(tagName.toLowerCase() === "base"){
          return []
        }

        return new HTMLCollection(elements);
    }
});
HTMLDocument.prototype.getElementById = function getElementById(id) {
    console.log(`打印：document.getElementById("${id}")`);
    if (id === "K5MK4FPPNWrv") {
        const meta = new HTMLMetaElement();
        return watch(meta, "HTMLMetaElement");
    }
    if (id === 'a') { // 改为 ===
        const a = watch(new HTMLAnchorElement(), 'HTMLAnchorElement');
        obj_toString(a, 'HTMLAnchorElement');
        return a;
    }
    if (id === 'bb82kj') {
       return fonts
    }
    return null;
};
HTMLDocument.prototype.addEventListener = function(type, listener, options) {
    console.log('打印：document.addEventListener("' + type + '")');

    if (!this._eventListeners) {
        this._eventListeners = {};
    }

    if (!this._eventListeners[type]) {
        this._eventListeners[type] = [];
    }

    if (this._eventListeners[type].indexOf(listener) === -1) {
        this._eventListeners[type].push({
            listener: listener,
            options: options || false
        });
    }

    // 特殊处理各种事件类型
    switch(type) {
        case 'mousedown':
        case 'keydown':
        case 'click':
        case 'driver-evaluate':
        case 'webdriver-evaluate':
        case 'selenium-evaluate':
        case 'keyup':
        case 'touchstart':
        case 'touchmove':
        case 'input':
        case 'scroll':
        case 'touchend':
        case 'contextmenu':
        case 'mousemove':
        case 'mouseenter':
        case 'mouseleave':
        case 'beforeunload':
        case 'fontloader':
        case 'fontfaceSetLoad':

            console.log(`[EVENT_HOOK] 捕获到文档事件: ${type}`);
            break;
        default:
            break;
    }
};
HTMLDocument.prototype.dispatchEvent = function(event) {
    console.log('打印：document.dispatchEvent("' + event.type + '")');

    if (!event || !event.type) {
        console.error('Invalid event object in dispatchEvent');
        return false;
    }

    if (!this._eventListeners || !this._eventListeners[event.type]) {
        return true;
    }

    event.target = this;
    event.currentTarget = this;

    const listeners = this._eventListeners[event.type];
    for (let i = 0; i < listeners.length; i++) {
        const listenerObj = listeners[i];
        try {
            if (typeof listenerObj.listener === 'function') {
                listenerObj.listener.call(this, event);
            } else if (typeof listenerObj.listener === 'object' && typeof listenerObj.listener.handleEvent === 'function') {
                listenerObj.listener.handleEvent(event);
            }
        } catch (e) {
            console.error('Error in document event listener:', e);
        }
    }

    return !event.defaultPrevented;
};
HTMLDocument.prototype.createEvent = function createEvent(eventType) {
    console.log(`打印：document.createEvent("${eventType}")`);
    // return safeCreateEvent(eventType);
};
HTMLDocument.prototype.querySelector = function querySelector(selector) {
    console.log(`打印：document.querySelector("${selector}")`);
    if(selector =='#query_form'){
        return watch(new HTMLFormElement(), "HTMLFormElement");
    }
    // return null;
    debugger;
}

Object.defineProperty(HTMLDocument.prototype, "createElement", {
  writable: true,
  enumerable: true,
  configurable: true,
  value: function createElement(tagName) {
    console.log(`打印document.createElement("${tagName}")`);
    if(tagName=='div'){
        div = new HTMLDivElement();
        obj_toString(div, "HTMLDivElement");
        return div;
    }
    if(tagName=='form'){  // 添加表单支持
        form = new HTMLFormElement();
        obj_toString(form, "HTMLFormElement");
        return form;
    }
    if(tagName=='canvas'){
        canvas = new HTMLCanvasElement();
        obj_toString(canvas, "HTMLCanvasElement");
        return canvas;
    }
    if(tagName=='script'){
        script = new HTMLScriptElement();
        obj_toString(script, "HTMLScriptElement");
        return script;
    }
    if(tagName=='a'){
        a = new HTMLAnchorElement();
        obj_toString(a, "HTMLStyleElement");
        return a;
    }
    if(tagName=='audio'){
        audio = new HTMLAudioElement();
        obj_toString(audio, "HTMLAudioElement");
        return audio;
    }
    if(tagName=='video'){
        video = new HTMLVideoElement();
        obj_toString(video, "HTMLVideoElement");
        return video;
    }
  }


});
document = new HTMLDocument();
document.all=document;
// 原型设置后再次确保
Object.defineProperty(document, 'fonts', {
    get: function() {
        if (!this._fonts) {
            this._fonts = fonts; // fonts 已经在前面定义
        }
        return this._fonts;
    },
    set: function(value) {
        this._fonts = value;
    },
    configurable: true,
    enumerable: true
});

Object.setPrototypeOf(document, HTMLDocument.prototype);
obj_toString(document, "HTMLDocument");
Object.setPrototypeOf(document, HTMLDocument.prototype); //document继承HTMLDocument
obj_toString(document, "HTMLDocument");
let _cookie = "";

function safeCreateEvent(type, isTrusted = true) {
    return new EventTarget(type, { isTrusted });
}
// 模拟事件触发系统
function triggerWindowEvents() {
    // 模拟 load 事件
    setTimeout(() => {
        window.dispatchEvent(safeCreateEvent("load", true));
        if (typeof window.onload === 'function') {
            try {
                window.onload(safeCreateEvent("load", true));
            } catch (e) {}
        }
    }, 100);

    // 模拟 popstate 事件
    setTimeout(() => {
        const popstateEvent = new EventTarget("popstate", {isTrusted: false});
        window.dispatchEvent(popstateEvent);
    }, 0);
}

function triggerDocumentEvents() {
    // 模拟各种文档事件
    const eventsToTrigger = [
        'mousedown', 'keydown', 'click',
        'driver-evaluate', 'webdriver-evaluate', 'selenium-evaluate',
        'keyup', 'touchstart', 'touchmove', 'input', 'scroll',
        'touchend', 'contextmenu', 'mousemove', 'mouseenter',
        'mouseleave', 'beforeunload', 'fontloader', 'fontfaceSetLoad'
    ];

    eventsToTrigger.forEach((eventType, index) => {
        setTimeout(() => {
            const event = new EventTarget(eventType, {isTrusted: eventType.includes('-evaluate') ? false : true});
            document.dispatchEvent(event);
        }, 100 + (index * 50)); // 间隔触发
    });
}

function Navigator() {}
Navigator.prototype.appVersion =
  "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36";
Navigator.prototype.appCodeName = "Win32";
Navigator.prototype.platform = "Win32";
Navigator.prototype.vendor = "Google Inc.";
Navigator.prototype.userAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36";
Navigator.prototype.language = "zh-CN";
Navigator.prototype.mimeTypes = [];
Navigator.prototype.maxTouchPoints = 0;
Navigator.prototype.getBattery = function() {
    console.log("[Mock] navigator.getBattery() 被调用");
    // 必须返回 Promise
    return Promise.resolve(watch(new BatteryManager(), "BatteryManager"));
};
obj_toString(Navigator.prototype.getBattery, "getBattery");
Navigator.prototype.plugins = [];
Navigator.prototype.languages = ["zh-CN", "zh"];
Navigator.prototype.cookieEnabled = true;
Navigator.prototype.webdriver = false;
Navigator.prototype.connection = {
    downlink: 10,
    effectiveType: "4g",
    rtt: 50,
    saveData: false
};
navigator = new Navigator();
Object.setPrototypeOf(navigator, Navigator.prototype);
obj_toString(navigator, "Navigator");
window.clientInformation=navigator;
//location
function Location() {
  this.hash = "";
  this.host = "epub.cnipa.gov.cn";
  this.hostname = "epub.cnipa.gov.cn";
  this.href = "http://epub.cnipa.gov.cn/Dxb/PageQuery";
  this.origin = "http://epub.cnipa.gov.cn";
  this.pathname = "/Dxb/PageQuery";
  this.port = "";
  this.protocol = "http:";
  this.search = "";
}
Location.prototype.replace = function (args) {
  console.log('打印：location.replace("' + args + '")');
};
location = new Location();

Object.setPrototypeOf(location, Location.prototype);
obj_toString(location, "Location");

//history
function History() {
  this.length = 2;
  this.scrollRestoration = "auto";
}
History.prototype.replaceState = function () {
  console.log("打印：history.replaceState()");
};
History.prototype.pushState = function () {
  console.log("打印：history.pushState()");
};
history = new History();
Object.setPrototypeOf(history, History.prototype);
obj_toString(history, "History");

//screen
function Screen() {
  this.availHeight = 824;
  this.availWidth = 1536;
  this.colorDepth = 32;
  this.height = 864;
  this.pixelDepth = 32;
  this.width = 1536;
  this.availLeft=0;
  this.availTop=0
}
screen = new Screen();
Object.setPrototypeOf(screen, Screen.prototype);
obj_toString(screen, "Screen");

//localStorage
// 替换原有的 Storage 相关代码
function Storage() {
    this._data = {};
}

Storage.prototype.getItem = function(key) {
    console.log(`[Storage] 读取: ${key}`);
    return this._data.hasOwnProperty(key) ? String(this._data[key]) : null;
};

Storage.prototype.setItem = function(key, value) {
    console.log(`[Storage] 设置: ${key} = ${value}`);
    this._data[key] = String(value);
};

Storage.prototype.removeItem = function(key) {
    console.log(`[Storage] 删除: ${key}`);
    delete this._data[key];
};

Storage.prototype.clear = function() {
    console.log(`[Storage] 清空`);
    this._data = {};
};

Object.defineProperty(Storage.prototype, 'length', {
    get: function() { return Object.keys(this._data).length; }
});

localStorage = new Storage();
Object.setPrototypeOf(localStorage, Storage.prototype);
obj_toString(localStorage, "Storage");

// 瑞数极度依赖 sessionStorage，必须同步挂载
window.sessionStorage = localStorage;

// 1. 定义 Performance 构造函数
function Performance() {
    // 瑞数经常会检测 performance.memory 或者 performance.timing
    this.memory = {
        jsHeapSizeLimit: 4294705152,
        totalJSHeapSize: 25400000,
        usedJSHeapSize: 21500000
    };

    this.timing = {
        navigationStart: Date.now() - 5000,
        fetchStart: Date.now() - 4900,
        domInteractive: Date.now() - 2000,
        domContentLoadedEventEnd: Date.now() - 100,
        loadEventEnd: Date.now()
    };
}

// 2. 补充原型方法
Performance.prototype.now = function() {
    // 返回一个相对时间戳，模拟页面加载运行的时间
    return Date.now() - this.timing.navigationStart;
};

// 3. 将其实例化并挂载到 window 上
window.performance = new Performance();

// 4. 然后再执行你原本的原型设置和 toString 保护（这部分你代码里应该已经有了）
Object.setPrototypeOf(window.performance, Performance.prototype);
obj_toString(Performance, "Performance");

setTimeout(() => {
    triggerWindowEvents();
    triggerDocumentEvents();
}, 0);

// 模拟 DOMContentLoaded 事件
if (!document.readyState) {
    document.readyState = 'loading';
}

setTimeout(() => {
    document.readyState = 'interactive';
    document.dispatchEvent(new EventTarget("DOMContentLoaded", {isTrusted: true}));
}, 120);

setTimeout(() => {
    document.readyState = 'complete';
    window.dispatchEvent(new EventTarget("load", {isTrusted: true}));

    if (typeof window.onload === 'function') {
        window.onload(new EventTarget("load", {isTrusted: true}));
    }
}, 280);
localStorage = watch(localStorage, "localStorage");
screen = watch(screen, "screen");
location = watch(location, "location");
history = watch(history, "history");
window = watch(window, "window");
document = watch(document, "document");
navigator = watch(navigator, "navigator");
window.setInterval = function setInterval() {};
// 最后设置表单实例，确保所有原型都已定义
window.document = document;




function XMLHttpRequest() {
    this.readyState = 0;
    this.status = 0;
    this.responseText = "";
    this.responseType = "";
    // 可以根据需要用 watch 包裹实例
    return watch(this, "XMLHttpRequest_instance");
}
window.__ruishu_suffix_url = ""; // 新增一个全局变量
// 补充标准的现代浏览器 XHR 原型链方法
XMLHttpRequest.prototype.open = function(method, url, async) {
    console.log(`[Native Call] 原始 open 被调用: ${method} -> ${url}`);

    // 【关键】：把瑞数处理过最终传到底层的 URL 存下来
    window.__ruishu_suffix_url = url;

    return url;
};
XMLHttpRequest.prototype.send = function(data) {
    console.log(`[Native Call] 原始 send 被调用, 数据: ${data}`);
};
XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
    console.log(`[XHR] 设置请求头: ${header} = ${value}`);
};
XMLHttpRequest.prototype.overrideMimeType = function() {};

// 别忘了伪造 toString
obj_toString(XMLHttpRequest, "XMLHttpRequest");
obj_toString(XMLHttpRequest.prototype.open, "open");
obj_toString(XMLHttpRequest.prototype.send, "send");
window.XMLHttpRequest = XMLHttpRequest;

// require("./endr_js.js");
//
// require("./dey_js.js");


"ts_code"

"functo_code"


// ==================== 3. 优化后的后缀提取函数 ====================
function get_suffix(method, url) {
    // 每次调用前清空上一次的记录
    window.__ruishu_suffix_url = "";

    // 实例化 XHR，此时的 XHR 已经是被瑞数魔改过的了
    const xhr = new window.XMLHttpRequest();

    try {
        // 传入相对路径，激活瑞数
        xhr.open(method, url, true);
        xhr.send(null);
    } catch (e) {
        // 忽略报错
    }

    // 此时底层 open 已被触发，全局变量里已经存了拼接后的完整 URL
    let finalUrl = window.__ruishu_suffix_url || url;

    return finalUrl;
}
// ==================== 4. 测试调用 ====================
var cookies = async function () {
    function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
    try {
        // 等待瑞数异步逻辑执行完毕
        await sleep(3000);

        var cookieStr = document.cookie;
        // 【关键】传入相对路径
        var dynamicSuffix = get_suffix('POST', '/Dxb/PageQuery');

        // 将 cookie 和后缀一起返回
        return {
            cookie: cookieStr,
            suffix: dynamicSuffix
        };
    } catch (error) {
        console.error('特征提取错误:', error);
        throw error;
    }
};

async function test() {
    try {
        const result = await cookies();
        console.log('====== 提取结果 ======');
        console.debug(result.suffix);
        console.debug(result.cookie);
        console.log('======================');

        // 挂载到导出对象，供外部宿主（run_env.js）读取
        if (typeof exports !== 'undefined') {
            exports.cookieResult = result;
        }
        window.lastCookieResult = result;
    } catch (error) {
        if (typeof exports !== 'undefined') {
            exports.error = error.message;
        }
    }
}
test();