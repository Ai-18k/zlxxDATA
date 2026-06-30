const {setFunctionPrototype} = require("../../utility.js");
const WebGLObject = require("./WebGLObject.js");

function WebGLShader() {
}

setFunctionPrototype(WebGLShader,()=>{},WebGLObject)

module.exports = WebGLShader;