const {
    addObjProp,
    ArrayPrototype,
    initArray,
    setFunctionPrototype
} = require("../../utility.js");

function HTMLCollection(tags = undefined) {
    ArrayPrototype(this, tags);
}

setFunctionPrototype(HTMLCollection, () => {
    addObjProp(HTMLCollection.prototype, {name: 'length'});
    addObjProp(HTMLCollection.prototype, {
        name: 'item',
        value: function item(key) {
            return this[key];
        }
    });
    addObjProp(HTMLCollection.prototype, {
        name: 'namedItem',
        value: function namedItem(id) {
            //查询id
            // return this[key];
        }
    });
});
initArray(HTMLCollection.prototype);

module.exports = HTMLCollection;