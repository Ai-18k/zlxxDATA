const {
    setFunctionPrototype,
    addObjProp,
    getPrivateProp,
    setPrivateProp
} = require("../utility.js");
const HTMLElement = require("../HTML/api/HTMLElement.js");
const initHTML = require("../HTML/fun/initHtml.js");

/**
 * @constructor HTMLMetaElement Neta构造函数
 * @param {object | string} options 配置项，支持字符串，如：<vm-meta id="9DhefwqGPrzGxEp9hPaoag"></vm-meta>
 * @param {object} options[prop] HTMLElement下的所有属性都可配置
 * */
function HTMLMetaElement(options= undefined) {
    if (options) {
        let newOptions = {
            nodeName: 'META',
            nodeType: 1,
            tagName: 'META'
        }
        if(typeof options === 'string') {
            newOptions.vmDom = options;
        }else{
            newOptions = {...newOptions, ...options};
        }
        initHTML(this, newOptions);
    }
}

setFunctionPrototype(HTMLMetaElement, ()=>{
    addObjProp(HTMLMetaElement.prototype,{
        name: 'name',
        get: function name() {
            return getPrivateProp(this, 'name');
        },
        set: function name(value) {
            return setPrivateProp(this, 'name', value);
        }
    });
    addObjProp(HTMLMetaElement.prototype,{
        name: 'httpEquiv',
        get: function httpEquiv() {
            return getPrivateProp(this, 'httpEquiv');
        },
        set: function httpEquiv(value) {
            //更新attributes
            const attributes = getPrivateProp(this, 'attributes');
            attributes.setNamedItem('http-equiv', value);
            return setPrivateProp(this, 'httpEquiv', value);
        }
    });
    addObjProp(HTMLMetaElement.prototype,{
        name: 'content',
        get: function content() {
            return getPrivateProp(this, 'content');
        },
        set: function content(value) {
            //更新attributes
            const attributes = getPrivateProp(this, 'attributes');
            attributes.setNamedItem('content', value);
            return setPrivateProp(this, 'content', value);
        }
    });
    addObjProp(HTMLMetaElement.prototype,{
        name: 'media',
        get: function media() {
            return getPrivateProp(this, 'media');
        },
        set: function media(value) {
            return setPrivateProp(this, 'media', value);
        }
    });
    addObjProp(HTMLMetaElement.prototype,{
        name: 'scheme',
        get: function scheme() {
            return getPrivateProp(this, 'scheme');
        },
        set: function scheme(value) {
            return setPrivateProp(this, 'scheme', value);
        }
    })
}, HTMLElement);

module.exports = HTMLMetaElement;