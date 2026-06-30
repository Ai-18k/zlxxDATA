
delete __filename
delete __dirname

content="content_code"
// content = "6Pm6p7lCUMbM8zAN_Btl50cWMmLTyJb.se71Evh9YOfi2TB2wGetLT2cyZrXMt7GdkvR3uc4ELqhsX0f0B0Qfq"

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
//              'if (typeof target[property]=="undefined"){debugger}'+
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

// function watch(obj, name) {
//     // 使用WeakMap存储原始对象到代理的映射，避免重复代理
//     const proxyMap = new WeakMap();
//
//     // 内部标记，用于避免代理内部操作触发循环
//     const IS_INTERNAL_PROXY_OPERATION = Symbol("isInternalProxyOperation");
//
//     return new Proxy(obj, {
//         get: function (target, property, receiver) {
//             // 如果是内部操作（比如代理自身在访问属性），则不打印日志
//             if (property === IS_INTERNAL_PROXY_OPERATION) {
//                 return true;
//             }
//
//             const value = Reflect.get(target, property, receiver);
//
//             try {
//                 // 判断属性是否在对象自身或原型链上定义
//                 const hasOwnOrProto = Object.prototype.hasOwnProperty.call(target, property) ||
//                                      Object.prototype.hasOwnProperty.call(Object.getPrototypeOf(target), property);
//
//                 // 获取属性描述符
//                 const descriptor = Object.getOwnPropertyDescriptor(target, property);
//                 let descriptorInfo = '无描述符';
//                 if (descriptor) {
//                     descriptorInfo = JSON.stringify(descriptor, (key, val) => {
//                         // 对于函数类型的get/set，只保留一小段字符串
//                         if (typeof val === 'function' && (key === 'get' || key === 'set')) {
//                             return val.toString().substring(0, 50) + '...';
//                         }
//                         return val;
//                     });
//                 }
//
//                 // 只有当属性未定义，或者你在关注所有读取时才打印
//                 // 这里我们假设你主要关注 'undefined' 的情况，并进行了简化
//                 if (value === undefined && !hasOwnOrProto) { // 仅当属性在对象自身和原型链上都不存在时
//                     let valueToString = 'N/A';
//                     if (value !== null && (typeof value === 'object' || typeof value === 'function')) {
//                         try {
//                             valueToString = value.toString();
//                         } catch (e) {
//                             valueToString = `toString() error: ${e.message}`;
//                         }
//                     } else if (value !== undefined) { // 对于非 undefined 的原始类型，直接转字符串
//                         valueToString = String(value);
//                     }
//
//                     console.log(`[GET] ${name}.${String(property)}: ` +
//                                 `值=${String(value)} (${typeof value}), ` +
//                                 `补原型链=${!hasOwnOrProto}, ` +
//                                 `值toString='${valueToString}', ` +
//                                 `描述符=${descriptorInfo}`);
//                 }
//             } catch (e) {
//                 // 捕获日志打印过程中的错误，不影响主逻辑
//                 console.error(`Error logging GET for ${name}.${String(property)}:`, e);
//             }
//
//             // 如果获取到的是对象或函数，且之前未代理过，则对其进行嵌套代理
//             if ((typeof value === 'object' && value !== null) || typeof value === 'function') {
//                 if (!proxyMap.has(value)) {
//                     const nestedProxy = watch(value, `${name}.${String(property)}`);
//                     proxyMap.set(value, nestedProxy);
//                     return nestedProxy;
//                 }
//                 return proxyMap.get(value);
//             }
//
//             return value;
//         },
//         set: (target, property, newValue, receiver) => {
//             // 如果是内部操作，则不打印日志
//             if (property === IS_INTERNAL_PROXY_OPERATION) {
//                 return Reflect.set(target, property, newValue, receiver);
//             }
//
//             try {
//                 const oldValue = Reflect.get(target, property, receiver);
//
//                 // 判断属性是否在对象自身或原型链上定义
//                 const hasOwnOrProto = Object.prototype.hasOwnProperty.call(target, property) ||
//                                      Object.prototype.hasOwnProperty.call(Object.getPrototypeOf(target), property);
//
//                 // 获取属性描述符
//                 const descriptor = Object.getOwnPropertyDescriptor(target, property);
//                 let descriptorInfo = '无描述符';
//                 if (descriptor) {
//                     descriptorInfo = JSON.stringify(descriptor, (key, val) => {
//                         if (typeof val === 'function' && (key === 'get' || key === 'set')) {
//                             return val.toString().substring(0, 50) + '...';
//                         }
//                         return val;
//                     });
//                 }
//
//                 let newValueDisplay = String(newValue);
//                 if (newValueDisplay.length > 100) { // 截断过长的字符串以保持日志可读性
//                     newValueDisplay = newValueDisplay.substring(0, 100) + '... (truncated)';
//                 }
//
//                 console.log(`[SET] ${name}.${String(property)}: ` +
//                             `旧值=${String(oldValue)} (${typeof oldValue}), ` +
//                             `新值=${newValueDisplay} (${typeof newValue}), ` +
//                             `补原型链=${!hasOwnOrProto}, ` +
//                             `描述符=${descriptorInfo}`);
//
//             } catch (e) {
//                 console.error(`Error logging SET for ${name}.${String(property)}:`, e);
//             }
//
//             return Reflect.set(target, property, newValue, receiver);
//         },
//         // 也可以考虑拦截 deleteProperty, defineProperty 等操作
//         defineProperty(target, property, descriptor) {
//             console.log(`[DEFINE] ${name}.${String(property)}: 定义描述符=${JSON.stringify(descriptor)}`);
//             return Reflect.defineProperty(target, property, descriptor);
//         },
//         deleteProperty(target, property) {
//             console.log(`[DELETE] ${name}.${String(property)}`);
//             return Reflect.deleteProperty(target, property);
//         }
//     });
// }

