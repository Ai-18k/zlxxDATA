delete __dirname;
delete __filename;

content="content_code"
// content = "6Pm6p7lCUMbM8zAN_Btl50cWMmLTyJb.se71Evh9YOfi2TB2wGetLT2cyZrXMt7GdkvR3uc4ELqhsX0f0B0Qfq"

!(function(){
    "use strict";
    const $toString = Function.toString;
    const myFunction_toString_symbol = Symbol('('.concat('',')_',(Math.random()+'').toString(36)));
    const mytoString = function(){
        return typeof this == 'function' && this[myFunction_toString_symbol] || $toString.call(this);
    };
    function set_native(func,key,value){
        Object.defineProperty(func,key,{
            "enumerable" : false,
            "configurable" : true,
            "writable" : true,
            "value" : value
        })
    };
    delete Function.prototype['toString'];
    set_native(Function.prototype,"toString",mytoString);
    set_native(Function.prototype.toString,myFunction_toString_symbol,"function toString() { [native code] }");
    this.func_set_native = function (func)  {
        set_native(func,myFunction_toString_symbol,`function ${myFunction_toString_symbol,func.name || ''}() { [native code] }`)
    }
}).call(this);

window = this;

delete global;

Object.defineProperties(window, {
    [Symbol.toStringTag]: {
        value: 'Window',
        configurable: true
    }
});

l_obj = {

};

l_input = {

};

l2_input = {

};

l3_input = {

};

var form = {
};

form_action = '';

Object.defineProperty(form, 'action',{
    get() {
        console.log('form->action.get--------->', l_input)
        return l_input;
    },
    set(v) {
        console.log('form->action.set--------->', v)
        form_action = v;
    }
});

form_textContent = {};

Object.defineProperty(form, 'textContent',{
    get() {
        console.log('form->textContent.get--------->', l2_input)
        return l2_input;
    },
    set(v) {
        console.log('form->textContent.set--------->', v)
        form_action = v;
    }
});

form_id = '';

Object.defineProperty(form, 'id',{
    get() {
        console.log('form->id.get--------->', l3_input)
        return l3_input;
    },
    set(v) {
        console.log('form->id.set--------->', v)
        form_id = v;
    }
});

form_innerText = '';

Object.defineProperty(form, 'innerText',{
    get() {
        console.log('form->innerText.get--------->', l3_input)
        return l3_input;
    },
    set(v) {
        console.log('form->innerText.set--------->', v)
        form_innerText = v;
    }
});


a_labl = {
    //去浏览器里拿
    href: 'xxxxxxxxxxxxxx',
    protocol: 'https:',
    port: '',
    //去浏览器里拿
    hostname: 'xxxxxxxxxxxxxxx',
    //去浏览器里拿
    pathname: 'xxxxxxxxxxxxxxx'
}

window.HTMLAnchorElement = function (){};

scripts = [
                {
                    type: "text/javascript",
                    r: 'm',
                    parentElement: {
                        getAttribute: function(args) {
                            console.log('head1->parentElement->getAttribute: ', args)
                            console.log(arguments)
                            debugger;
                            if (args == 'r')
                            {
                                return 'm';
                            }
                        },
                        getElementsByTagName: function(args) {
                            console.log('head1->getElementsByTagName: ', args)
                            console.log(arguments)
                            debugger
                        },
                         removeChild: function (args) {
                            console.log('head1->parentElement->removeChild', args);
                            console.log(arguments);
                            debugger;
                        },
                    },
                    getAttribute: function(args) {
                        console.log('script1->getAttribute: ', args)
                        console.log(arguments)
                        debugger;
                        if (args == 'r')
                        {
                            return 'm';
                        }
                    }
                },
                {
                    type: "text/javascript",
                    r: 'm',
                    parentElement: {
                         getAttribute: function(args) {
                            console.log('head2->parentElement->getAttribute: ', args);
                            console.log(arguments);
                            debugger;
                        },
                        getElementsByTagName: function(args) {
                            console.log('head2->getElementsByTagName: ', args);
                            console.log(arguments);
                            debugger
                        },
                         removeChild: function (args) {
                            console.log('head2->parentElement->removeChild', args);
                            console.log(arguments);
                            debugger;
                        },
                    },
                    getAttribute: function(args) {
                        console.log('script2->getAttribute: ', args);
                        console.log(arguments);
                        debugger;
                        if (args == 'r')
                        {
                            return 'm';
                        }
                    },
                    //去浏览器里拿
                    src: "xxxxxxxxxx",
                }
            ]

var input_count = 0;

