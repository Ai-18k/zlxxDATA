const {
    setFunctionPrototype,
    addObjProp,
    getPrivateProp,
    setPrivateProp
} = require("../../utility.js");
const EventTarget = require("../../CommonApi/api/EventTarget.js");

function BatteryManager(){
}

setFunctionPrototype(BatteryManager,()=>{
    addObjProp(BatteryManager.prototype, {
        name: 'charging',
        get: function charging() {
            return true;
        }
    });
    addObjProp(BatteryManager.prototype, {
        name: 'chargingTime',
        get: function chargingTime() {
            return Infinity;
        }
    });
    addObjProp(BatteryManager.prototype, {
        name: 'dischargingTime',
        get: function dischargingTime() {
            return Infinity;
        }
    });
    addObjProp(BatteryManager.prototype, {
        name: 'level',
        get: function level() {
            return 1;
        }
    });
    addObjProp(BatteryManager.prototype, {
        name: 'onchargingchange',
        get: function onchargingchange() {
            return getPrivateProp(this, 'onchargingchange');
        },
        set: function onchargingchange(value) {
            return setPrivateProp(this, 'onchargingchange', value);
        }
    });
    addObjProp(BatteryManager.prototype, {
        name: 'onchargingtimechange',
        get: function onchargingtimechange() {
            return getPrivateProp(this, 'onchargingtimechange');
        },
        set: function onchargingtimechange(value) {
            return setPrivateProp(this, 'onchargingtimechange', value);
        }
    });
    addObjProp(BatteryManager.prototype, {
        name: 'ondischargingtimechange',
        get: function ondischargingtimechange() {
            return getPrivateProp(this, 'ondischargingtimechange');
        },
        set: function ondischargingtimechange(value) {
            return setPrivateProp(this, 'ondischargingtimechange', value);
        }
    });
    addObjProp(BatteryManager.prototype, {
        name: 'onlevelchange',
        get: function onlevelchange() {
            return getPrivateProp(this, 'onlevelchange');
        },
        set: function onlevelchange(value) {
            return setPrivateProp(this, 'onlevelchange', value);
        }
    });
},EventTarget)

module.exports = BatteryManager;