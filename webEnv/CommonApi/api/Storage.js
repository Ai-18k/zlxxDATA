let {
    setFunctionPrototype,
    addObjProp,
    ArrayPrototype,
    initArray,
    getPrivateProp,
    chalkLog,
    originObject
} = require("../../utility.js");

function Storage() {
    ArrayPrototype(this, []);
}

setFunctionPrototype(Storage, () => {
    addObjProp(Storage.prototype, {name: 'length'});
    addObjProp(Storage.prototype, {
        name: 'clear',
        value: function clear() {
            const storageName = getPrivateProp(this, 'storageName');
            chalkLog('red',`${storageName}中clear清空缓存`);
            originObject.keys(this).forEach((key) => {
                delete this[key];
            })
        }
    });
    addObjProp(Storage.prototype, {
        name: 'getItem',
        value: function getItem(key) {
            const storageName = getPrivateProp(this, 'storageName');
            chalkLog('red',`${storageName}中getItem接受的值是：${key} === ${this[key]}`);
            return this[key];
        }
    });
    addObjProp(Storage.prototype, {
        name: 'key',
        value: function key(key) {
            const storageName = getPrivateProp(this, 'storageName');
            chalkLog('red',`${storageName}中key接受的值是：${key} === ${this[key]}`);
            return key instanceof String ? this[key] : originObject.keys(this)[key];
        }
    });
    addObjProp(Storage.prototype, {
        name: 'removeItem',
        value: function removeItem(key) {
            const storageName = getPrivateProp(this,'storageName');
            chalkLog('red',`${storageName}中removeItem接受的值是：${key}`);
            delete this[key];
        }
    });
    addObjProp(Storage.prototype, {
        name: 'setItem',
        value: function setItem(key, value) {
            const storageName = getPrivateProp(this, 'storageName');
            chalkLog('red',`${storageName}中setItem接受的值是：${key} === ${value}`);
            this[key] = value;
        }
    });
});

initArray(Storage.prototype, false);

module.exports = Storage;