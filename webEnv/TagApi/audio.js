const {
    setFunctionPrototype
} = require("../utility.js");
const HTMLMediaElement = require("./media.js");
const initHTML = require("../HTML/fun/initHtml.js");

/**
 * @constructor HTMLAudioElement Audio构造函数
 * @param {object} options 配置项
 * @param {object} options[prop] HTMLElement下的所有属性都可配置
 * */
function HTMLAudioElement(options= undefined) {
    if (options) {
        let newOptions = {
            nodeName: 'AUDIO',
            nodeType: 1,
            tagName: 'AUDIO'
        }
        if(typeof options === 'string') {
            newOptions.vmDom = options;
        }else{
            newOptions = {...newOptions, ...options};
        }
        initHTML(this, newOptions);
    }
}

setFunctionPrototype(HTMLAudioElement, ()=>{
}, HTMLMediaElement);

module.exports = HTMLAudioElement;