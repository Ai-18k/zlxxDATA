const {
    getPrivateProp,
    setPrivateProp,
    setFunctionPrototype,
    createError,
    addObjProp,
    updateFunToString,
    originObject
} = require("../../utility.js");
const DOMStringList = require("../../CommonApi/api/DOMStringList.js");
const IDBIndex = require("./IDBIndex.js");
const createIDBRequest = require("../fun/createRequest");
const isTransactionExit = require("../fun/isTransactionExit.js");
const getDBInfo = require("../fun/getDBInfo.js");

function ifKeyPathExit(obj, value, funName) {
    const {db} = getDBInfo(obj);
    const storeName = getPrivateProp(obj, 'name');
    const dataInfo = db.dataInfo[storeName];
    if (!originObject.keys(value).includes(dataInfo.keyPath)) {
        throw createError(`Failed to execute '${funName}' on 'IDBObjectStore': Evaluating the object store's key path did not yield a value.`, 'DataError');
    }
}

function createRequest(obj, query, count, type, funName) {
    const {databaseName, db} = isTransactionExit(obj, funName || type);
    const storeName = getPrivateProp(obj, 'name');
    const dataInfo = db.dataInfo[storeName];
    let result = dataInfo.data;

    switch (type) {
        case 'result':
            if (query) result = result.filter(item => item[dataInfo.keyPath] === query);
            if (count > 0) result = result.splice(0, count);
            break;
        case 'key':
            result = result.map(item => item[dataInfo.keyPath]);
            if (count > 0) result = result.splice(0, count);
            break;
        case 'count':
            if (query) result = result.filter(item => item[dataInfo.keyPath] === query);
            result = result.length;
            break;
        case 'clear':
            result = undefined;
            dataInfo.data = [];
            originObject.keys(dataInfo.index).forEach(key => {
                dataInfo.index[key].data = [];
            });
            break;
        case 'delete':
            result = undefined;
            let newData = [];
            dataInfo.data.forEach(item => {
                if (item[dataInfo.keyPath] !== query) newData.push(item);
            });
            dataInfo.data = newData;
            originObject.keys(dataInfo.index).forEach(key => {
                let newData1 = [];
                dataInfo.index[key].data.forEach(item => {
                    if (item[dataInfo.keyPath] !== query) newData1.push(item);
                });
                dataInfo.index[key].data = newData1;
            });
            break;
        case 'openCursor':
            break;
    }

    return createIDBRequest(obj, {result, databaseName});
}

