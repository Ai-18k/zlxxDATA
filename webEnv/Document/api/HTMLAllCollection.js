const {
    addObjProp,
    ArrayPrototype,
    initArray,
    setFunctionPrototype
} = require("../../utility.js");

function HTMLAllCollection(tags = undefined) {
    ArrayPrototype(this, tags);
}

setFunctionPrototype(HTMLAllCollection, () => {
    addObjProp(HTMLAllCollection.prototype, {name: 'length'});
    addObjProp(HTMLAllCollection.prototype, {
        name: 'item',
        value: function item(key) {
            return this[key];
        }
    });
    addObjProp(HTMLAllCollection.prototype, {
        name: 'namedItem',
        value: function namedItem(id) {
            //查询id
            // return this[key];
        }
    });
});

initArray(HTMLAllCollection.prototype);

module.exports = HTMLAllCollection;