// function watch(obj, name) {
//     const isProxyActive = Symbol("isProxyActive");
//     return new Proxy(obj, {
//         get: function (target, property, receiver) {
//             try {
//                 const value = target[property];
//                 if (value === undefined && !receiver[isProxyActive]) {
//                     const protoChainNeeded = !Object.getPrototypeOf(target).hasOwnProperty(property);
//                     const descriptor = Object.getOwnPropertyDescriptor(target, property) || {};
//                     const toStringDesc = descriptor.toString || (descriptor.get && descriptor.get.toString());
//                     console.log(`${name}.${property} 读取: ${String(value)} (${typeof value}), 补原型链: ${protoChainNeeded}, toString: ${toStringDesc || '无'}`);
//                 }
//             } catch (e) {}
//             return target[property];
//         },
//         set: (target, property, newValue, receiver) => {
//             try {
//                 if (!receiver[isProxyActive]) {
//                     const displayValue = String(newValue);
//                     if (displayValue.length <= 50) {
//                         const protoChainNeeded = !Object.getPrototypeOf(target).hasOwnProperty(property);
//                         const descriptor = Object.getOwnPropertyDescriptor(target, property) || {};
//                         const toStringDesc = descriptor.toString || (descriptor.get && descriptor.get.toString());
//                         console.log(`${name}.${property} 设置: ${displayValue} (${typeof newValue}), 补原型链: ${protoChainNeeded}, toString: ${toStringDesc || '无'}`);
//                     }
//                 }
//             } catch (e) {}
//             return Reflect.set(target, property, newValue, receiver);
//         }
//     });
// }

function Window(tagName) {}

window=globalThis
window.top=window
window.self=window

function obj_toString(obj,name) {
    Object.defineProperty(obj, Symbol.toStringTag, {
        value: name,
    })
}

let set_native = function set_native(func, key, value) {
    Object.defineProperty(func, key, {
        "enumerable": false,
        'configurable': true,
        'writable': true,
        'value': value
    })
}

let my_symbol = Symbol('(HD 236300)_' + Math.random());
set_func_native = (func) => {
    set_native(func, my_symbol, `function ${func.name || ''}() { [native code] }`);
}

Object.setPrototypeOf(window,Window.prototype);
window.addEventListener=function (type, func) {
    console.log("window.addEventListener:",type, func);
}
window.MutationObserver = function() { return { observe: function() {} } };
window.attachEvent = undefined;

ActiveXObject=function ActiveXObject() {};set_func_native(ActiveXObject,"ActiveXObject");Window.prototype.ActiveXObject=ActiveXObject.prototype;
addEventListener=function addEventListener(tagName) {
        console.log('document.addEventListener("' + tagName + '")')
};set_func_native(addEventListener,"addEventListener");Window.prototype.addEventListener=addEventListener.prototype;
DOMParser=function DOMParser() {};set_func_native(DOMParser,"DOMParser");Window.prototype.DOMParser=DOMParser.prototype;
HTMLCanvasElement=function HTMLCanvasElement() {};set_func_native(HTMLCanvasElement,"HTMLCanvasElement");Window.prototype.HTMLCanvasElement=HTMLCanvasElement.prototype;
CanvasRenderingContext2D=function CanvasRenderingContext2D() {};set_func_native(CanvasRenderingContext2D,"CanvasRenderingContext2D");Window.prototype.CanvasRenderingContext2D=CanvasRenderingContext2D.prototype;
IDBFactory=function IDBFactory() {};set_func_native(IDBFactory,"IDBFactory");Window.prototype.indexedDB=IDBFactory.prototype;
webkitRequestFileSystem=function webkitRequestFileSystem() {};set_func_native(webkitRequestFileSystem,"webkitRequestFileSystem");Window.prototype.webkitRequestFileSystem=webkitRequestFileSystem.prototype;
Request=function Request() {};set_func_native(Request,"Request");Window.prototype.Request=Request.prototype;
XR=function XMLHttpRequest() {};XMLHttpRequest=new XR();
XMLHttpRequest.__proto__.open=function open(tagName){
        console.log('XMLHttpRequest.open("' + tagName + '")')
    }
