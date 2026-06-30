const {setFunctionPrototype} = require("../utility.js");
const HTMLElement = require("../HTML/api/HTMLElement.js");
const initHTML = require("../HTML/fun/initHtml.js");

/**
 * @constructor HTMLHeadElement Head构造函数
 * @param {object} options 配置项
 * @param {object} options[prop] HTMLElement下的所有属性都可配置
 * */
function HTMLHeadElement(options= undefined){
    if (options) {
        let newOptions = {
            nodeName: 'HEAD',
            nodeType: 1,
            tagName: 'HEAD'
        }
        if(typeof options === 'string') {
            newOptions.vmDom = options;
        }else{
            newOptions = {...newOptions, ...options};
        }
        initHTML(this, newOptions);
    }
}
setFunctionPrototype(HTMLHeadElement, null, HTMLElement);

module.exports = HTMLHeadElement;