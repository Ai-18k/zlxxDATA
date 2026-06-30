const {
    getPrivateProp,
    setFunctionPrototype,
    addObjProp
} = require("../../utility.js");

function CSSStyleValue() {}

addObjProp(CSSStyleValue,{name: 'parse'});
addObjProp(CSSStyleValue,{name: 'parseAll'})

setFunctionPrototype(CSSStyleValue,()=>{
    addObjProp(CSSStyleValue.prototype,{
        name: 'toString',
        value: function toStringsss() {
            return getPrivateProp(this, 'value');
        }
    });
});

module.exports = CSSStyleValue;