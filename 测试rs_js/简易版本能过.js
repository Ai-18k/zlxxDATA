delete __filename
delete __dirname

content="content_code"
// content = "gJFxbPJXx7umU_uA1nxMHBHVeZrMuEKX996HeApbi2EBm2U6fZa3nT9D80rae433y4c66dYBLgCX0yGSqYfs3G"

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

// function get_enviroment(proxy_array) {
//     for(var i=0; i<proxy_array.length; i++){
//         handler = '{\n' +
//             '    get: function(target, property, receiver) {\n' +
//             '        console.log("方法:", "get  ", "对象:", ' +
//             '"' + proxy_array[i] + '" ,' +
//             '"  属性:", property, ' +
//             '"  属性类型:", ' + 'typeof property, ' +
//             // '"  属性值:", ' + 'target[property], ' +
//             '"  属性值类型:", typeof target[property]);\n' +
//              // 'if (typeof target[property]=="undefined"){debugger}'+
//             '        return target[property];\n' +
//             '    },\n' +
//             '    set: function(target, property, value, receiver) {\n' +
//             '        console.log("方法:", "set  ", "对象:", ' +
//             '"' + proxy_array[i] + '" ,' +
//             '"  属性:", property, ' +
//             '"  属性类型:", ' + 'typeof property, ' +
//             // '"  属性值:", ' + 'target[property], ' +
//             '"  属性值类型:", typeof target[property]);\n' +
//             '        return Reflect.set(...arguments);\n' +
//             '    }\n' +
//             '}'
//         eval('try{\n' + proxy_array[i] + ';\n'
//         + proxy_array[i] + '=new Proxy(' + proxy_array[i] + ', ' + handler + ')}catch (e) {\n' + proxy_array[i] + '={};\n'
//         + proxy_array[i] + '=new Proxy(' + proxy_array[i] + ', ' + handler + ')}')
//     }
// }
// proxy_array = ['window', 'document', 'location', 'navigator', 'history','screen']

let getOwnPropertyDescriptors_ = Object.getOwnPropertyDescriptors;
Object.getOwnPropertyDescriptors = function getOwnPropertyDescriptors(obj) {
    console.log("调用 ==> Object.getOwnPropertyDescriptors ==> ", obj);
    debugger;
    if (obj === Navigator.prototype){
            let get_vendor = function(){},get_languages = function(){};
            Object.defineProperty(get_vendor, 'name', {
                configurable: true,
                value: "get vendor"
            }),
            Object.defineProperty(get_languages, 'name', {
               configurable: true,
               value: "get_languages"
           });
           return {
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
            }
        }
        return getOwnPropertyDescriptors_(obj);
    }

function Window() {}
window = globalThis

window.__proto__  = Window.prototype
window=watch(window,"window")

