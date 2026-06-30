content="content_code"

global.process = undefined;
global.dirname = undefined;
global.__filename = undefined;
global.ActiveXObject = undefined;

function watch(obj, name, visited = new WeakSet()) {
  // 防止循环引用导致无限递归
  if (obj === null || typeof obj !== "object" || visited.has(obj)) {
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
        if (
          typeof property === "symbol" ||
          property === "constructor" ||
          property === "__proto__"
        ) {
          return Reflect.get(target, property, receiver);
        }

        if (
          property === "crypto" ||
          property === "navigator" ||
          property === "window"
        ) {
          return target[property];
        }
        const value = Reflect.get(target, property, receiver);
        if (!value) {
          // 深度监听嵌套对象
          if (typeof value === "object" && value !== null) {
            // 为嵌套对象生成一个更具体的名称
            const nestedName = `${name}.${String(property)}`;
            return watch(value, nestedName, visited);
          }
          // 打印属性访问信息
          console.log(
            `对象 => ${name}, 读取属性: ${String(property)}, 值为: ${typeof value === "function" ? "function" : value}, 类型为: ${typeof value}`,
          );

          // 检测原型链访问
          // 如果属性不在 target 上，但通过原型链访问到，则标记为 true
          if (!Object.prototype.hasOwnProperty.call(target, property)) {
            checkPrototypeChain(target, property);
          }

          // 检测描述符
          const descriptor = Object.getOwnPropertyDescriptor(target, property);
          if (descriptor) {
            if (descriptor.get || descriptor.set) {
              // debugger;
              console.log(
                `特殊检测: 存在Getter/Setter (对象: ${name}, 属性: ${String(property)})`,
              );
            }
            if (!descriptor.writable && !descriptor.get) {
              // debugger;
              console.log(
                `特殊检测: 只读属性 (对象: ${name}, 属性: ${String(property)})`,
              );
            }
            if (!descriptor.configurable) {
              // debugger;
              console.log(
                `特殊检测: 不可配置属性 (对象: ${name}, 属性: ${String(property)})`,
              );
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
        console.log(
          `对象 => ${name}, 设置属性: ${String(property)}, 值为: ${typeof newValue === "function" ? "function" : newValue}, 类型为: ${typeof newValue}`,
        );
      } catch (e) {
        console.error(`Error in set trap for ${name}.${String(property)}:`, e);
      }
      return Reflect.set(target, property, newValue, receiver);
    },
    // 捕获 in 操作符
    has: function (target, property) {
      if (property === 'process' || property === 'Buffer') return false;
      console.log(`对象 => ${name}, in 操作符检测属性: ${String(property)}`);
      console.log(`打印操作符：'${String(property)}' in ${name} 结果为: ${Reflect.has(target, property)}`);
      console.log(Reflect.has(target, property));
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
      console.log(
        `特殊检测: getOwnPropertyDescriptor 被调用 (对象: ${name}, 属性: ${String(property)})`,
      );
      return Reflect.getOwnPropertyDescriptor(target, property);
    },
    toString: function (target) {
      console.log(`特殊检测: toString 被调用 (对象: ${name})`);
      return Reflect.toString(target);
    },
  });
}

let getOwnPropertyDescriptors_ = Object.getOwnPropertyDescriptors;
Object.getOwnPropertyDescriptors = function getOwnPropertyDescriptors(obj) {
  console.log("调用 ==> Object.getOwnPropertyDescriptors ==> ", obj);
  //   debugger;
  if (obj === Navigator.prototype) {
    let get_vendor = function () {},
      get_languages = function () {};
    (Object.defineProperty(get_vendor, "name", {
      configurable: true,
      value: "get vendor",
    }),
      Object.defineProperty(get_languages, "name", {
        configurable: true,
        value: "get_languages",
      }));
    return {
      vendor: watch(
        {
          enumerable: true,
          configurable: true,
          get: watch(
            get_vendor,
            `Object.getOwnPropertyDescriptors(Navigator.prototype).vendor.get`,
          ),
        },
        `Object.getOwnPropertyDescriptors(Navigator.prototype).vendor`,
      ),
      languages: watch(
        {
          enumerable: true,
          configurable: true,
          get: watch(
            get_languages,
            `Object.getOwnPropertyDescriptors(Navigator.prototype).languages.get`,
          ),
        },
        `Object.getOwnPropertyDescriptors(Navigator.prototype).languages`,
      ),
    };
  }
  return getOwnPropertyDescriptors_(obj);
};

const obj_toString = (func, name) => {
  Object.defineProperty(func, "name", {
    value: name || func.name,
    configurable: true,
  });
  func.toString = function () {
    return `function ${name || func.name}() { [native code] }`;
  };
};

// ==========================================
// 核心 DOM 原型链基础类 (EventTarget -> Node -> Element -> HTMLElement / Document)
// ==========================================

function Event(type, eventInitDict) {
  this.type = String(type);
  this.target = null;
  this.currentTarget = null;
  // UI 事件默认应该冒泡，除非显式指定
  this.bubbles = eventInitDict && eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : true; 
  this.cancelable = false;
  this.defaultPrevented = false;
  this.isTrusted = eventInitDict && eventInitDict.isTrusted !== undefined ? eventInitDict.isTrusted : false;
  this.timeStamp = Date.now();
  this._propagationStopped = false;

  this.preventDefault = function () { if (this.cancelable) this.defaultPrevented = true; };
  this.stopPropagation = function () { this._propagationStopped = true; };
  this.stopImmediatePropagation = function () { this._propagationStopped = true; };
}
obj_toString(Event, "Event");


// 这才是真正的 DOM 基类：EventTarget
function EventTarget() {
  this._eventListeners = {};
}

obj_toString(EventTarget, "EventTarget");


