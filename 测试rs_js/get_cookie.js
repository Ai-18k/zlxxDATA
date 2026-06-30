


var content="content_code"
// var content="W5zxfXzYthwZZNPp6Fce4j1eNwd9GG1b5uwMH1p0r68nQKut8c1meT8YxtM6rQWDRol0BrsCpUXo1VHIqnQMZG"

const canvas1 = require('canvas');

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
Window.prototype.XMLHttpRequest = function (args) {
  console.log('打印：window.XMLHttpRequest("' + args + '")');
}
Window.prototype.DOMParser = function (args) {
  console.log('打印：window.DOMParser("' + args + '")');
}

Window.prototype.attachEvent = function (args) {
  console.log('打印：window.attachEvent("' + args + '")');
}
window.MutationObserver = function(callback) {
    console.log('[RS6] new MutationObserver');

    this._callback = typeof callback === 'function' ? callback : null;

    this.observe = function(target, options) {
        console.log('[RS6] MutationObserver.observe', target?.nodeName, options);

        // 模拟触发 1~2 次空数组（很多 RS6 站点会多次调用）
        if (this._callback) {
            setTimeout(() => this._callback([], this), 0);
            setTimeout(() => this._callback([], this), 0);   // 多一次
        }
    };

    this.disconnect = function() { console.log('[RS6] disconnect'); };
    this.takeRecords = function() { return []; };
};

window.WebKitMutationObserver = window.MutationObserver;

window.IntersectionObserver = function(callback) {
        console.log('[RS6] new IntersectionObserver');
        this.observe = function() {
            if (typeof callback === 'function') {
                setTimeout(() => callback([], this), 0);   // 空 entries
            }
        };
        this.disconnect = function() {};
        this.unobserve = function() {};
};
Window.prototype.webkitRequestFileSystem = function (args) {
  console.log('打印：window.webkitRequestFileSystem("' + args + '")');
}
function IDBFactory() {};
window.indexedDB = new IDBFactory();
function BarProp(){
    this.visible=true
}
Window.prototype.locationbar=new BarProp();
Window.prototype.scrollbars=new BarProp();
Window.prototype.personalbar=new BarProp();
Window.prototype.toolbar=new BarProp();
Window.prototype.statusbar=new BarProp();
window.devicePixelRatio=1.25
window.innerWidth = 1536;
window.innerHeight = 750;      // 留出合理空间

window.outerWidth = 1536;
window.outerHeight = 860;      // 比 inner 大约多 100-110px
window.TEMPORARY = 0;

Object.setPrototypeOf(window,Window.prototype)
obj_toString(window, "Window")

// 完整的事件系统实现
function EventTarget(type, eventInitDict) {
    this.type = type;
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




function CSSStyleDeclaration() {
  this.cssText = "";
  this.length = 0;
}

styles = watch(new CSSStyleDeclaration(), "CSSStyleDeclaration");
function HTMLHeadElement() {
  this.baseURI = "http://epub.cnipa.gov.cn/Gb";
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
        return 'data:image/png;base64,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';
    };
    this.style = styles;
}
window.CanvasRenderingContext2D=new CanvasRenderingContext2D()
window.HTMLCanvasElement= new HTMLCanvasElement()



