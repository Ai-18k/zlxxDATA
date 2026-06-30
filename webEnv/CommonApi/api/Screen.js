const {
    getPrivateProp,
    setPrivateProp,
    setFunctionPrototype,
    addObjProp
} = require("../../utility.js");
const EventTarget = require("./EventTarget.js");

function Screen() {
}

setFunctionPrototype(Screen, () => {
    addObjProp(Screen.prototype, {
        name: 'availWidth',
        get: function availWidth() {
            return getPrivateProp(this, 'availWidth')
        }
    });
    addObjProp(Screen.prototype, {
        name: 'availHeight',
        get: function availHeight() {
            return getPrivateProp(this, 'availHeight')
        }
    });
    addObjProp(Screen.prototype, {
        name: 'width',
        get: function width() {
            return getPrivateProp(this, 'width')
        }
    });
    addObjProp(Screen.prototype, {
        name: 'height',
        get: function height() {
            return getPrivateProp(this, 'height')
        }
    });
    addObjProp(Screen.prototype, {
        name: 'colorDepth',
        get: function colorDepth() {
            return getPrivateProp(this, 'colorDepth')
        }
    });
    addObjProp(Screen.prototype, {
        name: 'pixelDepth',
        get: function pixelDepth() {
            return getPrivateProp(this, 'pixelDepth')
        }
    });
    addObjProp(Screen.prototype, {
        name: 'availLeft',
        get: function availLeft() {
            return getPrivateProp(this, 'availLeft')
        }
    });
    addObjProp(Screen.prototype, {
        name: 'availTop',
        get: function availTop() {
            return getPrivateProp(this, 'availTop')
        }
    });
    addObjProp(Screen.prototype, {
        name: 'orientation',
        get: function orientation() {
            return getPrivateProp(this, 'orientation')
        }
    });
    addObjProp(Screen.prototype, {
        name: 'constructor',
        value: Screen,
        enumerable: false
    });
    addObjProp(Screen.prototype, {
        name: 'onchange',
        get: function onchange() {
            return getPrivateProp(this, 'onchange')
        },
        set: function onchange(value) {
            return setPrivateProp(this, 'onchange', value)
        }
    });
    addObjProp(Screen.prototype, {
        name: 'isExtended',
        get: function isExtended() {
            return getPrivateProp(this, 'isExtended')
        }
    });
}, EventTarget);

module.exports = Screen;