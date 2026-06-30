delete __dirname;
delete __filename;

// content="content_code"
content = ".CGD0OZkkhRtkxZUDzUchF05_0BoXqXZv5MJdZjfXNbYe7KJx15jgxP2vjdeZ74W"

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
            debugger
            console.log(`对象 => ${name}, in 操作符检测属性:${String(target)} | ${String(property)}`);
            console.log("in检测符结果:",Reflect.has(target, property))
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

window = global
delete global;

top = self = window
window.ActiveXObject = undefined
window.addEventListener = function (args) {
    console.log('window.addEventListener("' + args + ')');
}
setTimeout = function () {
}
setInterval = function () {
}
window = watch(window, 'window');
div = {
    getElementsByTagName: function (tagName) {
        console.log('document.createElement("div").getElementsByTagName("' + tagName + '")');
        if (tagName === 'i') {
            return []
        }
    },
    setAttribute: function (tagName) {
        console.log('document.createElement("div").setAttribute("' + tagName + '")');
        if (tagName === 'id') {

        }
    },
    addBehavior: function (tagName) {
        console.log('document.createElement("div").addBehavior("' + tagName + '")');
    },
    style:{},
    load:{}
}
div = watch(div, 'div');
script1 = {
    getAttribute: function (args) {
        console.log('script1的getAttribute获取的参数:', args)
        if (args === 'r') {
            return 'm'
        }
    },
    parentElement: {
        removeChild: function (args) {
            console.log('script1的removeChild获取的参数:', args)
        }
    }
}
script2 = {
    getAttribute: function (args) {
        console.log('script2的getAttribute获取的参数:', args)
        if (args === 'r') {
            return 'm'
        }
    },
    parentElement: {
        removeChild: function (args) {
            console.log('script2的removeChild获取的参数:', args)
        }
    }
}
script1 = watch(script1, 'script1');
script2 = watch(script2, 'script2');
meta1 = {}
meta2 = {
    content:content,
    getAttribute: function (args) {
        console.log('meta2的getAttribute获取的参数:', args)
        if (args === 'r') {
            return 'm'
        }
    },
    parentNode: {
        removeChild: function (args) {
            console.log('meta2的removeChild接受的参数:', args)
        }
    }
}
meta1 = watch(meta1, 'meta1');
meta2 = watch(meta2, 'meta2');
document = {
    createElement: function (tagName) {
        console.log('document.createElement("' + tagName + '")')
        if (tagName === 'div') {
            return div
        } else {
            return {}
        }
    },
    removeChild: function (tagName) {
        console.log('document.removeChild("' + tagName + '")')
    },
    getElementsByTagName: function (tagName) {
        console.log('document.getElementsByTagName("' + tagName + '")')
        if (tagName === 'script') {
            return [script1, script2]
        }
        if (tagName === 'meta') {
            return [meta1, meta2]
        }
        if (tagName === 'base') {
            return []
        }
    },
    getElementById: function (tagName) {
        console.log('document.getElementById("' + tagName + '")')
        if(tagName === 'K5MK4FPPNWrv') {

        }
    },
    appendChild: function (tagName) {
        console.log('document.appendChild("' + tagName + '")')
    },
    documentElement: function (tagName) {
        console.log('document.documentElement("' + tagName + '")')
    },
    addEventListener: function (tagName) {
        console.log('document.addEventListener("' + tagName + '")')
    }
}
document = watch(document, 'document');

