const {
    getPrivateProp,
    setPrivateProp,
    setFunctionPrototype,
    addObjProp,
    createError,
    envOption
} = require("../utility.js");
const cheerio = require("cheerio");
const HTMLElement = require("../HTML/api/HTMLElement.js");
const initHTML = require("../HTML/fun/initHtml.js");
const getSrc = require("../CommonApi/fun/getSrc.js");
const generateOptions = require("../HTML/fun/generateOptions");

function setSrc(obj, src) {
    const contentWindow = getPrivateProp(obj, 'contentWindow');
    const contentWindowLocation = getPrivateProp(contentWindow, 'location');
    src = getSrc(src);
    contentWindowLocation.href = src;
    setPrivateProp(obj, 'src', 'src');

    return true;
}

/**
 * @constructor HTMLIFrameElement Div构造函数
 * @param {object} options 配置项
 * @param {object} options[prop] HTMLElement下的所有属性都可配置
 * */
function HTMLIFrameElement(options = undefined) {
    if (options) {
        let newOptions = {
            nodeName: 'IFRAME',
            nodeType: 1,
            tagName: 'IFRAME'
        }
        if(typeof options === 'string') {
            newOptions.vmDom = options;
            newOptions = generateOptions(newOptions);
        }else{
            newOptions = {...newOptions, ...options};
        }
        if (newOptions.src) {
            setSrc(this, newOptions.src);
            delete newOptions.src;
        }
        initHTML(this, newOptions);
    }
}

