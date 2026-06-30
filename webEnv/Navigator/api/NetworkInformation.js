const {
    setFunctionPrototype,
    addObjProp,
    getPrivateProp,
    setPrivateProp
} = require("../../utility.js");
const EventTarget= require("../../CommonApi/api/EventTarget.js");

function NetworkInformation() {
}

setFunctionPrototype(NetworkInformation, () => {
    addObjProp(NetworkInformation.prototype, {
        name:'onchange',
        get: function onchange() {
            return getPrivateProp(this, 'onchange');
        },
        set: function onchange(value) {
            return setPrivateProp(this, 'onchange', value);
        },
    });
    addObjProp(NetworkInformation.prototype, {
        name:'effectiveType',
        get: function effectiveType() {
            return getPrivateProp(this, 'effectiveType');
        }
    });
    addObjProp(NetworkInformation.prototype, {
        name:'rtt',
        get: function rtt() {
            return getPrivateProp(this, 'rtt');
        }
    });
    addObjProp(NetworkInformation.prototype, {
        name:'downlink',
        get: function downlink() {
            return getPrivateProp(this, 'downlink');
        }
    });
    addObjProp(NetworkInformation.prototype, {
        name:'saveData',
        get: function saveData() {
            return getPrivateProp(this, 'saveData');
        }
    });
}, EventTarget);

module.exports = NetworkInformation;