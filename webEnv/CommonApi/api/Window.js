const {addObjProp, updateFunToString} = require("../../utility.js");

function Window() {
}
addObjProp(Window,{
    name: 'TEMPORARY',
    value: 0,
    configurable: false,
    writable: false
});
addObjProp(Window,{
    name: 'PERSISTENT',
    value: 1,
    configurable: false,
    writable: false
});
addObjProp(Window.prototype,{
    name: 'TEMPORARY',
    value: Window.TEMPORARY,
    configurable: false,
    writable: false
});
addObjProp(Window.prototype,{
    name: 'PERSISTENT',
    value: Window.PERSISTENT,
    configurable: false,
    writable: false
});
addObjProp(Window.prototype, {
    name: 'constructor',
    value: updateFunToString(Window),
    enumerable: false
});
addObjProp(Window.prototype, {
    name: Symbol.toStringTag,
    value: Window.name,
    enumerable: false
});

module.exports = Window;