function createAddRequest(obj, value, key, type) {
    ifKeyPathExit(obj, value, type);
    const {databaseName, db} = isTransactionExit(obj, type);
    const storeName = getPrivateProp(obj, 'name');
    const dataInfo = db.dataInfo[storeName];
    let requestError, transactionError;

    let exitsData = {}; //已存在数据，用来校验唯一性、更新数据
    let dataKeys = originObject.keys(value);
    if (dataInfo.data.length) {
        originObject.keys(dataInfo.data[0]).forEach((key) => {
            exitsData[key] = dataInfo.data.map(item => item[key]);
        });
        dataKeys.forEach(key => {
            exitsData[`${key}PrimaryKey`] = dataInfo.index[key]?.data.map(item => item.primaryKeyValue) || [];
        });
    }

    let unique = false, uniqueName = '';

    //判断唯一的index是否有重复数据，如果有重复数据则不进行添加
    for (let i = 0; i < dataKeys.length; i++) {
        const key = dataKeys[i];
        if (
            dataInfo.index[key] && dataInfo.index[key].data.length &&
            dataInfo.index[key].unique && exitsData[key].includes(value[key]) && !unique
        ) {
            unique = true;
            uniqueName = key;
            break;
        }
    }

    if (!unique) {
        let newValue = {...value};
        dataKeys.forEach((key, index) => {
            if (dataInfo.index[key]) {
                if (dataInfo.index[key].data.length) {
                    if (exitsData[`${key}PrimaryKey`].includes(value[dataInfo.keyPath])) {
                        const repeatIndex = exitsData[`${key}PrimaryKey`].indexOf(value[dataInfo.keyPath]);
                        dataInfo.index[key].data[repeatIndex] = {
                            keyPathValue: value[key],
                            primaryKeyValue: value[dataInfo.keyPath],
                            value: value
                        };
                    } else {
                        dataInfo.index[key].data.push({
                            keyPathValue: value[key],
                            primaryKeyValue: value[dataInfo.keyPath],
                            value: value
                        });
                    }
                } else {
                    dataInfo.index[key].data.push({
                        keyPathValue: value[key],
                        primaryKeyValue: value[dataInfo.keyPath],
                        value: value
                    });
                }
            }
        });
        if (dataInfo.data.length) {
            const repeatIndex = exitsData[dataInfo.keyPath].indexOf(value[dataInfo.keyPath]);
            if (repeatIndex > -1) {
                if (type === 'put') dataInfo.data[repeatIndex] = newValue;
            } else {
                dataInfo.data.push(newValue);
            }
        } else {
            dataInfo.data.push(newValue);
        }
    } else {
        requestError = createError("The transaction was aborted, so the request cannot be fulfilled.", 'AbortError');
        transactionError = createError(`Unable to add key to index '${uniqueName}': at least one key does not satisfy the uniqueness requirements.`, 'ConstraintError');
    }

    if (type === 'add' && exitsData[dataInfo.keyPath].includes(value[dataInfo.keyPath])) {
        transactionError = createError(`Key already exists in the object store.`, 'ConstraintError');
    }

    const result = value[dataInfo.keyPath];

    return createIDBRequest(obj, {result, databaseName, transactionError, requestError});
}


function IDBObjectStore() {
}

