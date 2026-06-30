const { createCanvas } = require('canvas');
global.process = undefined;
global.dirname = undefined;
global.__filename = undefined;
global.globalthis = undefined;

console.log=function (){}


var _content='LSziZUMRpij1wjurTzV91awNUvAc3J3eEahUBEuUDHlcAwXA3JoyLtikn3_FSJ.m107nUBgeysaoyajBndJALG'
// var corsToken='CfDJ8B0eQl1Nb3NGrYITqvSclwf66rjObAovUMDka0rg1Enmx7f08L3j4fVGeHnzHYbOvoy0OvdobHJ47KxKBbSqD3JvYNtMof-UsDVrvXjELSX7vB3Q35BnwT3JfBnf00dDjQIqGSn1IGHHeMgbfCHTCNc'

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
var corsToken='CfDJ8B0eQl1Nb3NGrYITqvSclwf66rjObAovUMDka0rg1Enmx7f08L3j4fVGeHnzHYbOvoy0OvdobHJ47KxKBbSqD3JvYNtMof-UsDVrvXjELSX7vB3Q35BnwT3JfBnf00dDjQIqGSn1IGHHeMgbfCHTCNc';
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
                { type: "text/javascript", r: "m", innerHTML: '$_ts=window["$_ts"];if(!$_ts)$_ts={};$_ts.nsd=60693;$_ts.cd="qhzErpAloAGqWPGmcqWntqAVqqGrcq3nlrAgcqAErsEAqGVTcqA2mqqEHaGlWfqVqqGccqWnlqGrokqVqqGocqAnlrAqcqErEfVvJA9lxpAqq1EtmqqEqqGrcfqVqqGocqAnlqGkWPGlmkGrEG7EqqGrWkVtrcWVqqGdcqAnlrAqcqEEquEAmqqEiAGDWfqVqqGlcqVnlqGcJsWlErAqcqQErkEAmqqEqGG4WfqVqqGrcq3nlqGmWPGcch3ThR7rJslmrkEnbnikWH2IGseK0MFEdT9QzKfguHOVTB5C2dwKNbAAsfwmJqWmrA3lr4AkGmy5xkmie9gaUVrmWTUXY0Y1s2mrMj06iCAvHmewjnZfxn96KYX6EU2uWlpX3dT4KKS6I9SSnlryVmxkJD8yiYf8J1LbxhQuU2fgtbNueCZBU2gCtDOXMCZNF6JLF.wzwb2NtbNueCe8tYgCtDOXMCZNF6JLF.wzwb2NtbNueCe8KmGWr14NwbA0p6SPW_rWYlzU1ORm4OG_YTxts2oVFOGZRkw5YWT.3OgZpDNq5oxhAsyE1C_OVYw1IsrHJHZg8srPY2JBZvpWWCTnHuUhJlw1wsEaw7fBQug6MOTo09w9HDrQ3T5T3swbWsJGR4YNQkg6s9V6_VTcHm361KjT3swbWsJGR4YNQkyp1bJX5bfrYoxQ3V_T3swbWsJGR4YNQkg0WUJf.vmHsoR2A6tTFUq5WDWapeJKRKToJKYLLlfXHVNJs9keVlLCQuTYIeNvKY3TsDJITo3gQbz6Muk3FKQ0WOwftH963kla3bVLZUqgUTxtVvsFVKm6WTw7tH963kla3bVLZUqgtCQnRutXRCE.M6VdsFyi1kmkY2pEuomTHbmX3bsZi6V6ATYf1R7kqaATrGV6bSx.QUmCHOKXWsquJOVnJtl4WaVkRkr2.uRvrA3aWutMcsEuJkQnWtLaWOWmqsaTLOl0JslDmr6U6_su518wDzk4tKr3T9gDPy3uAwhumN9XrRGDrGWrqxZkEaS1dk6mtXKJEQlHVNNJZlxxEAw9gxRaT8VmwkJv0DajrAZ0JsiXiOACJuASrNLnqaZ0Wsa0js74JOWdrqFMqaWmrAQ0rNL0qBEnIcfv5bqBRDf0tDILMPe9QCZLRHNLhCw9QPf9evWBRCSLtDK63DxvtKY6wMwGQoWNRKz.zCruw12PRUt6RCeNtKx.RMwvMolN3bz2gnebIKqj3KvBhCYNRcNPFBGBRKN.tbxN4ne2FbzntDod31ePMDqL38lBRDTjtbSj_ne.wUVjMohghCNbFPNzFHEBFbzOtbTL_cejwbLjMvK6FKx6tKS03MwNQCrPtbyTeD0BMCpaR1.6FblNFK2OtBRjRn2LwOqjevJPtKGnR1.CQuqNFoROtBRLw12LFKqjebSTtKfBF1.CQ6WNFoYztBRuRbENFKR7zCSGI12N3CD6MDevtK2L34w7wCWNwv0j_6NGtUYvwn..RDgNwURNtXzuQc2Twvqj_Cw2tUYCQo_6QCTPtURzRMwuMCaNwvwPz6xj3n26Qo_6QKENwC7LwHNXh6wLQD3j_KR9tUwOwn.NwCVNwCwCtXf7h6RvFPfTdU7BwvxvtoU7R1eCQClLw8xah6m9wcfn5v9BQKSGtohnRKVNQK2CwHyzwn2SIvqj46w2tUJT3c.zQoqNQ6YutXT4Rn2nFKxGz6p73CW0tooCw1enFDQLQINTh6xTw1f55KgBIUY.to46QceeFUYZtXJaMn2eFCGjg1eyMoVjRUMah6JNMoYatBxu3GVmrGrRBnwurAmREDkBqawFEKmarNeQxCmzrG3njGWcJGVoJAFFWGWmrA3lrN7mFkelpTYlbTz3x6JvwPMuRbxf3op6Y8eSFbzPYUm9B1V2wCrTwDvTQD3.MKJ23BySQczOFURk5br.h1TaRK.XRPZ2MbJeh402xKTGRCrO_UrAQUwBFbD4tkg2MbJexW3xqaA0";if($_ts.lcd)$_ts.lcd();'},
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


$_ts=window["$_ts"];if(!$_ts)$_ts={};$_ts.nsd=60693;$_ts.cd="qhzErpAloAGqWPGmcqWntqAVqqGrcq3nlrAgcqAErsEAqGVTcqA2mqqEHaGlWfqVqqGccqWnlqGrokqVqqGocqAnlrAqcqErEfVvJA9lxpAqq1EtmqqEqqGrcfqVqqGocqAnlqGkWPGlmkGrEG7EqqGrWkVtrcWVqqGdcqAnlrAqcqEEquEAmqqEiAGDWfqVqqGlcqVnlqGcJsWlErAqcqQErkEAmqqEqGG4WfqVqqGrcq3nlqGmWPGcch3ThR7rJslmrkEnbnikWH2IGseK0MFEdT9QzKfguHOVTB5C2dwKNbAAsfwmJqWmrA3lr4AkGmy5xkmie9gaUVrmWTUXY0Y1s2mrMj06iCAvHmewjnZfxn96KYX6EU2uWlpX3dT4KKS6I9SSnlryVmxkJD8yiYf8J1LbxhQuU2fgtbNueCZBU2gCtDOXMCZNF6JLF.wzwb2NtbNueCe8tYgCtDOXMCZNF6JLF.wzwb2NtbNueCe8KmGWr14NwbA0p6SPW_rWYlzU1ORm4OG_YTxts2oVFOGZRkw5YWT.3OgZpDNq5oxhAsyE1C_OVYw1IsrHJHZg8srPY2JBZvpWWCTnHuUhJlw1wsEaw7fBQug6MOTo09w9HDrQ3T5T3swbWsJGR4YNQkg6s9V6_VTcHm361KjT3swbWsJGR4YNQkyp1bJX5bfrYoxQ3V_T3swbWsJGR4YNQkg0WUJf.vmHsoR2A6tTFUq5WDWapeJKRKToJKYLLlfXHVNJs9keVlLCQuTYIeNvKY3TsDJITo3gQbz6Muk3FKQ0WOwftH963kla3bVLZUqgUTxtVvsFVKm6WTw7tH963kla3bVLZUqgtCQnRutXRCE.M6VdsFyi1kmkY2pEuomTHbmX3bsZi6V6ATYf1R7kqaATrGV6bSx.QUmCHOKXWsquJOVnJtl4WaVkRkr2.uRvrA3aWutMcsEuJkQnWtLaWOWmqsaTLOl0JslDmr6U6_su518wDzk4tKr3T9gDPy3uAwhumN9XrRGDrGWrqxZkEaS1dk6mtXKJEQlHVNNJZlxxEAw9gxRaT8VmwkJv0DajrAZ0JsiXiOACJuASrNLnqaZ0Wsa0js74JOWdrqFMqaWmrAQ0rNL0qBEnIcfv5bqBRDf0tDILMPe9QCZLRHNLhCw9QPf9evWBRCSLtDK63DxvtKY6wMwGQoWNRKz.zCruw12PRUt6RCeNtKx.RMwvMolN3bz2gnebIKqj3KvBhCYNRcNPFBGBRKN.tbxN4ne2FbzntDod31ePMDqL38lBRDTjtbSj_ne.wUVjMohghCNbFPNzFHEBFbzOtbTL_cejwbLjMvK6FKx6tKS03MwNQCrPtbyTeD0BMCpaR1.6FblNFK2OtBRjRn2LwOqjevJPtKGnR1.CQuqNFoROtBRLw12LFKqjebSTtKfBF1.CQ6WNFoYztBRuRbENFKR7zCSGI12N3CD6MDevtK2L34w7wCWNwv0j_6NGtUYvwn..RDgNwURNtXzuQc2Twvqj_Cw2tUYCQo_6QCTPtURzRMwuMCaNwvwPz6xj3n26Qo_6QKENwC7LwHNXh6wLQD3j_KR9tUwOwn.NwCVNwCwCtXf7h6RvFPfTdU7BwvxvtoU7R1eCQClLw8xah6m9wcfn5v9BQKSGtohnRKVNQK2CwHyzwn2SIvqj46w2tUJT3c.zQoqNQ6YutXT4Rn2nFKxGz6p73CW0tooCw1enFDQLQINTh6xTw1f55KgBIUY.to46QceeFUYZtXJaMn2eFCGjg1eyMoVjRUMah6JNMoYatBxu3GVmrGrRBnwurAmREDkBqawFEKmarNeQxCmzrG3njGWcJGVoJAFFWGWmrA3lrN7mFkelpTYlbTz3x6JvwPMuRbxf3op6Y8eSFbzPYUm9B1V2wCrTwDvTQD3.MKJ23BySQczOFURk5br.h1TaRK.XRPZ2MbJeh402xKTGRCrO_UrAQUwBFbD4tkg2MbJexW3xqaA0";if($_ts.lcd)$_ts.lcd();

