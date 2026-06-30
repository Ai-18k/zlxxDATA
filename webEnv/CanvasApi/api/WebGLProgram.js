const {setFunctionPrototype} = require("../../utility.js");
const WebGLObject = require("./WebGLObject.js");

function WebGLProgram() {
}

setFunctionPrototype(WebGLProgram,()=>{},WebGLObject)

module.exports = WebGLProgram;