var l_meta = {
        id: 'FbkwzLN5XOx0',
        // content: 'tyGGg5AdQlANmSX9z3xbpGEoEKVuG9rmj_VCz71ozkpQ9tph9oDZE2RjIwQz8iL5oWgiCSPtU67jWlcPgf7DyTWP8X_.29Z5B0y9OtqwW4e6THU9dqdapsjx4a81rlUo',
        content:content,
        r: 'm',
        getAttribute: function(args)
        {
             console.log('meta->getAttribute: ', args);
             console.log(arguments);
             debugger;
             if (args == 'r')
             {
                return 'm';
             }
        },
        parentNode: {
             removeChild: function (args) {
                console.log('meta->parentNode->removeChild', args)
                debugger;
                return {};
            },
        }
}

div_i = [];

div = {
    getElementsByTagName:function (args)
    {
        console.log('document->div->getElementsByTagName', args)
        console.log(arguments)
        debugger;
        if(args === "i"){
            return div_i;
        }
    }
}

doc_base = [

]

Document = function Document(){}

Object.defineProperty(Document.prototype,'createElement',{
    configurable: true,
    enumerable: true,
    value: function createElement(args) {
        console.log('document->createElement', args)
        console.log(arguments);
        debugger;
        if (args == 'div')
        {
            return div;
        }
        else if (args == 'form')
        {
            return form;
        }
        else if (args == 'input')
        {
            if (input_count == 0)
            {
                input_count++;
                return l_input;
            }
            else if (input_count == 1)
            {
                input_count++;
                return l2_input;
            }
            else if (input_count == 2)
            {
                return l3_input;
            }
        }
        else if (args == 'a')
        {
            return a_labl;
        }
        else
        {
            return l_obj;
        }
    },
    writable: true,
})

const v8 =require('v8');
const vm= require('vm');
v8.setFlagsFromString('--allow-natives-syntax');
let undetectable = vm.runInThisContext("%GetUndetectable()");
v8.setFlagsFromString('--no-allow-natives-syntax');

Object.defineProperty(Document.prototype,'all',{
    configurable: true,
    enumerable: true,
    value: undetectable,
    writable: true,
})

Object.defineProperty(Document.prototype,'body',{
    configurable: true,
    enumerable: true,
    value: null,
    writable: true,
})

Object.defineProperty(Document.prototype,'visibilityState',{
    configurable: true,
    enumerable: true,
    value: 'hidden',
    writable: true,
})

Object.defineProperty(Document.prototype,'toString',{
    configurable: true,
    enumerable: true,
    value: function toString() {return '[object HTMLDocument]';},
    writable: true,
})

Object.defineProperty(Document.prototype,'addEventListener',{
    configurable: true,
    enumerable: true,
    value: function addEventListener(args) {
        console.log('document->addEventListener', args)
        console.log(arguments);
        debugger;
        return {};
    },
    writable: true,
})

documentElement = {};
Object.defineProperty(Document.prototype,'documentElement',{
    configurable: true,
    enumerable: true,
    // value: function documentElement(args) {
    //     console.log('document->documentElement', args)
    //     console.log(arguments);
    //     debugger;
    //     return {};
    // },
    value:documentElement,
    writable: true,
})

Object.defineProperty(Document.prototype,'appendChild',{
    configurable: true,
    enumerable: true,
    value: function appendChild(args) {
        console.log('document->appendChild', args)
        console.log(this)
        console.log(arguments);
        debugger;
        return {};
    },
    writable: true,
})


Object.defineProperty(Document.prototype,'removeChild',{
    configurable: true,
    enumerable: true,
    value: function removeChild(args) {
        console.log('document->removeChild', args)
        console.log(arguments);
        debugger;
        return {};
    },
    writable: true,
})

frist_get_script = 1;
Object.defineProperty(Document.prototype,'getElementsByTagName',{
    configurable: true,
    enumerable: true,
    value: function getElementsByTagName(args) {
        console.log('document->getElementsByTagName: ', args);
        console.log(arguments)
        debugger
        if (args == 'script')
        {
            if (frist_get_script == 1)
            {
                frist_get_script = 0;
                return scripts;
            }
            return [];
        }
        if (args === 'base') {
            debugger;
            return doc_base;
        }
        return [];
    },
    writable: true,
})

Object.defineProperty(Document.prototype,'getElementById',{
    configurable: true,
    enumerable: true,
    value: function getElementById(args) {
        console.log('document->getElementById', args)
        console.log(arguments);
        debugger;
        return l_meta;
    },
    writable: true,
})


HTMLDocument = function HTMLDocument(){}

Object.setPrototypeOf(HTMLDocument.prototype,Document.prototype)
document = new HTMLDocument()
// console.log(document.createElement('script'));

Object.defineProperty(document.all,'length',{
    get : function (){
        console.log('document.all.length ------------------------------------->')
        return Object.keys(document.all).length
    }
})

document.all[0] = null;
document.all[1] = null;
document.all[2] = null;
document.all[3] = null;
document.all[4] = null;
document.all[5] = null;

