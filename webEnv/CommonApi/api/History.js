const {
    setFunctionPrototype,
    setPrivateProp,
    getPrivateProp,
    addObjProp
} = require("../../utility.js");

function History() {}

setFunctionPrototype(History, () => {
    addObjProp(History.prototype, {
        name: 'length',
        get: function length() {
            return getPrivateProp(this, 'length');
        }
    });
    addObjProp(History.prototype, {
        name: 'scrollRestoration',
        get: function scrollRestoration() {
            return getPrivateProp(this, 'scrollRestoration') || 'auto';
        },
        set: function scrollRestoration(value){
            return setPrivateProp(this, 'scrollRestoration', value);
        }
    });
    addObjProp(History.prototype, {
        name: 'state',
        get: function state() {
            return getPrivateProp(this, 'state');
        }
    });
    addObjProp(History.prototype, {
        name: 'back',
        value: function back(){}
    });
    addObjProp(History.prototype, {
        name: 'forward',
        value: function forward(){}
    });
    addObjProp(History.prototype, {
        name: 'go',
        value: function go(){}
    });
    addObjProp(History.prototype, {
        name: 'pushState',
        value: function pushState(state, url){}
    });
    addObjProp(History.prototype, {
        name: 'replaceState',
        value: function replaceState(state, url){}
    });
});

module.exports = History;