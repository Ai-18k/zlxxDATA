const {
    getPrivateProp,
    setFunctionPrototype,
    addObjProp,
} = require("../../utility.js");
const IDBCursor = require("./IDBCursor.js")

function IDBCursorWithValue() {
}

setFunctionPrototype(IDBCursorWithValue, () => {
    addObjProp(IDBCursorWithValue.prototype,{
        name: 'value',
        get: function value() {
            return getPrivateProp(this, 'value');
        }
    });
},IDBCursor)

module.exports = IDBCursorWithValue;