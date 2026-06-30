const {setFunctionPrototype,addObjProp} = require("../../utility.js");

function OESShaderMultisampleInterpolation() {
}

setFunctionPrototype(OESShaderMultisampleInterpolation,()=>{
    addObjProp(OESShaderMultisampleInterpolation.prototype,{
        name: 'MIN_FRAGMENT_INTERPOLATION_OFFSET_OES',
        value: 36443,
        configurable: false,
        writable: false
    });
    addObjProp(OESShaderMultisampleInterpolation.prototype,{
        name: 'MAX_FRAGMENT_INTERPOLATION_OFFSET_OES',
        value: 36444,
        configurable: false,
        writable: false
    });
    addObjProp(OESShaderMultisampleInterpolation.prototype,{
        name: 'FRAGMENT_INTERPOLATION_OFFSET_BITS_OES',
        value: 36445,
        configurable: false,
        writable: false
    });
});

module.exports = OESShaderMultisampleInterpolation;