function Node() { EventTarget.call(this); }
Object.setPrototypeOf(Node.prototype, EventTarget.prototype);
obj_toString(Node, "Node");

function Element() { Node.call(this); }
Object.setPrototypeOf(Element.prototype, Node.prototype);
obj_toString(Element, "Element");

function HTMLElement() {Element.call(this);}
Object.setPrototypeOf(HTMLElement.prototype, Element.prototype);
obj_toString(HTMLElement, "HTMLElement");

function Document() {Node.call(this)}
Object.setPrototypeOf(Document.prototype, Node.prototype);
obj_toString(Document, "Document");

// ==========================================


//全局辅助属性
function IDBFactory() {}
IDBFactory.prototype.open = function open(args, n) {
  //   debugger;
  let name = 'indexedDB.open("' + args + '")';
  console.log(name);
  return watch({}, name);
};

function Window() { EventTarget.call(this); }
Object.setPrototypeOf(Window.prototype, EventTarget.prototype);

window = globalThis;
window.top = window;
window.self = window;

// 先定义所有原型属性
Window.prototype.XMLHttpRequest = function XMLHttpRequest() {};
Window.prototype.DOMParser = function (args) {
  console.log('打印：window.DOMParser("' + args + '")');
  debugger;
};
Window.prototype.indexedDB = new IDBFactory();
Window.prototype.webkitRequestFileSystem = function (
  type,
  size,
  callback,
  errorCallback,
) {};
Window.prototype.chrome = {};
Window.prototype.prompt = function () {
  debugger;
};

// MutationObserver 定义
Window.prototype.MutationObserver = function (callback) {
  console.log("[RS6] new MutationObserver");
  this._callback = typeof callback === "function" ? callback : null;
  this.observe = function (target, options) {
    console.log("[RS6] MutationObserver.observe", target?.nodeName, options);
    if (this._callback) {
      setTimeout(() => this._callback([], this), 100);
      setTimeout(() => this._callback([], this), 100);
    }
  };
  this.disconnect = function () {
    console.log("[RS6] disconnect");
  };
  this.takeRecords = function () {
    return [];
  };
};

Window.prototype.WebKitMutationObserver = Window.prototype.MutationObserver;

Window.prototype.open = function () {
  debugger;
};
Window.prototype.fetch = function () {
  debugger;
};
Window.prototype.Request = function () {
  debugger;
};

Object.defineProperty(Window.prototype, "outerWidth", {
  configurable: true,
  enumerable: true,
  get: function outerWidth() {
    return 1536;
  },
  set: function outerWidth(value) {
    this.outerWidth = value;
  },
});
Object.defineProperty(Window.prototype, "innerHeight", {
  configurable: true,
  enumerable: true,
  get: function innerHeight() {
    return 695;
  },
  set: function innerHeight(value) {
    this.innerHeight = value;
  },
});
Object.defineProperty(Window.prototype, "innerWidth", {
  configurable: true,
  enumerable: true,
  get: function innerWidth() {
    return 587;
  },
  set: function innerWidth(value) {
    this.innerWidth = value;
  },
});
Object.defineProperty(Window.prototype, "outerHeight", {
  configurable: true,
  enumerable: true,
  get: function outerHeight() {
    return 816;
  },
  set: function outerHeight(value) {
    this.outerHeight = value;
  },
});
Object.defineProperty(Window.prototype, "TEMPORARY", {
  configurable: true,
  enumerable: true,
  get: function () {
    return 0;
  },
  set: function (value) {
    this.TEMPORARY = value;
  },
});
Object.defineProperty(Window.prototype, "screenLeft" ,{
  configurable: true,
  enumerable: true,
  get: function () {
    return 0;
  },
  set: function (value) {
    this.TEMPORARY = value;
  },
});
Object.defineProperty(Window.prototype, "screenTop" ,{
  configurable: true,
  enumerable: true,
  get: function () {
    return 0;
  },
  set: function (value) {
    this.TEMPORARY = value;
  },
});



Object.setPrototypeOf(window, Window.prototype);
obj_toString(window, "Window");

external = function External  () {};

// 1. 定义 Performance 构造函数
function Performance() {
  // 瑞数经常会检测 performance.memory 或者 performance.timing
  this.memory = {
    jsHeapSizeLimit: 4294705152,
    totalJSHeapSize: 25400000,
    usedJSHeapSize: 21500000,
  };

  this.timing = {
    navigationStart: Date.now() - 2000,
    fetchStart: Date.now() - 4900,
    domInteractive: Date.now() - 2000,
    domContentLoadedEventEnd: Date.now() - 100,
    loadEventEnd: Date.now(),
  };
}

// 2. 补充原型方法
Performance.prototype.now = function () {
  // 返回一个相对时间戳，模拟页面加载运行的时间
  return Date.now() - this.timing.navigationStart;
};

// 3. 将其实例化并挂载到 window 上
window.performance = new Performance();


function FontFaceSet() {

  this.size = 28;
  this.status = "loaded";
  const self = this;
  this.ready = Promise.resolve(self);
  this.onloading = null;
  this.onloadingdone = null;
  this.onloadingerror = null;
  this.fonts = [];
}

