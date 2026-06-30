const {setFunctionPrototype,addObjProp} = require("../../utility.js");

function WebGLStencilTexturing() {
}

setFunctionPrototype(WebGLStencilTexturing,()=>{
    addObjProp(WebGLStencilTexturing.prototype,{
        name: 'DEPTH_STENCIL_TEXTURE_MODE_WEBGL',
        value: 36429,
        configurable: false,
        writable: false
    });
    addObjProp(WebGLStencilTexturing.prototype,{
        name: 'STENCIL_INDEX_WEBGL',
        value: 36429,
        configurable: false,
        writable: false
    });
});

module.exports = WebGLStencilTexturing;