const {setFunctionPrototype,addObjProp} = require("../../utility.js");

function EXTTextureCompressionBPTC() {
}

setFunctionPrototype(EXTTextureCompressionBPTC,()=>{
    addObjProp(EXTTextureCompressionBPTC.prototype,{
        name: 'COMPRESSED_RGBA_BPTC_UNORM_EXT',
        value: 36492,
        configurable: false,
        writable: false
    });
    addObjProp(EXTTextureCompressionBPTC.prototype,{
        name: 'COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT',
        value: 36493,
        configurable: false,
        writable: false
    });
    addObjProp(EXTTextureCompressionBPTC.prototype,{
        name: 'COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT',
        value:36494,
        configurable: false,
        writable: false
    });
    addObjProp(EXTTextureCompressionBPTC.prototype,{
        name: 'COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT',
        value: 36495,
        configurable: false,
        writable: false
    });
})

module.exports = EXTTextureCompressionBPTC;