if($_ts.cd){(function(_$gp,_$$m){var _$_g=0;function _$dY(){var _$iC=[71];Array.prototype.push.apply(_$iC,arguments);return _$$Q.apply(this,_$iC);}function _$_K(_$jM){return _$dY;function _$dY(){_$jM=0x3d3f*(_$jM&0xFFFF)+0x269ec3;return _$jM;}}function _$kR(_$dY,_$cM){var _$h7,_$fv,_$e7; !_$cM?_$cM=_$ax:0,_$h7=_$dY.length;while(_$h7>1)_$h7-- ,_$e7=_$cM()%_$h7,_$fv=_$dY[_$h7],_$dY[_$h7]=_$dY[_$e7],_$dY[_$e7]=_$fv;function _$ax(){return Math.floor(_$_p()*0xFFFFFFFF);}}var _$cM,_$h7,_$eD,_$bZ,_$iy,_$hB,_$g1,_$_p,_$cp,_$dW;var _$$x,_$fM,_$f7=_$_g,_$j2=_$$m[0];while(1){_$fM=_$j2[_$f7++];if(_$fM<12){if(_$fM<4){if(_$fM===0){_$dW=_$iy['$_ts']={};}else if(_$fM===1){_$dW.lcd=_$dY;}else if(_$fM===2){_$$x= !_$cp;}else{_$dW=_$iy['$_ts'];}}else if(_$fM<8){if(_$fM===4){return;}else if(_$fM===5){_$$Q(71);}else if(_$fM===6){ !_$$x?_$f7+=0:0;}else{_$f7+=2;}}else{if(_$fM===8){ !_$$x?_$f7+=2:0;}else if(_$fM===9){_$$x=_$dW;}else if(_$fM===10){_$eD=[4,16,64,256,1024,4096,16384,65536];}else{_$iy=window,_$hB=String,_$g1=Array,_$cM=document,_$_p=Math.random,_$h7=Math.round,_$cp=Date;}}}else ;}function _$$Q(_$hq,_$ei,_$gP){function _$$B(){return _$$i.charCodeAt(_$lm++ );}function _$eZ(_$dY,_$cM){var _$h7,_$fv;_$h7=_$dY.length,_$h7-=1;for(_$fv=0;_$fv<_$h7;_$fv+=2)_$cM.push(_$hQ[_$dY[_$fv]],_$_6[_$dY[_$fv+1]]);_$cM.push(_$hQ[_$dY[_$h7]]);}function _$de(){return'\x74\x6f\x53\x74\x72\x69\x6e\x67';}var _$dY,_$cM,_$h7,_$fv,_$e7,_$ax,_$_g,_$f7,_$$x,_$iC,_$fM,_$j2,_$f$,_$_W,_$em,_$_6,_$_A,_$$i,_$_s,_$lm,_$a3,_$hP,_$hQ;var _$_S,_$dw,_$_7=_$hq,_$b0=_$$m[1];while(1){_$dw=_$b0[_$_7++];if(_$dw<98){if(_$dw<64){if(_$dw<16){if(_$dw<4){if(_$dw===0){_$$x=0;}else if(_$dw===1){ !_$_S?_$_7+=4:0;}else if(_$dw===2){ !_$_S?_$_7+=-34:0;}else{_$iC.push(_$fM.substr(0,_$em()%5));}}else if(_$dw<8){if(_$dw===4){_$a3=_$$B();}else if(_$dw===5){_$_S=_$ei===undefined||_$ei==="";}else if(_$dw===6){_$_S= !_$_W;}else{_$dY="_$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split('');}}else if(_$dw<12){if(_$dw===8){_$cM=_$dW.nsd;}else if(_$dw===9){_$iC.push("})(",'$_ts',".scj,",'$_ts',".aebi);");}else if(_$dw===10){_$fM='\n\n\n\n\n';}else{_$_7+=-5;}}else{if(_$dw===12){ !_$_S?_$_7+=3:0;}else if(_$dw===13){_$_S=_$fv==64;}else if(_$dw===14){_$hQ=_$$i.substr(_$lm,_$f7).split(_$hB.fromCharCode(257));}else{_$dW.nsd=_$bZ;}}}else if(_$dw<32){if(_$dw<20){if(_$dw===16){_$bt(71);}else if(_$dw===17){_$_7+=2;}else if(_$dw===18){_$_W=_$$Q(69);}else{_$bt(33,_$iC);}}else if(_$dw<24){if(_$dw===20){_$e7=_$$B();}else if(_$dw===21){_$kR(_$cM,_$gP);}else if(_$dw===22){_$$i="ŃĲɳɴĲ৛\x00址,ā=ā[ā(āā.ā;ā],ā(){return ā);ā?ā+ā;}function ā),ā<ā){var ā=0,ā(){ā !ā[31]](ā=0;ā[ --ā]=ā:ā++ ]=ā&&ā>>ā[ ++ā&ā(),ā+=ā.push(ā[28]](ā):ā= !ā);}function ā||ā++ )ā=[],ā!==ā=new ā){ā=(ā===ā(){var ā[58]];āfunction ā!=ā)ā){return ā));ā[0],ā>ā-ā?(āreturn ā&& !ā>>>ā<=ā();ā|| !ā[1],ā;return ā*ā= !(ā][ā;for(ā[45],ā[28]]((ā<<ā==ā++ ){ā&&(ā[45]),ā+1],ā){if(ā:0,ā[7],ā;}ā={},ā++ ]=(ā/ā[38]]==ā[7];ā;function ā)return ā){}ā):(ā||(ā[42])&ā++ ]<<ā^ā[3],ā[58]]===ā|| !(ā](ā[58]],ā[45]]^ā[49];ā[35])&ā>=ā++ ;ā[50]](ā-=ā,0,ā[2],ā,true);ā]):ā(){return +ā|=ā in ā[12]](ā[6][ā[43])&ā[2]&ā];if(ā):0,ā]===ā({ā[8][ā[17]][ātry{ā=1;ā)?ā[20]](ā=( !ā&& !(ā++ ),ā:1,ā=0;for(ā&&( !ā);if(ā[33];ā<0?ā});ā[3];ā;}}function ā; ++ā];ā.y-ā))&&ā+=1,ā[4],ā[0]](ā[58]]-ā.length;ā);return ā[17][ā()[ā[49]),ā[24];ā);function ā[36]](ā.x-ā(89)-ā++ ],ā=[];for(ā=((ā[42];ā[42]&ā]],ā=0:ā[35]&ā[45]||ā){ typeof ā=[ā+2],ā[1]](ā[58]]>ā[37],ā=true,ā[9]+ā[5],ā(0);ā))|| !ā[50]](0,ā.x*ā++ ,ā+=1:0;ā.y*ā[42]);}function āreturn;ā[35];ā[56]](ā;if(ā){}}function ā[29]](ā[25],ā(89);ā];}function ā[5]),ā ++ā=0;if(ā=1,ā[2]+ā]|ā))||ā);}catch(ā[51]](ā[42])|ā));}function ā=this.ā++ ):ā[58]]/ā[49]?ā[49],ā);}ā=[];ā[54],ā[38][ā-- ,ā();if(ā[1]+ā[5];ā&& !( !ā], !ā[20][āfor(ā[35])|(ā[(ā)):ā.x)+(ā[4][ā[19];ā[89]]((ā[3]?ā;)ā+=0:0;ā+=2:0;ā)+ā===0?(ā[43]^ā[23],ā%ā[16];ā; typeof ā[18]](ā]);ā[56])<<ā[29],ā[22];ā[48]](ā[42]),ā[26])<<ā[49]][ā-1],ā()),ā();}function ā[45]?ā[43]]^ā[10]?ā]=104,ā))&& !ā[65]);}function ā+1])):ā[45]]<<ā[34]))+ā[23]),ā.y),ā[80]);}function ā[43])|(ā[58]]-1;ā[59]+ā[32]?ā[12];ā[35]);}function ā[19],ā[92]);}function ā[25])]))&ā=0;while(ā[37];return ā)if(ā[15]);return ā[24]||ā+=5:0;ā]=(ā[3]+ā[42]^ā-=3,ātry{if(ā);else return ā){return(ā[56]),ā=0:0,ā];}ā]^=ā)|0,ā[7]^((ā[34][ā[66]](ā;if( !ā):0;return ā]:ā].ā)%ā)&ā-=4,ā+=4:0;ā||( !ā[50]](0),ā.slice(ā[23];ā[60],ā[15]+ā.join('');}function ā[16],ā[420](ā,this.ā++ )if(ā+=1;ā-=2,ā()][ā[47]](ā[44]];ā[3]&&ā[49]],ā[4]](ā[7]);}function ā[31]);}function ā.length,ā+1)%ā[58]]+ā[58]]%ā[16]);ā[16])&ā>0;ā('');ā+=(ā[68]);}function ā:0;return ā)&&ā[95]);}function ā[45]);}function ā[38]=ā()*ā[35]);ā[17];ā[45])|ā[81]),ā[94]+ā[3]<=ā[71]][ā[5]);ā[10];ā[5]+ā.y)/(ā[40][ā[24]?ā[2]);ā[22]](ā[27]][ā[34]];ā++ ];else if((ā[((ā[4]](null,ā[45];return ā;try{ā[80],ā.x,ā.x+ā[42]&&ā);else if(ā[77]);}function ā)),ā(89),ā[28]]({ā)){ā[58]]),ā[29];ā)?(ā[47]);}function ā};function ā[84]:0,ā[63]),ā);for(ā);while(ā])):ā[4]);}function ā|| !( !ā[32];return ā[25]](ā,{ā[91]);}function ā+1]&ā[6]],ā);}}catch(ā[25])<<ā[24]),ā)||(ā=false:0,ā[52]:0,ā[56]];ā[76]);}function ā[88]](ā)==ā[3]=ā[4]);ā[25]?ā[42],ā+=7:0;ā[13];ā[15],ā[59])[0],ā+=5;ā[18];ā+=3:0;ā=false,ā)===ā[48]);}function ā[1]);}function ā[37])|(ā[28]](((ā[7]?ā.x),ā[6]=ā;){ā[49]&&ā[38]);}function ā[52]),ā;}}catch(ā[66]][ā.split('');for(ā+3],ā]]:ā[49]);return ā[74]][ā]<ā]+ā))ā[53]);}function ā[28][ā[43]+ā[23]=ā[41]);}function ā():0,ā[58]];for(ā,'');}function ā[55]);}function ā[11];ā[20]);}function ā+=-9;ā];}}function ā[52]?ā):0;for(ā[4];ā[42])),ā]!==ā[7]),ā[10]);ā!=null?(ā(220,ā[8];ā:0;ā[45]:0,ā[0];ā[0]+ā[61]](ā[61]]=ā>0||ā[0]^ā[0][ā]=\"\",ā(9,ā[7]][ā[48],ā[7]],ā[5]](ā[18]);ā[0]);ā[3]),ā]):(ā[58]](ā.charCodeAt(ā())in ā>0?ā[8]);}function ā[41]](ā<<1^(ā[33],ā[14];ā[50],ā[50]+ā[39]);}function ā[8]),ā[59]);}function ā]>=ā[10]=ā()?ā+=-4;ā[30];ā[35]),ā[30]+ā))return ā):0):ā();for(ā[53]),ā();return ā[36])|((ā[4])&ā.z;ā[57])+ā[54]),ā)try{if(ā(1,0),ā[94]^ā)return false;return ā[71]](ā|=1;ā)):0;if(ā[50]);return ā[47]);return ā[9],ā[1];ā[44](ā[1]>ā[1]=ā[40],ā[1]);if(ā[40];ā[42]);ā[1][ā[1]^ā[87]);}function ā[37][ā[84]),ā[31]](this,ā;else ā[24].ā[24],ā[24]);return ā[20]+ā[42])return ā[20]=ā[20];ā[23]]+ā[23]](ā[32]];ā[22]];ā[57]);return ā[88],ā[58]]>=ā||0,ā[42]||ā+2])):ā[18]);}function ā[26]](ā[25]]^ā(){return(ā>0)for(ā;return[ā(){return[ā(29,ā[73]),ā[68]+ā(384,ā[14]),ā[13]);ā()];ā);}}function ā:(ā[0]=ā[57]);}ā[12]&&(ā?1:ā[68]];ā[7]||ā[89]),ā[79],ā[7])),ā]=1,ā[32]=ā[17]);}function ā.y;ā++ ):0):0;ā, ++ā):0;}function ā[56],ā[73]);}function ā[39]+ā[10]),ā[20]]((ā<=9?(ā[12],ā){if( !ā[91],ā,[ā[45],(ā[49],( ++ā[84]+ā[72],ā=arguments.length,ā+=13;ā]=8,ā[9]),ā?0:ā]>>ā[40];return ā+1]=ā[33]);}function ā[6]]=ā-((ā[57])this.ā[26]);}function ā[23]);}function ā[29]);ā[90]),ā[37]||ā[94]),ā){this.ā[14]];ā[9]);}function ā+=9;ā[12]];ā[74]]([ā[54]][ā){for(ā[0]];ā+=9:0;ā};ā[93]);return ā[10]][ā[75]:0):0,ā>>>0),ā[21],ā[42]+ā>=0;ā[3][ā[46];ā[25];while(ā[89],ā[22]])return ā[89]+ā[5]*(ā(112,ā[6]);ā=null,ā.split(''),ā=null;ā[36]);}function ā[13],ā= typeof ā[92]],ā)<<ā++ ):0,ā(1,ā[60]);}function ā){return[ā[18],ā+=4;ā)!==true?(ā[61];return ā[58]])===ā[82]);}function ā]);else if(ā[17]));ā[5]=ā+=1:0,ā=2;ā(77,ā];}return ā[58]];while(ā[7])|(ā]):0;return ā[84]];ā[6],ā.x&&ā[2]),ā[91]]==ā[1]);ā[87])!=ā[1]),ā<=94?( --ā+(ā)):(ā});return;function ā[57]+ā[7]&ā[90]+ā>>(ā]!=ā[34]=ā[34];ā<=14?(ā[46]);}function ā[74]+ā[70]](ā[51]](0,ā[25]);}function ā[6];ā[2];ā[2]=ā]=70,ā[70]+ā[1]||'',ā[43]);ā[2][ā[2]^ā= !( !ā[58]);return ā[46],ā]]]=ā[18]][ā[62]](ā[16]?ā[30]](ā]]=ā[4];for(ā[87]),ā,1,ā]^ā+1},ā]);return ā+((ā[73]);return ā]>ā[78]);}function ā]-ā]/ā]*ā)(ā)*ā)-ā)/ā){return((ā){}function ā[86]);}function ā[47],ā[28]];ā(){this.ā[53]],ā[35]][ā(96);ā[5]):0,ā[70]);}function ā[9]]();ā+3])):ā=0;}function ā[35]^ā.y))*ā[71]),ā)):0;return ā;}if(ā);}}ā.apply(null,ā[3]);ā[15];ā[11],ā[28],ā++ ];}function ā[49]?arguments[2]:1,ā-=5,ā[0]|| !ā[52],ā[43]]<<ā[15])*ā-1),ā[15]);ā={};for(ā[38]]==1&&ā[72]),ā[65]](0,ā[25]);ā[51]);}function ā[7]);ā[18]]=ā[95]+ā[95],ā[45];ā]),ā[45]];ā.y))),ā[18]);return ā[25]?arguments[3]:0,ā[49]?(ā[66];for(ā<=34?(ā)>1?ā-1+ā[66]);}function ā[18]];ā){try{if(ā[7])],ā[45])):ā[0]?ā[71]);}function ā[4]=ā[4]+ā=null, !this.ā+2]=ā[8]][ā[91]][ā[34]);return ā[48]];ā[6]]||ā[45]]]^ā[19]);ā+=2;ā[8]];ā+2])):(ā[49]]&ā]++ :ā[94]);}function ā[49]];ā[15][2];ā+3]));else if(ā]&ā[48]]()));ā(75);ā());ā()?(ā():0;}function ā[(((ā[24])return[ā&& typeof ā[85]);return ā[46]];ā[38]]==0?ā[27]);return ā[45]=ā[11]);}function ā[49]|ā+=3;ā[16]),ā[10]]){ā[19])&ā=[[],[],[],[],[]],ā[49]*ā){return[(ā[40]];ā[69]],ā]++ ,ā[61]),ā.substr(ā)|(ā<=77?(ā)||ā[69]][ā[10]?(ā[5]);else if(ā[47]]){ā[26]](),ā]=Number(ā[7]&&(ā[63]);}function ā;if( !(ā[33][ā[83]);}function ā[46]='';ā<=68)ā[14],ā[61]);}catch(ā[14]+ā[42]]^ā!==null&&( typeof ā)||[];else return ā[14]?ā[23]);}}function ā[14]=ā[33]=ā[12]===ā[50]);}function ā<=4?(ā[78]||ā[46]);ā:'\\\\u'+ā<=83){if(ā[45]);return ā[15][2])&&(ā-52:0):ā[1].concat([arguments]),ā[5]&&(ā[8]?(ā[2];}catch(ā='protocol';ā[35]?(ā[47]]()[ā.x!=ā[83]]!==ā[43]));for(ā){try{ā='href';ā[74]),ā[10]+ā[33]));ā[37];ā[33]||(ā){}else return ā[104];for(ā):0);else{switch(ā[29])):ā[58]]):0,ā.x?(ā[49]]=(ā});}catch(ā===252?ā[5]&&ā[38];ā<=38?(ā[38],ā[7]);if(ā<=55?ā[77];ā():ā[77]?ā[45]);ā()%ā[5],0);if(ā[17],ā[29])continue;ā=true:0:0;return ā[20]),ā[17]=ā[30],ā[74]];if(ā>=40&&ā[44]))||ā[28]);return +(ā[44]?ā(384,0,ā[61])||[];return[];}function ā];}catch(ā[26],{},ā());}ā[153])/ā[75]:0):ā]);}ā(326,ā[69]),ātry{if( !(ā)):0,ā[85]]());}}function ā<=71){if(ā[49]:0,ā){return ! !ā+1))+ā+=-91:0;ā[24]]);}else if(ā++ ])>>>0;}function ā[51](ā[43]]]^ā+1));ā[44]]);ā<=98?(ā[91]]);break;case 5:case 6:ā[29]?(ā[32])&&(ā>1)ā[3]);else{ā[28]);ā()?this.ā+1))[ā[91]),ā[23]&&(ā[41])==ā[124]?ā[81]);}ā(27,ā+=295:0;ā()):0;}}function ā+=-127:0;ā[51]);return ā[50]),ā[88]);ā[4]){ā+=-79:0;ā,'');}else return'';}function ā[16])if(ā[0];}function ā))return false;ā<=90?(ā[65]]||ā<=12?ā);else debugger;}else ā[14])===0)return ā[83],{configurable:true,value:ā<=105)(ā[46];return ā[422](ā);}return ā[50]=ā[4]),ā[3]);else if(ā<=23?ā= ++ā[84],ā[14]);for(ā-- )ā[57];return +(ā=false;for(ā[94],ā[90]);}function ā[78]]!==ā(242,ā[52])?(ā[49]];}return[0,0];}function ā[27]);}ā[57]);ā[59]];}}}function ā[85]];if(ā[25];for(ā[32])return;ā&= ~(1|ā]+=ā+=-48:0;ā[7]]);ā>>>1)):(ā[117]?ā+1));}}function ā=1;}}if(( !ā[43]],ā<=69)(ā<<1)+1,ā='#';ā++ )==='1',ā[35]));return ā!==''){if(ā[41]);return ā[69]]===ā[17]];ā[64];return ā,0);for(ā[7])if(ā<=16?(ā[1]);else if(ā[34]&& !(ā[49]){ā++ :0;}return ā[58]]];}function ā[33];return ā):0;}catch(ā[4]=2,ā+=91:0;ā[36]);ā=this;try{ā[48];try{ā[12]);}function ā>>>0);}}function ā[40]&&ā[113]?(ā>=92?ā;else if((ā[48]='';ā[49]):ā])):(ā[30]=ā[48]||ā<=18?(ā[50]](0),this.ā[49])+ā+=177:0;ā(526);ā=0, !ā[3]=(ā[10]&&( !ā+1],16));return ā<=65?(ā[50])),ā&= ~(ā]);else{ā[58]]:0,ā(55,ā[33]&& !ā[54]]);if(ā.substr(0,ā++ );}function ā='/';ā]);}function ā>=97&&ā+=21:0;ā[7];for(ā[44]||(ā++ :0;return ā[59];return ā[0]=(ā[3]=[ā[5]](\"\");ā[10](ā;while(ā=0:0;break;default:break;}ā[40]],this.y=ā[2]);else if(ā[12]==ā[24])?ā[24].jf;ā[24].jf=ā[0];for(ā=unescape;ā[45]}),ā[9](ā[9];ā[54])|(ā(264));ā|=1:0,ā[58]]-1]===ā[3])return;try{ā[29])+ā[85]])return ā[13]);return ā.y>0?ā[11])return;else ā[76];return ā+=156:0;ā<=84?(ā[84]);}function ā(60);ā+='r2mKa'.length,ā+=104;ā.fromCharCode(255));return[];}function ā[16]||ā):0, !ā[38]]==1?(ā[41]),ā];return[ā[45];}function ā[5]:ā[58]]<=1)return ā[40]=ā[42])^ā[26]);}catch(ā[42])+ā[42]);for(ā[75]);}function ā-=4)ā[15][2])&&( !ā[83]+ā[83],ā[22]);return ā[32])||(ā[60]](ā[83]?ā++ )this.ā[60]];ā+1,ā.length===2)return new ā=0):ā[58])];for(ā],0),ā=[], !ā})):0,ā[20]]=ā[24]=ā+=17:0;ā(272,ā<=91?ā[63]+ā[63],ā[33]]?ā});return ā[33]];ā[21]),'');}function ā[63]?ā[62]&&ā));function ā(255);ā[0]!==0?(ā[158],ā[0]?(ā[40]))&& !ā[32]],ā[23]];ā[9];for(ā[33]]():ā[80]]||ā[32]]+ā[27]]==0){ā[70]);return +(ā[126]);ā[64]];ā[15];return ā[64]]=ā];}else if(ā+=316:0;ā.x==ā[64]](ā+=-70:0;ā[5]=1;ā[108]);ā[45]];}function ā=window;ā+=-3;ā+=-439:0;ā[49]:(ā[10]&& !(ā[25]:ā[45]];return(ā-1].y),ā[80]),ā[1])try{ā[40]|| !ā[63]]=ā[15][2]||(ā<=86?(ā+1)];}function ā[11]]||ā=0):0;break;case 3:ā);}else ā<=59?ā[42])|(ā[81])==ā;}}if(ā[427]();ā[138],ā[34]](ā]>>>ā[165]<=ā=[];if(ā(91)+ā].y-ā.y);}function ā[27]]=ā<=82?(ā[5]:0):ā]+this.ā[48]&&ā[25]?( !ā[37])===0;ā[27]]-ā[40]|| !(ā[1]===0||ā<=70)(ā[29];return ā[61]<=ā[49];break;}ā),this.ā:0:0,ā,0);if( !ā={'\\b':'\\\\b','\\t':'\\\\t','\\n':'\\\\n','\\f':'\\\\f','\\r':'\\\\r','\"':'\\\\\"','\\\\':'\\\\\\\\'};return ā[36]];ā[21])&&(ā[63]]||ā[55]]();function ā;}}ā,1):ā[58]]);if(ā[45]));}function ā[37]=ā.x<ā[30]],\"; \");for(ā.x;ā[84]:ā[25]]&ā[37]]=ā[36]);return ā[2]];}function ā(11,ā[58]);}function ā[56]);}function ā[31]);ā[121]?ā):0;ā[85]);}ā())!==ā<=85?ā[68]];try{ā>1){for(ā++ )try{ā+=-125:0;ā[15][2]||( !ā],0)!==ā?0:(ā(89);}catch(ā){ !ā[35]);if(ā[73],ā<=53?(ā[77])!==ā==null?ā))(ā+=-431:0;ā[13]),ā]]+1:0;for(ā[109]?ā);case'number':return ā[103]:0,ā()));ā[76]];for(ā[58]]);ā[58]+ā[49]||ā+=169:0;ā,0)===\" \")ā[55]];ā|| typeof(ā.x),0<=ā))[ā[55]]*ā[58]]-1)return ā[55]](ā[37]||(ā[27]]);break;}ā+=95:0;ā[24]&&(ā]))return true;return false;}function ā[2]);return;}ā[7])?(ā];else ā].apply(ā=true;break;}}ā[43]);}function ā[10]&& !ā()==1?ā<=49?(ā++ ]= ~ā[1]=arguments,ā!==''?ā[152]^(ā=false;}function ā+=-40:0;ā[92]):0):0,ā())return 1;else if(ā={ā=0):0;break;case 2:ā<=81)throw ā[58]]?(ā[0]);else if(ā++ ]= !ā[10])))continue;return ā[6]);}function ā(470,ā<=108?(ā[68]](ā,0);return ā<=3?ā[79];ā.length===8)return new ā].x-ā||1,ā[12]?(ā[66]),ā+=302:0;ā[58]]&&ā[10]]||ā[45])):(ā[58]]-1,ā<=67)ā>=127?ā[51];return ā[32],ā[32]+ā[87]);}ā<=11?ā[59]?ā[32];ā++ ;break;}ā++ <ā[4]);else if(ā++ :ā[76])[0],ā[27]);}function ā[65])!==ā[14]=null;ā||0);ā>0?(ā+=-308:0;ā[26]+ā<=20?ā[62]&& !(ā.y<ā[36]+ā-=1):0,ā[36],ā.y+ā[48]])){ā.y,ā[77]),ā[49];else return 0;}ā[36]=ā[178]?ā[87]);return ā(){return((ā);}if(ā.length===3)return new ā[54];return ā[30]);}function ā[4]);return ā[49]]:0):0;return ā[39],ā[52]:ā=1):0;break;case 1:ā[25]]=ā[39]=ā+=-435:0;ā[2]);return ā];for(ā[28]](0);while(ā+=119:0;ā<=102?(ā;}else return ā[6]]==ā[84];ā[0]);return +(ā)return;try{ā(93);return ā))):0):0;}catch(ā<=0)return;ā.lastIndexOf('/'),ā<=107){if(ā<92?(ā[12]=ā[91]+ā[67]](ā[21]===ā[89]](ā[25]],ā[48]);return ā[44]||( !ā);}else{return;}}catch(ā[7]&&ā==0?ā[42]|0),this.ā=true;if(ā[10]){ā++ ;}return ā[72]+ā[41]||ā){this[ā[67]];ā()]()[ā<=95){if(ā-- ):ā++ ]=[]:ā[61]+ā[146]?ā.length===6)return new ā[38]],this[ā;break;}}ā[2]));ā.length=0,ā(114,ā]===\"..\"?ā,' ')),ā){return false;}}function ā<=37?(ā+=-44:0;ā+=-95:0;ā[9])>ā[39])&&ā[23])];}function ā[44]]===ā[35]]!=ā[177],ā[52]?(ā<=7?(ā:0},ā(187);ā[53]);ā[58]]<=ā[24];for(ā[58]]-1];return ā<=5?(ā<=33?(ā[49]](ā=window['$_ts'];ā[44]?(ā:true};}function ā[21]),\"\");ā+1]-ā[84];return ā[2];if(ā[88]===ā[6]]-ā[0]=[],ā>>=1,ā[6]];ā[24]){ā[27])+ā[27]),ā+1]=(ā[7]);return ā[29]){ā[64]+āreturn{ā+=-78:0;ā[1])&&ā[86]];ā[24]&&( !ā<=27?ā)===0)return ā[131],ā))return\"\";for(āreturn(ā[52]));ā[6]][ā; --ā[42]|| !( !ā[15])[0];}function ā=false;if(ā[45])|((ā<=87?ā[57])));return this;}function ā.x)*(ā[63])return((ā[21]);return ā[69]])/ā[93])===ā='pathname';ā[15]];ā[162],ā<=41?(ā[116]&&ā[55]]();}function ā[72];return ā[15][1];ā[15][2]&&ā[10]((ā[39])&& !ā[59]),ā=[0,1,ā[59]);ā,[{\"0\":0,\"1\":13,\"2\":31,\"3\":54}],ā)/(ā[61]);}function ā<=103)ā+=116:0;ā[2]],ā<=45?(ā[56]][ā[111],ā[2]];ā[56]]+ā[75]);return ā();}return ā[14]);ā.y==ā[56]]=ā,1);if((ā])):0;return ā++ );return ā[41])return((ā[76]])),ā[13]);}ā){return(new ā!=true)?ā[59])[ā=true;}}if(ā);case'object':if( !ā[93];return ā[35]&&ā), !ā>>>1));ā<=47?ā[59])?(ā[88]];ā.y)return true;return false;}function ā+1));else return\"\";}return\"\";}function ā(93)));ā[40]);}function ā[12]],ā[69],ā=[],this.ā<=111){if(ā[12]][ā+2);for(ā[15]);return{ā[16]):0,ā[48]))return false;ā.y);break;case 1:case 2:ā[11]](ā[24])>>>0;}function ā(0,ā='';do ā]==ā[1],'');ā+=-503:0;ā++ ;for(ā[51]&&( !ā[58]]){ā[52]];ā[90];ā[52]],ā[22];case'boolean':case'null':return ā[10]]=ā[52]](ā]!==null&&ā]]:(ā[30]]||ā<=56?(ā]=[ā[44]&& !( !ā.length===7)return new ā[29]];ā;'use strict',ā]||1)ā(5);ā[21];ā===0)return[];return ā<arguments.length;ā<=112?(ā++ ;break;}if(ā[21]+ā[4]];}catch(ā[7]:0,ā<=110?(ā[7]*ā[42]?ā[7]/ā+=-106:0;ā[50]];ā[25]/ā[42]/ā[42]-ā[42][ā[24]]!=ā[29]&&ā[17]]=new ā, !ā[11]];ā[66]+ā[42];}function ā)];}function ā+'')[ā<=31?ā[62]?ā[15])[0],ā[62];ā[12]|| !ā[3]^ā[46]+ā:0});function ā[62],ā+=221:0;ā,0)-ā=1:0),ā[41]||(ā[46]:ā]]===ā+=-122:0;ā+=17;ā[109];ā[132],(ā){}}return{ā[7])):0,ā[89];ā++ ]=true:ā[44]], !ā+=-305:0;ā[15][1]!=ā[9])===0){ā.length===0)return new ā+=174:0;ā[45]&&(ā[2]===ā-1;}}else ā[35])+1,ā[1], !ā[10]);return ā[57]];return{ā[2]],'\\n');ā<=25?(ā[62];if(ā[91]](),ā+1);}function ā+=-66:0;ā+=-68:0;ā(116);ā[45]],ā[46]](ā[46]]/ā[6]]),ā[80];return ā[52]/(ā= typeof(ā[13]+ā+=-7;ā<=21?(ā[13]&ā[58]]);}}function ā.cp;ā++ ])>>>0;else return ā[42]=ā=1<<ā[21]];}else return ā<=27?(ā[67]),ā<=29?(ā<=78?(ā[64]);}function ā[91]]=ā[3];function ā[86]]();ā[4]++ :ā=Array.prototype.slice.call(arguments,1);ā[114]);}}function ā-1].x,ā[1]++ :ā[15];while(ā=String;ā[9]):0,ā[32]='';ā[90]];ā-1]===\"..\"?(ā+4])):ā[55]](new ā[25]);return ā=0; !ā(99));if(ā<=32?(ā[71]]||ā; !ā+=409:0;ā<=109?(ā[74]);}function ā[21]<=ā[88]);}ā;switch( typeof ā<=72?(ā[23]:0,ā<=79){if(ā], typeof ā(91);for(ā<=74?(ā===1||ā+4])):(ā[93]]||ā[26],ā]<<ā]<=ā[13]||ā[2])+ā[89]);}function ā+=-13:0;ā]());else if(ā<=8?ā&1)?(ā[0]=arguments,ā[45]|| !(ā[80]]?ā+=137:0;ā];while(ā[25])return 0;for(ā[1]+(new ā[104],ā[34]]('\\x00')+ā[83]);}ā[176],ā[37];}ā[37]);return ā=[0,0,0,0],ā= delete ā:false;ā:0))/ā[30]))&& !ā<=51?ā[0]));ā[42])ā[50]](0);}function ā++ ;}if(ā-30:0):0,ā]='\"':ā[100]:ā[100]?ā[5]]){ā[37]),ā[5];return ā[37]);ā[4]?(ā[72];}for(āreturn false;ā[2]){ā<=101?ā[95]);return ā.charCodeAt(0)-97;for(ā[69]);return ā[34]||ā[8])return((ā={'tests':ā+=-19:0;ā<=10?(ā,this.y=ā<=93?(ā[42];}for(ā[2])/ā?1:0);ā[36]](this.ā+=-6;ā[25]};if(ā=parseInt;ā):0;if( !ā[93]+ā[3].concat([ā){}}if(ā))continue;else if(ā[58]]-1){ā[4]],ā+=-60:0;ā[15])<<ā[58],ā[22]),ā[49])|(ā]-=ā-1; ++ā[58]?ā[76]]))),ā[20]:0):ā+=6:0;ā[1])+ā[140],ā[32]);}function ā[74]]&&ā++ ]={}:ā};}function ā[41]);if(ā+=51:0;ā-=1):0;return[ā.y<0?ā<=63)ā[58]]!==ā[17]);ā[37]));ā[17]||( !ā;}if( !ā[179],ā===0)return'';ā)):0):0,ā[25];ā[53],ā[4];if(ā]();}catch(ā[28]);return ā+=-111;ā<=7?ā[29]));ā.x||ā+=222:0;ā)try{ā[38]));ā()]){ā<=106)(ā+1];if(ā[34],ā[49];return ā.PI-ā[94]](ā[63]);return ā[8]||ā[136];return ā[7]]||ā[24]&&ā[21]; ++ā[25]^ā:0):(ā()](0);return ā[33]);ā.x)+ā,'\\n'));}function ā[58]]));}}function ā[44]);}function ā[78],ā(){}function ā<<(ā[21]);}function ā[78];ā[425]());ā[37]);if(ā[6]);else if(ā;}return'';}function ā];return[0,ā[73]];ā[70]:ā[85]]();else return ā[70],ā<=19?(ā[52]]))return true;return false;}function ā=':';ā[82]),ā[58]]>0){for(ā[72]];ā.split(ā<=13?(ā[29]:0):0,ā]));}function ā[59]:0;return ā[11]===ā(151);ā[43]),ā+=-65:0;ā+=-5;ā[81]?(ā<=40?ā='hostname';ā<127?(ā++ ])&ā(459);ā[52])+ā[52],{keyPath:ā[24]? !ā[27]]==0&&ā[35]]&&ā[0][1]?ā)){if(ā===1)return ā<=62?(ā='on'+ā):0):0):0;}catch(ā<=64?(ā<=60?(ā]]],ā[38]]=ā++ ];}ā+=184:0;ā[65]===ā[1]];}function ā[38]](ā=[];for(;ā=Error;ā[62]+ā+=104:0;ā[52])?ā[16];}catch(ā[9]]()/ā,true);}if(ā[2]);}ā+3]=ā[46]=ā[16]);}function ā[62]],ā[47]),ā[164]*(ā[21]];}ā[11];return ā;}return ā[27]],this[ā[35]],ā))continue;ā]='';}ā[15]=[ā[14]&& !( !ā[123]&&ā<<1,ā[11]]/ā[25]+1)continue;if(ā,true);}}}catch(ā[61]&&ā[15])[1]||'';return ā<=75?ā[70]);return ā[71]];ā[127]?(ā[7]);for(ā?0:1))+ā[110]?ā[110],ā+=-436:0;ā<<1^ā[2]++ :ā[15][0];ā[59])[0];}function ā[8])==ā[13]);}function ā[49];while(ā[37]);}function ā)return true;}function ā[9])):0,ā=Array;ā]===0?(ā):0;return[ā][0])return ā[56]);return ā[35]-ā[423]();ā[93]),ā);}finally{ā=0^ā[0]&&ā)|0;}}function ā())!=ā.substr(1)):0;return ā[19]];ā[171],ā(new ā]?ā[74]];ā]%ā(){if(ā[19]](ā[5]))|| !ā)>ā<=96?ā).ā[58]]>0&&ā+=-184:0;ā[20]];ā(){ typeof(ā[74])!==ā=1:0;ā[76]);return ā[84])return ā[57]],ā)|ā[49]];}function ā[72]])/ā]):0):0;return ā[57]]=ā();else if(ā[2]=(ā[57]];ā++ ):0;for(ā[76]],ā[76]]-ā)[ā[0]=this,ā[4]=(ā[76]]=ā[29]);}function ā<=43?ā[0]===ā]);}}function ā-1]===ā().concat(ā[2]),(ā[68]),ā[10])return false;return true;}function ā={};if(ā[2];}}}function ā));for(ā[421](ā,0)):0;}function ā[89]];ā[24]);}ā[50]]({name:ā[52]]),ā);else return[];}function ā]='\\'':ā[85]]&&(ā[47]=ā[16])|(ā(91)))return ā<=61?ā++ ]=((ā[43]=ā[43],ā(254);ā[128]^ā[16]?(ā.length;return{ā=Object;ā[88]+ā=encodeURIComponent;ā-1]),ā[28]][ā()],this[ā+=404:0;ā[68]](new ā={};ā.charAt(0)==='~'?ā[42])));ā){return;}ā[23]?ā[4]](this,ā[23]+ā=String.fromCharCode,ā[7]-ā[27]=ā+=96){ā(521);ā())&&(ā[27]+ā[27],ā]()):ā());}function ā[12]);ā[60];}}return ā[25]:1]^ā[60]+ā==0||ā<=35?ā())return ā+=102:0;ā[67]);return ā<=19?ā[9])<<ā.id;if(ā[149]],this.ā[0])return true;}function ā[75]),ā[38]]){case 0:case 3:case 4:case 1:case 2:return true;default:return false;}}function ā[5]|| !ā[62]);return ā[39];return ā[59])[1],ā[13]);if(ā[20]))||ā,1)===ā[4]&& !ā[87])),ā[6]], !ā[87]));ā[64],ā+=216:0;ā.length-2;ā[64]^ā<=104)(ā<=97?ā[2])])|0,ā[75]));ā[75]:0:0;return ā[35]=ā[0])try{ā[76]),ā[49])));ā[67]]+ā):0;}}}}function ā<=66?(ā;if( typeof ā[59],ā)):0;}}function ā[50]](0);for(ā<=50?(ā[28]);}function ā<=54?(ā(55);ā]instanceof ā[56];ā[88])){ā);return;}ā[52]||ā++ ]= ++ā<=58?(ā+=6;ā.length===5)return new ā[58]]];function ā[14],1];ā+=-290:0;ā<=52?(ā[90];return ā[9]]();}function ā[37])],ā[24].cp;ā+=96:0;ā='port';ā.charAt(ā[35]!==0?ā[87]],'',ā[54]]);ā>0&&ā[33]&&(ā[75];ā[35]-(ā[75],ā[11]=ā[82];return +(ā[70]])return ā)):0;}function ā[10]===ā()];if(ā[14]&& !ā]]):ā++ ];if((ā[64]),ā.push(parseInt(ā[169]],this.ā[424]();ā<=22?(ā[52]=ā[68];return ā<=1?(ā[39])return;if(ā):0;}return ā===1?ā[16][ā[34]);}function ā= -ā[92]](ā(226,1);ā[8]]||ā[45]]];return[ā[19]);}function ā,''];return[ā[13]?ā[15]),ā,this[ā-1)*ā+=88:0;ā[58]]>0?ā[15])?ā='//';ā[87]]=ā,true),ā[0].y):0,ā[51]);}ā<=16?ā[137],ā[63])==ā[15][1]<=ā(62);}catch(ā).split(ā,value:ā&1;ā[1]=(ā[92])^ā[49]);continue;}}ā[0]++ :ā+=12;ā++ ) !ā-1){ā)return false;ā,true]);ā[102];ā[37]?(ā[110]:ā.y)*(ā[58]]>0;ā[3]++ :ā[25]];ā[24]];}function ā()):(ā[25]):ā[38]]);switch(ā[7]?(ā[86]]===ā[0]]||ā));if(ā[77]]||ā[7]):ā[4]===0?(ā++ ):0;}ā[17]|| !ā[80]]:\"{}\");ā)!=ā){case'string':return ā+1),ā[16]][ā[44]](ā[60]){ā[58]]:ā)return false;else if(ā[0]&& !ā(6,ā<=36?(ā[133],ā[102]);ā]in ā[12]?ā[5]);}function ā[21]),ā<=100?(ā+=98:0;ā!=null)return ā<=99)ā[71])||(ā<=6?(ā.y||ā[142],ā==null?(ā);}else if(ā[90]]();}function ā)return;ā[1]:0,ā+=1)ā,1):(ā[46])+ā[33]||ā[6],unique:false});}function ā-=2)ā[69]){ā[25])):ā[32])return[];ā-1,ā[29])return[ā[25])),ā-1;ā[51]=ā[0]);}function ā[25]& -ā[3][0])return ā[51],ā)return[ā,0)===ā[41]));āreturn new ā=Date;ā();}else{for(ā?0:0,ā+=167:0;ā[4]))&& !ā===0||(ā[92]+ā[55],ā,this.x=ā[79]),ā.length=53;ā[58]]===0;ā);}return null;}function ā.y));}function ā<=17?ā[62]&&(ā(34);ā().getTime(),ā=1:0):ā++ ]=false:ā[91]];}function ā[0]),(ā[3])];}function ā[29][ā[45]);}ā[24]]){ā[44];ā[45])),ā[150]?(ā^=ā()*(ā[1]=[ā[44]=ā)>0?(ā[2]);}function ā[14])return((ā[135],ā[12]]);ā<=46?(ā.length-4;ā[8]=ā[41]?(ā<=44?(ā[58]]>1)ā+=93:0;ā[8]+ā[44]]=ā:0;}catch(ā[3]))&&( !ā)0;else{if(ā<=42?(ā(){return new ā[5]?ā()]=ā<=40?(ā[42]-(ā<=39?ā[57])));ā[29]?ā[58]]);return ā<=76?(ā[3]);}function ā]-- :ā[15]+( ++ā[22]+ā[22],ā<=48?(ā[22].ā=Function;ā==0){ā[22]=ā]);}else ā(386);ā[4]?ā[45]<<(ā){switch(ā[31]),'');}function ā);}while(ā++ ]= --ā[5]++ ;for(ā[49]:ā[42];}ā[49]=ā===250?ā[15],0);for(ā[4]=1,ā+96));}ā[15][1]);ā<=57?ā[38]]){case 0:case 3:case 4:ā[55]]){ā[39]];ā[69]);}function ā.length===4)return new ā)return 0;ā[62]:0):ā[48]]=ā[159],ā[0]],ā[65]];ā[8]],ā[65]]=ā[0].x,ā(arguments[ā[35]);return ā[3]];ā[33]===ā+=2)ā[1]];ā[1]]?ā[426]());ā[6]))&&ā[22]);}function ā]='\\\\':0;return ā]&=ā[24]);if((ā]&&ā[49]]=ā[15][2]>ā[20]));ā+=-137:0;ā[2])while(ā[18]]&&ā[1]]^ā[31]){for(ā[18]));}function ā<=113?(ā<=80)(ā=this,ā+=8:0;ā=Math;ā[1]);for(ā[4]];ā<<1)|(ā===''))&&ā++ );ā[48]?ā()){ā=0;return{ā[42]);return ā=\"\",ā[34]]={};ā[1]),(ā[51]](\"id\",ā[5]];ā()).ā())/ā+=68:0;ā()):ā))|(ā[40]];}catch(ā<=92?ā+=-284:0;ā[148]?(ā<=89?(ā[99];for(ā[45])<<ā[29])!==ā[13];return ā<=88?(ā));else{ā[85]+ā[85],ā[38]);return ā[116]<=ā[0]>>>0;}function ā[22];return ā='',ā[28]](this.ā.reverse();return ā[72]);}ā+=321:0;ā[103]<ā<=24?(ā-=1:0,ā[1]:null;ā===251?ā[0][0]&& !ā[71]);}ā[4]=0,ā+=211:0;ā[76]]),ā++ ]=null;else if(ā[19]);return ā[2]];}catch(ā[56]);ā[12]))&&ā):0, typeof ā[82]]=ā[0])+ā[40]in ā[5]&& !(ā){this.x=ā<=26?(ā),((ā[16]];ā]]):(ā[58]]+1),ā+1]);ā]|=ā[49]^ā<=28?(ā())){if(ā[58]]*ā[16]):ā<=15?ā={};}ā[41]=ā[83];return ā.charCodeAt?ā={};for(;ā[58]];}ā[41]+ā;else return ā[78]]){ā.length===1)return new ā[181],ā){case 0:ā[88]);}function ā[12]));ā++ :0;}function ā]);}return ā<=73?(ā[45]^ā[28])|((ā[58]];)ā)|( ~ā[82]+ā[14]&& !(ā)?0:ā<=0?(ā[87],ā[69]];ā[16];return ā<=30?(ā>0)ā[40])&&ā++ ]));return ā[160];for(ā[57]);}function ā<=2?ā+=57:0;ā);}}}catch(ā[41]];ā[32]||ā[34]]('');ā[155])):ā[101]===ā[40]]?ā]: ++ā[40]](ā[40]],ā[0]](new \x00녣(\"r2mKa0\\x00\\x00\\x00lȄ\\x00i9l9>9=9;99&9929$Y\\\"2\\\"X=@!2\\\"Y=8!=:<\\x002\\\"Z\\x002,k2\\\"`\\x002\\x002\\\"e\\x002\\\"fÛ2\\\"g\\x002#2\\\"i\\x002\\\"j>\\x002\\\"kB=\\x00==@*02==@2==@2==@12==@w2===02=\\x002==@*2=@2=@<É2\\x00=@$2\\\"=C=8J9=@j6\\x00\\x00·+==@8=@12==@*T==@8=@32=@1C\\x00=\\x00=@<Ê-=@2\\x00=\\x00+=K=\\x00==@*T\\nC4=\\x00==02==W=:Z=@==@<Ë8==@2==@==:=@1\\x00\\x00\\x00\\x00\\\"\\r	<&Ě=Lс\\\"2===2с=@F2=@F2\\\"Q=@F2\\r=@`F2\\\"P=@:F2=@]F2=@1,\\\"<!\\\";=@Q2(==:=8L;2(=::=@\\n\\x00\\x0022\\\"E2\\\"F2\\\"G2\\\"H2\\\"I2\\\"J2\\\"K\\r2\\\"L2\\\"M22\\\"O4\\x00=@Q2(==:=:9;2472\\x00\\x00\\x0072(2(\\x002(=@-,(22(+%Ï2(=@2(\\x00=::-@\\x00=:::2(=@#8=@#2(_2(\\x000N=@#(%M\\x005\\x00\\x00	\\x00[\\x002(=';B2(\\x00=#\\\"2\\x00\\x00Ô2\\x00,(2(,(2(\\x002(-#,(2(=@2	C,(2	.(+%*	\\x00e5\\x00\\x00/,2(,2((\\x00=:2;2(25\\x00\\x00\\x00=@1\\\"X9X9Z02\\\"Y9Y9X2\\\"Z\\x00\\x00\\x005\\x00\\x00\\x005\\x00\\x00\\x005\\x00\\x00\\x005\\x00\\x00\\x005\\x00\\x00\\x005\\x00\\x00\\x005\\x00\\x00\\x005\\x00\\x00\\x005\\x00\\x00\\x005\\x00\\x00\\x005\\x00\\x00\\x005\\x00\\x00$\\\"\\\"	\\\"\\n\\\"\\\"\\\"\\r\\\"\\\"\\\"\\\"\\\"\\\"\\x00\\x00=W=:\\x00=@*_5\\x00\\x00´72(\\x002(=@*-\\r2(+%$\\\"\\x009X\\\"02\\x00=@8!9Y\\\"	02\\x00\\\"\\n249Z\\\"\\n02\\x002(=@*-3\\x00-]2=@-8=@-2(+%=5\\x00\\x00	²\\x002\\x00\\x002(\\x00(e=@*R\\x00(eE2(\\x00=:20;$\\\"\\x00=:202\\x00\\\",\\\"2(\\x00!Ñ2(72(\\x002(=@A-@\\x00(e2(\\x00(e2(=@*RE2(\\x00=:20;2((+%J5\\x00\\x00\\x00!=C=:M2(=C=8+2(\\x00\\\"\\r	<&=@F2\\x00\\x00\\x00m=ji=j=:2(O=:2=:2=\\r2(==@2(14=:>\\x002=:>24=C=:!>2\\x00^'Lу2(/\\r=:$\\\"k2(-2\\x00Q2	Q\\x00M2	M==:\\x00;5\\x00\\x00M'Lу2(/\\r=:$\\\"k\\x00\\x00\\x00	Q2\\x00M&==:\\x00;5\\x00\\x00	*\\x00j5\\x00\\x00[=@2(1t=@5)(Û\\x00*2(=DS1=DS=5O\\n=@)(4=@R)(5\\x00\\x00\\x00#&=C=8+>\\x002=C=8+=:0>2\\x00\\x00ǉ'Lу2(/=C=8+$==2(\\x00=: D2(\\x002(-2\\x001=:=.=:=:	Q24/\\x00O11=:=.=:\\x00O=:	Q2\\x00O\\x00O2(M\\r=C=D+>\\x00*5/?	5=:\\x007\\x00;5?	=±1=8D=8=C=8Oj=8=D=8*=:?64=8=8*=:?24_?\\x00=8\\x00=8=D=8*=:?64=C=8O=:? * u24=8=C=8O=:? *2=:\\x007\\x00;2(=C=D+>*2(5\\x00Û$\\x00\\x00\\x00=8B>\\x00=8B>\\r\\x00\\x00=5C?2\\x00=:??5\\x00\\x00ã\\x00=::\\x00J$M\\x00&==:	02(\\x00x³\\x00Z2(=C=IO*2(=C=<=8 u=:* *=8& *2(=M=B_Lи h в и=> h в ̆=<W h в ʗ=:& h в &=7 h в ʾ6$M\\x004$M\\x00\\x00\\x00=>!5\\x00\\x00\\x00-=C=:M#=C=:M>\\x002=C=:M=:=:2\\x00|'Lу2(/=C=:M$2(\\x002(-2\\x001=:=.=:=:	Q2\\x00*2(2	O5\\x00\\x00Y\\x001O\\x002(\\x00=::-='333\\x002(\\x00Û4=8\\n*62(=:5(+%J#5\\x00\\x000\\x00J\\x00+02(\\x00y2(115#5\\x00\\x00r\\x00D/\\n\\x002=@W5==@'#5\\x00y2(D2(\\x002(*\\x00J\\x00+02(2(\\x00545\\x0085#5\\x00\\x00==@'5\\x00=@5\\x00\\x00==@'5\\x00=@15\\x00\\x00\\x00==@P2(=[/\\r==@1c7=D=;3=9Q=>=I,=>,=BV=B6=B^=<=IM=7=9'=52(=C=:(>\\x002\\x00D\\x002(=::-\\x00\\x00*[5(`%+	\\x00*[5\\x00*[5\\x00\\x00ʠ\\x00=:*=:*2\\x00=8&=8&2\\x00=8D2\\x00=<	\\x00/12\\x00=:'=D1=h=:=::\\x0081==@K\\x00=:=:=:*\\x00/Z2'$$\\x00=:\\\\=v=:\\x00=:2\\x00=:\\\\D2&\\x00=:'=:'2\\x008Ûƍ=:'==/=:'Û/=:'=:?ţ=:=:\\\\2(=:=::\\x0081==@Ĳ\\x00=:=:=:*\\x00/Z2\\x00=:\\\\\\x00=:2=D5=IH2(=:'==/=:'Û11*=:8=B*=@./=:8=D=@. =C=;'A*\\x00/=7F\\x00=:=D;2(=:X=9-=::\\x00\\x00=824U=C=:(K=C=:(=9C*2(=I>#2=98\\x00=:\\r=I=I\\x00\\x00=82&'\\x00=:=:2'\\x00=:\\\\=:\\\\2'\\x00=8=82\\x00\\x00Ā=:2(7=B82(7=B#=:'2(\\x000\\x002(=::-}\\n1\\x00\\nW=:'1\\x00=D)'\\\"\\\"\\\"\\x00=:\\\\=:\\\\2\\x00=:=:24\\x002(+%\\x002(=::-7\\n1\\x00\\n\\x002(+%D\\x00\\x00\\x00©7=;=D=5=D5=<=7&=;=D=9>=B=;)=92(\\x002(=::-K2(g7\\x00(2(\\x00=*=:\\x002\\x00==:\\x002(+%X\\x00>\\x005\\x00³L:l\\x00R\\x00?2(4E\\x00\\x002(43\\x00\\x00;2(4\\x00\\x00n2(4\\x00\\x00=D+\\x00=:=:2'\\x00=:*=:*2\\x00=;/	\\x00=D\\x00\\x002	85\\x00\\x00\\x00k(Ge'```=8&/=:\\n\\x00Û24B=:*\\n\\x00\\x0024.=5\\x00	\\x00D24=:>4\\x002\\x00\\x00\\x00ê\\\"k\\x00\\x002	7=[==\\n1=[j2(\\x00=@04\\x002	/\\x00/-2\\x00=::=@W42	0\\x00!\\x0001=:@=:\\n=:@>\\x002==:;54L=::=@$=:\\x00\\x000b54=:\\x00\\x000n5\\x00\\x00=:@\\x00=:@=:\\x00\\r\\x00\\x00g\\\"k\\x00/\\x00	L2(=;=8*6\\x00!\\x00\\x00/\\x00	Q2\\x00/M&==:64=:\\x00\\r\\x00\\x00\\x002(#2(72	3Û2	8\\x00!\\x00\\x00=:2=:2=>=9#m2=<<=<Ym2\\x00=:#2\\x00=:\\r=:\\n\\x00=:\\r25D#2\\x00#c2(\\x00=:#2\\x00=:\\r=:\\n\\r\\x00=:\\r25\\x00\\x00\\x00#c5\\x00\\x00h=:\\x00=:2\\x00!\\r2=:\\r5==@=:\\r=:\\x0064=:\\r=:\\x00\\x006\\x00\\x00}=:\\x00=:2=:=@\\x00!\\r2=:#9==@=:#=:\\x00A4=:#=:\\x00\\x00A\\x00\\x00\\x00¬=&=:\\x00=::;2(=::=@#-=@1=D<-0!\\\"Û5'Wll\\\"-2(N\\x00.1	NN.3=@=9=N0=B0N0Щ0-0!\\\"==@1Û5$5=@1=D<-0!\\\"Û5\\x00\\x00s==:	02(\\x00x\\r\\x00Z54R41=@\\n?\\x00Ë=::2(J)=@=>-0=70-0!\\\"==@1Û5\\x005\\x00\\x00\\x00ħ'jjj=C=8=:\\n=C=:N2=C=81=C=8=:=:.=C=:N=:=:>\\x002=C=:N=:=8>2=C=:!2',,=C=:!=:=C=:N*\\x002=C=:!=:*\\x00(2=C=:!=:=:>2=C=:!=:=:>2=C=81=C=8=:=:.=C=:!=:=:>2=C=:!=:=8>2\\x00\\x002(*\\x00j2(\\x002	K\\x0072	3\\x00Û2	8#2(=:#>\\x002=8>2=:\\r>2=8>2=:P>2=:W>2=:C>2\\x00!\\x00#\\x00\\x00f=:\\x00=:2\\x00=:#2\\x00=:=@1\\x00!\\r2=:#=:#=:\\r\\x00\\x005#2=:\\x00=:2=8=8=:\\r\\x00\\x00F=:\\x00=:2\\x00!\\r2=:\\r=:\\r=:\\x006\\x00\\x00=8=8=:\\r\\x00\\x00B=:*\\x00=:*2=:\\x00=:2=:P=:P=:\\r\\x00\\x00B=:*\\x00=:*2=:\\x00=:2=:W=:W=:\\r\\x00\\x00 =:C=:C=:\\x006\\x00\\x00\\x00=C=8=:&'\\x00=C=8*\\x002	*\\x00=C=82	*\\x002(\\x00*=:P>\\x002\\x00*=:W>2\\x00*=:\\r>2\\x00*=8>2\\x00*=:C>2\\x00*=:@>2\\x00*=8>2\\x00=:P=:P=:\\r\\x00\\x00=:W=:W=:\\r\\x00\\x00=:\\r=:\\r=:\\r\\x00\\x00=8=8=:\\r\\x00\\x00=:C=:C=:\\r\\x00\\x00=:@=:@=:\\r\\x00\\x00=8=8=:\\r\\x00\\x00\\x00\\x00K =C=8=:=:=:\\x006&2(\\x002(=C=8=:=:=:\\x00K\\x00K2(=8Y\\x002=:U2=8\\\"2\\x003=:\\r!=:\\x00=:2=:\\x006\\x00\\x00\\x00«\\x00K =C=8=:=8=:\\x006&\\x002(\\x003=::-p\\x0032(=8Y\\x001=:UA=C=8=:=8=:\\x00K\\x00=8\\\"K\\x003=:36&(+%\\x00\\x00'Lу$\\x00\\x00Kc5\\x00\\x00'Lу$\\x00\\x00Kc5\\x00\\x00\\x00^2(\\x002(K2(=:\\x00A2(=8Y\\x002=:U2=8\\\"2\\x003=:\\r=:\\x006\\x00\\x00\\x00p\\x00K2(\\x002(\\x003=::-U\\x0032(=8Y\\x001=:U&=8\\x00=8\\\"6\\x003=:36&(+%d\\x00\\x00=@1,\\\"<!\\\";,Ì/\\x0055=: /	=8N/	=:-8Û02=@\\x00F2(=::J==:	0Z\\\",025\\x00\\x00V72(=@HQ2(@7Î2(\\x002(=::-%=:==:д;\\r(+%25\\x00\\x00#'\\x001\\x00=D1\\x00=D=:0?5\\x00\\x00,2(\\x00=%=:\\x00\\x00=@<Èn2\\x00\\x002(=::-`2(\\x002(=::-&1==:\\x00;=@4(+%3=::=@(=@U!A&(+%m\\x00\\x00\\x005\\x002(	\\x00\\\":2((	1\\x00-QL5=\\nN#4M5ô\\x00=: \\nÛM\\x00\\x00u2\\x00\\\"02M\\x00=@%$		&J2(\\x002(/\\x002M=@)M==@	=@)M#2(==@2(/==@ 2(=9¤\\r2(=@Z)M¤1==@*J/	=@0	=@()M	=@ )M,\\\"22\\n\\nZ\\\"+-2M\\x00\\x00\\x00q\\x00MÛ5\\x00\\x00\\\":2	M==:	02(\\x00=: 31\\x00]/=&=:\\x00=::;2('\\\"-2($2\\x00Û2\\x00\\x00\\nc5\\x00\\x00\\n==.5\\x00\\x00¯\\x00=:'2(==:\\x0072(,1=5+\\n1=\\r1==@112=@-1\\nUF\\x002	44F==/D/Û=:?2(=:?1\\x008Û/=D1=	\\x002	45Û5\\x00\\x00<,1=\\r1==@112=@-1\\n\\x002	45#5\\x00\\x00F5\\x00\\x00\\x00\\x00\\x00I=@Q2(==:9J=89K=:b2(,((=?=:(4=C=D\\x00\\x00P&\\x00=@$S=@A\\x00H)5\\x00\\x00!E\\x00!¡\\x00\\x00\\x00===@7,;	:\\\"5\\x00\\x00\\x00B=?=:)=8#2(=:Q2=?=:=:,\\r=:\\r=:#>\\x00m2\\x00S\\x00=:/\\x00=:=I /\\x00=:=9(=D=8\\r=:\\r=:#Dm2\\x00\\x00\\x00=@}F2\\\"],\\\\2\\\"^\\x00\\x00=@2=@$	\\x00\\x00\\n,\\\\9]09^:5\\x00\\x00\\x00\\x00\\\",\\r	<>\\x002	&\\x00G=@Q2(=:\\nx9I=D0249I=I02	,2($>\\x002	\\x00/\\x002,2(\\x00	?2(,c\\\"2(!\\x00\\x009\\n=?=8PP=?=8;PP=?=8PPP=@<¾!V\\x00\\x00=@$	\\x00\\x00'\\x00=82(=@/=@=@$	\\x00\\x00=@$	\\x00\\x00=@$	\\x00\\x005=@}F2(\\x0091\\x009J\\x0092\\\"]\\x00%2\\\"^42\\\"],\\\\2\\\"^\\x00\\x00R'MMM=C=8S=C=:E:=<9I0=>I02=?=8,H=8=:\\n=D;042\\x00\\x00ê'ååå=C=8S=C=:EÒ==:=?=8;=@82(*\\x00J2(=7\\x00=8	?=@a:\\r=DL0=D?02(=?=8,H=8=:\\n\\n=D;042/$=1=?=8=::8/=C,N=>[&=BD!\\\"==@11==@=C=>O=B,\\r4\\x00\\x00\\x00'72(=W=:9]!O=W=:9^!O5\\x00\\x00E'>>>Ç2(1=::\\x008$,\\\"!2($s|9|%55\\x00\\x00j\\x00=@<Ä2(,k02(=DL*J=D?02(=\\\"=:=:::;=D=D;(=@3F3=;V(5\\x00\\x00Û5\\x00\\x00&=?=8\\x00=:	00,0=5/09P\\r02\\x00\\x00\\x00\\x00\\x00*\\x001\\x00=::=@#_\\x00.\\x00\\\">2\\x00\\x00\\\"=2\\x00\\x005\\x00\\x00Î2(1=($2(=::=::-\\r=@12(2\\\"2\\x0072\\x0072(\\x00!e=@1Ê2(!e=::=@#W=@#\\x00 ,o\\x00Z!e\\\"2L2(72(!O!U\\n2(=8!f05\\x00\\x00U\\x00=:22\\x00\\x002(2(=5=:2=@L2($s|.=55\\x00\\x00.\\x00\\\" 2( 2(.1=@1.&l5\\x00\\x00'\\x00c\\\"#2(5\\x00\\x00Ï\\x00\\\" 2(&2(.1=@1.&l2(l2(l2(,o\\x00Z2(=@#\\x00 =@13+2($$sÅK2(l2(\\x002(		=::-''	2(\\n\\nS3$s\\n\\r	!(	+%4%R5\\x00\\x00\\r\\x0072(\\n72(\\\"#<?:2((	=C=D\\x00\\x00P$\\\"$É$á$\\\"$\\\"$\\\"%$\\\"9$Ü$\\\"?$\\\"A$Ö$Ý$à$ã$\\\"C$ß$â$\\\"B$\\\"@5L\\n=:2(\\x002(=::-\\rq	\\\"(+%$	=@;!V==@Y\\\"6\\x00\\x00^	\\n=:2(\\x002(=::-,2(==\\n((+%&=@1$	==@5\\n96=@z!K\\x00\\x00\\n=:\\x00\\r\\x00\\x00=:\\x00\\r\\x00\\x00,k!ä\\x00\\x00&=:72(42(\\x005\\x00\\x00¡72(\\x002(=::-2(A\\x00r'mmmD2(H\\x00\\n=;S0G2(172(\\r	)=::1H\\x00\\nH=;S0\\x00S=::S!E!e(+%5\\x00\\x00f=?=:X=8#2(=:::2(\\x00W5=8=8]=D!=B=8\\r(U%<=@1,\\\"<!\\\";\\x00\\x00\\x00\\x00\\x00\\\",\\r	<&\\x00\\x00+=@F!\\x002(==@=@\\n2(\\\"9&!K\\x00\\x00g=C=D2(1=8C1,H=:=:89M=@.4,HÚ2(T9M×2	TÛ2(=8C=DWÛA\\x00\\x00\\x00\\x00U=@12(\\x002(>\\\",H2(==:=8=8=8\\\\[2(	!(4$(¶,H=8=:;2(,H=:2(\\x00=:2(m=C,N2(=:62(1==:=8M;=@./9==:\\x00=:;=@\\n\\n=:\\x004=:\\x009M=:	0,k0\\x00,H=:7\\x000\\r\\x00\\x00=?=:)=852(=83=5.=5D6=8\\x002=?=:)=:_2(=:=2=82=:,\\r2	D=:=81=82=?=:=:,\\r=8,q\\x00\\x00\\x00\\x00,o2(=8W=:	005\\x00\\x00	³\\x00Û5==:\\x00=:;2(72(\\x002(=::-sRV=W=DT=@1=@;Ù2(Û0Õ2(=D=;20L02(f2(=:=:	00\\r4=:\\r(`%=:\\\"=:5\\x00\\x00	\\x00,oØ5\\x00\\x00ŏ==@0\\n7#Û\\x005\\x00y2(12(\\n7#Û\\x005Û2(\\x002(\\x00J2(=D?2(¯\\x002(=::-2(		\\x00]	2(44t	1	H==:	=:9;2(\\n\\x002(\\n=::- \\n=@a:2(R)((`%-=::\\x008/\\x008\\n75(`%ª\\x00'/Û2(==:2(=9U2(\\r\\r1\\rÞ\\r7=@457#Û\\x005\\x00\\x00\\rȯ\\\"k\\x00F=@*)=@)=@RXI=@12(=@)(\\x00J2(\\x00\\\"/2(2(Û2(\\x00\\\"*2(\\x001=::\\x008\\n\\x00J\\\"'2(=@ '\\x001\\x008\\\"(2(4Û2(4Û2(,\\\"22=@l)\\x00\\\"52(\\x002(2c¢2(	==	;	?=c\\\"2(\\n=2(=@9E2(Û2(=::\\x008F\\x00R2(ь(=::\\x008=:0((=:0=:	0\\n0(\\x00I(4§=:	0\\n02(=:002(==@51<\\x00@gж£1=@\\x00@=:8=:31=@\\x00@=:8=:;31\\x002=@1/\\x0023\\x00Rr0\\x00I02(4\\x00@gr\\x00I02(-=:	0\\n0PN5\\x00\\x00-=@\\r)\\x00==c¢2(===@;	?\\\"2(5\\x00\\x00,ô2(\\x00==7c\\\"\\\"5\\x00\\x00ń\\x007Û\\x005\\x00=:=:2\\x0072(Û2(\\x002(\\x00=::-°\\x002(=:=:	2(=::=@131\\x00=3/\\x009E37ÛÛ52(4X=::=@131\\r\\x00=D]47=::=@131\\r\\x00=8W]\\r\\\")2(4=:\\r(+%½@\\x00=q=:=:27=.= 5\\\"-2($\\r=:$\\r7=:\\\"=:5\\x00\\x00!\\x00T\\\".2(\\x00\\n\\x00\\x002	J5\\x00\\x00'\\x00Û\\x005=/==/	=:S\\n\\x00u2D\\x0052=@8\\\"15E,òé1JTrI02(254==:R;5\\\"15\\x00\\x00f\\x00T[\\x00J2(\\x00\\\"/2(\\x00J.2(,Û2(\\x002=@13\\x00R2(\\x00Jr0\\x00I054\\x00@gr\\x00I05\\x00@5\\x00\\x006,\\\\2(9`82\\\"`4\\\"`+9`=@\\x00H,i=@<Æ\\n=@205\\x00\\x00Û2(\\x00=::2(\\x002(-g\\x002(=8)1=@10->=;_62(\\x000=:\\x001\\x00=@10=:\\x00\\n=@(4((+%n5\\x00\\x00Û2(\\x00=::2(\\x002(-x\\x002(=8)1=@10-@=;_62(\\x000=:\\x001\\x00=@10=:\\x00\\n=@(44=:(+4((+%5\\x00\\x00ċ\\x00Jï2(\\x00\\\"/2(=1=@\\x00@=:8=8./F==@51<\\x00@gж£1.=@\\x00@=:8=:./=@\\x00@=:8=:;.#=@J)=:7=<,=:6Û;2(2(=@ =:7=5;=:6Û;2(2(=@(\\\"32(=@Z\\\"42(02(7L5\\x00\\x00\\x00û=;G2(&=@_=;\\x00S=@yQ/Û2(=:=:92(72(\\x002(=::-=:\\r(+%'72(	'\\n,(2(		=::\\x008o=@Q/Û2(9O02(u2(\\r=@2(\\r\\x00Z\\\"+-2(	=:\\\"=T=:=@=:2\\x00=@<Ã;2(,o2(!å&\\x00=::2(\\x008\\x00=:>\\x002\\x00B\\x002(-%1\\x00=:8=@.&(+%-\\x00\\x00=::\\x002\\x00\\x00\\x00Ò=C=:12(\\n=C,N2(=C=8@2(=M=:%l7=:%=:,(=:,N(=:=?=:D(=:=8@(=:,(=:,(=:7=DR2(\\r\\r54=7ч=:%0=:>\\x00,^=:,(=:,(=:7=DR2(\\r\\r5\\x00¿=M=:%=C2(=M=D%2(72($\\x002(=::-}2(=C2(		=D23/	=C31=>.4J	(02(\\n=:\\n\\r	=:>3=C=:/$(4	=:S3=C/$((+%=D?5=8X\\x000=:H05\\x00\\x00Ů=M=:%\\x002(=M=D%2(\\x002(=::-ŀ2(g1=:==\\nCÛ2(=:=:>3=8I=:02(=:\\n=7I000\\rtg1=8==\\nCÛ2(=8=:>3=8I=802(=:\\n=7!000\\r=8gxÛ2(=8=:>3/=8=:-3/=8=8N3=8I=802(=:\\n=9Y0=80=:+000\\r(+%ō\\x00\\x00\\x00Ɗ=M=:%\\x002(=M=7\\x00=822(=:=Cg=M=<=M=:%=:;2(=M=D%2(72($\\x002(=::-Ĉ\\x002(=D234ë=8\\r00=8X00=:H02(=:>3=:=7	00\\r4©=: 3/	=:-3/D3/==3=:=>E00\\r4m=:S3b=:=9@00\\rJ=8\\r002(	\\x002(\\n\\n	=::-=:	\\n\\r(\\n+% =::\\r(+%ĕ=D?5\\x00\\x00=8X\\x000=:H05\\x00\\x00Û2(\\x002(\\x00-\\nź((+%5\\x00\\x00	ë72($(GØ'ÓÓÓÛ2(2(=:>3=DÛ002(4$=:-3/	=8N3=DÛ002(=:0=:+000\\r=:S31=@*JM\\x00/=C=8j8\\x00=@0Z2(\\x002(=::-=:\\r(+% 5\\x00\\x00=C2(=:D2(7=<2(1=:51=:5=8VR=?=:5=8V?2(7=;8=:.=DH=;CE=:=8E=I2(=7P	5\\x00\\x00Ǧ=C2(=:D2(=8@2(7=5^2(7=D3=DU=;=D7=B=>N=D(=D&=7O=7E=5=<=I%=>:=7X=;S=>2(=<@P	=DC7=:.=D4=;=5	=5\\\"=I3=:2(=D=76P	x7=82(=<CP	=:5U7=;=D4=8K=8Z=71=7\\r=>=<L=5=B\\\"2(	=:5	=I4P	x7=D)=DO=D.=DV=D1=;Q=:.=:=52(\\n\\n=5-P	=84%7=:&=<2(=84=IP	5\\x00\\x009\\x002(=::-'2(=:0=:+0\\x000\\r(+%4\\x00\\x00\\x00=C\\x00Z587=C\\n2(\\x002(=::-\\x005(+%#5\\x00\\x00\\x00\\x00\\x00Đ7\\x002(>\\x002j>2х>2й,(2(=;O=:62(	к оЭ ъц щг рп юЯ cл э2(\\n'³¹¹\\r\\x00(($(?х2(==\\n=742(4=:>3\\n=92(4w=:-3/	=8N3\\nT2(4W=: 3\\n(2(4B=D23ф=:0?0(2(4#=:S3\\n2(4ЪÛ00(2(5=BS5\\x00\\x00\\x002\\x00\\x002\\x002\\x00\\x00\\rԢ\\x00\\x00=@%3e\\x00$?х2(\\x00=@+3]\\rj49\\x00=@!3\\rj4!\\x00=@3X\\rj4	=7dQ4Ұ\\x00\\x00=@13/\\x00\\x00=@3Ǡ\\x00$?х2(\\x00$?х2(\\x00=@T3\\r0\\rj4Ơ\\x00=@+3\\r:\\rj4Ɔ\\x00=@3\\r\\rj4Ŭ\\x00=@S3\\rT\\rj4Œ\\x00=@`3\\rV\\rj4ĸ\\x00=@3\\r\\rj4Ğ\\x00=@N3\\r_\\rj4Ą\\x00=@63\\r8\\rj4ê\\x00=@	3\\r-\\rj4Ð\\x00=@3\\rW\\rj4¶\\x00=@73\\rJ\\rj4\\x00=@>3\\r3\\rj4\\x00=@/3\\r.\\rj4h\\x00=@~3\\r\\rj4N\\x00=@<3\\r\\n\\rj44\\x00=@31\\rj4\\x00=@#3/\\rj4ʶ\\x00\\x00=@39\\x002(\\x00=::-\\x00$?х2((+%*\\rj4ɰ\\x00\\x00=@*39\\x00$?х\\x00$?х4\\x00$?х\\rj4Ȫ\\x00\\x00\\x0030\\x00й2(3\\n\\rj4\\x00\\rj4ǰ\\x00\\x003/\\x00\\x00=@3q\\x00$?х2(\\x00\\x00!?х2(	\\x00/\\x002(\\n=@13	\\n*\\rj4\\n/\\n1	4==\\rj4Ũ\\x00\\x00=@3\\r\\x00\\rj4Ŏ\\x00\\x00=@$3!\\x00й\\x00й6\\rj4Ġ\\x00\\x00=@3	D\\rj4Ċ\\x00\\x00=@3\\x00й2(\\rj4å\\x00\\x00=@33/\\x00\\x00=@3¦72(\\x002(\\x00=::-#=::\\x00$?х2(+%3\\x00=@1!?х2(2(\\nj/\\n/	\\n1=:\\x00;4==\\rj4=:D;\\rj4%\\x00\\x00=@3\\x00\\rj4	=9dQ\\x00\\x00\\x00=7C2(>\\x002(>2(5\\x00ĤÛ2(\\x002(\\n\\x00=:7=>G=:6Û;2\\x00\\n\\x00=::-æ=:8\\x00=8(\\ne2(=:8\\x00=8(\\ne2(=:8\\x00=8(\\ne2(=:8\\x00=8(\\ne2(	=@1R=@@E2(=@=@R=@1@E2(=@=@%R	E2(=T=:(=@9.f=T=:(=@9	.f=T=:(%ó2(5\\x00\\x00ČÛ2(\\x002(\\x002(\\x002(\\x002(\\x002(\\x00=::-Þ\\x00=:<2(=@-=T=:((+4±=@<Í81=@->\\x00=:<02(=T=:=@	=@%R=@8E(=@1(4_\\x00=:<02(\\x00=:<=@102(=T=:=@=@$R=@8=@%RE=@8E(=@(%ë5\\x00\\x00\\x00S72(\\x002(\\x00=::-\\x00=:<2(+%#\\x002(=:22(72!(5z\\x002(\\x00=::-h\\x003J72(\\x00=:2=@10\\x0000=@10;!=:\\r\\x000=@10(4=:\\x00\\r(+%u\\x00\\x00\\x00\\x00E	=B)\\x002	=:\\x00=8\\x00=:7	>\\x00;0=804=8\\x000=805\\x00E\\n\\x002(=: 4,т=DD\\x00=:<\\x00=:0=@#0=:2=@r05\\x00\\x00\\x00\\x00=::\\x002\\x00\\x00-\\x00\\x00=:::2(\\x00=::\\x00=::4\\x00C5\\x00\\x00?72(\\x002(\\x00=::-\\x00=@xV2(+%#=T=:=:D;5\\x00\\x00O9b==.9b5'77=C=:(,*2(=C,N,2(,ê2(1,è2(==\\nm\\\"b5\\x00\\x00>\\x00c\\x002(/Û2(0\\x002(1\\x002(2\\x002(3\\x002(4\\x002(5\\x002(6\\x002(7\\x002(8\\x002(9\\x002(<\\x002(=\\x00=@SA\\x00H\\\",)\\r	#&-%=N(\\r7=8H=8=8P2(\\x002(=::-=?\\x00P(+%=?=:!=?,ñ\\x00P=?,ì\\x00P=?,ç\\x00P=C=D\\x00P\\x00\\x00C%,\\r=@(=@[!A=C=8T-\\x006 =\\r=C,==\\n2;\\x00\\x00® \\\"\\x00=!E\\x003!­\\x001!­\\x002!E\\x00/!O\\x000!z\\x009!O\\x007!E\\x008!E\\x005!E\\x006!E\\x00=!O\\x00<!O\\x00=C=D3!_\\x00=C=DU!_\\x00=C=;!_\\x00=C=D7!_\\x00=!æ\\x00\\x00\\r\\x00\\x002(2(	==@J&==@1@=C,N2(\\n\\n=:6=:\\x00,í*62(1a,îW\\n,{3&',(/,(=@(=@w!A4>\\x00$(&Ŋ=?=:),X2(=:\\x00=:2=:.\\x00=:.2\\x002(\\x002(\\x00,«2\\x00=:=@9=@Z02(\\x00=:.=@9=@Z02(,Yш2(,n\\x00,n2,b,¯\\x00,0ы0\\x00,0ы0\\x00,0ы0\\x00,0=:=02,\\x00,A,b,¯\\x00,0ы0\\x00,0ы0\\x00,0ы0\\x00,w0=:=02,\\x00\\x00\\x00=:\\x00=:.K7,\\x00\\x00\\x00=:\\x00=:.[,c5\\x00\\x00ó\\x00,\\x00=@-Z2\\x00,\\x00=@-Z2\\x00,\\x00=@-Z2\\x00,nE2\\x00,«2\\x00=:&	35\\x00,2\\x00,w,ó2\\x00,,ë2\\x00=:2\\x00=:.24k\\x00,,i,§2\\x00,w,i,§2\\x00,=T=:=@,=@GZ2\\x00=:\\x00=@Z02\\x00=:.\\x00=@Z02\\x00\\x00\\x00=::=::-\\n\\x00=::4=::2(\\x002(-_\\x00./\\x0000./\\x00=@10=@10./\\x00=@0=@0.5=@(%f\\x005\\x00\\x00\\x00g=C,±*\\x002(=@12(=@12(2(=:&2P,w22(=:Q\\x00,~?2=:\\r>\\x002\\x00ª=?=:),X2(,Yш2(11,¦&=:=:2=:.=:.2,¦\\x00\\x00=:=:.p,\\x00\\x00=:=:.[2(,c2($M\\x00\\x00\\x00C2(=:&2=@=@\\x00P2(=:2=@5\\x00\\x00Q2(=:&	2=@%=@%P2(=:.=@12(5\\x00\\x00\\x00\\r=@(=@w!A\\x00\\x00\\x00e=C,ð2(=:,()==C,Ā2(4=:,ă(	=@1)==:,~(	=@)=6'111\\x00=:0?2(=:8\\x0081=:8=8A\\x0085\\x00\\x00\\x00\\n=@!\\\";\\x00\\x00	\\x00==\\n5\\x00\\x00:==:=:9;2\\x002(=::-\\x00==\\n5(+%\\\"\\x00\\x00,/\\x002\\x00(G=::W1=:5\\x00\\x00\\x00(G==:;=@\\n5\\x00\\x00«=@<Å2(=@C2(=@C2(72(\\x002(-=:=W=:Z?\\r((+%&T2(=W=:=@27\\x002(=::-:=@1,((+%%T2(=W=:=@28\\x00\\x00@'2;;*\\x00J2(\\x002(*\\x00J:=@-(+=@a84% 29=@29\\x00\\x00#=m2(=BJ(2(25=@*)=\\x00\\x00\\x002=R>\\x00=82\\n/=R=:0>=:0\\n=@]26=@#)=\\x00\\x00\\x00\\x00\\x00\\x00\\x00!=C,ü	5=C(G\\r,þ]5\\x00\\x00\\x00\\x00!A\\x00\\x00\\x00ý=*=?,ù/=?,Ą24=@(=@	!A)<&\\x002(,´2(,Ă2(,û2(7,õ,ý2(=C,¨2(=C,ö2(	=C,ÿ2(\\n,ú2(,÷2(1\\n=C=51,(=:8=D'\\x003\\r=@(=@V!A	1	=:G/\\n1\\n=:G\\r=@(=@s!A'\\r(24=@(=@	!A&\\r\\x00ƀ=C	2(2=@1)<&=?	2(2=@)<&=C,ā2(12=@*)<&=C,N2(2=@#)<&=:62(=:\\x00,¬*62(		1	a=@k-,1g2(4,12(2=@)<&,øЫ*62(\\n=?(G7\\x00=I1\\n=:1=?=<R2=@9)<&\\x002(=::-,=?=:5=82=@)<&(+%:,(2&ň==@.#5=M=;;=@)<5=M=;=B;2(X=8g=@R)<5,Č*62(=:=:>1=:=:=:0?=@)<54©=:\\x00,ĉ=:\\x00,¬*62(1a=@kW=@P)<5=:\\x00,Đ*62(1a=@&W=@p)<5=:\\x00,Ć*62(1a=@$W=@)<5#5\\x00\\x00\\x00\\x00\\x00>\\x002(,ďg5\\x00\\x00\\x00\\x00\\x00D#2(2(>\\x00,^2(,³2(1=:>3f\\r=80g2(1,5\\x00'=d5\\x00\\x00/=?=:/,Ĉ5,Ē2(,Ċ2(=C	/=?	5\\x00\\x00Y,1=C,ĔI=C,#5=C,=:0?2(==:,ċ;=@.1==:,ć;=@.5#5\\x00\\x00=C,č	2(=C,ē	2(/5\\x00\\x004:5,ĎЫ*62(=C=@Z\\n2::=@')<5\\x00\\x00M:&\\x001;#<=C,2(==8$1==8$2:=@(=@8!A=@)<\\x00\\x00	,ąR,^5\\x00\\x00'#2(,đR,^2(5=C=:.1=CG1=CG,ę35=?=:.1\\r=?,°=:>3=?,°,ėD;2(&/,Ĝg5=C,²1,¥6=:=C,²Û05\\x00\\x00n,Ě2(==:=:9;2(\\x002(\\x002(=::-=C=:>(+(+%&=C,N2(=::11\\n,ª,Ġ5\\x00\\x00Q'LLL=C,Ĥ#5==:=C,ĢÛ0=8A;=@\\n#5=C,©=:S1=C,©,Ğ,Ė5\\x00\\x00\\x00î'ééé\\r=?=:),X2(,Yш2(,nE2,ğÛ=:\\x00\\n2(,bЮ2,\\x00\\x00K,\\x00\\x00[2(,ģ(\\n2(,ĝ2(==:=:9;2(	\\x002(\\n\\x002(	=::-6\\x00	2(\\x00	\\x002\\x00	\\x00\\x00	2(\\n+(+%C11\\n	=::5_Û2(\\x002(\\x00,c=::-A\\x00,c\\x00\\n=:F2(4\\x00,c=@-,ġ2(4,ě2(((+%R5\\x00\\x00\\x00\\x00Ā'ûûû=R=:=R=:=:2	(=R=:=:>\\x002=?=:)=8\\rÛo=R=:=:=R=:(2=R=:	(\\\\Û02(==:,ĕ;=@\\n/==:,Ę;=@\\n5=M=:%Z=C,®R=M=:%=C,®=:2(6,À=:Û02(,Ĵ=:Û02(,Ĩ/,Ĭ5\\x00\\x00\\x00,'Lу2(=D2\\x00\\x00;	(5\\x00\\x00\\nƤ=&2('=?,¹==31=?,¹=::2(#2(==:=?=85;2(,Ã2н=8,Ī2=?=:6==:=?=:6=C,Ã=:32(=)=:=?=:6#2(==:=?=:_;2(,ī2н=;=82=:=82==:=?=:_;2(=:,`2,ĩ2н==:=?=:_;2(		,½2н	=:&=8,2	=:н2==:6==:6==:	6=8.2(/	,`.2(/Lн	.2(/	,½	.2(//=@(,ı!A\\x00\\x00i\\x002(=9.*d2(==:=>3=:9;2(\\x002(=::-==\\nR)((+%',³=dg=@R)(5\\x00\\x00=C,N2(,º2(,2(,2(=:6=:6L2/20=C=8-=:0?=::21g234g234\\x00,!22\\x00\\x00Љ=C,N2(=:62(,Į==\\nÂ,¶)=@l)=@J)=C,Ħ	=@$4==:=8M;=@.	,¼$4t=C,ħ	=@1$4^=C,ĥ	=@#$4H=C,İ	$45=C,ĳ	/=(=:,ĭ;=@.=@}$4	=@$&=2(=@%W2,Ĳ!A=@W =C=:]1=C,Ä/=C,·2(=C,į1	=C,ĸ=@.=@!A=C=:]2(,ļƅ=@Y!\\\";=C,ŀ	=@!$4±==:,Ł;=@\\n=@:$4==:,Ļ;=@\\n=@$4o=C,1\\r=C,=:S1\\n,ľ=C,g/=(=:,Ŀ;=@.=@(=@!A4'=C,ķ/	=C,ł=@$4$=C,h1=C,h,Ĺ=C,h,Ķ4=C,µ==\\n1=C=:D,µ==\\n1=C,Ń1=C,ĵ=@+$4W=C,»1=C,Ľ4D=C=:U,ĺ1=C,ń4+=C=:U,ŏ1=C=:U,Ŕ4\\r24,ņ)<,¸=?=:5=:g\\r=@5=@1!A=C,Ň	=@$4=C,Ņ	=@#$4y=C,ň	=@$4c==:=8M;=@.	,¼$4B=C,h1\\r=C,h,ŋ	=@`$4 =C,¾1\\r=C,¾,Ŋ		=@+$=C,2(1,¿\\r=@J=@!A,}1\\n,},Â\\r=@0=@N!A=C=84==\\n,¶),\\\"8,Œ)\\x00\\x00ʨ=C,N2(=:62(=C,Ō	=@(=@6!A4ɺ=C,Ŏ	=@(=@7!A4ɠ=C,ō	=@(=@~!A4Ɇ=C,Ő=@(=@>!A4Ȭ,=@(=@!A4ȗ=C,ŉ	=C,ő4\\r=@(=@/!A4ǳ,=@(=@c!A4Ǟ4=@(=@	!A4Ǌ=C,»1=C,œ=@(=@<!A4ƪ=C,Ţ/=C,Ŗ\\r=@(,ţ!A4ƍ,ŗ6=:/	,À=0=@(=@y!A4Ţ,Ŝ6=:\\r=@(,Ť!A4ń,+=@(=@!A4į,)=@(=@H!A4Ě,*\\r=@(,Á!A4ć=C,ś1=C,ŕ1=C,Š=@(=@=!A4à=C,Ř\\r=@(,Ş!A4È,š=Cg\\r=@(,Ð!A4³,=@(=@I!A4,\\r=@(,ř!A4,\\r=@(,È!A4x,.=@(=@&!A4c,=@(=@8!A4N,=@(=@t!A49,=@(=@9!A4$,\\r=@(,ŝ!A4,=@(,ş!A\\x00\\x00\\x00'#$>\\x00$,\\x00\\x00=@f)\\x00\\x00=@(\\x00!A=@$	\\x00\\x00	Ȧ2(\\x002(\\x00=::-ȏ\\x002(=D^=:&3ª=:=8/=:=8=84ǈ=:=8=8?=:31=DF,Ś3=@i$&&4G=DF,¥31=:=;A1=7@6=:=:=;A\\n=@$&&4ň=DK=:&3ĸ\\x002(=D=::-Ġ=D2(=5=3Ā=8/=8=84â=8=8?2(=:I34=8=:2(1=<6=:\\n=@$&&4=8#3w=?=:5=8,Ŧ=:F3\\n=@D$&&,`1,`=::=@;-5=<6=:,`/=B6=:,`,Á$&4=IB3,È$&(+%ĳ(+%Ȝ\\x00\\x00\\n®=C,Ų2(=C,ů2(=C,¨2(=C,ť2(1	=:>32(1	=:>32(11\\r=@(=@i!AI'*(2(2(		=D^2	=DK2	=>]2=9B=?=:5/=?=:	6\\x00\\x00C=C,ŧ2(1	,Ŵ	2(1=C=:=:0?=:8,ū82(/5\\x00\\x00=M=<2(=C,ű==.1	=C,Ű==.1	=C,ŭ==.1=C=871=C=87=:0?=:8,ũ82('...=C=:1!=-=:=C=:=:8,Ũ=@82(/5\\x00\\x00:'333,-,ŪR,^2(,ŬR,^2(,ŮR,^2(115#5\\x00\\x00\\x00ē>\\x002(>2('āĄĄ=C,N2(=C,Í1,Ò1,ų6=:,Ò=C,Í=C,ƂK4½,¸=?=:5=:g/=C=:]=:=:42(=:W2=8=24z=C,1\\n=C,,¿C'9<<=C=8=::(4$=C=82¥=C=8=D\\\\=8E\\r((4#=C=:]1=C,Ä/=C,·(4((\\x00$M\\x00\\x00\\x00#$M\\x00\\x00\\x00\\x00,==@\\\"=C,±*\\x002(=:\\r>\\x002=:Q,Ż2\\x00=@(=@&!A=@1$	\\x00\\x00m=C(Ge=C=:>31=C=::=@11=C=:1=C=:=::=@==:=CÛ0,ż;=@\\n5#5\\x00\\x00\\x00\\x00==@\\r#59c/9d#5\\x001	\\x00=: `'\\x00Ź2\\x00\\x00=::=@p8\\x00=:A\\x00=@p;2\\x00\\x00(/\\x00(\\\"=@#$	=@%=7+!\\\"==@15#5M\\x002(9c=::-99c=D-=8^\\x002(2\\\"e9cLн2\\\"f\\x002\\\"g5(+%F#5\\x00\\x00P\\x002(9d=::-<9d=D-=8^\\x002(=@12\\\"e9dLн2\\\"f\\x002\\\"g5(+%I#5\\x00\\x00\\x00	\\x00)\\x00\\x00\\x00¨9i&2\\\"i\\x00!K=d1*\\x00d2(=802(&=:0?2(==:щ;2(=8[?2(Û1=::\\x008=8[?2(==:=BC;=@\\n/\\n=<0]/=IK5#2\\\"i\\x00\\x00\\x00n=C=:B=8D=C=:B=:Z?=@2(\\x00=:,\\\\Ž2\\x00\\x002(\\x00=::-\\r\\x00N(+%=@1,\\\"<!\\\";\\x002\\x005\\x00\\x00\\nć\\x00=:2\\x002(=::=@-&=8[?2(\\x002(=::2(-(eN%=::=@:2(,\\\\=:2Ŷ\\x00:2(9j82\\\"j=:2\\x00;2(=@<¿85=?,ƃ=85=C,ź,Ɓ2(T,ŷ\\n04\\n2(	=::2(\\x002(-	(eE2%=@*	!\\\";5\\x00\\x00\\x000\\x002(,ž2((\\x00=@SA\\x00H\\\",)\\r	#&\\r\\x00\\x00\\x00\\x00»=@7Q2(=@>Q2(=2=:0?L2(\\x002(=R=:=:0=:,Ƅ2(=::=@Ta2(=:A;L2(V=@42=@1,\\\"<!\\\";=@!\\\";\\x00=!O\\x009j!O\\x00!_\\x00!_\\x00\\x007=Lм2(=@<½8/=@<Ç81\\r=/==@8!\\\";\\x00\\x00,H=8=IE]\\n=q2C=?2q\\x00\\x00=C=8-,ſ2(/2\\x00\\x00k\\x00\\x00!*\\x00J2(/\\r*\\x00J:=@82\\x00\\x00	\\x007*\\x00J2(2(2(\\x002('\\x00$(/\\r*\\x00J:=@;82&\\x00`>\\x00=82=5$=>\\\",k0\\x000=:=0;$^*\\x00J2:=@822\\x002\\x00\\x00=@-\\x00r$\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00.=@F3!=@u!V	=@<Á!V\\n=@<¹!V\\x00\\x00q=@F3d7=8H=8.=D=8=;=;=8;=8P=:_=;[2(\\x002(=::-=?	\\x00P(+%\\x00\\x00\\x00 ==@(1=&7\\x00\\x002((&H=<\\\\*62(=:0?2(=:2(a2(4\\n\\x00a2(5\\x00\\x00\\x00/=1,4\\x005\\x00\\x00i\\x002(=::2(-Q,i=@2(32(2(=:\\r=::2(=::=@<O8$ŵ(+%X\\x00\\x00\\x00=@/F3=@<Â!V\\x00\\x00\\x00y>\\x0027=2(=!=:>1\\r=1==@*J=:=C=88\\r72(\\x002(=::-2(=:0?L2(`%,\\x00E'@@@\\x002(=::--2(=:0?L2(\\n2(`%;\\x00\\x00\\x00>\\x002\\\"k\\x00\\x00(,4,2/	>\\x00\\x00K2\\x00\\n==m2\\x00\\x00K=@/F3>=m=C=8-!=R=C=>Q!===3/==@*8\\x00!K\\x00\\x00\\n=?2C=q2?\\x00\\x00I'DDD=-=:\\x002(,Ÿ*62(\\x00=:>\\n/=:/==.1\\x00\\n2\\x00\\x00\\x00=@/F3>\\x005\\x00$,\\x00:2(=@j8\\x00!K,5\\x00\\x00\\x00	\\x00+2(Û2(\\x00=@SA\\x00H\\\",)\\r	#&\\x00\\x00\\x00\\x00\\x00=::\\x008\\x00!z\\x00\\x00}=@Q/Û2(=::\\x003&'[[[=:=:92(\\x002(=::-8=:=:+2(=::=@1\\x002(+%E\\x00\\x00Y72((G#\\\"72(=:=80б00\\r=::\\x008=D=:\\\"=:90=;<02\\x00\\x00\\x00\\x00\\x00\\x00SA\\x00H\\\",)\\r	#&<=D9G2=;HG2=DG2=DGG2=8RG2\\x00\\x00\\x00!K\\x00\\x00\\x002(\\x00=::2(\\x00!E\\r)(\\x00!U=@1)(\\x00!U=@)(\\x00!U=@*)(\\x00!U=@)(\\x00!U\\x002\\x00\\x00±\\n,2=@=;H\\x00S,2=@=D\\x00S/	=8QG,2=@=D9\\x00S/	=8QG,2=@=8R\\x00S1=@=8Q\\x00S\\x00\\x00==@*8~5727,,ƀ,ƌ,Ǝ,Ɗ,ƈ,ƅ,ƍ,Ƒ,Ƌ,Ɔ,Ə,ƒ2(\\x002(=::-\\\"'d[=:\\r(+%/5\\x00\\x00.=;\\\\2\\x00\\x00p2=@=DG\\x00S5#5\\x00\\x00č'ĈĈĈ*\\x002(,Ɣ2(,Ɖ0=:=8L2(=?=:)=:I2(=:=81=82=8?,Ƈ2=?=:=:,\\r=;J\\x002(=8K2(=8Z2(\\x002(		=::-A=:=>+	2=8K./=8Z.=:	\\r(	`%N==:=8L;з2(\\n=?=:=8\\r\\n5\\x00\\x000,2=@=D9\\x00S,2=@=8R\\x00S\\x00\\x00\\n\\x00Ň=C=I2=§=?=:)=:I2(=8?,Ɛ2=?=:=:,\\r=?=:/=52(=8(K72(2(=8(=9:-=:=8(\\r(+%,==:=:9;ͥ!=?=:=8\\r4,\\\"8=?=:)=:I2(=@Q2(=83н=;	6=8?=5&9L0=I$009J0=809L0=>02=?=:=:,\\r\\x002(#2(=C=8J>\\x00=@z;2(	4\\x00\\x00¢'>>>=?=:/9L2(1=D:=:>=D:=<$=D:2+/	=@8K=!=:=C	6=?=:/=;	=?=:=8\\r	4=C=8T>\\x00=@z6\\x00\\n,	\\x00\\x00Ï'ÊÊÊ=?=:),X2(1,Y¯=:=@\\n2=:.,Ð2,Yш2(=:(2(,nE2=<]=>B2,b=9?2,\\x00\\x00=@=@6K,b=5R2,=@=@#A,b=<N2,=@=@A,~?p5\\x00\\x00\\x00̂',--=?=:),X2(,Y=>//,Y=52(&'ʷʷʷ72(=>2(=I2(	=7?2(\\n=B=DN\\n6=C=B]7=@<»=@<À\\x00=@<¼=@<¸\\x00\\x00=@<Ì\\x00*2(=B!=DN=7A\\n=DX=@2\\n=DM=@2=5'?2(=;#=;2(\\r=;\\r6=D$\\r\\r=;#=;D2(=;	6=D$\\r=;\\r6=;6=IX\\r=5 \\r=D6=7#=B;2=DE=<=B1;2=BB=B4\\r=<=D6\\n=DX=<F\\x00\\x00Y=B\\n=DEA=77=9X\\x00\\n=DMA,XD.=:,X,~?\\r($(=DZµ7=;=;D2(7=7=IG=<A=5=;6=;12(\\x002(=::-S\\x002(=::-<=DZ;2(=:=7.=;:=>\\x00A(+%I(+%`==:=:+;p5_\\x00(GY=*=:I\\x00=: 3;=5:\\x002(==.\\\"=:-1=@<ºW=:\\r\\x00\\x00M=57?2(\\x002(=::-.2(=>22(=:\\r$(+%;\\x00\\x00\\x00ì=C=7?=BZ*\\x00=7-?2(7=DC==\\n\\n=DC4Û=;==\\n\\n=;4Û=;==\\n\\n=;4Û=DI==\\n\\n=DI4Û=;==\\n\\n=;4Û=D==\\n\\n=D4Û=D==\\n\\n=D4Û=D\\r==\\n\\n=D\\r4Û5\\x00\\x00\\x00в72(=C,N2(=:,Ɠ\\r=:,ƞ\\r=:,ơ\\r=:,º\\r=:,ƕ\\r=:,Ƙ\\r=:,Ɲ\\r>\\x00,^2(=:\\r=:,\\r>,^2(=:\\r'\\n,\\r2(	Û2(	=:	\\r72(=9\\x002(=?=:)=>^2(\\r\\r1\\r=:O1\\r=:Ot?=:=82(\\x002(=::-=:\\r=:O\\r(+%)=:\\r72(=>62(=?=:)=52(1=:O1=:Ot?=:=82(\\x002(=::-=:=:O\\r(+%)=:\\r=C=:V1=C=:Vtœ72(=I1=:=82(\\x002(=::-<=:=C=:V=7Jе\\n\\nЬ04Û0Ш0=8_\\r(+%I=:\\r72(=5V=:=82(\\x002(=::-<=:=C=:V=B=е\\n\\nЬ04Û0Ш0=8_\\r(+%I=:\\r72(=<;=:=82(\\x002(=::-<=:=C=:V=9Vе\\n\\nЬ04Û0Ш0=8_\\r(+%I=:\\r=:f\\r>,^2(=:\\r=:f\\r=:f\\r>,^2(=:\\r=:,´g\\r,{/,Ɵ/=C,{2(=:\\r=:,Ɯg\\r,ƛ2(==:=:9;2(\\x002(=::-=:(4\\x00\\r(+%+==:=:+;p5$'\\x00/\\x00g/\\x00=:G5#5\\x00\\x00\\\\==:\\x00=8\\r;2(=C2(\\x002(=:::-2(#5(`%*=:::5\\x00\\x00\\r'\\x005D5\\x00\\x00w72(=<!2(`\\x002(=::-N2(==:7=:=8>=7%=50=:9;2(=:\\r(+%[5\\x00\\x00g72(,2(R\\x002(=::-@2(=:==:7=:&=BM=8>=:9;\\r(+%M5\\x00\\x00l\\x002(,=:\\n,2(4,=:\\n\\n,2('=?=5Q=>W\\r2(#2(=7=Cg2(75\\x00\\x0072('LL=>)$m=:=DQ\\r=:=>8\\r=:=8>\\r=:=Ig\\r''88=B/2(==@E=<U02(=C,d=:=DQ\\r5\\x00\\x00ǶÛ572(=C,ƣ2(=:1,^\\r=C,Ƣ2(=:1,^\\r=C,ƙ2(=:1,^\\r=C,ƚ2(=:1,^\\r=C,Ɩ2(=:1,^\\r=C,Ơ2(=:1,^\\r=:=C=;S\\r=C,N2(	=:	=:6\\r=:	,}1\\n	,},Â\\r=:	,Æ1\\r	,Æ=:0?\\r=:	,Ó1\\r	,Ó=:0?\\r=:	,ª\\r=C=8@2(\\n=:\\n=D)\\r=:\\n=DO\\r=:\\n=D.\\r=:\\n=DV\\r=:\\n=D1\\r=:\\n=:.\\r=:\\n=:\\r=:\\n=;Q\\r=:\\\"=:90p25\\x00\\x00\\x00	\\x00!\\x00=@SA=@_H\\\")\\r	#&==:RG2\\x00\\x00P=&\\x002(\\x00=::2(\\x00!E\\r)(\\x00!z,2(=@1)(\\x00!¡\\x002\\x00\\x00=C=8'=9Û\\x00A\\x00\\x00*=C=D*\\r=C=D*2(4'=7,m2(5\\x00\\x00/Û2('\\\"\\\"\\\"=C=D]\\r=C=D]2(4=>&m2(5\\x00\\x00\\x00p=:RG2=@TQ2\\r=:R\\x00S',2(2=:R\\x00S=C=;K>\\x002=C=D_	=C=;Kq\\x00\\x00P=C=8'&=C=D_=>V32(2(2(72(=C=8'>\\x002=C=Ɨ>2=C=7>2>$\\x00Ä9=?=:)=B2=:=95=5)2=?=:5=:,\\rаe0=;20*\\x00J=8	?02(2(=>\\x002,c2=B22=:Q=7=v=8F024=:\\r=:Q=9 2\\x00\\x00=v=8F2(725\\x00\\x00\\x002($(\\x00\\\\\\x00\\x00\\x002=:R\\x00\\x00S=@*$	\\x00\\x00\\x00\\x00%2(\\x00=@1SA=@1H\\\")\\r	#&$\\x00\\x00=\\x00=:=@SQ?=@6Q?=@	Q?=@Q?K\\x00\\x00\\x00\\x00>\\x002	\\x00>2	\\x00>2	\\x00\\x00>2	\\x00>2	\\x00>2	\\x00>2	\\x00>2	\\x00>2	\\x00>	2	\\x00>\\n2	\\x00>2	 \\x00>2	\\x00>\\r2	\\x00>2	\\x00>2	\\x00>2		\\x00>2	\\x00>2	\\x00>2	\\r$\\x00=@1-5\\x00:\\x00=@1:05\\x00\\x00\\x00=@1-5\\x00\\x00:5\\x00\\x00\\x002(2(\\x00-\\n((`%5\\x00\\x00=@2\\x00=@2(=CD35\\x0005\\x00\\x00=?\\x0045\\x00\\x00=?=:)=8=@b4=@5\\x00\\x00=1	=C=8G=@o5=@v5\\x00\\x00U2\\x00=@12=@2=C,N=:6=: 3\\\"\\x00000=@1=@05\\x0005\\x00\\x00=@=@<05\\x00\\x00=@=@=@1:5\\x00\\x00=@%=@T5\\x00\\x00=@=@:5\\x00\\x00=@#=@0\\x0005\\x00\\x00%=@2\\x00=@2(=C=:ED35\\x0005\\x00\\x00=C=:D=@45\\x00\\x00=?=:)=85=@b4=@5\\x00\\x00=1	=C=9<=@o5=@v5\\x00\\x00X2\\x00=@12=@2=C,N=:6=: 3%\\x00000=@1=@0\\x0005\\x0005\\x00\\x00=@<2\\x00=@2\\x0005\\x00\\x00 =@=@=@1:=@05\\x00\\x00=@%=@T5\\x00\\x00=@=@:5\\x00\\x00$=@#=@0\\x0000=@-5\\x00\\x00\\x00\\x00\\x00\\x00\",ĭĬĮįɅɫİı\x00jĥĦħĨĩĪīƭƮƯưƱƲƳƴƵƶƷƸƹƺƻƼƽƾƿǀǁǂǃǄǅǆǇǈǉǊǋǌǍǎǏǐǑǒǓǔǕǖǗǘǙǚǛǜǝǞǟǠǡǢǣǤǥǦǧǨǩǪǫǬǭǮǯǰǱǲǳǴǵǶǷǸǹǺǻǼǽǾǿȀȁȂȃȄȅȆȇȈȉȊȋȌȍȎȏ,ò$ó&ôPõSŌUöY÷[ø`ùcúÀĎÑďÙĐÜĘäęçĚêĜ÷ĝĞğĠnġü÷ƍ¶ç]eP@»góÑ×é\x00.A×ê\x00Dl×E\x00ß·È¿×Ë\x00I/ÝHØ\x00\r×X\x00è×ö\x00Ê×í\x00Z&×z\x00¹×\x00ô×{\x00 Ó°×ò\x00?9æÓÄ×\x00[×\x00'Ýì:\x00¸×u\x007cÓðÈ+x×t\x00\x00/k×^\x00$ÉÝà5\x00×J\x00)¤×Q\x00©×Õ\x00_ÛÓÓÚ×¢\x00#×Ï\x00;×N\x00º×ñ\x00±b×â\x00SÞ¼ÓÝOÒ\x00Ü×%\x00Â!×=\x00¦,iÓ×Y\x00oÝ­´\x00K×}\x00R>ÓfÝÆ\x00C×p\x00¾Î×\x00a¯ÝV\x00Ð×å\x00`×\x000q×\x00®«Ó¡×\x00Ì¥ÁÓ	×~\x003×\x00F×M\x00\"Ýî\x00á×v\x00jÓ×\x00ª×1\x00<ëÝ|\x00£×\x00Ã-×h\x00w ×\x006½Ý*n\x00y×r\x00mÇ\nsU¨2L8ÖWäÔ×§µ¬õBGTï(Íï\\d³Ù²Åã4À!Ņ.Ĳ\x00	\x00\n\x00\x00\x00\rĿ\n(Ʈ˳ۡ\rz\r\r0	ǘ\r\r	Β	յ	\x00	Џ		ͤ	Ы	ݘ	\x00	Է		ۓ\n	>ƭ˧\n#ĳɼইİĴ\x00	\x00\nƥ\nࠩ\nɱ\n࣍	\n\n\nJ\nɕ	>İĵ\x00	\x00\nƥ\nअ\nɱ\nѢ	\n\n\nJ\nɕ\nƦ\nݸ\n¦\n̔	>İĶ\x00	\x00\nɼ	\n\n\nॉ	ࡥ\nƫ\nОƭ˧	#ķKUĲࢉƯߥĴƸƘǣƻĆƽܷǒĵƼ͢ǣǒ	ĴƸʫ\nĶƹ̡ǲĴƴ¾ǣĵƴǾǲǣǣĴƺɃǷĲƶۈǣǷN.\rǯĲƷŵǣƼʬƺࠞǯǣĶƼǤǲĶƸ̶ǥĴƼʺǲǥĶƷýĸĲƼľĵƺŲǪĶƹŒǲƳصƼЄǪǲǪĵƻǯǎĲƸװǪǎĹĴƹʯĳƼʅĺǯƵÔƼ¬ǲĳƷǽǯǲĶƽԻy.ĵƼȻĳƼýĶƺ̡ĴƺƈǥƶʥƽɈǲĴƶ̗ǥǲĻĳƺɾļǪƹӽƻǐǲƷ۲Ƹ࡜Ǫǲ#ĲƼʫĽĴƷϞǣƽࠁƸɵǥĴƷĐǣǥĵƷӞǷƵÔƺɀǎĵƽƨǷǎNy.ĵƸơ ǷĲƸǣǯĵƷּǷǯ!ĴƼċ\"ĴƺƷ#lĵƼя$Ĵƽơ%ĵƽʌ&ǪĲƹɝǯƽ«ƽĎǪǯ'ǲƶʣƹʘǷĵƼ̗ǲǷ(ĳƺǤ)ǯĲƽݼǣĲƸܩǯǣ*lĳƸঈy.+ĳƻƵ,ĴƼƱ-lĵƺק.ĶƽȠ/ǒĴƽʚǲƻɰƺেǒǲ0Ķƹ´1ǯĳƻߚǷĴƺ̱ǯǷ2ǒĵƺǕǥƵ־Ƹϛǒǥ#3ǣƶুƺɆǷĵƼޥǣǷ4ĵƺƘ5Ķƻɢ6ĴƸࢃ.7ǲĵƶɟǒĲƶӚǲǒ8ǣƹѤƻĮǯƼɂƷӄǣǯ9ĴƷŋľĴƽƘ:ǲĵƻࠚǎĳƷ߁ǲǎ;ǎƸɌƺiǥĳƽɫǎǥ<ĳƼՄ=Ĳƽƈ>ĵƺ˕ĿlĵƸȻ?ĳƸɢ@ǥĳƻȶǎĴƼǾǥǎNa.AǲĶƹȌǒĲƺהǲǒŀĵƹŪBĵƺ܅CĴƸछDĴƸӝEĳƼɛFĵƾĽGǲĴƸʞǪĳƻॆǲǪHĵƺ̊IĴƺ˺JĶƹɚKĳƽۅa.LĵƻƷMĴƽƙNǒĳƵֺǥĵƺȚǒǥOĴƽƷPĶƽɁQĶƹăRĵƺǛSĳƷċTĳƼˋUĳƷȊVĴƶɁWǒĵƺ˷ǲĵƸզǒǲN.XĴƽɖYǥƻѸƶ\\ǪƾÔƹםǥǪZǯĵƻȌǒƾĔƵŻǯǒŁĴƶ͋[ĳƷ̳\\ĵƽý]ǪĲƻҢǷĴƶ̮ǪǷ^Ĵƹ˺_ĳƻЋ`ǥĴƹƢǯĲƽ̱ǥǯaǥĴƸ࠲ǣĶƸΔǥǣ#bǎĵƻՔǒƺࣤƹʊǎǒNa.cĲƷɖdĴƼžeĴƼňfĳƺˋgǪĲƻȫǲĲƼծǪǲ#hlĴƽݺiĳƼޜjĵƽܺkǎĵƷˣǷĲƹˉǎǷlĵƽċłĵƼƈmĶƹ׺U.nĳƼǛoĶƻŋpĳƷ՝qĳƽ´rĴƽऺsǲĴƼŒǥƺ˽ƻܦǲǥtĲƼ͎uĲƾԥvĳƸľwĳƶŪxĲƸɾyĵƻڧy.zĵƻɚ{ǷĳƸΟǪƴŘƷ՜ǷǪ|ǪĴƴިǎĳƻࠔǪǎ}ǥĲƻƃǎĴƽπǥǎ~ĳƷžĵƹ̊ĴƽăŃǥƽȩƼঀǒĳƹۢǥǒĴƹޞĵƹ্ĶƹƱlĴƺӢ.ĳƸ˝ǯƸݱƶ\\ǎĲƻĐǯǎĶƽƱǎĳƸηǒĵƺϸǎǒĳƷ࠼lĲƶơĳƽŹĵƽѡĴƷ´ǯĶƼɑǥƶĆƼ঄ǯǥǣƳʴƹÐǯĴƸ̃ǣǯǲƵ«ƴ˖ǪĴƸĐǲǪNy.ǥĵƸۻǪƹȒƸţǥǪĵƻĽĶƹĉĴƵڌńĴƺʌǥĵƼ̶ǷƻʬƻьǥǷǷĳƺʞǲƶهƼɔǷǲǪĵƽݒǯĴƹܚǪǯĴƼȊĳƹňĴƺăĴƹঐ.ǒƷ͓ƹܗǯĶƶࠝǒǯĶƼƭǷƵࠈƽटǲĳƳҍǷǲ#ǪƵɂƸïǣƽՎƺমǪǣ ǪĳƶˣǲƼǫƽॼǪǲ¡ĵƸস¢ǥĵƷۘǎƹշƸĎǥǎ£ĵƼ˝¤Ĳƽࡰ¥Ĵƽ̐¦ĶƹŲ§ĵƺλ.¨ĶƷǛ©ǷĴƼρǣƹǇƻʊǷǣªĲƹƵŅǥĵƽǵǒƷʴƺࡪǥǒ«ĳƷࢹ¬ĳƷɛ­ǣĲƼǵǒĳƷڝǣǒ®Ĵƽ͜¯ǷĴƹͱǎĲƽȑǷǎ°ǲƽօƹMǥƻĔƸݿǲǥ±ĳƻॎ²ĲƷȱ.ņĳƹ˕³ĵƷܶŇlĴƺʅ´ǎĳƻࡤǷĳƺʺǎǷµǎĵƷȨǪĶƸщǎǪ¶ĵƽƵ·ǒĳƸǯǷƾǇƸϻǒǷ¸ǒĴƼǕǲƴͲƵŻǒǲ¹ĴƹǢºǪĵƼŵǎƼʥƸٻǪǎ»Ǫƽ˽ƻٓǣƼƯƺࡌǪǣ¼ĲƼߢ.½ǎĶƹɃǯĵƹ۠ǎǯ¾ǯĶƶ˃ǪĳƼঁǯǪ¿ǒƵ«ƴ˖ǪƺञƺֱǒǪÀǯĶƼ̿ǷĴƺɫǯǷÁĳƽڥÂĴƸŹÃĴƽľÄĴƺ´ňlĶƼĉÅǎĴƷ԰ǪĶƼ٭ǎǪÆĳƽ̳ÇĳƼȱm.ÈǪƵɷƻȄǣƷپƼ؀ǪǣÉĳƸࣖÊĳƼʯËĶƺľÌĵƷƭÍĲƻŹÎǯƸࠏƻ˰ǒƻǫƽɔǯǒÏĳƸýÐĴƼƙÑǥĴƼɟǲĶƻޏǥǲÒĳƼڷÓĲƸϣ.ÔǲƹǡƽïǪĳƹƨǲǪÕǯĵƻāǥƽऋƽаǯǥÖǥĴƷϔǪĴƺǽǥǪ×ĶƻƙØĳƺƭÙǒƵɷƸՠǥĴƼĐǒǥÚlĵƽŪŉĴƼŋÛĲƸĽÜǪĵƽɝǯĳƼ३ǪǯÝǣĶƹĚǯĵƺ՘ǣǯÞǥĲƶȶǲĳƼˉǥǲN.ßĴƻȠàǪƸॿƵǞǥƴŘƵۙǪǥáǎĶƸ˃ǥƷɌƻŻǎǥâĴƷăãǪĶƻ˷ǯĵƶռǪǯäĴƷࡶŊǪĴƽ¾Ƿĳƻ̮ǪǷåĲƶŲæǥƵŘƺƑǎĳƺ՞ǥǎçlĳƺžèĴƶ؊ŋlĶƾݷÁ.éǥĵƽࣧǲĳƼকǥǲêĴƻǢëĲƺߓìĴƸԒíǲƼՊƼïǯƶ֍ƻϐǲǯîĶƸċïĴƸ̐ðǒĵƼډǎƽʣƷԸǒǎñǯĴƻӵǣĴƷ̃ǯǣ1ǞƳoĦưوōǴƳ߅Ŏ,\x00\x00	ǴƳĻźƴǑƳࠟ	Ƶ٢	\nǦuƳá	ƳӗǦuƳú	Ƴ࠯ƴȖƴ̒ƴҋƳƯ	ǈّǈԺNˣ.û\x00	\x00\nƳǿǈÞƳǧƴӕ		Ƴ-	G\n	sŷ\n\x00ǬǻƳ\n\x00Ƴڂŏ,\x00\x00	\x00\n		ưð	G	B\n\nư\n%ڻưԙϭ؃	ހŐ\x00	\x00\n\x00ë+ƳćŵtǈȏXǈȏŏö	ުưȐ\nƳƳ\nâ	*	9ưѝÛ	[ݙưҠ	[ưؖő\x00\x00	\x00\n)ƳोƳ§\x00	\x00\nWݤ\x00ƶؤ\x00	ÈŒ\x00	\x00\n	ƳƳ\n\n	\nĴ\nuޟœ\x00	B	n0		½üBƳ-ĴƳѨ޸ư࠙Ŕ\x00	\x00\n\x00\x00ǈÞƳ\x00ƴ܉ƳћB	z	Ƴ-	G\n	s\nƳȜưЁǻƳ\nhưǴƶº\x00ưӮưڦ:ư࣎	ǙƳ޶åǻƳ\n\x00ưࢎ	ƴল	ʓǈwƳƴýؘ\x00Ŕŷ/UǈفƳ#ŕ\x00	\x00\n\x00\x00\x00\r४	Ź\x00Ƴࡹ	Ƴ]ưÌ	ࣇ\n	ǌƳºƴƃ\nƳ`\nߗƴڵ\nښ\nǍߌâ\n֕æ\nǍÊ࡮\nƳÆࣉ\nƳÆ࣑ư֋\nuƴࡸæ\nǍÊ\nƳÆӐe\rǈwƳ\n\x00ƴƃƳࡽ\rƳįŉ\rŖ\x00	\x00\n\x00\x00ƳËưM	\nƳ`(Ʈŷ	0\n߬	ZưĄ	ZưÚ	Zưҭ	োŗ\x00	\x00\n\x00\x00\x00\rƳ`	\nƳ঩ưM\r(Ʈŷ	0	\r\nP9ưqưC\r\nP9ưcưC\r\nP9ưYưC\r\nưţ\rNɱ.Ř̻9ưqưɊ9ưcưɊ9ưYưCưҙř&ŖঃŚ,\x00ǧƽ̙ǧƷϦ)ǈƳ'ƽ߂ܿþ,ǴƳΑƴшǴƳƩƴ݃ɫȂś\x00	\x00\nŹ\x00ƴՃ	ǈŚƳ\x00ƴࠠ	'ưָ\nǈŚƳ\x00ƴ॑\n+ưđ\n	Ŋ	ƳԆǈƳǻƳ\x00	ϯŜŤśŒ\x00ǈў	֗ŝǡŞ÷Ş,\x00\x00	ǧƳƉƸŒčƳ؞	Aƴoƴ΃		ϷǈĺǈŔư؝Ÿ	\x00ƳऎŸ	\x00ƳԤũ	\x00ŨΚքŨ÷ÿ\x00K'ǫ͕+Ƴ৒ƳՒԘŶѕ6ǡŞǡģũ\x00࣪ş,ƋưܽďǾǾƳɶǾƳŝ͖ǔƳœƳΗŠ\x00\x00	\n¸࠱\n(ǵȅ\nƳˀǬ	খͶ	ӛš\x00	\x00\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00Ƴ࡟\nƳ݂ƴǞ	ş\n	3	=	ֲ\n)\rŭƉǘjǘvū\n\rsƳ݉Ƴ-GŠJ\x00ďޤȎ˥UүɧƳ-GsƳ܎ưފ٩vߕң(ǵȅƳˀjŮŠ\\J\x00ďࣘȎƣ۴U˥ǈչưđǈrư࡬2گ2+ưϽǡ)ŨÓǡR+RUǈڇǈݾӟ.ŢΥš#ţ\x00	͌ǈrưؓš\r	ܘ	H	ƵӍ	ƽ݆Āȣǈrưαǈځư´Ť˓ưҴ:ưࢿưং:ưज़ťęưӅ:ưňŦ\x00	\x00\nǮƳӉŤׇ		Ƴ-	G\nǮƳ\x00	Ť\n̓ť\nƄư৕\nƄưֳ\nƄưݬ\n۵ư͛\nUǈƳǈÑƳh	؈ŧ\x00\x00	\n¸'Ƴĺ'ƳҞ+ǘψ\nŦ	\n\n'Ƴĺ\n'ƳߛŨ,\x00\x00	\x00\nōǦ	ǰ×	6+Ƴá	ƳŴ+Ƴú	Ƴɭ\nঅƳ̕Ƴ·ƴʝưś\nǈ٘\nƴٮ@ƴǑEŎRƴȖǓƴʁ\x00jǭv	\x00J\n\x00+ǈԹIƶ̽F֮ũ\x00	\x00\n\x00\x00\x00\r\x00\x00\x00	O	@\x00	E	R		j	v	J	+	Iǈǐ	FƖ	¢ǈǐ	TǈЊŷ\x00Ǎ{	2ưط\nō\nǰ×$æ\nǦuƳáƳŴ\nǦuƳúƳɭ+ǈ०EL	TƩ\rǧƳǜƴ¾Ǒ\x00ǑǑsǑƾǈҽŸǑƹࡁ	2ưĎ	N\rǦs\r+Ʒࢯ	2ưҐ	ܒŧ\r\x00ǈ\\	@Ů	2ưĎ	NƧ\rӫōƳ̕Ƴ·ƴʝưݝŷ\x00ƴкǟƨǈ࣊ӈŸ\x00{ǈÑƳ\x00ƳͺǈĠƳࣛǸ\nǈĠƳࠢǸ6ªǑ!ǑRŷ\x00ƳࡾǑRJŷ\x00Ƴ؅ǑRJ+\x00	TƩ+ÜǑRƨJåم	2\n	2ٖ	Ǧ	jǭǰuǈЕǰޢǦuƳá	vƳŴǦuƳú	vƳΜ	vǰǈĠƳǟӪǸ\n	JǈØƳǸ\x00ǟk	Jǟ	+Ƴू	Iƶ̽	RǈØƳ	\x00Ǔ\x00	j\x00ǘ\x00	v\r	EǈØƳ	R\x00	J\x00	+\x00	I\rǈØƳ\nƴ҆ǘ\x00\rǈØƳ	j\x00ǘ\x00	vঠǈrư֜+̓Ţ	ű	F'\x00	¢ŕ	J؂ţ	ŊŜ	J{	2ưҟ\n	2ưम	2'ưƜ	2ࣰ	2ưݴ)	2ưۇƳ޻ƳхƳԽ	IƳݏ	ŪKǾǾƴ࡝ǾƴʭȐ\x00ȒǵƺܥƳࢺȒӊƴĔǢƳ\x00\x00	åƴڎ	\x00	Ȓ	ǮƳԩ\n͠ǈÑƳƵȩ	ƳñưǪưڒȑ\x00	\x00\n\x00ڨࢫȐӸǨ{Ǚ!ƶآǙ׿UƶðǩƳļ\r\nҵ+ƶग़Ƴ-ࣈ\nȑˇƴߴǈwƳ\n\x00ƳǴƳۜ	n0ǛƳxƳŕƳ\x00	{\nƳ Ȑ	åƳƯȑ	׶ƵȒǈwƳ\n\x00ƳǴƶࠍȑ#ā޾ǼƊƳѿǈŔưغǼ̪Ă\x001ǈдǱࣼ5ΦNЏ.ă\x00		ǈMǈϑ׵	ư৊ǈыǈ࡛Ą\x00̌ǾǾƳɶǾƳŝĘǔƳœƳ͒	1ū1ǞƳǱŎ#Ŭ\x00	(Ʈ\r	č	0	ūưѦąȐ1TȐưݽȐưݛưܫȐĆ\x00	\x00\n\x00ڢ\nL	Ƴʔ	β	ÒΉ	\x00\n		\nTǞƳǱŎư͘ć,\x00B:ư˿%Ȉư֧ȉƳ-%ǮƳȉѰȃEưÍȄưMȅēưóưMȆưÍȇēưƂư©Ȉŭ\x00	\x00\n\x00\x00\x00\r\x00ë+Ƴćŵt$ȉ\x00\nƳ`	(ƮǞƴԨ?ưػư࣓Ƴưޝ\n0\r\n	\rưĻ\n	š\rưƂưʕư̍\r\n	šưóưۼ\rưࡎ	\rưƇ\nƳԡ\r\n	\rưĻ\n	š\rưƂưʕư̍'ǫ\n	Ûưóư՟ǈwƳ	ƴŮ\x00	\x00\n\x00\x00\x00\r\x00\x00\x00ĢԂࢪƳ࣐Ƴ`	(ƮǞƳ?ưؾưȸ5ưϧâ\nǮƳ\x00ǮƳ\x00ǮƳ\x00\rǮƳ\x00	ȃ\nÃȄ	ȅÃȆ	ȇÃȈ\r6\nǮƳ\x00ǮƳ\x00	ȃ\nÃȄ6ǮƳ\x00\r	ȅÃȆ߇	ůŮŲ#Ű\x00	\x00\n\x00\x00\x00\r	Ƴ`\n(Ʈ	˳ǮƳٕưॹ\rz\r	\r0ǮƳ\x00\r\rdưއư҄\x00dư̏gưऽdưכư֭\x00dưΕgư܁dưތưԯ\x00dưࢸgưݍ\n>ƭƳŢ\n#ű\x00	\x00\n\x00\x00&ǮƳƳल		Ƴি\n	\nư͗\n\nưѾ\nưͧ\nưîưƚ	ſưĚ	Ê\nưइ\nưóưǱ	ſưîưƚ	ư̟ưĚ	ưВ\nưݕ\nư۹ưা	ſưîưǱ	ư̟ưîưƚ	ưӘưĚ	ư࢞\nưॷ\x00	ưࢥ\nưࣺ\x00	ưপ\x00	±4ư֡gư΋ƳDưчưٝéưֹư৔Ƴ NΛ.Ų1ųűÈų\x00\x00	\n\x00\x00ȝ	+ǫ\n	ƳУ\n(ƮǋƳËưࠤ	5ư৅č0\nƭƳŢƳf\x00ưࠦ	\n\nƭƳŢƳf\x00	ˤǈwƳ\nƴŴ1ǝǚÈŵ\x00	\x00\n	Ŵ\r\nƳ`(Ʈ\n\r\ngưɴ	\n0	ǮƳ\x00		ǮƳ\x00		ǮƳ\x00		ǮƳ\x00	॥\nưɴ	\n0	ǮƳ\x00	׷Ŷ1ǿ\nǿƳ!ǢƳ\x00ǵƸȄƳѽŷ\x001ǈÑƳhƳʋŸ\x00	Ģ<࢓	ǈÑƳhƳङǈƳ	ƗǈƳ#Ĉ\x00ɇ<ǹǻƳ\x00ƳƳʋĉ\x00ɇ<ǹǈƳƗǈƳ#Ź\x00		ǈpƳ\x00	+ư̬јǻƳh	\rǻƳ\x00	Ҩź\x00		ǈpƳ\x00	+ư̬ࡷǻƳh	\rǻƳ\x00	ىĊ,Ȑ\x00ȑ\x00ȒȑȒOȓȑŽUL֣Ȓ\rȐȒ\rǈՖ	\x00ǈ߭\nT,Ȗ\x00\x00	\x00\n\x00Ȗzư˿%ȖƳŭnȖƳŭư©nưпȖƳŭưțnْBȖƳ-Ĵ:Ȗĥ)ȖƳÆhࡂȖƳ फȖƳउ	ȖƳ¯ư\n	3	=ȖȖƳfưv\n\x00\n\x00ѻȖχȓ\x00\x00	)nࣃȓŽUUވˆ	\rȓŽUȯUϳˆ	Ü	nBnďĥdưȓĥUʦĥ5ư´Ȕ\x00	\x00\n\x00\x00\x00\r\x00	&\nƳ`\r\r\n\rG\r *E߄U\x00еdưې	Ƴ ʦ5ưƽСưन5ưƽgưयǚ	ƳDܹưـॳȐˤ	ȕ\x00	\x00\n\x00\x00\x00\r\x00	&\n\x00Ƴ`\rG\rچưڕ\r৉\r\n\n\n\n\n\x00\rֶ\nnǁ	Ƴ \nn\r\n࡭		1Ȕ\x00Ȓ#\n1ȕȑ\x00˦ޱ.Ż\x00\x00	\n\x00\x00\x00\r\x00\n3=\rư̆ưذ%\n*\nˈEưğưńưĀ[	ÛưČưè*\rħưè*ˈ\nEưğ\nưńưĀ\n[	̫ư̸ưǲưČưĭƳ \n\x00#ż\x00ʆǋ3ȉݭŽ\x00	\x00\n\x00\x00\x00\r\x00\x00Ŗ\r	ǞƳƳËưò&&\rưकƳłưòŖŬưƽƳ࠺\n\n	\n%Ƴ ŖƳf\n?ưƎ\n?ưɰư߽Ƴf	?ưѠ\n\n\r\n%Ƴ \r	Ƴ Ŗߞ\n\nƳ-\n%Żż\n\r\x00\rƳfƳưƨŗ#ž\x00	\x00\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00	(ƮƳưò\nŖ\rŖ\r3=ƳԵư̆ưbƟJưৌ\r\rưܮ\r0*ɘEưğưńưĀ[̫ư̸ưǲưČưè*5ħưè*ɘEưğưńưĀ[ÛưČưĭ[\x00[\x00	\nPưqưC	\nPưcưC	\nPưYưC	\nPħưC	\nPưqưC	\nPưcưC	\nPưYưC	\nPħưCݪ	\nõ	ƳÆ\n5\x00	ċ,Ȑ\x00ȑȐ̹ȑ̹ȊTʆȐ\x00ȑƹſ\x00\x00	\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\n\x00Ƴłưࡓ\nǈĲtŖ\n\rƳ`ÁƳīưعưܻ%õéࣣ+ưŨé+ưԎ9ư˱ưçư¢ưÿưˡưưÿưĕưٷéæEưĕ9ưçEư߮ǝư˲ưԜ5˅B\r\r±Ϛ\rưƍ5ưǑ:ưȵ\rưƜ\r\r	ǌ9ưΫ	Ȉư¢ư̚	ʷưư̚	ɲưࡵ\x00½ƀ\x00\x00	\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00\x00\x00\n	&ưð%Ûǝư˲ưࢍB\rڞ\n\r\rࣻԮخ[ޗEưদEưܯEưMưĕưঽư֠\n\r\x00\r\x00\rէưð%\nˁB\r\rưð\rG\n\r\rݨ?ưࠪ?ư߰?ưǸ\r?ưۃˎưǸ?ưͷưS%A\rEưç9ưƎ	AEưç9ư۪ưê%AƳī		AƳۑƁ\x00\x00	\x00\n\x00\x00\r\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00	ǋ3\r	\nưࠎ=ʸi	ȳưȢ\\ƳËưࠃưÍưMۉ\n3\n=\ni\n\\\n˂%9ưù\rư¢ưaưưaưa\r9ưùư¢ưaưưaưaJ9ưùư¢ưaưưa\rưaưĻ9ưùư¢ưa\rưưaưaưջưM\x00\r\x00BưS%	\nưࣗ9ư˱ưç\rư¢ưÿưˡưưÿưĕưa\x00\r\x00\r\x00\x00>Ƃ\x00̻ǋࣳȉ६ʸߙِࣴƃȦūưāūưāūưāūư֝Ƅ\x00	\x00Ȑ\x00ȑ\x00Ȓ\x00	ȊȐ	3ȑ	٬ȐএȐݠƀ\x00Ȑ\x00ȑtȒſ\x00Ȑ\x00ȑ\n\x00	\x00\n\x00\x00\x00\r\x00\x00\x00	ǞƳƳËư٫&\rư࡙ƳłưǪ\nƃƲƳīƳŁ\rB\nƳ-\nâ\n\rŖŶ\n\n	ƟƳf\nEưɋ\nʂư\nƂ\x00!\x00ƁȒ\x00hȐŶƳ-%Ƴ ঻ŗ#\x00	\x00\n\x00\x00\x00\r\x00\x00\x00&Ŗ\r6Ƴ¯ưƿƳfưٟ	ƳËưЭ\n\n	Ɵ\rƳf\nEưɋ\nʂưƁȒ\x00\r˄ȑ\r\nƂ\x00ƻƳ-%Ƴ í\rNŗ\rƳ֨Ƴ¯ƳÎO\n\x00Ë>ƅ\x00\x00	\x00\n\x00	\x00\n\x00ë+ƳćŵtɎ	4ư˭\n4ư̄Ƅ\x00\n\x00	ÎÕ.Ɔ\x00\x00	\x00\n\x00	\x00\n\x00Ɏ	4ư˭\n4ư̄Ƅ\x00\nË\x00	#Č\x001ŭƅ\x00ÈƇ\x001ƆŮ\r#č\x001ŲƇ\x00Èƈ˘VÉ\"ƳЗ؍ˠƉ,\x00(ƈǮز%kॅˇtƳ¯ưĉƊ׻ƈ९k޺t÷ƋǈƮsUų#ƌ1ǈƮ½ƍ1ǳųǈƮݎƎ\x00ӭ\ně_>đ1_Ƴ঱Ƀ.Ə1_ˬƐę_ZưÇ_ˬƑ_ࡣưύАưࢆưँưîưÇ_ŠưޛưדưࠖưÚ_ZưÇ_ŠưιưۤưóưĄ_ZưÚ_ZưÇ_ŠưҮư׸_ZưĄ_ZưÚ_ZưÇ_ڄƒ˓_ZưĄ_ZưÚ_ZưÇ_ΩƓ1ƒːưǡƒ#Ɣ\x00	Ƒ\r	_\x00_>Ƴf	\x00_#ƕ\x00	Ƒ\r	_\x00_>ŲƳf	\x00_ÈƖ\x00¤'Ƴ£¡4ưøưǅƳ #Ɨ\x00¤'Ƴ£¡4ưøưǅƳ #Ƙ\x00)4ưƺưƆƙ\x00#ƙ\x00¤'Ƴ£¡4ư߿ưڪ:ư̏Ƴ !:ưޑƳƛưYưőưȫƳ ư̎:ưۛƳƛưcưőưŵƳDưYưIƳ ư̎:ưЎƳƛưqưőưǣƳDưcưIƳDưYưIƳ ưԴƳ ưїƳDưqưIƳDưcưIƳDưYưIƳ ưӒƚ\x00¤'Ƴ£¡4ưƺưƆƳ ưòƳ ưࣶ̏.ƛ\x00¤'Ƴ£¡4ưƺưƆƳ ưòƳ ưŌƜ\x00¤'ƳøěƳDưqưIƳDưcưIƳDưYưIƳ ưŌƝ\x00	\x00\në'Ƴ£ě	QưǠ\néưǠƳD	ưqưIƳD	ưcưIƳD	ưYưIƳ 	ưIƳD\nưqưIƳD\nưcưIƳD\nưYưIƳ \nưŌƞ\x00)ŵƳ˸ưࣹƖ\x00Ƴůơ\x00#Ɵ\x00)ŵ\rƙ\x00Ƴůơ\x00#Ơ\x00)ƙ\x00Ƴůơ\x00#ơ\x00	\x00\nB		Ƴ-	%\n	ڬ\n'Ƴ£\n\n¡\n4ưø\nưǅƳ \n#Ƣ\x00\x00	¤	'Ƴø	ěē	ưqưCֻ	ưcưCưͼ	ưYưCưգ	ưљĒ)<v\"ʢȏȐ÷Ȑ,ȑ\x00ȒȑOȒƖȎ\rȍȓ,ɫհǈĲߏƳ¯ưĉ\x00	ĢկƴǗƶƿ6Ů\r	řƳ¯ưȸƳfưƿŐƊ	6ž\x00ȓöų\rǔƳœƳ̿̭FƳѩœȑ\x00ݥ\n¹Ȕ,\x00\x00	\x00\n\x00\x00OO	ɫڭ\nnȑ0ȑ\n3Fưƍ\n/ưƠȂ	\n\nǄȕ\x00Ȏ\rȕ\x00ȍ\rȒԚȕ\x00	Ť6	Ū\r	Ƴ¨ư̅	ŵ	\r	Ž	\x00ȓö	ŘŐ	ԄƳǒ	\rƵñƶMŭ	ձ\nٞ¼\x00q	ų\x00\x00	\n\n4ưƍ\nɫҶLȑة\x00\n\x00	×Ȓ/ư̅ȒªǏȔߠ	ȑsHӂȂɫߪߝƣKȏUȏq#Ƥ\x00\x00	Kȏ	ࢽȏ¼\x00\x00	#ē\x00\x00	\nB\n\n	\n%\nĝ\nĜᅟ.ƥ\x00	\x00\nŹ\x00Ƴע	3\nʵŹ	\x00Ƴؑ3TʵI\n܈Ʀ\x00T\nƳįTLI\nƳĆIŉƧ\x00	¥Ƽࠧƹèƹȷƶӻ		Ƴ-	ĴŸ\x00	ԌƨŹŹ\x00ƳƒƳٍǈŚƳ\x00ƴȑǻƳhٳĔ\x00KUƳį>ĕ1ŹŹ\x00ƳƒƳ׍Ė\x00	\x00\n	&ƳºƳʚƳ҈\n\nƳ-\n࢑ŷ\n{	Ƴ \nʖ	ƳҲƳऀƩKUŹŹ\x00ƳƒƳލƪ1ź\x00Ƴޚė\x001ƪƊƪ#ěȐ\x00\x00ȑ\x00Ȓ\x00ȓ\x00Ȕ\x00	\x00\n\x00ȕ\x00Ȗ\x00ȗ\x00Ș\x00ș\x00Ț\x00ț\x00Ȝ\x00ȝ\x00Ȟ\x00ȟ\x00Ƞ\x00ȡ\x00Ȣ\x00ȣ\x00Ȥ\x00ȥ\x00Ȧ\x00ȧȐÁȑȒÁȓȔÁ	ưࣂ\nư׭ȖưȐțȨ	\rȜȨ\n\rȝ&ȟɫŬȠƹ͑ȡȣȤȥɫŬȧO#vSAHL\"\x00,\x00)\rʢܸșȲȚ(ȳư¾ȗƍưǕȘōƴ߃őǧ\x00ƵƑ\rőǧ\x00ƴɍ\rőǧ\x00ƴʻ	\rőǧƳ˙ƽM\n\rőǧƳ˙ƹ࡚\rőǧ\x00ƴ˪\rőǧ\x00ƶť\r\rőǴ\x00Ʒ،)ȸؗ#)ȸʄ#	)ȸưÍ#\n)ȸư»#)ȸưM#)ȸưı#\r)ȸư©#)ȗ6ȺޱȴưΙȶƳ܀ȼξ\rKș+ǫࣆȹȒ\rȕ\nơ\x00ȕȿȨȾ\x00ȿ\x00ɀ\x00Ɂ\x00\x00	Ⱦ\x00ȿɀɁ&O	[\n\x00]\x00\x00ª\r\x00\x00\x00e\x00\x00r\x00X\x00¬\x00q>T\nՙɀŀȾFȿ#ɀFȿ,̓]̩Ɂȿȿ*ȿŀȾģ\r,̓]̩ɀ*ɀ̉ȾĦȾ\x00Ɂɀʖɠ[εƲɁɀ\x00ɀ*ɀŀȾȣɀ5ȿȾĦȾȿɀˠȿɀęŀȾę̉ȾĦȾ1Ɂƹȩ\x00\x00	\nB\n\n\n0\n	Ȫ\x00KFǫ$FǫࢱҔʙ׳؇ȫ\x001ǞƳàגÝ࢘࣫Ȭ\x001ǞƳoܳǞƳoҸȭ\x00		*°ŧ³řǞƳà°Ý³ˢǞƳà°Ý³̂ǞƳo	̈	ǳ	ģǞƶȗ	#Ȯ\x00	\x00\n	*°ŧ³řǞƳà°Ý³ˢǞƳà°Ý³̂ǞƳo	̈	ǳ	t\nǞƶȗ	\r܌\nư̺Ǟܧ\nŉ\nȯ\x00	\x00\n\x00\x00\x00\r&	(ȵǷ\nнzƳ-%\r(ȵ\nŦ\nĂƳ Ȯ\r\x00	ū\n>Ȱ,\x00Ⱦ\x00ȿ\x00ɀ\x00Ɂ\x00ɂ\x00Ƀ\x00ɄOȾ&ɂ&Ƀ&Ʉ& \x00c	\x00¿\n\x00»\x00Y\x00¡\r\x00¶\x00É\x00a\x00\x00Â>T\x00	ȿɁɀɃ&Ʉ&Ⱦ&ɂ	;	/r;	X	ݡ	/१ȾȿȬq	\r\rȿ±ɄƳ q	ࢣȪq	\rރɂɁȫq	\r\rɂɁƪưͅɀɂɁɁࢧq	\rɃƳ Ȯ	Ȧɀ\x00Ɂ½\n\x00	\x00\n\x00\x00ư©	&\nȩ	\x00ϼɁ0ɂ:ưÌ	࢏:ưघ	ڔ:ưá	ޘ:Ňǧ	࢚:ư·	ڐ	भ0	޲\nЯ\n\x00	\x00\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00ưï	\nO\rÀȿU	čȿ࢒&&\nরȿ۾)ȾJȾsࠐ4ưփشणưӆ5\x00Œ\x00ʉȹ\nÊ̾\x00ےưΌ˵ࣔ%ְŒ\x00ʉȹÊ̾Bn0ˍƳ¨ư֎߀\n4\n\r\r\n\x00	Ǟƴ\r\x00	ϒ	\x00	\x00\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00ª\rƖÀɃƳ¨ưॗɄƳ۶ݯɄƳąG	Ʉ\nɄܤȪ	\x00\nŮԿ	ͬ\nͻ*	\nř	\nԃưۖưەưঊưӹưޔưࢗ4ưऒưһ	\nъưњưޕƳ ՚Ƴ¨ưֽƴٲƷ͈Ƴ-%QƳ`Ƴ-%ǞƳoˌ\rրQƳࢰ*QƳŁ˒ưÍ4ư՗ƅ\r׾\rࣚ\x00݀ư࢜\r\x00	\x00\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00ưڲ	ª\nªªւɃƳ¨)\rÁzɃƳą%ɃɃJӔŦ	/6\r4ưÌ\n	L	!ՍՓ/6\r4ưÌL!4ưƠ\n/	6\n	\x00\rՏ4ưƠ/6\x00\r܋\r\x00ɃƳưϢ,\x00\x00	\x00\x00\x00\r&	ÀɃƳ֦ư࣒\x00Ƴࡈ\n\x00K54Ŀԝ54ĿࠒưՕȯɃ\r\n3ॡưbƳ-%\r\n߶'\r6	4ưʿঌ	Ѯ	\rȥ\x00ƳЃ\x00	\x00\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00	ưް\nɃ\x00ǳ	?Ƴণǫ\x00ÀưہƳądƳ׋0(ȵԭړҷҡ/ǫ6ȭ\x00\r\x00Ǟƴ\x00Ρ5צࡻư׽ŉܱ\x00\x00	\n\n׎/Ȑ़Ԕ	Ƴ˶Ȫqö	{\n΍\n,\x00\x00	\x00\n\x00\x00\x00\r\x00\x00Ƀ3(ȵǷ	ǫ\x00\n\rz\rɃƳą\r%Ƀ\rȬ\x00ࣿ(ȵŦĂ\nȮ\x00\r	'ǫ\n'	\nʐ	\n\x00ޣ\x00½\x00	\x00\n\x00\x00\x00\r\x00	\nЛȧg\nȧg(ȵɃॄɃࢂȧs\nȧsȧg\x00ɃƳƳ\r\r\r%Ƀ\r	ŇȧgƝ\nŇȧgĂȫ\x00\rȧsȥ	\x00\n\x00\x00ƹȱ,\x00Ⱦ\x00ȿ\x00ɀOȾ&ȿɀ \x00c	\x00½\n\x00w>T\x00	ȿɀ;/r;XƬ	q\r	ƳRưє	ƳRư࢖Ⱦȿ	\x00ȿʃ	ƳRưʿɀ঺	ɀ\n\x00	\x00\n\x00\x00\x00\r\x00\x00\x00\x00ư¬	ưं\nɻ&\rÀȿӦȿ0ȾƳRư߱\nǁƳߎ\nƳߍʃ\nƻ0ƪ\n\rЂ\r\x00	\x00\n\x00	Ϝ\n\nȿ\nK\n)Ⱦ\nsƳRưɞƳRưφƴݞƴҌ	ԑȾ\nʓ	Ȳ,\x00Ⱦ\x00ȿ\x00ɀ\x00ɁOȾȰȿȱɀɁƶґ>T\x00\x00	\n\x00\x00\x00\r\nߜFȑɧnȾ0ȾƳǺűȾ_ț\x00\x00	\r'ǫ6\n\x00ɀȽțeࣟnȿ0ȿƳǺű\rȿ_Ȝ\r\r'ǫ6\n\r\x00ɁȽȜeױ\nȳ\x00Ⱦ\x00ȿ\x00ɀOȾȿȨ\rɀȨ\rÊ	\x00\n\x00¯\x00Å>T	\x00\x00	KղFȑ6ȿ	\rȾÊɀ	ӇÅ÷\n\x00KFǫU>1ǳ?ưĆĿࠋ,\x00\x00	\x00\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00 \x00!\x00\"\x00#\x00$\x00%\x00&\x00'\x00(\x00)\x00*\x00+	\n\rȖ\x00 Ȗ\x00!ȿ\"ɀÓ!Ȥ#ȿ;#/ȿr;#ȿX#Ƭ$ȿq#\r%$c\x00	%3%=Ǟƴ$¿\x00\rǞƴ$»\x00\r$Y/ǫ6&$Y\x00&҂&=&3\nʐưɸQ\rưɸQܕ'$¶\x00'3'=($\x00(3(=)$Â\x00)3)=)i)\\\rǞƴ$É\x00\r\r$a/ǫ\nFȖ\n$a$aǄǚǞƳQ?ư˜ǚǞƳQ?ư˜4ưΰQˑư۫ưࣥQˑŇ॰ŋ*5ưΛư҃ǞƳ|?ư¾ǞƳ|?ư¾ǞƳ|?ư͹À\"Ȥ#ɀ;#/ɀr;#ɀX#Ƭ*ɀq#\r\n*c\x00*½\x00*w/ǫ\n +Ȗ\n *w  *wǄFȖ\nƅ FȖ\n ƅ#ȕ&+\n+ф \n+mưΤƖȕ\x00+\rƛȕ\x00ǞƳ|	ūƛȕ\x00\rƛȕ\x00Ⱦ\rƛȕ\x00\rƛȕ\x00\rƛȕ\x00\rƛȕ\x00\rƛȕ\x00\rƛȕ\x00\r\rƛȕ\x00\n\rƛȕ\x00\rƗȕ\x00\rƜȕ\x00ɮƜȕ\x00ɮƜȕ\x00Ќȴ\x00\x00	ևƳݩࣦƵзƵ֐Ƴߒ	ࡺƴҹƴށĸओĸ߸ƳڍƳࣲȵ\x00ঞۨȶ1ɫȥȷऩƳࠛȸ\x00		(ȴ\x00\x00ȶƳ׹ȗ\nȺ	۱ȷ	ӳȦFȑ\nȹȑtȜ	\rȦȒ\x00Ȝ[ǧȹȒ͸Ȥষ	Ƴ̰ț	!	Ƴіȹȑ\x00Ȑ\x00	\r	Ƴʛȓ\nȤưҝȣȤư࣏	ƳRưࢠȢ	\x00Ȥբ	ƳRưҾȪȢ\x00	{ȹȑtȤԟ	ƳRưÌȤ¡	Ƴ˶	ƳʛȔ6Ȥư»ȣҪ	Ƴ̰ȣՂȣȣdưÌȤжȦȑȹ\x00\x00	\n\x00\x00¥ƽĊƶϱFȑ\nțΆȜՈ\nșƶҕ\x00\x00	\rȚÊ\x00\x00\n࡞Ⱥ&Ƴ Ƴ࢟ƳषƳ ƝƳ ؔƳ ƝƳ ĂƳ ƳίƳ ƴԉƳ ƳওȝƳ ǈwƳ֖ȝƳԲɫȟdưϮȼ̪Ȼ,\x00\x00	¥\x00\x00\r\x00¥Ƌưѯ		Ƴ-	ӧ		ܙ\n)	ބǈwƳ\x00ƳȚŭƊҀ,¸ǴƵ̷ǴƵɬƼڜǴƹݮư϶ǈwƳυǞƳࣅ\rऑǖƴࡍǴƳ܆ǴƳƩƴߧǴƳƩƴ΢ȼ,ѱȞ\nȞȻƲȡ±Ƴ Ȟ\rƳ ȡ\rƳ Ș\rƳǒȝ\rȝ&ȟɫŬȽǈwƳܴȽɻǴƳѺ(ǴƳ҉ǴƳ৖(ǴƳ৘ƵؒǁƳżƴĮȠࢁƳȡ࠹ƫ,Ȑ\x00ȑȐ&ȑ२h\x00lų޵ȑرȐȑ½)֓Ȑȑӏᓧ.ƬȐ\x00ȑȒȒȐ߲_\x00§ȓ\x00}\x00z	\x00®\nųȓȐǘȑШȑ,\x00ȓÓܔȐ̀ȑ\x00\rȑ>	,É}ÓU݋Ǚѓ\n\x00	Ȑ\x00ȒĿȑ	ȑȒ	%	ȓǰĢ\x00Ȑ\x00ȑ\x00Ȓ\x00ȓ\x00Ȕ\x00ȕ\x00Ȗ\x00ȗ(ǖ࣯	\rȕդ\x00ȗȖ®\x00\n	\x00	\x00ș\x00Ț\x00\n	Oё	£ࡒϵ	£࣠ȖƬ\x00\rșȖ§\x00ȚȖ}\x00\nȚ\x00	Ȑ\x00	Ȓ\x00	Äȑ\x00	¹ȖzߘȖzö	°ș	´ș	;țǰ	Tț,\x00\x00	\x00\n\x00OCșș.Ț	ș\n(Ʈ	ؐ	%\n̔ț;	ș(Ʈ	Ŷ	%ț;B\n\x00¸>Ș\x00K٦߉঵Ԣѭ3Ͽ՛3=иऻ3=iϕࡇ3=i\\Ձ֏3=i\\͆ث3=i\\¬ܾԬ3=i\\¬ʘĽ\n\x00ș\x00Ț\x00	\x00\n\x00ț\x00\x00\x00\r\x00Ȝ\x00\x00;\x00ș\x00ȚÄ\x00	\x00\n¹\x00țƫǮ	%ȝ	̀\rճ	ǵЧ\r\r̀\rάȜ(ƮC\rȜȰǴ\x00Ȝ°Ǵ\x00Ȝ´ȕ\x00\n\r&ֵࣽीʲȜ\x00вȜBBʑ%Ȝȟ	.ȗ.\rȠh.ĿB%ȝЪȝ)Ĳ\r߼ȞޮȞ\x00	\x00\nƥ			%\nǘ	\r\nऱ	۔\n঎	ߦ\n;	ॏİȟȢ\x00ȣ1T,\x00\x00	\x00\n\x00\x00¸Ȣˏțhțhȃȣ=Ƌȣγ&(ƮȢC\rȃȣͥƋȣ۳̀	ȢBB\nʑ\n	\n%\nȟ	\nÎڼʲ\x00ߐԗȢ.যȢ.ȗȢ.tȠȢhȢ.Ŀ\r¬Ȣ6țl\rțlǼݢȠ\x00\x00	\x00\nȢ\x00\x00ȣ\x00Ȥ\x00\x00ȥ\x00\r\x00Ȧ\x00ȧ\x00Ȩ\x00ȩ\x00Ȫ\x00ȫ\x00Ȭ\x00Ȧ.\x00ȧ\niȨ\n\\ȩ\n3Ȫ\n=ȫțhȬȢȢ	ȢGȦȢs܍ফԪৄȬĖȬ\x00ȣȣȤȣȫȫJȫȟ࡫ȬÒȬ\x00ȣȣȤȫȬȣȫŸৎȫȬȧȦȢئȫȬȫȬˎ\x00ȫȬ!ܜ͝ȫȬȣȫȬõȣȓȦȢʼ!֩ȦȢɐȤȦȢșȤȦȢ\x00ȫȬ!ࣀȬÒȬ\x00ȫȬȣȤ_ȫГȤȦȢȣȩ!ԼںȫȬȦȢĤɅȦȢûȤȓȦȢ ȦȢȤ\x00ȣȫȬkۧȫȬȫȬƾ\x00ȫȬWȦȢʳȤȓȦȢ ȦȢȤ\x00ȫȬȫȬȤkϋȫȬ܇݌ȬÒȬ\x00ȣȤ_ȫŸʪȦȢûȤșȦȢ ȦȢȤ\x00ȣȫȬǖȬĶȬ\x00ȣȣȤȫȬȣȫȫþًࠕϾȤȫȬȣȫȬk࣬ȫȬ١ЖȫȬȣȫȬõȣʡȤȦȢȣȕ!ϖՋȫȬȩȦȢƧڀȥȦȢȫȬȪȥAȦȢࡢࡨȣȣȤȣ࢝ȫȬȫȬu\x00ȫȬ!ׄঋȫȬȫȬ̥\x00ȫȬ!ٰʀȫȬȫȬ!টȫȬȫȬԣWȥȦȢȤȦȢȣȨȥkধȫȬ\rȦȢɒȢ\r!ڊȫȬȣȤϪ!ৈȥȦȢȫȬȨȥAȦȢঢȫȬȣȫȬȫȬȣk؄ࠑڠȫȬȣȫȬõȣșȦȢʼ!֪ȬĶȬ\x00ȣȣȤȣȫȫþ̇ȤȦȢȣȜ!ȫȬࣱखࢴȬÒȬ\x00ȣȣȤȣȫŸ֘\rȦȢȢg\r!΁\nІȢ	Wȡ\x00ȦȢȦȢ\rȦȢȦȢȢѬȧ\x00\n\r\nधȢ	Ȣ\r!ߔऔȤȦȢȣȧ!ךȫȬȣȤথ!ऐ\rȦȢȫĬȬ5\r\x00Ȭ\rȬg\r\x00ȫȬȘȣȤÜȣȤ̠ईȣȣȤȫȬȣॲ׫ȫȬȫȬƪ\x00ȫȬ!ऄȫȬȫȬʧ\x00ȫȬWȤȦȢȫȬ6ȢȤȾȬǭێठȫȬȫȬƫ\x00ȫȬ!ԕȤȦȢȫȬ×6ȢȤȾȬǭ࠻ȫȬȣȤWȫȬȫȬؙ\x00ȫȬ!΄ࡋ\rȦȢȢ\r!ӰȫȬ\nळ\nʏ\x00Ȣ	!࠽ȬĶȬ\x00ȣȤ_ȫȫþȫȬ֌ҬبȫȬȫȬˊ\x00ȫȬ!शȫȬȜȦȢƧࡅȫȬȫȬˌ\x00ȫȬWȬĶȬ\x00ȫȬȣȤ_ȫȫþݧȦȢɐȤȦȢȚȤȦȢ\x00ȫȬ!߫ȫȬȕȦȢƧݣȤȦȢȫȬȟ¸Ȥ\nʡȫȬȣȤڹګԶݦȫȬȫȬɓ\x00ȫȬ!ПȬĖȬ\x00ȣȤ_ȫȫJȫȟ࠶ȤȦȢȫȬȤǖȫȬȣȤ۽ũΣ͐ȫȬঔϲȫȬȫȬÃ\x00ȫȬũӃȤȦȢȫȬȫȬȤТ\rȦȢȫȬȢ؜ȥn)ȣȤȥ\x00Ƞ\x00Ȣ\x00Ȣ\r\x00\n\nσȢ	֑Ȣ\r٪ގکȫȬȫȬҳ\x00ȫȬ!়ȫȬȣȤॐ!ڮȫȬȫȬڴ\x00ȫȬWȬĨȬ\x00ȣȤ_ȫȫJȫ¦ȫ˟चȦȢʳȤșȦȢ ȦȢȤ\x00ȫȬȫȬȤk͂ȥȦȢȤȦȢȣȪȥkڋȫȬȣȤĝ!ȦȢҒ֊͡ढ़ȬĨȬ\x00ȣȣȤȣȫȫJȫ¦ȫ̤ԠȫȬԏҺȫȬȫȬڳ\x00ȫȬWȤȦȢȤथאюȫȬȫȬˍ\x00ȫȬ!ӤȣȤजҧȫȬȫȬ˅\x00ȫȬWȫȬȫȬǥ\x00ȫȬ!ѷॽȫȬȫȬԖ!ॸ\rȦȢȬg\r\x00ȫĬȬ\x00Ȭ\r\rȣȤԐȣ\x00ÜωȬĖȬ\x00ȣȣȤȫȬȣȫȫJȫ̞ȬĨȬ\x00ȫȬȣȤ_ȫȫJȫ¦ȫ˟ॵۊȣȤĤ۩ࡱȫȬȫȬ!ʟȬ\x00ȣȫ\x00ȤȬWȫȬȫȬ޴\x00ȫȬࣄ؎ࢾ޹ϗȣȤĤࠬȫȬबȣȤĤήȬˮȬ\x00ȫȬȣȤ_ȫȫJȫ¦ȫƦȫڰȬĨȬ\x00ȣȣȤȫȬȣȫȫJȫ¦ȫ̤רࢻ\rȦȢȫĬȬ5\r\x00Ȭ\rȬg\r\x00ȘȣȤÜ۟ȫȬȣȤ̠ժȤȦȢȫȬ×\nȢȤܰȫȬȫȬࢷ\x00ȫȬũմࠫȤȦȢȣȫȬʍϏȤȦȢȫȬȤʍܣȫȬȫȬ࠿\x00ȫȬόԧȫȬȤȦȢȣȔȤ\rȣ\rFǫ\n\rȦȢৗȢ\x00Ȣ\r!ڤȫȬȣȤ\x00ȫȬ!ظȬĖȬ\x00ȫȬȣȤ_ȫȫJȫ̞ȫȬȫȬƫҫسȬˮȬ\x00ȣȤ_ȫȫJȫ¦ȫƦȫڛड़ȣȤࠊȫȬࡄȣȤĜțlȫ,ȦȢࢄ֢ȤȦȢȣȩ!ɅȦȢûȤȓȦȢ ȦȢȤ\x00ȣȫȬkʪȦȢûȤșȦȢ ȦȢȤ\x00ȣȫȬǖȤȫȬȣȫȬkݖ݅ȤȦȢȣȕ!ڈȥȦȢȤȦȢȣȨȥk̇ȤȦȢȣȜWȤȦȢȣȧ!͂ȥȦȢȤȦȢȣȪȥkʟȬ\x00ȣȫ\x00ȤȬWȤȦȢȣȫȬߖȡ\x00\x00	\x00\n\x00\x00\x00\r\x00\x00\ng	\x00	gŤȠ\x00\x00\x00Å)\r\x00Ƞ\x00\x00	\x00ީ¬঑	\x00Ƞ\x00\x00\n\x00\rࢦ̑\x00ʏ࠵ģ˘kĳtĳ\"¥ưࢵư׆ưࢅưұưࡦn¥ưיư܄ưশư࠘u	T\x00	ë+ƳćŵƻƳ-ѪƳ í	ÉĳƳʔ	ƳȜưəuŖ	Ƴʮưב,\x00\x00	\x00\n\x00\x00\x00\r	É\x00\nÉV\x00Ƴۺ	Ƴ ưϙ	ƳŁư̺ưSưࡀ%	Ƴը	ǥưəuŖ	Ƴʮưग	Ŗ	\r	Ƴ ǞƳۭ?ưؿưР	Ƴআ?ưցu	\r\nƳ`(Ʈ?ưޒâ\r\nP\r9ưqưCP\r9ưcưCP\r9ưYưC\rưţ	\x00	\x00\n\x00\x00\x00\r\x00\x00\x00\x00\x00\x00ƳīÉV\x00ƳՐ\n3=i\r\\˂:ưٜ%dưͪ5ưȢ5ư͔5ưख़5ưނēॣ9ưޠ*\nEưߩ\n9ưΎ:ưۿ*ী\r!:ưӠ[[\r:ưκ*́\ŕ\r!:ưӷ[[\rL	*ҼnǞ_Qư࠭\r\x00\r\x00*Eưт9ư\n\x00\n	бǇ\nĞࢌÔĞߊÂĞМĔ\rĞߑ̒ެĤȐȑ\x00Ȓ\x00ȓ\x00Ȕ\x00ȕ\x00Ȗ\x00ȗ\x00حȑȐƳӥȒȐƳƀȓȐƴתȔȐƹݻȕȐƶ۷ȖȐƳڱȐƻࡴȐƻҩȐƺॴVȗۥưۯȐƳϹȐͯȠƶɿȒ\r'ǫ\nȐƳɗऍ	VőȐ\x00ƹѹÎȌ\nT\nɠµ$ȗĳpব\nƳxƳ˼\x00\nƳxƴѳ\rTȘȣ\x00Ȥ\x00ȥ\x00Ȧ\x00ȧ\x00Ȩ\x00\x00	\x00\n\x00\x00Ȩफ़ȦȦȝȦæȨp¾șȣ\x00Ȥ\rȨp¤Țȣ\x00Ȥ\rȨpțȣ\x00Ȥ\rȨp¨Ȝȣ\x00Ȥ\rȨpÇȝȣ\x00Ȥ\rȞƳȨ\x00ȣ\x00ȤǼȤ'ǫएHȖHȨp+ǫ$Ȩp।ȦՀȨµƸसǏ\r\x00ưԍȨp\x00	&\nȨp˵n0॒إʧǫ\n	ˁ	ٙǫȳ	Ӷn	0	ˊ\n6\n	ӡ'ǫHȧ+ǫ$ȧ׼Ȩƴ|ȣ\x00ঙȥ+Ƴٌȥ\x00ȿ\rȘƳȨ\x00ȣ\x00Ȥ\x00ȥ\x00Ȧ\x00ȧȮș\x00̌'ǫ0ȒȟȒ\x00\x00ĘȠ\x00ȒÅ	¹Ț\x00KȕǶ'ǫ0ȕƵñ\x00ĘȕƴǗÅ	¹ț\x00	¸Ȕܠ	ȡÓ'ǫ0Ȕ	A঳Ȕ	AΘ\n¹Ȝ\x00KȓǶ'ǫ0ȓƵñ\x00ĘȓƴǗÅ	¹ȝ\x00	Ģǈц	ȢƳӯƴΊ	ƶ঴	ƳŞƻ߈Ʒٱ'ǫˏ	ƴÆ\x00\r	ƷƉॾ	Ƶ	ƴo৐\n¹Ȟȣ\x00Ȥȥ\x00\x00ȥЉȖ6ÁȖƳżƳ˰\rƳࢀ\n\x00ƻأ\x00Ȥ'ǫ\nƴǉƴǉ\rЅ	˔\n˔\x00	ƳǏƴƀ	ƺպƳݜƳ࣌\x00	\x00\n\x00ƳǏƴƀƵ̖ƵʾƳϡ	ƵɥƳءƻ݈\n	ƵġƳƢ\nƸߣȣࢊȤѲƴל\r\x00	\x00\n\x00ȦƳǏƴࠥƵ̖ƵʾƳݳȥpǫȯ	ƵɥƳߤ\n	ƵġƳƢȦ\nƳìȣ\rȦƴǉ\rƴӎ)Ȧƴլǫ\nȥpǫȥpȦƴ׊Ƹϥȟ\x00\x00	\n\x00\x00\x00\r	Ȑƶؕ	ǈpƳ\x00ƳÂƳ֛ưđǈpƳ\x00Ƴ٥\nǈpƳ\x00ƳÂƳɑ\n+ưś\nǈpƳ\x00ƳڗǈpƳ\x00Ƴi\nࢬ\rǻƳh\n\r'ưś\rǻƳ\x00ʠ\nޓƳÂƳ«	\rƳÂƳ«	>իƳÂƳ«	Ƞ\x00	\x00\n\x00\x00࠷'ƳϨ	ƳǿǈÞƳ\x00ǵƹͮ\n\nƳ-\nG\nۀǈĠƳԀǈȋƳ˄ƳӑǈpƳ\x00	ׅȐƹٸǈȋƳ\x00	Ƴ`ƳܵȡǢƳȐƳôƴʁǵƻपȢ\x00\x00	\n'ǫȑƳĸ{\nȑƳĸ!\nȑƳǜ\r\nƳŞƴ॓ƴĊ\nƳŞƻृƷɵ\n\nƴ७t	\nȑƳࢭƳࢮ\nģ\nȒȟȒ\x00ƶɿȐƳٺȐƳɗȒ\x00\x00	\x00\n)ȘƳȍ\x00ǫ\x00\x00ǫ\x00	\x00\n#\r\x00)ȘƳȍ\x00\x00ǫ˦÷ĭĵĥढǑͰǈȔǋĶņǈڅǹƶ́Į}ǈٗǰ$ǩüǵĮ*ǓXǬ$ǡüǝǓĲƴƌĮ\"ǈࡡǐǽǴƳ৙ǾǴƽ؋ǿǹƽɡǈࣨĮ\nĭ²Įǈսǈ׃Ǖ8ǈ׉Į@ǈڽǬ8ǡüħǡɽǻǹƳुȀǴƳѼĮǈࢨǺǳ۰ǠǩĮǞ8ǏǨǴƺ˗ǺƳƶĮǭ^ǈ٨Ǹ$ǡ2ǓࡿǈʨǨǠƳǤǴƶنĮǧǈȲǔ$ǈͳĮǈܭǝǈ͏ĮǈɞǑĮǩ<ĥĮǈθĩǎǈܡĮǱǓǈࣾǞƵʗǈưƳŐĮ\"Ǹ8ǈŐǈ͙ĲƴǀƈƳلģ;ǏǴƴʗǰࡑǈࡩǞƹডǈƞǹƳƇĮǍĪǋ^Ǐħ2ǈՆĭƸĦƳʰǍϴǈмǫǯĲƴɺɫҁĮ\"ǡ$ǈĭǡƳSǏǈȕǈȰư	ǊǴƳ̈́Ƴ̢Į\"Ǎ8ǈ΀ĮĦ$ǩǮĲƴƌǪĲƴŃĩǹƳ̝ǧǴƳȴĴņĮ\"Ǟ8ĨĮ\"ǈĮǈНǐÖǢ<ǳ2ǺƳǟǴҚǋĲƴʜĊ;ĪݰǖĲƴײǈǦƳǃĮǒ<Ǘǈҗǈভǧƴ̋ǓĲƴŃǈʨǹƴɡĮ\nĭĩǺǴƴ޳ǢǹƳԁǈѴǴƵşċ;ǈБǈӓǹƷ݊ɫ֤ǞॠǈќǹƼׂǖࣞǱǞƳڙǈژɫ­ǲǊǔǴƴ́ǈΏǹƴșǷĲƴȬĮǒǈǃĮʹǕXĩ$ǺÄǡĤǴ2ĮĮǈ࣋ǧǈÏǦͩĮǯǏǸЩĮ*ǰĪǹ$ǓǟĮǈӁǈ׌ǈࠣǈʎǼǴƷॊĮ\"ǒǈǩĮǊ~ǭ^ǔ$ǈॕǈ̑ǹƳجĮ\"Ǥǔǟח	ǈࠄǾǾƳșǋǈȆǈࣕǞƳ޽ǈ͚ǴƴƇǈōĨĮ@ǟ^ǏǈࠡĩĮǍ$ǈǩǛ߳ǚߵĮ*ǈࡗǊǈ҅ǭǈưǈǈДǧƳ৑ĳņĨǞƳɤȋÏǈưǧƳĹĮǘ$ǊĮǹǈূǺ8ǈܐĮǈЍǈƼǕǴƳ̢ǘ݇ǭݗĮǺÖǖXǰ$ǥ2ǠǴƽ࢛Įǈԋǈتǋ$ǟ2ǬǴƷ؟Į}ǰ~Ƿ$ǑÄǞǝоĮǘHǨźǷ8ǈʎ	ǈޅư˫ưɯưࡉĮ\"ǚ^ĪHǋ8ǟ2Į\"ǑÖǻźǍǳ2ĭٿǈϓǉǈƞĲƴŜĮ\"Ǖ<ǤǐÏǈնưŰǘǎǈǦǞƳӋĮ}Ǡ^ǈࡃǮÄǏǈ̲ĲƴǓǛƳƐĮǛ$ǟĮ\"ǚ^ǖǈȞǣ2ĮǈֆǯĮ\"ǧ$ǭǚƳĈĮ*ǪHǢ$ǡÄǍĮ@ǟźǕ8Ǫüǐ	ǈआƮƳxƳşǈȔǹƳ८ĮǬǍ^ǉǰ2ǈरǈлǈōǬǓĲƴ̛	ǩǛƳxƳ̘	ȉǈÞƳƹؚĦǹƳɨ	ħƮƳxƳ˗ĮǧXĥHǑǸ2ĮǝǣǍĲƴŃˡǈƷ\x00ǵ\x00ƺ\x00ƴ\x00ƽ\x00Ƴ\x00ƶ\x00ƹ\x00ǫ\x00ƻ\x00ǧ\x00ư\x00ă\x00Ƹ\x00Ǵ\x00Ƶ\x00Ɩ\x00ƍ\x00ƣ\x00ō\x00Ƽ\x00ǖ\x00Ǐ\x00Ő\x00Ǜ\x00ń\x00Ɯ\x00ő\x00Ƌ\x00ĥ\x00Ƥ\x00Ǚ\x00ơ\x00õ\x00Ǟ\x00¨\x00æ\x00Ă\x00ǽ\x00÷\x00ŷ\x00~\x00ƚ\x004\x00ǳ\x00\x00ĸ\x00Ī\x00Ơ\x00ŭ\x00ĕ\x00\x00Ǳ\x00Ȁ\x00ö\x00Ɣ\x00ǔ\x00x\x00ø\x00Ɗ\x00Ǖ\x00Ĕ\x00Ǝ\x00ô\x00ÿ\x00Ǿ\x007\x00Ÿ\x00š\x00ƞ\x00«\x00ƒ\x00{\x00í\x00Ū\x00þ\x00Ə\x00|\x00b\x00Đ\x00ĉ\x00\x00\x00F\x00Ý\x00,\x00Á\x00ā\x00'\x00ą\x00o\x00¥\x00Ů\x00\x00Ʈ\x00¿\x00Ɔ\x00\x00ǚ\x00ý\x00Ʃ\x00Č\x00ź\x00.\x00ƅ\x00Q\x00ù\x00ē\x00Ɵ\x00ĝ\x00Ĉ\x00ü\x00E\x00ê\x00ŉ\x00\x00Z\x00\x00ã\x00Y\x00Ɨ\x00\x00(\x00¶\x00à\x00D\x00\x00\n\x00¤\x00ļ\x00$\x00\x00\x00\x00\x00ŋ\x00w\x00j\x00º\x00)\x00g\x00}\x00G\x00ë\x00đ\x00¼\x00û\x00\x00Ē\x00ƌ\x00Ŵ\x00Ā\x00L\x00Ą\x00ŗ\x00Ň\x00Ď\x00á\x00\"\x00ű\x00Ɖ\x00Ğ\x00Ė\x00č\x00ū\x00ƥ\x00Ʀ\x00ę\x00ğ\x00Œ\x00Ĝ\x00Ę\x00ď\x00Ġ\x00ě\x00Ć\x00ú\x00Ɲ\x00\x00\x00ė\x00p\x00V\x00M\x00n\x00*\x00ŕ\x00î\x00%\x00Ŏ\x00Ŀ\x00ġ\x00z\x00±\x00@\x00ð\x00\x00<\x00 \x00I\x00Ö\x00k\x00+\x00¬\x00¢\x00é\x00Ü\x00\x00Þ\x00&\x006\x00\x00¸\x00W\x00È\x00\x00Ì\x00B\x00S\x00?\x00v\x000\x00Î\x00\x00ñ\x00d\x00À\x00¹\x00Ó\x00\x00\x00¯\x00Ù\x00/\x00Ë\x00N\x00×\x00l\x00\x00³\x00Ï\x00°\x00!\x00[\x00t\x00]\x00´\x00i\x00\x00²\x00\x00è\x00\x00ň\x00\x00y\x00Æ\x00=\x00;\x009\x00C\x00\x00\x00¦\x00Å\x00s\x00ï\x00\x00ß\x00\x00¾\x00f\x00>\x002\x00c\x00Û\x00R\x003\x00\x00 \x00\r\x00Ã\x00Ç\x00\x00\x00a\x00ì\x00^\x00Ñ\x001\x00H\x00Â\x00\x00\x00\x00µ\x00-\x00Ú\x00ç\x00\x00®\x00r\x00h\x00#\x00½\x00ä\x005\x00u\x00\x00J\x00\x00X\x00¡\x008\x00P\x00É\x00Ð\x00Õ\x00å\x00\x00Ě\x00Ŗ\x00\x00§\x00Ǡ\x00\x00_\x00U\x00Ř\x00ó\x00©\x00ª\x00\x00:\x00â\x00ò\x00»\x00\x00\x00\\\x00	\x00m\x00\x00T\x00\x00q\x00·\x00Ò\x00Í\x00O\x00e\x00Ê\x00K\x00Ô\x00ƾ\x00£\x00Ø\x00\x00Ä\x00ņ\x00\x00\x00A\x00`\x00\x00\x00­	Į}ǈͦǏ$ǕǏĮ\"ǦǤĮ\nĭѵƭࠂƮޡĮ\"ǈȞǊĮ@ǈЮǈŨǈ࣢ǪĮǳǈȆĮ\"ǈЀǈ͵ǧ8Ī2ĵņĮ\"Ǟ<ĪĮ}Ĩ^ǈۣǪÄǈƼǢǈࣸĮǱĪǥǈԓǩ2µĮ\"ǝĩǮǹƳѫǘƳ˩ĮǬ$ǔ\rĢ৛Ʊ\x00ư\x00Ʋ\x00ǜץǈ	ǈōǹƳؽǈߨǴƶहĮ\nĭƏĮǈҤǩĮǦ$Ǎĭ̵	ǈ̲ĥƳxƳ̘ĮǤ8ǈÕĮǈܑǈކǹ<Ǻ2ǝƳƶĮǑ<ǈʩĮǯǻǊ$ǣ2Į@ĩXǐǭǔĭǨ\rȃ&Ȅ&ȅ&Ȇ&ȇ&ȈÏǚƳƔȁǳĮ\nĭäĮ@ǋHǈܪǈۍǈʩĮ\nĭۦĮ*ǎHĩ$ǮǸĮ*ǟǨǈΓǈĮǰ<ǹĮ\nĭĒǹǙƳϺǟĲƴǔǗǞƳߡĮǎXǖHǬǈࣜǧƳĈǈतǈҰī¥ưʇư݄ư΂ư؆ǛĲƴǓĮǏ$ǯƯƭ˛ǔƳǆǎƳƐǙږĮʹǞ^ǣ$ǈ्ǝǋǞƴȴǒĲƴǀĮǤħĮ\nĭãĮǖ8ǑǵǴƹेǓǎǉÏĮ*ǈԈǈŨǬÄǳć;ǈƞƳĈ! \"#ɫɮ$%ɧɨɩɪɓɔɕɖɗɘəɚɛɜɝɞɟɠɡɢɣɤɥɦD	Ğ\nğǑǙ\rǚİĵɆƅɇƍU¬®cȑȒ)ɈŨɉŬɊůɋƫɌƲɍƶɎĽɏŀɐǱɑǴɒǶǸǼÔLȝÍćFÉ@\raQa/­On&,ex¼1$\x00¤>½£daaVa¥?`rfYz{ÊhAa\n»a!.h#\nb%hÇ hNvh7aaaha_aa¾a¹¾a[\"I CS5c2aaW·°=}Gh\\:º)3qEaaaÆ¦;aa-XBµRHÂ8^¸a<(p]³Å9®ÁU+§¬iLTw	±mJ06¡a4¾a«ËgkÀuyoDkya|ª©salaajMh¯aZa²aaaaP¶ªÄÃ'´t¢a*¿aaaÈK~Ì¨a\x00ÍǀƐֿSưĊAư̴ưMHL)ɪƲķɺ\"\n!ãɧƳ-	\"\"Œɧ\x00ǐ	ǉ	ɝɞɟɧ#vSưïAHL\"\x00)\rǉɋ	\"\n!Ēƻǃǉ	ɫࢳŜÙ±GɧĝɨĜǞƳoতȁɫ\"Ǻ8Ǧ7Ǉȕǉ	\"\n!ɩ7ɓǐƳ Ǻɧ\x00ɨ2	ƳżƴĮɧjyȍƴәƴʹȍƵࡲƴۚȍƹ˼ƴͨ)ȍǫN!қǉ		yȍǴƴ׮ȎǴƶضV\"\n!ڿ\"ǘ8Ǌ\"ǴƳ̼\"@ǍHǭ$ǵ®ǈמ\"@ǟXǕ$Ǹ®ǔ\"4ưSƿĈ\":ƶǈΪ	ǉ	\"\n!ٴ\"\n!ٚǉ	ƷƼ\rɓɔɕɖɗɘ\"*ƴҥƽझåƶϘǔÏǉ	ƽŗɧ#vSưMAHL\"\x00,\x00)\"@ǺXǕ$ǘ®ǈ̣\"\n!׀ɥǉ	7ưßưbǉ	Ȃɫ¼ɧ#vSư©AHL\"\x00,\x00)ǉ	ɫ࣮ǃê\x00	ɫǎǔyɮǎǴƳ̈́ńķƳЦ)ƣV\"\n!ԛɣ\"ǽɧ#vSưࣙAHL\"\x00)֬\"ȍ\"\n!ĩ\"\n!ࡼǉ	ǈड\";ǉɈ	\"7ưŰƳǆ\"Ǧ~ǺÖǈ˯Ǖ2ưķɧ		\"Ƴ-ɤǉɉ	ǉ	7ȁǌȀ	əɚɛɜ	7ȋɧƌưŏǈƋɫ࠾ǉ	!ۮࣝǖƴ˞	µɫѐɦɽǆßƸÕ	\"ǈكǈê\"\n!²ǉ	ȋɧ\"\n!ƕ	ɧ<v\"ǉɐ	ƴȀ!Ɠǉ\n	\"\n!Җ	!ǨɧƳ 	!̜\r\"ǴƸϟǫ$ƳজǴǉɊ	ƹʰƳȡɨ	\"\n!ऊɧƳɧƳłưɫݑ\"ǴƴސǈࣵƳļɉƴĮɧ࢔\r7ǴƳƤƴߺǖƴݵưפǉɑ		7ǈ͍ƳǴ\x00ɧ	\"\n!ä(ǽƵŃ!ƸƵʱ\"@ǔHǊǈঘǑ\"@ǤÖǺ<ǵ®ǈǴƵ५ǂ˩ư»ǧƳǜƳȨƳƉƴǀ\"\n!ڸǉɏ	ǈࡏٽɧƗƳ࣭ɧيƳ·ƴՅư\"ǴƴͭǴƳ৆Ƽсƌưδǉ	ɓԞSưĊ!ɪǉɌ	Ʊķɧ	\"\"ǵ<Ǌ\"\"ǟ<ǈÕÙưGư͉ưΝǉɒ		Ǵƴ׬Ƴा­ǉ		ǉɍ	ƾƶɠɡɢɮ­eǅƔǁǟףưÍư»ưMưıư©ưטɘǉ	ǴƴŕƳxƴऌÙư±GɧĝɨĜ\"\"Ȁǉ	ÙƱࠅƱĬ\x00ऴǉɆ	Ų	ǈ࠰ǉɎ	ɧ#vSưƎAHL\"	\x00,\n\x00)ǉ\r	ɧ	ɧƳ-ǜǌ׈ư׏ưॺưȇƌưܲ\r\"ʀǈैƳՌǈĺǈŔưȇǴƴ״ŌƺSǄŐ7ǈߟ	ɧ#vSưıAHL\"\x00,\x00)	ǈ࡯Ƴļɉɨíǉɇ	ǞƳoíǱŎưê\"\n!Əǉ	ɔɕɖ7ǶưbڃɮǎǴńķƳࡕ(Ȁ;ɓǴƴŕƳxƴĹɮɰ\rɬɭ\n		x\n:<ƓȡƇâ¥8đĬđŔŉňĪ\nť'ÎťÐđŅAđîđnƒŬġĳ÷Ò±°ÿđŨIJ?æŠŮÓgÙƊƍ ÊĐåUģśą=ŒťþùśµºŕıƃđđHìÈ_ę>¾đŏLÁŚĴƏ®ëªŘđőĿDĹ9ÛČêĤ<TĶáĒđēh!śKİśŋŁÏś3)ŃśX\"ś¸ţőzûC¹śPŲŉťĠŊƄğ/%ŬūÇŐ×ĩƎ#śE7ſťų&đđŎƂĹğµ+ĞÍť<ĄŬôŪñ¦bĊƈ­ÃśõŀŹƒśŜãĂçĔěƐđÝťđőcĹĦś<FjèµĨdÆqĜ¯ś=ĆťĢĕđĉ{ăņ10Ŭ$Ō.đŽ¢Ťċ\x00ť·ĵđðÕėÑśœéđƑťđłÉŦƋĎ¡ĽķmđđƀoŷŻØóßśôŸŰśćƎNđ-ťđőc;ĖV@đĖđíŬiźÂđşaĻĭľũƒ½Å*äxťòw1ŴU¤ťĕŌsűt¿ůŶƆđĖkīđĖĥđĲ`Ę^lść,ňĺÀĸNđ£đž¼đfMňĀŝZđ~«øWýŗťySť[ť| ťReťv»¶ËĈĝčđňżĚüÜđúĖđ4ÚŵśôuŬć2Öśĺ2NđƅpřđŞśŖđYÄđđőcĹį5Ĵ	öÌ<6\\\r³Ŭā(ÞƌQđà²đŢđđrO¨đ}ťđť´©Į:ħďđļƉŇđđŧïđđB§ŭƁšń]ÔđōG¬đ\x00Ɠ'ǫ\nɩɰ­ɮѶɮу7\"Ǐ<ǧɛ\nޖ	ɬǧƳĸƻЈƝ\x00ǈौ\r4ưտ\rưß\ryǛƷ֫ǧ\x00ƻώͽV@ǈrưסŢ	\rƴڏ\"ǈࠜǑ@Ǐ~ǘ8ǔǉƳ-	ɓNƓ	Ɩ\x00		ɓ$ƕ		\rƳ	\n؛ơ\x00ɓ	¿ɓ	őǧ\x00ƶ˫Ɏj\rƳǵƺ࠮\rŧ\rƳމưbƓ@ǸXǺ$ǘ®Ǔ\rǴƵǈ\rAí\"Ǌǈ̣\rA\rAɓưџ\rA̥ưΈjǴƳôƴȘ	ƳRƸԫ	ƳRƶǈ\rǮƳ\x00	ŷT\x00ǈׁǶFưb	Ƣ\x00\x00ɩ	7\r̜ɣưSƖ\x00ɛ	ɘ/ǫə/ǫɚ/ǫ@ǈrưࢶݔ	ƥǕƴϬ	Ƴ-ơ\x00ɔ	ưܖǏ8ǍƜ\x00ǈܼǓ8ǑƖ\x00ǈ˨ǉ	ǴƳƤƳɄɕʠɖ\n\r5ɔیưŖ\nՉ\"ǔ^ǈҦǏǈۏǻ̵\nউƘ\x00ɕ	ɠɫ¼\"ǠǬ	őǧ\x00ƴɍɈjɫǂư˹Ƴ-ɩmưɳơ\x00ɕ	ǈрư˴ƒ	\nғƘ\x00ɔ	zɩmư¶ɔ/ܞɕ/ࣁɖ/ǳ\rɓƣƵগǈȺǕƳ̝ɦǳǗǈȁƼִ\x00ưИǈȁƷӀ\x00ư࠳ƕ	ưbơ\x00ɗ	\nƏɗeəƶɨưS	ɔŵŰ2ɖǳưS\nե@ǈ٤ǈͣǈ॔ǈव\n܊	ɓƒ	ɛŇɫə	̭ƴࢡƳَ\nݫ\rƳ-\r\rAƳ৓ň;ƹاƹşƘ\x00ɣ	\rƺϊ\rƺڡ\rƹȘɡŇɫɠ	ɓɖe/ǫÙGȋƔ\rÎǙƳޯ\n٧\nҜђɕƣƶࠌƸƘ\x00ɤ		ɔƳ]ưSƔ	\r\r\rAƳºƳʶ\r+ưӾ\rAƳࣩ	ɓ6ƒ	\"ǠHǈȲǦǉ2HƳ]ưȵƳ]ưŏ	ɓÈƕ	@ǈrưϤɘ/ƶ̙ə/ƶࢢɚ/ƶ̯ɝŅʈɚƶ̯ɘe\nॖ\nЬƠ\x00ɓ	ɮК\nࠨ\nӨɨ/ǫɮद\nܟǉ	ɩǻƟ\x00\r	ɓ+ǫɒǴƳƤƳɄ\r5ɓ˒ưŖƚ\x00ɮΖưܓɘ2	őǧ\x00Ƴ˾ɒj7\rÔ\rɔəŅ¿ɥٛƛ\x00	\r\rছ\r܃\rڶ\r˨ɔe	ࡖư+ΠǈrňࠇǈʤļনǴƺقǫ)ɓǴƳ§ƻɯɆݶǴƷ֟ǫ)ɗǴƳ§ƷıɇދV\"Ǹ<ǧ\nթ\"ɕư࢕Ǝ\r	\"ǈͿǸ\r7ǈנ5ːưټ52\rAǴƶº\rAưŏǉ\n	@ǈrưҘ	őǧ\x00ƴʻɊjɔƣƶς\"ɓ<ɔ\nࢼ\nॶɓƳࠀ	Ɯ\x00ɨ	\nࠓ+ư¶	őǧ\x00ƴťɐj	őǧ\x00ƴ࠸ɏjyɮΞÅV\rʙ\rȼɮݚmưb\"ǬHǏ~ǈࢲǔ2ǡŞ;ưê+ǫ\rƞ\x00jƳ˸ư֒ưɳėƶࣷɰӜƶΨņܢņ։ƴġվ\rV\n֚7Ƙ\x00ɜ	\rƚ\x00ɮȪưۆưȷə2Ɯ\x00ɩ	ɠɧǈࡧzeƦ		ɓ©Ɛ	Ů	ǴƳôƴ҇\nש\nӴɜƳ·Ĺޭư	ƳRƸĭ7ưß\rƴoƴזƵ\nνƘ\x00ɥ	Ə	\nĒ	ɔƳ]ư¶}ǊXǑ8Ǡ®ǈ\"ǺǈǦ8ǹ\nοƛ\x00		ɞǳɟQɔ		@ɕ$ɓ$ɔ	\r*\rƶ࠴\rƵ߆ưbǈƔ¿ɣ\n߹ǉ		*ǈrưѧɩưӌɩư܏\nؼ\"vƘ\x00ɖ	ɩmň;	ɓƳ]ưS7ƶ̋ɗɗƳ]ưǟ~Ǌ~ǟ8Ǹ2ɓ>ɠŅ/ėǴƵक़ǴƵʽƶۗǴƵʽƶǒ\nÎǴńࡠƵݟƵ˚Ƶ͇Ƶ˚ƵͫƴġƁ\rV	ɬƳìƵ»		ƍưҎƛ\x00ɗ	ܛ\nӿmưSɩmưbƍưʶ*Ǭ~Ǒ$ǬǑɘƶַJǴƳôƴߋɝɫ¼\n۸ɟ\nࡊvƳࡘ	őǧ\x00ƶɈɑjɔӖ\rՑ\rƳٹưb\n֙\nय़ɓ/ǫ$ɗ/ǫvƳխư؁\rʷƳ࢙mư¿ɚ	yɮμÅ\r߾ɮٶɫǂư˻Ɩ\x00ɖ۬ə	\rž\x00	vǴƳôƵĹµ¿ɗ\rǴńȭ\"ǘ<ǈÕ۝ɓe	ǧƳĸǈӟ}ǸXǈйǈ޷ǈ\"ǈןǸɝ\nϫ\rȈƳŁ\rɲƳ-	ɜǳɛQɚ	ƛ\x00ǞƳ|ɝ2\n܂ǈȺƳį	\r\rǌƳºƴȬ\r7\rۂƮưަζƳۄ\r	+Ƴ\nڣɕeɕɕƳ]ưʱƛ\x00ɘՇ\n঒\nԊ\rǳʜəɫ¼7ƻؠ}ǰ^ǺǬǊ\n٣Ɩ\x00ǈ˹	ƳRƶ\nٔ\n৏	7\rƳ]ưƜ\rۋƜ\x00ǈ̛	őǴ\x00Ƹΐŝ	Ǭ8ǈޙȋ(Ʈ	\rƚ\x00ɮȪưिưʇɚ2Ɩ\x00	mư¶\n࣡ɓɫ¼Ƒ\r	\nэ\r(ǖƴ˞Ɵ\x00ɧ	ɏɫ˛	ƳRƽŗ	őǧ\x00ƶࠉɍjǈݹɫǂư˴	(ƮƳӼyɰӬV\nĩ\rǴƵॢưbeڑ}ǘĪǈޫǉǈɩϩư̴ư˻\rƴո\rƵࡔ		+Ƴŗ	Ƶ߷ƴì	Ƴ৚ǵĺӺǈХǤƠ\x00ɔ	ࢋɮࠆ	őɬ\x00Ʒѥ		ƚ\x00ƍưܝ\näɩmưSɕȼɓɔƳܬƷ̼Ƙ\x00ɘ		őǧ\x00ƶťɋj¿ɤĵ\n޼\n²\nãɬ(Ȍ;ɓǊɥǊɣǊɤŅǵƼƌƛ\x00ɓ	T\nƕ	őǧ\x00ƵƑɉjƘ\x00ɗ	Ƙ\x00ɞ	ǈrưԾ\"Ǭ<ǈÕ࢐ɩmư٠\rAƳ-	ɓƳ]ư¶Ƙ\x00ɢ	ɓɫࡳƟ\x00ǈǓ\rŚ;	ɢǳɡQɗ	ǈާɫɝɭǴńȭǈݐư͊ǈʤư͟ɬ	őǧ\x00ƴ˪Ɍj\nτyɰ࢈V	\r\rƴֈǴńķƳɦƳ·ŅӣưđǴńķƳɦƳ·ƴӱưƘ\x00ɦӲưաɦ	ǉ	\nЙɔɓ\nԱǈĲ	\r*\rƶׯ\rƳוưb߻	Ơ\x00ǈĲɫ؉Ɲ\x00ɪ	ɮ߯\"\rɰɱ	ɯ	\n\r c$	bDQTL/*IMN^`I#82S:U;*G%-APZ]V\\0?937'YYW@_(J34,\"6\x00K+`B!&O`%a`\r`5R.`CB<)F 1>0=[X\n\\E?H`X\n\x00cɝǉ	*ǈࢇǈѣǦǤ	7\nΧɱدɜƷҏKyƳ-GƷԳࠗƳ¨ư۞Ɗ	$¸+0ϰ<Ŋ)ɕƤʄƶɆƁVǉ		7ɱ­ɗ	ǧƳ§Ľ	ǳů\rưɜɛǳƶԅưŖɮԦɬƵھɬƵࢩ\n²Ƌŋ̨\"ǰ^ǺXǺǈহɬƼচ\nǉ\r	\rƳԇǵƽϝƳ֯ɰ̧	*ɯŃǙǧµ\nݓ	ǾƳŝł̨\nॱ	Ƴ]ưSɣ	ǧƳ§Ł		ǳ\x00ưɜ	ɝǳƶέ(ǵƶ֥ɔɰȧƶț\x00ɔ	ǉ	ɏɯƴßɕɬƾг	ǧɯƾǫ\nƕƶ֞ǴƽĹǏ\r\x00ưŜ	*ɯŊǙǧ\rǈpƳ\x00Ʒ޿ư	ǴƵǈ	\nݲ\nã	ɬƹļ\x00		ǧƳ§Ļ	ƴܨ\r\n঍	ɬƳìƴÐ		\"ǈُǤ\nЇɕɰɹ	7\nĩ\"\nĒĵ	ǧƳ§ľ	ǉ		Ƴ]ư¶ė)Ƈ\x00ɫڟƳ]ưȓƣV	ɬƳìƴÐ	\"$Ƴ¨ưŰɮϠ	\"ǈ˯Ǹ\nٵ\r\"$+Ʒ͞+Ʒ΅ɓɰȧƵɀ\x00ɓ	ʈɯnǧɗǉ	Ɠ\nࡐǠ~ǈөǍǕ2ɰɹ	\rɬƴ|ƴÐŭɘƳ̦ǴƼҊǴƺࢤǴƸ݁	Ƥư˾\x00	ɰФ	ɘǦ8Ǐࡆ	ɬƴ|Ƶ»	\rǈpƳ\x00ƻॻưɬ(	\nä	*ɯŀǙǧǉ\n	\rɱɲ\n	&	\n\x00\r\x00ĵɰ̧ɘɰ֔	\n²ɬƼñ\x00\x00		ɰʒƵ؏Ƶःǉ	µ\näǉ	ɖėɬƶ̷\nǈÞƳɬƶɬƹٯ\nƶʭ	ƁV\n\"ǧɯɘǴƵǈɘৃɘƵɤ\"ǘ<ǈǆɭeɭưঝɔɓ	ɘeɔɫ¼ɲ­ǉ		\rɬƴ|ƴÐŭɘƳ̦\nFɖɕɫɔ\nãɖ\n	\nɲ\x00\r\x00\x00\x00\x00\nǈpƳ\x00ƻҿɰʒ	µ\n\n	²";}else{return _$dY;}}else if(_$dw<28){if(_$dw===24){_$h7[6]="";}else if(_$dw===25){_$dY=_$cM.call(_$iy,_$ei);}else if(_$dw===26){_$h7[3]=_$f$;}else{_$dW.lcd=_$bZ;}}else{if(_$dw===28){ !_$_S?_$_7+=9:0;}else if(_$dw===29){_$em=_$_K(_$cM);}else if(_$dw===30){ !_$_S?_$_7+=54:0;}else{_$h7[4]=_$$Q(69)-_$dY;}}}else if(_$dw<48){if(_$dw<36){if(_$dw===32){_$h7=0,_$fv=0;}else if(_$dw===33){_$h7++ ;}else if(_$dw===34){_$j2=_$iC.join('');}else{_$h7[0]="lbtiv{`tww:kxciA|hixcxg`&`{iie/`teean`vdcvti`ctbx`itgzxi`hxtgv{`2`{iieh/`l|wi{`tuh`dcadtw`gxtwnHitix`4`udwn`egdidinex`zxi`ygdb8{tg8dwx`gdjcw`z`etghx`jcwxy|cxw`gxhedchxIxmi`dexc`hxcw`hinax`ejh{`hea|i`ixhi`vtaa`hig|cz`MBA=iieGxfjxhi`}d|c`dcgxtwnhitixv{tczx`yaddg`zxiDlcEgdexgin9xhvg|eidgh`inex`gxhedchxInex`6vi|kxMDu}xvi`vgxtix:axbxci`hitijh`/`teexcw8{|aw`cjbuxg`{x|z{i`zxi:axbxci7n>w`idHig|cz`advti|dc`ha|vx`hea|vx`:~vE`wdvjbxci:axbxci`jhxg6zxci`gxeatvx`|cwxmDy`U`axczi{`#`v{tg8dwx6i`R`yjcvi|dc`ixmi`dci|bxdji`hjuhig`Bti{`dcegdzgxhh`wdvjbxci`ide`Z`{thDlcEgdexgin`]`w|k`exgydgbtcvx`))(`i|bxHitbe`Gxfjxhi`MBA=iieGxfjxhi:kxciItgzxi`vtcEatnInex`dctudgi`hgv`eyyY`du}xvi`-Y`xmixgcta`btiv{Bxw|t`dcxggdg`zxi:axbxcih7nItzCtbx`hfgi`gtcwdb`ujiidc`gxhedchx`|cwxmxw97`Q`|ceji`btm`tvi|dc`advtaHidgtzx`\"`XX`t`gxhjai`{gxy`ktajx`zxiI|bx`|`~xnwdlc`zxi6iig|ujix`W`v{tg6i`gxhedchxMBA`:axbxci`dcadtwxcw`gxbdkx8{|aw`{|wwxc`hxi`{xtwxgh`idAdlxg8thx`egdidvda`X`dcadtwhitgi`cdwxCtbx`~xn8dwx`:kxciItgzxi`q`vdd~|x`gxbdkx:kxciA|hixcxg`{dhictbx`Y`|cixgcta`hvg|ei`|h6ggtn`___IH___`hitijhIxmi`$u_vtaa=tcwaxg`ydcih`%`GxhedchxVInex`yxiv{`hjub|i`xkta`bdjhxje`aa`hitv~`k|h|u|a|in`vdchigjvidg`hxi6iig|ujix`dg|xciti|dc`ydgb`$_NKIM`vadhx`vaxtg>cixgkta`eti{ctbx`zxi>ixb`idjv{xcw`EDHI`dchjvvxhh`wxhvg|ei|dc`|ccxg=IBA`hvgxxc`Pcti|kx vdwx]`i{xc`gxeatvxHitix`vx|a`m`hig|cz|yn`=IBA;dgb:axbxci`bdjhxwdlc` 223 `hxi>cixgkta`dyyhxiL|wi{`0`B|vgdBxhhxczxg`uddaxtc`=xtwxgh`va|v~`eytY`eyu[_Y`hxay`hxiI|bxdji`cdl`zxi7djcw|cz8a|xciGxvi`x7-,u8Y`P`xkxci`dyyhxi=x|z{i`ede`{dhi`g`xmxv`btiv{xh`adtw`BH`teea|vti|dcXmba`uZ6xZ;)t`{|hidgn`zx`Dkxgg|wxB|bxInex`E`k|hjtaK|xledgi`y|`vgneid`eywY`vtcw|wtix`wtn`hdgi`bdjhxbdkx`B|vgdhdyiWMBA=IIE`twwxwCdwxh`Bxw|tHigxtbIgtv~`nxtg`p` 2223 `teexcw`vtaaxg`bdci{`$_NLIJ`tudgi``etgxciCdwx`}hdc`id<BIHig|cz`xggdg`ax`b`$_ih`bxw|t9xk|vxh`vdbe|axH{twxg`~xnh`hvgxxcN`gddi`hvgxxcM`tkt|a=x|z{i`$ub;YtMOaGbaKnJ=?`Egdb|hx`edgi`gxz`tkt|aIde`xcjbxgtix9xk|vxh`hxi>ixb`vdadg9xei{`hnbuda`|ccxg=x|z{i`dyyhxiAxyi`zxiGxhedchx=xtwxg`kxgixmEdh6iig|u`djixgL|wi{`gluY`eyuY`<xiKtg|tuax`0 Hxvjgx`6}tm gxhedchx udwn wxvgnei|dc yt|axw V `|hCtC`vdcit|ch`un_eti{`(`itzCtbx`du}xviHidgx`vtaxcwtg`YYYY`dyyhxiJc|ydgb`tiig|ujixCtbx`eyxY`axyi`cjbuxg|czHnhixb`igtchtvi|dc`v{|awA|hi`0 xme|gxh2`cjb>ixbh`6GG6N_7J;;:G`tkt|aAxyi`tcv{dg`bxhhtzx`22xcw22`vgxwxci|tah`edl`|ccxgL|wi{`tkt|aL|wi{`hitix`|ixbH|ox`l|cw`zxiH{twxgEgxv|h|dc;dgbti`du}xviHidgxCtbxh`gxbdkx>ixb`$CL:*CoG~N}{bNoB)`tiig|ujixh`$u_eatiydgb`uxit`hxiGxfjxhi=xtwxg`dyyhxiIde`gd`hxhh|dcHidgtzx`zxiHdjgvxh`tae{t`_$gv`i|bxOdcx`(}x6AxHht+`advta9xhvg|ei|dc`xhvtex`gltY`kw;b`K:GI:M_H=69:G`advtax`h{twxgHdjgvx`tiitv{H{twxg`vdcixci`djixg=x|z{i`|vyv`ytYV`cjaa`tvdh`utiixgn`dkxgg|wxB|bxInex`zxiDlcEgdexgin9xhvg|eidg`idjv{hitgi`idjv{bdkx`etghx>ci`ygtvi|dctaHxvdcw9|z|ih`Pdu}xvi 6ggtn]`\\pQWT4R\\r`l|btm`zw`vgxtixH{twxg`y1z~vo`pYxoxXgm|k}xz|;c|lbhg`}VW`9DBEtghxg`__gvxLUu__8zLgux`<xi6aaGxhedchx=xtwxgh`vxaajatg`@xnudtgw`v{tgz|czI|bx`idJeexg8thx`ztbbt`qOfzjgaz B\\<5>;A]<9 6U.t-[t-QV7;`dhh`ADL_>CI`_`B|vgdhdyiWMBA=IIEWZWY`tiitv{:kxci`QPYV.]pZU(rQ\\WPYV.]pZU(rRp(rq QQPYV.tVy]pZU)r/Rp,U,rPYV.tVy]pZU)rqQPYV.tVy]pZU)r/RpZU,r/qQPYV.tVy]pZU)r/RpZU+r/PYV.tVy]pZU)rqQPYV.tVy]pZU)r/RpZU*rQ/PYV.tVy]pZU)rRpZU[rqQPYV.tVy]pZU)r/RpZU)rQ/PYV.tVy]pZU)rRpZU(rqQPYV.tVy]pZU)r/RpZU(rQ/PYV.tVy]pZU)rRpZU)rqQPYV.tVy]pZU)r/RpZU[rQ/PYV.tVy]pZU)rRpZU*rqPYV.tVy]pZU)r/QQ/PYV.tVy]pZU)rRpZU+rRq/QQ/PYV.tVy]pZU)rRpZU,rq/Rq//QyyyyQ/YpZU)rRpYUZr/RpYUZrQQ[*PYV*]qQ[PYV)]qZpYUZrPYV.]RpYUZrPYV.]R\\WRp(U(rQ[*PYV*]qQ[PYV)]qZpYUZrPYV.]RpYUZrPYV.]RqQPYV.tVy]pZU)r/RpZU)r/QQ[*PYV*]qQ[PYV)]qZpYUZrPYV.]RpYUZrPYV.]R\\WRp(U(rQ[*PYV*]qQ[PYV)]qZpYUZrPYV.]RpYUZrPYV.]RR R`B:9>JB_>CI`axkxa`udiidb`ix`gtczxBtm`eext`r`it`[v)v+.+*+[+Z+y)Z,*,)+y)++.+v+v*y+,+Z+w+*)Z+(+(+y,*+x,)).+x+++y[v)v+.+*+[+Z+y)[+Z+(+u,*,Y*y)[+Z+(+u,*,Y[v)v+.+*+[+Z+y)[+Z+(+u,*,Y*y),+*,)*++*,[,(+.+y+x[v)v+.+*+[+Z+y)[+Z+(+u,*,Y*y)v+y+Z+)[v)v+.+*+[+Z+y)[+Z+(+u,*,Y*y*[+*+(+y,++*,[,.[v)v+.+*+[+Z+y)[+Z+(+u,*,Y*y*(,)+Z,)+*[v)v+.+*+[+Z+y)(+Z+v+v*[+*,Z,*+*,(,)[v)v+.+*+[+Z+y)(+Z+v+v*[+*,Z,*+*,(,))Z,(,.+x+([v)v+.+*+[+Z+y))+y,,+x+v+y+Z+)**,[+v[v)v+.+*+[+Z+y),+*,)*Y,[+*++,([v)v+.+*+[+Z+y),+*,)**,(+*,[).+x+++y[v)v+.+*+[+Z+y),+*,)****).))[v)v+.+*+[+Z+y),+*,)*++*,[,(+.+y+x[v)v+.+*+[+Z+y).+x,(,)[v)v+.+*)[+Z+y)v+y+y+u,*,Y))+x,()Z+)+),[+*,(,([v)v+.+*+[+Z+y)y,Y+*+x).+w+Z+,+*)y+(,[[v)v+.+*+[+Z+y*[+*+w+*+w+[+*,[*(+*+v+*+(,)+.+y+x[v)v+.+*)[+Z+y*(+*+x+)*[+*,Z,*+*,(,)[v)v+.+*)[+Z+y*(+*,))-+y,(,))Z+)+),[+*,(,([v)v+.+*+[+Z+y**+x+.+x,()u*Y)))+[v)x+y,)+.++,.)v+.+*+[+Z+y[v)x+y,)+.++,.)v+.+*+[+Z+y)*,-`|k|h|u|ani{vctxz`gjc`djixg=IBA`aau`g|z{i`;G6<B:CI_H=69:G`{th{`ydg:tv{`itjatkx_gxk|gw__`eyvY`K`v{|awgxc`$u_hxije`{iieh/\\\\`imxIgxcc|`tww7x{tk|dg`P\\\\\"\\jYYYYV\\jYYZy\\jYY,yV\\jYY.y\\jYYtw\\jY+YYV\\jY+Y)\\jY,Yy\\jZ,u)\\jZ,u*\\j[YYvV\\j[YYy\\j[Y[-V\\j[Y[y\\j[Y+YV\\j[Y+y\\jyxyy\\jyyyYV\\jyyyy]`~xnje`e|mxa9xei{`<xi<`wxk|vxE|mxaGti|d`]31|31X|31!Pxcw|y]VV3`b||WidzWkcvaXzdc|}Weh`0 HtbxH|ix2Cdcx`*Y+*,[+++y,[+w+Z`glvY`ybsdeb| di~s}t __` `hvgdaa`;ath{`xmxvHvg|ei`vgix`PYV.tVy6V;]`gxhedchx7dwn`8daaxvi<tgutzx`|h:mixcwxw`{tcwaxg`w|g`~vtgIidCdw`zxi6aaGxhedchx=xtwxgh`biUd{_tedcbi`+(+Z+x,++Z,(`etzxAxyi`wxk|vx>w`]'cx' U'HJVcx'P qq hxztjzcta 32 RQ`uu-[~}`wwA|`A|xu`@6_AA`wxk|vxdg|xciti|dc`=><=_>CI` dii x{w yxc|wxe dgnm{ ctawgx`twti~Vctji`k|wxd`etzxMDyyhxi`va|xciL|wi{`icxbxa:htkct8ABI=`xmexg|bxcitaVlxuza`gtucd|i`h{|yi`va|xciN`{hta;xktl~vd{HW{hta;xktl~vd{H`ctbx0rvtiv{QxRpr`{htayVxktl~vd{hVmXcd|itv|aeet`Bhmba(WMBA=IIE`jhxEgdzgtb`h8Z:fc(yuCvdxfc`etzxIde`9xk|vxDg|xciti|dc:kxci`_$wu`|vxa`1:B7:9 |w2`vgxtixEgdzgtb`hgv:axbxci`cdcx`<btexwt`dei|dch`Lx||cm7?gHz|xw`hvgxxcW`bxi{dw`0 eti{2X`kxgh|dc`wxy|cxEgdexgin`W\\RTw\\Q `PtVoYV.]p[[r_`Cjbuxg`_enaltzg{|xivGwdxgigtHUi_xtena|lzgG{xigvwdHxxgxiaHixdv_geUnaltzg{|xihGxjUba_tegn|lizG{dxgvgwExyxdg6gvbdic|eUa_ltgn{|izvGdxxggwvGdx6gvwdic|`kx`zxiHjeedgixw:mixch|dch`l_x_gu|wgk_xtxakijxt`omnyh|yfih}`zxiEtgtbxixg`P\\g\\c\\i]`}tkthvg|ei/`cdwxInex`jgaQ#wxytjai#jhxgwtitR`buz,vuzvsl-li|nIu`v{tgz|cz`+w+*+x,*+[+Z,[`c6at`vadcx`edhi`uxydgxjcadtw`dl`uLMxdBzA`hjuhig|cz`LFxi` hgyam `fgv~ab9d:mi{L?|=6eZhKN@J(G;BFl-><yED.[ukAC}V,oM7tHcjYI8+zn_)Ox*ws!5$%^&SQRT213W4X/0prP]q `NG6GD`Z[,WYWYWZ`YWYWYWY`db|i`kh|u|a|i|Hntixi`vgxtix:kxci`#Z,x`wuava|v~`xgh`v{tghxi`{dkxgqdcVwxbtcwqcdcxqtcn`Rwad{hxg{Iatkgxic| Uatc|z|gdQ`htkx`tuhdajix`bod|k|h|u|ani{vctxz`xau|h|k`ni|gt`,)Z`VVVVV l|cwdl_gxvi_[ VVVVV`8ngie@dnxtEg|`bg|ycd8wad`__bO`xVcvig{htUx{ibtxbxgt{wwdqbvxjVcjiVggadxahgkUxb{bt{xxgqtxwbaxxVcaii|xhccz|kVxxhcVidhgixtVzdeegtUb{gb{xwxqtvatddic|gVtlxege`gcj|ixb`tuuwnd`hvgxxcAxyi`__egdid__`m~khldej>~khldejejbk>~khldejiap{`o{yff,byh`RTw\\QX\\mdyxg|;`jc|ydgb[y`gdlhxgBxhhtzx8xcixg`vtaautv~`+[)*+x+,+.+x+*`etgxci:axbxci`Hnixa`+(+-,[`YW*`+-,`'taxgiU vdcy|gbU egdbei w|htuaxw ydg'U wdvjbxci\\Wadvti|dc\\W{gxy`6udgi`u|cw7jyyxg`::8ADICG`xi{xgcxi`U wxvgneixw HC/ `|ygtbx`tiigKxgixm`difsljwtzxq~`()(-(((+()(-`V{tb`edehitix`ldwc|l 22 ivx}uDatudaz_ && \"wxc|yxwcj\" 2! ldwc|l ydxeni && \"wxc|yxwcj\" 2! ivx}uDatudaz_ ydxeni cgjixg`gxijgc tPu]Q`ujyyxg9tit`va|xci=x|z{i`i|bxdji`ql{plPwk{daf{`ydgbti|dc`HFAv:xm|ediHcKUm<v:ix|eUdMciE{tv:xm|ediBcxUtw8|idgcadxa=gIU6BeAxeiax:baixUcB=AIn@zx:xacxxcbDikUyxag:dklixUc<HEKcti|`dlUc`^\\hTq\\hT$`athi>cwxm`ixmiXmba`|;xaxGwtgx`Eaxthx xctuax vdd~|x |c ndjg ugdlhxg uxydgx ndj vdci|cjxW`_L>C9DL_8ADH:`;9{Eaxxk|itvI0u|ixctB vt|{xcJ |c80dd}aot0oxKwgct0tx=kaixv| txCxjA  IgE d*(I |{0ctid{tbA0 <bHgt_i =xiihG zxajgt90C>gEVd|a{z0ix=kaixv| tIA)  (|A{z im:xiwcwx=0axxk_Bc>|w0t:HG8udidAdz|i{7 ad0wGDB {dctniJ |cdvxwG zxajgt90dgw|H ct h{I|t@0cttctwH cttz bCB9089J {vcxv0da~vY[+Zk_WZ0ZtHhbcj@zcttctwxGjzta0g>BA C6>I<C7 ad0wtHhbcjHzctChbjA(A z|i{k0gxtwtc=0axxk|itvxCxj{Ic|H08:t;aatu~vH0btjhzcb:}d0|xIjajzH cttz bCB80gtdgh|< id|{ v8H;0naxbA z|i{G udid d|A{z0idH6B9Vz|i|A z|i{H0Bd 8tHhcG zxajgt=0MNN|tj?ch0ihh0btjhzchVctVhjc)b0Ibzb_cxbzcx0zdA|{ it@ccwt0t|ixb hxc ldgtb0cthhbcjVzthhccVbjA)h0gxy|bVcdhdtexvH0btjhzctHhcjCVbI(I |{0cd8daDgJHV>IM|{0cg9|d wtC~h {{Hy| ia60itHhbcjIzaxzjGjzxajgt70cxtz|aD HIB0 >tAIcc|_z7<D ij|hxwN 0HO;|BdtjL<_Z7Y-Y({0axxkcVjxVxxgjzta0gHH IxB|wbj80jd|ggxC lx@0b{gxB cdjw~ag| |d7wa=0axxk|itvA  I([J iatgA z|i{: imcxxw0wx=kaixv| tIA[  *aJgi t|A{z0idGdudiB wxj|0bg9|d wtHhc7 ad0wdzwj0nthhchVgxy|vVcdxwhcwxaVz|i{H0|;wcgxc0idVdthhcvV~}bVwxj|0b|b|jB0dG~v nGE 8d7wa60wcdgw|a8vd ~xGjzta0gtHhbcjHzctChbj)V A|A{z0ithhchVgxy|iV|{0ct6tEzctNgxv0httj0aC7B {dctniID7 ad0wVmhh0idCditHhcnBcttbOgltnz0|x=kaixv| tIA(  ({Ic|: imcxxw0wh6a{nxvH|gieIB6 iaC0id dtHhc9 kxctztgt |>JG0udid dd8wccxxh wd7waG0udid dxB|wbj> ti|a0v|b|jmxC0id dtHhc< gjjb{~ |>JH0IHK x|cibthx x|A{z0i<AD_|gtn{0vnydxy0xVmhhViajgiatz|i{90=;|xL6V,06O;LO7MDI_IcJv|wd0xx9tktctz|gH cttz bCB7 ad0wthhchVgxy|bVcdhdtexvE0wtjt ~d7~d7 ad0w<A;VNOc|7z@||t{HVjZHV*[K[WA0V<O;|Nzc|7t@H|j{HV*ZKVW[0(x=kaixv|CtjxAx IgE d*(I 0{|Bgvhdyd i|=tbtatnH0btjhzctHhct;aatu~vH0IHB wxj| bi>atv|60wcdgw|b:}d0|tHhbcjHzctChbj(V0GI> 8iHcd xxH|g0ythhchVgxy|hVtbaatvhem0hVihbVwxj|0b<AH_c|t{xaxhG0udid d{Ic|> ti|a0vxvicgjVndz{iv|80da~vedt|A0bjc|jd_htHhc;0da|g|wctH gve| ia60idCdiH ct hj<bg~j|{7 ad0wIAN=OH @d7wa<0_H{I|tH0btjhzcxCCdbj(__I0[g6utv|{0ctVhthhccVgdtb0adA|{ ixIjajz=0FN=||x*VHYA z|i{A0c|hwnxy gdH btjhzc60 Gg8hnti{a|x9 07tHhbcj ztHhcB wxj|0bthhbcjVzthhccVbj*){0ctVhthhcuVad0wjA|bdchjH_gve|0iHH Id8wccxxh0wtHhbcj9zkxctztgtG|zxajgt60}catB atntatbtB 0CtHhbcjIzt{Q|xiih0RO;tAIcc|=z|xBV<VZ7Y-Y(=0uxxg lID0HH<*)6_tgQuc6gw|dDwRHH0btjhzcH ct h|A{z0i{8vd ddv~d0nx{kaVxxcxjiV|{0cCEB {dctniIDB wxj|0b<A;V@OItcdVzZBV.[K)W90dgw|H gxy|H0btjhzc|H{catGtzxajgt{0axxk|itvA0V<O;t@dIzcBV.ZKVW[0[dCdiH ct hx9tktctz|gJ  >d7waH0IHA z|i{90E;b:}d0|xlitx{ygcdcilxG zxajgtG0udidCdbjG(90C>gEVdxb|wbjH0btjhzcH ct hjC*b0*HH Ix=kt ni>atv|A0a<vd)~G zxajgtY_Y-0*x<gd|z0tdcdihVctVh}v0~xIjajzH cttz bCB7 ad0w>B>J:  MdCbgat=0FN=||x,VH*7 ad0wdCditHhcnBcttbOgltnz |d7wan0cjhdgeVdauvt0~x{kaVxxcxjcVgdtb0ajA|bdchjH_gxy|I0 BdBt{icDn IdCbgatH0btjhzctHhcjCVbA( k|A{z0itHhbcj ztHhcC bj*)H0tbigd<{iv|B wxj|0bxzgd|z0ttvjhatyVcdVinixeH0btjhzcH ct hd7wah0tbaavVeti|at0h;Bc|ctxvE 8G7 ad0wO;tAIcc|=z|x<_Z7Y-Y(H0btjhzcg6xb|cctG0udid dd7wav0cxjingzVid|{Vvduwam0hVih{VtxnkH0IHA z|i{> ti|a0v{IgtdA0cVmhhVi|a{z0i|9ucadG zxajgtH0btjhzcx7zcatG|zxajgt@0 CdBt{icDnHItbaaB wxj|0bn{jexgH0btjhzctI|bGazxajgtB0atntatbtH cttz bCBC0id dtHhc@ cttctwJ 0>x{kaVxxcxj=0axxk|itvA  I**G bdctC0id dtHhc@ cttctw7 ad0wtHectnH0btjhzcjE}cutG|zxajgth0btjhzchVctVhjc)bkAA0_<t@ccwt0ttHhbcj ztHhcG zxajgtO0ltnzV|cD0xg9|d wxH|g yd7wa> ti|a0vO;6@?I0Ldvgjx| gxc0ltHhbcj:zdb|}xGjzta0g>B>J:  Md7wa60wcdgw|: db|}C0id dtC~h {g6utv|J 0>8A 9d80bj;jitgB wxj| bI7K0k|Vdmxgivt0it7zctaH cttz bCB7 ad0wt{hchVctVhxgjzta0gCHbj(V0GCHbj(V0It{hchVct0hHH IaJgi t|A{z0idGdudiG zxajgtG0udid d|A{z0it=jctb0cxcalzzid|{0v;9x=6|*L6V{0ctVhthhcaVz|i{E0taxi< id|{0vCHbj(V0Ax=kaixv| tIA)  *|A{z0inBcttb gtHzcbtO ltnz |d7waa0VzthhchVgxy|aVz|i{B0J> >M:A z|i{G0udid d{Ic|H0Bd 6d7waE0wtjt0~tHhbcj ztHhcH0te|vjd_hbHat8aeth0ctVhxh|g0yK9B {dctniIDB wxj|0biHutxaH_ta0edbtcdv;0naxbAVz|i{y0oohnwVhdneH0gvxxHcct0havvd[~ZY0+dGdudi8 cdxwhcwx7 ad wi>atv|60|gat@0 CdBt{ic nxB|wbjB0idndAttBjgL  (dbdc=0cthwix8 cdxwhcwxG0udid di>atv|=08I= ct0wHH IaJgi t|A{z ii>atv|H0IHK x|cibthx xdGtb0cdCdiC ht{~6 tg|u v>J7 ad0w{vycmoV{xb|wbjH0jC8bcdVwI(v0cxjingzVid|{Vvxgjzta0gxwtyaj_idgdudiaVz|i{C0id dtHhcB tnbcgtB0tnbcgtH cttz bCB60eexa8 adgd: db|}l0tx{igxdyicxG0ztHhbcjBzatntatbtxGjzta0ggtt|0ag9|d wxH|g yd7wa80dE (GE 8d7waB0 >6AICC>0<tHhbcj@zgdtxVcxGjzta0gxiih*)G zxajgth0|e|g_i|ixb90kxctztgt |tHzcbtB 0CvHxgcxxH|g0ydGdudiv0gj|hxkyVcdVinixeH0=I|x|ik_k|0d{vycmo0{tHhbcj za8vd;~cd i6(G0udid dd8wccxxh wxGjzta0gthhbcjVzxcVdjc(b0G?<B {dctniIDB wxj|0b{8ajd{C jx xdA~vg0udidVdjc(b0Ax{kaVxxcxjjViatg|A{zxiimcxxw0wtHhbcjDz|gtnxGjzta0gtHhbcjHzctChbj)VkAA z|i{B0|Nzcx=_|-Z(Y_Y[87Vad0w;9HEt{CdLkV*7<G0udid da7vt0~x{kaVxxcxjjViatg|a{z0ibzm_{||xA0a<vd)~A z|i{Y_Y-0*j<t}tg|iH cttz bCBB0atntatbtH cttz bCB7 ad0wdgdudicVbjG(H0MI{||xk_k|0dO;{OcjjNct<_Z7Y-Y(c0idVdthhcvV~}aVz|i{v0adgdhdC0id dtHhc< gjjb{~0|dCdiH ct hnHubad0hdGdudiA z|i{> ti|a0vdA|{ itI|b0ajvhgk|0xxwtyaj_idgdudi70t{{hi|8tbdaemxtHhc7 ad0w<AC_bjxu_gdGdudiI |{0cdbdcehvtwxlVi|d{ijhVgxy|0hx=kaixv| tIA(  *{Ic|h0btjhzchVctVhjc(bKA90C>gE0dd?db{agt0|thhchVgxy|aVz|i{{0axxkcVjxVxauvt0~dA|{ ix7zcat0|nBcttb gtHzcbtO ltnz0|g9|d wxH|g yi>atv|G0udid dd7wa> ti|a0vtCjc<bid|{0vdHncB uda| x9J< id|{ vxGjzta0gx<gd|z td7wa> ti|a0vthhbcjVzthhccVbjA(0kjndcVh{ic|h0btjhzccVdxcVbjI(vVcd0wdCdiH ct hnBcttb g>J7 ad0wzaxh|g0yO;dN=j|xGV<VZ7Y-Y(A0{di|E cjt}|uu0htx~kga|xah0btjhzchVctVhjc)bkIh0btjhzchVctVh{ic|A0 <b:}d0|c6t}|axCAle|0|tHhbcjHzctChbj)V I{Ic|H0btjhzcd@xgct7Vad0w|b|jmxaVz|i{C0id dtHhc@ cttctwG0udid ddCbgat> ti|a0vx<gd|z ti>atv|h0ctVhxh|gVyxb|wbjH0tbigO ltnz0|dGdudi8 cdxwhcwx> ti|a0vdCdiH ct ht@ccwt t>J7 ad0w;9 EvHH ct hx=xjY(Z_(YA0_<jCubgxG_udid dd7waE0wtjt ~d7~dm0hVihvVcdxwhcwxH0cj{hc|VxvJx{0cdGdudi7 ta~v> ti|a0v|Gzc dd8da gb:}d0|x9tktctz|gD HIH0tbigO ltnz |gE0dO;tAIcc|=z|xBV<V@760wcdgw|a8vdV~tAzg xxGjzta0ggeedgd|icdatnahVtexvVw|l{ijdVixh|ghy80ijk| xdBdci0b|hxA0 <bHgt_i =xiih7 ad0w>9ECdgAVz|i{h0ctVhxh|gVyauvt0~dA|{ ix9tktctz|ge0dgdeigd|tcaaVnehvtwxlVi|V{xh|ghyh0btjhzchVctVhjc(b0ANBjdzcE 8GB wxj|0b;9d<{iv|LEV*>7*<@=HVCD0Nt{hchVctVhxb|wbjH0IH= txnkA0V<O;{OcjjNctBV[YKVW[0[nBcttbJgxC lxGjzta0gdCdiC ht{~6 tg|u vd7waH0btjhzcj<t}tg{iG|zxajgty0cttinh{0axxkcVjxVx|a{z0ix=kaixv| txCxjD HI7 ad0wdcdihVctVh}vV~duwah0btjhzchVctVhjc(b0G|Awcxh ntHhbcj0zthhbcjVzthhccVbjI(H0gvxxHcgxy|dBdc:0gIbj enBcttb_gLO{0axxkcVjxVx{ic|mxxiwcwxC0id dtC~h {g6utv|A0_<j<t}tg|iH0tbigB_cdhdtexv0wtI|b atHzcbtB 0C<A: db|}C cdB60:dGdudi8 cdxwhcwxA z|i{> ti|a0vbz}_c|~z|t;0AOct|Izct@=c|x<_Z7Y-Y(a0iztgxk0ateta|idc<0dxzgt|7 ad0wg9|d wtHhcA0_<jE}cut0|bHgt<iid|{ vd7waH0btjhzcH ct h{Ic|H0IH8 cdxwhcwx7 ad0wd8|bhvC_gtdg0ldvgjx|0ggDn| ttHzcbtB 0Cx{kaVxxcxjaVz|i{mxxiwcwx;0AOct|Izcx=V|VG7<-Z(Y0YG68 ngihatx{=|H@H89 07xh|g0yIGHLjNGxjd<w<dkYVZxGjzta0g|BdtjLe_xg0kO;ZN0@<AC_bjxu_gdGdudiG zxajgt60wcdgw|a8vd0~dH6BG zxajgt=0FN=||x)VHYA z|i{0mzahVctVhxh|g0yt9vcc| zvH|gie7 ad0wxwtyaj0ixhVvdgdudiaVz|i{80adgdHD>JGVzxajgti0hx ixGjzta0gtI|b atHzcbtB  Cd7wa;0NOc|7zM|c|Hzj{HV+ZG0udidCdbjA(A z|i{b0cdhdtexvVw|l{ihVgxy|0hthhbcjVzthhccVbj*(80dd at}ooH0btjhzcxCCdbj(V0AIH|Mzct~0|vHxgcxtHhcdBdc90E;tLtL*L<V07tHhbcjHzctChbj(V A|A{z0it7zctaH cttz bCB<0gjjb{~ |tHzcbtB 0C:HG8udidAdz|i{{0yncdgm|t0cNBc|=z|x7<-Z(Y8Y7Vad0wthhbcjVzthhcaVz|i{=0axxk|itvA  I*+B wxj|0bg9|d wtHhc; atuavt0~dGdudiI hxZi7 ad0wdCdiH ct hnBcttb gd7wah0ctVhxh|gVydvwccxxhVwjvihbdH0btjhzcxCCdbj(V0ItHhbcj ztHhcC bj*(b0cdhdtexvI0 AdBt{ic nxB|wbj{0axxkcVjxVxxb|wbjA0=IHN@OG0udid dd8wccxxh wjvihbd xd7waB0tnbcgt0(g9|d wtHhc9 kxctztgt0|{HdtkCe_xg0kthhbcjVzxcVdjc(b0AO;tAIcc|=z|x:VVA7<0@jndc0hthhbcjVzxcVdjc(b0I|Ixb hxC ldGtb0cx{kaVxxcxjuVad0wdcdihVctVh}vV~xgjzta0gdCdiH ct hj<bg~j|{J  >d7wa90C>gEVdauvt0~O;tAIcc|=z|x:VVA7<-Z(Y0YHH I|KixtcxbxhB wxj|0bdGdudi8 cdxwhcwxA z|i{H0IHK x|cibthx xd7wa60 G?9@V0@g9|d wtHhcH B:08dCdiH ct hnBcttb g>J80bdc| zdHcdB0jNee nGE 8xB|wbjG0hdbxgt0ndA|{ ij<t}tg|iG0udid dd8wccxxh wjvihbd7 ad0wO;tAIcc|=z|xVHVG7<=0axxk|itvC jx xID0Ht@i|_|gekxG0udidVd|78zda~v;0NO@7?H0Lt=wcxh id8wccxxh wd7waH0btjhzcx<gd|zct90ct|vzcH gve|0ithhchVgxy|vVcdxwhcwx{0ctVhthhciV|{0ctHhbcjHzctChbj)VkII |{0cdA|{ iwDt|70t{{hi|8tbdaemxtHhc`|ihzdcctyt|a`w7du_m`jc|ydgbDyyhxi`eji`xc ladLwuxdH~vixjQag`kxgixmEdh6ggtn`dgicd8z6`BhmbaWMBA=IIE`ixhih`l|i{8gxwxci|tah`-)`:xkic`katjx`__el`QtcnV{dkxg`e`fxdjhv`8dcigda`H?bdihbj8iibUxbtg;xitxg8iib__`xctuaxKxgixm6iig|u6ggtn`Du}xviW>c}xvixwHvg|eiWxktajtix`vdd~|x w|htuaxw`gu`~c|Awwt`8dghhtl~a`Y[Z`lxu~|iGI8Exxg8dccxvi|dc`!cxl yjcvi|dcQRpxktaQ\"i{|hWt2Z\"RrQRWt`zyy`Z[,)`hjyy|mxh`bh8gneid`uajxiddi{`y|vti|dc`uthx`-[)`\"P:]\"`uw_h`>`Bhmba[WHxgkxgMBA=IIEW+WY`+Z,Y,Y*+`dEagwedib`:6`9tixI|bx;dgbti` \"{o\"2zcta cteh1`)(+Z+x,++Z,(*[+*+x+)+*,[+.+x+,)(+y+x,)+*,-,)([))`;adti([6ggtn`Bhmba[WMBA=IIE`wxy|cxEgdexgi|xh` t 2 cxl 9tixQR0`fgv~ab9d:mi{L?|=6eZhKN@J(G;BFl-><yED.[ukAC}W,oM7tHcjYI8+zn_)Ox*wprqs !#$%QRSTUV0245P]^`hwe`Gxz:me`vgxtixDyyxg`VVVVV l|cwdl_gxvi_Z VVVVV`mi`J87gdlhxg8at`zxiJc|ydgbAdvti|dc`gxhedchxJGA`)w,*,)+Z`Gxhedchx`!|bedgitci0 k|h|u|a|in/ k|h|uax !|bedgitci0 l|wi{/ ZYY% !|bedgitci0 oV|cwxm/ [Z),)-(+)+ !|bedgitci0`,[+w+y+(,-[x*[+*+Z+v*Y+v+Z,.+*,[[Y),([[Y)(+y+x,),[+y+v`XI,6nIgmdLm<w`tczax`adz`l|cwdl\\Wdexc 2 yjcvi|dc \\QjgaU ygtbxCtbxU yxtijgxh\\R`__#vathhInex`Bhmba[WMBA=IIEW(WY`_7GDLH:G`kxgixm6iig|uEd|cixg`thh|zc`{iieh/XX`etzxNDyyhxi`kgZ/WZ`,),[,.,u,[+*,),*,[+x[Y[-,,+.+x+)+y,,[Y+.+x,(,)+Z+x+(+*+y++[Y*,+.+x+)+y,,[.(u,w+(+Z,)+(+-[-+*[.,u,w`zxiDlcEgdexginCtbxh`:vmex|icd`w|hetiv{:kxci`tvvxaxgti|dc`xctuax_`lxu~|i8dccxvi|dc`eajz|ch`tvvxaxgti|dc>cvajw|cz<gtk|in`,Y+v+Z,)+++y,[+w`X/jhxg_ydcih`{_ew|cx|i|ygx`J|ci-6ggtn`t{wcxay>tgxbg8tx|icd`^P\\mYYV\\m,;]S$`([(Z(Z([`[*+-+Z+w+w+*,[+-+*+Z+)[*[v[*,)+*,(,))(+Z+++*)(+y,[+*[*[v[*,)+*,(,))(+Z+++*)),[+.,++*,[[*[v[*,)+*,(,))(+Z+++*).++,[+Z+w+*)),[+.,++*,[[*[v[*,)+*,(,))(+Z+++*)Z,*,)+y+w+Z,)+.+y+x[*`P0&]`Q^\\XSRqQ\\XS$R`u`jcxhvtex`,,+*+[+u+.,)*Y+*,[,(+.,(,)+*+x,)*(,)+y,[+Z+,+*`5wxujzzxg`gtuhj`hi`x<Di|g|ztcJaag`idd`td6wBtiv{Jga`ZW`c)ixu8,.J8,.`+++.+v+v`dehjv`ZY`hgzuqe(qgxv[Y[Yqtcn`Hxcw`9tit`zadutaHidgtzx`jcadtw`l|cwdlW`ADL_;AD6I`C|tzkdtgi`wdvjbxciW`)([WZ`cxww|=i|`;AD6I`6wwxHgt{vgEkdw|gx`Q\\wTR`i/sg_70+37[_`w_`bdjhxaxtkx`va|xciAxyi`b=d|oxwcw`gzutQ[)YUZZYU*(UYW)R`{iie/\\\\`+w+.+w+**),.,Y+*,(`*(+y`vtv{x_`ignp`+w,())+y`l/XX`ngxiit7ixz`jga`wtit/`H:C9`vIvefzba\\`ci>c`yjcvi|dc \\HT4\\Q\\Rp\\HT`ydci`,,+*+[+),[+.,++*,[`dic|hDxuxggk`hxiI|bx`dgvh`xtgv`Z+`imxicd`=><=_;AD6I`$u_dcCti|kxGxhedchx`P{iba]Wzxi7djcw|cz8a|xciGxviQRW`he{|d_xdw~dUob|6bc|tdiictHIg|iUbbx>dcomwxx7wU9obGdjxxf6hcit|ibc|;dbgxt`V3Pyjcv]/`t;xkv>cd`HI6I>8_9G6L`xcxgtaB>9U<x`hvgdaa=x|z{i`}uhv{xbx/XX`i8`{`PCd hjeedgi]`U jga/ `zxiEgdidinexDy`avdh~`uBchHfsu}`Gx`dcidjv{hitgi`9xk|vxBdi|dc:kxci`Bhmba[WMBA=IIEW*WY`vgxtix7jyyxg`DD_@DC>I>;G:`|h;|c|ix`a:wqv|mz/~mv|`gxw|gxvixw`+w+*+Z,(,*,[+**)+*,-,)`^Pot]Vrp_(VPot.Y]V[pr[t_VPTo$]`V3hxiixg/`P\\\\\\\"\\jYYYYV\\jYYZy\\jYY,yV\\jYY.y\\jYYtw\\jY+YYV\\jY+Y)\\jY,Yy\\jZ,u)\\jZ,u*\\j[YYvV\\j[YYy\\j[Y[-V\\j[Y[y\\j[Y+YV\\j[Y+y\\jyxyy\\jyyyYV\\jyyyy]`zxi6iig|uAdvti|dc`xzct{vni|a|u|h|ki|~uxl`y|axctbx`9|hetiv{:kxci`;dgvxI|bxdjihUch>cwxmxw9uHidgtzxUchAdvtaHidgtzxUchAdvtaHidgtzxEtnadtwUchHxhh|dcHidgtzxUchHxhh|dcHidgtzxEtnadtwUcxihetg~xgUcxihetg~xgG;>UchH|bjati|dc8dbeaxixwUchL|cwdlDexcUchwdbZUchwdb[Uchwdb(Uchwdb)Uchwdb*U__chU__ch6eexcwIxmiUxdLxu7gdlhxg`bh>cwxmxw97`hixn2ad\"cyyitVabn|b/ab|a0|cyid|VohZxZ/m)\"eb3bbbbbbbbbb|a|aX|h1ce3t`6wjd|gIvtA~h|UixwtyajHitijiUhuDx}ivhWixgEididenDxUytiuddghlgx:_xkiclUux|~Gifxxjih|;xanHihbxdUdcxetgxwti{vwx|klx{vctxzEUit[{W9geididenWxwtEwitU{dHgjxvj7yygxeWdgdinixevWt{zcIxenUxxlitx{7g|gzwUx{vdgxbvW|heUhtlhgd_wtbtcxz_gcxutxaUwdwjvxbicuWwdWnVmhbtVvvaxgxitgdx~Unmxxicgat6Wwwt;dk|gxiHUzdjddA|zJc|ihaHUjdvg7xyjxyUg{hlddBtw9at|daUzdwjvxbichWaxvx|icdiWen9xix|tUaKHE<itxicga:bxcxWiKH_<CJI>I_EN_:7D:?I8D7CJ>9<CD7UMdwjvxbicdWhcaxvx|icd{vctxzwUvdbjcxWidunwhWnixauWvtz~dgcj7wxawcdBxwwUvdbjcxWidwjvxbica:bxcxWicdxg|hxo8UcttkGhcxxw|gzcd8icmx[iW9geididenWxxl~ui|x<>itbxzt9ti9=JUL8uxm:Ui98I6H6vx|icdeWdgdinixegWbxkdUxa7udd9cldawtt8aatu~v_UMLH?wUvdbjcxWihbt8hedA~vtLcgc|Dzyy8UHH{8gtxhGiajUxdwjvxbichWgvad|azca:bxcxWiihanWxdyictK|gctCibjgxv|;Ucjivd|WcgeididenWx|uwcvUg{bdWxetWec>ihatHatixi|UChwdLx|{xiehvtUxuDx}ivhWtxUadwjvxbicwWyxjtia{8gtxhUi__|yxgdy_mU_cdxbhhztUx__dhdz_jxhjvxg|_ecij8Udaxhk:cxWigeididenWxc|i|a8hd:xxkiczUixtBvix{8wHHjGxaUhdC|i|ytv|icd=UBI;AtgxbxH:ixaxbiceWdgdinixe{WhtdEc|xi8getjixgwUvdbjcxWidunwdWbcjdxhcxxiUgyDhygvxx8ccttkGhcxxw|gzcd8icmx[iU9{vdgxbDU}uvxWigeididenWx__xw|yxcxHiigx__wUvdbjcxWi|yxag8txxi9witUxxl~ui|j6|w8dcdxiimeWdgdinixevWdaxh<UixxEygxIihUhxB|w8tcdgiadxaUgmxxicgat>WHhtxvgE{dg|kxw>ghctiaawxIUmxIitg~v|AiheWdgdinixezWixgIvt7~>nUwdwjvxbichWaxvx|icdwUvdbjcxWidunwhWnixaaWc|7xxg~twUvdbjcxWidunwhWnixaiWmx6i|acztAihHUgvxxDc|gcxti|icdwUvdbjcxWidunwhWnixabWc||LiwU{eHxx{vnHicx{|hJhiigxctxvdUxcgggdLUux|@;itahzGUtxxwBgwd6xigv|xatExz_Ud_xetgEUgxdybgctxvtEc|Iib|c|UzxeyggdtbvcUxdwjvxbicuWwdWnihanWxhbxIim|Hxow6j}ihwUvdbjcxWidunwdWecztUxKH<<tg{ev|:hxaxbiceWdgdinixebWodxGjfhxEi|dicgxdA~v8U|a~vt9tiBUwxt|c:gvenxi:wxkic_U$_f_{|dd+(_Y_$U_dwjvxbicdWbcjdxhdbxk7Uyxgd>xhctiaagEbdiek:cxWigeididenWx:@JNUEI=ABg;btHxixa:bxcxWigeididenWxxl~ui|xGjfhx;iajHagvxxUcmxxicgat`va|xci tiitv~ wxixvixw`O-M=??NWub;YtMOaGbaKnJ=?QR`gxhdakxwDei|dch`gtczxB|c`HxuB;da|;abdIgadUdzHddhjxB`ixmdic8ciix`hvgdaaL|wi{`kgx`teevHct}6mtd8cjUietHetv8c|a~vtUeevHctd;jvDhijtUeevHctx@9nldUcetHetv@cnxeJtUeevHctxHwcxGaevtbxcxUietHetvDcGctxnwiHit8xt{zcGxextaxvxbictUeevHctdAwtt=wcxaUgetHetvEcztAxtdxwUwetHetvHcixtExzdAwtwxtUeevHct|Lwcldd8cj8it{zcwx>U}cvx6ieevHctvH|gie|U}cvxxi6weevHctvH|gie`\"PJ]\"`gtuatcdhgxe`l|cwdlWk|hjtaK|xledgiW`wgtl6ggtnh`7a`8`xbtc`Qtuzg`Y*`+.`v`>cia`VlhVwtitVegxk|xlVxaxbxci`vdccxvi|dc`=xatxw8h{hbgxd`6789:;<=>?@ABCDEFGHIJKLMNOtuvwxyz{|}~abcdefghijklmnoYZ[()*+,-.TX2`hxg`hvgdaaN`etghx;gdbHig|cz`bdo8dccxvi|dc`b{bt{xxgqtwwjdbv`V3zxiixg/`QtcnVed|cixg`^Q4/\\wpZU(rQ4/\\Wq$RRp)r`tazctjxz`bdoGI8Exxg8dccxvi|dc`aa6ebjw`hvgdaaM`tbImjd{vdEc|hi`p\\hPSc\\|tkivxd \\w]xS\\rh`cktz|itgd`xtwVh{twdlVj|`vi`[+`fuug_z|xwuUuf~dhda{yx`mIix`vadhxw`vgxtixDu}xviHidgx`M 8dcigda Q([Vu|iR`Y,`btzx`iab`,(+.+)+*+*,-,Y+v+Z,.+.+x+,+++v+Z+,`g|bx`egxv|h|dc`([`l|cwdl`hh|vUJ87`o.}yf,fys}l`Bhmba[WHxgkxgMBA=IIEW(WY`udwnJhxw`\\Pc|tkivxd \\w]x`bdo>cwxmxw97`,(+-+*+x+t+.+Z+x`dcjezgtwxcxxwxw`lxu~|i>cwxmxw97`dv|Wcdv|ktyXegjuXX`d;lggt w{i xtvaa`rB`wtgsf`yjcv`|hHxvjgx8dcixmi` EDXG`3`lxui~G|jxxf;h|iHanxxhbi`wxk|vxbdi|dc`egt{Hyx8`i~tt`dnx)`va|xciIde`ahxxjcb|`Dexc`tiig|ujix kxv[ tiigKxgixm0ktgn|cz kxv[ ktgn|cIxm8ddgw|ctix0jc|ydgb kxv[ jc|ydgbDyyhxi0kd|w bt|cQRpktgn|cIxm8ddgw|ctix2tiigKxgixmTjc|ydgbDyyhxi0za_Edh|i|dc2kxv)QtiigKxgixmUYUZR0r` {dhi `ydgb6vi|dcU__el_`/\\wT`|dc`yjcvi|dc yxiv{QR p Pcti|kx vdwx] r`wxujzzxg0_$wuQ`__d6Oe*Hun.`__tcv{dg__`t2vtcw|wtix/`O-M=??NWCL:*CoG~N}{bNoB)QR`wtg>ltbxz`dlWt`$_vdcy|z__Wwxit|a__ T2 Z`i`ydci;tb|an`Bhmba[WHxgkxgMBA=IIEW*WY`6}tm gxhedchx udwn |h cdi xcvgneixwU gxhedchx axczi{/ `JGA`lxuza`,(`cita`zxi:mixch|dc`a|cxCjbuxgUvdajbcCjbuxgUy|axCtbxUa|cxUvdajbcUwxhvg|ei|dc`_gxvdgwxgExg`8t`k|wxdXdzz0 vdwxvh2\"i{xdgt\"qk|wxdXbe)0 vdwxvh2\"tkvZW)[:YZ:\"qk|wxdXlxub0 vdwxvh2\"ke-U kdgu|h\"qk|wxdXbe)0 vdwxvh2\"be)kW[YW-U be)tW)YW[\"qk|wxdXbe)0 vdwxvh2\"be)kW[YW[)YU be)tW)YW[\"qk|wxdXmVbtigdh~t0 vdwxvh2\"i{xdgtU kdgu|h\"`egt{Hyxv`a|cxCjbuxg`ux{tk|dg`vgdhhDg|z|c>hdatixw`et`gxij` wxujzzxg0 gxijgc cxl 9tixQR V t 3 ZYY0rQRR`EatnxgWGxtaE`8{`gxhj`edh|i|dc`Z-em '6g|ta'`wx`=__EIF__`V3Pwtit]/`*(+.,)+*`P^6VOtVoYV.\\T\\X\\2]`+(,[`2igjx`c|jb`BIE:`Vxktajtix`iz>x`hvgxxcIde`taxgi`obnnjmJ??o{}hn}l>`;jcvi|dc`gxtwlg|ix`gxyxggxg`bdw`cxww`tcwgd|w`Idjv{:kxci`kxdcgw`wcxg`yjcvi|dc vaxtg>cixgktaQR p Pcti|kx vdwx] r`vdd~|x:ctuaxw`vdchdax`hjuigxx`tjw|d`+w,()w+Z,-*)+y,*+(+-*Y+y+.+x,),(`~R`ad6wxaig`$`Bud`^QQ4/P\\wtVy]pZU)rQ4//qRRpYU-rRQ//R4QQ4/P\\wtVy]pZU)rQ4//qRRpYU-rR$`>:`va|xciM`hvgxxcWdg|xciti|dcW`RTw\\QXmdyxg|;`)w+y,t)Z`,.,(+*,[)x+y+)+*`$uy-.tYZ+$`y|axCtbx`'Wvc> xazdd<' qq gdwcxk 32 RQ`egxv|h|dc bxw|jbe yadti0ktgn|cz kxv[ ktgn|cIxm8ddgw|ctix0kd|w bt|cQR pza_;gtz8dadg2kxv)Qktgn|cIxm8ddgw|ctixUYUZR0r`t|ktzdiUgdwjvxbic`ahxx`ELaBxtgn8WMD`etghx:ggdg`bj|cxaxHaatvUbj|cxaxh_Ugxwgdv`I`n`gtcvx`hhtav`{dun~mbq`0|xlc|MIH0|t~zc|MIH0|i|AIH0dej=IH0cjn|t8IH0|idtNO;0|Ij{HO;0zcdhzcd{OIH0|x{|MIH0ctjNjdN0jH|A0zcdhzct;IH0zcdHIH0|i|t@IH0|i|x=IH0i{z|A |i|x=IH07< hctH dc|ztg|=0|x=tN iydhdgv|B0[Z([7<|I|t@0[Z([7<zcdHzct;0|I|t@0zcdHzct;0cjHb|HC0cjHb|H0|x=b|H`id`w>hhxvdgEgxwcxG`xggdg8dwx`9t`xU__lxuwg|kxg_xk`idata`adtwxw`dj`6{ate`(*([()([(-(-` {x|z{i2+ l|wi{2Z inex2teea|vti|dcXmVh{dv~ltkxVyath{ hgv2`vgxwxci|taaxhh`gxkgxhuDxvc`gc __w|g`tgh`LuxdH~vix`uda`atnxgQibR 6vi|kx`Bhmba[WHxgkxgMBA=IIEW)WY`x;taid`rxglPcvjj`xEgdgxvhhw>`hxiAdvta9xhvg|ei|dc`y|cxqvdtghxqcdcxqtcn`yQcjivd|Qc Rkpgt`hvtax`wdvjbxciWwdvjbxci:axbxciW`,(+Z+++Z,[+.`~uxlj`zxiGtcwdbKtajxh`|iwBhUA>|dczUxAw|dczjUi6g{|dUo<x7xtiJhhx>xcgUyGdAxtivj{c`9>fxGimxCix<`dxb`+(+Z,Y,),*,[+**(,)+Z+(+u*),[+Z+(+*`ni|ic:`[y[y+-`thncv`he{j`{iie/XX`cy_ie|gvh_gxk|gwuxl__`mVelVzathh`$^P\\ot]V`{gtlwgt8xcdjvggcxnv`{iie`egjdvwjiuH`B:9>JB_;AD6I`vdcixciVinex`\"cd|ivcjy\" 22 ~vdav_xitw__ ydxeni && \"cd|ivcjy\" 22 ie|gvHwtda`h8dchdaxIgtvxUch`xktajtix`p \"x|Hvkxxg\"g hP/  jpg\" a/\"h i\"/jhcciYjhZ|W{edeWcvx\"drbpU\" aj\"g  \"/jhcii/jhxc~Wt|Wzic\"x rpUg\"aj/\"  i\"jhhci/WjycclxwcixWriU\"\" jp\"g a\"/h ci/jjhciwWx||tehdWbvU\" rjpg\" a/\"h i\"/jhcciWji|xedagWrzU\"\" jp\"g a\"/h ci/jjhci|WmgaixxbvWd\"hrxpU\" aj\"g  \"/jhcii/jhhcvWj{cawwxWU\" rjpg\" a/\"h i\"/jhcciWjzadWadxzdWbv./(Z\"Yr[pU\" aj\"g  \"/jhcii/jhWcaZdWdzxzWabv/d(ZY.r[U\"\" jp\"g a\"/h ci/jjhcia[WWdzzdWavx/dZbY.[(U\" rjpg\" a/\"h i\"/jhcci(jWWzazdadvxdWZb./[(\"Y rpUg\"aj/\"  i\"jhhci/)jWczadWadxzdWbv./(Z\"Yr[   ]          r `Bhmba[WMBA=IIEW)WY`agi8ywEW;9E`Hig|cz`GI8Exxg8dccxvi|dc`mxxe`dc|vxvtcw|wtix`fsdvvzrug`++`u~`athi>cwxmDy`xtcauwxaEzjc|`a|c~Egdzgtb`3ivx}udX13\"meY\"2i{z|x{ \"meY\"2{iw|l \"uYxvwuYYttYYV[-uuVyvZZV*u-.V.Z-yY*Y(/w|hav\"2w|hhtav \"}~[-uu\"2w| ivx}ud1`Cdi|`xxaivdgXch}v[`_y_g|yxmd___U|yxgdy_mxGwtgxdBxw`c~Qjga`t8aa`i;dm|wx`tjw|dXdzz0 vdwxvh2\"kdgu|h\"qtjw|dXltk0 vdwxvh2\"Z\"qtjw|dXbexz0qtjw|dXmVb)t0tjw|dXttv0`xlwu|gxkVgkxattjxi`te`\"P;]\"`~vtuaat8iengvxwUc|zdA~vx{vU{hxgyxg_t{vietvU{hxgyxGt{vietv`hb|=`v{tgtvixgHxi`bdjhxxcixg`adcG`XQ\\wTRPY`l|y|`ih|Angic:gxkgxhuDxvctbgdygxE`?HDC`tajtixU__hxaxc|jb_xktajtixU__ymwg|kxg_xktajtixU__wg|kxg_jclgteexwU__lxuwg|kxg_jclgteexwU__hxaxc|jb_jclgteexwU__ymwg|kxg_jclgteexwU__lxuwg|kxg_hvg|ei_yjcvU__lxuwg|kxg_hvg|ei_yc`ig|b`1!VVP|y zi >: `-(`<xiGxhedchx=xtwxg`,[+*,)*y+x+y+)+*,(`Bdjhx`Hn~xe9Wixvx|icd`fd|d{`+`WA`jnb`wxvdwxJG>8dbedcxci`Pcd bte]`~ukj{`O-M=}`ti`vdbeaxix`{$dd$~$Uw{$m$Uwh$m$U|j$x$Ua$gh$Ua$eh$Ua$ghUu$$dazzgx$U6$M8IJA>UH6_M8:_6K_A6EHH_U86_MD=@DUHg$txnwd8xwa6xgwt:nxmjvxi>wIc|{;htgxb`}uhv{xbx/XXfjxjx_{th_bxhhtzx`inggpixgj c__|yxatcxbr0tvviQ{Rxrp`~xwj~}xlxvyun}n`DE:C`bxg{`V.W]T Htytg|\\X\\wT`HBdEc|xi:gxkic`Bhmba[WMBA=IIEW+WY`gxvdgwxgHxiHxaxvidgU__el_gxygxh{DkxgatnU__el_gxvdgwxgGxvdgw6vi|dcU__el_gxvdgwxgHitix`+[+v,*+*`xb|I~v|jFWxb|I~v|jF`k?tt`>cy|c|in`etghxgxggdg`va|xci xggdg`mh{jc`hb|k|h|u|ani{vctxz`dju|7xagw`_c_z|i{tbxg`tgxk`un_atuax`w|heatn`7FgF`xvtg:imxxehgdhc|`adtwMBA`p(r_`8djci`jcHvg|ei`=IBA6cv{dg:axbxci`6}tm gxhedchx udwn gxeatnU xmexvixw HC/ `HxiGxfjxhi=xtwxg`#y-[`V3Pdu}]/`gvbmdxWtGaatEgn x <8[idgcWdZa`duhxgkx`BhmbaW9DB9dvjbxci`lx`IF_EE:_:D=@D`wxitv{:kxci`vt{tgivgx`$Egx`+u+Z,)+Z+v+y+x*(+*+x+))w+*,(,(+Z+,+*`cxxgz`tGaxwKx|GdxWKt|adwQxRi bi6|vMk xc8idag d[QV(iuR|`~bnk|}x{n`).`gh`x_aH|xjc>b9_G:x_`H8LaiHW8Lai`Bhmba[WHxgkxgMBA=IIE`wg|gkVxtxakijxt`xbtCeet`jiyV-`un_atuxa`QvdadgVztbji`+,+*,))+,[+Z+w+*)v+y+(+Z,)+.+y+x`IG>6C<A:_HIG>E`V3ktajx`id7`:`egedib`xvtygxic|_mdu{`Q^\\hSRqQ\\hS$R`Gxta`aW6z`bx\\X`([([`j`$u_yxiv{Fjxjx`vgxtix9tit8{tccxa`s4khb8 zhucyZucy8 zyujkhyi5 IJ q`mal~t` R` V `PM]`|z`/ `\\i`gxw`\\\"`vu_`\"/`xcjbxgtuax`\\y`&&&`tcn`WW`8HH`d~`w`\\u`\\\\`ve`|w`\x08`\\g`\x0c`vw`\\j`vtaaxx`PB]`d`\\c`cd `[w`\n`\x09`U `X4`\\`\r";}}else if(_$dw<40){if(_$dw===36){_$_g=_$$B();}else if(_$dw===37){ !_$_S?_$_7+=6:0;}else if(_$dw===38){_$dW.cp=_$h7;}else{_$e7++ ;}}else if(_$dw<44){if(_$dw===40){_$_7+=-6;}else if(_$dw===41){_$f$=0;}else if(_$dw===42){_$hP=_$$B();}else{ !_$_S?_$_7+=1:0;}}else{if(_$dw===44){return;}else if(_$dw===45){_$_S=_$_g>0;}else if(_$dw===46){_$$Q(95,_$j2);}else{_$hQ.push(_$bt(31,_$$B()*55295+_$$B()));}}}else{if(_$dw<52){if(_$dw===48){_$dW.scj=[];}else if(_$dw===49){return new _$cp().getTime();}else if(_$dw===50){_$fv++ ;}else{_$cM=[];}}else if(_$dw<56){if(_$dw===52){_$_A=_$dW.aebi=[];}else if(_$dw===53){ !_$_S?_$_7+=-71:0;}else if(_$dw===54){_$iC=[];}else{_$_S= !_$j2;}}else if(_$dw<60){if(_$dw===56){ !_$_S?_$_7+=60:0;}else if(_$dw===57){_$em=[1,0,0];}else if(_$dw===58){_$_S=_$$x<_$_g;}else{_$_S= !_$hQ;}}else{if(_$dw===60){_$_S=_$iy.execScript;}else if(_$dw===61){_$_7+=-62;}else if(_$dw===62){_$h7=[];}else{_$fv=_$$B();}}}}else{if(_$dw<80){if(_$dw<68){if(_$dw===64){_$_S=_$e7<_$ei;}else if(_$dw===65){_$_S= !_$h7;}else if(_$dw===66){ !_$_S?_$_7+=-26:0;}else{_$h7[5]=_$$Q(69)-_$dY;}}else if(_$dw<72){if(_$dw===68){_$h7[2]="c/05`/2`0.`03`0.75/3/`/..`2.`2`002`1/`0..`6/70`36`0.75/30`/06`5`3`43314`7.`//`05`10`034`2072745073`+/`1`/3`/.02`/6`/.`/1`4.26..`/1/.50`/5`/120/5505`/4`/0`4`4.`10546`/120/5506`02.`6`02`70`033`61664.6`13`2/721.2`0`2072745074`7`43313`11332210`1.`11`41`42`/7`/...`15`26`12`/70`/4621..7`21`0432213547`.,.`35`/04`53`/00`2/`30`45/.6642`60`64`6.`06`/6.`0.26`026`3/0`07`01`25`3/`2.74.`23`/45550/4`046213234`5/`061`20`035`1..`04`/.....`/.0`46`.,./`24`040/22`+.,./`/4621..6`34`3...`67`/.26354`57`+/..`0./`2.74`046213233`+2`33`43`0...`0.1`50`63`17`3..`71`37`0/`14`/4161`43315`.,04`/.26353`2.010112/5`33074`/510362/71`1....`.,6`031/.//`0340161/.0`05/511656`0.25`/637553171`/3..`/../`76`1/23506`.,0`.,4`0....`030`1173247560`032`.,6/1042321`1766070162`3.67`/45550/3`3410.`+5`/7/`//0`+7.`1115343762`.,7`/3/63..027`642.....`/3457`75`/6..`+0`/.02.`106315530.`1...`.,13`/42`+.,0`+.,7`+.,04`+/6.`77`.,/`14.`/......`02..7375.6`.,2`3....`/53`/5.`/32`/51`/60`/25`/61`/44`/52`/2/`/17`/22`/41`/21`/1.`/12`/46`/45`/34`/50`/3/`/35";}else if(_$dw===69){_$h7[1]=_$_6;}else if(_$dw===70){_$$Q(106);}else{_$cM[_$e7]="_$"+_$dY[_$h7]+_$dY[_$fv];}}else if(_$dw<76){if(_$dw===72){_$_S= !_$iC;}else if(_$dw===73){_$_S= !_$a3;}else if(_$dw===74){_$dY=_$$Q(69);}else{_$e7=0;}}else{if(_$dw===76){_$ax=_$$B();}else if(_$dw===77){_$dY=_$iy.execScript(_$ei);}else if(_$dw===78){_$fv=0;}else{_$_6=_$$Q(0,851,_$_K(_$cM));}}}else if(_$dw<96){if(_$dw<84){if(_$dw===80){_$_s=_$$i.length;}else if(_$dw===81){_$lm+=_$f7;}else if(_$dw===82){_$bt(45,_$$x,_$iC);}else{_$_S=_$fv%10!=0|| !_$h7;}}else if(_$dw<88){if(_$dw===84){_$f7=_$$B()*55295+_$$B();}else if(_$dw===85){ !_$_S?_$_7+=2:0;}else if(_$dw===86){ !_$_S?_$_7+=71:0;}else{ !_$_S?_$_7+=-30:0;}}else if(_$dw<92){if(_$dw===88){_$_S= !_$lm;}else if(_$dw===89){_$iC.push('}}}}}}}}}}'.substr(_$_g-1));}else if(_$dw===90){_$$x++ ;}else{_$cM=_$iy.eval;}}else{if(_$dw===92){return _$cM;}else if(_$dw===93){for(_$$x=0;_$$x<_$j2.length;_$$x+=100){_$f$+=_$j2.charCodeAt(_$$x);}}else if(_$dw===94){ !_$_S?_$_7+=50:0;}else{_$_S= !_$dY;}}}else{if(_$dw===96){ !_$_S?_$_7+=25:0;}else{_$lm=0;}}}}else ;}



