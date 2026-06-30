const {
    getPrivateProp,
    setPrivateProp,
    setFunctionPrototype,
    addObjProp,
    createError,
    originObject
} = require("../../utility.js");
const EventTarget = require("../../CommonApi/api/EventTarget.js");
const DOMStringList = require("../../CommonApi/api/DOMStringList.js");
const getDBInfo = require("../fun/getDBInfo.js");

function IDBTransaction() {
}

setFunctionPrototype(IDBTransaction, () => {
    addObjProp(IDBTransaction.prototype, {
        name: 'objectStoreNames',
        get: function objectStoreNames() {
            return getPrivateProp(this, 'objectStoreNames');
        }
    });
    addObjProp(IDBTransaction.prototype, {
        name: 'mode',
        get: function mode() {
            return getPrivateProp(this, 'mode');
        }
    });
    addObjProp(IDBTransaction.prototype, {
        name: 'durability',
        get: function durability() {
            return getPrivateProp(this, 'durability');
        }
    });
    addObjProp(IDBTransaction.prototype, {
        name: 'db',
        get: function db() {
            return getPrivateProp(this, 'db');
        }
    });
    addObjProp(IDBTransaction.prototype, {
        name: 'error',
        get: function error() {
            return getPrivateProp(this, 'error');
        }
    });
    addObjProp(IDBTransaction.prototype, {
        name: 'onabort',
        get: function onabort() {
            return getPrivateProp(this, 'onabort');
        },
        set: function onabort(value) {
            return setPrivateProp(this, 'onabort', value);
        }
    });
    addObjProp(IDBTransaction.prototype, {
        name: 'oncomplete',
        get: function oncomplete() {
            return getPrivateProp(this, 'oncomplete');
        },
        set: function oncomplete(value) {
            return setPrivateProp(this, 'oncomplete', value);
        }
    });
    addObjProp(IDBTransaction.prototype, {
        name: 'onerror',
        get: function onerror() {
            return getPrivateProp(this, 'onerror');
        },
        set: function onerror(value) {
            return setPrivateProp(this, 'onerror', value);
        }
    });

    addObjProp(IDBTransaction.prototype, {name: 'abort'});
    addObjProp(IDBTransaction.prototype, {name: 'commit'});
    addObjProp(IDBTransaction.prototype, {
        name: 'objectStore',
        value: function objectStore(name) {
            const {db} = getDBInfo(this);
            const storeInfo = db.dataInfo[name];
            const objectStoreNames = getPrivateProp(this,'objectStoreNames');

            if (!objectStoreNames.contains(name) || !storeInfo) {
                throw createError("NotFoundError: Failed to execute 'objectStore' on 'IDBTransaction': The specified object store was not found.", 'NotFoundError');
            }

            let database = getPrivateProp(this, 'db');
            const storeOption = {};

            originObject.keys(storeInfo).forEach(key => {
                if (!['index','data'].includes(key)) {
                    storeOption[key] = storeInfo[key];
                }
            });
            const objectStore = database.createObjectStore(name, storeOption);
            setPrivateProp(objectStore, 'indexNames', new DOMStringList(originObject.keys(storeInfo.index)));
            return objectStore;
        }
    });
}, EventTarget);

module.exports = IDBTransaction;