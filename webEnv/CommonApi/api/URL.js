const {
    getPrivateProp,
    setPrivateProp,
    setFunctionPrototype,
    addObjProp,
    createError
} = require("../../utility.js");
const URLSearchParams = require("./URLSearchParams.js");
const updateUrl = require("../fun/updateUrl.js");

function setHref(obj, href){
    href = href.replace(':443', '');
    const result = href.match(/^(http:|https:)\/\/((.+):(.+)@)?([^\/#@:]+)(:(\d+))?([^?#]*)?([^#]*)?(.*)?/);
    if (!result || !result[1] || !result[5]) {
        throw createError("Failed to construct 'URL': Invalid URL", "TypeError");
    }
    setPrivateProp(obj, 'href', result[0]);
    setPrivateProp(obj, 'protocol', result[1]);
    setPrivateProp(obj, 'username', result[3] || '');
    setPrivateProp(obj, 'password', result[4] || '');
    setPrivateProp(obj, 'hostname', result[5]);
    setPrivateProp(obj, 'port', result[7] || '');
    setPrivateProp(obj, 'pathname', result[8] || '');
    setPrivateProp(obj, 'search', result[9] || '');
    setPrivateProp(obj, 'hash', result[10] || '');

    const host = `${result[5]}${result[7]? `:${result[7]}`:''}`;
    setPrivateProp(obj, 'host', host);
    setPrivateProp(obj, 'origin', `${result[1]}//${host}`);

    setPrivateProp(obj, 'searchParams', new URLSearchParams(result[9]?.split('?')[1]));

    return true;
}

function URL(href) {
    if (href) {
        setHref(this, href);
    }

}

addObjProp(URL, {name: 'canParse'});
addObjProp(URL, {name: 'parse'});
addObjProp(URL, {name: 'createObjectURL'});
addObjProp(URL, {name: 'revokeObjectURL'});

setFunctionPrototype(URL, () => {
    addObjProp(URL.prototype, {
        name: 'origin',
        get: function origin() {
            return getPrivateProp(this, 'origin');
        }
    });
    addObjProp(URL.prototype, {
        name: 'protocol',
        get: function protocol() {
            return getPrivateProp(this, 'protocol');
        },
        set: function protocol(value) {
            return updateUrl(this, 'protocol', value);
        }
    });
    addObjProp(URL.prototype, {
        name: 'username',
        get: function username() {
            return getPrivateProp(this, 'username');
        },
        set: function username(value) {
            return updateUrl(this, 'username', value);
        }
    });
    addObjProp(URL.prototype, {
        name: 'password',
        get: function password() {
            return getPrivateProp(this, 'password');
        },
        set: function password(value) {
            return updateUrl(this, 'password', value);
        }
    });
    addObjProp(URL.prototype, {
        name: 'host',
        get: function host() {
            return getPrivateProp(this, 'host');
        },
        set: function host(value) {
            return updateUrl(this, 'host', value);
        }
    });
    addObjProp(URL.prototype, {
        name: 'hostname',
        get: function hostname() {
            return getPrivateProp(this, 'hostname');
        },
        set: function hostname(value) {
            return setPrivateProp(this, 'hostname', value);
        }
    });
    addObjProp(URL.prototype, {
        name: 'port',
        get: function port() {
            return getPrivateProp(this, 'port');
        },
        set: function port(value) {
            return updateUrl(this, 'port', value);
        }
    });
    addObjProp(URL.prototype, {
        name: 'pathname',
        get: function pathname() {
            return getPrivateProp(this, 'pathname');
        },
        set: function pathname(value) {
            return updateUrl(this, 'pathname', value);
        }
    });
    addObjProp(URL.prototype, {
        name: 'search',
        get: function search() {
            return getPrivateProp(this, 'search');
        },
        set: function search(value) {
            return updateUrl(this, 'search', value);
        }
    });
    addObjProp(URL.prototype, {
        name: 'searchParams',
        get: function searchParams() {
            return getPrivateProp(this, 'searchParams');
        }
    });
    addObjProp(URL.prototype, {
        name: 'hash',
        get: function hash() {
            return getPrivateProp(this, 'hash');
        },
        set: function hash(value) {
            return updateUrl(this, 'hash', value);
        }
    });
    addObjProp(URL.prototype, {
        name: 'href',
        get: function href() {
            return getPrivateProp(this, 'href');
        },
        set: function href(value) {
            return setHref(this, value);
        }
    });
    addObjProp(URL.prototype, {
        name: 'toJSON',
        value: function toJSON() {
            return getPrivateProp(this, 'href');
        }
    });
    addObjProp(URL.prototype, {
        name: 'toString',
        value: function toString() {
            return getPrivateProp(this, 'href');
        }
    });
});

module.exports = URL;

