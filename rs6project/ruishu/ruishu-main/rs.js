content="SHCFQOExXvQW39oBhl_pNlUeRLwFOYxQyh5ATAjsrG9869CcXKJkQ7scXZOyDceRjBm.4EvcF8U0dygHTUSxwtOP8djvvC5mnxcVhc4ltV4mTfUHJADxv7R95WF3fwwYXTMZWGMRbTM_6Xa9radzqA"


!(()=> {
    'use strict';
    const $toString = Function.toString
    const syString = Symbol('ToString')

    function ToString() {
        return typeof this == 'function' && this[syString] || $toString.call(this)
    }

    function to_native(fun, key, value) {
        Object.defineProperty(fun, key, {
            value: value,
            writable: false, // 可选，设置为不可写
            enumerable: false, // 可选，设置为不可枚举
            configurable: true, // 可选，设置为可配置
        });
    }

    delete Function.prototype['toString'];
    to_native(Function.prototype, 'toString', ToString)
    to_native(Function.prototype.toString, syString, "function toString() { [native code] }");
    to_native(Function.prototype.toString, 'name', "toString");

    global.fun_to_native=function (fun) {
        to_native(fun, syString, `function ${fun.name}() { [native code] }`)
    }
})(global)

getOwnPropertyDescriptor_=Object.getOwnPropertyDescriptor
Object.getOwnPropertyDescriptor=function getOwnPropertyDescriptor(obj, prop){
    if(prop=='webdriver'&&obj==navigator){
        console.log('navigator.webdriver=>',undefined)
        return undefined
    }
    // console.log('Navigator.prototype.webdriver=>')
    return getOwnPropertyDescriptor_(obj, prop)
}
fun_to_native(Object.getOwnPropertyDescriptor)

setInterval = function () {
    // console.log('setInterval被调用')
};
fun_to_native(setInterval)
setTimeout = function (){
    // console.log('setTimeout被调用')
}
fun_to_native(setTimeout)
fun_to_native(clearInterval)
function EventTarget(){}
addEventListener=function addEventListener() {
    // console.log('addEventListener=>',arguments)
}
fun_to_native(addEventListener)
dispatchEvent=function dispatchEvent() {
    // console.log('dispatchEvent=>',arguments)
    return ""
}
fun_to_native(dispatchEvent)
removeEventListener=function removeEventListener(){
    // console.log('removeEventListener=>',arguments)
    return ""
}
fun_to_native(removeEventListener)

