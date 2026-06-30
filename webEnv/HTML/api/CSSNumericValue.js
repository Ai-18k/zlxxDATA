const {
    setFunctionPrototype,
    addObjProp
} = require("../../utility.js");
const CSSStyleValue = require("./CSSStyleValue.js");

function CSSNumericValue(value, unit) {

}
addObjProp(CSSNumericValue,{name: 'parse'});

setFunctionPrototype(CSSNumericValue, () => {
    addObjProp(CSSStyleValue,{name: 'add'});
    addObjProp(CSSStyleValue,{name: 'div'});
    addObjProp(CSSStyleValue,{name: 'equals'});
    addObjProp(CSSStyleValue,{name: 'max'});
    addObjProp(CSSStyleValue,{name: 'min'});
    addObjProp(CSSStyleValue,{name: 'mul'});
    addObjProp(CSSStyleValue,{name: 'sub'});
    addObjProp(CSSStyleValue,{name: 'to'});
    addObjProp(CSSStyleValue,{name: 'toSum'});
    addObjProp(CSSStyleValue,{name: 'type'});
}, CSSStyleValue)

module.exports = CSSNumericValue;