const {setFunctionPrototype,addObjProp} = require("../../utility.js");

function EXTColorBufferHalfFloat() {
}

setFunctionPrototype(EXTColorBufferHalfFloat,()=>{
    addObjProp(EXTColorBufferHalfFloat.prototype,{
        name: 'RGBA16F_EXT',
        value: 34842,
        configurable: false,
        writable: false
    });
    addObjProp(EXTColorBufferHalfFloat.prototype,{
        name: 'RGB16F_EXT',
        value: 34843,
        configurable: false,
        writable: false
    });
    addObjProp(EXTColorBufferHalfFloat.prototype,{
        name: 'FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE_EXT',
        value: 33297,
        configurable: false,
        writable: false
    });
    addObjProp(EXTColorBufferHalfFloat.prototype,{
        name: 'UNSIGNED_NORMALIZED_EXT',
        value: 35863,
        configurable: false,
        writable: false
    });
})

module.exports = EXTColorBufferHalfFloat;