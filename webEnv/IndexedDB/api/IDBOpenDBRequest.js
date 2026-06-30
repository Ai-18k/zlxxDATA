const {
    getPrivateProp,
    setPrivateProp,
    setFunctionPrototype,
    addObjProp,
    originSetTimeout
} = require("../../utility.js");
const IDBRequest = require("./IDBRequest.js");
const IDBVersionChangeEvent = require("./IDBVersionChangeEvent.js");
const requestEventCallback = require("../fun/requestEventCallback.js");

function IDBOpenDBRequest() {
    setPrivateProp(this, 'readyState', 'pending');
}

setFunctionPrototype(IDBOpenDBRequest, () => {
    addObjProp(IDBOpenDBRequest.prototype, {
        name: 'onblocked',
        get: function onblocked() {
            return getPrivateProp(this, 'onblocked');
        },
        set: function onblocked(value) {
            return setPrivateProp(this, 'onblocked', value);
        }
    });
    addObjProp(IDBOpenDBRequest.prototype, {
        name: 'onupgradeneeded',
        get: function onupgradeneeded() {
            return getPrivateProp(this, 'onupgradeneeded');
        },
        set: function onupgradeneeded(value) {
            let version = getPrivateProp(this, 'version');
            let update = getPrivateProp(this, 'update');
            let oldVersion = getPrivateProp(this, 'oldVersion');

            let events = new IDBVersionChangeEvent();
            const timeStamp = getPrivateProp(this, 'timeStamp');
            setPrivateProp(events, 'type', 'upgradeneeded');
            setPrivateProp(events, 'dataLoss', 'none');
            setPrivateProp(events, 'dataLossMessage', '');
            setPrivateProp(events, 'currentTarget', this);
            setPrivateProp(events, 'bubbles', false);
            setPrivateProp(events, 'cancelBubble', false);
            setPrivateProp(events, 'cancelable', false);
            setPrivateProp(events, 'composed', false);
            setPrivateProp(events, 'defaultPrevented', false);
            setPrivateProp(events, 'oldVersion', oldVersion);
            setPrivateProp(events, 'newVersion', version);
            setPrivateProp(events, 'eventPhase', 2);
            setPrivateProp(events, 'srcElement', this);
            setPrivateProp(events, 'target', this);
            setPrivateProp(events, 'timeStamp', timeStamp);
            setPrivateProp(events, 'returnValue', true);

            addObjProp(events, {
                name: 'isTrusted',
                configurable: false,
                get: function isTrusted() {
                    return true
                }
            });

            //模拟数据库打开检测版本时间
            originSetTimeout(() => {
                setPrivateProp(this, 'readyState', 'done');
                if (update) value(events);
                //执行完onupgradeneeded，再执行onsuccess、onerror
                const onsuccess = getPrivateProp(this, 'onsuccess');
                const onerror = getPrivateProp(this, 'onerror');

                if (onsuccess) requestEventCallback(this, onsuccess, 'success');
                if (onerror) requestEventCallback(this, onerror, 'error');
            })

            return setPrivateProp(this, 'onupgradeneeded', value);
        }
    });
}, IDBRequest);

module.exports = IDBOpenDBRequest;