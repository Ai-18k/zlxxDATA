const {
    setFunctionPrototype,
    addObjProp,
    getPrivateProp,
    setPrivateProp
} = require("../../utility.js");
const EventTarget = require("./EventTarget.js");

function XMLHttpRequestEventTarget() {
}

setFunctionPrototype(XMLHttpRequestEventTarget, () => {
    addObjProp(XMLHttpRequestEventTarget.prototype, {
        name: 'onloadstart',
        get: function onloadstart() {
            return getPrivateProp(this, 'onloadstart');
        },
        set: function onloadstart(value) {
            return setPrivateProp(this, 'onloadstart', value);
        }
    });
    addObjProp(XMLHttpRequestEventTarget.prototype, {
        name: 'onloadstart',
        get: function onprogress() {
            return getPrivateProp(this, 'onprogress');
        },
        set: function onprogress(value) {
            return setPrivateProp(this, 'onprogress', value);
        }
    });
    addObjProp(XMLHttpRequestEventTarget.prototype, {
        name: 'onabort',
        get: function onabort() {
            return getPrivateProp(this, 'onabort');
        },
        set: function onabort(value) {
            return setPrivateProp(this, 'onabort', value);
        }
    });
    addObjProp(XMLHttpRequestEventTarget.prototype, {
        name: 'onerror',
        get: function onerror() {
            return getPrivateProp(this, 'onerror');
        },
        set: function onerror(value) {
            return setPrivateProp(this, 'onerror', value);
        }
    });
    addObjProp(XMLHttpRequestEventTarget.prototype, {
        name: 'onload',
        get: function onload() {
            return getPrivateProp(this, 'onload');
        },
        set: function onload(value) {
            return setPrivateProp(this, 'onload', value);
        }
    });
    addObjProp(XMLHttpRequestEventTarget.prototype, {
        name: 'ontimeout',
        get: function ontimeout() {
            return getPrivateProp(this, 'ontimeout');
        },
        set: function ontimeout(value) {
            return setPrivateProp(this, 'ontimeout', value);
        }
    });
    addObjProp(XMLHttpRequestEventTarget.prototype, {
        name: 'onloadend',
        get: function onloadend() {
            return getPrivateProp(this, 'onloadend');
        },
        set: function onloadend(value) {
            return setPrivateProp(this, 'onloadend', value);
        }
    });

}, EventTarget);

module.exports = XMLHttpRequestEventTarget;