const {
    getPrivateProp,
    setPrivateProp,
    setFunctionPrototype,
    addObjProp,
    originObject
} = require("../../utility.js");
const createIDBRequest = require("../fun/createRequest.js")
const isTransactionExit = require("../fun/isTransactionExit.js");

function createRequest(obj, query, count, type, funName) {
    const {databaseName, db} = isTransactionExit(obj, funName || type);
    const indexName = getPrivateProp(obj, 'name');
    const storeName = getPrivateProp(obj, 'storeName');
    const dataInfo = db.dataInfo[storeName];
    const indexInfo = dataInfo.index;

    let result = undefined, indexData = undefined;
    originObject.keys(indexInfo).forEach(key => {
        if (indexInfo[key].name === indexName) {
            indexData = indexInfo[key].data;
        }
    });

    switch (type) {
        case 'count':
            result = indexData.length;
            if (query) result = indexData.filter(item => item.keyPathValue === query).length;
            break;
        case 'get':
            if (query) result = indexData.filter(item => item.keyPathValue === query)[0].value;
            break;
        case 'getAll':
            result = indexData.map(item => item.value);
            if (query) result = result.filter(item => item[dataInfo.keyPath] === query);
            if (count > 0) result = result.splice(0, count);
            break;
        case 'key':
            result = indexData.map(item => item.primaryKeyValue);
            if (query) result = result.filter(item => item === query);
            if (count > 0) result = result.splice(0, count);
            break;
    }
    return createIDBRequest(this, {result, databaseName});
}

function IDBIndex() {
}

setFunctionPrototype(IDBIndex, () => {
    addObjProp(IDBIndex.prototype, {
        name: 'name',
        get: function name() {
            return getPrivateProp(this, 'name');
        },
        set: function name(value) {
            return setPrivateProp(this, 'name', value);
        }
    });
    addObjProp(IDBIndex.prototype, {
        name: 'objectStore',
        get: function objectStore() {
            return getPrivateProp(this, 'objectStore');
        }
    });
    addObjProp(IDBIndex.prototype, {
        name: 'keyPath',
        get: function keyPath() {
            return getPrivateProp(this, 'keyPath');
        }
    });
    addObjProp(IDBIndex.prototype, {
        name: 'multiEntry',
        get: function multiEntry() {
            return getPrivateProp(this, 'multiEntry');
        }
    });
    addObjProp(IDBIndex.prototype, {
        name: 'unique',
        get: function unique() {
            return getPrivateProp(this, 'unique');
        }
    });
    addObjProp(IDBIndex.prototype, {
        name: 'count',
        value: function count(query = undefined) {
            return createRequest(this, query, null, 'count');
        }
    });
    addObjProp(IDBIndex.prototype, {
        name: 'get',
        value: function get(query) {
            return createRequest(this, query, null, 'get');
        }
    });
    addObjProp(IDBIndex.prototype, {
        name: 'getAll',
        value: function get(query = undefined, count = undefined) {
            return createRequest(this, query, count, 'getAll');
        }
    });
    addObjProp(IDBIndex.prototype, {
        name: 'getAllKeys',
        value: function getAllKeys(query = undefined, count = undefined) {
            return createRequest(this, query, count, 'key', 'getAllKeys');
        }
    });
    addObjProp(IDBIndex.prototype, {
        name: 'getKey',
        value: function getKey(query) {
            return createRequest(this, query, null, 'key', 'getKey');
        }
    });
    addObjProp(IDBIndex.prototype, {name: 'openCursor'});
    addObjProp(IDBIndex.prototype, {name: 'openKeyCursor'});
})

module.exports = IDBIndex;