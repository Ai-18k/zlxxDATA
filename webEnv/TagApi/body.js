const {
    getPrivateProp,
    setPrivateProp,
    setFunctionPrototype,
    addObjProp
} = require("../utility.js");
const HTMLElement = require("../HTML/api/HTMLElement.js");
const initHTML = require("../HTML/fun/initHtml.js");

/**
 * @constructor HTMLBodyElement Body构造函数
 * @param {object} options 配置项
 * @param {object} options[prop] HTMLElement下的所有属性都可配置
 * */
function HTMLBodyElement(options = undefined) {
    if (options) {
        let newOptions = {
            nodeName: 'BODY',
            nodeType: 1,
            tagName: 'BODY'
        }
        if(typeof options === 'string') {
            newOptions.vmDom = options;
        }else{
            newOptions = {...newOptions, ...options};
        }
        initHTML(this, newOptions);
    }
}

setFunctionPrototype(HTMLBodyElement, ()=>{
    addObjProp(HTMLBodyElement.prototype, {
        name: 'text',
        get: function text() {
            return getPrivateProp(this, 'text')
        },
        set: function text(value) {
            return setPrivateProp(this, 'text', value)
        }
    });
    addObjProp(HTMLBodyElement.prototype, {
        name: 'link',
        get: function link() {
            return getPrivateProp(this, 'link')
        },
        set: function link(value) {
            return setPrivateProp(this, 'link', value)
        }
    });
    addObjProp(HTMLBodyElement.prototype, {
        name: 'vLink',
        get: function vLink() {
            return getPrivateProp(this, 'vLink')
        },
        set: function vLink(value) {
            return setPrivateProp(this, 'vLink', value)
        }
    });
    addObjProp(HTMLBodyElement.prototype, {
        name: 'aLink',
        get: function aLink() {
            return getPrivateProp(this, 'aLink')
        },
        set: function aLink(value) {
            return setPrivateProp(this, 'aLink', value)
        }
    });
    addObjProp(HTMLBodyElement.prototype, {
        name: 'bgColor',
        get: function bgColor() {
            return getPrivateProp(this, 'bgColor')
        },
        set: function bgColor(value) {
            return setPrivateProp(this, 'bgColor', value)
        }
    });
    addObjProp(HTMLBodyElement.prototype, {
        name: 'background',
        get: function background() {
            return getPrivateProp(this, 'background')
        },
        set: function background(value) {
            return setPrivateProp(this, 'background', value)
        }
    });
    addObjProp(HTMLBodyElement.prototype, {
        name: 'onblur',
        get: function onblur() {
            return getPrivateProp(this, 'onblur')
        },
        set: function onblur(value) {
            return setPrivateProp(this, 'onblur', value)
        }
    });
    addObjProp(HTMLBodyElement.prototype, {
        name: 'onerror',
        get: function onerror() {
            return getPrivateProp(this, 'onerror')
        },
        set: function onerror(value) {
            return setPrivateProp(this, 'onerror', value)
        }
    });
    addObjProp(HTMLBodyElement.prototype, {
        name: 'onfocus',
        get: function onfocus() {
            return getPrivateProp(this, 'onfocus')
        },
        set: function onfocus(value) {
            return setPrivateProp(this, 'onfocus', value)
        }
    });
    addObjProp(HTMLBodyElement.prototype, {
        name: 'onload',
        get: function onload() {
            return getPrivateProp(this, 'onload')
        },
        set: function onload(value) {
            return setPrivateProp(this, 'onload', value)
        }
    });
    addObjProp(HTMLBodyElement.prototype, {
        name: 'onresize',
        get: function onresize() {
            return getPrivateProp(this, 'onresize')
        },
        set: function onresize(value) {
            return setPrivateProp(this, 'onresize', value)
        }
    });
    addObjProp(HTMLBodyElement.prototype, {
        name: 'onscroll',
        get: function onscroll() {
            return getPrivateProp(this, 'onscroll')
        },
        set: function onscroll(value) {
            return setPrivateProp(this, 'onscroll', value)
        }
    });
    addObjProp(HTMLBodyElement.prototype, {
        name: 'onafterprint',
        get: function onafterprint() {
            return getPrivateProp(this, 'onafterprint')
        },
        set: function onafterprint(value) {
            return setPrivateProp(this, 'onafterprint', value)
        }
    });
    addObjProp(HTMLBodyElement.prototype, {
        name: 'onbeforeprint',
        get: function onbeforeprint() {
            return getPrivateProp(this, 'onbeforeprint')
        },
        set: function onbeforeprint(value) {
            return setPrivateProp(this, 'onbeforeprint', value)
        }
    });
    addObjProp(HTMLBodyElement.prototype, {
        name: 'onbeforeunload',
        get: function onbeforeunload() {
            return getPrivateProp(this, 'onbeforeunload')
        },
        set: function onbeforeunload(value) {
            return setPrivateProp(this, 'onbeforeunload', value)
        }
    });
    addObjProp(HTMLBodyElement.prototype, {
        name: 'onhashchange',
        get: function onhashchange() {
            return getPrivateProp(this, 'onhashchange')
        },
        set: function onhashchange(value) {
            return setPrivateProp(this, 'onhashchange', value)
        }
    });
    addObjProp(HTMLBodyElement.prototype, {
        name: 'onlanguagechange',
        get: function onlanguagechange() {
            return getPrivateProp(this, 'onlanguagechange')
        },
        set: function onlanguagechange(value) {
            return setPrivateProp(this, 'onlanguagechange', value)
        }
    });
    addObjProp(HTMLBodyElement.prototype, {
        name: 'onmessage',
        get: function onmessage() {
            return getPrivateProp(this, 'onmessage')
        },
        set: function onmessage(value) {
            return setPrivateProp(this, 'onmessage', value)
        }
    });
    addObjProp(HTMLBodyElement.prototype, {
        name: 'onmessageerror',
        get: function onmessageerror() {
            return getPrivateProp(this, 'onmessageerror')
        },
        set: function onmessageerror(value) {
            return setPrivateProp(this, 'onmessageerror', value)
        }
    });
    addObjProp(HTMLBodyElement.prototype, {
        name: 'onoffline',
        get: function onoffline() {
            return getPrivateProp(this, 'onoffline')
        },
        set: function onoffline(value) {
            return setPrivateProp(this, 'onoffline', value)
        }
    });
    addObjProp(HTMLBodyElement.prototype, {
        name: 'ononline',
        get: function ononline() {
            return getPrivateProp(this, 'ononline')
        },
        set: function ononline(value) {
            return setPrivateProp(this, 'ononline', value)
        }
    });
    addObjProp(HTMLBodyElement.prototype, {
        name: 'onpagehide',
        get: function onpagehide() {
            return getPrivateProp(this, 'onpagehide')
        },
        set: function onpagehide(value) {
            return setPrivateProp(this, 'onpagehide', value)
        }
    });
    addObjProp(HTMLBodyElement.prototype, {
        name: 'onpageshow',
        get: function onpageshow() {
            return getPrivateProp(this, 'onpageshow')
        },
        set: function onpageshow(value) {
            return setPrivateProp(this, 'onpageshow', value)
        }
    });
    addObjProp(HTMLBodyElement.prototype, {
        name: 'onpopstate',
        get: function onpopstate() {
            return getPrivateProp(this, 'onpopstate')
        },
        set: function onpopstate(value) {
            return setPrivateProp(this, 'onpopstate', value)
        }
    });
    addObjProp(HTMLBodyElement.prototype, {
        name: 'onrejectionhandled',
        get: function onrejectionhandled() {
            return getPrivateProp(this, 'onrejectionhandled')
        },
        set: function onrejectionhandled(value) {
            return setPrivateProp(this, 'onrejectionhandled', value)
        }
    });
    addObjProp(HTMLBodyElement.prototype, {
        name: 'onstorage',
        get: function onstorage() {
            return getPrivateProp(this, 'onstorage')
        },
        set: function onstorage(value) {
            return setPrivateProp(this, 'onstorage', value)
        }
    });
    addObjProp(HTMLBodyElement.prototype, {
        name: 'onunhandledrejection',
        get: function onunhandledrejection() {
            return getPrivateProp(this, 'onunhandledrejection')
        },
        set: function onunhandledrejection(value) {
            return setPrivateProp(this, 'onunhandledrejection', value)
        }
    });
    addObjProp(HTMLBodyElement.prototype, {
        name: 'onunload',
        get: function onunload() {
            return getPrivateProp(this, 'onunload')
        },
        set: function onunload(value) {
            return setPrivateProp(this, 'onunload', value)
        }
    });
}, HTMLElement);

module.exports = HTMLBodyElement;