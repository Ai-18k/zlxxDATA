const {
    setFunctionPrototype,
    addObjProp,
    getPrivateProp,
    setPrivateProp,
    originParseFloat
} = require("../../utility.js");
const CSSNumericValue = require("./CSSNumericValue.js");

function CSSUnitValue(value, unit) {
}

setFunctionPrototype(CSSUnitValue, () => {
    addObjProp(CSSUnitValue.prototype, {
        name: 'value',
        get: function value() {
            const value = getPrivateProp(this, 'value');
            return originParseFloat(value);
        },
        set: function value(value) {
            return setPrivateProp(this, 'value', value);
        }
    });
    addObjProp(CSSUnitValue.prototype, {
        name: 'unit',
        get: function unit() {
            return getPrivateProp(this, 'unit');
        }
    });
}, CSSNumericValue)

module.exports = CSSUnitValue;