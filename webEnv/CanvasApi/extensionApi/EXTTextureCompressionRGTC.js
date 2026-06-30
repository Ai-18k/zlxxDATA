const {setFunctionPrototype,addObjProp} = require("../../utility.js");

function EXTTextureCompressionRGTC() {
}

setFunctionPrototype(EXTTextureCompressionRGTC,()=>{
    addObjProp(EXTTextureCompressionRGTC.prototype,{
        name: 'COMPRESSED_RED_RGTC1_EXT',
        value: 36283,
        configurable: false,
        writable: false
    });
    addObjProp(EXTTextureCompressionRGTC.prototype,{
        name: 'COMPRESSED_SIGNED_RED_RGTC1_EXT',
        value: 36284,
        configurable: false,
        writable: false
    });
    addObjProp(EXTTextureCompressionRGTC.prototype,{
        name: 'COMPRESSED_RED_GREEN_RGTC2_EXT',
        value: 36285,
        configurable: false,
        writable: false
    });
    addObjProp(EXTTextureCompressionRGTC.prototype,{
        name: 'COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT',
        value:36286,
        configurable: false,
        writable: false
    });
})

module.exports = EXTTextureCompressionRGTC;