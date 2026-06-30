const {setFunctionPrototype,addObjProp} = require("../../utility.js");

function WebGLColorBufferFloat() {
}

setFunctionPrototype(WebGLColorBufferFloat, () => {
    addObjProp(WebGLColorBufferFloat.prototype, {
        name: 'RGBA32F_EXT',
        value: 34836,
        configurable: false,
        writable: false
    });
    addObjProp(WebGLColorBufferFloat.prototype, {
        name: 'FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE_EXT',
        value: 33297,
        configurable: false,
        writable: false
    });
    addObjProp(WebGLColorBufferFloat.prototype, {
        name: 'UNSIGNED_NORMALIZED_EXT',
        value: 35863,
        configurable: false,
        writable: false
    });
})

module.exports = WebGLColorBufferFloat;