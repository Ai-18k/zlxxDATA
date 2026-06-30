const {
    getPrivateProp,
    setFunctionPrototype,
    addObjProp
} = require("../../utility.js");
const Event = require("../../CommonApi/api/Event.js");

function IDBVersionChangeEvent() {
}

setFunctionPrototype(IDBVersionChangeEvent, () => {
    addObjProp(IDBVersionChangeEvent.prototype, {
        name: 'oldVersion',
        get: function oldVersion() {
            return getPrivateProp(this, 'oldVersion');
        }
    });
    addObjProp(IDBVersionChangeEvent.prototype, {
        name: 'newVersion',
        get: function newVersion() {
            return getPrivateProp(this, 'newVersion');
        }
    });
    addObjProp(IDBVersionChangeEvent.prototype, {
        name: 'dataLoss',
        get: function dataLoss() {
            return getPrivateProp(this, 'dataLoss');
        }
    });
    addObjProp(IDBVersionChangeEvent.prototype, {
        name: 'dataLossMessage',
        get: function dataLossMessage() {
            return getPrivateProp(this, 'dataLossMessage');
        }
    });
}, Event);


module.exports = IDBVersionChangeEvent;