FontFaceSet.prototype.add = function (font) {
  console.log("document.fonts.add 被调用");
  return this;
};
FontFaceSet.prototype.clear = function () {
  console.log("document.fonts.clear 被调用");
};
FontFaceSet.prototype.delete = function (font) {
  console.log("document.fonts.delete 被调用");
  return true;
};
FontFaceSet.prototype.has = function (font) {
  console.log("document.fonts.has 被调用");
  return false;
};
FontFaceSet.prototype.keys = function () {
  return [].keys();
};
FontFaceSet.prototype.values = function () {
  return [].values();
};
FontFaceSet.prototype.entries = function () {
  return [].entries();
};
FontFaceSet.prototype.forEach = function (callback) {
  console.log("document.fonts.forEach 被调用");
};
FontFaceSet.prototype.load = function (font, text) {
  console.log("document.fonts.load 被调用");
  // 返回一个 Promise，模拟字体加载
  return Promise.resolve([font]);
};
Object.defineProperties(FontFaceSet.prototype, {
  ready: {
    get: function () {
      return Promise.resolve(this);
    },
  },
  status: {
    get: function () {
      return "loaded"; // 或 'loading'
    },
  },
});
fonts = watch(new FontFaceSet(), "FontFaceSet");
obj_toString(fonts, "FontFaceSet");


HTMLCanvasElement = function HTMLCanvasElement() {}
CanvasRenderingContext2D = function  CanvasRenderingContext2D() { }
OffscreenCanvasRenderingContext2D = function CanvasRenderingContext2D() { }

function CSSStyleDeclaration() {
  this.cssText = "";
  this.length = 0;
}
styles = new CSSStyleDeclaration();
Object.setPrototypeOf(styles, CSSStyleDeclaration.prototype);
obj_toString(styles, "CSSStyleDeclaration");

function HTMLHeadElement() {
  HTMLElement.call(this);
  this.baseURI = "http://epub.cnipa.gov.cn/";
  this.localName = "head";
  this.namespaceURI = "http://www.w3.org/1999/xhtml";
  this.tagName = "HEAD";
  this.nodeType = 1;
  this.outerHTML = "<head></head>";
  this.spellcheck = true;
  this.style = styles;
}
Object.setPrototypeOf(HTMLHeadElement.prototype, HTMLElement.prototype);

HTMLHeadElement.prototype.removeChild = function removeChild(child) {
  console.log('打印：document.head.removeChild("' + child + '")');
  return child;
  debugger;
};
HTMLHeadElement.prototype.getAttribute = function getAttribute(child) {
  console.log('打印：document.head.getAttribute("' + child + '")');
  if (child == "selenium" || child == "driver" || child == "webdriver") {
    return null;
  }
};
head = new HTMLHeadElement();

Object.setPrototypeOf(head, HTMLHeadElement.prototype);
obj_toString(head, "HTMLHeadElement");
watch(head, "HTMLHeadElement");

