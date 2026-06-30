const {
    setFunctionPrototype,
    addObjProp,
    getPrivateProp,
    toJSONProp
} = require("../../utility");

function PerformanceTiming() {

}

setFunctionPrototype(PerformanceTiming,()=>{
    addObjProp(PerformanceTiming.prototype, {
        name: 'navigationStart',
        get: function navigationStart() {
            return getPrivateProp(this, 'navigationStart');
        }
    });
    addObjProp(PerformanceTiming.prototype, {
        name: 'unloadEventStart',
        get: function unloadEventStart() {
            return getPrivateProp(this, 'unloadEventStart');
        }
    });
    addObjProp(PerformanceTiming.prototype, {
        name: 'unloadEventEnd',
        get: function unloadEventEnd() {
            return getPrivateProp(this, 'unloadEventEnd');
        }
    });
    addObjProp(PerformanceTiming.prototype, {
        name: 'redirectStart',
        get: function redirectStart() {
            return getPrivateProp(this, 'redirectStart');
        }
    });
    addObjProp(PerformanceTiming.prototype, {
        name: 'redirectEnd',
        get: function redirectEnd() {
            return getPrivateProp(this, 'redirectEnd');
        }
    });
    addObjProp(PerformanceTiming.prototype, {
        name: 'fetchStart',
        get: function fetchStart() {
            return getPrivateProp(this, 'fetchStart');
        }
    });
    addObjProp(PerformanceTiming.prototype, {
        name: 'domainLookupStart',
        get: function domainLookupStart() {
            return getPrivateProp(this, 'domainLookupStart');
        }
    });
    addObjProp(PerformanceTiming.prototype, {
        name: 'domainLookupEnd',
        get: function domainLookupEnd() {
            return getPrivateProp(this, 'domainLookupEnd');
        }
    });
    addObjProp(PerformanceTiming.prototype, {
        name: 'connectStart',
        get: function connectStart() {
            return getPrivateProp(this, 'connectStart');
        }
    });
    addObjProp(PerformanceTiming.prototype, {
        name: 'connectEnd',
        get: function connectEnd() {
            return getPrivateProp(this, 'connectEnd');
        }
    });
    addObjProp(PerformanceTiming.prototype, {
        name: 'secureConnectionStart',
        get: function secureConnectionStart() {
            return getPrivateProp(this, 'secureConnectionStart');
        }
    });
    addObjProp(PerformanceTiming.prototype, {
        name: 'requestStart',
        get: function requestStart() {
            return getPrivateProp(this, 'requestStart');
        }
    });
    addObjProp(PerformanceTiming.prototype, {
        name: 'responseStart',
        get: function responseStart() {
            return getPrivateProp(this, 'responseStart');
        }
    });
    addObjProp(PerformanceTiming.prototype, {
        name: 'responseEnd',
        get: function responseEnd() {
            return getPrivateProp(this, 'responseEnd');
        }
    });
    addObjProp(PerformanceTiming.prototype, {
        name: 'domLoading',
        get: function domLoading() {
            return getPrivateProp(this, 'domLoading');
        }
    });
    addObjProp(PerformanceTiming.prototype, {
        name: 'domInteractive',
        get: function domInteractive() {
            return getPrivateProp(this, 'domInteractive');
        }
    });
    addObjProp(PerformanceTiming.prototype, {
        name: 'domContentLoadedEventStart',
        get: function domContentLoadedEventStart() {
            return getPrivateProp(this, 'domContentLoadedEventStart');
        }
    });
    addObjProp(PerformanceTiming.prototype, {
        name: 'domContentLoadedEventEnd',
        get: function domContentLoadedEventEnd() {
            return getPrivateProp(this, 'domContentLoadedEventEnd');
        }
    });
    addObjProp(PerformanceTiming.prototype, {
        name: 'domComplete',
        get: function domComplete() {
            return getPrivateProp(this, 'domComplete');
        }
    });
    addObjProp(PerformanceTiming.prototype, {
        name: 'loadEventStart',
        get: function loadEventStart() {
            return getPrivateProp(this, 'loadEventStart');
        }
    });
    addObjProp(PerformanceTiming.prototype, {
        name: 'loadEventEnd',
        get: function loadEventEnd() {
            return getPrivateProp(this, 'loadEventEnd');
        }
    });
    addObjProp(PerformanceTiming.prototype, {
        name: 'toJSON',
        value: function toJSON(){
            return toJSONProp(this, [
                'connectEnd','connectStart','domComplete',
                'domContentLoadedEventEnd','domContentLoadedEventStart','domInteractive',
                'domLoading','domainLookupEnd','domainLookupStart',
                'fetchStart','loadEventEnd','loadEventStart',
                'navigationStart','redirectEnd','redirectStart',
                'requestStart','responseEnd','responseStart',
                'secureConnectionStart','unloadEventEnd','unloadEventStart',
            ])
        }
    });
});

module.exports = PerformanceTiming;