function HTMLDivElement() {

}
HTMLDivElement.prototype.getElementsByTagName = function getElementsByTagName(tagName) {
    console.log('打印：document.createElement("div").getElementsByTagName("' + tagName + '")')
    if (tagName === "i") {
        return [];
    }

}
function HTMLScriptElement() {
    this.baseURI = "http://epub.cnipa.gov.cn";
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
    this.baseURI = "http://epub.cnipa.gov.cn";
    this.localName = "meta";
    this.namespaceURI = "http://www.w3.org/1999/xhtml";
    this.tagName = "META";
    this.nodeType = 1;
    this.content = content;
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

function HTMLFormElement() {
  this.action= "http://epub.cnipa.gov.cn/";
  this.method = "get";
  this.outerHTML='<form></form>'
}
function HTMLInputElement() {
  this.baseURI= "http://epub.cnipa.gov.cn/";
  this.outerHTML='<input></input>';
}
function HTMLAnchorElement(){
    this.baseURI= "http://epub.cnipa.gov.cn/";
    this.outerHTML='<a></a>';
    this.protocol=':'
    this.hostname=''
    this.port=''
    this.pathname=''
}
function HTMLAudioElement(){
    this.baseURI= "http://epub.cnipa.gov.cn/";
    this.outerHTML="<audio></audio>"
}
HTMLAudioElement.prototype.canPlayType = function(attrName) {
    console.log('打印：HTMLAudioElement.canPlayType("' + attrName + '")');
}
function HTMLVideoElement(){
    this.baseURI= "http://epub.cnipa.gov.cn/";
    this.outerHTML="<video></video>"
}

HTMLVideoElement.prototype.canPlayType = function(attrName) {
    console.log('打印：HTMLVideoElement.canPlayType("' + attrName + '")');
}

function HTMLHtmlElement() {
    this.clientWidth = 1528;
    this.clientHeight = 150;
    this.nodeName="HTML";
    this.style = styles;
}
HTMLHtmlElement.prototype.addEventListener = function removeChild(child) {
    console.log('打印：document.documentElement.addEventListener("' + child + '")');
}
HTMLHtmlElement.prototype.getAttribute = function getAttribute(child) {
    console.log('打印：document.documentElement.getAttribute("' + child + '")');
}

html = watch(new HTMLHtmlElement(), "HTMLHtmlElement");
obj_toString(html, "HTMLHtmlElement");

function HTMLDocument() {
  this.visibilityState = "visible";
  this.documentElement=html;
  this.cookie = "";
}
// 为 HTMLDocument 添加事件系统
if (!HTMLDocument.prototype._eventListeners) {
    HTMLDocument.prototype._eventListeners = {};
}
HTMLDocument.prototype.appendChild = function appendChild(child) {
  console.log('打印：document.appendChild("' + child + '")');
};
HTMLDocument.prototype.removeChild = function removeChild(child) {
  console.log('打印：document.removeChild("' + child + '")');
};
// 重写 document.addEventListener
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

            console.log(`[EVENT_HOOK] 捕获到文档事件: ${type}`);
            break;
        default:
            break;
    }
};

Object.defineProperty(HTMLDocument.prototype, "createElement", {
  writable: true,
  enumerable: true,
  configurable: true,
  value: function createElement(tagName) {
    const tag = (tagName || '').toLowerCase();
    console.log(`打印document.createElement("${tagName}")`);

    let element;

    switch (tag) {
      case "div":
        element = new HTMLDivElement();
        obj_toString(element, "HTMLDivElement");
        break;
      case "form":
        element = new HTMLFormElement();
        obj_toString(element, "HTMLFormElement");
        break;
      case "input":
        element = new HTMLInputElement();
        obj_toString(element, "HTMLInputElement");
        break;
      case "a":
        element = new HTMLAnchorElement();
        obj_toString(element, "HTMLAnchorElement");
        break;
      case "canvas":
        element = new HTMLCanvasElement();
        obj_toString(element, "HTMLCanvasElement");
        break;
      case "audio":
        element = new HTMLAudioElement();
        obj_toString(element, "HTMLAudioElement");
        break;
      case "video":
        element = new HTMLVideoElement();
        obj_toString(element, "HTMLVideoElement");
        break;
      default:
        // 通用元素，防止未知标签直接崩溃
        element = Object.create(HTMLElement.prototype || {});
        console.log(`[createElement] 未特殊处理标签: ${tagName}`);
    }

    // 关键优化：对敏感元素增加轻微“异步加载”感（不破坏同步调用）
    if (["canvas", "audio", "video"].includes(tag)) {
      const origGetContext = element.getContext;
      if (origGetContext) {
        element.getContext = function(contextType) {
          console.log(`打印document.createElement("${tag}").getContext("${contextType}")`);
          // 轻微延迟模拟真实渲染准备时间（大多数检测脚本能容忍 0~30ms）
          if (contextType === "webgl" || contextType === "2d") {
            return new Promise(resolve => {
              setTimeout(() => {
                resolve(origGetContext.call(this, contextType));
              }, 8 + Math.random() * 12 | 0);  // 8~20ms 随机
            });
          }
          return origGetContext.call(this, contextType);
        };
      }
    }

    return watch(element, `HTML${tag.charAt(0).toUpperCase() + tag.slice(1)}Element`);
  }
});
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
                { type: "text/javascript", r: "m", innerHTML: '' },
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
// 更新 HTMLDocument 原型以支持 getElementById
HTMLDocument.prototype.getElementById = function(id) {
    console.log('打印：document.getElementById("' + id + '")');

    if (id === 'K5MK4FPPNWrv') {
        const meta = new HTMLMetaElement();
        return watch(meta, "HTMLMetaElement");
    }

    return null;
};

