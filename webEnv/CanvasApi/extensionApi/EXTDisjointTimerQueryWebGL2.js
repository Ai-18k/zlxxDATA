const {setFunctionPrototype,addObjProp} = require("../../utility.js");

function EXTDisjointTimerQueryWebGL2() {
}

setFunctionPrototype(EXTDisjointTimerQueryWebGL2,()=>{
    addObjProp(EXTDisjointTimerQueryWebGL2.prototype,{
        name: 'QUERY_COUNTER_BITS_EXT',
        value: 34916,
        configurable: false,
        writable: false
    });
    addObjProp(EXTDisjointTimerQueryWebGL2.prototype,{
        name: 'TIME_ELAPSED_EXT',
        value: 35007,
        configurable: false,
        writable: false
    });
    addObjProp(EXTDisjointTimerQueryWebGL2.prototype,{
        name: 'TIMESTAMP_EXT',
        value: 36392,
        configurable: false,
        writable: false
    });
    addObjProp(EXTDisjointTimerQueryWebGL2.prototype,{
        name: 'GPU_DISJOINT_EXT',
        value: 36795,
        configurable: false,
        writable: false
    });
    addObjProp(EXTDisjointTimerQueryWebGL2.prototype,{name: 'queryCounterEXT'});
})

module.exports = EXTDisjointTimerQueryWebGL2;