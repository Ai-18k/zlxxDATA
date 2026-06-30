const {
    getPrivateProp,
    setPrivateProp,
    setFunctionPrototype,
    addObjProp,
    setSymbolIterator
} = require("../utility.js");
const queryFormProp = require("../CommonApi/fun/queryFormProp.js");
const HTMLElement = require("../HTML/api/HTMLElement.js");
const initHTML = require("../HTML/fun/initHtml.js");

/**
 * @constructor HTMLFormElement form构造函数
 * @param {object} options 配置项
 * @param {object} options[prop] HTMLElement下的所有属性都可配置
 * */
function HTMLFormElement(options = undefined) {
    if (options) {
        let newOptions = {
            nodeName: 'FORM',
            nodeType: 1,
            tagName: 'FORM'
        }
        if(typeof options === 'string') {
            newOptions.vmDom = options;
        }else{
            newOptions = {...newOptions, ...options};
        }
        initHTML(this, newOptions);
    }
}

setFunctionPrototype(HTMLFormElement, () => {
    addObjProp(HTMLFormElement.prototype, {
        name: 'acceptCharset',
        get: function acceptCharset() {
            return getPrivateProp(this, 'acceptCharset');
        },
        set: function acceptCharset(value) {
            return setPrivateProp(this, 'acceptCharset', value);
        }
    });
    addObjProp(HTMLFormElement.prototype, {
        name: 'action',
        get: function action() {
            return queryFormProp(this, 'action');
        },
        set: function action(value) {
            //更新attributes
            const attributes = getPrivateProp(this, 'attributes');
            attributes.setNamedItem('action', value);
            return setPrivateProp(this, 'action', value);
        }
    });
    addObjProp(HTMLFormElement.prototype, {
        name: 'autocomplete',
        get: function autocomplete() {
            return getPrivateProp(this, 'autocomplete');
        },
        set: function autocomplete(value) {
            return setPrivateProp(this, 'autocomplete', value);
        }
    });
    addObjProp(HTMLFormElement.prototype, {
        name: 'enctype',
        get: function enctype() {
            return getPrivateProp(this, 'enctype');
        },
        set: function enctype(value) {
            return setPrivateProp(this, 'enctype', value);
        }
    });
    addObjProp(HTMLFormElement.prototype, {
        name: 'enctype',
        get: function enctype() {
            return getPrivateProp(this, 'enctype');
        },
        set: function enctype(value) {
            return setPrivateProp(this, 'enctype', value);
        }
    });
    addObjProp(HTMLFormElement.prototype, {
        name: 'encoding',
        get: function encoding() {
            return getPrivateProp(this, 'encoding');
        },
        set: function encoding(value) {
            return setPrivateProp(this, 'encoding', value)
        }
    });
    addObjProp(HTMLFormElement.prototype, {
        name: 'method',
        get: function method() {
            return getPrivateProp(this, 'method');
        },
        set: function method(value) {
            return setPrivateProp(this, 'method', value)
        }
    });
    addObjProp(HTMLFormElement.prototype, {
        name: 'name',
        get: function name() {
            return getPrivateProp(this, 'name');
        },
        set: function name(value) {
            return setPrivateProp(this, 'name', value);
        }
    });
    addObjProp(HTMLFormElement.prototype, {
        name: 'noValidate',
        get: function noValidate() {
            return getPrivateProp(this, 'noValidate');
        },
        set: function noValidate(value) {
            return setPrivateProp(this, 'noValidate', value);
        }
    });
    addObjProp(HTMLFormElement.prototype, {
        name: 'target',
        get: function target() {
            return getPrivateProp(this, 'target');
        },
        set: function target(value) {
            return setPrivateProp(this, 'target', value);
        }
    });
    addObjProp(HTMLFormElement.prototype, {
        name: 'rel',
        get: function rel() {
            return getPrivateProp(this, 'rel');
        },
        set: function rel(value) {
            return setPrivateProp(this, 'rel', value);
        }
    });
    addObjProp(HTMLFormElement.prototype, {
        name: 'relList',
        get: function relList() {
            return getPrivateProp(this, 'relList');
        },
        set: function relList(value) {
            return setPrivateProp(this, 'relList', value);
        }
    });
    addObjProp(HTMLFormElement.prototype, {
        name: 'elements',
        get: function elements() {
            return getPrivateProp(this, 'elements');
        }
    });
    addObjProp(HTMLFormElement.prototype, {
        name: 'length',
        get: function length() {
            return getPrivateProp(this, 'length') || 0;
        }
    });
    addObjProp(HTMLFormElement.prototype, {name: 'checkValidity'});
    addObjProp(HTMLFormElement.prototype, {name: 'reportValidity'});
    addObjProp(HTMLFormElement.prototype, {name: 'requestSubmit'});
    addObjProp(HTMLFormElement.prototype, {name: 'reset'});
    addObjProp(HTMLFormElement.prototype, {name: 'submit'});
}, HTMLElement);

setSymbolIterator(HTMLFormElement.prototype);

module.exports = HTMLFormElement;