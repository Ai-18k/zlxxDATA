const {setFunctionPrototype,addObjProp} = require("../../utility.js");

function WebGLProvokingVertex() {
}

setFunctionPrototype(WebGLProvokingVertex,()=>{
    addObjProp(WebGLProvokingVertex.prototype,{
        name: 'FIRST_VERTEX_CONVENTION_WEBGL',
        value: 36429,
        configurable: false,
        writable: false
    });
    addObjProp(WebGLProvokingVertex.prototype,{
        name: 'LAST_VERTEX_CONVENTION_WEBGL',
        value: 36430,
        configurable: false,
        writable: false
    });
    addObjProp(WebGLProvokingVertex.prototype,{
        name: 'PROVOKING_VERTEX_WEBGL',
        value: 36431,
        configurable: false,
        writable: false
    });
    addObjProp(WebGLProvokingVertex.prototype,{name: 'provokingVertexWEBGL'});
});

module.exports = WebGLProvokingVertex;