XMLHttpRequest.__proto__.send=function send(tagName){
        console.log('XMLHttpRequest.send("' + tagName + '")')
     }
set_func_native(XMLHttpRequest,"XMLHttpRequest");Window.prototype.XMLHttpRequest=XMLHttpRequest.prototype;

Storage = function Storage(){};
localStorage = {}; localStorage.__proto__ = Storage.prototype;
sessionStorage = {}; sessionStorage.__proto__ = Storage.prototype;
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

Object.defineProperty(Window.prototype,'clearInterval',{
        writable: true,
        enumerable: true,
        configurable: true,
        value: function clearInterval(tagName){
            console.log('document.clearInterval("' + tagName + '")')

        }
})
Object.defineProperty(Window.prototype,'name',{
    get : function (){
        return "";
    }
})
Object.defineProperty(Window.prototype,'chrome',{
    get : function (){
        return watch({},"chrome");
    }
})
Window.prototype.outerWidth= 1536;Window.prototype.outerWidth.toString=()=>1536
Window.prototype.innerHeight=695;Window.prototype.innerHeight.toString=()=>695
Window.prototype.innerWidth=587;Window.prototype.innerWidth.toString=()=>587
Window.prototype.outerHeight=816;Window.prototype.outerHeight.toString=()=>816
Window.prototype.TEMPORARY=0;Window.prototype.TEMPORARY.toString=()=>0
Window.prototype.HTMLFormElement=function HTMLFormElement() {}

window.setInterval=function setInterval(){}
window.setTimeout=function setTimeout(){}

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

Object.defineProperty(HTMLDocument.prototype,'createElement',{
        writable: true,
        enumerable: true,
        configurable: true,
        value: function createElement(tagName){
            console.log('document.createElement("' + tagName + '")')
            if (tagName === "div"){
                div={
                    getElementsByTagName:function(tagName) {
                        console.log('div.getElementsByTagName("' + tagName + '")')
                        if (tagName=="i"){
                            return { length: 0 }
                        }
                        else if(tagName=="base"){
                            return []
                        }
                    },
                    style:watch({},"style"),
                    setAttribute:function setAttribute(tagName){
                        console.log('div.setAttribute("' + tagName + '")')
                    },
                    addBehavior:function addBehavior(tagName){
                        console.log('div.addBehavior("' + tagName + '")')
                    },
                    load:function(tagName){
                        console.log('div.load("' + tagName + '")')
                    },
                    getAttribute:function getAttribute(tagName){
                        console.log('div.getAttribute("' + tagName + '")')
                    }
                    };div.__proto__=HTMLDivElement.prototype;set_native(HTMLDivElement,"HTMLDivElement");
                }
                return watch(div,"div")
            }
})
Object.defineProperty(HTMLDocument.prototype,'appendChild',{
        writable: true,
        enumerable: true,
        configurable: true,
        value: function appendChild(tagName){
            console.log('document.appendChild("' + tagName + '")')
        }
})
Object.defineProperty(HTMLDocument.prototype,'removeChild',{
        writable: true,
        enumerable: true,
        configurable: true,
        value: function removeChild(tagName){
            console.log('document.removeChild("' + tagName + '")')
        }
})
Object.defineProperty(HTMLDocument.prototype,'getElementsByTagName',{
        writable: true,
        enumerable: true,
        configurable: true,
        value: function getElementsByTagName(tagName){
            console.log('document.getElementsByTagName("' + tagName + '")')
            if (tagName=="script"){
                return [
                    watch({
                        getAttribute:function (tagName) {
                            console.log('script1.getAttribute("' + tagName + '")')
                            if (tagName==="r"){
                                return "m"
                            }
                        },
                        parentElement:watch({
                            removeChild:function(tagName){}
                        },"script1.parentElement")
                },"script1"),
                    watch({
                        getAttribute:function(tagName ){
                             console.log('script2.getAttribute("' + tagName + '")')
                            if (tagName==="r"){
                                return "m"
                            }
                        },
                        parentElement:watch({
                            removeChild:function(tagName){}
                        },"script2.parentElement")
                    },"script2"),
                ]
            }else if(tagName==="base"){
                return []
            }
        }
})
Object.defineProperty(HTMLDocument.prototype,'getElementById',{
        writable: true,
        enumerable: true,
        configurable: true,
        value: function getElementById(tagName) {
            console.log('document.getElementById("' + tagName + '")')
            if (tagName==="K5MK4FPPNWrv"){
                return watch({
                    content:content,
                    getAttribute:function (tagName) {
                         console.log('meta.getAttribute("' + tagName + '")')
                            if (tagName==="r"){
                                return "m"
                        }
                    },
                    parentNode:watch({
                        removeChild:function(tagName){}
                    },"meta.parentElement")
                },"meta")
            }else if(tagName === 'root-hammerhead-shadow-ui') return null;
            return null;
        }
})
Object.defineProperty(HTMLDocument.prototype,'documentElement',{
        writable: true,
        enumerable: true,
        configurable: true,
        value: function documentElement(tagName) {
            console.log('document.documentElement("' + tagName + '")')
        }
})
Object.defineProperty(HTMLDocument.prototype,'addEventListener',{
        writable: true,
        enumerable: true,
        configurable: true,
        value: function addEventListener(tagName) {
            console.log('document.addEventListener("' + tagName + '")')
            if(tagName==="load"){

            }
        }
})
Object.defineProperty(HTMLDocument.prototype,'referrer',{
        writable: true,
        enumerable: true,
        configurable: true,
        value: 'http://epub.cnipa.gov.cn/'
})
HTMLDocument.prototype.cookie=""
HTMLDocument.prototype.visibilityState='visible';HTMLDocument.prototype.visibilityState.toString=()=>'visible'
document=new HTMLDocument()

