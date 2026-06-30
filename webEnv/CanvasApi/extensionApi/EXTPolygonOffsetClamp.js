const {setFunctionPrototype,addObjProp} = require("../../utility.js");

function EXTPolygonOffsetClamp() {
}

setFunctionPrototype(EXTPolygonOffsetClamp,()=>{
    addObjProp(EXTPolygonOffsetClamp.prototype,{
        name: 'POLYGON_OFFSET_CLAMP_EXT',
        value: 36379,
        configurable: false,
        writable: false
    });
    addObjProp(EXTPolygonOffsetClamp.prototype,{name: 'polygonOffsetClampEXT'});
})

module.exports = EXTPolygonOffsetClamp;