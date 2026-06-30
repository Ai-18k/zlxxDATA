const {setFunctionPrototype,addObjProp} = require("../../utility.js");

function EXTDepthClamp() {
}

setFunctionPrototype(EXTDepthClamp,()=>{
    addObjProp(EXTDepthClamp.prototype,{
        name: 'DEPTH_CLAMP_EXT',
        value: 34383,
        configurable: false,
        writable: false
    });
})

module.exports = EXTDepthClamp;