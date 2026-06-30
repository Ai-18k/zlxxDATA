
console.log=function (){}

// var _content="46pY_8i4bOeJyMuk6gKVIkZC3BWWwECFhlozHFD1PwYyTizOG_a.xg3u14e9mqpTjupstYJgLHxuSMGILpYp8a"
// var corsToken="CfDJ8B0eQl1Nb3NGrYITqvSclwfWoRXY-c4l2LcaRz7HOupmWr0NKiRudhGDRvsHPH8XOtFy4qXb-9jjZGcIerMmWTzgqK1Uqs6Fm4qIsFB6ubzAxu3xUNSb203AGOjb0twCU2l0oTdcvvnPoCArgH1CHCM"
var _content='"content_code"'
var corsToken='"auth_token"'


global.process = undefined;
global.dirname = undefined;
global.__filename = undefined;
global.globalthis = undefined;
_null = function () {
  console.log(arguments);
};

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
const obj_toString = (func, name) => {
    Object.defineProperty(func, 'name', { value: name || func.name, configurable: true });
    func.toString = function() { return `function ${name || func.name}() { [native code] }`; };
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
    this.canvas=canvas1.createCanvas(300, 150);
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
    this.canvas=canvas1.createCanvas(300, 150);
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
window.CanvasRenderingContext2D = HTMLCanvasElement;
function HTMLCanvasElement() { 
    this.getContext = function(args) {
        console.log('打印document.createElement("canvas").getContext("' + args + '")');
        if (args == "webgl") {
            webgl = watch(new WebGLRenderingContext(), "WebGLRenderingContext");
            obj_toString(webgl, "WebGLRenderingContext");
            return webgl;
        }
        if (args == "2d") {
            Context2 = watch(new CanvasRenderingContext2D(), "CanvasRenderingContext2D");
            obj_toString(Context2, "CanvasRenderingContext2D");
            return Context2;
        }
    };
    this.setAttribute = function(args) { 
        console.log("打印： setAttribut()是否入参", args);
    };
    this.getAttributeNames = function(args) { 
        console.log("打印： getAttributeNames()是否入参", args);
    };
    this.toDataURL = function(args) { 
        console.log("打印： toDataURL()是否入参", args);
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAF2UlEQVR4AezU227bOhAFUOP8/0efvDhokNiWRJGcyyoKtLElcmbtYP/38IcAAQJJBBRWkqCMSYDA46Gw/BYQIJBGQGGliWp8UCcQyC6gsLInaH4CjQQUVqOwrUogu4DCyp6g+Qn8JVD0M4VVNFhrEagooLAqpmonAkUFFFbRYK1FoKKAwvorVZ8RIBBSQGGFjMVQBAj8JaCw/lLxGQECIQUUVshYDLVOwE2ZBBRWprTMSqC5gMJq/gtgfQKZBBRWprTMSqC5wGBhNdezPgECSwUU1lJulxEgMCKgsEb0vEuAwFIBhbWUO/VlhiewXUBhbY/AAAQIHBVQWEelPEeAwHYBhbU9AgMQiCcQdSKFFTUZcxEg8EtAYf0i8QEBAlEFFFbUZMxFgMAvAYX1i2T8AycQIDBHQGHNcXUqAQITBBTWBFRHEiAwR0BhzXF1ahcBey4VUFhLuV1GgMCIgMIa0fMuAQJLBRTWUm6XESAwIrC3sEYm9y4BAu0EFFa7yC1MIK+AwsqbnckJtBNQWO0i37WwewmMCyiscUMnECCwSEBhLYJ2DQEC4wIKa9zQCQQI/BSY9pPCmkbrYAIE7hZQWHeLOo8AgWkCCmsarYMJELhbQGHdLTp+nhMIEHghoLBewPiYAIF4AgorXiYmIkDghYDCegHjYwIrBNxxTkBhnfPyNAECGwUU1kZ8VxMgcE5AYZ3z8jQBAhsFUhfWRjdXEyCwQUBhbUB3JQEC1wQU1jU3bxEgsEFAYW1Ad+UFAa8Q+BJQWF8I/hIgkENAYeXIyZQECHwJKKwvBH8JEIgk8HoWhfXaxjcECAQTUFjBAjEOAQKvBRTWaxvfECAQTEBhBQtkfBwnEKgroLDqZmszAuUEFFa5SC1EoK6Awqqbrc3qC7TbUGG1i9zCBPIKKKy82ZmcQDsBhdUucgsTyCvQubDypmZyAk0FFFbT4K1NIKOAwsqYmpkJNBVQWE2D77a2fWsIKKwaOdqCQAsBhdUiZksSqCGgsGrkaAsCLQQOFVYLCUsSIBBeQGGFj8iABAg8BRTWU8K/BAiEF1BY4SNaPKDrCAQWUFiBwzEaAQI/BRTWTw8/ESAQWEBhBQ7HaATmCuQ7XWHly8zEBNoKKKy20VucQD4BhZUvMxMTaCugsC5H70UCBFYLKKzV4u4jQOCygMK6TOdFAgRWCyis1eLuyyhg5iACCitIEMYgQOCzgML6bOQJAgSCCCisIEEYgwCBzwIrCuvzFJ4gQIDAAQGFdQDJIwQIxBBQWDFyMAUBAgcEFNYBJI8cF/AkgZkCCmumrrMJELhVQGHdyukwAgRmCiismbrOJlBZYMNuCmsDuisJELgmoLCuuXmLAIENAgprA7orCRC4JqCwrrmNv+UEAgROCyis02ReIEBgl4DC2iXvXgIETgsorNNkXiBwVsDzdwkorLsknUOAwHQBhTWd2AUECNwloLDuknQOAQLTBRIU1nQDFxAgkERAYSUJypgECDweCstvAQECaQQUVpqoWgxqSQJvBRTWWx5fEiAQSUBhRUrDLAQIvBVQWG95fEmAwCyBK+cqrCtq3iFAYIuAwtrC7lICBK4IKKwrat4hQGCLgMLawj5+qRMIdBRQWB1TtzOBpAIKK2lwxibQUUBhdUzdzrkETPstoLC+KfyHAIHoAgorekLmI0DgW0BhfVP4DwEC0QXqF1b0BMxHgMBhAYV1mMqDBAjsFlBYuxNwPwEChwUU1mEqD8YXMGF1AYVVPWH7ESgkoLAKhWkVAtUFFFb1hO1HoJDAP4VVaCurECBQUkBhlYzVUgRqCiismrnaikBJAYVVMtaPS3mAQEoBhZUyNkMT6CmgsHrmbmsCKQUUVsrYDE3guEClJxVWpTTtQqC4gMIqHrD1CFQSUFiV0rQLgeICCutDwL4mQCCOgMKKk4VJCBD4IKCwPgD5mgCBOAIKK04WJtkt4P7wAgorfEQGJEDgKaCwnhL+JUAgvIDCCh+RAQkQeAr8DwAA//+Cw3OPAAAABklEQVQDAOx/AS0pote3AAAAAElFTkSuQmCC';
    };
    this.style = styles;
}
window.HTMLCanvasElement = HTMLCanvasElement;
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

function HTMLAnchorElement(){
    this.protocol='http:'
    this.hostname='epub.cnipa.gov.cn'
    this.port=''
    this.pathname='/Dxb/PageQuery/'
    this.search=''
    this.style = styles;
}
HTMLAnchorElement.prototype.addEventListener=function(type, listener) {
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
HTMLFormElement.prototype.querySelector = function querySelector(selector) {
    console.log('打印：HTMLFormElement.querySelector("' + selector + '")');
    if (selector === 'input[name="__RequestVerificationToken"]') {
        return corsToken

    }

    debugger;
};
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
                { type: "text/javascript", r: "m", innerHTML: "ts_code"},
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
        }, 20); // 间隔触发
    });
}
function Navigator() {}
Navigator.prototype.appVersion =
  "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36";