// 更新 HTMLDocument 原型以支持 querySelector/querySelectorAll
HTMLDocument.prototype.querySelector = function(selector) {
    console.log('打印：document.querySelector("' + selector + '")');

    if (selector === 'meta#K5MK4FPPNWrv') {
        const meta = new HTMLMetaElement();
        return watch(meta, "HTMLMetaElement");
    }

    if (selector === 'script[r="m"]') {
        const script = new HTMLScriptElement();
        script.r = "m";
        return watch(script, "HTMLScriptElement");
    }

    return null;
};

HTMLDocument.prototype.querySelectorAll = function(selector) {
    console.log('打印：document.querySelectorAll("' + selector + '")');

    let elements = [];

    if (selector === 'script[r="m"]') {
        const script1 = new HTMLScriptElement();
        script1.r = "m";
        script1.innerHTML = "";
        const script2 = new HTMLScriptElement();
        script2.r = "m";
        script2.src = "/z5gPWiiwO6ht/2h9AIDg9eZgY.b4c45da.js";
        elements = [script1, script2].map(s => watch(s, "HTMLScriptElement"));
    }

    return new HTMLCollection(elements);
};

HTMLDocument.prototype.dispatchEvent = function(event) {
    console.log('打印：document.dispatchEvent("' + event.type + '")');

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

document = new HTMLDocument();
document.body = null;
document.all = document;

Object.setPrototypeOf(document, HTMLDocument.prototype); //document继承HTMLDocument
obj_toString(document, "HTMLDocument");

// 模拟事件触发系统
function triggerWindowEvents() {
    // 模拟 load 事件
    setTimeout(() => {
        const loadEvent = new EventTarget("load", {isTrusted: true});
        window.dispatchEvent(loadEvent);

        // 同时调用 window.onload（如果存在）
        if (typeof window.onload === 'function') {
            try {
                window.onload(loadEvent);
            } catch (e) {
                console.error('Error in window.onload:', e);
            }
        }
    }, 0);

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
        'driver-evaluate', 'webdriver-evaluate', 'selenium-evaluate','keyup','touchstart','touchmove','input','scroll',
        'touchend','contextmenu','mousemove','mouseenter', 'mouseleave'
    ];

    eventsToTrigger.forEach((eventType, index) => {
        setTimeout(() => {
            const event = new EventTarget(eventType, {isTrusted: eventType.includes('-evaluate') ? false : true});
            document.dispatchEvent(event);
        }, 20); // 间隔触发
    });
}

// navigator
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
navigator = new Navigator();
Object.setPrototypeOf(navigator, Navigator.prototype);
obj_toString(navigator, "Navigator");
window.clientInformation=navigator;
//location
function Location() {
  this.hash = "";
  this.host = "epub.cnipa.gov.cn";
  this.hostname = "epub.cnipa.gov.cn";
  this.href = "http://epub.cnipa.gov.cn";
  this.origin = "http://epub.cnipa.gov.cn";
  this.pathname = "";
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
Storage.prototype.removeItem = function (args) {
  console.log('打印：localStorage.removeItem("' + args + '")');
};
Storage.prototype.getItem = function (args) {
  console.log('打印：localStorage.getItem("' + args + '")');
};
Storage.prototype.setItem = function (args) {
  console.log('打印：localStorage.setItem("' + args + '")');
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
// setInterval = function setInterval() {};
localStorage = watch(localStorage, "localStorage");
screen = watch(screen, "screen");
location = watch(location, "location");
history = watch(history, "history");
window = watch(window, "window");
document = watch(document, "document");
navigator = watch(navigator, "navigator");
window.setInterval = function setInterval() {};

// require("./endr_js");
//
// require("./dey_js");

"ts_code"

"functo_code"

// console.log("--------------->",document.cookie);

// require("./endr_js.js");
//
// require("./dey_js.js");


// 你的 cookie 读取部分（最重要！）
// var cookes = async function () {
//
//
//     function sleep(ms) {
//         return new Promise(resolve => setTimeout(resolve, ms));
//     }
//
//     try {
//         // 关键修改在这里
//         await sleep(900 + Math.random() * 800 | 0);   // 900~1700ms 随机延迟
//
//         var n = document.cookie;
//         // console.log('最终读取到的 cookie:', n);
//         return n;
//     } catch (error) {
//         // console.error('cookie读取错误:', error);
//         throw error;
//     }
// };
// async function rs6(){
//     const result = await cookes();
//     console.info('结果:cookie', result);
//     return result;
// }

function rs6() {
    return document.cookie
}

