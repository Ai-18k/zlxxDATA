const {
    addObjProp,
    setFunctionPrototype,
    getPrivateProp,
    setPrivateProp,
    createError,
    originDate,
} = require("../../utility.js");
const Node = require("../../CommonApi/api/Node.js");
const Element = require("../../HTML/api/Element.js");
const Text = require("../../TextApi/Text.js");
const XPathExpression = require("./XPathExpression.js");
const Attr = require("./Attr.js");

function getFormattedDateTime() {
    const now = new originDate();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
}

function Document() {
}

addObjProp(Document, {name: 'parseHTMLUnsafe'});

setFunctionPrototype(Document, () => {
    addObjProp(Document.prototype, {
        name: 'implementation',
        get: function implementation() {
            return getPrivateProp(this, 'implementation');
        }
    });
    addObjProp(Document.prototype, {
        name: 'URL',
        get: function URL() {
            return getPrivateProp(this, 'URL');
        }
    });
    addObjProp(Document.prototype, {
        name: 'documentURI',
        get: function documentURI() {
            return getPrivateProp(this, 'documentURI');
        }
    });
    addObjProp(Document.prototype, {
        name: 'compatMode',
        get: function compatMode() {
            return getPrivateProp(this, 'compatMode');
        }
    });
    addObjProp(Document.prototype, {
        name: 'characterSet',
        get: function characterSet() {
            return getPrivateProp(this, 'characterSet');
        }
    });
    addObjProp(Document.prototype, {
        name: 'charset',
        get: function charset() {
            return getPrivateProp(this, 'charset');
        }
    });
    addObjProp(Document.prototype, {
        name: 'inputEncoding',
        get: function inputEncoding() {
            return getPrivateProp(this, 'inputEncoding');
        }
    });
    addObjProp(Document.prototype, {
        name: 'contentType',
        get: function contentType() {
            return getPrivateProp(this, 'contentType');
        }
    });
    addObjProp(Document.prototype, {
        name: 'doctype',
        get: function doctype() {
            return getPrivateProp(this, 'doctype');
        }
    });
    addObjProp(Document.prototype, {
        name: 'documentElement',
        get: function documentElement() {
            return getPrivateProp(this, 'documentElement');
        }
    });
    addObjProp(Document.prototype, {
        name: 'xmlEncoding',
        get: function xmlEncoding() {
            return getPrivateProp(this, 'xmlEncoding');
        }
    });
    addObjProp(Document.prototype, {
        name: 'xmlVersion',
        get: function xmlVersion() {
            return getPrivateProp(this, 'xmlVersion');
        },
        set: function xmlVersion(value) {
            return setPrivateProp(this, 'xmlVersion', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'xmlStandalone',
        get: function xmlStandalone() {
            return getPrivateProp(this, 'xmlStandalone');
        },
        set: function xmlStandalone(value) {
            return setPrivateProp(this, 'xmlStandalone', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'domain',
        get: function xmlVersion() {
            return getPrivateProp(this, 'domain');
        },
        set: function xmlVersion(value) {
            return setPrivateProp(this, 'domain', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'referrer',
        get: function referrer() {
            return getPrivateProp(this, 'referrer');
        }
    });
    addObjProp(Document.prototype, {
        name: 'cookie',
        get: function cookie() {
            return getPrivateProp(this, 'cookie');
        },
        set: function cookie(value) {
            const oldCookieStr = getPrivateProp(this, 'cookie');
            if (oldCookieStr) {
                const setCookieArr = value.split(';');
                const oldCookie = {
                    key: [],
                    value: []
                };
                oldCookieStr.split(';').forEach((item) => {
                    let [key, val] = item.split('=');
                    oldCookie.key.push(key);
                    oldCookie.value.push(val);
                });
                setCookieArr.forEach((item) => {
                    let [key, val] = item.split('=');
                    if (oldCookie.key.includes(key)) {
                        oldCookie.value[oldCookie.key.indexOf(key)] = val;
                    } else {
                        oldCookie.key.push(key);
                        oldCookie.value.push(val);
                    }
                });
                return setPrivateProp(this, 'cookie', oldCookie.key.map((item, index) => `${item}=${oldCookie.value[index]}`).join(';'));
            } else {
                return setPrivateProp(this, 'cookie', value);
            }
        }
    });
    addObjProp(Document.prototype, {
        name: 'lastModified',
        get: function lastModified() {
            return getFormattedDateTime()
        }
    });
    addObjProp(Document.prototype, {
        name: 'readyState',
        get: function readyState() {
            return getPrivateProp(this, 'readyState');
        }
    });
    addObjProp(Document.prototype, {
        name: 'title',
        get: function title() {
            return getPrivateProp(this, 'title');
        },
        set: function title(value) {
            return setPrivateProp(this, 'title', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'dir',
        get: function dir() {
            return getPrivateProp(this, 'dir');
        },
        set: function dir(value) {
            return setPrivateProp(this, 'dir', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'body',
        get: function body() {
            return getPrivateProp(this, 'body');
        },
        set: function body(value) {
            return setPrivateProp(this, 'body', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'head',
        get: function head() {
            return getPrivateProp(this, 'head');
        }
    });
    addObjProp(Document.prototype, {
        name: 'images',
        get: function images() {
            return getPrivateProp(this, 'images');
        }
    });
    addObjProp(Document.prototype, {
        name: 'embeds',
        get: function embeds() {
            return getPrivateProp(this, 'embeds');
        }
    });
    addObjProp(Document.prototype, {
        name: 'plugins',
        get: function plugins() {
            return getPrivateProp(this, 'plugins');
        }
    });
    addObjProp(Document.prototype, {
        name: 'links',
        get: function links() {
            return getPrivateProp(this, 'links');
        }
    });
    addObjProp(Document.prototype, {
        name: 'forms',
        get: function forms() {
            return getPrivateProp(this, 'forms');
        }
    });
    addObjProp(Document.prototype, {
        name: 'scripts',
        get: function scripts() {
            return getPrivateProp(this, 'scripts');
        }
    });
    addObjProp(Document.prototype, {
        name: 'currentScript',
        get: function currentScript() {
            return getPrivateProp(this, 'currentScript');
        }
    });
    addObjProp(Document.prototype, {
        name: 'defaultView',
        get: function defaultView() {
            return getPrivateProp(this, 'defaultView');
        }
    });
    addObjProp(Document.prototype, {
        name: 'designMode',
        get: function designMode() {
            return getPrivateProp(this, 'designMode');
        },
        set: function designMode(value) {
            return setPrivateProp(this, 'designMode', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onreadystatechange',
        get: function onreadystatechange() {
            return getPrivateProp(this, 'onreadystatechange');
        },
        set: function onreadystatechange(value) {
            return setPrivateProp(this, 'onreadystatechange', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'anchors',
        get: function anchors() {
            return getPrivateProp(this, 'anchors');
        }
    });
    addObjProp(Document.prototype, {
        name: 'applets',
        get: function applets() {
            return getPrivateProp(this, 'applets');
        }
    });
    addObjProp(Document.prototype, {
        name: 'fgColor',
        get: function fgColor() {
            return getPrivateProp(this, 'fgColor');
        },
        set: function fgColor(value) {
            return setPrivateProp(this, 'fgColor', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'linkColor',
        get: function linkColor() {
            return getPrivateProp(this, 'linkColor');
        },
        set: function linkColor(value) {
            return setPrivateProp(this, 'linkColor', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'vlinkColor',
        get: function vlinkColor() {
            return getPrivateProp(this, 'vlinkColor');
        },
        set: function vlinkColor(value) {
            return setPrivateProp(this, 'vlinkColor', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'alinkColor',
        get: function alinkColor() {
            return getPrivateProp(this, 'alinkColor');
        },
        set: function alinkColor(value) {
            return setPrivateProp(this, 'alinkColor', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'bgColor',
        get: function bgColor() {
            return getPrivateProp(this, 'bgColor');
        },
        set: function bgColor(value) {
            return setPrivateProp(this, 'bgColor', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'all',
        get: function all() {
            return getPrivateProp(this, 'all');
        }
    });
    addObjProp(Document.prototype, {
        name: 'scrollingElement',
        get: function scrollingElement() {
            return getPrivateProp(this, 'scrollingElement');
        }
    });
    addObjProp(Document.prototype, {
        name: 'onpointerlockchange',
        get: function onpointerlockchange() {
            return getPrivateProp(this, 'onpointerlockchange');
        },
        set: function onpointerlockchange(value) {
            return setPrivateProp(this, 'onpointerlockchange', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onpointerlockerror',
        get: function onpointerlockerror() {
            return getPrivateProp(this, 'onpointerlockerror');
        },
        set: function onpointerlockerror(value) {
            return setPrivateProp(this, 'onpointerlockerror', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'hidden',
        get: function hidden() {
            return getPrivateProp(this, 'hidden');
        }
    });
    addObjProp(Document.prototype, {
        name: 'visibilityState',
        get: function visibilityState() {
            return getPrivateProp(this, 'visibilityState');
        }
    });
    addObjProp(Document.prototype, {
        name: 'wasDiscarded',
        get: function wasDiscarded() {
            return getPrivateProp(this, 'wasDiscarded');
        }
    });
    addObjProp(Document.prototype, {
        name: 'prerendering',
        get: function prerendering() {
            return getPrivateProp(this, 'prerendering');
        }
    });
    addObjProp(Document.prototype, {
        name: 'featurePolicy',
        get: function featurePolicy() {
            return getPrivateProp(this, 'featurePolicy');
        }
    });
    addObjProp(Document.prototype, {
        name: 'webkitVisibilityState',
        get: function webkitVisibilityState() {
            return getPrivateProp(this, 'webkitVisibilityState');
        }
    });
    addObjProp(Document.prototype, {
        name: 'webkitHidden',
        get: function webkitHidden() {
            return getPrivateProp(this, 'webkitHidden');
        }
    });
    addObjProp(Document.prototype, {
        name: 'onbeforecopy',
        get: function onbeforecopy() {
            return getPrivateProp(this, 'onbeforecopy');
        },
        set: function onbeforecopy(value) {
            return setPrivateProp(this, 'onbeforecopy', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onbeforecut',
        get: function onbeforecut() {
            return getPrivateProp(this, 'onbeforecut');
        },
        set: function onbeforecut(value) {
            return setPrivateProp(this, 'onbeforecut', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onbeforepaste',
        get: function onbeforepaste() {
            return getPrivateProp(this, 'onbeforepaste');
        },
        set: function onbeforepaste(value) {
            return setPrivateProp(this, 'onbeforepaste', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onfreeze',
        get: function onfreeze() {
            return getPrivateProp(this, 'onfreeze');
        },
        set: function onfreeze(value) {
            return setPrivateProp(this, 'onfreeze', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onprerenderingchange',
        get: function onprerenderingchange() {
            return getPrivateProp(this, 'onprerenderingchange');
        },
        set: function onprerenderingchange(value) {
            return setPrivateProp(this, 'onprerenderingchange', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onresume',
        get: function onresume() {
            return getPrivateProp(this, 'onresume');
        },
        set: function onresume(value) {
            return setPrivateProp(this, 'onresume', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onsearch',
        get: function onsearch() {
            return getPrivateProp(this, 'onsearch');
        },
        set: function onsearch(value) {
            return setPrivateProp(this, 'onsearch', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onvisibilitychange',
        get: function onvisibilitychange() {
            return getPrivateProp(this, 'onvisibilitychange');
        },
        set: function onvisibilitychange(value) {
            return setPrivateProp(this, 'onvisibilitychange', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'timeline',
        get: function timeline() {
            return getPrivateProp(this, 'timeline');
        }
    });
    addObjProp(Document.prototype, {
        name: 'fullscreenEnabled',
        get: function fullscreenEnabled() {
            return getPrivateProp(this, 'fullscreenEnabled');
        },
        set: function fullscreenEnabled(value) {
            return setPrivateProp(this, 'fullscreenEnabled', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'fullscreen',
        get: function fullscreen() {
            return getPrivateProp(this, 'fullscreen');
        },
        set: function fullscreen(value) {
            return setPrivateProp(this, 'fullscreen', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onfullscreenchange',
        get: function onfullscreenchange() {
            return getPrivateProp(this, 'onfullscreenchange');
        },
        set: function onfullscreenchange(value) {
            return setPrivateProp(this, 'onfullscreenchange', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onfullscreenerror',
        get: function onfullscreenerror() {
            return getPrivateProp(this, 'onfullscreenerror');
        },
        set: function onfullscreenerror(value) {
            return setPrivateProp(this, 'onfullscreenerror', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'webkitIsFullScreen',
        get: function webkitIsFullScreen() {
            return getPrivateProp(this, 'webkitIsFullScreen');
        }
    });
    addObjProp(Document.prototype, {
        name: 'webkitCurrentFullScreenElement',
        get: function webkitCurrentFullScreenElement() {
            return getPrivateProp(this, 'webkitCurrentFullScreenElement');
        }
    });
    addObjProp(Document.prototype, {
        name: 'webkitFullscreenEnabled',
        get: function webkitFullscreenEnabled() {
            return getPrivateProp(this, 'webkitFullscreenEnabled');
        }
    });
    addObjProp(Document.prototype, {
        name: 'webkitFullscreenElement',
        get: function webkitFullscreenElement() {
            return getPrivateProp(this, 'webkitFullscreenElement');
        }
    });
    addObjProp(Document.prototype, {
        name: 'onwebkitfullscreenchange',
        get: function onwebkitfullscreenchange() {
            return getPrivateProp(this, 'onwebkitfullscreenchange');
        },
        set: function onwebkitfullscreenchange(value) {
            return setPrivateProp(this, 'onwebkitfullscreenchange', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onwebkitfullscreenerror',
        get: function onwebkitfullscreenerror() {
            return getPrivateProp(this, 'onwebkitfullscreenerror');
        },
        set: function onwebkitfullscreenerror(value) {
            return setPrivateProp(this, 'onwebkitfullscreenerror', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'rootElement',
        get: function rootElement() {
            return getPrivateProp(this, 'rootElement');
        }
    });
    addObjProp(Document.prototype, {
        name: 'pictureInPictureEnabled',
        get: function pictureInPictureEnabled() {
            return getPrivateProp(this, 'pictureInPictureEnabled');
        }
    });
    addObjProp(Document.prototype, {
        name: 'onbeforexrselect',
        get: function onbeforexrselect() {
            return getPrivateProp(this, 'onbeforexrselect');
        },
        set: function onbeforexrselect(value) {
            return setPrivateProp(this, 'onbeforexrselect', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onabort',
        get: function onabort() {
            return getPrivateProp(this, 'onabort');
        },
        set: function onabort(value) {
            return setPrivateProp(this, 'onabort', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onbeforeinput',
        get: function onbeforeinput() {
            return getPrivateProp(this, 'onbeforeinput');
        },
        set: function onbeforeinput(value) {
            return setPrivateProp(this, 'onbeforeinput', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onbeforematch',
        get: function onbeforematch() {
            return getPrivateProp(this, 'onbeforematch');
        },
        set: function onbeforematch(value) {
            return setPrivateProp(this, 'onbeforematch', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onbeforetoggle',
        get: function onbeforetoggle() {
            return getPrivateProp(this, 'onbeforetoggle');
        },
        set: function onbeforetoggle(value) {
            return setPrivateProp(this, 'onbeforetoggle', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onblur',
        get: function onblur() {
            return getPrivateProp(this, 'onblur');
        },
        set: function onblur(value) {
            return setPrivateProp(this, 'onblur', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'oncancel',
        get: function oncancel() {
            return getPrivateProp(this, 'oncancel');
        },
        set: function oncancel(value) {
            return setPrivateProp(this, 'oncancel', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'oncanplay',
        get: function oncanplay() {
            return getPrivateProp(this, 'oncanplay');
        },
        set: function oncanplay(value) {
            return setPrivateProp(this, 'oncanplay', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'oncanplaythrough',
        get: function oncanplaythrough() {
            return getPrivateProp(this, 'oncanplaythrough');
        },
        set: function oncanplaythrough(value) {
            return setPrivateProp(this, 'oncanplaythrough', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onchange',
        get: function onchange() {
            return getPrivateProp(this, 'onchange');
        },
        set: function onchange(value) {
            return setPrivateProp(this, 'onchange', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onclick',
        get: function onclick() {
            return getPrivateProp(this, 'onclick');
        },
        set: function onclick(value) {
            return setPrivateProp(this, 'onclick', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onclose',
        get: function onclose() {
            return getPrivateProp(this, 'onclose');
        },
        set: function onclose(value) {
            return setPrivateProp(this, 'onclose', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'oncontentvisibilityautostatechange',
        get: function oncontentvisibilityautostatechange() {
            return getPrivateProp(this, 'oncontentvisibilityautostatechange');
        },
        set: function oncontentvisibilityautostatechange(value) {
            return setPrivateProp(this, 'oncontentvisibilityautostatechange', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'oncontextlost',
        get: function oncontextlost() {
            return getPrivateProp(this, 'oncontextlost');
        },
        set: function oncontextlost(value) {
            return setPrivateProp(this, 'oncontextlost', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'oncontextmenu',
        get: function oncontextmenu() {
            return getPrivateProp(this, 'oncontextmenu');
        },
        set: function oncontextmenu(value) {
            return setPrivateProp(this, 'oncontextmenu', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'oncontextrestored',
        get: function oncontextrestored() {
            return getPrivateProp(this, 'oncontextrestored');
        },
        set: function oncontextrestored(value) {
            return setPrivateProp(this, 'oncontextrestored', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'oncuechange',
        get: function oncuechange() {
            return getPrivateProp(this, 'oncuechange');
        },
        set: function oncuechange(value) {
            return setPrivateProp(this, 'oncuechange', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'ondblclick',
        get: function ondblclick() {
            return getPrivateProp(this, 'ondblclick');
        },
        set: function ondblclick(value) {
            return setPrivateProp(this, 'ondblclick', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'ondrag',
        get: function ondrag() {
            return getPrivateProp(this, 'ondrag');
        },
        set: function ondrag(value) {
            return setPrivateProp(this, 'ondrag', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'ondragend',
        get: function ondragend() {
            return getPrivateProp(this, 'ondragend');
        },
        set: function ondragend(value) {
            return setPrivateProp(this, 'ondragend', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'ondragenter',
        get: function ondragenter() {
            return getPrivateProp(this, 'ondragenter');
        },
        set: function ondragenter(value) {
            return setPrivateProp(this, 'ondragenter', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'ondragleave',
        get: function ondragleave() {
            return getPrivateProp(this, 'ondragleave');
        },
        set: function ondragleave(value) {
            return setPrivateProp(this, 'ondragleave', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'ondragover',
        get: function ondragover() {
            return getPrivateProp(this, 'ondragover');
        },
        set: function ondragover(value) {
            return setPrivateProp(this, 'ondragover', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'ondragstart',
        get: function ondragstart() {
            return getPrivateProp(this, 'ondragstart');
        },
        set: function ondragstart(value) {
            return setPrivateProp(this, 'ondragstart', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'ondrop',
        get: function ondrop() {
            return getPrivateProp(this, 'ondrop');
        },
        set: function ondrop(value) {
            return setPrivateProp(this, 'ondrop', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'ondurationchange',
        get: function ondurationchange() {
            return getPrivateProp(this, 'ondurationchange');
        },
        set: function ondurationchange(value) {
            return setPrivateProp(this, 'ondurationchange', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onemptied',
        get: function onemptied() {
            return getPrivateProp(this, 'onemptied');
        },
        set: function onemptied(value) {
            return setPrivateProp(this, 'onemptied', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onended',
        get: function onended() {
            return getPrivateProp(this, 'onended');
        },
        set: function onended(value) {
            return setPrivateProp(this, 'onended', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onerror',
        get: function onerror() {
            return getPrivateProp(this, 'onerror');
        },
        set: function onerror(value) {
            return setPrivateProp(this, 'onerror', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onfocus',
        get: function onfocus() {
            return getPrivateProp(this, 'onfocus');
        },
        set: function onfocus(value) {
            return setPrivateProp(this, 'onfocus', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onformdata',
        get: function onformdata() {
            return getPrivateProp(this, 'onformdata');
        },
        set: function onformdata(value) {
            return setPrivateProp(this, 'onformdata', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'oninput',
        get: function oninput() {
            return getPrivateProp(this, 'oninput');
        },
        set: function oninput(value) {
            return setPrivateProp(this, 'oninput', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'oninvalid',
        get: function oninvalid() {
            return getPrivateProp(this, 'oninvalid');
        },
        set: function oninvalid(value) {
            return setPrivateProp(this, 'oninvalid', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onkeydown',
        get: function onkeydown() {
            return getPrivateProp(this, 'onkeydown');
        },
        set: function onkeydown(value) {
            return setPrivateProp(this, 'onkeydown', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onkeypress',
        get: function onkeypress() {
            return getPrivateProp(this, 'onkeypress');
        },
        set: function onkeypress(value) {
            return setPrivateProp(this, 'onkeypress', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onkeyup',
        get: function onkeyup() {
            return getPrivateProp(this, 'onkeyup');
        },
        set: function onkeyup(value) {
            return setPrivateProp(this, 'onkeyup', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onload',
        get: function onload() {
            return getPrivateProp(this, 'onload');
        },
        set: function onload(value) {
            return setPrivateProp(this, 'onload', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onloadeddata',
        get: function onloadeddata() {
            return getPrivateProp(this, 'onloadeddata');
        },
        set: function onloadeddata(value) {
            return setPrivateProp(this, 'onloadeddata', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onloadedmetadata',
        get: function onloadedmetadata() {
            return getPrivateProp(this, 'onloadedmetadata');
        },
        set: function onloadedmetadata(value) {
            return setPrivateProp(this, 'onloadedmetadata', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onloadstart',
        get: function onloadstart() {
            return getPrivateProp(this, 'onloadstart');
        },
        set: function onloadstart(value) {
            return setPrivateProp(this, 'onloadstart', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onmousedown',
        get: function onmousedown() {
            return getPrivateProp(this, 'onmousedown');
        },
        set: function onmousedown(value) {
            return setPrivateProp(this, 'onmousedown', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onmouseenter',
        get: function onmouseenter() {
            return getPrivateProp(this, 'onmouseenter');
        },
        set: function onmouseenter(value) {
            return setPrivateProp(this, 'onmouseenter', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onmouseleave',
        get: function onmouseleave() {
            return getPrivateProp(this, 'onmouseleave');
        },
        set: function onmouseleave(value) {
            return setPrivateProp(this, 'onmouseleave', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onmousemove',
        get: function onmousemove() {
            return getPrivateProp(this, 'onmousemove');
        },
        set: function onmousemove(value) {
            return setPrivateProp(this, 'onmousemove', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onmouseout',
        get: function onmouseout() {
            return getPrivateProp(this, 'onmouseout');
        },
        set: function onmouseout(value) {
            return setPrivateProp(this, 'onmouseout', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onmouseover',
        get: function onmouseover() {
            return getPrivateProp(this, 'onmouseover');
        },
        set: function onmouseover(value) {
            return setPrivateProp(this, 'onmouseover', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onmouseup',
        get: function onmouseup() {
            return getPrivateProp(this, 'onmouseup');
        },
        set: function onmouseup(value) {
            return setPrivateProp(this, 'onmouseup', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onmousewheel',
        get: function onmousewheel() {
            return getPrivateProp(this, 'onmousewheel');
        },
        set: function onmousewheel(value) {
            return setPrivateProp(this, 'onmousewheel', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onpause',
        get: function onpause() {
            return getPrivateProp(this, 'onpause');
        },
        set: function onpause(value) {
            return setPrivateProp(this, 'onpause', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onplay',
        get: function onplay() {
            return getPrivateProp(this, 'onplay');
        },
        set: function onplay(value) {
            return setPrivateProp(this, 'onplay', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onplaying',
        get: function onplaying() {
            return getPrivateProp(this, 'onplaying');
        },
        set: function onplaying(value) {
            return setPrivateProp(this, 'onplaying', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onprogress',
        get: function onprogress() {
            return getPrivateProp(this, 'onprogress');
        },
        set: function onprogress(value) {
            return setPrivateProp(this, 'onprogress', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onratechange',
        get: function onratechange() {
            return getPrivateProp(this, 'onratechange');
        },
        set: function onratechange(value) {
            return setPrivateProp(this, 'onratechange', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onreset',
        get: function onreset() {
            return getPrivateProp(this, 'onreset');
        },
        set: function onreset(value) {
            return setPrivateProp(this, 'onreset', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onresize',
        get: function onresize() {
            return getPrivateProp(this, 'onresize');
        },
        set: function onresize(value) {
            return setPrivateProp(this, 'onresize', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onscroll',
        get: function onscroll() {
            return getPrivateProp(this, 'onscroll');
        },
        set: function onscroll(value) {
            return setPrivateProp(this, 'onscroll', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onsecuritypolicyviolation',
        get: function onsecuritypolicyviolation() {
            return getPrivateProp(this, 'onsecuritypolicyviolation');
        },
        set: function onsecuritypolicyviolation(value) {
            return setPrivateProp(this, 'onsecuritypolicyviolation', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onseeked',
        get: function onseeked() {
            return getPrivateProp(this, 'onseeked');
        },
        set: function onseeked(value) {
            return setPrivateProp(this, 'onseeked', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onseeking',
        get: function onseeking() {
            return getPrivateProp(this, 'onseeking');
        },
        set: function onseeking(value) {
            return setPrivateProp(this, 'onseeking', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onselect',
        get: function onselect() {
            return getPrivateProp(this, 'onselect');
        },
        set: function onselect(value) {
            return setPrivateProp(this, 'onselect', value);
            ;
        }
    });
    addObjProp(Document.prototype, {
        name: 'onslotchange',
        get: function onslotchange() {
            return getPrivateProp(this, 'onslotchange');
        },
        set: function onslotchange(value) {
            return setPrivateProp(this, 'onslotchange', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onstalled',
        get: function onstalled() {
            return getPrivateProp(this, 'onstalled');
        },
        set: function onstalled(value) {
            return setPrivateProp(this, 'onstalled', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onsubmit',
        get: function onsubmit() {
            return getPrivateProp(this, 'onsubmit');
        },
        set: function onsubmit(value) {
            return setPrivateProp(this, 'onsubmit', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onsuspend',
        get: function onsuspend() {
            return getPrivateProp(this, 'onsuspend');
        },
        set: function onsuspend(value) {
            return setPrivateProp(this, 'onsuspend', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'ontimeupdate',
        get: function ontimeupdate() {
            return getPrivateProp(this, 'ontimeupdate');
        },
        set: function ontimeupdate(value) {
            return setPrivateProp(this, 'ontimeupdate', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'ontoggle',
        get: function ontoggle() {
            return getPrivateProp(this, 'ontoggle');
        },
        set: function ontoggle(value) {
            return setPrivateProp(this, 'ontoggle', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onvolumechange',
        get: function onvolumechange() {
            return getPrivateProp(this, 'onvolumechange');
        },
        set: function onvolumechange(value) {
            return setPrivateProp(this, 'onvolumechange', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onwaiting',
        get: function onwaiting() {
            return getPrivateProp(this, 'onwaiting');
        },
        set: function onwaiting(value) {
            return setPrivateProp(this, 'onwaiting', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onwebkitanimationend',
        get: function onwebkitanimationend() {
            return getPrivateProp(this, 'onwebkitanimationend');
        },
        set: function onwebkitanimationend(value) {
            return setPrivateProp(this, 'onwebkitanimationend', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onwebkitanimationiteration',
        get: function onwebkitanimationiteration() {
            return getPrivateProp(this, 'onwebkitanimationiteration');
        },
        set: function onwebkitanimationiteration(value) {
            return setPrivateProp(this, 'onwebkitanimationiteration', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onwebkitanimationstart',
        get: function onwebkitanimationstart() {
            return getPrivateProp(this, 'onwebkitanimationstart');
        },
        set: function onwebkitanimationstart(value) {
            return setPrivateProp(this, 'onwebkitanimationstart', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onwebkittransitionend',
        get: function onwebkittransitionend() {
            return getPrivateProp(this, 'onwebkittransitionend');
        },
        set: function onwebkittransitionend(value) {
            return setPrivateProp(this, 'onwebkittransitionend', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onwheel',
        get: function onwheel() {
            return getPrivateProp(this, 'onwheel');
        },
        set: function onwheel(value) {
            return setPrivateProp(this, 'onwheel', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onauxclick',
        get: function onauxclick() {
            return getPrivateProp(this, 'onauxclick');
        },
        set: function onauxclick(value) {
            return setPrivateProp(this, 'onauxclick', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'ongotpointercapture',
        get: function ongotpointercapture() {
            return getPrivateProp(this, 'ongotpointercapture');
        },
        set: function ongotpointercapture(value) {
            return setPrivateProp(this, 'ongotpointercapture', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onlostpointercapture',
        get: function onlostpointercapture() {
            return getPrivateProp(this, 'onlostpointercapture');
        },
        set: function onlostpointercapture(value) {
            return setPrivateProp(this, 'onlostpointercapture', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onpointerdown',
        get: function onpointerdown() {
            return getPrivateProp(this, 'onpointerdown');
        },
        set: function onpointerdown(value) {
            return setPrivateProp(this, 'onpointerdown', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onpointermove',
        get: function onpointermove() {
            return getPrivateProp(this, 'onpointermove');
        },
        set: function onpointermove(value) {
            return setPrivateProp(this, 'onpointermove', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onpointerrawupdate',
        get: function onpointerrawupdate() {
            return getPrivateProp(this, 'onpointerrawupdate');
        },
        set: function onpointerrawupdate(value) {
            return setPrivateProp(this, 'onpointerrawupdate', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onpointerup',
        get: function onpointerup() {
            return getPrivateProp(this, 'onpointerup');
        },
        set: function onpointerup(value) {
            return setPrivateProp(this, 'onpointerup', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onpointercancel',
        get: function onpointercancel() {
            return getPrivateProp(this, 'onpointercancel');
        },
        set: function onpointercancel(value) {
            return setPrivateProp(this, 'onpointercancel', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onpointerover',
        get: function onpointerover() {
            return getPrivateProp(this, 'onpointerover');
        },
        set: function onpointerover(value) {
            return setPrivateProp(this, 'onpointerover', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onpointerout',
        get: function onpointerout() {
            return getPrivateProp(this, 'onpointerout');
        },
        set: function onpointerout(value) {
            return setPrivateProp(this, 'onpointerout', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onpointerenter',
        get: function onpointerenter() {
            return getPrivateProp(this, 'onpointerenter');
        },
        set: function onpointerenter(value) {
            return setPrivateProp(this, 'onpointerenter', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onpointerleave',
        get: function onpointerleave() {
            return getPrivateProp(this, 'onpointerleave');
        },
        set: function onpointerleave(value) {
            return setPrivateProp(this, 'onpointerleave', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onselectstart',
        get: function onselectstart() {
            return getPrivateProp(this, 'onselectstart');
        },
        set: function onselectstart(value) {
            return setPrivateProp(this, 'onselectstart', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onselectionchange',
        get: function onselectionchange() {
            return getPrivateProp(this, 'onselectionchange');
        },
        set: function onselectionchange(value) {
            return setPrivateProp(this, 'onselectionchange', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onanimationend',
        get: function onanimationend() {
            return getPrivateProp(this, 'onanimationend');
        },
        set: function onanimationend(value) {
            return setPrivateProp(this, 'onanimationend', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onanimationiteration',
        get: function onanimationiteration() {
            return getPrivateProp(this, 'onanimationiteration');
        },
        set: function onanimationiteration(value) {
            return setPrivateProp(this, 'onanimationiteration', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onanimationstart',
        get: function onanimationstart() {
            return getPrivateProp(this, 'onanimationstart');
        },
        set: function onanimationstart(value) {
            return setPrivateProp(this, 'onanimationstart', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'ontransitionrun',
        get: function ontransitionrun() {
            return getPrivateProp(this, 'ontransitionrun');
        },
        set: function ontransitionrun(value) {
            return setPrivateProp(this, 'ontransitionrun', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'ontransitionstart',
        get: function ontransitionstart() {
            return getPrivateProp(this, 'ontransitionstart');
        },
        set: function ontransitionstart(value) {
            return setPrivateProp(this, 'ontransitionstart', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'ontransitionend',
        get: function ontransitionend() {
            return getPrivateProp(this, 'ontransitionend');
        },
        set: function ontransitionend(value) {
            return setPrivateProp(this, 'ontransitionend', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'ontransitioncancel',
        get: function ontransitioncancel() {
            return getPrivateProp(this, 'ontransitioncancel');
        },
        set: function ontransitioncancel(value) {
            return setPrivateProp(this, 'ontransitioncancel', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'oncopy',
        get: function oncopy() {
            return getPrivateProp(this, 'oncopy');
        },
        set: function oncopy(value) {
            return setPrivateProp(this, 'oncopy', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'oncut',
        get: function oncut() {
            return getPrivateProp(this, 'oncut');
        },
        set: function oncut(value) {
            return setPrivateProp(this, 'oncut', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onpaste',
        get: function onpaste() {
            return getPrivateProp(this, 'onpaste');
        },
        set: function onpaste(value) {
            return setPrivateProp(this, 'onpaste', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'children',
        get: function children() {
            return getPrivateProp(this, 'children');
        }
    });
    addObjProp(Document.prototype, {
        name: 'firstElementChild',
        get: function firstElementChild() {
            const children = getPrivateProp(this, 'children');
            return children[0];
        }
    });
    addObjProp(Document.prototype, {
        name: 'lastElementChild',
        get: function lastElementChild() {
            const children = getPrivateProp(this, 'children');
            return children[children.length - 1];
        }
    });
    addObjProp(Document.prototype, {
        name: 'childElementCount',
        get: function childElementCount() {
            const children = getPrivateProp(this, 'children');
            return hildren.length;
        }
    });
    addObjProp(Document.prototype, {
        name: 'activeElement',
        get: function activeElement() {
            return getPrivateProp(this, 'activeElement');
        }
    });
    addObjProp(Document.prototype, {
        name: 'styleSheets',
        get: function styleSheets() {
            return getPrivateProp(this, 'styleSheets');
        }
    });
    addObjProp(Document.prototype, {
        name: 'pointerLockElement',
        get: function pointerLockElement() {
            return getPrivateProp(this, 'pointerLockElement');
        }
    });
    addObjProp(Document.prototype, {
        name: 'fullscreenElement',
        get: function fullscreenElement() {
            return getPrivateProp(this, 'fullscreenElement');
        },
        set: function fullscreenElement(value) {
            return setPrivateProp(this, 'fullscreenElement', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'adoptedStyleSheets',
        get: function adoptedStyleSheets() {
            return getPrivateProp(this, 'adoptedStyleSheets');
        },
        set: function adoptedStyleSheets(value) {
            return setPrivateProp(this, 'adoptedStyleSheets', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'pictureInPictureElement',
        get: function pictureInPictureElement() {
            return getPrivateProp(this, 'pictureInPictureElement');
        }
    });
    addObjProp(Document.prototype, {
        name: 'fonts',
        get: function fonts() {
            return getPrivateProp(this, 'fonts');
        }
    });
    addObjProp(Document.prototype, {name: 'adoptNode'});
    addObjProp(Document.prototype, {name: 'append'});
    addObjProp(Document.prototype, {name: 'captureEvents'});
    addObjProp(Document.prototype, {name: 'caretRangeFromPoint'});
    addObjProp(Document.prototype, {name: 'clear'});
    addObjProp(Document.prototype, {name: 'close'});
    addObjProp(Document.prototype, {
        name: 'createAttribute',
        value: function createAttribute(name) {
            const attr = new Attr();
            setPrivateProp(attr, 'name', name);
            setPrivateProp(attr, 'localName', name);
            return attr;
        }
    });
    addObjProp(Document.prototype, {name: 'createAttributeNS'});
    addObjProp(Document.prototype, {name: 'createCDATASection'});
    addObjProp(Document.prototype, {name: 'createComment'});
    addObjProp(Document.prototype, {name: 'createDocumentFragment'});
    addObjProp(Document.prototype, {name: 'createElement'});
    addObjProp(Document.prototype, {
        name: 'createElementNS',
        value: function createElementNS(namespaceURI, tagName) {
            if (!tagName) throw createError("Failed to execute 'createElementNS' on 'Document': The qualified name provided is empty.","InvalidCharacterError");
            const element = new Element();
            setPrivateProp(element,'tagName', tagName);
            return element;

        }
    });
    addObjProp(Document.prototype, {
        name: 'createEvent',
        value: function createEvent(eventInterface) {
            if (['TouchEvent'].includes(eventInterface)) {
                throw createError("Failed to execute 'createEvent' on 'Document': The provided event type ('TouchEvent') is invalid.", "NotSupportedError");
            }
        }
    });
    addObjProp(Document.prototype, {
        name: 'createExpression',
        value: function createExpression(xpathExpression, namespaceResolver = undefined) {
            return new XPathExpression();
        }
    });
    addObjProp(Document.prototype, {name: 'createNSResolver'});
    addObjProp(Document.prototype, {name: 'createNodeIterator'});
    addObjProp(Document.prototype, {name: 'createProcessingInstruction'});
    addObjProp(Document.prototype, {name: 'createRange'});
    addObjProp(Document.prototype, {
        name: 'createTextNode',
        value: function createTextNode(text) {
            return new Text({
                data: text
            })
        }
    });
    addObjProp(Document.prototype, {name: 'createTreeWalker'});
    addObjProp(Document.prototype, {name: 'elementFromPoint'});
    addObjProp(Document.prototype, {name: 'elementsFromPoint'});
    addObjProp(Document.prototype, {name: 'evaluate'});
    addObjProp(Document.prototype, {name: 'execCommand'});
    addObjProp(Document.prototype, {name: 'exitFullscreen',});
    addObjProp(Document.prototype, {name: 'exitPictureInPicture'});
    addObjProp(Document.prototype, {name: 'exitPointerLock'});
    addObjProp(Document.prototype, {name: 'getAnimations'});
    addObjProp(Document.prototype, {name: 'getElementById'});
    addObjProp(Document.prototype, {name: 'getElementsByClassName'});
    addObjProp(Document.prototype, {name: 'getElementsByName'});
    addObjProp(Document.prototype, {name: 'getElementsByTagName'});
    addObjProp(Document.prototype, {name: 'getElementsByTagNameNS'});
    addObjProp(Document.prototype, {name: 'getSelection'});
    addObjProp(Document.prototype, {name: 'hasFocus'});
    addObjProp(Document.prototype, {name: 'hasStorageAccess'});
    addObjProp(Document.prototype, {name: 'hasUnpartitionedCookieAccess'});
    addObjProp(Document.prototype, {name: 'importNode'});
    addObjProp(Document.prototype, {name: 'open'});
    addObjProp(Document.prototype, {name: 'prepend'});
    addObjProp(Document.prototype, {name: 'queryCommandEnabled'});
    addObjProp(Document.prototype, {name: 'queryCommandIndeterm'});
    addObjProp(Document.prototype, {name: 'queryCommandStat'});
    addObjProp(Document.prototype, {name: 'queryCommandSupported'});
    addObjProp(Document.prototype, {name: 'queryCommandValue'});
    addObjProp(Document.prototype, {name: 'querySelector'});
    addObjProp(Document.prototype, {name: 'querySelectorAll'});
    addObjProp(Document.prototype, {name: 'releaseEvents'});
    addObjProp(Document.prototype, {name: 'replaceChildren'});
    addObjProp(Document.prototype, {name: 'requestStorageAccess'});
    addObjProp(Document.prototype, {name: 'requestStorageAccessFor'});
    addObjProp(Document.prototype, {name: 'startViewTransition'});
    addObjProp(Document.prototype, {name: 'webkitCancelFullScreen'});
    addObjProp(Document.prototype, {name: 'webkitExitFullscreen'});
    addObjProp(Document.prototype, {name: 'write'});
    addObjProp(Document.prototype, {name: 'writeln'});
    addObjProp(Document.prototype, {
        name: 'constructor',
        value: Document,
        enumerable: false
    });
    addObjProp(Document.prototype, {
        name: 'fragmentDirective',
        get: function fragmentDirective() {
            return getPrivateProp(this, 'fragmentDirective');
        }
    });
    addObjProp(Document.prototype, {name: 'browsingTopics'});
    addObjProp(Document.prototype, {name: 'hasPrivateToken'});
    addObjProp(Document.prototype, {name: 'hasRedemptionRecord'});
    addObjProp(Document.prototype, {
        name: 'onscrollend',
        get: function onscrollend() {
            return getPrivateProp(this, 'onscrollend');
        },
        set: function onscrollend(value) {
            return setPrivateProp(this, 'onscrollend', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onscrollsnapchange',
        get: function onscrollsnapchange() {
            return getPrivateProp(this, 'onscrollsnapchange');
        },
        set: function onscrollsnapchange(value) {
            return setPrivateProp(this, 'onscrollsnapchange', value);
        }
    });
    addObjProp(Document.prototype, {
        name: 'onscrollsnapchanging',
        get: function onscrollsnapchanging() {
            return getPrivateProp(this, 'onscrollsnapchanging');
        },
        set: function onscrollsnapchanging(value) {
            return setPrivateProp(this, 'onscrollsnapchanging', value);
        }
    });
    addObjProp(Document.prototype, {name: 'caretPositionFromPoint'});
}, Node);

addObjProp(Document.prototype, {
    name: Symbol.unscopables,
    value: {
        "append": true,
        "fullscreen": true,
        "prepend": true,
        "replaceChildren": true
    },
    enumerable: false,
    writable: false
});

module.exports = Document;