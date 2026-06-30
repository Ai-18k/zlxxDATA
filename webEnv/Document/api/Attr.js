const {
    addObjProp,
    setFunctionPrototype,
    getPrivateProp,
    setPrivateProp,
    createError,
    originDate,
} = require("../../utility.js");
const Node = require("../../CommonApi/api/Node.js");

function Attr() {
}

setFunctionPrototype(Attr, () => {
    addObjProp(Attr.prototype, {
        name: 'namespaceURI',
        get: function namespaceURI() {
            return getPrivateProp(this, 'namespaceURI');
        }
    });
    addObjProp(Attr.prototype, {
        name: 'prefix',
        get: function prefix() {
            return getPrivateProp(this, 'prefix');
        }
    });
    addObjProp(Attr.prototype, {
        name: 'localName',
        get: function localName() {
            return getPrivateProp(this, 'localName');
        }
    });
    addObjProp(Attr.prototype, {
        name: 'name',
        get: function name() {
            return getPrivateProp(this, 'name');
        }
    });
    addObjProp(Attr.prototype, {
        name: ' value',
        get: function  value() {
            return getPrivateProp(this, ' value');
        },
        set: function  value(value) {
            return setPrivateProp(this, ' value', value);
        }
    });
    addObjProp(Attr.prototype, {
        name: 'ownerElement',
        get: function ownerElement() {
            return getPrivateProp(this, 'ownerElement');
        }
    });
    addObjProp(Attr.prototype, {
        name: 'specified',
        get: function specified() {
            return getPrivateProp(this, 'specified');
        }
    });
}, Node)

module.exports = Attr;