// document.all = [{},{},{},{},{},{}];

function Window(){};

window.Window = Window;

window.__proto__ = Window.prototype;

_null = function (){
    debugger;
    console.log(arguments)
    return {};
}

_mutationObserver = {
    observe:function(args)
    {
        console.log('_mutationObserver->observe', args)
        console.log(arguments);
        return {};
    }
};

window.innerHeight = 945;
window.innerWidth = 1920;
window.outerHeight = 1022;
window.outerWidth = 1910;
window.TEMPORARY = 0;

window.MutationObserver = function(args)
{
    console.log('window->mutationObserver', args)
    console.log(arguments);
    return _mutationObserver;
}

CanvasRenderingContext2D = function () {

};

getImageData = {
    toString() {
        console.log('getImageData');
        return 'function getImageData() { [native code] }'
    }
}

Object.defineProperty(CanvasRenderingContext2D.prototype,'getImageData',{
    get : function (){
        return getImageData;
    }
})

HTMLCanvasElement = function () {

};

toBlob = {
    toString() {
        console.log('toBlob');
        return 'function toBlob() { [native code] }'
    }
}

toDataURL = {
    toString() {
        console.log('toDataURL');
        return 'function toDataURL() { [native code] }'
    }
}

Object.defineProperty(HTMLCanvasElement.prototype,'toBlob',{
    get : function (){
        return toBlob;
    }
})

Object.defineProperty(HTMLCanvasElement.prototype,'toDataURL',{
    get : function (){
        return toDataURL;
    }
})

window.CanvasRenderingContext2D = CanvasRenderingContext2D;
window.HTMLCanvasElement = HTMLCanvasElement;

WebSocket = function(args)
{
    console.log('WebSocket ----------------------->', args);
    return {};
}

window.WebSocket = WebSocket;

webkitRequestFileSystem = _null;

window.webkitRequestFileSystem = webkitRequestFileSystem;

chrome = {};
window.chrome = chrome;

//去浏览器里拿
location = {
    "ancestorOrigins": {},
    "href": "xxxxxxxx",
    "origin": "xxxxxxxx",
    "protocol": "https:",
    "host": "xxxxxxxx",
    "hostname": "xxxxxxxx",
    "port": "",
    "pathname": "xxxxxxxx",
    "search": "xxxxxxxx",
    "hash": ""
}

window.top = window;
window.self = window;

navigator = {
    appCodeName: "Mozilla",
    appName: "Netscape",
    appVersion: "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    connection: {
       downlink: 2.4,
       effectiveType: "4g",
       onchange: null,
        rtt: 50,
        saveData: false
    },
    cookieEnabled: true,
    deprecatedRunAdAuctionEnforcesKAnonymity: true,
    deviceMemory: 8,
    doNotTrack: null,
    hardwareConcurrency: 22,
    languages: ["zh-CN", "en", "zh"],
    language: "zh-CN",
    onLine: true,
    platform: "Win32",
    product: "Gecko",
    productSub: '20030107',
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    vendor: "Google Inc.",
    vendorSub: "",
    // webdriver: false,
    webkitPersistentStorage: {},
    getBattery: function() {return {then(){}}}
};

function Naviator(){};

Object.defineProperties(Naviator.prototype,{})

function webdriver()
{
    console.log("webdriver--------------------->");
    return false;
}

webdriver.toString = function () {return 'false'}

Object.defineProperty(Naviator.prototype, 'webdriver',{
    [Symbol.toStringTag]: {
        value: 'webdriver',
        configurable: true
    },
    configurable:true,
    enumerable: true,
    get: webdriver
});

navigator.__proto__ = Naviator.prototype;


Object.defineProperties(navigator, {
    [Symbol.toStringTag]: {
        value: 'webdriver',
        configurable: true
    }
})


window.navigator = navigator;

window["clientInformation"] = navigator;

window.location = location;

window.history = {
    length: 2,
    state: null,
    scrollRestoration: "auto",
    replaceState: _null,
}

screen = {
    availHeight: 1392,
    availLeft: 1536,
    availTop: 0,
    availWidth: 2560,
    colorDepth: 24,
    height: 1440,
    isExtended: true,
    onchange: null,
    orientation: {angle: 0, type: 'landscape-primary', onchange: null},
    pixelDepth: 24,
    width: 2560
}

window.screen = screen;

window.DOMParser = function ()
{
    debugger;
    return {};
}

window.XMLHttpRequest = function () {
    debugger;
    return {}
}

