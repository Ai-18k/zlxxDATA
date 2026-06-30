const {
    getPrivateProp,
    setPrivateProp,
    setFunctionPrototype,
    addObjProp,
    createError,
    getOriginObj
} = require("../../utility.js");
const EventTarget = require("../../CommonApi/api/EventTarget.js");
const requestEventCallback = require("../fun/requestEventCallback.js");

function isStatePending(obj, funName) {
    const readyState = getPrivateProp(obj, 'readyState');
    if (readyState === 'pending') {
        throw createError(`Failed to read the '${funName}' property from 'IDBRequest': The request has not finished.`, 'InvalidStateError');
    }
}

function IDBRequest() {
}

setFunctionPrototype(IDBRequest, () => {
    addObjProp(IDBRequest.prototype, {
        name: 'result',
        get: function result() {
            isStatePending(this, 'result');
            return getPrivateProp(this, 'result');
        }
    });
    addObjProp(IDBRequest.prototype, {
        name: 'error',
        get: function error() {
            isStatePending(this, 'error');
            return getPrivateProp(this, 'error');
        }
    });
    addObjProp(IDBRequest.prototype, {
        name: 'source',
        get: function source() {
            return getPrivateProp(this, 'source');
        }
    });
    addObjProp(IDBRequest.prototype, {
        name: 'transaction',
        get: function transaction() {
            return getPrivateProp(this, 'transaction');
        }
    });
    addObjProp(IDBRequest.prototype, {
        name: 'readyState',
        get: function readyState() {
            return getPrivateProp(this, 'readyState');
        }
    });
    addObjProp(IDBRequest.prototype, {
        name: 'onsuccess',
        get: function onsuccess() {
            return getPrivateProp(this, 'onsuccess');
        },
        set: function onsuccess(value) {
            const originObj = getOriginObj(this);
            //IDBOpenDBRequest需要先执行onupgradeneeded，再执行onsuccess、onerror
            if(!(originObj instanceof IDBOpenDBRequest)) requestEventCallback(this, value, 'success');
            return setPrivateProp(this, 'onsuccess', value);
        }
    });
    addObjProp(IDBRequest.prototype, {
        name: 'onerror',
        get: function onerror() {
            return getPrivateProp(this, 'onerror');
        },
        set: function onerror(value) {
            const originObj = getOriginObj(this);
            //IDBOpenDBRequest需要先执行onupgradeneeded，再执行onsuccess、onerror
            if(!(originObj instanceof IDBOpenDBRequest)) requestEventCallback(this, value, 'error');
            return setPrivateProp(this, 'onerror', value);
        }
    });
}, EventTarget);


module.exports = IDBRequest;