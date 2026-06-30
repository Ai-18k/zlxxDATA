const {setFunctionPrototype,addObjProp} = require("../../utility.js");

function WebGLBlendFuncExtended() {
}

setFunctionPrototype(WebGLBlendFuncExtended, () => {
    addObjProp(WebGLBlendFuncExtended.prototype, {
        name: 'SRC1_COLOR_WEBGL',
        value: 35065,
        configurable: false,
        writable: false
    });
    addObjProp(WebGLBlendFuncExtended.prototype, {
        name: 'SRC1_ALPHA_WEBGL',
        value: 34185,
        configurable: false,
        writable: false
    });
    addObjProp(WebGLBlendFuncExtended.prototype, {
        name: 'ONE_MINUS_SRC1_COLOR_WEBGL',
        value: 35066,
        configurable: false,
        writable: false
    });
    addObjProp(WebGLBlendFuncExtended.prototype, {
        name: 'ONE_MINUS_SRC1_ALPHA_WEBGL',
        value: 35067,
        configurable: false,
        writable: false
    });
    addObjProp(WebGLBlendFuncExtended.prototype, {
        name: 'MAX_DUAL_SOURCE_DRAW_BUFFERS_WEBGL',
        value: 35068,
        configurable: false,
        writable: false
    });
})

module.exports = WebGLBlendFuncExtended;