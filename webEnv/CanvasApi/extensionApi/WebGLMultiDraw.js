const {setFunctionPrototype,addObjProp} = require("../../utility.js");

function WebGLMultiDraw() {
}

setFunctionPrototype(WebGLMultiDraw, () => {
    addObjProp(WebGLMultiDraw.prototype, {name: 'multiDrawArraysInstancedWEBGL'});
    addObjProp(WebGLMultiDraw.prototype, {name: 'multiDrawArraysWEBGL'});
    addObjProp(WebGLMultiDraw.prototype, {name: 'multiDrawElementsInstancedWEBGL'});
    addObjProp(WebGLMultiDraw.prototype, {name: 'multiDrawElementsWEBGL'});
})

module.exports = WebGLMultiDraw;