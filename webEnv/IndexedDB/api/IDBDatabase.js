const {
    getPrivateProp,
    setPrivateProp,
    setFunctionPrototype,
    addObjProp,
    createError,
    originObject,
    originArray,
    originSet
} = require("../../utility.js");
const EventTarget = require("../../CommonApi/api/EventTarget.js");
const DOMStringList = require("../../CommonApi/api/DOMStringList.js");
const IDBObjectStore = require("./IDBObjectStore.js");
const IDBTransaction = require("./IDBTransaction.js");
const isTransactionExit = require("../fun/isTransactionExit.js");
const getDBInfo = require("../fun/getDBInfo.js");

function ifTransactionRunning(obj){
    let {databaseName, db, transaction} = getDBInfo(obj);
    if(transaction){
        if (getPrivateProp(transaction, 'mode') === 'versionchange') {
            const requestError = createError("The transaction was aborted, so the request cannot be fulfilled.", 'AbortError');
            setPrivateProp(getPrivateProp(obj, 'transaction'), 'requestError', requestError);

            throw createError("Failed to execute 'transaction' on 'IDBDatabase': A version change transaction is running.", 'InvalidStateError');
        }
    }

    return {databaseName, db, transaction}
}

function IDBDatabase() {
}

setFunctionPrototype(IDBDatabase, () => {
    addObjProp(IDBDatabase.prototype, {
        name: 'name',
        get: function name() {
            return getPrivateProp(this, 'name');
        }
    });
    addObjProp(IDBDatabase.prototype, {
        name: 'version',
        get: function version() {
            return getPrivateProp(this, 'version');
        }
    });
    addObjProp(IDBDatabase.prototype, {
        name: 'objectStoreNames',
        get: function objectStoreNames() {
            return getPrivateProp(this, 'objectStoreNames');
        }
    });
    addObjProp(IDBDatabase.prototype, {
        name: 'onabort',
        get: function onabort() {
            return getPrivateProp(this, 'onabort');
        },
        set: function onabort(value) {
            return setPrivateProp(this, 'onabort', value);
        }
    });
    addObjProp(IDBDatabase.prototype, {
        name: 'onclose',
        get: function onclose() {
            return getPrivateProp(this, 'onclose');
        },
        set: function onclose(value) {
            return setPrivateProp(this, 'onclose', value);
        }
    });
    addObjProp(IDBDatabase.prototype, {
        name: 'onerror',
        get: function onerror() {
            return getPrivateProp(this, 'onerror');
        },
        set: function onerror(value) {
            return setPrivateProp(this, 'onerror', value);
        }
    });
    addObjProp(IDBDatabase.prototype, {
        name: 'onversionchange',
        get: function onversionchange() {
            return getPrivateProp(this, 'onversionchange');
        },
        set: function onversionchange(value) {
            return setPrivateProp(this, 'onversionchange', value);
        }
    });
    addObjProp(IDBDatabase.prototype, {
        name: 'close',
        value: function close() {
            ifTransactionRunning(this);
        }
    });
    addObjProp(IDBDatabase.prototype, {
        name: 'createObjectStore',
        value: function createObjectStore(storeName, options = {}) {
            const {databaseName, db, transaction} = isTransactionExit(this, 'createObjectStore');

            if (!db.dataInfo[storeName]) {
                db.dataInfo[storeName] = {
                    keyPath: options.keyPath,
                    index: {},
                    data: []
                };
            }

            //更新Database中的objectStoreNames
            let objectStoreNames = getPrivateProp(this, 'objectStoreNames');
            let addObjectStoreNames = getPrivateProp(objectStoreNames, 'push');
            addObjectStoreNames(storeName);

            //更新transaction中的objectStoreNames
            let objectStoreNames1 = getPrivateProp(transaction, 'objectStoreNames');
            let addObjectStoreNames1 = getPrivateProp(objectStoreNames1, 'push');
            addObjectStoreNames1(storeName);

            const objStore = new IDBObjectStore();
            const indexNames = new DOMStringList([]);
            setPrivateProp(objStore, 'autoIncrement', options.autoIncrement || false);
            setPrivateProp(objStore, 'indexNames', indexNames);
            setPrivateProp(objStore, 'keyPath', options.keyPath);
            setPrivateProp(objStore, 'name', storeName);
            setPrivateProp(objStore, 'transaction', transaction);
            setPrivateProp(objStore, 'databaseName', databaseName);
            //主要用来打开数据库成功之后把事务置空，方便捕获错误，database并没有该属性
            setPrivateProp(this,'objStore', objStore);
            return objStore;
        }
    });
    addObjProp(IDBDatabase.prototype, {
        name: 'deleteObjectStore',
        value: function deleteObjectStore(storeName) {
            const {dbs, databaseName, transaction} = isTransactionExit(this, 'createObjectStore');
            delete dbs[databaseName].dataInfo[storeName];

            setPrivateProp(this,'objectStoreNames', new DOMStringList(originObject.keys(dbs[databaseName].dataInfo)));
            setPrivateProp(transaction,'objectStoreNames', new DOMStringList(originObject.keys(dbs[databaseName].dataInfo)));
        }
    });
    addObjProp(IDBDatabase.prototype, {
        name: 'transaction',
        value: function transaction(storeNames, mode = 'readonly') {
            let {databaseName, db, transaction} = ifTransactionRunning(this);
            const DBStoreNames = originObject.keys(db.dataInfo);
            storeNames = typeof storeNames === 'string' ? [storeNames] : storeNames;
            //判断storeNames是否在DBStoreNames中，不存在说明没有对应的store事务
            if (originArray.from(new originSet([...storeNames, ...DBStoreNames])).length !== DBStoreNames.length) {
                throw createError(" Failed to execute 'transaction' on 'IDBDatabase': One of the specified object stores was not found.", 'NotFoundError');
            }

            if (!transaction) {
                //创建数据库对象
                let database = new IDBDatabase();
                let objectStoreNames = new DOMStringList(DBStoreNames);
                setPrivateProp(database, 'name', databaseName);
                setPrivateProp(database, 'version', db.version);
                setPrivateProp(database, 'objectStoreNames', objectStoreNames);
                //创建事务对象
                let objectStoreNames1 = new DOMStringList(storeNames);
                transaction = new IDBTransaction();
                setPrivateProp(transaction, 'db', database,);
                setPrivateProp(transaction, 'objectStoreNames', objectStoreNames1);
                setPrivateProp(transaction, 'durability', 'default');
                setPrivateProp(transaction, 'mode', mode);
                setPrivateProp(transaction, 'databaseName', databaseName);
                //此时数据库已经打开，避免事务不存在报错，database下并没有该属性
                setPrivateProp(database, 'transaction', transaction);
            }

            return transaction;
        }
    });
}, EventTarget);

module.exports = IDBDatabase;