History=function History(){
    this.length=40
    this.scrollRestoration="auto"
    this.state=null
    this.replaceState=function replaceState(tagName){}
};
history=new History
history=watch(history,"history")
obj_toString(history,"History")

Location=function Location(){
    this.ancestorOrigins={}
    this.href="http://epub.cnipa.gov.cn/Dxb/IndexQuery"
    this.origin="http://epub.cnipa.gov.cn"
    this.protocol="http:"
    this.host="epub.cnipa.gov.cn"
    this.hostname="epub.cnipa.gov.cn"
    this.port=""
    this.pathname="/Dxb/IndexQuery"
    this.search=""
    this.hash=""
}
location=new Location
location.__proto__=Location.prototype;

// Navigator=function Navigator(){
//     this.userAgent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
//     this.webkitPersistentStorage=function () {},
//     this.webdriver=false,
//     this.platform='Win32',
//     this.appVersion='5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
//     this.maxTouchPoints=0,
//     this.languages=['zh-CN', 'zh']
// }
// NetworkInformation=function NetworkInformation(){
//         this.downlink= 10,
//         this.effectiveType= "4g",
//         this.onchange= null,
//         this.rtt= 0,
//         this.saveData= false
// }
// navigator =new Navigator(); navigator.__proto__ = Navigator.prototype;
// Navigator.prototype.connection=NetworkInformation.prototype;

function Navigator(){};
function webdriver_func() { return false; }
webdriver_func.toString = function() { return 'function webdriver() { [native code] }'; };
Object.defineProperty(Navigator.prototype, 'webdriver', {
    configurable: true, enumerable: true,
    get: webdriver_func
});
navigator = new Navigator();
Object.assign(navigator, {
    appCodeName: "Mozilla", appName: "Netscape",
    appVersion: "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
    cookieEnabled: true, deviceMemory: 8, language: "zh-CN", languages: ["zh-CN", "en", "zh"],
    onLine: true, platform: "Win32", product: "Gecko", productSub: '20030107',
    userAgent: "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
    vendor: "Google Inc.", vendorSub: "",maxTouchPoints:1,connection:watch({downlink:10,effectiveType:'4g',rtt:350,saveData:false},'connection'),

});


navigator=watch(navigator,"navigator")
obj_toString(navigator,"Navigator")
window=watch(window,"window")
obj_toString(window,"Window")
document=watch(document,"document")
obj_toString(document,"HTMLDocument")
location=watch(location,"location")
obj_toString(location,"Location")

// get_enviroment(proxy_array)

"ts_code"


"functo_code"


// require('../rs-code/专利')


function rs6(){
    return document.cookie
    // console.debug(document.cookie)
}
// rs6()
//
// cook=rs6()
// console.log(cook.length+" | "+ cook );




