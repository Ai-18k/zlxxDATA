const {
    setFunctionPrototype,
    addObjProp
} = require("../../utility.js");

function PerformanceObserver(){

}

addObjProp(PerformanceObserver,{
    name: 'supportedEntryTypes',
    get: function supportedEntryTypes() {
        return ['element', 'event', 'first-input', 'largest-contentful-paint', 'layout-shift', 'long-animation-frame', 'longtask', 'mark', 'measure', 'navigation', 'paint', 'resource', 'visibility-state']
    }
})

setFunctionPrototype(PerformanceObserver,()=>{
    addObjProp(PerformanceObserver.prototype,{
        name: 'disconnect',
        valueOf: function disconnect(){}
    });
    addObjProp(PerformanceObserver.prototype,{
        name: 'observe',
        valueOf: function observe(){}
    });
    addObjProp(PerformanceObserver.prototype,{
        name: 'takeRecords',
        valueOf: function takeRecords(){}
    });
})

module.exports = PerformanceObserver;