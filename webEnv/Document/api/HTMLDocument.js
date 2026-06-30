const {
    setFunctionPrototype,
    setPrivateProp,
    getAttrProto,
    originObject
} = require("../../utility.js");
const NodeList = require("../../CommonApi/api/NodeList.js");
const Document = require("./Document.js");
const DocumentType = require("./DocumentType.js");
const HTMLCollection = require("./HTMLCollection.js");

/**
 * @constructor HTMLDocument document构造函数
 * @param {object} options 配置项
 * @param {string} options[publicId] doctype的publicId
 * @param {string} options[systemId] doctype的systemId
 * @param {Array} options[childNodes] document的子节点
 * @param {Array} options[children] document的子节点
 * @param {object} options[prop] document下的所有属性都可配置
 * */
function HTMLDocument(options = undefined) {
    if (options) {
        setPrivateProp(this, 'tagName', 'DOCUMENT');
        setPrivateProp(this, 'nodeName', '#document');
        setPrivateProp(this, 'nodeType', 9);
        setPrivateProp(this, 'visibilityState', 'visible');

        const documentDoctype = new DocumentType();
        setPrivateProp(documentDoctype, 'name', 'html');
        setPrivateProp(documentDoctype, 'publicId', options.publicId || '');
        setPrivateProp(documentDoctype, 'systemId', options.systemId || '');
        setPrivateProp(documentDoctype, 'parentNode', this);
        setPrivateProp(this, 'doctype', documentDoctype);

        let childNodes = [documentDoctype], children = [documentDoctype];
        if (options.childNodes) {
            for (let i = 0; i < options.childNodes.length; i++) {
                setPrivateProp(options.childNodes[i], 'parentNode', this);
                setPrivateProp(options.childNodes[i] , 'parentElement', this);
            }
            childNodes = [...childNodes, ...options.childNodes];
            delete options.childNodes;
        }
        if (options.children) {
            for (let i = 0; i < options.children.length; i++) {
                setPrivateProp(options.children[i], 'parentNode', this);
                setPrivateProp(options.children[i] , 'parentElement', this);
            }
            children = [...children, ...options.children];
            delete options.children;
        }

        childNodes = new NodeList(childNodes);
        setPrivateProp(this, 'childNodes', childNodes);

        children = new HTMLCollection(children);
        setPrivateProp(this, 'children', children);

        originObject.keys(options).forEach((key) => {
            const rootProto = getAttrProto(this, key);
            if (rootProto.hasOwnProperty(key)) {
                const propDesc = originObject.getOwnPropertyDescriptor(rootProto, key);
                if (propDesc.get || options[key] instanceof Function) {
                    setPrivateProp(this, key, options[key]);
                } else {
                    throw new Error(`document下的${key}非函数`);
                }
            } else {
                this[key] = options[key];
            }
        });
    }
}

setFunctionPrototype(HTMLDocument, null, Document);

module.exports = HTMLDocument;