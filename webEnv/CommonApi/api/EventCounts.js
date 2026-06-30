const {
    addObjProp,
    setFunctionPrototype,
    getPrivateProp,
    setPrivateProp,
    getOriginObj
} = require("../../utility.js");

function EventCounts(){}

setPrivateProp(EventCounts,()=>{
    addObjProp(EventCounts.prototype,{
        name: 'size',
        get: function size(){
            return getPrivateProp(this, 'size');
        }
    });
    addObjProp(EventCounts.prototype,{name: 'entries'});
    addObjProp(EventCounts.prototype,{name: 'forEach'});
    addObjProp(EventCounts.prototype,{name: 'get'});
    addObjProp(EventCounts.prototype,{name: 'has'});
    addObjProp(EventCounts.prototype,{name: 'keys'});
    addObjProp(EventCounts.prototype,{name: 'values'});
});

addObjProp(EventCounts.prototype, {
    name: Symbol.iterator,
    value: function entries() {
    },
    enumerable: false
});

module.exports = EventCounts;