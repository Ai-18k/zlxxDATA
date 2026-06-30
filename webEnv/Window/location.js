const {
    addObjProp,
    getPrivateProp,
    setPrivateProp
} = require("../utility.js");
const {URL, Location} = require("../CommonApi/api");

function createLocation(){
    const location = new Location();

    addObjProp(location, {
        name: 'valueOf',
        value: function valueOf() {
            return this;
        },
        enumerable: false,
        writable: false
    });
    addObjProp(location, {
        name: 'ancestorOrigins',
        get: function ancestorOrigins() {
            return getPrivateProp(this, 'ancestorOrigins');
        },
        configurable: false
    });
    addObjProp(location, {
        name: 'href',
        get: function href() {
            return getPrivateProp(this, 'href');
        },
        set: function href(value) {
            const urlInfo = new URL(value);
            setPrivateProp(this, 'origin', urlInfo.origin);
            setPrivateProp(this, 'protocol', urlInfo.protocol);
            setPrivateProp(this, 'host', urlInfo.host);
            setPrivateProp(this, 'hostname', urlInfo.hostname);
            setPrivateProp(this, 'port', urlInfo.port);
            setPrivateProp(this, 'pathname', urlInfo.pathname);
            setPrivateProp(this, 'search', urlInfo.search);
            setPrivateProp(this, 'hash', urlInfo.hash);

            return setPrivateProp(this, 'href', value);
        },
        configurable: false
    });
    addObjProp(location, {
        name: 'origin',
        get: function origin() {
            return getPrivateProp(this, 'origin');
        },
        configurable: false
    });
    addObjProp(location, {
        name: 'protocol',
        get: function protocol() {
            return getPrivateProp(this, 'protocol');
        },
        set: function protocol(value) {
            return true;
        },
        configurable: false
    });
    addObjProp(location, {
        name: 'host',
        get: function host() {
            return getPrivateProp(this, 'host');
        },
        set: function host(value) {
            return true;
        },
        configurable: false
    });
    addObjProp(location, {
        name: 'hostname',
        get: function hostname() {
            return getPrivateProp(this, 'hostname');
        },
        set: function hostname(value) {
            return true;
        },
        configurable: false
    });
    addObjProp(location, {
        name: 'port',
        get: function port() {
            return getPrivateProp(this, 'port');
        },
        set: function port(value) {
            return true;
        },
        configurable: false
    });
    addObjProp(location, {
        name: 'pathname',
        get: function pathname() {
            return getPrivateProp(this, 'pathname');
        },
        set: function pathname(value) {
            return true;
        },
        configurable: false
    });
    addObjProp(location, {
        name: 'search',
        get: function search() {
            return getPrivateProp(this, 'search');
        },
        set: function search(value) {
            return true;
        },
        configurable: false
    });
    addObjProp(location, {
        name: 'hash',
        get: function hash() {
            return getPrivateProp(this, 'hash');
        },
        set: function hash(value) {
            return true;
        },
        configurable: false
    });
    addObjProp(location, {
        name: 'assign',
        value: function assign() {
            return true;
        },
        configurable: false,
        writable: false
    });
    addObjProp(location, {
        name: 'reload',
        value: function reload() {
            return true;
        },
        configurable: false,
        writable: false
    });
    addObjProp(location, {
        name: 'replace',
        value: function replace() {
            return true;
        },
        configurable: false,
        writable: false
    });
    addObjProp(location, {
        name: Symbol.toPrimitive,
        value: undefined,
        configurable: false,
        writable: false,
        enumerable: false
    });
    addObjProp(location, {
        name: 'toString',
        value: function toString() {
            return getPrivateProp(this, 'href');
        },
        configurable: false,
        writable: false
    });

    return location;
}

module.exports = createLocation;