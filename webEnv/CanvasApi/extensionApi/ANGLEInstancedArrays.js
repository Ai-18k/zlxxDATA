const {setFunctionPrototype,addObjProp} = require("../../utility.js");

function ANGLEInstancedArrays() {
}

setFunctionPrototype(ANGLEInstancedArrays,()=>{
    addObjProp(ANGLEInstancedArrays.prototype,{
        name: 'VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE',
        value: 35070,
        configurable: false,
        writable: false
    });
    addObjProp(ANGLEInstancedArrays.prototype,{name: 'drawArraysInstancedANGLE'});
    addObjProp(ANGLEInstancedArrays.prototype,{name: 'drawElementsInstancedANGLE'});
    addObjProp(ANGLEInstancedArrays.prototype,{name: 'vertexAttribDivisorANGLE'});
})

module.exports = ANGLEInstancedArrays;