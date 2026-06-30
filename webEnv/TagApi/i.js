const {
    getPrivateProp,
    setPrivateProp,
    setFunctionPrototype,
    addObjProp
} = require("../utility.js");
const baseHTMLElement = require("../HTML/api/HTMLElement.js");
const initHTML = require("../HTML/fun/initHtml.js");

/**
 * @constructor HTMLElement i构造函数
 * @param {object} options 配置项
 * @param {object} options[prop] baseHTMLElement下的所有属性都可配置
 * */
function HTMLElement(options= undefined) {
    if (options) {
        let newOptions = {
            nodeName: 'I',
            nodeType: 1,
            tagName: 'I'
        }
        if(typeof options === 'string') {
            newOptions.vmDom = options;
        }else{
            newOptions = {...newOptions, ...options};
        }
        initHTML(this, newOptions);
    }
}

setFunctionPrototype(HTMLElement, ()=>{
    addObjProp(HTMLElement.prototype, {
        name: 'title',
        get: function title() {
            return getPrivateProp(this, 'title')
        },
        set: function title(value) {
            return setPrivateProp(this, 'title', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'lang',
        get: function lang() {
            return getPrivateProp(this, 'lang')
        },
        set: function lang(value) {
            return setPrivateProp(this, 'lang', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'translate',
        get: function translate() {
            return getPrivateProp(this, 'translate')
        },
        set: function translate(value) {
            return setPrivateProp(this, 'translate', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'dir',
        get: function dir() {
            return getPrivateProp(this, 'dir')
        },
        set: function dir(value) {
            return setPrivateProp(this, 'dir', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'hidden',
        get: function hidden() {
            return getPrivateProp(this, 'hidden')
        },
        set: function hidden(value) {
            return setPrivateProp(this, 'hidden', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'inert',
        get: function inert() {
            return getPrivateProp(this, 'inert')
        },
        set: function inert(value) {
            return setPrivateProp(this, 'inert', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'accessKey',
        get: function accessKey() {
            return getPrivateProp(this, 'accessKey')
        },
        set: function accessKey(value) {
            return setPrivateProp(this, 'accessKey', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'draggable',
        get: function draggable() {
            return getPrivateProp(this, 'draggable')
        },
        set: function draggable(value) {
            return setPrivateProp(this, 'draggable', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'spellcheck',
        get: function spellcheck() {
            return getPrivateProp(this, 'spellcheck')
        },
        set: function spellcheck(value) {
            return setPrivateProp(this, 'spellcheck', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'autocapitalize',
        get: function autocapitalize() {
            return getPrivateProp(this, 'autocapitalize')
        },
        set: function autocapitalize(value) {
            return setPrivateProp(this, 'autocapitalize', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'editContext',
        get: function editContext() {
            return getPrivateProp(this, 'editContext')
        },
        set: function editContext(value) {
            return setPrivateProp(this, 'editContext', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'contentEditable',
        get: function contentEditable() {
            return getPrivateProp(this, 'contentEditable')
        },
        set: function contentEditable(value) {
            return setPrivateProp(this, 'contentEditable', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'enterKeyHint',
        get: function enterKeyHint() {
            return getPrivateProp(this, 'enterKeyHint')
        },
        set: function enterKeyHint(value) {
            return setPrivateProp(this, 'enterKeyHint', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'isContentEditable',
        get: function isContentEditable() {
            return getPrivateProp(this, 'isContentEditable')
        },
        set: function isContentEditable(value) {
            return setPrivateProp(this, 'isContentEditable', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'inputMode',
        get: function inputMode() {
            return getPrivateProp(this, 'inputMode')
        },
        set: function inputMode(value) {
            return setPrivateProp(this, 'inputMode', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'virtualKeyboardPolicy',
        get: function virtualKeyboardPolicy() {
            return getPrivateProp(this, 'virtualKeyboardPolicy')
        },
        set: function virtualKeyboardPolicy(value) {
            return setPrivateProp(this, 'virtualKeyboardPolicy', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'offsetParent',
        get: function offsetParent() {
            return getPrivateProp(this, 'offsetParent')
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'offsetTop',
        get: function offsetTop() {
            return getPrivateProp(this, 'offsetTop')
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'offsetLeft',
        get: function offsetLeft() {
            return getPrivateProp(this, 'offsetLeft')
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'offsetWidth',
        get: function offsetWidth() {
            return getPrivateProp(this, 'offsetWidth')
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'offsetHeight',
        get: function offsetHeight() {
            return getPrivateProp(this, 'offsetHeight')
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'popover',
        get: function popover() {
            return getPrivateProp(this, 'popover')
        },
        set: function popover(value) {
            return setPrivateProp(this, 'popover', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'innerText',
        get: function innerText() {
            return getPrivateProp(this, 'innerText')
        },
        set: function innerText(value) {
            return setPrivateProp(this, 'innerText', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'outerText',
        get: function outerText() {
            return getPrivateProp(this, 'outerText')
        },
        set: function outerText(value) {
            return setPrivateProp(this, 'outerText', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'writingSuggestions',
        get: function writingSuggestions() {
            return getPrivateProp(this, 'writingSuggestions')
        },
        set: function writingSuggestions(value) {
            return setPrivateProp(this, 'writingSuggestions', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onbeforexrselect',
        get: function onbeforexrselect() {
            return getPrivateProp(this, 'onbeforexrselect')
        },
        set: function onbeforexrselect(value) {
            return setPrivateProp(this, 'onbeforexrselect', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onabort',
        get: function onabort() {
            return getPrivateProp(this, 'onabort')
        },
        set: function onabort(value) {
            return setPrivateProp(this, 'onabort', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onbeforeinput',
        get: function onbeforeinput() {
            return getPrivateProp(this, 'onbeforeinput')
        },
        set: function onbeforeinput(value) {
            return setPrivateProp(this, 'onbeforeinput', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onbeforematch',
        get: function onbeforematch() {
            return getPrivateProp(this, 'onbeforematch')
        },
        set: function onbeforematch(value) {
            return setPrivateProp(this, 'onbeforematch', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onbeforetoggle',
        get: function onbeforetoggle() {
            return getPrivateProp(this, 'onbeforetoggle')
        },
        set: function onbeforetoggle(value) {
            return setPrivateProp(this, 'onbeforetoggle', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onblur',
        get: function onblur() {
            return getPrivateProp(this, 'onblur')
        },
        set: function onblur(value) {
            return setPrivateProp(this, 'onblur', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'oncancel',
        get: function oncancel() {
            return getPrivateProp(this, 'oncancel')
        },
        set: function oncancel(value) {
            return setPrivateProp(this, 'oncancel', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'oncanplay',
        get: function oncanplay() {
            return getPrivateProp(this, 'oncanplay')
        },
        set: function oncanplay(value) {
            return setPrivateProp(this, 'oncanplay', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'oncanplaythrough',
        get: function oncanplaythrough() {
            return getPrivateProp(this, 'oncanplaythrough')
        },
        set: function oncanplaythrough(value) {
            return setPrivateProp(this, 'oncanplaythrough', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onchange',
        get: function onchange() {
            return getPrivateProp(this, 'onchange')
        },
        set: function onchange(value) {
            return setPrivateProp(this, 'onchange', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onclick',
        get: function onclick() {
            return getPrivateProp(this, 'onclick')
        },
        set: function onclick(value) {
            return setPrivateProp(this, 'onclick', value)
        }
    }); addObjProp(HTMLElement.prototype, {
        name: 'onclose',
        get: function onclose() {
            return getPrivateProp(this, 'onclose')
        },
        set: function onclose(value) {
            return setPrivateProp(this, 'onclose', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'oncontentvisibilityautostatechange',
        get: function oncontentvisibilityautostatechange() {
            return getPrivateProp(this, 'oncontentvisibilityautostatechange')
        },
        set: function oncontentvisibilityautostatechange(value) {
            return setPrivateProp(this, 'oncontentvisibilityautostatechange', value)
        }
    }); addObjProp(HTMLElement.prototype, {
        name: 'oncontextlost',
        get: function oncontextlost() {
            return getPrivateProp(this, 'oncontextlost')
        },
        set: function oncontextlost(value) {
            return setPrivateProp(this, 'oncontextlost', value)
        }
    }); addObjProp(HTMLElement.prototype, {
        name: 'oncontextmenu',
        get: function oncontextmenu() {
            return getPrivateProp(this, 'oncontextmenu')
        },
        set: function oncontextmenu(value) {
            return setPrivateProp(this, 'oncontextmenu', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'oncontextrestored',
        get: function oncontextrestored() {
            return getPrivateProp(this, 'oncontextrestored')
        },
        set: function oncontextrestored(value) {
            return setPrivateProp(this, 'oncontextrestored', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'oncuechange',
        get: function oncuechange() {
            return getPrivateProp(this, 'oncuechange')
        },
        set: function oncuechange(value) {
            return setPrivateProp(this, 'oncuechange', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'ondblclick',
        get: function ondblclick() {
            return getPrivateProp(this, 'ondblclick')
        },
        set: function ondblclick(value) {
            return setPrivateProp(this, 'ondblclick', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'ondrag',
        get: function ondrag() {
            return getPrivateProp(this, 'ondrag')
        },
        set: function ondrag(value) {
            return setPrivateProp(this, 'ondrag', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'ondragend',
        get: function ondragend() {
            return getPrivateProp(this, 'ondragend')
        },
        set: function ondragend(value) {
            return setPrivateProp(this, 'ondragend', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'ondragenter',
        get: function ondragenter() {
            return getPrivateProp(this, 'ondragenter')
        },
        set: function ondragenter(value) {
            return setPrivateProp(this, 'ondragenter', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'ondragleave',
        get: function ondragleave() {
            return getPrivateProp(this, 'ondragleave')
        },
        set: function ondragleave(value) {
            return setPrivateProp(this, 'ondragleave', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'ondragover',
        get: function ondragover() {
            return getPrivateProp(this, 'ondragover')
        },
        set: function ondragover(value) {
            return setPrivateProp(this, 'ondragover', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'ondragstart',
        get: function ondragstart() {
            return getPrivateProp(this, 'ondragstart')
        },
        set: function ondragstart(value) {
            return setPrivateProp(this, 'ondragstart', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'ondrop',
        get: function ondrop() {
            return getPrivateProp(this, 'ondrop')
        },
        set: function ondrop(value) {
            return setPrivateProp(this, 'ondrop', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'ondurationchange',
        get: function ondurationchange() {
            return getPrivateProp(this, 'ondurationchange')
        },
        set: function ondurationchange(value) {
            return setPrivateProp(this, 'ondurationchange', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onemptied',
        get: function onemptied() {
            return getPrivateProp(this, 'onemptied')
        },
        set: function onemptied(value) {
            return setPrivateProp(this, 'onemptied', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onended',
        get: function onended() {
            return getPrivateProp(this, 'onended')
        },
        set: function onended(value) {
            return setPrivateProp(this, 'onended', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onerror',
        get: function onerror() {
            return getPrivateProp(this, 'onerror')
        },
        set: function onerror(value) {
            return setPrivateProp(this, 'onerror', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onfocus',
        get: function onfocus() {
            return getPrivateProp(this, 'onfocus')
        },
        set: function onfocus(value) {
            return setPrivateProp(this, 'onfocus', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onformdata',
        get: function onformdata() {
            return getPrivateProp(this, 'onformdata')
        },
        set: function onformdata(value) {
            return setPrivateProp(this, 'onformdata', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'oninput',
        get: function oninput() {
            return getPrivateProp(this, 'oninput')
        },
        set: function oninput(value) {
            return setPrivateProp(this, 'oninput', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'oninvalid',
        get: function oninvalid() {
            return getPrivateProp(this, 'oninvalid')
        },
        set: function oninvalid(value) {
            return setPrivateProp(this, 'oninvalid', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onkeydown',
        get: function onkeydown() {
            return getPrivateProp(this, 'onkeydown')
        },
        set: function onkeydown(value) {
            return setPrivateProp(this, 'onkeydown', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onkeypress',
        get: function onkeypress() {
            return getPrivateProp(this, 'onkeypress')
        },
        set: function onkeypress(value) {
            return setPrivateProp(this, 'onkeypress', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onkeyup',
        get: function onkeyup() {
            return getPrivateProp(this, 'onkeyup')
        },
        set: function onkeyup(value) {
            return setPrivateProp(this, 'onkeyup', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onload',
        get: function onload() {
            return getPrivateProp(this, 'onload')
        },
        set: function onload(value) {
            return setPrivateProp(this, 'onload', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onloadeddata',
        get: function onloadeddata() {
            return getPrivateProp(this, 'onloadeddata')
        },
        set: function onloadeddata(value) {
            return setPrivateProp(this, 'onloadeddata', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onloadedmetadata',
        get: function onloadedmetadata() {
            return getPrivateProp(this, 'onloadedmetadata')
        },
        set: function onloadedmetadata(value) {
            return setPrivateProp(this, 'onloadedmetadata', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onloadstart',
        get: function onloadstart() {
            return getPrivateProp(this, 'onloadstart')
        },
        set: function onloadstart(value) {
            return setPrivateProp(this, 'onloadstart', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onmousedown',
        get: function onmousedown() {
            return getPrivateProp(this, 'onmousedown')
        },
        set: function onmousedown(value) {
            return setPrivateProp(this, 'onmousedown', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onmouseenter',
        get: function onmouseenter() {
            return getPrivateProp(this, 'onmouseenter')
        },
        set: function onmouseenter(value) {
            return setPrivateProp(this, 'onmouseenter', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onmouseleave',
        get: function onmouseleave() {
            return getPrivateProp(this, 'onmouseleave')
        },
        set: function onmouseleave(value) {
            return setPrivateProp(this, 'onmouseleave', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onmousemove',
        get: function onmousemove() {
            return getPrivateProp(this, 'onmousemove')
        },
        set: function onmousemove(value) {
            return setPrivateProp(this, 'onmousemove', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onmouseout',
        get: function onmouseout() {
            return getPrivateProp(this, 'onmouseout')
        },
        set: function onmouseout(value) {
            return setPrivateProp(this, 'onmouseout', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onmouseover',
        get: function onmouseover() {
            return getPrivateProp(this, 'onmouseover')
        },
        set: function onmouseover(value) {
            return setPrivateProp(this, 'onmouseover', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onmouseup',
        get: function onmouseup() {
            return getPrivateProp(this, 'onmouseup')
        },
        set: function onmouseup(value) {
            return setPrivateProp(this, 'onmouseup', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onmousewheel',
        get: function onmousewheel() {
            return getPrivateProp(this, 'onmousewheel')
        },
        set: function onmousewheel(value) {
            return setPrivateProp(this, 'onmousewheel', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onpause',
        get: function onpause() {
            return getPrivateProp(this, 'onpause')
        },
        set: function onpause(value) {
            return setPrivateProp(this, 'onpause', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onplay',
        get: function onplay() {
            return getPrivateProp(this, 'onplay')
        },
        set: function onplay(value) {
            return setPrivateProp(this, 'onplay', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onplaying',
        get: function onplaying() {
            return getPrivateProp(this, 'onplaying')
        },
        set: function onplaying(value) {
            return setPrivateProp(this, 'onplaying', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onprogress',
        get: function onprogress() {
            return getPrivateProp(this, 'onprogress')
        },
        set: function onprogress(value) {
            return setPrivateProp(this, 'onprogress', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onratechange',
        get: function onratechange() {
            return getPrivateProp(this, 'onratechange')
        },
        set: function onratechange(value) {
            return setPrivateProp(this, 'onratechange', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onreset',
        get: function onreset() {
            return getPrivateProp(this, 'onreset')
        },
        set: function onreset(value) {
            return setPrivateProp(this, 'onreset', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onresize',
        get: function onresize() {
            return getPrivateProp(this, 'onresize')
        },
        set: function onresize(value) {
            return setPrivateProp(this, 'onresize', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onscroll',
        get: function onscroll() {
            return getPrivateProp(this, 'onscroll')
        },
        set: function onscroll(value) {
            return setPrivateProp(this, 'onscroll', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onsecuritypolicyviolation',
        get: function onsecuritypolicyviolation() {
            return getPrivateProp(this, 'onsecuritypolicyviolation')
        },
        set: function onsecuritypolicyviolation(value) {
            return setPrivateProp(this, 'onsecuritypolicyviolation', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onseeked',
        get: function onseeked() {
            return getPrivateProp(this, 'onseeked')
        },
        set: function onseeked(value) {
            return setPrivateProp(this, 'onseeked', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onseeking',
        get: function onseeking() {
            return getPrivateProp(this, 'onseeking')
        },
        set: function onseeking(value) {
            return setPrivateProp(this, 'onseeking', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onselect',
        get: function onselect() {
            return getPrivateProp(this, 'onselect')
        },
        set: function onselect(value) {
            return setPrivateProp(this, 'onselect', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onslotchange',
        get: function onslotchange() {
            return getPrivateProp(this, 'onslotchange')
        },
        set: function onslotchange(value) {
            return setPrivateProp(this, 'onslotchange', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onstalled',
        get: function onstalled() {
            return getPrivateProp(this, 'onstalled')
        },
        set: function onstalled(value) {
            return setPrivateProp(this, 'onstalled', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onsubmit',
        get: function onsubmit() {
            return getPrivateProp(this, 'onsubmit')
        },
        set: function onsubmit(value) {
            return setPrivateProp(this, 'onsubmit', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onsuspend',
        get: function onsuspend() {
            return getPrivateProp(this, 'onsuspend')
        },
        set: function onsuspend(value) {
            return setPrivateProp(this, 'onsuspend', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'ontimeupdate',
        get: function ontimeupdate() {
            return getPrivateProp(this, 'ontimeupdate')
        },
        set: function ontimeupdate(value) {
            return setPrivateProp(this, 'ontimeupdate', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'ontoggle',
        get: function ontoggle() {
            return getPrivateProp(this, 'ontoggle')
        },
        set: function ontoggle(value) {
            return setPrivateProp(this, 'ontoggle', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onvolumechange',
        get: function onvolumechange() {
            return getPrivateProp(this, 'onvolumechange')
        },
        set: function onvolumechange(value) {
            return setPrivateProp(this, 'onvolumechange', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onwaiting',
        get: function onwaiting() {
            return getPrivateProp(this, 'onwaiting')
        },
        set: function onwaiting(value) {
            return setPrivateProp(this, 'onwaiting', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onwebkitanimationend',
        get: function onwebkitanimationend() {
            return getPrivateProp(this, 'onwebkitanimationend')
        },
        set: function onwebkitanimationend(value) {
            return setPrivateProp(this, 'onwebkitanimationend', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onwebkitanimationiteration',
        get: function onwebkitanimationiteration() {
            return getPrivateProp(this, 'onwebkitanimationiteration')
        },
        set: function onwebkitanimationiteration(value) {
            return setPrivateProp(this, 'onwebkitanimationiteration', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onwebkitanimationstart',
        get: function onwebkitanimationstart() {
            return getPrivateProp(this, 'onwebkitanimationstart')
        },
        set: function onwebkitanimationstart(value) {
            return setPrivateProp(this, 'onwebkitanimationstart', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onwebkittransitionend',
        get: function onwebkittransitionend() {
            return getPrivateProp(this, 'onwebkittransitionend')
        },
        set: function onwebkittransitionend(value) {
            return setPrivateProp(this, 'onwebkittransitionend', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onwheel',
        get: function onwheel() {
            return getPrivateProp(this, 'onwheel')
        },
        set: function onwheel(value) {
            return setPrivateProp(this, 'onwheel', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onauxclick',
        get: function onauxclick() {
            return getPrivateProp(this, 'onauxclick')
        },
        set: function onauxclick(value) {
            return setPrivateProp(this, 'onauxclick', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'ongotpointercapture',
        get: function ongotpointercapture() {
            return getPrivateProp(this, 'ongotpointercapture')
        },
        set: function ongotpointercapture(value) {
            return setPrivateProp(this, 'ongotpointercapture', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onlostpointercapture',
        get: function onlostpointercapture() {
            return getPrivateProp(this, 'onlostpointercapture')
        },
        set: function onlostpointercapture(value) {
            return setPrivateProp(this, 'onlostpointercapture', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onpointerdown',
        get: function onpointerdown() {
            return getPrivateProp(this, 'onpointerdown')
        },
        set: function onpointerdown(value) {
            return setPrivateProp(this, 'onpointerdown', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onpointermove',
        get: function onpointermove() {
            return getPrivateProp(this, 'onpointermove')
        },
        set: function onpointermove(value) {
            return setPrivateProp(this, 'onpointermove', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onpointerrawupdate',
        get: function onpointerrawupdate() {
            return getPrivateProp(this, 'onpointerrawupdate')
        },
        set: function onpointerrawupdate(value) {
            return setPrivateProp(this, 'onpointerrawupdate', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onpointerup',
        get: function onpointerup() {
            return getPrivateProp(this, 'onpointerup')
        },
        set: function onpointerup(value) {
            return setPrivateProp(this, 'onpointerup', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onpointercancel',
        get: function onpointercancel() {
            return getPrivateProp(this, 'onpointercancel')
        },
        set: function onpointercancel(value) {
            return setPrivateProp(this, 'onpointercancel', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onpointerover',
        get: function onpointerover() {
            return getPrivateProp(this, 'onpointerover')
        },
        set: function onpointerover(value) {
            return setPrivateProp(this, 'onpointerover', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onpointerout',
        get: function onpointerout() {
            return getPrivateProp(this, 'onpointerout')
        },
        set: function onpointerout(value) {
            return setPrivateProp(this, 'onpointerout', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onpointerenter',
        get: function onpointerenter() {
            return getPrivateProp(this, 'onpointerenter')
        },
        set: function onpointerenter(value) {
            return setPrivateProp(this, 'onpointerenter', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onpointerleave',
        get: function onpointerleave() {
            return getPrivateProp(this, 'onpointerleave')
        },
        set: function onpointerleave(value) {
            return setPrivateProp(this, 'onpointerleave', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onselectstart',
        get: function onselectstart() {
            return getPrivateProp(this, 'onselectstart')
        },
        set: function onselectstart(value) {
            return setPrivateProp(this, 'onselectstart', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onselectionchange',
        get: function onselectionchange() {
            return getPrivateProp(this, 'onselectionchange')
        },
        set: function onselectionchange(value) {
            return setPrivateProp(this, 'onselectionchange', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onanimationend',
        get: function onanimationend() {
            return getPrivateProp(this, 'onanimationend')
        },
        set: function onanimationend(value) {
            return setPrivateProp(this, 'onanimationend', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onanimationiteration',
        get: function onanimationiteration() {
            return getPrivateProp(this, 'onanimationiteration')
        },
        set: function onanimationiteration(value) {
            return setPrivateProp(this, 'onanimationiteration', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onanimationstart',
        get: function onanimationstart() {
            return getPrivateProp(this, 'onanimationstart')
        },
        set: function onanimationstart(value) {
            return setPrivateProp(this, 'onanimationstart', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'ontransitionrun',
        get: function ontransitionrun() {
            return getPrivateProp(this, 'ontransitionrun')
        },
        set: function ontransitionrun(value) {
            return setPrivateProp(this, 'ontransitionrun', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'ontransitionstart',
        get: function ontransitionstart() {
            return getPrivateProp(this, 'ontransitionstart')
        },
        set: function ontransitionstart(value) {
            return setPrivateProp(this, 'ontransitionstart', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'ontransitionend',
        get: function ontransitionend() {
            return getPrivateProp(this, 'ontransitionend')
        },
        set: function ontransitionend(value) {
            return setPrivateProp(this, 'ontransitionend', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'ontransitioncancel',
        get: function ontransitioncancel() {
            return getPrivateProp(this, 'ontransitioncancel')
        },
        set: function ontransitioncancel(value) {
            return setPrivateProp(this, 'ontransitioncancel', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'oncopy',
        get: function oncopy() {
            return getPrivateProp(this, 'oncopy')
        },
        set: function oncopy(value) {
            return setPrivateProp(this, 'oncopy', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'oncut',
        get: function oncut() {
            return getPrivateProp(this, 'oncut')
        },
        set: function oncut(value) {
            return setPrivateProp(this, 'oncut', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onpaste',
        get: function onpaste() {
            return getPrivateProp(this, 'onpaste')
        },
        set: function onpaste(value) {
            return setPrivateProp(this, 'onpaste', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'dataset',
        get: function dataset() {
            return getPrivateProp(this, 'dataset')
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'nonce',
        get: function nonce() {
            return getPrivateProp(this, 'nonce')
        },
        set: function nonce(value) {
            return setPrivateProp(this, 'nonce', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'autofocus',
        get: function autofocus() {
            return getPrivateProp(this, 'autofocus')
        },
        set: function autofocus(value) {
            return setPrivateProp(this, 'autofocus', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'tabIndex',
        get: function tabIndex() {
            return getPrivateProp(this, 'tabIndex')
        },
        set: function tabIndex(value) {
            return setPrivateProp(this, 'tabIndex', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'style',
        get: function style() {
            return getPrivateProp(this, 'style')
        },
        set: function style(value) {
            return setPrivateProp(this, 'style', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'attributeStyleMap',
        get: function attributeStyleMap() {
            return getPrivateProp(this, 'attributeStyleMap')
        }
    });
    addObjProp(HTMLElement.prototype, {name: 'attachInternals'});
    addObjProp(HTMLElement.prototype, {name: 'blur'});
    addObjProp(HTMLElement.prototype, {name: 'click'});
    addObjProp(HTMLElement.prototype, {name: 'focus'});
    addObjProp(HTMLElement.prototype, {name: 'hidePopover'});
    addObjProp(HTMLElement.prototype, {name: 'showPopover'});
    addObjProp(HTMLElement.prototype, {name: 'togglePopover'});
    addObjProp(HTMLElement.prototype, {
        name: 'onscrollend',
        get: function onscrollend() {
            return getPrivateProp(this, 'onscrollend')
        },
        set: function onscrollend(value) {
            return setPrivateProp(this, 'onscrollend', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onscrollsnapchange',
        get: function onscrollsnapchange() {
            return getPrivateProp(this, 'onscrollsnapchange')
        },
        set: function onscrollsnapchange(value) {
            return setPrivateProp(this, 'onscrollsnapchange', value)
        }
    });
    addObjProp(HTMLElement.prototype, {
        name: 'onscrollsnapchanging',
        get: function onscrollsnapchanging() {
            return getPrivateProp(this, 'onscrollsnapchanging')
        },
        set: function onscrollsnapchanging(value) {
            return setPrivateProp(this, 'onscrollsnapchanging', value)
        }
    });
},baseHTMLElement);

module.exports = HTMLElement;