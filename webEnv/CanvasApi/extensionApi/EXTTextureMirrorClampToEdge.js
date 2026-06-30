const {setFunctionPrototype,addObjProp} = require("../../utility.js");

function EXTTextureMirrorClampToEdge() {
}

setFunctionPrototype(EXTTextureMirrorClampToEdge,()=>{
    addObjProp(EXTTextureMirrorClampToEdge.prototype,{
        name: 'MIRROR_CLAMP_TO_EDGE_EXT',
        value: 34672,
        configurable: false,
        writable: false
    });
})

module.exports = EXTTextureMirrorClampToEdge;