const {
    getPrivateProp,
    setPrivateProp,
    setFunctionPrototype,
    addObjProp
} = require("../../utility.js");
const EventTarget = require("./EventTarget.js");

function ScreenOrientation() {
}

setFunctionPrototype(ScreenOrientation, () => {
    addObjProp(ScreenOrientation.prototype, {
        name: 'angle',
        get: function angle() {
            return getPrivateProp(this, 'angle')
        }
    });
    addObjProp(ScreenOrientation.prototype, {
        name: 'type',
        get: function type() {
            return getPrivateProp(this, 'type')
        }
    });
    addObjProp(ScreenOrientation.prototype, {
        name: 'onchange',
        get: function onchange() {
            return getPrivateProp(this, 'onchange')
        },
        set: function onchange(value) {
            return setPrivateProp(this, 'onchange', value)
        }
    });
    addObjProp(ScreenOrientation.prototype, {name: 'lock'});
    addObjProp(ScreenOrientation.prototype, {name: 'unlock'});
}, EventTarget);

module.exports = ScreenOrientation;