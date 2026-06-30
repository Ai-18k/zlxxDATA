const {
    addObjProp,
    getPrivateProp,
    setFunctionPrototype
} = require("../../utility.js");

function Bolb(){}

setFunctionPrototype(Bolb, () => {
    addObjProp(Bolb.prototype, {
        name: 'size',
        get: function size(){
            return getPrivateProp(this, 'size');
        }
    });
    addObjProp(Bolb.prototype, {
        name: 'type',
        get: function type(){
            return getPrivateProp(this, 'type');
        }
    });
    addObjProp(Bolb.prototype, {name: 'arrayBuffer'});
    addObjProp(Bolb.prototype, {name: 'slice'});
    addObjProp(Bolb.prototype, {name: 'stream'});
    addObjProp(Bolb.prototype, {name: 'text'});
});

module.exports = Bolb;
