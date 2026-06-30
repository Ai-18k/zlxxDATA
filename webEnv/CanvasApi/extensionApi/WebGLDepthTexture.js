const {setFunctionPrototype,addObjProp} = require("../../utility.js");

function WebGLDepthTexture() {
}

setFunctionPrototype(WebGLDepthTexture, () => {
    addObjProp(WebGLDepthTexture.prototype, {
        name: 'UNSIGNED_INT_24_8_WEBGL',
        value: 34042,
        configurable: false,
        writable: false
    });
})

module.exports = WebGLDepthTexture;