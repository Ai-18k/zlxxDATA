const {
    setPrivateProp,
    setFunctionPrototype,
    addObjProp,
    getPrivateProp
} = require("../../utility.js");
const Node = require("../../CommonApi/api/Node.js");

function DocumentType() {
    setPrivateProp(this, 'tagName', 'DocumentType');
}

setFunctionPrototype(DocumentType, () => {
    addObjProp(DocumentType.prototype, {
        name: 'name',
        get: function name() {
            return getPrivateProp(this, 'name');
        }
    });
    addObjProp(DocumentType.prototype, {
        name: 'publicId',
        get: function publicId() {
            return getPrivateProp(this, 'publicId');
        }
    });
    addObjProp(DocumentType.prototype, {
        name: 'systemId',
        get: function systemId() {
            return getPrivateProp(this, 'systemId');
        }
    });
    addObjProp(DocumentType.prototype, {name: 'after'});
    addObjProp(DocumentType.prototype, {name: 'before'});
    addObjProp(DocumentType.prototype, {name: 'remove'});
    addObjProp(DocumentType.prototype, {name: 'replaceWith'});
}, Node);
addObjProp(DocumentType.prototype, {
    name: Symbol.unscopables,
    value: {
        "after": true,
        "before": true,
        "remove": true,
        "replaceWith": true
    },
    enumerable: false,
    writable: false
});

module.exports =  DocumentType;