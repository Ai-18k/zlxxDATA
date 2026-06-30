const {
    addObjProp,
    setFunctionPrototype,
    getPrivateProp,
    setPrivateProp,
    toJSONProp,
    originDate
} = require("../../utility.js");
const EventTarget = require("../../CommonApi/api/EventTarget.js");
const EventCounts = require("../../CommonApi/api/EventCounts.js");
const PerformanceTiming = require("./PerformanceTiming.js");
const PerformanceNavigation = require("./PerformanceNavigation.js");
const MemoryInfo = require("./MemoryInfo.js");

const timing = new PerformanceTiming();
const navigation = new PerformanceNavigation();
const memoryInfo = new MemoryInfo();
const eventCounts = new EventCounts();

function Performance() {
    const timeOriginTime = new Date().getTime();
    const connectStart = timeOriginTime + 2;
    setPrivateProp(this, 'timeOrigin', timeOriginTime);
    setPrivateProp(this, 'timing', timing);
    setPrivateProp(timing, 'navigationStart', timeOriginTime);
    setPrivateProp(timing, 'connectEnd', connectStart);
    setPrivateProp(timing, 'connectStart', connectStart);
    setPrivateProp(timing, 'domComplete', connectStart + 617);
    setPrivateProp(timing, 'domContentLoadedEventEnd', connectStart + 507);
    setPrivateProp(timing, 'domContentLoadedEventStart', connectStart + 501);
    setPrivateProp(timing, 'domInteractive', connectStart + 497);
    setPrivateProp(timing, 'domLoading', connectStart + 203);
    setPrivateProp(timing, 'domainLookupEnd', connectStart);
    setPrivateProp(timing, 'domainLookupStart', connectStart);
    setPrivateProp(timing, 'fetchStart', connectStart);
    setPrivateProp(timing, 'loadEventEnd', connectStart + 624);
    setPrivateProp(timing, 'loadEventStart', connectStart + 618);
    setPrivateProp(timing, 'redirectEnd', 0);
    setPrivateProp(timing, 'redirectStart', 0);
    setPrivateProp(timing, 'requestStart', connectStart + 6);
    setPrivateProp(timing, 'responseEnd', connectStart + 221);
    setPrivateProp(timing, 'responseStart', connectStart + 187);
    setPrivateProp(timing, 'secureConnectionStart', 0);
    setPrivateProp(timing, 'unloadEventEnd', connectStart + 201);
    setPrivateProp(timing, 'unloadEventStart', connectStart + 199);

    setPrivateProp(this, 'navigation', navigation);
    setPrivateProp(navigation, 'type', 0);
    setPrivateProp(navigation, 'redirectCount', 1);

    setPrivateProp(this, 'memory', memoryInfo);
    setPrivateProp(memoryInfo, 'jsHeapSizeLimit', 2248146944);
    setPrivateProp(memoryInfo, 'totalJSHeapSize', 56624846);
    setPrivateProp(memoryInfo, 'usedJSHeapSize', 52817810);

    setPrivateProp(this, 'eventCounts', eventCounts);
    setPrivateProp(memoryInfo, 'size', 50);
}

setFunctionPrototype(Performance, () => {
    addObjProp(Performance.prototype, {
        name: 'timeOrigin',
        get: function timeOrigin() {
            return getPrivateProp(this, 'timeOrigin');
        }
    });
    addObjProp(Performance.prototype, {
        name: 'onresourcetimingbufferfull',
        get: function onresourcetimingbufferfull() {
            return getPrivateProp(this, 'onresourcetimingbufferfull');
        },
        set: function onresourcetimingbufferfull() {
            return setPrivateProp(this, 'onresourcetimingbufferfull');
        }
    });
    addObjProp(Performance.prototype, {name: 'clearMarks'});
    addObjProp(Performance.prototype, {name: 'clearMeasures'});
    addObjProp(Performance.prototype, {name: 'clearResourceTimings'});
    addObjProp(Performance.prototype, {name: 'getEntries'});
    addObjProp(Performance.prototype, {name: 'getEntriesByName'});
    addObjProp(Performance.prototype, {name: 'getEntriesByType'});
    addObjProp(Performance.prototype, {name: 'mark'});
    addObjProp(Performance.prototype, {name: 'measure'});
    addObjProp(Performance.prototype, {name: 'setResourceTimingBufferSize'});
    addObjProp(Performance.prototype, {
        name: 'toJSON',
        value: function toJSON() {
            return toJSONProp(this, ['navigation', 'timeOrigin', 'timing'])
        }
    });
    addObjProp(Performance.prototype, {
        name: 'now',
        value: function now() {
            const dateTimestamp = originDate.now();
            const timeOrigin = getPrivateProp(this, 'timeOrigin');
            return dateTimestamp - timeOrigin;
        }
    });
    addObjProp(Performance.prototype, {
        name: 'constructor',
        value: Performance,
        enumerable: false
    });
    addObjProp(Performance.prototype, {
        name: 'timing',
        get: function timing() {
            return getPrivateProp(this, 'timing');
        }
    });
    addObjProp(Performance.prototype, {
        name: 'navigation',
        get: function navigation() {
            return getPrivateProp(this, 'navigation');
        }
    });
    addObjProp(Performance.prototype, {
        name: 'memory',
        get: function memory() {
            return getPrivateProp(this, 'memory');
        }
    });
    addObjProp(Performance.prototype, {
        name: 'eventCounts',
        get: function eventCounts() {
            return getPrivateProp(this, 'eventCounts');
        }
    });
}, EventTarget)

module.exports = Performance;