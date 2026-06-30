const {
    setFunctionPrototype,
    setPrivateProp,
    getPrivateProp,
    addObjProp,
    chalkLog,
    getOriginObj,
    originMath
} = require("../../utility.js");
const Event = require("./Event.js");

function EventTarget() {
}

setFunctionPrototype(EventTarget, () => {
    addObjProp(EventTarget.prototype, {
        name: 'addEventListener',
        value: function addEventListener(event, callback) {
            const tagName = getPrivateProp(this, 'tagName');
            chalkLog('red', `${tagName}中addEventListener接受的值是：${event} === ${callback} `);
            const events = getPrivateProp(this, 'events') || {};
            let callbackPar = new Event();
            const timeStamp = originMath.random() * 2000 + 1000;
            const originObj = getOriginObj(this);

            if(originObj instanceof Window){
                setPrivateProp(callbackPar,'type',event);
                setPrivateProp(callbackPar,'target', document);
                setPrivateProp(callbackPar,'srcElement', document);
                setPrivateProp(callbackPar,'currentTarget', this);
                setPrivateProp(callbackPar, 'bubbles', false);
                setPrivateProp(callbackPar, 'cancelBubble', false);
                setPrivateProp(callbackPar, 'cancelable', false);
                setPrivateProp(callbackPar, 'composed', false);
                setPrivateProp(callbackPar, 'defaultPrevented', false);
                setPrivateProp(callbackPar, 'eventPhase', 2);
                setPrivateProp(callbackPar, 'timeStamp', timeStamp);
                setPrivateProp(callbackPar, 'returnValue', true);
                addObjProp(callbackPar, {
                    name: 'isTrusted',
                    configurable: false,
                    get: function isTrusted() {
                        return true
                    }
                });
            }
            events[event] = {
                callback: callback,
                par: callbackPar
            };
            chalkLog('red', `${tagName}事件已收集，可使用getPrivateProp(obj, "events")查看相关事件函数，obj为绑定事件的对象`);
            setPrivateProp(this, 'events', events);
        }
    });
    addObjProp(EventTarget.prototype, {
        name: 'dispatchEvent',
        value: function dispatchEvent() {
        }
    });
    addObjProp(EventTarget.prototype, {
        name: 'removeEventListener',
        value: function removeEventListener() {
        }
    });
});

module.exports = EventTarget;