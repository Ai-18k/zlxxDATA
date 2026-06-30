let {
    envOption,
    originObject
} = require("./utility.js");
const {
    loadAppendChild,
    loadRemoveChild
} = require("./CommonApi");
const {
    loadCreateElement,
    loadGetElementsByTagName,
    loadGetElementById
} = require(".//Document");
const {
    loadHTMLGetElementsByTagName,
    loadGetAttribute,
} = require(".//HTML");
const {HTMLBodyElement} = require("./TagApi");
const {getPrivateProp, getOriginObj, setPrivateProp} = require("./utility.js");

/**
 * @method loadFun 加载函数
 * @param {Object} option 配置项
 * @property {Boolean} option.createElement 是否加载createElement，如果为数组则只有在数组中的元素才会被返回（方便调试错误）
 * @property {Boolean} option.removeChild 是否加载removeChild
 * @property {Boolean} option.appendChild 是否加载appendChild
 * @property {Array || Boolean} option.getElementsByTagName 是否加载getElementsByTagName，如果为数组则只有在数组中的元素才会被返回（方便调试错误）
 * @property {Boolean} option.getElementById 是否加载getElementById
 * @property {Boolean} option.getAttribute 是否加载getAttribute
 * */
function loadFun(option) {
    originObject.keys(option).forEach((key) => {
        if (option[key] instanceof Array) {
            envOption[key] = option[key];
        }
    })
    if (option.createElement) loadCreateElement();
    if (option.removeChild) loadRemoveChild();
    if (option.appendChild) loadAppendChild();
    if (option.getElementsByTagName) {
        loadGetElementsByTagName();
        loadHTMLGetElementsByTagName();
    }
    if (option.getAttribute) loadGetAttribute();
    if (option.getElementById) loadGetElementById();
}

function loadBody(options) {
    const documentObj = options.obj || document;
    delete options.obj;
    const body = new HTMLBodyElement(options);
    const originDocument = getOriginObj(documentObj);
    const addDocumentAll = getPrivateProp(originDocument.all, 'push');
    const originDocumentElement = getOriginObj(originDocument.documentElement);
    const addChildNodesHtml = getPrivateProp(originDocumentElement.childNodes, 'push');
    const addChildrenHtml = getPrivateProp(originDocumentElement.children, 'push');

    setPrivateProp(originDocument, 'body',  body);
    addDocumentAll(body);
    addChildNodesHtml(body);
    addChildrenHtml(body);
}

module.exports = {
    loadFun,
    loadBody
};