setFunctionPrototype(IDBObjectStore, () => {
    addObjProp(IDBObjectStore.prototype, {
        name: 'name',
        get: function name() {
            return getPrivateProp(this, 'name');
        },
        set: function name(value) {
            return setPrivateProp(this, 'name', value);
        }
    });
    addObjProp(IDBObjectStore.prototype, {
        name: 'keyPath',
        get: function keyPath() {
            return getPrivateProp(this, 'keyPath');
        }
    });
    addObjProp(IDBObjectStore.prototype, {
        name: 'indexNames',
        get: function indexNames() {
            return getPrivateProp(this, 'indexNames');
        }
    });
    addObjProp(IDBObjectStore.prototype, {
        name: 'transaction',
        get: function transaction() {
            return getPrivateProp(this, 'transaction');
        }
    });
    addObjProp(IDBObjectStore.prototype, {
        name: 'autoIncrement',
        get: function autoIncrement() {
            return getPrivateProp(this, 'autoIncrement');
        }
    });
    addObjProp(IDBObjectStore.prototype, {
        name: 'add',
        value: function add(value, key = undefined) {
            return createAddRequest(this, value, key, 'add');
        }
    });
    addObjProp(IDBObjectStore.prototype, {
        name: 'clear',
        value: function clear() {
            return createRequest(this, null, null, 'clear')
        }
    });
    addObjProp(IDBObjectStore.prototype, {
        name: 'count',
        value: function count(query = undefined) {
            return createRequest(this, query, null, 'count');
        }
    });
    addObjProp(IDBObjectStore.prototype, {
        name: 'createIndex',
        value: function createIndex(name, keyPath, options = {}) {
            const {db, databaseName, transaction} = isTransactionExit(this, 'createIndex');
            const storeName = getPrivateProp(this, 'name');
            const dataInfo = db.dataInfo[storeName];
            const primaryKey = getPrivateProp(this, 'keyPath');

            //把创建的索引加入到dataInfo
            dataInfo.index[keyPath] = {
                keyPath: keyPath,
                unique: options.unique || false, //是否唯一
                multiEntry: options.multiEntry || false, //是否可以包含多个值
                primaryKey: primaryKey,
                name: name,
                data: []
            };

            const indexNames = getPrivateProp(this, 'indexNames');
            const addIndexNames = getPrivateProp(indexNames, 'push');
            addIndexNames(name);

            const index = new IDBIndex();

            setPrivateProp(index, 'name', name);
            setPrivateProp(index, 'multiEntry', options.multiEntry);
            setPrivateProp(index, 'keyPath', keyPath);
            setPrivateProp(index, 'unique', dataInfo.index[keyPath].unique);
            setPrivateProp(index, 'objectStore', this);
            setPrivateProp(index, 'storeName', storeName);
            setPrivateProp(index, 'databaseName', databaseName);
            setPrivateProp(index, 'transaction', transaction);

            //主要用来打开数据库成功之后把事务置空，方便捕获错误，objStore并没有该属性
            const indexes = getPrivateProp(this, 'indexes');
            if(indexes){
                indexes.push(index);
            }else{
                setPrivateProp(this,'indexes', [index]);
            }
            return index
        }
    });
    addObjProp(IDBObjectStore.prototype, {
        name: 'delete',
        value: updateFunToString(function (query) {
            return createRequest(this, query, null, 'delete');
        }, 'delete')
    });
    addObjProp(IDBObjectStore.prototype, {
        name: 'deleteIndex',
        value: function deleteIndex(name) {
            const {db} = isTransactionExit(this, 'deleteIndex');
            const storeName = getPrivateProp(this, 'name');
            const dataInfo = db.dataInfo[storeName];
            originObject.keys(dataInfo.index).forEach(key => {
                if (dataInfo.index[key].name === name) {
                    delete dataInfo.index[key];
                }
            });
            setPrivateProp(this, 'indexNames', new DOMStringList(originObject.keys(dataInfo.index)));
        }
    });
    addObjProp(IDBObjectStore.prototype, {
        name: 'get',
        value: function get(query) {
            return createRequest(this, query, null, 'result', 'get')
        }
    });
    addObjProp(IDBObjectStore.prototype, {
        name: 'getAll',
        value: function getAll(query = undefined, count = undefined) {
            return createRequest(this, query, count, 'result', 'getAll');
        }
    });
    addObjProp(IDBObjectStore.prototype, {
        name: 'getAllKeys',
        value: function getAllKeys(query = undefined, count = undefined) {
            return createRequest(this, query, count, 'key', 'getAllKeys');
        }
    });
    addObjProp(IDBObjectStore.prototype, {
        name: 'getKey',
        value: function getKey(query) {
            return createRequest(this, query, null, 'key', 'getKey');
        }
    });
    addObjProp(IDBObjectStore.prototype, {
        name: 'index',
        value: function index(name) {
            const {databaseName, db, transaction} = isTransactionExit(this, 'index');
            const storeName = getPrivateProp(this, 'name');
            const dataInfo = db.dataInfo[storeName];
            let options = {};
            originObject.keys(dataInfo.index).forEach(key => {
                if (dataInfo.index[key].name === name) {
                    options = dataInfo.index[key];
                }
            });

            if (originObject.keys(options).length === 0) {
                throw createError("Failed to execute 'index' on 'IDBObjectStore': The specified index was not found.", 'NotFoundError');
            }

            const index = new IDBIndex();
            setPrivateProp(index, 'name', name);
            setPrivateProp(index, 'multiEntry', options.multiEntry);
            setPrivateProp(index, 'keyPath', options.keyPath);
            setPrivateProp(index, 'unique', options.unique);
            setPrivateProp(index, 'objectStore', this);
            setPrivateProp(index, 'storeName', storeName);
            setPrivateProp(index, 'databaseName', databaseName);
            setPrivateProp(index, 'transaction', transaction);

            return index
        }
    });
    addObjProp(IDBObjectStore.prototype, {name: 'openCursor'});
    addObjProp(IDBObjectStore.prototype, {name: 'openKeyCursor'});
    addObjProp(IDBObjectStore.prototype, {
        name: 'put',
        value: function put(value, key = undefined) {
            return createAddRequest(this, value, key, 'put');
        }
    });
});

module.exports = IDBObjectStore;