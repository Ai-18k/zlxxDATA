const {setFunctionPrototype,addObjProp} = require("../../utility.js");

function WebGLDebugRendererInfo() {
}

setFunctionPrototype(WebGLDebugRendererInfo, () => {
    addObjProp(WebGLDebugRendererInfo.prototype, {
        name: 'UNMASKED_VENDOR_WEBGL',
        value: 37445,
        configurable: false,
        writable: false
    });
    addObjProp(WebGLDebugRendererInfo.prototype, {
        name: 'UNMASKED_RENDERER_WEBGL',
        value: 37446,
        configurable: false,
        writable: false
    });
})

module.exports = WebGLDebugRendererInfo;