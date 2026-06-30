const {
    setFunctionPrototype,
    addObjProp,
    getPrivateProp,
    setPrivateProp,
    getOriginObj
} = require("../utility.js");
const HTMLElement = require("../HTML/api/HTMLElement.js");
const initHTML = require("../HTML/fun/initHtml.js");
const getSrc = require("../CommonApi/fun/getSrc.js");

/**
 * @constructorHTMLScriptElement Neta构造函数
 * @param {object} options 配置项
 * @param {object} options[prop] HTMLElement下的所有属性都可配置
 * */
function HTMLScriptElement(options = undefined) {
    if (options) {
        let newOptions = {
            nodeName: 'SCRIPT',
            nodeType: 1,
            tagName: 'SCRIPT'
        }
        if(typeof options === 'string') {
            newOptions.vmDom = options;
        }else{
            newOptions = {...newOptions, ...options};
        }
        initHTML(this, newOptions);
    }
}

setFunctionPrototype(HTMLScriptElement, () => {
    addObjProp(HTMLScriptElement.prototype, {
        name: 'src',
        get: function src() {
            let src = getPrivateProp(this, 'src');
            src = getSrc(src);
            return src;
        },
        set: function src(value) {
            //更新attributes
            const attributes = getPrivateProp(this, 'attributes');
            attributes.setNamedItem('src', value);
            return setPrivateProp(this, 'src', value);
        }
    });
    addObjProp(HTMLScriptElement.prototype, {
        name: 'type',
        get: function type() {
            return getPrivateProp(this, 'type');
        },
        set: function type(value) {
            //更新attributes
            const attributes = getPrivateProp(this, 'attributes');
            attributes.setNamedItem('type', value);
            return setPrivateProp(this, 'type', value);
        }
    });
    addObjProp(HTMLScriptElement.prototype, {
        name: 'noModule',
        get: function noModule() {
            return getPrivateProp(this, 'noModule');
        },
        set: function noModule(value) {
            return setPrivateProp(this, 'noModule', value);
        }
    });
    addObjProp(HTMLScriptElement.prototype, {
        name: 'charset',
        get: function charset() {
            return getPrivateProp(this, 'charset');
        },
        set: function charset(value) {
            //更新attributes
            const attributes = getPrivateProp(this, 'attributes');
            attributes.setNamedItem('charset', value);
            return setPrivateProp(this, 'charset', value);
        }
    });
    addObjProp(HTMLScriptElement.prototype, {
        name: 'async',
        get: function async() {
            return getPrivateProp(this, 'async');
        },
        set: function async(value) {
            return setPrivateProp(this, 'async', value);
        }
    });
    addObjProp(HTMLScriptElement.prototype, {
        name: 'defer',
        get: function defer() {
            return getPrivateProp(this, 'defer');
        },
        set: function defer(value) {
            return setPrivateProp(this, 'defer', value);
        }
    });
    addObjProp(HTMLScriptElement.prototype, {
        name: 'crossOrigin',
        get: function crossOrigin() {
            return getPrivateProp(this, 'crossOrigin');
        },
        set: function crossOrigin(value) {
            return setPrivateProp(this, 'crossOrigin', value);
        }
    });
    addObjProp(HTMLScriptElement.prototype, {
        name: 'text',
        get: function text() {
            return getPrivateProp(this, 'text');
        },
        set: function text(value) {
            return setPrivateProp(this, 'text', value);
        }
    });
    addObjProp(HTMLScriptElement.prototype, {
        name: 'referrerPolicy',
        get: function referrerPolicy() {
            return getPrivateProp(this, 'referrerPolicy');
        },
        set: function referrerPolicy(value) {
            return setPrivateProp(this, 'referrerPolicy', value);
        }
    });
    addObjProp(HTMLScriptElement.prototype, {
        name: 'fetchPriority',
        get: function fetchPriority() {
            return getPrivateProp(this, 'fetchPriority');
        },
        set: function fetchPriority(value) {
            return setPrivateProp(this, 'fetchPriority', value);
        }
    });
    addObjProp(HTMLScriptElement.prototype, {
        name: 'event',
        get: function event() {
            return getPrivateProp(this, 'event');
        },
        set: function event(value) {
            return setPrivateProp(this, 'event', value);
        }
    });
    addObjProp(HTMLScriptElement.prototype, {
        name: 'htmlFo',
        get: function htmlFo() {
            return getPrivateProp(this, 'htmlFo');
        },
        set: function htmlFo(value) {
            return setPrivateProp(this, 'htmlFo', value);
        }
    });
    addObjProp(HTMLScriptElement.prototype, {
        name: 'integrity',
        get: function integrity() {
            return getPrivateProp(this, 'integrity');
        },
        set: function integrity(value) {
            return setPrivateProp(this, 'integrity', value);
        }
    });
    addObjProp(HTMLScriptElement.prototype, {
        name: 'blocking',
        get: function blocking() {
            return getPrivateProp(this, 'blocking');
        },
        set: function blocking(value) {
            return setPrivateProp(this, 'blocking', value);
        }
    });
}, HTMLElement);

addObjProp(HTMLScriptElement.prototype, {
    name: 'attributionSrc',
    get: function attributionSrc() {
        return getPrivateProp(this, 'attributionSrc')
    },
    set: function attributionSrc(value) {
        return setPrivateProp(this, 'attributionSrc', value)
    }
});

module.exports = HTMLScriptElement;