location = {
    "ancestorOrigins": {},
    "href": "http://epub.cnipa.gov.cn/Dxb/IndexQuery",
    "origin": "http://epub.cnipa.gov.cn",
    "protocol": "http:",
    "host": "epub.cnipa.gov.cn",
    "hostname": "epub.cnipa.gov.cn",
    "port": "",
    "pathname": "/Dxb/IndexQuery",
    "search": "",
    "hash": ""
}
location = watch(location, 'location');
navigator = {
    maxTouchPoints:0,
    appCodeName: "Mozilla",
    appName: "Netscape",
    appVersion: "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
    product: "Gecko",
    productSub: "20030107",
    language: "zh-CN",
    languages: [
        "zh-CN",
        "zh"
    ],
    hardwareConcurrency: 16,
    platform: "Win32",
    webdriver: false,
}
navigator = watch(navigator, 'navigator');
// Object.defineProperty(document, 'cookie', {
//   value: '',
//   writable: false,
//   enumerable: true,
//   configurable: true
// });
Object.defineProperty(window, 'outerWidth', {
    configurable: true,
    enumerable: true,
    get: function outerWidth() {
        return 1536
    },
    set: function outerWidth(value) {
        this.outerWidth = value
    },
})
Object.defineProperty(window, 'innerHeight', {
    configurable: true,
    enumerable: true,
    get: function innerHeight() {
        return 695
    },
    set: function innerHeight(value) {
        this.innerHeight = value
    },
})
Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    enumerable: true,
    get: function innerWidth() {
        return 587
    },
    set: function innerWidth(value) {
        this.innerWidth = value
    },
})
Object.defineProperty(window, 'outerHeight', {
    configurable: true,
    enumerable: true,
    get: function outerHeight() {
        return 816
    },
    set: function outerHeight(value) {
        this.outerHeight= value
    },
})
Object.defineProperty(window, 'TEMPORARY', {
    configurable: true,
    enumerable: true,
    get: function TEMPORARY() {
        return 0
    },
    set: function TEMPORARY(value) {
        this.TEMPORARY= value
    },
})
Object.defineProperty(window, 'localStorage', {
    configurable: true,
    enumerable: true,
    get: function localStorage() {
        return {
    "$_YWTU": "Rppv0522AsWrso4wInQ6TbrOZB4xVaEegBah9N_a_pQ",
    "_$rc": "WRLqEeba7dvUmAw9Wr1ENm1vvrqyWQfFDHzjjbFuirUkqL6T0VzaA5d39GOxcFs3lPHEqZjLIk9HnBBnzJASmRK0L95io7OdjX8ArO4DWhAMtYLZrCYliHp0DtEbWuutoMP9czOsUM3LccliJ.9xfIeLT5B2dcpH7izn6OLZJBSVFdfa2_F6mlcIb4.3UeFt2Gmfk4i716AbjMStNBNhHCmHua_bf0BeN3rGG2KxIs6hjmPi52EtLETdsX6CHDWhDKyofUG_RHpG72TFBGTKAovLidDiIE1UDskfCTkkSkfk6nu4mDdIKkSqVZXmyJA_1riYI6ufVV6xxgX2vy64Mv50cOOr3cLSsB_oL8JUpWyEaZZplSC1A83I6ivWL.xtK3R1.xwTOqeThtPUbwT6j1q7ZheHk1rNzkHfIAUVzC8JHJo7_OsqPcvkOL08cE7XxVuzkzY.7eAAo8zcYW1X8rpNBrT85n.SdQbqns5IsFSgS4Pusd3vHI54f.muT7mlZH8awd7dqlPJhO3OGRybvxWXIkAxnm_2vSiMw4wFmPVko9pbG2FGindAfYJld6KEr1T_re1irH6bry1d1CR2s99.n9fWMTskz1XywKIrExmpumTGZ7AGGgwWNF9PgupRXbey1d8TqWU_5Y_onIMao06OhOhibkkGIf3FPiy5wLTwMMuwNRqLqpt5lriKJcrboNNjkQwx_C1PSTyhovvqUMeRcC16pA7vIjrPDjjrt5MmK6IOolC8Hpfm4RSab.3nrE0gJG",
    "__#classType": "localStorage",
    "$_YVTX": "JOA"
}
    },
    set: function localStorage(value) {
        this.localStorage= value
    },
})
Object.defineProperty(window, 'sessionStorage', {
    configurable: true,
    enumerable: true,
    get: function sessionStorage() {
        return {
    "$_YWTU": "Rppv0522AsWrso4wInQ6TbrOZB4xVaEegBah9N_a_pQ",
    "$_YVTX": "JOA"
}
    },
    set: function sessionStorage(value) {
        this.sessionStorage= value
    },
})
Object.defineProperty(window, 'name', {
    configurable: true,
    enumerable: true,
    get: function name() {
        return ""
    },
    set: function name(value) {
        this.name= value
    },
})
Object.defineProperty(window, 'history', {
    configurable: true,
    enumerable: true,
    get: function history() {
        return {}
    },
    set: function history(value) {
        this.history= value
    },
})
webkitRequestFileSystem=function () {}
XMLHttpRequest=function () {}
HTMLCanvasElement=function () {}
HTMLFormElement=function () {}
DOMParser=function () {}
PointerEvent=function () {}
Request=function () {}
window.Request=Request
CanvasRenderingContext2D=function (tagName) {
    console.log('CanvasRenderingContext2D("' + tagName + '")')
}
Object.defineProperty(window, 'webkitRequestFileSystem', {
    configurable: true,
    enumerable: true,
    get: function webkitRequestFileSystem() {
        return webkitRequestFileSystem
    },
    set: function webkitRequestFileSystem(value) {
        this.webkitRequestFileSystem=webkitRequestFileSystem
    },
})
Object.defineProperty(window, 'XMLHttpRequest', {
    configurable: true,
    enumerable: true,
    get: function XMLHttpRequest() {
        return XMLHttpRequest
    },
    set: function XMLHttpRequest(value) {
        this.XMLHttpRequest=XMLHttpRequest
    },
})
Object.defineProperty(window, 'HTMLCanvasElement', {
    configurable: true,
    enumerable: true,
    get: function HTMLCanvasElement() {
        return HTMLCanvasElement
    },
    set: function HTMLCanvasElement(value) {
        this.HTMLCanvasElement=HTMLCanvasElement
    },
})
Object.defineProperty(window, 'HTMLFormElement', {
    configurable: true,
    enumerable: true,
    get: function HTMLFormElement() {
        return HTMLFormElement
    },
    set: function HTMLFormElement(value) {
        this.HTMLFormElement=HTMLFormElement
    },
})
Object.defineProperty(window, 'DOMParser', {
    configurable: true,
    enumerable: true,
    get: function DOMParser() {
        return DOMParser
    },
    set: function DOMParser(value) {
        this.DOMParser=DOMParser
    },
})
Object.defineProperty(window, 'PointerEvent', {
    configurable: true,
    enumerable: true,
    get: function PointerEvent() {
        return PointerEvent
    },
    set: function PointerEvent(value) {
        this.PointerEvent=PointerEvent
    },
})
const originalCanvasRenderingContext2D = window.CanvasRenderingContext2D;
Object.defineProperty(window, 'CanvasRenderingContext2D', {
    configurable: true,
    enumerable: true,
    get: function() {
        console.log('🔍 CanvasRenderingContext2D getter 被调用');
        return originalCanvasRenderingContext2D;
    },
    set: function(value) {
        console.log('🔍 CanvasRenderingContext2D setter 被调用:', value);
        // 可以选择保存到其他属性，或者直接设置
        this._originalCanvasRenderingContext2D = value;
        // 或者直接设置回原属性
        // Object.defineProperty(window, 'CanvasRenderingContext2D', {
        //     value: value,
        //     configurable: true,
        //     writable: true
        // });
    }
});
HTMLElement=function (tagName) {
    console.log('HTMLElement("' + tagName + '")')
}
Object.defineProperty(window, 'HTMLElement', {
    configurable: true,
    enumerable: true,
    get: function HTMLElement() {
        return HTMLElement
    },
    set: function HTMLElement(value) {
        this.HTMLElement=HTMLElement
    },
})
const originalGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
Object.getOwnPropertyDescriptor = function(obj, prop) {
  if (obj instanceof HTMLElement && prop === 'innerHTML') {
    console.log('🔍 getOwnPropertyDescriptor 被调用:', {
      对象: obj.tagName,
      属性: prop,
      id: obj.id || '无id'
    });
    // 可以在这里添加检测逻辑
    trackPropertyAccess(obj, prop);
  }
  if(obj === window && prop === 'clearInterval'){
     console.log('🔍 getOwnPropertyDescriptor 被调用:', {
      对象: obj.tagName,
      属性: prop,
      id: obj.id || '无id'
    });
  }
  return originalGetOwnPropertyDescriptor.call(this, obj, prop);
};

"ts_code"

"functo_code"

require('rs-code/专利.js')

function rs6(){
    return document.cookie
}

console.log(rs6());


