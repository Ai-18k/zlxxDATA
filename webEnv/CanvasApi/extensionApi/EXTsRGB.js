const {setFunctionPrototype,addObjProp} = require("../../utility.js");

function EXTsRGB() {
}

setFunctionPrototype(EXTsRGB,()=>{
    addObjProp(EXTsRGB.prototype,{
        name: 'SRGB_EXT',
        value: 35904,
        configurable: false,
        writable: false
    });
    addObjProp(EXTsRGB.prototype,{
        name: 'SRGB_ALPHA_EXT',
        value: 35906,
        configurable: false,
        writable: false
    });
    addObjProp(EXTsRGB.prototype,{
        name: 'SRGB8_ALPHA8_EXT',
        value: 35907,
        configurable: false,
        writable: false
    });
    addObjProp(EXTsRGB.prototype,{
        name: 'FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING_EXT',
        value: 33296,
        configurable: false,
        writable: false
    });
})

module.exports = EXTsRGB;