Navigator.prototype.appCodeName = "Win32";
Navigator.prototype.platform = "Win32";
Navigator.prototype.vendor = "Google Inc.";
Navigator.prototype.userAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36";
Navigator.prototype.language = "zh-CN";
Navigator.prototype.mimeTypes = [];
Navigator.prototype.maxTouchPoints = 0;
Navigator.prototype.getBattery = function() {
  console.log("打印：navigator.getBattery()");
  return new Promise(function(yes,no){
    yes (watch({}, "navigator.getBattery()"));
  });
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
function Storage() {}
Storage.prototype.removeItem = function (key, value) {
  console.log('打印：localStorage.removeItem("' + args + '")');
  this[key] = value;
};
Storage.prototype.getItem = function (key, value) {
  console.log('打印：localStorage.getItem("' + args + '")');
  this[key] = value;
};
Storage.prototype.setItem = function (key, value) {
  console.log('打印：localStorage.setItem("' + key + '", "' + value + '")');
  this[key] = value;
};
localStorage = new Storage();
Object.setPrototypeOf(localStorage, Storage.prototype);
obj_toString(localStorage, "Storage");
window.sessionStorage = localStorage;

Object.setPrototypeOf(window.performance, Performance.prototype);
obj_toString(window.performance, "Performance");

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


// window.document = document;
// (function() {
//     // 保存原始函数
//     const originalFunction = Function;
//     const originalEval = eval;
    
//     // // 通用的反调试检查函数
//     function isAntiDebugCode(code) {
//         if (typeof code !== 'string') return false;
//         return code.includes('debugger') || 
//                code.includes('new Date() - a > 100') ||
//                code.includes('setTimeout') ||
//                code.includes('setInterval') ||
//                code.includes('performance.now');
//     }
    
//     // // 重写 Function 构造函数
//     // Function = function(...args) {
//     //     const lastArg = args[args.length - 1];
//     //     if (isAntiDebugCode(lastArg)) {
//     //         console.log("Blocked anti-debugger in Function constructor:", lastArg);
//     //         return function() { return false; };
//     //     }
//     //     return originalFunction.apply(this, args);
//     // };

//     // // 重写 Function.prototype.constructor
//     // const originalConstructor = Function.prototype.constructor;
//     // Function.prototype.constructor = function(...args) {
//     //     if (args.length > 0 && isAntiDebugCode(args[0])) {
//     //         console.log("Blocked anti-debugger in Function.constructor:", args[0]);
//     //         return function() { return false; };
//     //     }
//     //     return originalConstructor.apply(this, args);
//     // };

//     // 重写 eval 函数
//     eval = function(code) {
//         // if (isAntiDebugCode(code)) {
//         //     console.log("Blocked anti-debugger in eval:", code);
//         //     return false;
//         // }
//         return originalEval(code.replaceAll("debugger",""));
//     };
    
    // 设置正确的原型和属性
    // Function.prototype.toString = originalFunction.toString.bind(originalFunction);
// })();

// ==================== 1. 在 require 之前：完整初始化 XHR 骨架 ====================
function XMLHttpRequest() {
    this.readyState = 0;
    this.status = 0;
    this.responseText = "";
    this.responseType = "";
    // 可以根据需要用 watch 包裹实例
    return watch(this, "XMLHttpRequest_instance");
}

var urlsuffix
// 补充标准的现代浏览器 XHR 原型链方法
XMLHttpRequest.prototype.open = function(method, url, async) {
    // 留空，等待瑞数脚本来重写它
    console.log(`[Native Call] 原始 open 被调用: ${method} -> ${url}`);
    let regex = /OWNRL2Cu=([A-Za-z0-9._-]+)/;
    let match =  arguments[1].match(regex);
    console.log("[Native Call] 匹配到的后缀: ",match[1]);
    window._url = match[1];
    // urlsuffix
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

// ==================== 3. 在后面：正确的后缀提取函数 ====================
function get_suffix(method, url, data) {
    // 【关键】此时的 window.XMLHttpRequest.prototype.open 已经是被瑞数魔改过的函数了
    // 我们不能直接覆盖它，而是通过动态“偷窥”它的入参来获取后缀
    
    const originalRuisuOpen = window.XMLHttpRequest.prototype.open;
    
    // 临时 Hook 瑞数加密后的 open，用来拦截最终拼接好的 URL
    window.XMLHttpRequest.prototype.open = function(insideMethod, insideUrl, ...args) {
        console.log('\n================ 后缀抓取成功 ================');
        console.log('加密系统实际生成的请求方法:', insideMethod);
        console.log('加密系统实际生成的完整URL（含后缀）:', insideUrl);
        console.log('=============================================\n');
        
        // 恢复成瑞数的函数，避免无限递归或污染
        window.XMLHttpRequest.prototype.open = originalRuisuOpen;
        
        // 如果不需要真正发出请求，可以直接 return；如果需要继续，就 call 瑞数的方法
        return originalRuisuOpen.apply(this, [insideMethod, insideUrl, ...args]);
    };

    // 【关键】必须真正实例化并调用，才能激活瑞数的逻辑！
    const xhr = new window.XMLHttpRequest();
    xhr.open(method, url, true); 
    // 如果后缀是在 send 时生成的（部分反爬会加在 post body 里或 Headers 里），还要调用 send：
    // xhr.send(data);
}
// ==================== 4. 测试调用 ====================
var cookies = async function () {  
    function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
    try {
        await sleep(1000);
        var n = document.cookie;
        
        // 触发具体的请求，从而捕获后缀
        get_suffix('POST', 'http://epub.cnipa.gov.cn/Dxb/PageQuery', '{"pageIndex":1}');

        return n;
    } catch (error) {
        console.error('cookie读取错误:', error);
        throw error;
    }
};

async function test() {
    const result = await cookies();
    return result
}

function get_cookie() {
    test().then(cookie => {
    // console.log('[#####] cookie=> ',cookie);
    // return cookie;
        console.debug(cookie);
});
};
get_cookie()

function get_url(){
    var r = new XMLHttpRequest;
    r.open("POST", "/Dxb/PageQuery", true, undefined, undefined)
    // return window._url
    console.debug(window._url.replace("undefined",""));

}
get_url()

//
// (async () => {
//     const cookie = await get_cookie();
//     console.log('cookie=>', cookie)
// })();


// function get_suffix(method,url) {
//
//     xhr.open = function(method, url) {
//         req_url = url;
//         console.log('打印：xhr.open("' + method + '", "' + url + '")');
//         return {};
//     };
// }


// // 你的那一长串 POST 参数体
// const postBody = "searchCatalogInfo.Pubtype=1&searchCatalogInfo.Ggr_Begin=&searchCatalogInfo.Ggr_End=&searchCatalogInfo.Pd_Begin=&searchCatalogInfo.Pd_End=&searchCatalogInfo.An=&searchCatalogInfo.Pn=&searchCatalogInfo.Ad_Begin=&searchCatalogInfo.Ad_End=&searchCatalogInfo.E71_73=%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4&searchCatalogInfo.E72=%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4&searchCatalogInfo.Edz=%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4&searchCatalogInfo.E51=&searchCatalogInfo.Ti=%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4&searchCatalogInfo.Abs=%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4&searchCatalogInfo.Edl=%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4&searchCatalogInfo.E74=%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4&searchCatalogInfo.E30=&searchCatalogInfo.E66=&searchCatalogInfo.E62=&searchCatalogInfo.E83=&searchCatalogInfo.E85=&searchCatalogInfo.E86=&searchCatalogInfo.E87=&pageModel.pageNum=2&pageModel.pageSize=3&sortFiled=ggr_desc&searchAfter=20260515%3B2024116305056&showModel=1&isOr=True&__RequestVerificationToken=CfDJ8GGednQOsIdApgbnJzxrfmrWz2HrodXWKOEAZBjoamHq8sFwbxFHHPqHU__2kMcWYfvW08B22w3Mj9zmqNd_Y-Vq0hiAakK7cdmghIF9nKkiBhoSjooPvP2ZV5G8TJ-ltGM4mxEvdnOGf9f6ReerIxc";

// // 执行生成
// get_suffix( 'POST', 'http://epub.cnipa.gov.cn/Dxb/PageQuery');

