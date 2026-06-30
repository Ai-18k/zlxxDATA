const {
    getPrivateProp,
    setFunctionPrototype,
    addObjProp
} = require("../../utility.js");

function IDBCursor() {
}

setFunctionPrototype(IDBCursor, () => {
    addObjProp(IDBCursor.prototype,{
        name: 'source',
        get: function source() {
            return getPrivateProp(this, 'source');
        }
    });
    addObjProp(IDBCursor.prototype,{
        name: 'direction',
        get: function direction() {
            return getPrivateProp(this, 'direction');
        }
    });
    addObjProp(IDBCursor.prototype,{
        name: 'key',
        get: function key() {
            return getPrivateProp(this, 'key');
        }
    });
    addObjProp(IDBCursor.prototype,{
        name: 'primaryKey',
        get: function primaryKey() {
            return getPrivateProp(this, 'primaryKey');
        }
    });
    addObjProp(IDBCursor.prototype,{
        name: 'request',
        get: function request() {
            return getPrivateProp(this, 'request');
        }
    });
    addObjProp(IDBCursor.prototype,{name: 'advance'});
    addObjProp(IDBCursor.prototype,{name: 'continue'});
    addObjProp(IDBCursor.prototype,{name: 'continuePrimaryKey'});
    addObjProp(IDBCursor.prototype,{name: 'delete'});
    addObjProp(IDBCursor.prototype,{name: 'update'});
})

module.exports = IDBCursor;