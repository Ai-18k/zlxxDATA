const {setFunctionPrototype} = require("../../utility.js");
const WebGLObject = require("./WebGLObject.js");

function WebGLBuffer() {
}

setFunctionPrototype(WebGLBuffer,()=>{},WebGLObject)

module.exports = WebGLBuffer;