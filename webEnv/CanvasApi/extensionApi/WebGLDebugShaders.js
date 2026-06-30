const {setFunctionPrototype,addObjProp} = require("../../utility.js");

function WebGLDebugShaders() {
}

setFunctionPrototype(WebGLDebugShaders, () => {
    addObjProp(WebGLDebugShaders.prototype, {name: 'getTranslatedShaderSource'});
})

module.exports = WebGLDebugShaders;