function HTMLScriptElement() {
  HTMLElement.call(this);
  this.baseURI = "http://epub.cnipa.gov.cn/";
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
Object.setPrototypeOf(HTMLScriptElement.prototype, HTMLElement.prototype);

HTMLScriptElement.prototype.getAttribute = function (attrName) {
  console.log('打印：HTMLScriptElement.getAttribute("' + attrName + '")');
  switch (attrName) {
    case "r":
      return this.r;
    case "type":
      return this.type;
    case "src":
      return this.src;
    case "charset":
      return this.charset;
    default:
      return null;
  }
};

HTMLScriptElement.prototype.setAttribute = function (attrName, value) {
  console.log(
    '打印：HTMLScriptElement.setAttribute("' + attrName + '", "' + value + '")',
  );
  switch (attrName) {
    case "r":
      this.r = value;
      break;
    case "type":
      this.type = value;
      break;
    case "src":
      this.src = value;
      break;
    case "charset":
      this.charset = value;
      break;
  }
};

HTMLScriptElement.prototype.hasAttribute = function (attrName) {
  return this.getAttribute(attrName) !== null;
};
Object.defineProperty(HTMLScriptElement.prototype, Symbol.toStringTag, {
  value: "HTMLScriptElement",
  configurable: true,
});

function HTMLCollection(elements = []) {
  Object.setPrototypeOf(this, HTMLCollection.prototype);
  for (let i = 0; i < elements.length; i++) {
    this[i] = elements[i];
  }
  this.length = elements.length;
}
HTMLCollection.prototype = Object.create(Array.prototype);
HTMLCollection.prototype.constructor = HTMLCollection;
HTMLCollection.prototype.item = function (index) {
  return this[index] || null;
};
HTMLCollection.prototype.namedItem = function (name) {
  for (let i = 0; i < this.length; i++) {
    const element = this[i];
    if (element.id === name || element.name === name) {
      return element;
    }
  }
  return null;
};

function HTMLDivElement() {
  HTMLElement.call(this);
  this.style = styles;
}
Object.setPrototypeOf(HTMLDivElement.prototype, HTMLElement.prototype);

Object.defineProperty(HTMLDivElement.prototype, "getElementsByTagName", {
  writable: true,
  enumerable: true,
  configurable: true,
  value: function getElementsByTagName(tagName) {
    console.log(`打印：对象HTMLDivElement document.createElement("div").getElementsByTagName("${tagName}")`);
    if (tagName === "i") {
      return new HTMLCollection((elements = []));
    }
    debugger;
  },
});
Object.defineProperty(HTMLDivElement.prototype, "setAttribute", {
  writable: true,
  enumerable: true,
  configurable: true,
  value: function setAttribute(attrName, value) {
    console.log('打印：对象HTMLDivElement document.createElement("div").setAttribute("' + attrName + '", "' + value + '")');
    switch (attrName) {
      case "r":
        this.r = value;
        break;
      case "type":
        this.type = value;
        break;
      case "src":
        this.src = value;
        break;
      default:
        this[attrName] = value;
        break;
    }
  },
});
Object.defineProperty(HTMLDivElement.prototype, "getAttribute", {
  writable: true,
  enumerable: true,
  configurable: true,
  value: function getAttribute(attrName) {
    console.log('打印：对象HTMLDivElement document.createElement("div").getAttribute("' + attrName + '")');
    switch (attrName) {
      case "r":
        return this.r;
      case "type":
        return this.type;
      default:
        return this[attrName];
    }
  },
});
Object.defineProperty(HTMLDivElement.prototype, "addBehavior", {
  writable: true,
  enumerable: true,
  configurable: true,
  value: function addBehavior(attrName) {
    console.log('打印：对象HTMLDivElement document.createElement("div").addBehavior("' + attrName + '")');
    debugger;
  },
});
Object.defineProperty(HTMLDivElement.prototype, "load", {
  writable: true,
  enumerable: true,
  configurable: true,
  value: function load(attrName) {
    console.log('打印：对象HTMLDivElement document.createElement("div").load("' + attrName + '")');
    var storedValue = sessionStorage.getItem(attrName) || localStorage.getItem(attrName);
    if (storedValue) {
      this[attrName] = storedValue;
    }
  },
});
Object.defineProperty(HTMLDivElement.prototype, "save", {
  writable: true,
  enumerable: true,
  configurable: true,
  value: function save(attrName, value) {
    console.log('打印：对象HTMLDivElement document.createElement("div").save("' + attrName + '")');
    var val = arguments.length > 1 ? value : this[attrName];
    if (val) {
      localStorage.setItem(attrName, val);
      sessionStorage.setItem(attrName, val);
      document.cookie = attrName + "=" + encodeURIComponent(val) + "; path=/";
    }
  },
});
obj_toString(new HTMLDivElement(), "HTMLDivElement");

function HTMLAnchorElement() {
  HTMLElement.call(this);
  this.hash = "";
  this.host = "epub.cnipa.gov.cn";
  this.hostname = "epub.cnipa.gov.cn";
  this.href = "http://epub.cnipa.gov.cn";
  this.origin = "http://epub.cnipa.gov.cn";
  this.pathname = "/";
  this.port = "";
  this.protocol = "http:";
  this.search = "";
  this.style = styles;
}
Object.setPrototypeOf(HTMLAnchorElement.prototype, HTMLElement.prototype);

Object.defineProperty(HTMLAnchorElement.prototype, "setAttribute", {
  writable: true,
  enumerable: true,
  configurable: true,
  value: function setAttribute(attrName, value) {
    console.log('打印：对象HTMLAnchorElement document.createElement("a").setAttribute("' + attrName + '", "' + value + '")');
    switch (attrName) {
      case "href":
        this.href = value;
        break;
      default:
        this[attrName] = value;
        break;
    }
  },
});
Object.defineProperty(HTMLAnchorElement.prototype, "addBehavior", {
  writable: true,
  enumerable: true,
  configurable: true,
  value: function addBehavior(attrName) {
    console.log('打印：对象HTMLAnchorElement document.createElement("a").addBehavior("' + attrName + '")');
    debugger;
  },
});
Object.defineProperty(HTMLAnchorElement.prototype, "load", {
  writable: true,
  enumerable: true,
  configurable: true,
  value: function load(attrName) {
    console.log('打印：对象HTMLAnchorElement document.createElement("a").load("' + attrName + '")');
    var storedValue = sessionStorage.getItem(attrName) || localStorage.getItem(attrName);
    if (storedValue) {
      this[attrName] = storedValue;
    }
  },
});
Object.defineProperty(HTMLAnchorElement.prototype, "save", {
  writable: true,
  enumerable: true,
  configurable: true,
  value: function save(attrName, value) {
    console.log('打印：对象HTMLAnchorElement document.createElement("a").save("' + attrName + '")');
    var val = arguments.length > 1 ? value : this[attrName];
    if (val) {
      localStorage.setItem(attrName, val);
      sessionStorage.setItem(attrName, val);
    }
  },
});
Object.defineProperty(HTMLAnchorElement.prototype, "getAttribute", {
  writable: true,
  enumerable: true,
  configurable: true,
  value: function getAttribute(attrName) {
    console.log('打印：对象HTMLAnchorElement document.createElement("a").getAttribute("' + attrName + '")');
    switch (attrName) {
      case "href":
        return this.href;
      default:
        return this[attrName];
    }
  },
});
obj_toString(new HTMLAnchorElement(), "HTMLAnchorElement");
window.HTMLAnchorElement = HTMLAnchorElement;

// 补全基础的 NodeList (如果没有的话)
function NodeList() {
    this.length = 0;
}
NodeList.prototype.item = function(index) {
    return this[index] || null; // 必须返回 null，这是 DOM 标准
};
Object.setPrototypeOf(NodeList.prototype, Object.prototype); // 不继承 Array!
obj_toString(NodeList, 'NodeList');


function HTMLFormElement() {
  HTMLElement.call(this);
  this.tagName = "FORM";
  this.nodeName = "FORM";
  this.localName = "form";
  this.enctype = "application/x-www-form-urlencoded";
  this.nodeType = 1;
  this.action = "http://epub.cnipa.gov.cn/"; // 默认或当前页面URL
  this.method = "get";
  this.outerHTML = "<form></form>";
  this.noValidate = false;
  this.style = styles;
  this.innerText = ''
  this.childNodes = watch(new NodeList(),"HTMLFormElement.children.NodeList")
  this.children= watch(new HTMLCollection(),"HTMLFormElement.children.HTMLCollection")
  Object.defineProperty(this, '_action', {
    get: function() { return this._action; },
    set: function(val) { 
        console.log(`[HTMLFormElement] action 被设置为: ${val}`);
        this._action = val; 
    },

    enumerable: false,
    configurable: true,
    configurable: true
  });
}
Object.setPrototypeOf(HTMLFormElement.prototype, HTMLElement.prototype);
window.HTMLFormElement = HTMLFormElement;

function HTMLInputElement() {
  HTMLElement.call(this);
  this.tagName = "INPUT";
  this.nodeName = "INPUT";
  this.localName = "input";
  this.nodeType = 1;
  this.baseURI = 'http://epub.cnipa.gov.cn/'; 
  this.outerHTML = "<input></input>";
  this.children= watch(new HTMLCollection(),"HTMLInputElement.children.HTMLCollection")
  this.childNodes = watch(new NodeList(),"HTMLInputElement.children.NodeList")
}
Object.setPrototypeOf(HTMLInputElement.prototype, HTMLElement.prototype);

function HTMLAudioElement() {
  HTMLElement.call(this);
  this.baseURI = "http://epub.cnipa.gov.cn";
  this.outerHTML = "<audio></audio>";
}
Object.setPrototypeOf(HTMLAudioElement.prototype, HTMLElement.prototype);
HTMLAudioElement.prototype.canPlayType = function (attrName) {
  console.log('打印：HTMLAudioElement.canPlayType("' + attrName + '")');
};
function HTMLVideoElement() {
  HTMLElement.call(this);
  this.baseURI = "http://epub.cnipa.gov.cn/";
  this.outerHTML = "<video></video>";
}
Object.setPrototypeOf(HTMLVideoElement.prototype, HTMLElement.prototype);
HTMLAudioElement.prototype.canPlayType = function (attrName) {
  console.log('打印：HTMLAudioElement.canPlayType("' + attrName + '")');
};


HTMLFrameSetElement = function HTMLFrameSetElement() {
  HTMLElement.call(this);
}
Object.setPrototypeOf(HTMLFrameSetElement.prototype, HTMLElement.prototype);
watch(new HTMLFrameSetElement(),"HTMLFrameSetElement")


function HTMLMetaElement() {
   HTMLElement.call(this);
  this.parentNode = head;
  this.baseURI = "http://epub.cnipa.gov.cn/";
  this.localName = "meta";
  this.namespaceURI = "http://www.w3.org/1999/xhtml";
  this.tagName = "META";
  this.nodeType = 1;
  this.content = content;
  this.id = "K5MK4FPPNWrv";
  this.r = "m";
}
Object.setPrototypeOf(HTMLMetaElement.prototype, HTMLElement.prototype);

HTMLMetaElement.prototype.getAttribute = function (attrName) {
  console.log('打印：HTMLMetaElement.getAttribute("' + attrName + '")');
  switch (attrName) {
    case "r":
      return this.r;
    case "content":
      return this.content;
    case "id":
      return this.id;
    default:
      return null;
  }
};

function HTMLHtmlElement() {
  HTMLElement.call(this);
  this.tagName = "HTML";
  this.nodeName = "HTML";
  this.localName = "html";
  this.nodeType = 1;
  this.style = styles;
}
Object.setPrototypeOf(HTMLHtmlElement.prototype, HTMLElement.prototype);

Object.defineProperty(HTMLHtmlElement.prototype, "getAttribute", {
  writable: true,
  enumerable: true,
  configurable: true,
  value: function getAttribute(name) {
    console.log(`打印：对象HTMLHtmlElement document.documentElement.getAttribute("${name}")`);
    switch (name) {
      case "selenium":
        return null;
      default:
        return null;
    }
    debugger;
  },
});
Object.defineProperty(HTMLHtmlElement.prototype, "getBoundingClientRect",{
  writable: true,
  enumerable: true,
  configurable: true,
  value: function getBoundingClientRect() {
    return {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },
});

function HTMLBodyElement() {
  HTMLElement.call(this);
  this.tagName = "BODY";
  this.nodeName = "BODY";
  this.localName = "body";
  this.nodeType = 1;
  this.style = styles;
  this.children= watch(new HTMLCollection([]),"HTMLBodyElement.children.HTMLCollection")
  this.childNodes = watch(new NodeList(),"HTMLBodyElement.childNodes.NodeList")
}
Object.setPrototypeOf(HTMLBodyElement.prototype, HTMLElement.prototype);
HTMLBodyElement.prototype.getAttribute = function(name) { return null; };
HTMLBodyElement.prototype.appendChild = function(child) { return child; };
Object.defineProperty(HTMLBodyElement.prototype, "onmouseenter", {
    get: function() { return null; },
    set: function(val) { Object.defineProperty(this, "onmouseenter", { value: val, writable: true, enumerable: true, configurable: true }); },
    enumerable: true, configurable: true
});


MediaEncryptedEvent = function MediaEncryptedEvent() {
  Event.call(this);
  this.type = "MediaEncryptedEvent";
}
PerformancePaintTiming = function PerformancePaintTiming() {
  this.name = "PerformancePaintTiming";
  this.startTime = 0;
  this.duration = 0;
}

SpeechSynthesisUtterance = function SpeechSynthesisUtterance() {
  Event.call(this);
  this.name = "SpeechSynthesisUtterance";
}
ScreenOrientation = function ScreenOrientation() {
  this.name = "ScreenOrientation";
}

Notification = function Notification() {
  Event.call(this);
  this.maxActions = 2;
  this.permission = "denied";
}
SourceBuffer = function SourceBuffer() {
  this.name = "SourceBuffer";
}
BeforeInstallPromptEvent = function BeforeInstallPromptEvent() {
  Event.call(this);
  this.type = "BeforeInstallPromptEvent";
}


function HTMLDocument() {
  Document.call(this);
  this.visibilityState = "visible";
  this.characterSet = "UTF-8";
  
  // 1. 初始化 html 节点，并将其 parentNode 严格指向 document 本身
  let html = new HTMLHtmlElement();
  html.parentNode = this;       // 核心修复点：指向上层的 document
  html.parentElement = null;    // parentElement 必须是 null
  
  // 2. 初始化 body 节点，并将其指向 html
  let body = new HTMLBodyElement();
  body.parentNode = html;
  body.parentElement = html;
  
  // 3. 将它们挂载并套上 Proxy 监控
  this.scrollingElement = html;
  // this.documentElement = watch(html, 'HTMLHtmlElement');
  this.body = watch(body, "HTMLBodyElement");
  this.readyState = "complete";
}

// 确保它们继承正确
Object.setPrototypeOf(HTMLDocument.prototype, Document.prototype);

HTMLDocument.prototype.createExpression = function (expression, resolver) {
  console.log('打印：HTMLDocument.createExpression("' + expression + '", ' + resolver + ")");
  return {};
};
HTMLDocument.prototype.querySelector = function(selector) {
    if (selector == "#query_form") return watch(new HTMLFormElement(), "HTMLFormElement");
    return null;
};

Object.defineProperty(Node.prototype, "appendChild", {
  writable: true,
  enumerable: true,
  configurable: true,
  value: function appendChild(child) {
    console.log(`[Node] appendChild 触发, 父级: ${this.tagName}, 插入的元素: ${child.tagName}`);
    
    // 1. 建立关系
    child.parentNode = this;
    child.parentElement = this.nodeType === 1 ? this : null;
    
    // 2. 初始化类数组
    if (!this.childNodes) this.childNodes = new NodeList();
    if (!this.children) this.children = new HTMLCollection(); // 假设你已有 HTMLCollection
    
    // 3. 检查是否已存在
    let isExist = false;
    for (let i = 0; i < this.childNodes.length; i++) {
      if (this.childNodes[i] === child) { isExist = true; break; }
    }
    
    if (!isExist) {
      // 4. 手动赋值，不用 push
      this.childNodes[this.childNodes.length] = child;
      this.childNodes.length++;
      
      if (child.nodeType === 1) { // 如果是元素节点
        this.children[this.children.length] = child;
        this.children.length++;
        
        // 🚨【超级核心：处理 DOM Clobbering (DOM 破坏)】🚨
        // 当 form 插入带有 name 属性的 input 时，会自动将 input 映射为 form 的属性
        if (this.tagName === "FORM") {
            if (child.name) {
                // 覆盖表单原有的属性 (比如 action, id)
                this[child.name] = child; 
            }
            if (child.id && !this[child.id]) {
                this[child.id] = child;
            }
        }
      }
    }

    // 5. 全局 ID 映射
    if (child && child.id) {
      window[child.id] = child;
    }
    
    return child;
  },
});

Object.defineProperty(Node.prototype, "removeChild", {
  writable: true,
  enumerable: true,
  configurable: true,
  value: function removeChild(child) {
    console.log(`[Node] removeChild 触发, 父级: ${this.tagName}, 移除元素: ${child.tagName}`);
    
    // 断开父子关系
    child.parentNode = null;
    child.parentElement = null;
    
    // 修复：不要用 indexOf，改用标准的 for 循环遍历
    if (this.childNodes) {
        for (let i = 0; i < this.childNodes.length; i++) {
            if (this.childNodes[i] === child) {
                // 将后面的元素前移
                for (let j = i; j < this.childNodes.length - 1; j++) {
                    this.childNodes[j] = this.childNodes[j + 1];
                }
                delete this.childNodes[this.childNodes.length - 1];
                this.childNodes.length--;
                break;
            }
        }
    }
    
    // children 同理处理...
    
    // 取消全局映射
    if (child && child.id && window[child.id] === child) {
      delete window[child.id];
    }
    return child;
  },
});

obj_toString(Node.prototype.appendChild, "appendChild");
obj_toString(Node.prototype.removeChild, "removeChild");



Object.defineProperty(HTMLDocument.prototype, "createElement", {
  writable: true,
  enumerable: true,
  configurable: true,
  value: function createElement(tagName) {
    console.log(`打印document.createElement("${tagName}")`);
    switch (tagName.toLowerCase()) {
      case "div":
        return watch(new HTMLDivElement(), "HTMLDivElement");
      case "a":
        return watch(new HTMLAnchorElement(), "HTMLAnchorElement");
      case "form":
        return watch(new HTMLFormElement(), "HTMLFormElement");
      case "input":
        return watch(new HTMLInputElement(), "HTMLInputElement");
      case "canvas":
        return watch(new HTMLCanvasElement(), "HTMLCanvasElement");
      case "audio":
        return watch(new  HTMLAudioElement(), "HTMLAudioElement");
        case "video":
          return watch(new HTMLVideoElement(), "HTMLVideoElement");
    }
  },
});
Object.defineProperty(HTMLDocument.prototype, "getElementsByTagName", {
  writable: true,
  enumerable: true,
  configurable: true,
  value: function getElementsByTagName(tagName) {
    console.log(`打印document.getElementsByTagName("${tagName}")`);
    let elements = [];
    if (tagName.toLowerCase() === "script") {
      const scriptsData = [
        { type: "text/javascript", r: "m", innerHTML: "" },
        {
          type: "text/javascript",
          charset: "utf-8",
          src: "/z5gPWiiwO6ht/2h9AIDg9eZgY.b4c45da.js",
          r: "m",
        },
      ];

      elements = scriptsData.map((data) => {
        const script = new HTMLScriptElement();
        script.type = data.type || "text/javascript";
        script.r = data.r || "m";
        script.src = data.src || "";
        script.charset = data.charset || "utf-8";
        script.innerHTML = data.innerHTML || "";
        return watch(script, "HTMLScriptElement");
      });
    } else if (tagName.toLowerCase() === "meta") {
      const meta = new HTMLMetaElement();
      meta.id = "K5MK4FPPNWrv";
      meta.r = "m";
      elements = [watch(meta, "HTMLMetaElement")];
    }
    if (tagName.toLowerCase() === "base") {
      return [];
    }
    return new HTMLCollection(elements);
  },
});
Object.defineProperty(HTMLDocument.prototype, "getElementById", {
  writable: true,
  enumerable: true,
  configurable: true,
  value: function getElementById(id) {
    console.log(`打印：document.getElementById("${id}")`);
    if (id === "K5MK4FPPNWrv") {
      const meta = new HTMLMetaElement();
      return watch(meta, "HTMLMetaElement");
    }
    if (id === "root-hammerhead-shadow-ui") {
      return null;
    }
    if (id === "a") {
      return watch(new HTMLAnchorElement(), "HTMLAnchorElement");
    }
    if (id === "__anchor__") {
      return null;
    }
    if (id === "bb82kj") {
      return fonts;
    }
    debugger;
  },
});
Object.defineProperty(HTMLDocument.prototype, "referrer", {
  configurable: true,
  enumerable: true,
  get: function referrer() {
    return "http://epub.cnipa.gov.cn";
  },
  set: function referrer(value) {
    this.referrer = value;
  },
});
const cookieJar = {};
function get_cookie() {
  const cookieArray = [];
  for (let key in cookieJar) {
    cookieArray.push(`${key}=${cookieJar[key]}`);
  }
  const result = cookieArray.join('; ');
  console.log(`[Document] 读取 cookie: ${result}`);
  return result;
}

function set_cookie(val) {
  console.log(`[Document] 设置 cookie: ${val}`);
  val = String(val);
  
  const parts = val.split(';');
  const cookiePairs = parts[0].trim();
  const index = cookiePairs.indexOf('=');
  
  if (index !== -1) {
    const key = cookiePairs.substring(0, index).trim();
    const value = cookiePairs.substring(index + 1).trim();
    cookieJar[key] = value;
  }
}

// 2. 对这两个核心函数进行原生伪装（注意：原生的 name 带有空格）
obj_toString(get_cookie, 'get cookie');
obj_toString(set_cookie, 'set cookie');

// 3. 将伪装好的函数挂载到原型对象上
Object.defineProperty(Document.prototype, 'cookie', {
  enumerable: true,
  configurable: true,
  get: get_cookie,
  set: set_cookie
});
Object.defineProperties(HTMLDocument.prototype, {
  hidden: {
    get: function () {
      return false;
    }, // 页面永远在前端显示
    enumerable: true,
  },
  visibilityState: {
    get: function () {
      return "visible";
    },
    enumerable: true,
  },
  // 兼容性前缀检测也是瑞数的最爱
  webkitHidden: {
    get: function () {
      return false;
    },
    enumerable: true,
  },
  webkitVisibilityState: {
    get: function () {
      return "visible";
    },
    enumerable: true,

  },
  onmousemove:{
    get: function () {
      return null;
    },
    enumerable: true,

  },
  onselectionchange :{
    get: function () {
      return null;
    },
    enumerable: true,

  },

});


document = new HTMLDocument();
Object.setPrototypeOf(document, HTMLDocument.prototype);
obj_toString(document, "HTMLDocument");
document.all = new HTMLCollection((elements = []));

EventTarget.prototype.addEventListener = function(type, listener, options) {
  console.log(`[EventTarget] addEventListener("${type}") on ${this.constructor.name || this.tagName || 'Window'}`);
  
  // 1. 常规存储监听器逻辑 (保持你的原样)
  if (!this._eventListeners) this._eventListeners = {};
  if (!this._eventListeners[type]) this._eventListeners[type] = [];
  if (this._eventListeners[type].indexOf(listener) === -1) {
    this._eventListeners[type].push({ listener: listener, options: options || false });
  }
  
  // 2. 危险陷阱事件拦截池（绝对不能主动触发）
  const trapEvents = ["driver-evaluate", "webdriver-evaluate", "selenium-evaluate"];
  if (trapEvents.includes(type)) {
      console.log(`[警告] 目标脚本注册了陷阱事件: ${type}，已静默处理，绝不主动触发！`);
      return; 
  }

  // 3. 安全生命周期事件，自动异步触发池
  const autoDispatchEvents = ["load", "DOMContentLoaded", "popstate"];
  if (autoDispatchEvents.includes(type)) {
      // 使用 setTimeout 模拟异步，因为真实的事件分发是由浏览器底层在下一个事件循环中推入的
      // 如果这里是同步调用 listener.call()，会导致调用栈(Call Stack)异常，暴露出这是 JS 模拟的环境
      setTimeout(() => {
          // 针对 load 和 DOMContentLoaded 的特殊状态校验
          if ((type === "load" || type === "DOMContentLoaded") && document.readyState !== "complete") {
              return; // 如果我们自己模拟的 DOM 还没加载完，就先不触发，交由后续的定时器去触发
          }
          
          console.log(`[Auto-Dispatch] 自动补发错过的生命周期事件: ${type}`);
          
          // 创建事件并使用我们之前写好的、带有冒泡逻辑的 dispatchEvent 进行分发
          const autoEvent = new Event(type, { 
              isTrusted: true, 
              bubbles: type === "popstate" ? false : true // 根据 MDN，popstate 不冒泡
          });
          this.dispatchEvent(autoEvent);
      }, Math.random() * 10 + 5); // 增加 5~15ms 的微小随机延迟，抹平机器特征
  }
};
EventTarget.prototype.removeEventListener = function(type, listener, options) {};
EventTarget.prototype.dispatchEvent = function(event) {
  console.log(`[EventTarget] dispatchEvent("${event.type}") started on ${this.constructor.name || this.tagName || 'Window'}`);
  if (!event || !event.type) return false;

  // 确定真正的 target (事件最开始触发的节点)
  if (!event.target) event.target = this;

  let currentTarget = this;
  
  // 模拟事件冒泡链 (Target -> ParentNode -> Document -> Window)
  while (currentTarget) {
    event.currentTarget = currentTarget;

    // 如果当前节点有该事件的监听器
    if (currentTarget._eventListeners && currentTarget._eventListeners[event.type]) {
      const listeners = currentTarget._eventListeners[event.type];
      for (let i = 0; i < listeners.length; i++) {
        const listenerObj = listeners[i];
        try {
          if (typeof listenerObj.listener === "function") {
            listenerObj.listener.call(currentTarget, event);
          } else if (typeof listenerObj.listener === "object" && typeof listenerObj.listener.handleEvent === "function") {
            listenerObj.listener.handleEvent(event);
          }
        } catch (e) {
          console.error(`Error in event listener for ${event.type}:`, e);
        }
      }
    }

    // 如果事件被调用了 stopPropagation()，或者该事件本身不冒泡，则停止向上传递
    if (event._propagationStopped || !event.bubbles) {
      break;
    }

    // 寻找下一个冒泡节点
    if (currentTarget.parentNode) {
        currentTarget = currentTarget.parentNode;
    } else if (currentTarget === document.documentElement) {
        currentTarget = document;
    } else if (currentTarget === document) {
        currentTarget = window;
    } else {
        currentTarget = null;
    }
  }

  return !event.defaultPrevented;
};
function Location() {
  this.hash = "";
  this.host = "epub.cnipa.gov.cn";
  this.hostname = "epub.cnipa.gov.cn";
  this.href = "http://epub.cnipa.gov.cn";
  this.origin = "http://epub.cnipa.gov.cn";
  this.pathname = "/";
  this.port = "";
  this.protocol = "http:";
  this.search = "";
}
Location.prototype.assign = function () {
  debugger;
};
Location.prototype.replace = function (args) {
  console.log('打印：location.replace("' + args + '")');
};
location = new Location();
Object.setPrototypeOf(location, Location.prototype);
obj_toString(location, "Location");
window.location = location;

function Storage() {
  this._data = {};
}
Storage.prototype.getItem = function (key) {
  console.log(`[Storage] 读取: ${key}`);
  return this._data.hasOwnProperty(key) ? String(this._data[key]) : null;
};
Storage.prototype.setItem = function (key, value) {
  console.log(`[Storage] 设置: ${key} = ${value}`);
  this._data[key] = String(value);
};
Storage.prototype.removeItem = function (key) {
  console.log(`[Storage] 删除: ${key}`);
  delete this._data[key];
};
Storage.prototype.clear = function () {
  console.log(`[Storage] 清空`);
  this._data = {};
};
Object.defineProperty(Storage.prototype, "length", {
  get: function () {
    return Object.keys(this._data).length;
  },
});

localStorage = new Storage();
Object.setPrototypeOf(localStorage, Storage.prototype);
obj_toString(localStorage, "Storage");

sessionStorage = new Storage();

function Navigator() {}
Navigator.prototype.appVersion = "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36";
Navigator.prototype.appCodeName = "Mozilla";
Navigator.prototype.platform = "Win32";
Navigator.prototype.vendor = "Google Inc.";
Navigator.prototype.userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36";
Navigator.prototype.language = "zh-CN";
Navigator.prototype.mimeTypes = [];
Navigator.prototype.maxTouchPoints = 0;
Navigator.prototype.getBattery = function () {
  console.log("[Mock] navigator.getBattery() 被调用");
  return Promise.resolve(
    watch({
        level: 1,
        charging: true,
        chargingTime: Infinity,
        dischargingTime: Infinity,
        onchargingchange: null,
        onchargingtimechange: null,
        ondischargingtimechange: null,
        onlevelchange: null,
      }, "BatteryManager"),
  );
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
  saveData: false,
};
navigator = new Navigator();
Object.setPrototypeOf(navigator, Navigator.prototype);
obj_toString(navigator, "Navigator");
window.clientInformation = navigator;

function History() {
  this.length = 2;
  this.scrollRestoration = "auto";
  this.state = null;
}
History.prototype.replaceState = function () {
  console.log("打印：history.replaceState()");
  debugger;
};
History.prototype.pushState = function () {
  console.log("打印：history.pushState()");
  debugger;
};
history = new History();
Object.setPrototypeOf(history, History.prototype);
obj_toString(history, "History");
function Screen() {
  this.availHeight = 824; this.availWidth = 1536; this.colorDepth = 32;
  this.height = 864; this.pixelDepth = 32; this.width = 1536;
  this.availLeft = 0; this.availTop = 0;
}
screen = new Screen(); Object.setPrototypeOf(screen, Screen.prototype);




window = watch(window, "window");
document = watch(document, "document");
location = watch(location, "location");
localStorage = watch(localStorage, "localStorage");
sessionStorage = watch(sessionStorage, "sessionStorage");
history = watch(history, "history");
navigator = watch(navigator, "navigator");
screen = watch(screen, "screen");


window.setInterval = function () {};

TS_CODE_PLACEHOLDER

CORE_JS_PLACEHOLDER


// 提取 Cookie 逻辑的重构
var cookies = async function () {
  function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
  try {
    // 先让目标的核心环境代码初始化跑一会儿
    await sleep(1000); 
    
    
    // 【关键防御点】动作执行完毕后，必须给目标脚本留出几百毫秒的打包加密时间
    await sleep(500); 
    
    let cookieStr = document.cookie;
    let finalCookie = cookieStr.replace(/enable_[a-zA-Z0-9]+=[^;]+;\s*/g, "");

    return finalCookie; 
  } catch (error) {
    throw error;
  }
};

async function test() {
  try {
    const result = await cookies();
    console.debug( result);
  } catch (error) {
    if (typeof exports !== "undefined") exports.error = error.message;
  }
}
test();
