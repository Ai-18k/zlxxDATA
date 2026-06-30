const {setFunctionPrototype,addObjProp} = require("../../utility.js");

function WebGLMultiDraw() {
}

setFunctionPrototype(WebGLMultiDraw, () => {
    addObjProp(WebGLMultiDraw.prototype, {
        name: 'POLYGON_MODE_WEBGL',
        value: 2880,
        configurable: false,
        writable: false
    });
    addObjProp(WebGLMultiDraw.prototype, {
        name: 'POLYGON_OFFSET_LINE_WEBGL',
        value: 10754,
        configurable: false,
        writable: false
    });
    addObjProp(WebGLMultiDraw.prototype, {
        name: 'LINE_WEBGL',
        value: 6913,
        configurable: false,
        writable: false
    });
    addObjProp(WebGLMultiDraw.prototype, {
        name: 'FILL_WEBGL',
        value: 6914,
        configurable: false,
        writable: false
    });
    addObjProp(WebGLMultiDraw.prototype, {name: 'polygonModeWEBGL'});
})

module.exports = WebGLMultiDraw;