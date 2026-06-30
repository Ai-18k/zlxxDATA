const {
    addObjProp,
    setFunctionPrototype,
    getPrivateProp,
    toJSONProp
} = require("../../utility.js");
const staticProp = [
    ["TYPE_NAVIGATE", 0],
    ["TYPE_RELOAD", 1],
    ["TYPE_BACK_FORWARD", 2],
    ["TYPE_RESERVED", 255]
];

function PerformanceNavigation() {
}

staticProp.forEach(function (item) {
    addObjProp(PerformanceNavigation, {
        name: item[0],
        value: item[1],
        configurable: false,
        writable: false
    })
});

setFunctionPrototype(PerformanceNavigation, () => {
    addObjProp(PerformanceNavigation.prototype, {
        name: 'type',
        get: function type() {
            return getPrivateProp(this, 'type')
        }
    });
    addObjProp(PerformanceNavigation.prototype, {
        name: 'redirectCount',
        get: function redirectCount() {
            return getPrivateProp(this, 'redirectCount')
        }
    });
    staticProp.forEach(function (item) {
        addObjProp(PerformanceNavigation.prototype, {
            name: item[0],
            value: item[1],
            configurable: false,
            writable: false
        })
    });
    addObjProp(PerformanceNavigation.prototype, {
        name: 'toJSON',
        value: function toJSON() {
            return toJSONProp(this, ['redirectCount', 'type'])
        }
    });
});

module.exports = PerformanceNavigation;