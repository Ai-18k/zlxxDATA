const {
    addObjProp,
    ArrayPrototype,
    initArray,
    setFunctionPrototype,
} = require("../../utility.js");

function NodeList(tags = undefined) {
    ArrayPrototype(this, tags);
}

setFunctionPrototype(NodeList, () => {
    addObjProp(NodeList.prototype, {
        name: 'entries',
        value: function entries() {
        }
    });
    addObjProp(NodeList.prototype, {
        name: 'keys',
        value: function keys() {
        }
    });
    addObjProp(NodeList.prototype, {name: 'values'});
    addObjProp(NodeList.prototype, {
        name: 'forEach',
        value: function forEach(callback) {
            for (let i = 0; i < this.length; i++)
                callback(this[i], i, this);
        }
    });
    addObjProp(NodeList.prototype, {name: 'length'});
    addObjProp(NodeList.prototype, {
        name: 'item',
        value: function item(key) {
            return this[key];
        }
    });
});
initArray(NodeList.prototype);

module.exports = NodeList;