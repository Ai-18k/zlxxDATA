const {
    setFunctionPrototype,
    addObjProp,
    getPrivateProp,
    setPrivateProp, initArray, ArrayPrototype
} = require("../../utility.js");
const NodeList = require("./NodeList.js");

function RadioNodeList(tags = undefined) {
    ArrayPrototype(this, tags);
}

setFunctionPrototype(RadioNodeList, () => {
    addObjProp(RadioNodeList.prototype, {
        name: 'value',
        get: function value() {
            return getPrivateProp(this, 'value');
        },
        set: function value(value) {
            return setPrivateProp(this, 'value', value);
        }
    })
}, NodeList);

initArray(RadioNodeList.prototype);
module.exports = RadioNodeList;