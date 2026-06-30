const {
    getPrivateProp,
    setPrivateProp,
    setFunctionPrototype,
    addObjProp
} = require("../../utility.js");

function Event(target) {
}

addObjProp(Event,{
    name: 'NONE',
    value: 0
});
addObjProp(Event,{
    name: 'CAPTURING_PHASE',
    value: 1
});
addObjProp(Event,{
    name: 'AT_TARGET',
    value: 2
});
addObjProp(Event,{
    name: 'BUBBLING_PHASE',
    value: 3
});

setFunctionPrototype(Event, () => {
    addObjProp(Event.prototype, {
        name: 'type',
        get: function type() {
            return getPrivateProp(this, 'type');
        }
    });
    addObjProp(Event.prototype, {
        name: 'target',
        get: function target() {
            return getPrivateProp(this, 'target');
        }
    });
    addObjProp(Event.prototype, {
        name: 'currentTarget',
        get: function currentTarget() {
            return getPrivateProp(this, 'currentTarget');
        }
    });
    addObjProp(Event.prototype, {
        name: 'eventPhase',
        get: function eventPhase() {
            return getPrivateProp(this, 'eventPhase');
        }
    });
    addObjProp(Event.prototype, {
        name: 'bubbles',
        get: function bubbles() {
            return getPrivateProp(this, 'bubbles');
        }
    });
    addObjProp(Event.prototype, {
        name: 'cancelable',
        get: function cancelable() {
            return getPrivateProp(this, 'cancelable');
        }
    });
    addObjProp(Event.prototype, {
        name: 'defaultPrevented',
        get: function defaultPrevented() {
            return getPrivateProp(this, 'defaultPrevented');
        }
    });
    addObjProp(Event.prototype, {
        name: 'composed',
        get: function composed() {
            return getPrivateProp(this, 'composed');
        }
    });
    addObjProp(Event.prototype, {
        name: 'timeStamp',
        get: function timeStamp() {
            return getPrivateProp(this, 'timeStamp');
        }
    });
    addObjProp(Event.prototype, {
        name: 'srcElement',
        get: function srcElement() {
            return getPrivateProp(this, 'srcElement');
        }
    });
    addObjProp(Event.prototype, {
        name: 'returnValue',
        get: function returnValue() {
            return getPrivateProp(this, 'returnValue');
        },
        set: function returnValue(value) {
            return setPrivateProp(this, 'returnValue', value);
        }
    });
    addObjProp(Event.prototype, {
        name: 'cancelBubble',
        get: function cancelBubble() {
            return getPrivateProp(this, 'cancelBubble');
        },
        set: function cancelBubble(value) {
            return setPrivateProp(this, 'cancelBubble', value);
        }
    });
    addObjProp(Event.prototype,{
        name: 'NONE',
        value: Event.NONE
    });
    addObjProp(Event.prototype,{
        name: 'CAPTURING_PHASE',
        value: Event.CAPTURING_PHASE
    });
    addObjProp(Event.prototype,{
        name: 'AT_TARGET',
        value: Event.AT_TARGET
    });
    addObjProp(Event.prototype,{
        name: 'BUBBLING_PHASE',
        value: Event.BUBBLING_PHASE
    });
    addObjProp(Event.prototype, {name: 'composedPath'});
    addObjProp(Event.prototype, {name: 'initEvent'});
    addObjProp(Event.prototype, {name: 'preventDefault'});
    addObjProp(Event.prototype, {name: 'stopImmediatePropagation'});
    addObjProp(Event.prototype, {name: 'stopPropagation'});
});


module.exports = Event;