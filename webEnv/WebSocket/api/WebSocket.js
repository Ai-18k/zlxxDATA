const {
    setFunctionPrototype,
    addObjProp,
    getPrivateProp,
    setPrivateProp
} = require("../../utility.js");
const EventTarget = require("../../CommonApi/api/EventTarget.js");
const staticProp = [
    ["CONNECTING", 0],
    ["OPEN", 1],
    ["CLOSING", 2],
    ["CLOSED", 3]]

function WebSocket() {
}

staticProp.forEach(function (item) {
    addObjProp(WebSocket, {
        name: item[0],
        value: item[1],
        configurable: false,
        writable: false
    });
});

setFunctionPrototype(WebSocket, () => {
    addObjProp(WebSocket.prototype, {
        name: 'url',
        get: function url() {
            return getPrivateProp(this, 'url');
        }
    });
    addObjProp(WebSocket.prototype, {
        name: 'readyState',
        get: function readyState() {
            return getPrivateProp(this, 'readyState');
        }
    });
    addObjProp(WebSocket.prototype, {
        name: 'readyStateQF',
        get: function readyStateQF() {
            return getPrivateProp(this, 'readyStateQF');
        }
    });
    addObjProp(WebSocket.prototype, {
        name: 'onopen',
        get: function onopen() {
            return getPrivateProp(this, 'onopen');
        },
        set: function onopen(value) {
            return setPrivateProp(this, 'onopen', value);
        }
    });
    addObjProp(WebSocket.prototype, {
        name: 'onerror',
        get: function onerror() {
            return getPrivateProp(this, 'onerror');
        },
        set: function onerror(value) {
            return setPrivateProp(this, 'onerror', value);
        }
    });
    addObjProp(WebSocket.prototype, {
        name: 'onclose',
        get: function onclose() {
            return getPrivateProp(this, 'onclose');
        },
        set: function onclose(value) {
            return setPrivateProp(this, 'onclose', value);
        }
    });
    addObjProp(WebSocket.prototype, {
        name: 'extensions',
        get: function extensions() {
            return getPrivateProp(this, 'extensions');
        }
    });
    addObjProp(WebSocket.prototype, {
        name: 'protocol',
        get: function protocol() {
            return getPrivateProp(this, 'protocol');
        }
    });
    addObjProp(WebSocket.prototype, {
        name: 'onmessage',
        get: function onmessage() {
            return getPrivateProp(this, 'onmessage');
        },
        set: function onmessage(value) {
            return setPrivateProp(this, 'onmessage', value);
        }
    });
    addObjProp(WebSocket.prototype, {
        name: 'binaryType',
        get: function binaryType() {
            return getPrivateProp(this, 'binaryType');
        },
        set: function binaryType(value) {
            return setPrivateProp(this, 'binaryType', value);
        }
    });
    staticProp.forEach(function (item) {
        addObjProp(WebSocket.prototype, {
            name: item[0],
            value: item[1],
            configurable: false,
            writable: false
        });
    });
    addObjProp(WebSocket.prototype, {name: 'close'});
    addObjProp(WebSocket.prototype, {name: 'send'});
}, EventTarget);

module.exports = WebSocket