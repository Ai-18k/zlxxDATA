const {setFunctionPrototype,addObjProp} = require("../../utility.js");

function WebGLLoseContext() {
}

setFunctionPrototype(WebGLLoseContext, () => {
    addObjProp(WebGLLoseContext.prototype, {name: 'loseContext'});
    addObjProp(WebGLLoseContext.prototype, {name: 'restoreContext'})
})

module.exports = WebGLLoseContext;