const {setFunctionPrototype,addObjProp} = require("../../utility.js");

function EXTTextureFilterAnisotropic() {
}

setFunctionPrototype(EXTTextureFilterAnisotropic,()=>{
    addObjProp(EXTTextureFilterAnisotropic.prototype,{
        name: 'TEXTURE_MAX_ANISOTROPY_EXT',
        value: 34046,
        configurable: false,
        writable: false
    });
    addObjProp(EXTTextureFilterAnisotropic.prototype,{
        name: 'MAX_TEXTURE_MAX_ANISOTROPY_EXT',
        value: 34047,
        configurable: false,
        writable: false
    });
})

module.exports = EXTTextureFilterAnisotropic;