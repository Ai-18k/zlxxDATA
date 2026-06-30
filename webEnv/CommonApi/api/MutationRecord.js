const {
    getPrivateProp,
    setFunctionPrototype,
    addObjProp,
} = require("../../utility.js");
const NodeList = require("./NodeList.js");


function MutationRecord(){}

setFunctionPrototype(MutationRecord, ()=>{
    addObjProp(MutationRecord.prototype,{
        name: 'type',
        get: function type(){
            return getPrivateProp(this,'type');
        }
    });
    addObjProp(MutationRecord.prototype,{
        name: 'target',
        get: function target(){
            return getPrivateProp(this,'target');
        }
    });
    addObjProp(MutationRecord.prototype,{
        name: 'addedNodes',
        get: function addedNodes(){
            return getPrivateProp(this,'addedNodes') || new NodeList([]);
        }
    });
    addObjProp(MutationRecord.prototype,{
        name: 'removedNodes',
        get: function removedNodes(){
            return getPrivateProp(this,'removedNodes') || new NodeList([]);
        }
    });
    addObjProp(MutationRecord.prototype,{
        name: 'previousSibling',
        get: function previousSibling(){
            return getPrivateProp(this,'previousSibling');
        }
    });
    addObjProp(MutationRecord.prototype,{
        name: 'nextSibling',
        get: function nextSibling(){
            return getPrivateProp(this,'nextSibling');
        }
    });
    addObjProp(MutationRecord.prototype,{
        name: 'attributeName',
        get: function attributeName(){
            return getPrivateProp(this,'attributeName');
        }
    });
    addObjProp(MutationRecord.prototype,{
        name: 'attributeNamespace',
        get: function attributeNamespace(){
            return getPrivateProp(this,'attributeNamespace');
        }
    });
    addObjProp(MutationRecord.prototype,{
        name: 'oldValue',
        get: function oldValue(){
            return getPrivateProp(this,'oldValue');
        }
    });
})

module.exports = MutationRecord;