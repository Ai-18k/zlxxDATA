const {setFunctionPrototype,addObjProp} = require("../../utility.js");

function EXTTextureNorm16() {
}

setFunctionPrototype(EXTTextureNorm16,()=>{
    addObjProp(EXTTextureNorm16.prototype,{
        name: 'R16_EXT',
        value: 33322,
        configurable: false,
        writable: false
    });
    addObjProp(EXTTextureNorm16.prototype,{
        name: 'RG16_EXT',
        value: 33324,
        configurable: false,
        writable: false
    });
    addObjProp(EXTTextureNorm16.prototype,{
        name: 'RGB16_EXT',
        value: 32852,
        configurable: false,
        writable: false
    });
    addObjProp(EXTTextureNorm16.prototype,{
        name: 'RGBA16_EXT',
        value: 32859,
        configurable: false,
        writable: false
    });
    addObjProp(EXTTextureNorm16.prototype,{
        name: 'R16_SNORM_EXT',
        value: 36760,
        configurable: false,
        writable: false
    });
    addObjProp(EXTTextureNorm16.prototype,{
        name: 'RG16_SNORM_EXT',
        value: 36761,
        configurable: false,
        writable: false
    });
    addObjProp(EXTTextureNorm16.prototype,{
        name: 'RGB16_SNORM_EXT',
        value: 36762,
        configurable: false,
        writable: false
    });
    addObjProp(EXTTextureNorm16.prototype,{
        name: 'RGBA16_SNORM_EXT',
        value: 36763,
        configurable: false,
        writable: false
    });
})

module.exports = EXTTextureNorm16;