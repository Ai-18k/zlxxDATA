const {
    setFunctionPrototype,
    addObjProp,
    initArray,
    ArrayPrototype,
    originObject
} = require("../../utility.js");

function DOMStringList(arr = undefined){
    ArrayPrototype(this, arr);
}

setFunctionPrototype(DOMStringList,()=>{
    addObjProp(DOMStringList.prototype,{name:'length'});
    addObjProp(DOMStringList.prototype,{
        name:'contains',
        value: function item(value){
            return originObject.values(this).includes(value);
        }
    });
    addObjProp(DOMStringList.prototype,{
        name:'item',
        value: function item(key){
            return this[key];
        }
    });
});

initArray(DOMStringList.prototype);

module.exports = DOMStringList;