localStorage = {
    length: 0,
    removeItem: function () {
        console.log('localStorage->removeItem')
        console.log(arguments);
    },
    setItem: function () {
        console.log('localStorage->setItem');
        console.log(arguments);
        this[arguments[0]] = arguments[1];
        console.log(this);
    },
    getItem: function (args) {
        console.log('localStorage->getItem')
        console.log(arguments);
        return this[args];
    },
}
sessionStorage = {
    length: 0,
    removeItem: function () {
        console.log('localStorage->removeItem')
        console.log(arguments);
    },
    setItem: function () {
        console.log('localStorage->setItem');
        console.log(arguments);
        this[arguments[0]] = arguments[1];
        console.log(this);
    },
    getItem: function (args) {
        console.log('localStorage->getItem')
        console.log(arguments);
        console.log(this[args]);
        return this[args];
    },
}

window.localStorage = localStorage;
window.sessionStorage = sessionStorage;
window.name = '$_YWTU=7nXC8M_ZRylQDpM8YlUdxPdHlh7M_t8lWHF71cWe4Q7&$_YVTX=Js3&vdFm='

indexedDB = {
    open: function (args) {
        console.log('indexedDB->open---------------->');
        // return {};
        return indexedDB;
    }
}

window.indexedDB = indexedDB;


window.addEventListener = function (args)
{
    console.log('window->addEventListener: ', args)
    debugger;
    return {};
}

window.attachEvent = undefined;


window.Request = function (args)
{
    console.log('window->Request: ', args)
    debugger;
    return {};
}

window.fetch  = function (args)
{
    console.log('window->fetch: ', args)
    debugger;
    return {};
}


window.setInterval = _null;
window.setTimeout = _null;

window.document = document;

//$_ts=window['$_ts']内容
require('../rs-code/专利')

//外链js内容
// require('./link')

function get_cookie()
{
    return document.cookie;
}

Object.defineProperties(Window.prototype, {
    [Symbol.toStringTag]: {
        value: "Window",
        writable: true,
        enumerable: false,
        configurable: true
    }
})
Object.defineProperty(window, 'Window', {
    configurable: true,
    enumerable: false,
    writable: true,
    value: function Window() {
    }
})
Object.defineProperty(Window.prototype, 'PERSISTENT', {
    configurable: false,
enumerable: true,
value: 1,
writable: false,
})
Object.defineProperty(Window.prototype, 'TEMPORARY', {
    configurable: false,
enumerable: true,
value: 0,
writable: false,
})
window.__proto__ = Window.prototype

ondevicemotion = null
Object.defineProperty(window, 'outerHeight', {
    configurable: true,
    enumerable: true,
    get: function outerHeight() {
        return 834
    },
    set: function outerHeight(value) {
        this.outerHeight = value
    },
})
Object.defineProperty(window, 'outerWidth', {
    configurable: true,
    enumerable: true,
    get: function outerHeight() {
        return 1536
    },
    set: function outerHeight(value) {
        this.outerWidth = value
    },
})
Object.defineProperty(window, 'innerHeight', {
    configurable: true,
    enumerable: true,
    get: function innerHeight() {
        return 760
    },
    set: function innerHeight(value) {
        this.innerHeight = value
    },
})
Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    enumerable: true,
    get: function innerWidth() {
        return 1470
    },
    set: function innerWidth(value) {
        this.innerWidth = value
    },
})
Object.defineProperty(window, 'screenLeft', {
    configurable: true,
    enumerable: true,
    get: function screenLeft() {
        return 0
    },
    set: function screenLeft(value) {
        this.screenLeft = value
    },
})
Object.defineProperty(window, 'screenTop', {
    configurable: true,
    enumerable: true,
    get: function screenTop() {
        return 0
    },
    set: function screenTop(value) {
        this.screenTop = value
    },
})
Object.defineProperty(window, 'screenX', {
    configurable: true,
    enumerable: true,
    get: function screenX() {
        return 0
    },
    set: function screenX(value) {
        this.screenX = value
    },
})
Object.defineProperty(window, 'screenY', {
    configurable: true,
    enumerable: true,
    get: function screenY() {
        return 0
    },
    set: function screenY(value) {
        this.screenY = value
    },
})
// delete global
delete require
delete __filename;
delete __dirname;
ActiveXObject = undefined

Storage = function Storage(){};
Object.defineProperty(window, 'Storage', {
    configurable: true,
    enumerable: false,
    writable: true,
    value: function Storage() {
    }
})
Object.defineProperties(Storage.prototype, {
    [Symbol.toStringTag]: {
        value: "Storage",
        writable: true,
        enumerable: false,
        configurable: true
    }
})

Object.defineProperty(Storage.prototype, 'setItem', {
    configurable: true,
    enumerable: true,
    writable: true,
    value: function setItem(key, value) {
        this[key] = value
    }
})
Object.defineProperty(Storage.prototype, 'getItem', {
    configurable: true,
    enumerable: true,
    writable: true,
    value: function getItem(key, value) {
        return this[key]
    }
})


console.log(get_cookie());