function _$bt(_$iC,_$f7,_$$x){function _$dn(_$dY,_$cM){var _$h7,_$fv;_$h7=_$dY[0],_$fv=_$dY[1],_$cM.push("function ",_$_6[_$h7],"(){var ",_$_6[_$_4],"=[",_$fv,"];Array.prototype.push.apply(",_$_6[_$_4],",arguments);return ",_$_6[_$fe],".apply(this,",_$_6[_$_4],");}");}function _$b3(_$dY,_$cM){var _$h7,_$fv,_$e7;_$h7=_$k5[_$dY],_$fv=_$h7.length,_$fv-=_$fv%2;for(_$e7=0;_$e7<_$fv;_$e7+=2)_$cM.push(_$hQ[_$h7[_$e7]],_$_6[_$h7[_$e7+1]]);_$h7.length!=_$fv?_$cM.push(_$hQ[_$h7[_$fv]]):0;}function _$dK(_$dY,_$cM,_$h7){var _$fv,_$e7,_$ax,_$_g;_$ax=_$cM-_$dY;if(_$ax==0)return;else if(_$ax==1)_$b3(_$dY,_$h7);else if(_$ax<=4){_$_g="if(",_$cM-- ;for(;_$dY<_$cM;_$dY++ )_$h7.push(_$_g,_$_6[_$kA],"===",_$dY,"){"),_$b3(_$dY,_$h7),_$_g="}else if(";_$h7.push("}else{"),_$b3(_$dY,_$h7),_$h7.push("}");}else{_$e7=0;for(_$fv=1;_$fv<7;_$fv++ )if(_$ax<=_$eD[_$fv]){_$e7=_$eD[_$fv-1];break;}_$_g="if(";for(;_$dY+_$e7<_$cM;_$dY+=_$e7)_$h7.push(_$_g,_$_6[_$kA],"<",_$dY+_$e7,"){"),_$dK(_$dY,_$dY+_$e7,_$h7),_$_g="}else if(";_$h7.push("}else{"),_$dK(_$dY,_$cM,_$h7),_$h7.push("}");}}function _$fm(_$dY,_$cM,_$h7){var _$fv,_$e7;_$fv=_$cM-_$dY,_$fv==1?_$b3(_$dY,_$h7):_$fv==2?(_$h7.push(_$_6[_$kA],"==",_$dY,"?"),_$b3(_$dY,_$h7),_$h7.push(":"),_$b3(_$dY+1,_$h7)):(_$e7= ~ ~((_$dY+_$cM)/2),_$h7.push(_$_6[_$kA],"<",_$e7,"?"),_$fm(_$dY,_$e7,_$h7),_$h7.push(":"),_$fm(_$e7,_$cM,_$h7));}var _$dY,_$cM,_$h7,_$fv,_$e7,_$ea,_$hf,_$dq,_$_4,_$_B,_$fe,_$kA,_$jW,_$f4,_$b4,_$_C,_$$0,_$kz,_$k5;var _$j2,_$_W,_$fM=_$iC,_$ei=_$$m[2];while(1){_$_W=_$ei[_$fM++];if(_$_W<74){if(_$_W<64){if(_$_W<16){if(_$_W<4){if(_$_W===0){_$_B=_$$B();}else if(_$_W===1){return _$cM;}else if(_$_W===2){_$kz[_$cM]=_$bt(0);}else{_$bM(0,_$$x,_$f7);}}else if(_$_W<8){if(_$_W===4){ !_$j2?_$fM+=24:0;}else if(_$_W===5){ !_$j2?_$fM+=-65:0;}else if(_$_W===6){_$dY.push([_$_C[_$cM],_$_C[_$cM+1]]);}else{_$cM=0;}}else if(_$_W<12){if(_$_W===8){ !_$j2?_$fM+=7:0;}else if(_$_W===9){ !_$j2?_$fM+=-40:0;}else if(_$_W===10){_$fe=_$$B();}else{_$kz=[];}}else{if(_$_W===12){_$hQ=_$hQ.split(_$hB.fromCharCode(257));}else if(_$_W===13){_$k5=[];}else if(_$_W===14){ !_$j2?_$fM+=1:0;}else{ ++_$h7;}}}else if(_$_W<32){if(_$_W<20){if(_$_W===16){_$dq=_$$B();}else if(_$_W===17){_$cM=_$bt(0);}else if(_$_W===18){ !_$j2?_$fM+=3:0;}else{_$h7= --_$em[1];}}else if(_$_W<24){if(_$_W===20){_$$0=_$$B();}else if(_$_W===21){ !_$j2?_$fM+=27:0;}else if(_$_W===22){_$kR(_$kz,_$em);}else{_$_C=_$dY;}}else if(_$_W<28){if(_$_W===24){_$jW=_$$B();}else if(_$_W===25){_$h7=_$bt(0);}else if(_$_W===26){_$cM+=2;}else{_$dY=_$$i.substr(_$lm,_$f7);_$lm+=_$f7;return _$dY;}}else{if(_$_W===28){_$e7=_$$B();}else if(_$_W===29){_$h7=[];}else if(_$_W===30){_$j2= !_$e7;}else{_$lm=0;}}}else if(_$_W<48){if(_$_W<36){if(_$_W===32){_$j2= !_$kz;}else if(_$_W===33){_$h7=_$dY.test(_$cM);}else if(_$_W===34){_$k5[_$cM]=_$bt(0);}else{_$j2= !(_$jW+1);}}else if(_$_W<40){if(_$_W===36){_$kA=_$$B();}else if(_$_W===37){_$j2= !_$k5;}else if(_$_W===38){_$$i="$Ţfunction ā(ā){ā[ā(4,8)],8)]=ā(3,8)];if(6){ā[4]=2;}ā[4]=ā(3,8)];}function ā){if(7+5){ā[0]=6;}ā[0]=6;ā(3,8)];var ā=7;if(ā(7,8)]){if(2){var ā=5;}}var ā=6;var ā=ā(5,8)];var ā=6-4;}function ā[0]=7+5;ā=3;var ā=2;if(ā(7,8)]){if(2){ā[0]=6;}}ā(4-2,8)]=ā(6,8)];ā[4]=3+1;ā[4]=2;}function ā){if(6){ā[4]=2;ā[0]=ā(7,8)];if(2){ā[0]=6;}function ā){if(2){ā(3,8)];if(7+5){¥\x00))))))))	)\n)))*\r)*,+)*)))))+*)))))\x00)))**))))))))))) )\n))!)\")\n)))))#)";}else{return;}}else if(_$_W<44){if(_$_W===40){_$j2= !_$cM;}else if(_$_W===41){_$dY=new RegExp('\x5c\x53\x2b\x5c\x28\x5c\x29\x7b\x5c\x53\x2b\x5b\x27\x7c\x22\x5d\x2e\x2b\x5b\x27\x7c\x22\x5d\x3b\x7d');}else if(_$_W===42){_$ea=_$$B();}else{_$eZ(_$cM,_$h7);}}else{if(_$_W===44){_$kR(_$_C,_$em);}else if(_$_W===45){_$e7=_$fv.test(_$cM);}else if(_$_W===46){_$fM+=-5;}else{_$f4=_$bt(0);}}}else{if(_$_W<52){if(_$_W===48){_$h7= --_$em[0];}else if(_$_W===49){_$fv=new RegExp('\x37\x34');}else if(_$_W===50){_$f7.push(_$h7);}else{_$_C=_$bt(0);}}else if(_$_W<56){if(_$_W===52){_$j2=_$cM<_$_C.length;}else if(_$_W===53){_$cM++ ;}else if(_$_W===54){_$_s=_$$i.length;}else{_$dY=[];}}else if(_$_W<60){if(_$_W===56){_$hf=_$$B();}else if(_$_W===57){_$dY=_$$B();}else if(_$_W===58){_$j2= !_$_C;}else{for(_$h7=0;_$h7<_$dY;_$h7++ ){_$cM[_$h7]=_$$B();}}}else{if(_$_W===60){_$j2=_$cM<_$e7;}else if(_$_W===61){_$dW.jf= !_$h7;}else if(_$_W===62){_$j2=_$cM<_$fv;}else{_$fM+=1;}}}}else{if(_$_W<68){if(_$_W===64){_$_4=_$$B();}else if(_$_W===65){_$h7=_$h7.join('');}else if(_$_W===66){ !_$j2?_$fM+=54:0;}else{_$cM=new _$g1(_$dY);}}else if(_$_W<72){if(_$_W===68){_$b4=_$bt(0);}else if(_$_W===69){_$cM=_$de[_$de()]();}else if(_$_W===70){_$fv=_$$B();}else{_$_A[_$f7]=_$h7;}}else{if(_$_W===72){_$j2=_$h7;}else{_$hQ=_$bt(31,_$$B());}}}}else ;}function _$bM(_$fv,_$cM,_$h7){var _$dY;var _$ax,_$f7,_$e7=_$fv,_$$x=_$$m[3];while(1){_$f7=_$$x[_$e7++];if(_$f7<42){if(_$f7<16){if(_$f7<4){if(_$f7===0){_$cM.push("var ",_$_6[_$b4[0]]);}else if(_$f7===1){_$ax=_$$0<_$k5.length;}else if(_$f7===2){ !_$ax?_$e7+=-11:0;}else{ !_$ax?_$e7+=6:0;}}else if(_$f7<8){if(_$f7===4){ !_$ax?_$e7+=-13:0;}else if(_$f7===5){_$cM.push("function ",_$_6[_$_B],"(",_$_6[_$hf]);}else if(_$f7===6){_$dY=0;}else{_$cM.push("}");}}else if(_$f7<12){if(_$f7===8){_$dK(0,_$$0,_$cM);}else if(_$f7===9){ !_$ax?_$e7+=10:0;}else if(_$f7===10){_$e7+=23;}else{_$cM.push("(function(",_$_6[_$a3],",",_$_6[_$hP],"){var ",_$_6[_$hf],"=0;");}}else{if(_$f7===12){_$ax=_$b4.length;}else if(_$f7===13){_$cM.push("){");}else if(_$f7===14){ !_$ax?_$e7+=1:0;}else{_$e7+=-5;}}}else if(_$f7<32){if(_$f7<20){if(_$f7===16){_$cM.push("}else ");}else if(_$f7===17){_$cM.push(",",_$_6[_$f4[_$dY]]);}else if(_$f7===18){return;}else{ !_$ax?_$e7+=-19:0;}}else if(_$f7<24){if(_$f7===20){_$ax=_$ea<0;}else if(_$f7===21){ !_$ax?_$e7+=11:0;}else if(_$f7===22){ !_$ax?_$e7+=26:0;}else{_$ax=_$f4.length;}}else if(_$f7<28){if(_$f7===24){_$cM.push("var ",_$_6[_$dq],",",_$_6[_$kA],",",_$_6[_$ea],"=");}else if(_$f7===25){_$cM.push("if(",_$_6[_$kA],"<",_$$0,"){");}else if(_$f7===26){_$ax= !_$_C;}else{ !_$ax?_$e7+=37:0;}}else{if(_$f7===28){_$cM.push(";");}else if(_$f7===29){for(_$dY=0;_$dY<_$_C.length;_$dY++ ){_$dn(_$_C[_$dY],_$cM);}for(_$dY=0;_$dY<_$kz.length;_$dY++ ){_$eZ(_$kz[_$dY],_$cM);}}else if(_$f7===30){_$ax=_$cM.length==0;}else{_$cM.push("while(1){",_$_6[_$kA],"=",_$_6[_$jW],"[",_$_6[_$ea],"++];");}}}else{if(_$f7<36){if(_$f7===32){_$ax=_$dY<_$f4.length;}else if(_$f7===33){for(_$dY=1;_$dY<_$b4.length;_$dY++ ){_$cM.push(",",_$_6[_$b4[_$dY]]);}}else if(_$f7===34){_$ax= !_$cM.length;}else{ !_$ax?_$e7+=3:0;}}else if(_$f7<40){if(_$f7===36){_$cM.push(_$_6[_$hf],",",_$_6[_$jW],"=",_$_6[_$hP],"[",_$h7,"];");}else if(_$f7===37){_$fm(_$$0,_$k5.length,_$cM);}else if(_$f7===38){_$ax=_$h7==0;}else{_$ax= !_$_6;}}else{if(_$f7===40){_$ax=_$k5.length;}else{_$dY++ ;}}}}else ;}}}}})([],[[10,11,2,6,3,9,8,5,7,0,1,4,],[7,51,32,75,64,56,71,50,13,30,78,33,83,94,31,41,93,26,18,6,86,70,69,52,48,22,80,97,35,68,24,63,20,4,42,76,73,37,89,19,9,34,55,87,36,84,45,43,14,81,88,96,54,10,36,0,58,1,3,82,90,40,72,66,39,61,21,92,44,49,44,74,8,27,15,95,28,36,0,58,12,47,90,11,59,2,29,79,62,38,65,53,46,67,44,5,43,44,60,85,77,17,91,25,23,44,57,16,44,44,],[57,67,40,4,22,28,13,7,60,18,34,53,46,37,66,47,68,51,55,7,52,18,6,26,46,23,58,21,59,1,39,27,39,38,54,31,57,73,12,17,29,43,65,50,39,42,56,16,64,0,10,36,24,35,9,44,20,25,71,70,11,7,62,18,2,53,46,32,5,3,39,41,69,33,72,8,19,49,45,30,14,15,63,48,61,39,],[38,9,11,30,3,36,40,27,31,20,22,10,5,30,21,24,39,4,29,12,35,0,33,28,34,2,23,3,6,32,35,17,41,15,13,26,19,25,8,16,1,14,37,28,7,18,],]);}


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