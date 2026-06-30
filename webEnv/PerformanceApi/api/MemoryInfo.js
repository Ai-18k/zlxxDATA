const {
    addObjProp,
    setFunctionPrototype,
    getPrivateProp,
    setPrivateProp,
    getOriginObj
} = require("../../utility.js");

function MemoryInfo(){}

setFunctionPrototype(MemoryInfo,()=>{
    addObjProp(MemoryInfo.prototype,{
        name:'totalJSHeapSize',
        get: function totalJSHeapSize(){
            return getPrivateProp(this, 'totalJSHeapSize')
        }
    });
    addObjProp(MemoryInfo.prototype,{
        name:'usedJSHeapSize',
        get: function usedJSHeapSize(){
            return getPrivateProp(this, 'usedJSHeapSize')
        }
    });
    addObjProp(MemoryInfo.prototype,{
        name:'jsHeapSizeLimit',
        get: function jsHeapSizeLimit(){
            return getPrivateProp(this, 'jsHeapSizeLimit')
        }
    })
})

module.exports = MemoryInfo;