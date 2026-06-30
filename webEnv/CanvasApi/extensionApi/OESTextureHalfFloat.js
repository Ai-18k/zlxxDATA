const {setFunctionPrototype,addObjProp} = require("../../utility.js");

function OESTextureHalfFloat() {
}

setFunctionPrototype(OESTextureHalfFloat, () => {
    addObjProp(OESTextureHalfFloat.prototype, {
        name: 'HALF_FLOAT_OES',
        value: 36193,
        configurable: false,
        writable: false
    })
})

module.exports = OESTextureHalfFloat;