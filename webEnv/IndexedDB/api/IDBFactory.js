const {
    getPrivateProp,
    setPrivateProp,
    setFunctionPrototype,
    addObjProp,
    createError,
    originMath
} = require("../../utility.js");
const DOMStringList = require("../../CommonApi/api/DOMStringList.js");
const IDBOpenDBRequest = require("./IDBOpenDBRequest.js");
const IDBDatabase = require("./IDBDatabase.js");
const IDBTransaction = require("./IDBTransaction.js");


function IDBFactory() {
    setPrivateProp(this, 'indexedDB', {});
}

setFunctionPrototype(IDBFactory, () => {
    addObjProp(IDBFactory.prototype, {
        name: 'cmp',
        value: function cmp() {
            return getPrivateProp(this, 'cmp');
        }
    });
    addObjProp(IDBFactory.prototype, {
        name: 'databases',
        value: function databases() {
            return getPrivateProp(this, 'databases');
        }
    });
    addObjProp(IDBFactory.prototype, {
        name: 'deleteDatabase',
        value: function deleteDatabase() {
            return getPrivateProp(this, 'deleteDatabase');
        }
    });
    addObjProp(IDBFactory.prototype, {
        name: 'open',
        value: function open(name, version) {
            if (version < 1) {
                throw new TypeError("Failed to execute 'open' on 'IDBFactory': The version provided must not be 0.");
            }
            version = version || 1;
            //随机生成数据库打开时间1秒-3秒
            const timeStamp = originMath.random() * 2000 + 1000;
            //创建数据库打开请求
            const IDBOpenDB = new IDBOpenDBRequest();
            setPrivateProp(IDBOpenDB, 'timeStamp', timeStamp);
            setPrivateProp(IDBOpenDB, 'readyState', 'pending');
            setPrivateProp(IDBOpenDB, 'databaseName', name);
            setPrivateProp(IDBOpenDB, 'version', version);
            //创建数据库对象
            let database = new IDBDatabase();
            let objectStoreNames = new DOMStringList([]);
            setPrivateProp(database, 'name', name);
            setPrivateProp(database, 'version', version);
            setPrivateProp(database, 'objectStoreNames', objectStoreNames);
            //创建事务对象
            let transaction = new IDBTransaction();
            let objectStoreNames1 = new DOMStringList([]);
            setPrivateProp(transaction, 'db', database);
            setPrivateProp(transaction, 'objectStoreNames', objectStoreNames1);
            setPrivateProp(transaction, 'durability', 'default');
            setPrivateProp(transaction, 'mode', 'versionchange');

            //主要用来打开数据库成功之后把事务置空，方便捕获错误，database并没有该属性
            setPrivateProp(database, 'transaction', transaction);

            //设置请求结果和事务
            setPrivateProp(IDBOpenDB, 'result', database);
            setPrivateProp(IDBOpenDB, 'transaction', transaction);

            const dbs = getPrivateProp(this, 'dbs');
            const db = dbs ? dbs[name] : null;
            if (db) {
                const oldVersion = db.version;

                if (version === oldVersion) {
                    setPrivateProp(IDBOpenDB, 'update', false);
                } else if (version < oldVersion) {
                    setPrivateProp(IDBOpenDB, 'update', false);
                    const requestError = createError(`The requested version (${version}) is less than the existing version (${oldVersion}).`, 'VersionError');
                    setPrivateProp(transaction, 'error', requestError);
                } else {
                    db.version = version;
                    db.oldVersion = oldVersion;
                    setPrivateProp(IDBOpenDB, 'oldVersion', oldVersion);
                }
            } else {
                setPrivateProp(IDBOpenDB, 'update', true);
                setPrivateProp(IDBOpenDB, 'oldVersion', 0);

                /**
                 * @property {String} name 数据库名字
                 * @property {Number} version 数据库版本号
                 * @property {IDBTransaction} transaction 事务对象：new IDBTransaction()
                 * @property {Object} dataInfo 数据库数据信息
                 * @property {String} dataInfo.keyPath 主键字段
                 * @property {Object} dataInfo.index 数据库索引
                 * @property {Object} dataInfo.data 数据
                 * @property {Object} dataInfo.oldVersion 旧版本号
                 * */
                if (!dbs) {
                    setPrivateProp(this, 'dbs', {
                        [name]: {
                            name: name,
                            version: version,
                            oldVersion: 0,
                            dataInfo: {}
                        }
                    });
                } else {
                    dbs[name] = {
                        name: name,
                        version: version,
                        oldVersion: 0,
                        dataInfo: {}
                    };
                }
            }

            return IDBOpenDB;
        }
    });
});


module.exports = IDBFactory;