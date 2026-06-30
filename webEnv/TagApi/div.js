const {
    getPrivateProp,
    setPrivateProp,
    setFunctionPrototype,
    addObjProp
} = require("../utility.js");
const HTMLElement = require("../HTML/api/HTMLElement.js");
const initHTML = require("../HTML/fun/initHtml.js");

/**
 * @constructor HTMLDivElement Div构造函数
 * @param {object} options 配置项
 * @param {object} options[prop] HTMLElement下的所有属性都可配置
 * */
function HTMLDivElement(options= undefined) {
    if (options) {
        let newOptions = {
            nodeName: 'DIV',
            nodeType: 1,
            tagName: 'DIV'
        }
        if(typeof options === 'string') {
            newOptions.vmDom = options;
        }else{
            newOptions = {...newOptions, ...options};
        }
        initHTML(this, newOptions);
    }
}

setFunctionPrototype(HTMLDivElement, ()=>{
    addObjProp(HTMLDivElement.prototype, {
        name: 'align',
        get: function align() {
            return getPrivateProp(this, 'align')
        },
        set: function align(value) {
            return setPrivateProp(this, 'align', value)
        }
    });
}, HTMLElement);

module.exports = HTMLDivElement;