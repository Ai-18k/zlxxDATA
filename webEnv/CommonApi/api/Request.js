const {
    setFunctionPrototype,
    addObjProp,
    getPrivateProp
} = require("../../utility.js");

function Request(){}

setFunctionPrototype(Request,()=>{
    addObjProp(Request.prototype, {
        name: 'method',
        get: function method() {
            return getPrivateProp(this, 'method');
        }
    });
    addObjProp(Request.prototype, {
        name: 'url',
        get: function url() {
            return getPrivateProp(this, 'url');
        }
    });
    addObjProp(Request.prototype, {
        name: 'headers',
        get: function headers() {
            return getPrivateProp(this, 'headers');
        }
    });
    addObjProp(Request.prototype, {
        name: 'destination',
        get: function destination() {
            return getPrivateProp(this, 'destination');
        }
    });
    addObjProp(Request.prototype, {
        name: 'referrer',
        get: function referrer() {
            return getPrivateProp(this, 'referrer');
        }
    });
    addObjProp(Request.prototype, {
        name: 'referrerPolicy',
        get: function referrerPolicy() {
            return getPrivateProp(this, 'referrerPolicy');
        }
    });
    addObjProp(Request.prototype, {
        name: 'mode',
        get: function mode() {
            return getPrivateProp(this, 'mode');
        }
    });
    addObjProp(Request.prototype, {
        name: 'credentials',
        get: function credentials() {
            return getPrivateProp(this, 'credentials');
        }
    });
    addObjProp(Request.prototype, {
        name: 'cache',
        get: function cache() {
            return getPrivateProp(this, 'cache');
        }
    });
    addObjProp(Request.prototype, {
        name: 'redirect',
        get: function redirect() {
            return getPrivateProp(this, 'redirect');
        }
    });
    addObjProp(Request.prototype, {
        name: 'integrity',
        get: function integrity() {
            return getPrivateProp(this, 'integrity');
        }
    });
    addObjProp(Request.prototype, {
        name: 'keepalive',
        get: function keepalive() {
            return getPrivateProp(this, 'keepalive');
        }
    });
    addObjProp(Request.prototype, {
        name: 'signal',
        get: function signal() {
            return getPrivateProp(this, 'signal');
        }
    });
    addObjProp(Request.prototype, {
        name: 'duplex',
        get: function duplex() {
            return getPrivateProp(this, 'duplex');
        }
    });
    addObjProp(Request.prototype, {
        name: 'isHistoryNavigation',
        get: function isHistoryNavigation() {
            return getPrivateProp(this, 'isHistoryNavigation');
        }
    });
    addObjProp(Request.prototype, {
        name: 'bodyUsed',
        get: function bodyUsed() {
            return getPrivateProp(this, 'bodyUsed');
        }
    });
    addObjProp(Request.prototype, {name: 'arrayBuffer'});
    addObjProp(Request.prototype, {name: 'blob'});
    addObjProp(Request.prototype, {name: 'clone'});
    addObjProp(Request.prototype, {name: 'formData'});
    addObjProp(Request.prototype, {name: 'json'});
    addObjProp(Request.prototype, {name: 'text'});
    addObjProp(Request.prototype, {name: 'body'});
    addObjProp(Request.prototype, {
        name: 'constructor',
        value: Request,
        enumerable: false
    });
    addObjProp(Request.prototype, {
        name: 'targetAddressSpace',
        get: function bodyUsed() {
            return getPrivateProp(this, 'targetAddressSpace');
        }
    });
});


module.exports = Request;