setFunctionPrototype(HTMLIFrameElement, () => {
    addObjProp(HTMLIFrameElement.prototype, {
        name: 'src',
        get: function src() {
            const contentWindow = getPrivateProp(this, 'contentWindow');
            const contentWindowLocation = getPrivateProp(contentWindow, 'location');
            let src = getPrivateProp(this, 'src');
            src = getSrc(src);
            contentWindowLocation.href = src;
            return src;
        },
        set: function src(value) {
            //更新attributes
            const attributes = getPrivateProp(this, 'attributes');
            attributes.setNamedItem('src', value);
            return setSrc(this, value);
        }
    });
    addObjProp(HTMLIFrameElement.prototype, {
        name: 'srcdoc',
        get: function srcdoc() {
            return getPrivateProp(this, 'srcdoc');
        },
        set: function srcdoc(value) {
            //更新attributes
            const attributes = getPrivateProp(this, 'attributes');
            attributes.setNamedItem('srcdoc', value);
            return setPrivateProp(this, 'srcdoc', value);
        }
    });
    addObjProp(HTMLIFrameElement.prototype, {
        name: 'name',
        get: function name() {
            return getPrivateProp(this, 'name');
        },
        set: function name(value) {
            //更新attributes
            const attributes = getPrivateProp(this, 'attributes');
            attributes.setNamedItem('name', value);
            return setPrivateProp(this, 'name', value);
        }
    });
    addObjProp(HTMLIFrameElement.prototype, {
        name: 'sandbox',
        get: function sandbox() {
            return getPrivateProp(this, 'sandbox');
        },
        set: function sandbox(value) {
            //更新attributes
            const attributes = getPrivateProp(this, 'attributes');
            attributes.setNamedItem('sandbox', value);
            return setPrivateProp(this, 'sandbox', value);
        }
    });
    addObjProp(HTMLIFrameElement.prototype, {
        name: 'allowFullscreen',
        get: function allowFullscreen() {
            return getPrivateProp(this, 'allowFullscreen');
        },
        set: function allowFullscreen(value) {
            //更新attributes
            const attributes = getPrivateProp(this, 'attributes');
            attributes.setNamedItem('allowFullscreen', value);
            return setPrivateProp(this, 'allowFullscreen', value);
        }
    });
    addObjProp(HTMLIFrameElement.prototype, {
        name: 'width',
        get: function width() {
            return getPrivateProp(this, 'width');
        },
        set: function width(value) {
            //更新attributes
            const attributes = getPrivateProp(this, 'attributes');
            attributes.setNamedItem('width', value);
            return setPrivateProp(this, 'width', value);
        }
    });
    addObjProp(HTMLIFrameElement.prototype, {
        name: 'height',
        get: function height() {
            return getPrivateProp(this, 'height');
        },
        set: function height(value) {
            //更新attributes
            const attributes = getPrivateProp(this, 'attributes');
            attributes.setNamedItem('height', value);
            return setPrivateProp(this, 'height', value);
        }
    });
    addObjProp(HTMLIFrameElement.prototype, {
        name: 'contentDocument',
        get: function contentDocument() {
            const contentWindow = getPrivateProp(this, 'contentWindow');
            return getPrivateProp(contentWindow, 'document');
        }
    });
    addObjProp(HTMLIFrameElement.prototype, {
        name: 'contentWindow',
        get: function contentWindow() {
            return getPrivateProp(this, 'contentWindow');
        }
    });
    addObjProp(HTMLIFrameElement.prototype, {
        name: 'referrerPolicy',
        get: function referrerPolicy() {
            return getPrivateProp(this, 'referrerPolicy');
        },
        set: function referrerPolicy(value) {
            //更新attributes
            const attributes = getPrivateProp(this, 'attributes');
            attributes.setNamedItem('referrerPolicy', value);
            return setPrivateProp(this, 'referrerPolicy', value);
        }
    });
    addObjProp(HTMLIFrameElement.prototype, {
        name: 'csp',
        get: function csp() {
            return getPrivateProp(this, 'csp');
        },
        set: function csp(value) {
            //更新attributes
            const attributes = getPrivateProp(this, 'attributes');
            attributes.setNamedItem('csp', value);
            return setPrivateProp(this, 'csp', value);
        }
    });
    addObjProp(HTMLIFrameElement.prototype, {
        name: 'allow',
        get: function allow() {
            return getPrivateProp(this, 'allow');
        },
        set: function allow(value) {
            //更新attributes
            const attributes = getPrivateProp(this, 'attributes');
            attributes.setNamedItem('allow', value);
            return setPrivateProp(this, 'allow', value);
        }
    });
    addObjProp(HTMLIFrameElement.prototype, {
        name: 'featurePolicy',
        get: function featurePolicy() {
            return getPrivateProp(this, 'featurePolicy');
        }
    });
    addObjProp(HTMLIFrameElement.prototype, {
        name: 'loading',
        get: function loading() {
            return getPrivateProp(this, 'loading');
        },
        set: function loading(value) {
            //更新attributes
            const attributes = getPrivateProp(this, 'attributes');
            attributes.setNamedItem('loading', value);
            return setPrivateProp(this, 'loading', value);
        }
    });
    addObjProp(HTMLIFrameElement.prototype, {
        name: 'align',
        get: function align() {
            return getPrivateProp(this, 'align');
        },
        set: function align(value) {
            //更新attributes
            const attributes = getPrivateProp(this, 'attributes');
            attributes.setNamedItem('align', value);
            return setPrivateProp(this, 'align', value);
        }
    });
    addObjProp(HTMLIFrameElement.prototype, {
        name: 'scrolling',
        get: function scrolling() {
            return getPrivateProp(this, 'scrolling');
        },
        set: function scrolling(value) {
            //更新attributes
            const attributes = getPrivateProp(this, 'attributes');
            attributes.setNamedItem('scrolling', value);
            return setPrivateProp(this, 'scrolling', value);
        }
    });
    addObjProp(HTMLIFrameElement.prototype, {
        name: 'frameBorder',
        get: function frameBorder() {
            return getPrivateProp(this, 'frameBorder');
        },
        set: function frameBorder(value) {
            //更新attributes
            const attributes = getPrivateProp(this, 'attributes');
            attributes.setNamedItem('frameBorder', value);
            return setPrivateProp(this, 'frameBorder', value);
        }
    });
    addObjProp(HTMLIFrameElement.prototype, {
        name: 'longDesc',
        get: function longDesc() {
            return getPrivateProp(this, 'longDesc');
        },
        set: function longDesc(value) {
            //更新attributes
            const attributes = getPrivateProp(this, 'attributes');
            attributes.setNamedItem('longDesc', value);
            return setPrivateProp(this, 'longDesc', value);
        }
    });
    addObjProp(HTMLIFrameElement.prototype, {
        name: 'marginHeight',
        get: function marginHeight() {
            return getPrivateProp(this, 'marginHeight');
        },
        set: function marginHeight(value) {
            //更新attributes
            const attributes = getPrivateProp(this, 'attributes');
            attributes.setNamedItem('marginHeight', value);
            return setPrivateProp(this, 'marginHeight', value);
        }
    });
    addObjProp(HTMLIFrameElement.prototype, {
        name: 'marginWidth',
        get: function marginWidth() {
            return getPrivateProp(this, 'marginWidth');
        },
        set: function marginWidth(value) {
            //更新attributes
            const attributes = getPrivateProp(this, 'attributes');
            attributes.setNamedItem('marginWidth', value);
            return setPrivateProp(this, 'marginWidth', value);
        }
    });
    addObjProp(HTMLIFrameElement.prototype, {name: 'getSVGDocument'});
    addObjProp(HTMLIFrameElement.prototype, {
        name: 'credentialless',
        get: function credentialless() {
            return getPrivateProp(this, 'credentialless');
        },
        set: function credentialless(value) {
            //更新attributes
            const attributes = getPrivateProp(this, 'attributes');
            attributes.setNamedItem('credentialless', value);
            return setPrivateProp(this, 'credentialless', value);
        }
    });
    addObjProp(HTMLIFrameElement.prototype, {
        name: 'allowPaymentRequest',
        get: function allowPaymentRequest() {
            return getPrivateProp(this, 'allowPaymentRequest');
        },
        set: function allowPaymentRequest(value) {
            //更新attributes
            const attributes = getPrivateProp(this, 'attributes');
            attributes.setNamedItem('allowPaymentRequest', value);
            return setPrivateProp(this, 'allowPaymentRequest', value);
        }
    });
    addObjProp(HTMLIFrameElement.prototype, {
        name: 'constructor',
        value: HTMLIFrameElement,
        enumerable: false
    });
    addObjProp(HTMLIFrameElement.prototype, {
        name: 'privateToken',
        get: function privateToken() {
            return getPrivateProp(this, 'privateToken');
        },
        set: function privateToken(value) {
            //更新attributes
            const attributes = getPrivateProp(this, 'attributes');
            attributes.setNamedItem('privateToken', value);
            return setPrivateProp(this, 'privateToken', value);
        }
    });
    addObjProp(HTMLIFrameElement.prototype, {
        name: 'browsingTopics',
        get: function browsingTopics() {
            return getPrivateProp(this, 'browsingTopics');
        },
        set: function browsingTopics(value) {
            //更新attributes
            const attributes = getPrivateProp(this, 'attributes');
            attributes.setNamedItem('browsingTopics', value);
            return setPrivateProp(this, 'browsingTopics', value);
        }
    });
    addObjProp(HTMLIFrameElement.prototype, {
        name: 'adAuctionHeaders',
        get: function adAuctionHeaders() {
            return getPrivateProp(this, 'adAuctionHeaders');
        },
        set: function adAuctionHeaders(value) {
            //更新attributes
            const attributes = getPrivateProp(this, 'attributes');
            attributes.setNamedItem('adAuctionHeaders', value);
            return setPrivateProp(this, 'adAuctionHeaders', value);
        }
    });
    addObjProp(HTMLIFrameElement.prototype, {
        name: 'sharedStorageWritable',
        get: function sharedStorageWritable() {
            return getPrivateProp(this, 'sharedStorageWritable');
        },
        set: function sharedStorageWritable(value) {
            //更新attributes
            const attributes = getPrivateProp(this, 'attributes');
            attributes.setNamedItem('sharedStorageWritable', value);
            return setPrivateProp(this, 'sharedStorageWritable', value);
        }
    });
}, HTMLElement);
module.exports = HTMLIFrameElement;
