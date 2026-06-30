const {
    getPrivateProp,
    setPrivateProp,
    setFunctionPrototype,
    addObjProp,
    getOriginObj,
} = require("../utility.js");
const URL = require("../CommonApi/api/URL.js");
const HTMLElement = require("../HTML/api/HTMLElement.js");
const initHTML = require("../HTML/fun/initHtml.js");
const updateUrl = require("../CommonApi/fun/updateUrl.js");
const generateOptions = require("../HTML/fun/generateOptions");

function setUrlInfo(aTag, href) {

    const originLocation = getOriginObj(location);
    if (href === '') {
        href = originLocation.href;
    } else {
        const origin = originLocation.origin;
        if (!/^(http|https):\/\/.*/.test(href)) {
            href = href.at(-1) !== '/' ? origin + href : `${origin}/${href}`;
        }
    }

    const urlInfo = new URL(href);
    setPrivateProp(aTag, 'href', urlInfo.href);
    setPrivateProp(aTag, 'protocol', urlInfo.protocol);
    setPrivateProp(aTag, 'origin', urlInfo.origin);
    setPrivateProp(aTag, 'hostname', urlInfo.hostname);
    setPrivateProp(aTag, 'host', urlInfo.host);
    setPrivateProp(aTag, 'port', urlInfo.port);
    setPrivateProp(aTag, 'pathname', urlInfo.pathname);
    setPrivateProp(aTag, 'search', urlInfo.search);
    setPrivateProp(aTag, 'hash', urlInfo.hash);
    setPrivateProp(aTag, 'username', urlInfo.username);
    setPrivateProp(aTag, 'password', urlInfo.password);
}

/**
 * @constructor HTMLAnchorElement a标签构造函数
 * @param {object} options 配置项
 * @param {object} options[prop] HTMLElement下的所有属性都可配置
 * */
function HTMLAnchorElement(options = undefined) {
    if (options) {
        let newOptions = {
            nodeName: 'A',
            nodeType: 1,
            tagName: 'A'
        }
        if(typeof options === 'string') {
            newOptions.vmDom = options;
            newOptions = generateOptions(newOptions);
        }else{
            newOptions = {...newOptions, ...options};
        }
        if (newOptions.href) {
            setUrlInfo(this, newOptions.href);
            delete newOptions.href;
        }
        initHTML(this, newOptions);
    }
}

