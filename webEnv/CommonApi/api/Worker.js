const {
    addObjProp,
    setFunctionPrototype,
    getPrivateProp,
    setPrivateProp,
    getOriginObj
} = require("../../utility.js");
const EventTarget = require("./EventTarget.js");

function Worker(path){}

setFunctionPrototype(Worker,()=>{
    addObjProp(Worker.prototype,{
        name: 'onmessage',
        get: function onmessage(){
            return getPrivateProp(this, 'onmessage');
        },
        set: function onmessage(value){
            return setPrivateProp(this, 'onmessage', value);
        },
    });
    addObjProp(Worker.prototype,{
        name: 'postMessage',
        value: function postMessage(message){
        }
    });
    addObjProp(Worker.prototype,{
        name: 'terminate',
        value: function terminate(){

        }
    });
},EventTarget)

module.exports = Worker;