const {setFunctionPrototype,addObjProp} = require("../../utility.js");

function EXTBlendMinMax() {
}

setFunctionPrototype(EXTBlendMinMax,()=>{
    addObjProp(EXTBlendMinMax.prototype,{
        name: 'MIN_EXT',
        value: 32775,
        configurable: false,
        writable: false
    });
    addObjProp(EXTBlendMinMax.prototype,{
        name: 'MAX_EXT',
        value: 32776,
        configurable: false,
        writable: false
    });
})

module.exports = EXTBlendMinMax;