setFunctionPrototype(HTMLAnchorElement, () => {
    addObjProp(HTMLAnchorElement.prototype, {
        name: 'target',
        get: function target() {
            return getPrivateProp(this, 'target')
        },
        set: function target(value) {
            return setPrivateProp(this, 'target', value)
        }
    });
    addObjProp(HTMLAnchorElement.prototype, {
        name: 'download',
        get: function download() {
            return getPrivateProp(this, 'download')
        },
        set: function download(value) {
            return setPrivateProp(this, 'download', value)
        }
    });
    addObjProp(HTMLAnchorElement.prototype, {
        name: 'ping',
        get: function ping() {
            return getPrivateProp(this, 'ping')
        },
        set: function ping(value) {
            return setPrivateProp(this, 'ping', value)
        }
    });
    addObjProp(HTMLAnchorElement.prototype, {
        name: 'rel',
        get: function rel() {
            return getPrivateProp(this, 'rel')
        },
        set: function rel(value) {
            return setPrivateProp(this, 'rel', value)
        }
    });
    addObjProp(HTMLAnchorElement.prototype, {
        name: 'relList',
        get: function relList() {
            return getPrivateProp(this, 'relList')
        },
        set: function relList(value) {
            return setPrivateProp(this, 'relList', value)
        }
    });
    addObjProp(HTMLAnchorElement.prototype, {
        name: 'hreflang',
        get: function hreflang() {
            return getPrivateProp(this, 'hreflang')
        },
        set: function hreflang(value) {
            return setPrivateProp(this, 'hreflang', value)
        }
    });
    addObjProp(HTMLAnchorElement.prototype, {
        name: 'type',
        get: function type() {
            return getPrivateProp(this, 'type')
        },
        set: function type(value) {
            return setPrivateProp(this, 'type', value)
        }
    });
    addObjProp(HTMLAnchorElement.prototype, {
        name: 'referrerPolicy',
        get: function referrerPolicy() {
            return getPrivateProp(this, 'referrerPolicy')
        },
        set: function referrerPolicy(value) {
            return setPrivateProp(this, 'referrerPolicy', value)
        }
    });
    addObjProp(HTMLAnchorElement.prototype, {
        name: 'text',
        get: function text() {
            return getPrivateProp(this, 'text')
        },
        set: function text(value) {
            return setPrivateProp(this, 'text', value)
        }
    });
    addObjProp(HTMLAnchorElement.prototype, {
        name: 'coords',
        get: function coords() {
            return getPrivateProp(this, 'coords')
        },
        set: function coords(value) {
            return setPrivateProp(this, 'coords', value)
        }
    });
    addObjProp(HTMLAnchorElement.prototype, {
        name: 'charset',
        get: function charset() {
            return getPrivateProp(this, 'charset')
        },
        set: function charset(value) {
            return setPrivateProp(this, 'charset', value)
        }
    });
    addObjProp(HTMLAnchorElement.prototype, {
        name: 'name',
        get: function name() {
            return getPrivateProp(this, 'name')
        },
        set: function name(value) {
            return setPrivateProp(this, 'name', value)
        }
    });
    addObjProp(HTMLAnchorElement.prototype, {
        name: 'rev',
        get: function rev() {
            return getPrivateProp(this, 'rev')
        },
        set: function rev(value) {
            return setPrivateProp(this, 'rev', value)
        }
    });
    addObjProp(HTMLAnchorElement.prototype, {
        name: 'shape',
        get: function shape() {
            return getPrivateProp(this, 'shape')
        },
        set: function shape(value) {
            return setPrivateProp(this, 'shape', value)
        }
    });
    addObjProp(HTMLAnchorElement.prototype, {
        name: 'origin',
        get: function origin() {
            return getPrivateProp(this, 'origin');
        }
    });
    addObjProp(HTMLAnchorElement.prototype, {
        name: 'protocol',
        get: function protocol() {
            return getPrivateProp(this, 'protocol')
        },
        set: function protocol(value) {
            return updateUrl(this, 'protocol', value);
        }
    });
    addObjProp(HTMLAnchorElement.prototype, {
        name: 'username',
        get: function username() {
            return getPrivateProp(this, 'username')
        },
        set: function username(value) {
            return updateUrl(this, 'username', value);
        }
    });
    addObjProp(HTMLAnchorElement.prototype, {
        name: 'password',
        get: function password() {
            return getPrivateProp(this, 'password')
        },
        set: function password(value) {
            return updateUrl(this, 'password', value);
        }
    });
    addObjProp(HTMLAnchorElement.prototype, {
        name: 'host',
        get: function host() {
            return getPrivateProp(this, 'host')
        },
        set: function host(value) {
            return updateUrl(this, 'host', value);
        }
    });
    addObjProp(HTMLAnchorElement.prototype, {
        name: 'hostname',
        get: function hostname() {
            return getPrivateProp(this, 'hostname')
        },
        set: function hostname(value) {
            return updateUrl(this, 'hostname', value);
        }
    });
    addObjProp(HTMLAnchorElement.prototype, {
        name: 'port',
        get: function port() {
            return getPrivateProp(this, 'port')
        },
        set: function port(value) {
            return updateUrl(this, 'port', value);
        }
    });
    addObjProp(HTMLAnchorElement.prototype, {
        name: 'pathname',
        get: function pathname() {
            return getPrivateProp(this, 'pathname');
        },
        set: function pathname(value) {
            return updateUrl(this, 'pathname', value);
        }
    });
    addObjProp(HTMLAnchorElement.prototype, {
        name: 'search',
        get: function search() {
            return getPrivateProp(this, 'search')
        },
        set: function search(value) {
            return updateUrl(this, 'search', value);
        }
    });
    addObjProp(HTMLAnchorElement.prototype, {
        name: 'hash',
        get: function hash() {
            return getPrivateProp(this, 'hash')
        },
        set: function hash(value) {
            return updateUrl(this, 'hash', value);
        }
    });
    addObjProp(HTMLAnchorElement.prototype, {
        name: 'href',
        get: function href() {
            return getPrivateProp(this, 'href')
        },
        set: function href(value) {
            return setUrlInfo(this, value);
        }
    });
    addObjProp(HTMLAnchorElement.prototype, {name: 'toString'});
}, HTMLElement);

addObjProp(HTMLAnchorElement.prototype, {
    name: 'hrefTranslate',
    get: function hrefTranslate() {
        return getPrivateProp(this, 'hrefTranslate')
    },
    set: function hrefTranslate(value) {
        return setPrivateProp(this, 'hrefTranslate', value)
    }
});
addObjProp(HTMLAnchorElement.prototype, {
    name: 'attributionSrc',
    get: function attributionSrc() {
        return getPrivateProp(this, 'attributionSrc')
    },
    set: function attributionSrc(value) {
        return setPrivateProp(this, 'attributionSrc', value)
    }
});

module.exports = HTMLAnchorElement;