const {setFunctionPrototype, addObjProp} = require("../../utility.js");


function LockManager(){}

setFunctionPrototype(LockManager, ()=>{
    addObjProp(LockManager.prototype,{name: 'query'});
    addObjProp(LockManager.prototype,{name: 'request'});
});
module.exports = LockManager;