const {
    setFunctionPrototype,
    addObjProp,
    getPrivateProp,
    setPrivateProp
} = require("../../utility.js");
const EventTarget = require("../../CommonApi/api/EventTarget.js");

function MediaQueryList() {
}

setFunctionPrototype(MediaQueryList, () => {
    addObjProp(MediaQueryList.prototype, {
        name: 'media',
        get: function media() {
            return getPrivateProp(this, 'media');
        }
    });
    addObjProp(MediaQueryList.prototype, {
        name: 'matches',
        get: function matches() {
            return getPrivateProp(this, 'matches');
        }
    });
    addObjProp(MediaQueryList.prototype, {
        name: 'onchange',
        get: function onchange() {
            return getPrivateProp(this, 'onchange');
        },
        set: function onchange(value) {
            return setPrivateProp(this, 'onchange', value);
        }
    });
    addObjProp(MediaQueryList.prototype, {name: 'addListener'});
    addObjProp(MediaQueryList.prototype, {name: 'removeListener'});
}, EventTarget)

module.exports = MediaQueryList;