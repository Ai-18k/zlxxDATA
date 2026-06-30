const {setFunctionPrototype,addObjProp} = require("../../utility.js");

function OESDrawBuffersIndexed() {
}

setFunctionPrototype(OESDrawBuffersIndexed,()=>{
    addObjProp(OESDrawBuffersIndexed.prototype,{name:'blendEquationSeparateiOES'});
    addObjProp(OESDrawBuffersIndexed.prototype,{name:'blendEquationiOES'});
    addObjProp(OESDrawBuffersIndexed.prototype,{name:'blendFuncSeparateiOES'});
    addObjProp(OESDrawBuffersIndexed.prototype,{name:'blendFunciOES'});
    addObjProp(OESDrawBuffersIndexed.prototype,{name:'colorMaskiOES'});
    addObjProp(OESDrawBuffersIndexed.prototype,{name:'disableiOES'});
    addObjProp(OESDrawBuffersIndexed.prototype,{name:'enableiOES'});
});

module.exports = OESDrawBuffersIndexed;