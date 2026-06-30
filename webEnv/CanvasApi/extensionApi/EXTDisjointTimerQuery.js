const {setFunctionPrototype,addObjProp} = require("../../utility.js");

function EXTDisjointTimerQuery() {
}

setFunctionPrototype(EXTDisjointTimerQuery,()=>{
    addObjProp(EXTDisjointTimerQuery.prototype,{
        name: 'QUERY_COUNTER_BITS_EXT',
        value: 34916,
        configurable: false,
        writable: false
    });
    addObjProp(EXTDisjointTimerQuery.prototype,{
        name: 'CURRENT_QUERY_EXT',
        value: 34917,
        configurable: false,
        writable: false
    });
    addObjProp(EXTDisjointTimerQuery.prototype,{
        name: 'QUERY_RESULT_EXT',
        value: 34918,
        configurable: false,
        writable: false
    });
    addObjProp(EXTDisjointTimerQuery.prototype,{
        name: 'QUERY_RESULT_AVAILABLE_EXT',
        value: 34919,
        configurable: false,
        writable: false
    });
    addObjProp(EXTDisjointTimerQuery.prototype,{
        name: 'TIME_ELAPSED_EXT',
        value: 35007,
        configurable: false,
        writable: false
    });
    addObjProp(EXTDisjointTimerQuery.prototype,{
        name: 'TIMESTAMP_EXT',
        value: 36392,
        configurable: false,
        writable: false
    });
    addObjProp(EXTDisjointTimerQuery.prototype,{
        name: 'GPU_DISJOINT_EXT',
        value: 36795,
        configurable: false,
        writable: false
    });
    addObjProp(EXTDisjointTimerQuery.prototype,{name: 'beginQueryEXT'});
    addObjProp(EXTDisjointTimerQuery.prototype,{name: 'createQueryEXT'});
    addObjProp(EXTDisjointTimerQuery.prototype,{name: 'deleteQueryEXT'});
    addObjProp(EXTDisjointTimerQuery.prototype,{name: 'endQueryEXT'});
    addObjProp(EXTDisjointTimerQuery.prototype,{name: 'getQueryEXT'});
    addObjProp(EXTDisjointTimerQuery.prototype,{name: 'getQueryObjectEXT'});
    addObjProp(EXTDisjointTimerQuery.prototype,{name: 'isQueryEXT'});
    addObjProp(EXTDisjointTimerQuery.prototype,{name: 'queryCounterEXT'});
})

module.exports = EXTDisjointTimerQuery;