EventTarget.prototype={
    addEventListener:addEventListener,
    dispatchEvent:dispatchEvent,
    removeEventListener:removeEventListener,
    constructor:EventTarget,
}
// EventTarget.prototype.__proto__=Object
Object.defineProperty(EventTarget.prototype, Symbol.toStringTag, {
    value: 'EventTarget',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(EventTarget)

WindowProperties=new EventTarget()
Object.defineProperty(WindowProperties, Symbol.toStringTag, {
    value: 'WindowProperties',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});

function Window(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {

    }
} //不能new
Window.__proto__=EventTarget
Window.prototype.__proto__=WindowProperties
Window.prototype.PERSISTENT=1
Window.prototype.TEMPORARY=0
// Window.prototype.__proto__=WindowProperties
Object.defineProperty(Window.prototype, Symbol.toStringTag, {
    value: 'Window',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(Window)

window=global
Object.defineProperty(window, Symbol.toStringTag, {
    value: 'window',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
window.__proto__=Window.prototype
window.setInterval=setInterval
window.setTimeout=setTimeout

window.innerHeight = 695
window.innerWidth = 318
window.outerHeight = 816
window.outerWidth = 1536


function Node(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {

  }
}   //不能new
Node.__proto__=EventTarget
Node.prototype.__proto__=EventTarget.prototype
Node.prototype.ATTRIBUTE_NODE=2
Object.defineProperty(Node.prototype, Symbol.toStringTag, {
    value: 'Node',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
appendChild=function appendChild(val){
    if(val==undefined){
        throw new Error("Failed to execute 'appendChild' on 'Node': 1 argument required, but only 0 present.")
    }
    this[this.i]=val
    this.i++
    if(val.name=='action'){
        this.action=val
    }
    if(val.name=='textContent'){
        this.textContent=val
    }
    if(val.name=='id'){
        this.id=val
        this.innerText=val
    }
    console.log('document.appendChild=>',this)
    return this
}
fun_to_native(appendChild)
Object.defineProperty(Node.prototype, 'appendChild', {
    value: appendChild,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
removeChild=function removeChild(val){
    if(val==undefined){
        throw new Error("Failed to execute'removeChild' on 'Node': 1 argument required, but only 0 present.")
    }
    // console.log('removeChild=>',val)
    return val
}
fun_to_native(removeChild)
Object.defineProperty(Node.prototype, 'removeChild', {
    value: removeChild,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(Node)
// console.log(Node)

function Document(){}  //能new
Document.__proto__=Node
Document.prototype.__proto__=Node.prototype
Document.prototype.URL=''
Object.defineProperty(Document.prototype, Symbol.toStringTag, {
    value: 'Document',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});

createElement = function createElement(val,a) {
    if(val==undefined){
        throw new Error("Failed to execute 'createElement' on 'Document': 1 argument required, but only 0 present.")
    }
    console.log('document.createElement=>',val)
    if (val === 'div') {
        div = {innerHTML:'',i:0};
        div.__proto__=HTMLDivElement.prototype
        return div
    }
    if (val === 'a') {
        a={innerHTML:'',i:0,protocol:'https:',host:'autopp.tpi.cntaiping.com', hostname:'autopp.tpi.cntaiping.com',port:"",search:"",hash:"",pathname:'/api/system/jwt/auth', href:'https://autopp.tpi.cntaiping.com/api/system/jwt/auth'};
        a.__proto__=HTMLAnchorElement.prototype
        return a
    }
    if (val === 'form') {
        form={innerHTML:'',i:0};
        form.__proto__=HTMLFormElement.prototype
        window['__Zm9ybS5pZAo__'] = form
        return form
    }
    if (val === 'input') {
        input={innerHTML:'',i:0};
        input.__proto__=HTMLInputElement.prototype
        console.log(input)
        return input
    }
}
fun_to_native(createElement)
Object.defineProperty(Document.prototype, 'createElement', {
    value: createElement,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
getElementsByTagName = function getElementsByTagName(val) {
    docuall=[]
    docuall.__proto__=HTMLCollection.prototype
    let i=0
    let j=0
    while(1){
        if(document.all[i]==undefined){
            break
        }
        if(document.all[i].tagName.toLowerCase()==val.toLowerCase()){
            docuall[j]=document.all[i]
            j++
        }
        i++
    }
    console.log('document.getElementsByTagName=>',val,docuall)
    return docuall
}
fun_to_native(getElementsByTagName)
Object.defineProperty(Document.prototype, 'getElementsByTagName', {
    value: getElementsByTagName,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
getElementById = function getElementById(val) {
    if(val==undefined){
        throw new Error("Failed to execute 'getElementById' on 'Document': 1 argument required, but only 0 present.")
    }
    // console.log('document.getElementById=>',val)
    if(val=='root-hammerhead-shadow-ui'){
        return null
    }

}
fun_to_native(getElementById)
Object.defineProperty(Document.prototype, 'getElementById', {
    value: getElementById,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(Document)

Element=function Element(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {

  }
}  //不能new
Element.__proto__=Node
Element.prototype.__proto__=Node.prototype
Object.defineProperty(Element.prototype, Symbol.toStringTag, {
    value: 'Element',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(Element.prototype, Symbol.unscopables, {
    value: {after:true,
            append:true,
            before:true,
            prepend:true,
            remove:true,
            replaceChildren:true,
            replaceWith:true,
            slot:true},
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
getAttribute=function getAttribute(val){
    if(val==undefined){
        throw new Error("Failed to execute 'getAttribute' on 'Element': 1 argument required, but only 0 present.")
    }
    if (this[val] == undefined){
        return null
    }
    console.log('getAttribute=>',val,this[val])
    return this[val]
}
fun_to_native(getAttribute)
Object.defineProperty(Element.prototype, 'getAttribute', {
    value: getAttribute,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});

setAttribute=function getAttribute(val){
    if(val==undefined){
        throw new Error("Failed to execute 'setAttribute' on 'Element': 1 argument required, but only 0 present.")
    }
    console.log('setAttribute=>',val,this[val])
    return this[val]
}
fun_to_native(setAttribute)
Object.defineProperty(Element.prototype, 'setAttribute', {
    value: setAttribute,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});

getElementsByTagName = function getElementsByTagName(val) {
    docuall=[]
    docuall.__proto__=HTMLCollection.prototype
    let i=0
    let j=0
    while(1){
        if(document.all[i]==undefined){
            break
        }
        if(document.all[i].tagName.toLowerCase()==val.toLowerCase()){
            docuall[j]=document.all[i]
            j++
        }
        i++
    }
    console.log('document.getElementsByTagName=>',val,docuall)
    return docuall
}
fun_to_native(getElementsByTagName)
Object.defineProperty(Element.prototype, 'getElementsByTagName', {
    value: getElementsByTagName,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(Element)

HTMLElement=function HTMLElement(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {
  }
}  //不能new
HTMLElement.__proto__=Element
HTMLElement.prototype.__proto__=Element.prototype
Object.defineProperty(HTMLElement.prototype, Symbol.toStringTag, {
    value: 'HTMLElement',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(HTMLElement)

HTMLFormElement=function HTMLFormElement(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {

  }
}
HTMLFormElement.__proto__=HTMLElement
HTMLFormElement.prototype.__proto__=HTMLElement.prototype
Object.defineProperty(HTMLFormElement.prototype, Symbol.toStringTag, {
    value: 'HTMLFormElement',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(HTMLFormElement)

HTMLHtmlElement=function HTMLHtmlElement(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {
  }
}  //不能new
HTMLHtmlElement.__proto__=HTMLElement
HTMLHtmlElement.prototype.__proto__=HTMLElement.prototype
Object.defineProperty(HTMLHtmlElement.prototype, Symbol.toStringTag, {
    value: 'HTMLHtmlElement',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(HTMLHtmlElement)

HTMLInputElement=function HTMLInputElement(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {
  }
}  //不能new
HTMLInputElement.__proto__=HTMLElement
HTMLInputElement.prototype.__proto__=HTMLElement.prototype
Object.defineProperty(HTMLInputElement.prototype, Symbol.toStringTag, {
    value: 'HTMLInputElement',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(HTMLInputElement)

HTMLDivElement=function HTMLDivElement(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {
  }
}  //不能new
HTMLDivElement.__proto__=HTMLElement
HTMLDivElement.prototype.__proto__=HTMLElement.prototype
Object.defineProperty(HTMLDivElement.prototype, Symbol.toStringTag, {
    value: 'HTMLDivElement',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(HTMLDivElement)

HTMLHeadElement=function HTMLHeadElement(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {
  }
}  //不能new
HTMLHeadElement.__proto__=HTMLElement
HTMLHeadElement.prototype.__proto__=HTMLElement.prototype
Object.defineProperty(HTMLHeadElement.prototype, Symbol.toStringTag, {
    value: 'HTMLHeadElement',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(HTMLHeadElement)

HTMLMetaElement=function HTMLMetaElement(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {
  }
}  //不能new
HTMLMetaElement.__proto__=HTMLElement
HTMLMetaElement.prototype.__proto__=HTMLElement.prototype
Object.defineProperty(HTMLMetaElement.prototype, Symbol.toStringTag, {
    value: 'HTMLMetaElement',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(HTMLMetaElement)

HTMLScriptElement=function HTMLScriptElement(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {
  }
}  //不能new
HTMLScriptElement.__proto__=HTMLElement
HTMLScriptElement.prototype.__proto__=HTMLElement.prototype
Object.defineProperty(HTMLScriptElement.prototype, Symbol.toStringTag, {
    value: 'HTMLScriptElement',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(HTMLScriptElement)

HTMLCanvasElement=function HTMLCanvasElement(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {
  }
}  //不能new
HTMLCanvasElement.__proto__=HTMLElement
HTMLCanvasElement.prototype.__proto__=HTMLElement.prototype
Object.defineProperty(HTMLCanvasElement.prototype, Symbol.toStringTag, {
    value: 'HTMLCanvasElement',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(HTMLCanvasElement)

CanvasRenderingContext2D=function CanvasRenderingContext2D(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {
  }
}  //不能new
Object.defineProperty(CanvasRenderingContext2D.prototype, Symbol.toStringTag, {
    value: 'CanvasRenderingContext2D',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(CanvasRenderingContext2D)

HTMLAnchorElement=function HTMLAnchorElement(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {
  }
}  //不能new
HTMLAnchorElement.__proto__=HTMLElement
HTMLAnchorElement.prototype.__proto__=HTMLElement.prototype
Object.defineProperty(HTMLAnchorElement.prototype, Symbol.toStringTag, {
    value: 'HTMLAnchorElement',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(HTMLAnchorElement)

values=function values(){
    if(new.target){
        throw new TypeError('Illegal constructor');
    }
}
fun_to_native(values)
item=function item(){
    if(new.target){
        throw new TypeError('Illegal constructor');
    }
}
fun_to_native(item)
namedItem=function namedItem(){
    if(new.target){
        throw new TypeError('Illegal constructor');
    }
}
fun_to_native(namedItem)

HTMLDocument=function HTMLDocument(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {

  }
}  //不能new
HTMLDocument.__proto__=Document
HTMLDocument.prototype.__proto__=Document.prototype
HTMLDocument.prototype.URL='https://www.cebwm.com/wealth/grlc/index.html?isHomePage=0&inputQueryStr=%E5%85%BB%E8%80%81'
HTMLDocument.prototype.documentURI='https://www.cebwm.com/wealth/grlc/index.html?isHomePage=0&inputQueryStr=%E5%85%BB%E8%80%81'
HTMLDocument.prototype.title = '个人理财-光大理财'
HTMLDocument.prototype.lastModified = '03/07/2025 17:56:48'

Object.defineProperty(HTMLDocument.prototype, Symbol.toStringTag, {
    value: 'HTMLDocument',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(HTMLDocument)
// console.log(HTMLDocument)

CSSStyleDeclaration=function CSSStyleDeclaration(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {

  }
}  //不能new
Object.defineProperty(CSSStyleDeclaration.prototype, Symbol.toStringTag, {
    value: 'CSSStyleDeclaration',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(CSSStyleDeclaration.prototype, Symbol.iterator, {
    value: values,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(CSSStyleDeclaration)

HTMLCollection=function HTMLCollection(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {

  }
}  //不能new
Object.defineProperty(HTMLCollection.prototype, Symbol.toStringTag, {
    value: 'HTMLCollection',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
})
Object.defineProperty(HTMLCollection.prototype, Symbol.iterator, {
    value: values,
    writable: true,
    enumerable: false,
    configurable: true
});
Object.defineProperty(HTMLCollection.prototype, 'item', {
    value: item,
    writable: true,
    enumerable: false,
    configurable: true
});
Object.defineProperty(HTMLCollection.prototype, 'length', {
    value: 0,
    writable: true,
    enumerable: false,
    configurable: true
});
Object.defineProperty(HTMLCollection.prototype, 'namedItem', {
    value: namedItem,
    writable: true,
    enumerable: false,
    configurable: true
});
fun_to_native(HTMLCollection)

XPathExpression=function XPathExpression(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {

  }
}  //不能new
Object.defineProperty(XPathExpression.prototype, Symbol.toStringTag, {
    value: 'XPathExpression',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
evaluate=function(val){
    // console.log('evaluate=>',val)
    return ""
}
fun_to_native(evaluate)
Object.defineProperty(XPathExpression.prototype, 'evaluate', {
    value: evaluate,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(XPathExpression)

createExpression=createExpression=function(val){
    if(val==undefined){
        throw new Error("Failed to execute 'createExpression' on 'Document': 1 argument required, but only 0 present.")
    }
    // console.log('createExpression=>',val)
    if(val=='//html'){
        aa={}
        aa.__proto__=XPathExpression.prototype
        return aa
    }
}
fun_to_native(createExpression)

style={
    accentColor:"",
    additiveSymbols:"",
    length:0
}
style.__proto__= CSSStyleDeclaration.prototype
html={'style':style,'tagName':'HTML',selenium:null,driver:null,webdriver:null,}
html.__proto__= HTMLHtmlElement.prototype
htmls=[html]
htmls.__proto__= HTMLCollection.prototype

head={'tagName':'HEAD',selenium:null,driver:null,webdriver:null,}
head.__proto__= HTMLHeadElement.prototype
heads=[head]
heads.__proto__= HTMLCollection.prototype


meta0={'parentElement':head,'parentNode':head,'http-equiv':'http-equiv','content':'text/html; charset=utf-8','tagName':'META',
    selenium:null,driver:null,webdriver:null,}
meta0.__proto__= HTMLMetaElement.prototype
meta1={'parentElement':head,'parentNode':head,'content':content,'r':'m','tagName':'META'}
meta1.__proto__= HTMLMetaElement.prototype
_metas=[meta0,meta1]
_metas.__proto__= HTMLCollection.prototype

rsts = `$_ts=window['$_ts'];if(!$_ts)$_ts={};$_ts.nsd=109929;$_ts.cd="qJrErfAlEugqkqAWrplVHGqWqaaqlpA5qqaPkqQpmqacl1LkkqqWqpgXhqAGHGqWrAaclpA5qkVfc1Gml1LckqqptGV5qqaDJ1lSWPgxrrGWrSljrkgqkqVWxflVHGqWqqarlpAWrPgtrqQ5qkVfcugqJ1lWHGqWqqa2lpAWrrljrAackGVWqpljxGEmhG7lEugqkqWWqrlVHPAWrGaolpA5qqamkqEpmkg9kqqWqplVkq3XkqAMHGqWxGaklpA5qqarkq3pmkgqkcqWrplVkqEXhx0rJOlcrslTvsHx6r8m5_SEGMeWCFgT3nTkqW9Dvl3eGDkPcB7x97MuXOn3pE5cX7peeDPLsYpQ93QqrkWoraDQhqk5KUa2WQYxVkYpKkpB5VyIQ9aNQoDNKORzp1VeK73uhcQGtuRQacZPJuprp2c2p9e9JbfjMiSqKbytIOxB4cl_U296tnidhux3Un72p8eh1urYpKTB6mNyQuJfYoUu1vpZ3nVeK73uhcQGtupQacZPRmW6smBCJbS.FD9n3zYuVUerR9mgCPl_U296tnidhur3U6L.M5fBMc2RUkQzZ6R7F1yNQb6ShCyaMb7.M5fBMmGXUkQzZ6R7F1yNQb6ShCyaMb7.M5fBMmGXUkQzZ6R7F1yNQb6ShCyaMb7.M5fBMmGXUkQzZ6R7F1yNQb6ShCyaMb7.M5fBMmfIKG0qzs3Ts0yVMb6.ikYTY6mEQ8Nti0pGU2yJ6uz0HbpY3COSRbA0isp9YQTWplNJHDekNVQupkqTIvo2QOzzAmmaWwJjsDr93kW_euJBR0p5wkM8VkmuiUpbFHz1Mmw2RKTGT10CRuzfWkD7hKNCiKfIFwYjYD24MbmG010CRuzfWkD7hKNCism7FzefYCwMJYxR4P0CRuzfWkD7hKNCiKYGpBLn16q4YTxhe1TjwO90AVMJFYmK1spsKFGgJCR9UKr9ZCy.JTrzHD44WVNKFCg0MdxTAuyjMmqCTU2nV9AC1UiuJKEZRkq6WhJNQuylADTknkr_1uwX12PuJKEZRkq6WhJNQug7WKVg5uAaJcSzwk.mMlYJs6m5QwzP3vqyFmTmdmp9RbrTHCtjqaqmquQoqtakmDTCQ6wnNuEgWO75JuFLiuEdJOW0qR7T3OS9WkQrvOECJaEJJODjJOW0JOqTWR0hJuq6Ju30ju7qmQl048TYFf34tSzWIoxjGq3cmdGKXU5UHhfhrNn8qaVorAqoEKITbxI7iA69Wn._ZB0q88H0UEjBDEa1fXckmsPCFCnOvA9nWsldJsPNWulTqG3CqRQnJu34WkQu.kWnr12xJ2OFpDSTw6meJQpsR0wTY2w20OrEsCzSwOU1FkRx16eDMZwMQkxGJolnvAWqrk3orODwqOQoFurehISP3n2OFvVzdoJ.tKJ0FP6ZwK9N3DR7hIePwc2GMb9zdCyatKreJ165hCJ93cz9RHZB3CrGInzPZbg7RbTN3KO_hCJTQPz9QXgB36R0tCJG_1e9FKg.3Cu_hCpj31zOMBy4hDmzQnz9ZDZ73DTutCsNhCYeRnzfMIaBRb2ftCmz_nebFba.3K4uwnSOMUW.RB2fhDxjFczbeDV73vG.MC6zhCfTQPzBwIgBFomnRvpn_bQ7MDmLtCOu3cS7MDl.FHJjhDS7wczL4KE7MomLtCBZQ1SB36mbhIwuRKEXMUwb7K2utKf0FD5SMC2vhbzLR.mXJDAXFbRS7Ky9WcyjMbKSMb2LhbN7w4mXMClXFbf67KyaJPyjwuKSMvr9hbN6RHLBMUY2tCNS41ezwb7.FKOShCevFczL3XVBMCx2tCfzdneBFKQ.FoU4hCeu3nz63igBQDROwnzS5KV7wKYjt6o03cSTMbg.QImjQ6lXwC2b7UJaFcy6w6tSQ6rShvw6w8VBQoRbt6wg7UJyRPyCRD4jW1S0FCl.Qi24howOt6YGZcenRoq.wKs_h6xGQ1zTMhmSMUJGt6YT5nenQKe6t6hdMnSCRoZ.QBYPhoRjRO3z4ba7wvJ.t6h.RcSCwK3.QXN2hoR4wczTdol7QKJet6U_81SSFCl.wIp2RP2CFoYu5DT0tURu316N86ANwopOh8zaQn20woqz_6z9tUYbw16j3v3NwKx2Mhm0RKwnt6r7dce6FoA.QD44R1SnMKmfW4m0Qo3XICY77Uz7wPydF6h2h6fLMPzdQIqB8oRXt6e47U97ICz6raDwrTZf3llorQEv3bQcqTG2dkAqqY0O3lKwqsAZqGVCJx0cWAVkJGQrvAWqrAEora1.WuqTWGQrWt0_isQ4raQrvkW";if($_ts.lcd)$_ts.lcd();`

script0={'parentElement':head,'parentNode':head,'type':'text/javascript','r':'m','tagName':'SCRIPT',
    selenium:null,driver:null,webdriver:null,text:rsts,innerHTML:rsts,innerText:rsts}
script0.__proto__= HTMLScriptElement.prototype

script1={'parentElement':head,'parentNode':head,'type':'text/javascript','charset':'utf-8','src':'/hBVw0NiLefg4/saifQlRgbjaH.6b9f701.js','r':'m','tagName':'SCRIPT',
    selenium:null,driver:null,webdriver:null,text:rsts,innerHTML:rsts,innerText:rsts}
script1.__proto__= HTMLScriptElement.prototype
scripts=[script0,script1]
scripts.__proto__= HTMLCollection.prototype


document= {[Symbol.toStringTag]:'HTMLDocument'}
document.__proto__=HTMLDocument.prototype
document.setInterval = setInterval;
document.cookie=''
document.documentElement=html
document.visibilityState='visible'
document.hidden=false
document.readyState='loading'
document.body=null
document.createExpression=createExpression

HTMLAllCollection=function HTMLAllCollection(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {

  }
}  //不能new
Object.defineProperty(HTMLAllCollection.prototype, Symbol.toStringTag, {
    value: 'HTMLAllCollection',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(HTMLAllCollection.prototype, Symbol.iterator, {
    value: values,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(HTMLAllCollection.prototype, Symbol.toStringTag, {
    value: 'HTMLAllCollection',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(HTMLAllCollection.prototype, 'item', {
    value: item,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(HTMLAllCollection.prototype, 'length', {
    value: 3,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(HTMLAllCollection.prototype, 'namedItem', {
    value: namedItem,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(HTMLAllCollection)
document.all={}
document.all.__proto__=HTMLAllCollection.prototype
document.all[0]=html
document.all[1]=head
document.all[2]=meta0
document.all[3]=meta1
document.all[4]=script0
document.all[5]=script1
// console.log(document)

Location=function(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {

  }
}//不能new
Object.defineProperty(Location.prototype, Symbol.toStringTag, {
    value: 'Location',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(Location, 'toString', {
  value: () => "function Location() { [native code] }"
});
fun_to_native(Location)

location = {
    "ancestorOrigins": {},
    "href": "https://autopp.tpi.cntaiping.com/web/home/index.html#/login",
    "origin": "https://autopp.tpi.cntaiping.com",
    "protocol": "https:",
    "host": "autopp.tpi.cntaiping.com",
    "hostname": "autopp.tpi.cntaiping.com",
    "port": "",
    "pathname": "/web/home/index.html",
    "search": "",
    "hash": "#/login"
};
location.__proto__=Location.prototype
// console.log(location)


queryUsageAndQuota=function(val){}
fun_to_native(queryUsageAndQuota)
requestQuota=function(val){}
fun_to_native(requestQuota)
DeprecatedStorageQuota ={
    queryUsageAndQuota:queryUsageAndQuota,
    requestQuota:requestQuota,
    [Symbol.toStringTag]:'DeprecatedStorageQuota'
}
webkitPersistentStorage={}
webkitPersistentStorage.__proto__=DeprecatedStorageQuota

BatteryManager=function BatteryManager(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {

  }
}  //不能new
BatteryManager.__proto__=EventTarget
Object.defineProperty(BatteryManager.prototype, Symbol.toStringTag, {
    value: 'BatteryManager',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(BatteryManager.prototype, 'charging', {
    value: true,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(BatteryManager)

getBattery=function getBattery(){
    Batteryobj={
        charging:true,
        chargingTime:0,
        dischargingTime:Infinity,
        level:1,
        onchargingchange:null,
        onchargingtimechange:null,
        ondischargingtimechange:null,
        onlevelchange:null
    }
    Batteryobj.__proto__=BatteryManager.prototype
    return new Promise(function(resolve,reject){
        resolve(Batteryobj)
    })
}
fun_to_native(getBattery)

MimeTypeArray=function MimeTypeArray(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {

  }
}  //不能new
Object.defineProperty(MimeTypeArray.prototype, Symbol.toStringTag, {
    value: 'MimeTypeArray',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(MimeTypeArray.prototype, Symbol.iterator, {
    value: values,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(MimeTypeArray.prototype, 'item', {
    value: item,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(MimeTypeArray.prototype, 'namedItem', {
    value: namedItem,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(MimeTypeArray.prototype, 'length', {
    value: 0,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(MimeTypeArray)

mimeTypes={

}
mimeTypes.__proto__=MimeTypeArray.prototype
NetworkInformation=function NetworkInformation(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {}
}
Object.defineProperty(NetworkInformation.prototype, Symbol.toStringTag, {
    value: 'NetworkInformation',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(NetworkInformation.prototype, 'constructor', {
    value: NetworkInformation,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
NetworkInformation.prototype.__proto__=EventTarget
fun_to_native(NetworkInformation)
connection= {
    downlink:1.75,
    effectiveType:"4g",
    onchange:null,
    rtt:150,
    saveData:false
}
connection.__proto__=NetworkInformation.prototype

function Navigator(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {

  }
}  //不能new
Navigator.prototype={
    appCodeName: "Mozilla",
    appName: "Netscape",
    appVersion: "'5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0'",
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0',
    webkitPersistentStorage:webkitPersistentStorage,
    languages:["zh-CN","en","en-GB","en-US"],
    getBattery:getBattery,
    connection:connection,
    platform:'Win32',
    mimeTypes:mimeTypes,
};
Object.defineProperty(Navigator.prototype,Symbol.toStringTag, {
    value: 'Navigator',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
webdriver=function webdriver(){
    console.log('webdriver=>',arguments)
}
fun_to_native(webdriver)
Object.defineProperty(Navigator.prototype,'webdriver', {
    get:webdriver,
    set:undefined,
    enumerable: true, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(Navigator)

navigator = {
    appCodeName: "Mozilla",
    appName: "Netscape",
    appVersion: "'5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0'",
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0',
    webkitPersistentStorage:webkitPersistentStorage,
    languages:["zh-CN","en","en-GB","en-US"],
    getBattery:getBattery,
    connection:connection,
    platform:'Win32',
    mimeTypes:mimeTypes,
    webdriver:false,
    maxTouchPoints:0
};
navigator.__proto__=Navigator.prototype
// console.log(navigator)

function History() {
  if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {

  }
} //不能new
History.prototype={
    back:function back(){},
    [Symbol.toStringTag]:History

}
Object.defineProperty(History, 'toString', {
  value: () => "function History() { [native code] }"
});
fun_to_native(History)

function replaceState(val){
    // console.log('history.replaceState=>',val)
}
fun_to_native(replaceState)
history={
    length : 2,
    state : null,
    scrollRestoration : 'auto',
    [Symbol.toStringTag]:'history',
    replaceState:replaceState
}
history.__proto__=History.prototype
// console.log(history)


Screen=function Screen(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {

  }
}
Screen.__proto__=EventTarget
Screen.prototype.__proto__=EventTarget.prototype
Object.defineProperty(Screen.prototype,Symbol.toStringTag, {
    value: 'Screen',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(Screen, 'toString', {
  value: () => "function Screen() { [native code] }"
});
fun_to_native(Screen)
// console.log(Screen)

function  ScreenOrientation(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {

  }
}
ScreenOrientation.__proto__=EventTarget
function lock(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {

  }
}
fun_to_native(lock)
function unlock(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {

  }
}
fun_to_native(unlock)

Object.defineProperty(ScreenOrientation.prototype,Symbol.toStringTag, {
    value: 'ScreenOrientation',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
ScreenOrientation.prototype.lock=lock
ScreenOrientation.prototype.unlock=unlock
fun_to_native(ScreenOrientation)
orientation={angle:0,onchange:null,type:"landscape-primary"}
orientation.__proto__=ScreenOrientation.prototype
screen={
    availHeight:816,
    availLeft:0,
    availTop:0,
    availWidth:1536,
    colorDepth:24,
    height:864,
    isExtended:false,
    onchange:null,
    orientation: orientation,
    pixelDepth:24,
    width:1536
}
screen.__proto__=Screen.prototype

Storage=function Storage(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {

  }
}
Object.defineProperty(Storage.prototype, Symbol.toStringTag, {
    value: 'Storage',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
removeItem=function removeItem(key){
        if(key==undefined){
            throw new TypeError("Failed to execute 'removeItem' on 'Storage': 1 argument required, but only 0 present.")
        }
        // console.log('localStorage.removeItem=>',key)
        this[key]=undefined
}
fun_to_native(removeItem)
getItem=function getItem(key){
        if(key==undefined){
            throw new TypeError("Failed to execute 'getItem' on 'Storage': 1 argument required, but only 0 present.")
        }
        // console.log('localStorage.getItem=>',key)
        return this[key]
}
fun_to_native(getItem)
setItem=function setItem(key,value){
    if(key==undefined||value==undefined){
        throw new TypeError("Failed to execute 'setItem' on 'Storage': 2 arguments required, but only 0 present.")
    }
    // console.log('localStorage.setItem=>',key,value)
    this[key]=value
}
fun_to_native(setItem)
Object.defineProperty(Storage.prototype, 'removeItem', {
    value: removeItem,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(Storage.prototype, 'getItem', {
    value: getItem,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(Storage.prototype, 'setItem', {
    value: setItem,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(Storage)
localStorage={}
localStorage.__proto__=Storage.prototype
sessionStorage= {}
sessionStorage.__proto__=Storage.prototype


XMLHttpRequestEventTarget=function XMLHttpRequestEventTarget(){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {

  }
}
XMLHttpRequestEventTarget.__proto__=EventTarget
XMLHttpRequestEventTarget.prototype.__proto__=EventTarget.prototype
Object.defineProperty(XMLHttpRequestEventTarget.prototype, Symbol.toStringTag, {
    value: 'XMLHttpRequestEventTarget',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(XMLHttpRequestEventTarget)

XMLHttpRequest=function XMLHttpRequest(){
    this.onabort=null,
    this.onerror=null,
    this.onload=null,
    this.onloadend=null,
    this.onloadstart=null,
    this.onprogress=null,
    this.onreadystatechange=null,
    this.ontimeout=null,
    this.readyState=0,
    this.response="",
    this.responseText="",
    this.responseType="",
    this.responseURL="",
    this.responseXML=null,
    this.status=0,
    this.statusText="",
    this.timeout=0
}
XMLHttpRequest.__proto__=XMLHttpRequestEventTarget
XMLHttpRequest.prototype.__proto__=XMLHttpRequestEventTarget.prototype
Object.defineProperty(XMLHttpRequest.prototype, Symbol.toStringTag, {
    value: 'XMLHttpRequest',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(XMLHttpRequest.prototype, 'DONE', {
    value: 4,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(XMLHttpRequest.prototype, 'HEADERS_RECEIVED', {
    value: 2,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(XMLHttpRequest.prototype, 'LOADING', {
    value: 3,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(XMLHttpRequest.prototype, 'OPENED', {
    value: 1,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(XMLHttpRequest.prototype, 'UNSENT', {
    value: 0,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(XMLHttpRequest.prototype, "onreadystatechange", {configurable:true,enumerable:true, get:function(){return this,XMLHttpRequest.prototype,"XMLHttpRequest","onreadystatechange_get",arguments},set:function(){this,XMLHttpRequest.prototype,"XMLHttpRequest","onreadystatechange_set",arguments}});
Object.defineProperty(XMLHttpRequest.prototype, "readyState", {configurable:true,enumerable:true, get:function(){return this,XMLHttpRequest.prototype,"XMLHttpRequest","readyState_get",arguments},set:undefined});
Object.defineProperty(XMLHttpRequest.prototype, "timeout", {configurable:true,enumerable:true, get:function(){return this,XMLHttpRequest.prototype,"XMLHttpRequest","timeout_get",arguments},set:function(){this,XMLHttpRequest.prototype,"XMLHttpRequest","timeout_set",arguments}});
Object.defineProperty(XMLHttpRequest.prototype, "withCredentials", {configurable:true,enumerable:true, get:function(){return this,XMLHttpRequest.prototype,"XMLHttpRequest","withCredentials_get",arguments},set:function(){this,XMLHttpRequest.prototype,"XMLHttpRequest","withCredentials_set",arguments}});
Object.defineProperty(XMLHttpRequest.prototype, "upload", {configurable:true,enumerable:true, get:function(){return this,XMLHttpRequest.prototype,"XMLHttpRequest","upload_get",arguments},set:undefined});
Object.defineProperty(XMLHttpRequest.prototype, "responseURL", {configurable:true,enumerable:true, get:function(){return this,XMLHttpRequest.prototype,"XMLHttpRequest","responseURL_get",arguments},set:undefined});
Object.defineProperty(XMLHttpRequest.prototype, "status", {configurable:true,enumerable:true, get:function(){return this,XMLHttpRequest.prototype,"XMLHttpRequest","status_get",arguments},set:undefined});
Object.defineProperty(XMLHttpRequest.prototype, "statusText", {configurable:true,enumerable:true, get:function(){return this,XMLHttpRequest.prototype,"XMLHttpRequest","statusText_get",arguments},set:undefined});
Object.defineProperty(XMLHttpRequest.prototype, "responseType", {configurable:true,enumerable:true, get:function(){return this,XMLHttpRequest.prototype,"XMLHttpRequest","responseType_get",arguments},set:function(){this,XMLHttpRequest.prototype,"XMLHttpRequest","responseType_set",arguments}});
Object.defineProperty(XMLHttpRequest.prototype, "response", {configurable:true,enumerable:true, get:function(){return this,XMLHttpRequest.prototype,"XMLHttpRequest","response_get",arguments},set:undefined});
Object.defineProperty(XMLHttpRequest.prototype, "responseText", {configurable:true,enumerable:true, get:function(){return this,XMLHttpRequest.prototype,"XMLHttpRequest","responseText_get",arguments},set:undefined});
Object.defineProperty(XMLHttpRequest.prototype, "responseXML", {configurable:true,enumerable:true, get:function(){return this,XMLHttpRequest.prototype,"XMLHttpRequest","responseXML_get",arguments},set:undefined});
Object.defineProperty(XMLHttpRequest.prototype, "UNSENT", {configurable:false,enumerable:true, writable:false, value: 0});
Object.defineProperty(XMLHttpRequest.prototype, "OPENED", {configurable:false,enumerable:true, writable:false, value: 1});
Object.defineProperty(XMLHttpRequest.prototype, "HEADERS_RECEIVED", {configurable:false,enumerable:true, writable:false, value: 2});
Object.defineProperty(XMLHttpRequest.prototype, "LOADING", {configurable:false,enumerable:true, writable:false, value: 3});
Object.defineProperty(XMLHttpRequest.prototype, "DONE", {configurable:false,enumerable:true, writable:false, value: 4});
Object.defineProperty(XMLHttpRequest.prototype, "abort", {configurable:true,enumerable:true, writable:true, value:(function(){let f={f(){return this,"XMLHttpRequest","abort",arguments}}.f;Object.defineProperty(f,"length",{value:0});return f})()});
Object.defineProperty(XMLHttpRequest.prototype, "getAllResponseHeaders", {configurable:true,enumerable:true, writable:true, value:(function(){let f={f(){return this,"XMLHttpRequest","getAllResponseHeaders",arguments}}.f;Object.defineProperty(f,"length",{value:0});return f})()});
Object.defineProperty(XMLHttpRequest.prototype, "getResponseHeader", {configurable:true,enumerable:true, writable:true, value:(function(){let f={f(){return this,"XMLHttpRequest","getResponseHeader",arguments}}.f;Object.defineProperty(f,"length",{value:1});return f})()});
Object.defineProperty(XMLHttpRequest.prototype, "open", {configurable:true,enumerable:true, writable:true, value:(function(){let f={f(){return this,"XMLHttpRequest","open",arguments}}.f;Object.defineProperty(f,"length",{value:2});return f})()});
Object.defineProperty(XMLHttpRequest.prototype, "overrideMimeType", {configurable:true,enumerable:true, writable:true, value:(function(){let f={f(){return this,"XMLHttpRequest","overrideMimeType",arguments}}.f;Object.defineProperty(f,"length",{value:1});return f})()});
Object.defineProperty(XMLHttpRequest.prototype, "send", {configurable:true,enumerable:true, writable:true, value:(function(){let f={f(){return this,"XMLHttpRequest","send",arguments}}.f;Object.defineProperty(f,"length",{value:0});return f})()});
Object.defineProperty(XMLHttpRequest.prototype, "setRequestHeader", {configurable:true,enumerable:true, writable:true, value:(function(){let f={f(){return this,"XMLHttpRequest","setRequestHeader",arguments}}.f;Object.defineProperty(f,"length",{value:2});return f})()});
Object.defineProperty(XMLHttpRequest.prototype, "setAttributionReporting", {configurable:true,enumerable:true, writable:true, value:(function(){let f={f(){return this,"XMLHttpRequest","setAttributionReporting",arguments}}.f;Object.defineProperty(f,"length",{value:1});return f})()});
Object.defineProperty(XMLHttpRequest.prototype, "setPrivateToken", {configurable:true,enumerable:true, writable:true, value:(function(){let f={f(){return this,"XMLHttpRequest","setPrivateToken",arguments}}.f;Object.defineProperty(f,"length",{value:1});return f})()});
fun_to_native(XMLHttpRequest)


Event=function Event(val){
    // console.log('Event=>',val)
}
Object.defineProperty(Event.prototype, Symbol.toStringTag, {
    value: 'Event',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(Event.prototype, 'AT_TARGET', {
    value: 2,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(Event.prototype, 'BUBBLING_PHASE', {
    value: 3,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(Event.prototype, 'CAPTURING_PHASE', {
    value: 1,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(Event.prototype, 'NONE', {
    value: 0,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(Event)

DeviceMotionEvent=function DeviceMotionEvent(val){
    if (val== undefined) {
        throw new TypeError("Failed to construct 'DeviceMotionEvent': 1 argument required, but only 0 present.");
    }
    // console.log('DeviceMotionEvent=>',val)
}
Object.defineProperty(DeviceMotionEvent.prototype, Symbol.toStringTag, {
    value: 'DeviceMotionEvent',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
DeviceMotionEvent.prototype.__proto__=Event.prototype
fun_to_native(DeviceMotionEvent)

DeviceOrientationEvent=function DeviceOrientationEvent(val){
    if (val== undefined) {
        throw new TypeError("Failed to construct 'DeviceOrientationEvent': 1 argument required, but only 0 present.");
    }
    // console.log('DeviceOrientationEvent=>',val)
}
Object.defineProperty(DeviceOrientationEvent.prototype, Symbol.toStringTag, {
    value: 'DeviceOrientationEvent',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
DeviceOrientationEvent.prototype.__proto__=Event.prototype
fun_to_native(DeviceOrientationEvent)

webkitRequestFileSystem=function webkitRequestFileSystem(){
    if (arguments.length<3){
        throw new TypeError("Failed to execute 'webkitRequestFileSystem' on 'Window': 3 arguments required, but only 0 present.");
    }
    // console.log('webkitRequestFileSystem=>',arguments)
    Entry= {}
    Object.defineProperty(Entry, Symbol.toStringTag, {
        value: 'Entry',
        writable: false, // 可选，设置为不可写
        enumerable: false, // 可选，设置为不可枚举
        configurable: true, // 可选，设置为可配置
    });
    DirectoryEntry={}
    Object.defineProperty(DirectoryEntry, Symbol.toStringTag, {
        value: 'DirectoryEntry',
        writable: false, // 可选，设置为不可写
        enumerable: false, // 可选，设置为不可枚举
        configurable: true, // 可选，设置为可配置
    });
    DirectoryEntry.__proto__=Entry
    DOMFileSystem={}
    root={
        filesystem:DOMFileSystem,
        fullPath:"/",
        isDirectory:true,
        isFile:false,
        name:""
    }
    root.__proto__=DirectoryEntry
    Object.defineProperty(DOMFileSystem, Symbol.toStringTag, {
        value: 'DOMFileSystem',
        writable: false, // 可选，设置为不可写
        enumerable: false, // 可选，设置为不可枚举
        configurable: true, // 可选，设置为可配置
    });
    Object.defineProperty(DOMFileSystem, 'name', {
        value: "https_dcp.sgcc.com.cn_0:Temporary",
        writable: false, // 可选，设置为不可写
        enumerable: false, // 可选，设置为不可枚举
        configurable: true, // 可选，设置为可配置
    });
    Object.defineProperty(DOMFileSystem, 'root', {
        value: root,
        writable: false, // 可选，设置为不可写
        enumerable: false, // 可选，设置为不可枚举
        configurable: true, // 可选，设置为可配置
    });
    fs={
        name: "https_dcp.sgcc.com.cn_0:Temporary",
        root: root
    }
    fs.__proto__=DOMFileSystem
    try {
        arguments[2](fs)
    }catch(e){
        arguments[3](fs)
    }
}
fun_to_native(webkitRequestFileSystem)

Performance=function Performance(val){
    if (new.target) {
    throw new TypeError('Illegal constructor');
  } else {
  }
}
Performance.__proto__=EventTarget
Performance.prototype.__proto__=EventTarget.prototype
Object.defineProperty(Performance.prototype, Symbol.toStringTag, {
    value: 'Performance',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
toJSON=function toJSON(){
    // console.log('Performance.toJSON=>',arguments)
    // if (val == 0) {
        throw new TypeError('Illegal invocation');
    // }
    // console.log('Performance.toJSON=>',val)
    // return ''
}
fun_to_native(toJSON)
Object.defineProperty(Performance.prototype, 'toJSON', {
    value: toJSON,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
now=function now(val){
    // console.log('Performance.now=>',val)
    return 0
}
fun_to_native(now)
Object.defineProperty(Performance.prototype, 'now', {
    value: now,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
fun_to_native(Performance)
performance={onresourcetimingbufferfull:null}
performance.__proto__=Performance.prototype

openn=function open(url,target,features){
    // console.log('window.open=>',url,target,features)
    return window
}
fun_to_native(openn)
function DOMParser(){
    // console.log(arguments)
}
fun_to_native(DOMParser)

fun_to_native(Request)
fun_to_native(fetch)
fun_to_native(Math.random)
fun_to_native(Math.round)
fun_to_native(Math.floor)
fun_to_native(Math.ceil)
fun_to_native(Math.abs)
fun_to_native(Math.min)
fun_to_native(Math.max)
fun_to_native(Math.pow)
fun_to_native(Math.log)
fun_to_native(Math.sqrt)
fun_to_native(parseFloat)
fun_to_native(escape)
fun_to_native(Number)
fun_to_native(decodeURIComponent)
fun_to_native(isFinite)
fun_to_native(RegExp)


function ProxyDocumentObjects(proxyObjs) {
    for (let i = 0; i < proxyObjs.length; i++) {
        const documentObj = proxyObjs[i];
        const keys = Object.keys(documentObj);
        keys.forEach(key => {
            const value = documentObj[key];
            if (value && typeof value === "object") {
                documentObj[key] = new Proxy(value, {
                    get(target, property, receiver) {
                        const propValue = Reflect.get(target, property, receiver);
                        console.log("方法:", "get", "对象:", `${key}`, "属性:", property, "属性类型:", `${typeof property}`, "属性值:", propValue, "属性值类型:", `${typeof propValue}`);
                        return propValue;
                    },
                    set(target, property, newValue, receiver) {
                        console.log("方法:", "set", "对象:", `${key}`, "属性:", property, "属性类型:", `${typeof property}`, "属性值:", newValue, "属性值类型:", `${typeof newValue}`);
                        return Reflect.set(target, property, newValue, receiver);
                    }
                });
            }
        });
    }
}
// 这里需要写对象
// const proxyObjs = [window, document, navigator, location, localStorage, sessionStorage, screen, history];
// ProxyDocumentObjects(proxyObjs);



window.window=window
window.EventTarget=EventTarget
window.Window=Window
window.document=document
window.HTMLDocument=HTMLDocument
window.Node=Node
window.Document=Document
window.location=location
window.Location=Location
window.Navigator=Navigator
window.navigator=navigator
window.History=History
window.history=history
window.ScreenOrientation=ScreenOrientation
window.Screen=Screen
window.screen=screen
window.top = window;
window.name=''
window.localStorage=localStorage
window.sessionStorage=sessionStorage
IDBFactory=function IDBFactory(val){
    // console.log('IDBFactory=>',val)
}
fun_to_native(IDBFactory)
Object.defineProperty(IDBFactory.prototype, Symbol.toStringTag, {
    value:'IDBFactory',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
Object.defineProperty(IDBFactory.prototype, 'constructor', {
    value:IDBFactory,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
open=function open(val){
    if(val==undefined){
        throw new TypeError("Failed to execute 'open' on 'IDBFactory': 1 argument required, but only 0 present.")
    }
    // console.log('indexedDB.open=>',val)
    return window.indexedDB[val]
}
fun_to_native(open)
Object.defineProperty(IDBFactory.prototype, 'open', {
    value:open,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
cmp =function cmp(val){
    // console.log('indexedDB.cmp=>',val)
    return window.indexedDB[val]
}
fun_to_native(open)
Object.defineProperty(IDBFactory.prototype, 'cmp', {
    value:cmp,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
databases=function databases(val){
    // console.log('indexedDB.databases=>',val)
    return window.indexedDB[val]
}
fun_to_native(databases)
Object.defineProperty(IDBFactory.prototype, 'databases', {
    value:databases,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
deleteDatabase=function deleteDatabase(val){
    // console.log('indexedDB.deleteDatabase=>',val)
    return window.indexedDB[val]
}
fun_to_native(deleteDatabase)
Object.defineProperty(IDBFactory.prototype, 'deleteDatabase', {
    value:deleteDatabase,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
});
indexedDB={}
indexedDB.__proto__=IDBFactory.prototype
window.IDBFactory=IDBFactory
window.indexedDB=indexedDB
window.XMLHttpRequest=XMLHttpRequest
window.globalThis=window
window.self=window
chrome={
    app:{},
    csi:function(){},
    loadTimes:function(){},
}
window.chrome=chrome
window.open=openn
MutationObserver=function MutationObserver(val){
    if(val==undefined){
        throw new TypeError("Failed to construct 'MutationObserver': 1 argument required, but only 0 present.")
    }
    // console.log('MutationObserver=>',val)
    obj={}
    obj.__proto__=MutationObserver.prototype
    return obj
}
Object.defineProperty(MutationObserver.prototype,Symbol.toStringTag, {
    value:'MutationObserver',
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
})
Object.defineProperty(MutationObserver.prototype,'constructor', {
    value:MutationObserver,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
})
disconnect=function disconnect(val){
    // console.log('disconnect=>',val)
    return   ''
}
fun_to_native(disconnect)
Object.defineProperty(MutationObserver.prototype,'disconnect', {
    value:disconnect,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
})
observe=function observe(val){
    // console.log('observe=>',val)
    return  undefined
}
fun_to_native(observe)
Object.defineProperty(MutationObserver.prototype,'observe', {
    value:observe,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
})
takeRecords=function takeRecords(val){
    // console.log('takeRecords=>',val)
    return   ''
}
fun_to_native(takeRecords)
Object.defineProperty(MutationObserver.prototype,'takeRecords', {
    value:takeRecords,
    writable: false, // 可选，设置为不可写
    enumerable: false, // 可选，设置为不可枚举
    configurable: true, // 可选，设置为可配置
})
fun_to_native(MutationObserver)

window.MutationObserver=MutationObserver
clientInformation=navigator
window.clientInformation=clientInformation
window.HTMLFormElement=HTMLFormElement
window.DeviceMotionEvent=DeviceMotionEvent
window.DeviceOrientationEvent=DeviceOrientationEvent
window.webkitRequestFileSystem=webkitRequestFileSystem
window.performance=performance
window.DOMParser=DOMParser
document.defaultView = window
document.designMode = 'off'
document.characterSet = 'UTF-8'
document.charset = 'UTF-8'
document.baseURI = 'https://autopp.tpi.cntaiping.com/web/home/index.html#/login'
document.isConnected = true
document.implementation = {}
document.images = {
    length:4
}
document.plugins = []
document.embeds = {}
document.links = {
    length:35
}
document.forms = {

}
document.scripts = {
    length:7
}
document.onreadystatechange = null
document.fullscreen = false
document.onpointerlockchange = null;
document.onpointerlockerror = null;
document.hidden = false;
document.visibilityState = 'visible';
document.wasDiscarded = false;
document.prerendering = false;
document.featurePolicy = {};
document.webkitVisibilityState = 'visible';
document.webkitHidden = false;
document.onbeforecopy = null;
document.onbeforecut = null;
document.onbeforepaste = null;
document.onfreeze = null;
document.onprerenderingchange = null;
document.onresume = null;
document.onsearch = null;
document.onvisibilitychange = null;
document.fullscreenEnabled = true;
document.fullscreen = false;
document.onfullscreenchange = null;
document.onfullscreenerror = null;
document.webkitIsFullScreen = false;
document.webkitCurrentFullScreenElement = null;
document.webkitFullscreenEnabled = true;
document.webkitFullscreenElement = null;
document.onwebkitfullscreenchange = null;
document.onwebkitfullscreenerror = null;
document.rootElement = null;
document.pictureInPictureEnabled = true;
document.pictureInPictureElement = null;
document.onbeforexrselect = null;
document.onabort = null;
document.onbeforeinput = null;
document.onblur = null;
document.oncancel = null;
document.oncanplay = null;
document.oncanplaythrough = null;
document.onchange = null;
document.onclick = null;
document.onclose = null;
document.oncontextlost = null;
document.oncontextmenu = null;
document.oncontextrestored = null;
document.oncuechange = null;
document.ondblclick = null;
document.ondrag = null;
document.ondragend = null;
document.ondragenter = null;
document.ondragleave = null;
document.ondragover = null;
document.ondragstart = null;
document.ondrop = null;
document.ondurationchange = null;
document.onemptied = null;
document.onended = null;
document.onerror = null;
document.onfocus = null;
document.onformdata = null;
document.oninput = null;
document.oninvalid = null;
document.onkeydown = null;
document.onkeypress = null;
document.onkeyup = null;
document.onload = null;
document.onloadeddata = null;
document.onloadedmetadata = null;
document.onloadstart = null;
document.onmousedown = null;
document.onmouseenter = null;
document.onmouseleave = null;
document.onmousemove = null;
document.onmouseout = null;
document.onmouseover = null;
document.onmouseup = null;
document.onmousewheel = null;
document.onpause = null;
document.onplay = null;
document.onplaying = null;
document.onprogress = null;
document.onratechange = null;
document.onreset = null;
document.onresize = null;
document.onscroll = null;
document.onsecuritypolicyviolation = null;
document.onseeked = null;
document.onseeking = null;
document.onselect = null;
document.onslotchange = null;
document.onstalled = null;
document.onsubmit = null;
document.onsuspend = null;
document.ontimeupdate = null;
document.ontoggle = null;
document.onvolumechange = null;
document.onwaiting = null;
document.onwebkitanimationend = null;
document.onwebkitanimationiteration = null;
document.onwebkitanimationstart = null;
document.onwebkittransitionend = null;
document.onwheel = null;
document.onauxclick = null;
document.ongotpointercapture = null;
document.onlostpointercapture = null;
document.onpointerdown = null;
document.onpointermove = null;
document.onpointerrawupdate = null;
document.onpointerup = null;
document.onpointercancel = null;
document.onpointerover = null;
document.onpointerout = null;
document.onpointerenter = null;
document.onpointerleave = null;
document.onselectstart = null;
document.onselectionchange = null;
document.onanimationend = null;
document.onanimationiteration = null;
document.onanimationstart = null;
document.ontransitionrun = null;
document.ontransitionstart = null;
document.ontransitionend = null;
document.ontransitioncancel = null;
document.oncopy = null;
document.oncut = null;
document.onpaste = null;
document.children = {};
document.firstElementChild = null;
document.lastElementChild = null;
document.childElementCount = 1;
document.activeElement = null;
document.styleSheets = {
    length:7
};
document.pointerLockElement = null;
document.fullscreenElement = null;
document.adoptedStyleSheets = {};
document.fonts = {};
document.adoptNode = null;
document.append = null;
document.captureEvents = null;
document.caretRangeFromPoint = null;
document.close = null;
document.createAttribute = null;
document.createAttributeNS = null;
document.createCDATASection = null;
document.createComment = null;
document.createDocumentFragment = null;
document.createElement = null;
document.createElementNS = null;
document.createEvent = null;
document.createExpression = null;
document.createNSResolver = null;
document.createNodeIterator = null;
document.createProcessingInstruction = null;
document.createRange = null;
document.createTextNode = null;
document.createTreeWalker = null;
document.elementFromPoint = null;
document.elementsFromPoint = null;
document.evaluate = null;
document.execCommand = null;
document.exitFullscreen = null;
document.exitPictureInPicture = null;
document.exitPointerLock = null;
document.getElementById = null;
document.getElementsByClassName = null;
document.getElementsByName = null;
document.getElementsByTagName = null;
document.getElementsByTagNameNS = null;
document.getSelection = null;
document.hasFocus = null;
document.importNode = null;
document.open = null;
document.prepend = null;
document.queryCommandEnabled = null;
document.queryCommandIndeterm = null;
document.queryCommandState = null;
document.queryCommandSupported = null;
document.queryCommandValue = null;
document.querySelector = null;
document.querySelectorAll = null;
document.releaseEvents = null;
document.replaceChildren = null;
document.webkitCancelFullScreen = null;
document.webkitExitFullscreen = null;
document.write = null;
document.writeln = null;
document.fragmentDirective = {};
document.onbeforematch = null;
document.onbeforetoggle = null;
document.hasPrivateToken = null;
document.hasRedemptionRecord = null;
document.timeline = {
    currentTime: 5854481.038
}
document.oncontentvisibilityautostatechange = null;
document.onscrollend = null;
document.getAnimations = null;
document.hasStorageAccess = null;
document.requestStorageAccess = null;
document.startViewTransition = null;
document.nodeType = 9;
document.nodeName = "#document";
document.baseURI = 'https://autopp.tpi.cntaiping.com/web/home/index.html#/login';
document.isConnected = true;
document.ownerDocument = null;
document.parentNode = null;
document.parentElement = null;
document.childNodes = {}
document.firstChild = null;
document.lastChild = null;
document.previousSibling = null;
document.nextSibling = null;
document.nodeValue = null;

delete global;
delete window.orientation
delete __filename;
delete __dirname;


XMLHttpRequest.prototype.open=function(){
    console.log(arguments)
    let regex = /dhhbrMhe=([A-Za-z0-9._-]+)/;
    let match =  arguments[1].match(regex);
    return window.url = match[1];
}


require('./ts')
require('./auto')




function get_cookie() {
    
    return document.cookie.split('=')[1].split(';')[0]
    // cookies = document.cookie
    // return cookies
};


function get_content(){
    var r = new XMLHttpRequest;
    r.open("POST", "/api/system/jwt/auth", true, undefined, undefined)
    return window.url
}

console.log('后缀=>',get_content())
console.log('cookie=>',get_cookie())