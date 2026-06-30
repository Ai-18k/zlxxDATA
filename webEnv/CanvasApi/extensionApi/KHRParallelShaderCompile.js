const {setFunctionPrototype,addObjProp} = require("../../utility.js");

function KHRParallelShaderCompile() {
}

setFunctionPrototype(KHRParallelShaderCompile,()=>{
    addObjProp(KHRParallelShaderCompile.prototype,{
        name: 'COMPLETION_STATUS_KHR',
        value: 37297,
        configurable: false,
        writable: false
    });
})

module.exports = KHRParallelShaderCompile;