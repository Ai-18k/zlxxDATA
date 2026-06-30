const {
    getPrivateProp,
    setPrivateProp,
    setFunctionPrototype,
    addObjProp
} = require("../utility.js");
const HTMLElement = require("../HTML/api/HTMLElement.js");
const initHTML = require("../HTML/fun/initHtml.js");

/**
 * @constructor HTMLHtmlElement Html构造函数
 * @param {object} options 配置项
 * @param {object} options[prop] HTMLElement下的所有属性都可配置
 * */
function HTMLHtmlElement(options= undefined) {
    if (options) {
        let newOptions = {
            nodeName: 'HTML',
            nodeType: 1,
            tagName: 'HTML'
        }
        if(typeof options === 'string') {
            newOptions.vmDom = options;
        }else{
            newOptions = {...newOptions, ...options};
        }
        initHTML(this, newOptions);
    }
}

setFunctionPrototype(HTMLHtmlElement, ()=>{
    addObjProp(HTMLHtmlElement.prototype, {
        name: 'version',
        get: function version() {
            return getPrivateProp(this, 'version')
        },
        set: function version(value) {
            return setPrivateProp(this, 'version', value)
        }
    });
}, HTMLElement);

module.exports = HTMLHtmlElement;