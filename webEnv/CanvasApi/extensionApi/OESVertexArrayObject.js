const {setFunctionPrototype,addObjProp} = require("../../utility.js");

function OESVertexArrayObject() {
}

setFunctionPrototype(OESVertexArrayObject, () => {
    addObjProp(OESVertexArrayObject.prototype, {
        name: 'VERTEX_ARRAY_BINDING_OES',
        value: 34229,
        configurable: false,
        writable: false
    });
    addObjProp(OESVertexArrayObject.prototype, {name: 'bindVertexArrayOES'});
    addObjProp(OESVertexArrayObject.prototype, {name: 'createVertexArrayOES'});
    addObjProp(OESVertexArrayObject.prototype, {name: 'deleteVertexArrayOES'});
    addObjProp(OESVertexArrayObject.prototype, {name: 'isVertexArrayOES'})

})

module.exports = OESVertexArrayObject;