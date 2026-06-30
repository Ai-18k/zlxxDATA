const {
    setPrivateProp,
    getAttrProto,
    addObjProp,
    originObject
} = require("../../utility.js");
const NodeList = require("../../CommonApi/api/NodeList.js");
const HTMLCollection = require("../../Document/api/HTMLCollection.js");
const StylePropertyMap = require("../api/StylePropertyMap.js");
const NamedNodeMap = require("../api/NamedNodeMap.js");
const {dealWithStyle} = require("../fun/dealWithStyle.js");
const {styleProp, CSSStyleDeclaration} = require("../api/CSSStyleDeclaration.js");
const generateOptions = require("../fun/generateOptions.js");

//标签attributes所包含的属性
const attributes = {
    tag: ['style', 'id'],
    html: ['xmlns'],
    head: [],
    body: [],
    meta: [],
    script: ['type', 'src', 'charset'],
    div: [],
    a: [],
    i: [],
    form: ['action'],
    input: ['name'],
    video: [],
    audio: [],
    media: [],
    canvas: [],
    iframe: ['src']
};

/**
 * @constructor initHtml 初始化html标签
 * @param {object} tag 标签对象
 * @param {{[p: string]: *}} options 配置项
 * @param {string} options.tagName html标签名
 * @param {NodeList} options.childNodes html的子节点
 * @param {NodeList} options.children html的子节点
 * @param {object} options.style style样式
 * @param {object} options[prop] HTMLElement下的所有属性都可配置
 * */
function initHtml(tag, options) {

    options = generateOptions(options)

    setPrivateProp(tag, 'tagName', options.tagName);

    const namedNodeMap = new NamedNodeMap();
    originObject.keys(options).forEach((key) => {
        if ([...attributes.tag, ...attributes[options.tagName.toLowerCase()]].includes(key)) {
            namedNodeMap.setNamedItem(key, options[key])
        }
    });
    setPrivateProp(tag, 'attributes', namedNodeMap);

    //初始化style
    const style = new CSSStyleDeclaration();
    [...styleProp.enumProp, ...styleProp.notEnumProp].forEach((propName, index) => {
        if (styleProp.notEnumProp.includes(propName)) {
            addObjProp(style, {
                name: propName,
                value: '',
                configurable: false,
                enumerable: false
            });
        } else {
            addObjProp(style, { //处理单个样式
                name: propName,
                value: ''
            });
        }
    });
    let styleStr = '';
    if (options.style) {
        styleStr = dealWithStyle(options.style, style);
        delete options.style
    }
    setPrivateProp(tag, 'style', style);
    const stylePropertyMap = new StylePropertyMap(styleStr);
    setPrivateProp(stylePropertyMap, 'tag', tag);
    setPrivateProp(tag, 'attributeStyleMap', stylePropertyMap);

    //初始化子节点
    let childNodes = new NodeList([]), children = new HTMLCollection([]);
    if (options.childNodes) {
        for (let i = 0; i < options.childNodes.length; i++) {
            setPrivateProp(options.childNodes[i], 'parentNode', tag);
            setPrivateProp(options.childNodes[i], 'parentElement', tag);
        }
        // setPrivateProp(tag, 'firstChild', options.childNodes[0]);
        // setPrivateProp(tag, 'lastChild', options.childNodes.at(-1));
        childNodes = new NodeList(options.childNodes);
        delete options.childNodes;
    }
    setPrivateProp(tag, 'childNodes', childNodes);
    if (options.children) {
        for (let i = 0; i < options.children.length; i++) {
            setPrivateProp(options.children[i], 'parentNode', tag);
            setPrivateProp(options.children[i], 'parentElement', tag);
        }
        // setPrivateProp(tag, 'firstElementChild', options.children[0]);
        // setPrivateProp(tag, 'lastElementChild', options.children.at(-1));
        children = new HTMLCollection(options.children);
        delete options.children;
    }
    setPrivateProp(tag, 'children', children);

    originObject.keys(options).forEach((key) => {
        if (key.indexOf('-')) {
            key = key.split('-').map((el, index) => index > 0 ? el.charAt(0).toUpperCase() + el.slice(1) : el).join('');
        }
        const rootProto = getAttrProto(tag, key);
        if (rootProto?.hasOwnProperty(key)) {
            const propDesc = originObject.getOwnPropertyDescriptor(rootProto, key);
            if (propDesc.get || propDesc.set) {
                setPrivateProp(tag, key, options[key]);
            } else {
                throw new Error(`${options.tagName}下的${key}为函数`);
            }
        } else {
            tag[key] = options[key];
            namedNodeMap.setNamedItem(key, options[key]);
        }
    });
}

module.exports = initHtml;