top = self = window
screen={}
script1 = {
    getAttribute: function (args) {
        console.log('script1的getAttribute获取的参数:', args)
        if (args === 'r') {
            return 'm'
        }
    },
    parentElement: {
        removeChild: function (args) {
            console.log('script1的parentElement.removeChild获取的参数:', args)
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
meta = {
    content:content,
    getAttribute: function (args) {
        console.log('meta的getAttribute获取的参数:', args)
        if (args === 'r') {
            return 'm'
        }
    },
    parentNode: {
        removeChild: function (args) {
            console.log('meta的parentNode.removeChild接受的参数:', args)
        }
    }
}
Window.prototype.fetch  = function (args) {
    console.log('window->fetch: ', args)
    debugger;
    return {};
}
Window.prototype.addEventListener = function () {}

localStorage = {}
Storage=function Storage() {}
localStorage={};localStorage.__proto__=Storage.prototype;
sessionStorage={};sessionStorage.__proto__=Storage.prototype;
Storage.prototype.getItem = function getItem(key){
        if (this[key]) {
            return this[key];
        }
        return null;
    }
Storage.prototype.removeItem = function removeItem(key){
    delete this[key];
}
Storage.prototype.setItem = function setItem(key, value){
    this[key] = value;
}

Object.defineProperty(Window.prototype, 'name', {
    configurable: true,
    enumerable: true,
    get: function name() {
        return ""
    },
    set: function name(value) {
        this.name= value
    },
})
Window.prototype.history={
    "length": 2,
    "scrollRestoration": "auto",
    "state": null,
    replaceState: function replaceState(tagName) {
      console.log('history.replaceState("' + tagName + '")')
    }
}
Object.defineProperty(Window.prototype, 'indexedDB', {
    configurable: true,
    enumerable: true,
    get: function indexedDB() {
        return {}
    },
    set: function indexedDB(value) {
        this.indexedDB= value
    },
})
webkitRequestFileSystem=function (tagName) {
    console.log('webkitRequestFileSystem("' + tagName + '")')
}
XMLHttpRequest=function (tagName) {
    console.log('XMLHttpRequest("' + tagName + '")')
}
HTMLCanvasElement=function (tagName) {
    console.log('HTMLCanvasElement("' + tagName + '")')
}
HTMLFormElement=function (tagName) {
     console.log('HTMLFormElement("' + tagName + '")')
}
DOMParser=function (tagName) {
    console.log('DOMParser("' + tagName + '")')
}
PointerEvent=function (tagName) {
    console.log('PointerEvent("' + tagName + '")')
}
CanvasRenderingContext2D=function () {}
HTMLElement=function (tagName) {
    console.log('HTMLElement("' + tagName + '")')
}
window.Request=function () {}
window.execScript=undefined
window.CollectGarbage=undefined
window.ActiveXObject=undefined
window.Navigator=function () {}
window.chrome={}
Object.defineProperty(Window.prototype, 'webkitRequestFileSystem', {
    configurable: true,
    enumerable: true,
    get: function webkitRequestFileSystem() {
        return webkitRequestFileSystem
    },
    set: function webkitRequestFileSystem(value) {
        this.webkitRequestFileSystem=webkitRequestFileSystem
    },
})
Object.defineProperty(Window.prototype, 'XMLHttpRequest', {
    configurable: true,
    enumerable: true,
    get: function XMLHttpRequest() {
        return XMLHttpRequest
    },
    set: function XMLHttpRequest(value) {
        this.XMLHttpRequest=XMLHttpRequest
    },
})
Object.defineProperty(Window.prototype, 'HTMLCanvasElement', {
    configurable: true,
    enumerable: true,
    get: function HTMLCanvasElement() {
        return HTMLCanvasElement
    },
    set: function HTMLCanvasElement(value) {
        this.HTMLCanvasElement=HTMLCanvasElement
    },
})
Object.defineProperty(Window.prototype, 'HTMLFormElement', {
    configurable: true,
    enumerable: true,
    get: function HTMLFormElement() {
        return HTMLFormElement
    },
    set: function HTMLFormElement(value) {
        this.HTMLFormElement=HTMLFormElement
    },
})
Object.defineProperty(Window.prototype, 'DOMParser', {
    configurable: true,
    enumerable: true,
    get: function DOMParser() {
        return DOMParser
    },
    set: function DOMParser(value) {
        this.DOMParser=DOMParser
    },
})
Object.defineProperty(Window.prototype, 'PointerEvent', {
    configurable: true,
    enumerable: true,
    get: function PointerEvent() {
        return PointerEvent
    },
    set: function PointerEvent(value) {
        this.PointerEvent=PointerEvent
    },
})
Object.defineProperty(Window.prototype, 'HTMLElement', {
    configurable: true,
    enumerable: true,
    get: function HTMLElement() {
        return HTMLElement
    },
    set: function HTMLElement(value) {
        this.HTMLElement=HTMLElement
    },
})
Object.defineProperty(Window.prototype, 'outerWidth', {
    configurable: true,
    enumerable: true,
    get: function outerWidth() {
        return 1536
    },
    set: function outerWidth(value) {
        this.outerWidth = value
    },
})
Object.defineProperty(Window.prototype, 'innerHeight', {
    configurable: true,
    enumerable: true,
    get: function innerHeight() {
        return 695
    },
    set: function innerHeight(value) {
        this.innerHeight = value
    },
})
Object.defineProperty(Window.prototype, 'innerWidth', {
    configurable: true,
    enumerable: true,
    get: function innerWidth() {
        return 587
    },
    set: function innerWidth(value) {
        this.innerWidth = value
    },
})
Object.defineProperty(Window.prototype, 'outerHeight', {
    configurable: true,
    enumerable: true,
    get: function outerHeight() {
        return 816
    },
    set: function outerHeight(value) {
        this.outerHeight= value
    },
})
Object.defineProperty(Window.prototype, 'TEMPORARY', {
    configurable: true,
    enumerable: true,
    get: function() {
        return 0;
    },
    set: function(value) {
        this.TEMPORARY = value;
    }
})

window.setTimeout = function () {
}
window.setInterval = function () {
}

div = {
    getElementsByTagName: function (tagName) {
        console.log('div.getElementsByTagName("' + tagName + '")');
        if (tagName === 'i') {
            return []
        }
    },
    setAttribute: function (tagName) {
        console.log('div.setAttribute("' + tagName + '")');
    },
    addBehavior: function (tagName) {
        console.log('div.addBehavior("' + tagName + '")');
    }
}

HTMLHtmlElement=function (tagName) {
        console.log('document.documentElement("' + tagName + '")')
}
document ={
    createElement: function (tagName) {
        console.log('document.createElement("' + tagName + '")')
        if (tagName === 'div') {
            return div
        }else if (tagName === 'a') {
            return watch({},"createElement.a")
        }
        return {}
    },
    removeChild: function (tagName) {
        console.log('document.removeChild("' + tagName + '")')
    },
    getElementsByTagName: function (tagName) {
        console.log('document.getElementsByTagName("' + tagName + '")')
        if (tagName === 'script') {
            return [script1, script2]
        }
        if (tagName === 'base') {
            return []
        }
    },
    getElementById: function (tagName) {
        console.log('document.getElementById("' + tagName + '")')
        if(tagName == 'K5MK4FPPNWrv') {
            return meta
        }
        else if(tagName=="a"){
            debugger;
        }
        else if (tagName=="root-hammerhead-shadow-ui"){
            debugger
            return {}
        }
    },
    appendChild: function (tagName) {
        console.log('document.appendChild("' + tagName + '")')
    },
    addEventListener: function (tagName) {
        console.log('document.addEventListener("' + tagName + '")')
        if (tagName=="driver-evaluate"){
            debugger
        }
        else if (tagName=="webdriver-evaluate"){
            debugger
        }
        else if (tagName=="selenium-evaluate"){
            debugger
        }
    },
    createExpression:function (tagName) {
        console.log('document.createExpression("' +tagName+ '")')
        if (tagName=="//html") {
            debugger
        }
    },
    visibilityState:'visible'
}
HTMLDocument=function HTMLDocument(){};document.__proto__=HTMLDocument.prototype
documentElement=watch({},"document.documentElement")
Document = function Document(){}
Document.prototype.documentElement=HTMLHtmlElement.prototype
Object.defineProperty(document, 'referrer', {
    configurable: true,
    enumerable: true,
    get: function referrer() {
        return 'http://epub.cnipa.gov.cn/Dxb/IndexQuery'
    },
    set: function referrer(value) {
        this.referrer = value
    },
})
function Location() {}
location = Object.create(Location.prototype);  // 使用 Object.create 设置原型
Object.assign(location, {
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
});

function Navigator() {}
navigator=watch({},"navigator");
navigator={}
navigator.__proto__=Navigator.prototype;
Navigator.prototype.appCodeName="Mozilla"
Navigator.prototype.appName="Netscape"
Navigator.prototype.appVersion="5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
Navigator.prototype.userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
Navigator.prototype.maxTouchPoints=0
Navigator.prototype.platform="Win32"
Navigator.prototype.webdriver=false
Navigator.prototype.languages=['zh-CN', 'zh']
Navigator.prototype.connection={
        "downlink": 10,
        "effectiveType": "4g",
        "onchange": null,
        "rtt": 0,
        "saveData": false
    }
Navigator.prototype.mimeTypes=[{},{}]
function DeprecatedStorageQuota() {}
Navigator.prototype.webkitPersistentStorage=DeprecatedStorageQuota.prototype;


// get_enviroment(proxy_array)

"ts_code"

"functo_code"

// require('../rs-code/专利')
// require('./rs-code/深圳交易')
// require('./rs-code/海关')
// process=_process
function rs6(){
    return document.cookie
}
// cook=rs6()
// console.log(cook.length+" | "+ cook );


