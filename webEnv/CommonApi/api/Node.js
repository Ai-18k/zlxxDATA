const {
    addObjProp,
    setFunctionPrototype,
    getPrivateProp,
    setPrivateProp,
    getOriginObj
} = require("../../utility.js");
const EventTarget = require("./EventTarget.js");
const queryFormProp = require("../fun/queryFormProp.js");

function Node() {
}

addObjProp(Node, {
    name: 'ELEMENT_NODE',
    value: 1,
    writable: false,
    configurable: false
});
addObjProp(Node, {
    name: 'ATTRIBUTE_NODE',
    value: 2,
    writable: false,
    configurable: false
});
addObjProp(Node, {
    name: 'TEXT_NODE',
    value: 3,
    writable: false,
    configurable: false
});
addObjProp(Node, {
    name: 'CDATA_SECTION_NODE',
    value: 4,
    writable: false,
    configurable: false
});
addObjProp(Node, {
    name: 'ENTITY_REFERENCE_NODE',
    value: 5,
    writable: false,
    configurable: false
});
addObjProp(Node, {
    name: 'ENTITY_NODE',
    value: 6,
    writable: false,
    configurable: false
});
addObjProp(Node, {
    name: 'PROCESSING_INSTRUCTION_NODE',
    value: 7,
    writable: false,
    configurable: false
});
addObjProp(Node, {
    name: 'COMMENT_NODE',
    value: 8,
    writable: false,
    configurable: false
});
addObjProp(Node, {
    name: 'DOCUMENT_NODE',
    value: 9,
    writable: false,
    configurable: false
});
addObjProp(Node, {
    name: 'DOCUMENT_TYPE_NODE',
    value: 10,
    writable: false,
    configurable: false
});
addObjProp(Node, {
    name: 'DOCUMENT_FRAGMENT_NODE',
    value: 11,
    writable: false,
    configurable: false
});
addObjProp(Node, {
    name: 'NOTATION_NODE',
    value: 12,
    writable: false,
    configurable: false
});
addObjProp(Node, {
    name: 'DOCUMENT_POSITION_DISCONNECTED',
    value: 1,
    writable: false,
    configurable: false
});
addObjProp(Node, {
    name: 'DOCUMENT_POSITION_PRECEDING',
    value: 2,
    writable: false,
    configurable: false
});
addObjProp(Node, {
    name: 'DOCUMENT_POSITION_FOLLOWING',
    value: 4,
    writable: false,
    configurable: false
});
addObjProp(Node, {
    name: 'DOCUMENT_POSITION_CONTAINS',
    value: 8,
    writable: false,
    configurable: false
});
addObjProp(Node, {
    name: 'DOCUMENT_POSITION_CONTAINED_BY',
    value: 16,
    writable: false,
    configurable: false
});
addObjProp(Node, {
    name: 'DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC',
    value: 32,
    writable: false,
    configurable: false
});

setFunctionPrototype(Node, () => {
    addObjProp(Node.prototype, {
        name: 'nodeType',
        get: function nodeType() {
            return getPrivateProp(this, 'nodeType');
        }
    });
    addObjProp(Node.prototype, {
        name: 'nodeName',
        get: function nodeName() {
            return getPrivateProp(this, 'nodeName');
        }
    });
    addObjProp(Node.prototype, {
        name: 'baseURI',
        get: function baseURI() {
            const originLocation = getOriginObj(location);
            return originLocation.href;
        }
    });
    addObjProp(Node.prototype, {
        name: 'isConnected',
        get: function isConnected() {
            return getPrivateProp(this, 'isConnected');
        }
    });
    addObjProp(Node.prototype, {
        name: 'ownerDocument',
        get: function ownerDocument() {
            return getPrivateProp(this, 'ownerDocument') || document;
        }
    });
    addObjProp(Node.prototype, {
        name: 'parentNode',
        get: function parentNode() {
            return getPrivateProp(this, 'parentNode');
        }
    });
    addObjProp(Node.prototype, {
        name: 'parentElement',
        get: function parentElement() {
            return getPrivateProp(this, 'parentNode');
        }
    });
    addObjProp(Node.prototype, {
        name: 'childNodes',
        get: function childNodes() {
            return getPrivateProp(this, 'childNodes');
        }
    });
    addObjProp(Node.prototype, {
        name: 'firstChild',
        get: function firstChild() {
            const childNodes = getPrivateProp(this, 'childNodes');
            return childNodes[0];
        }
    });
    addObjProp(Node.prototype, {
        name: 'lastChild',
        get: function lastChild() {
            const childNodes = getPrivateProp(this, 'childNodes');
            return childNodes[childNodes.length - 1];
        }
    });
    addObjProp(Node.prototype, {
        name: 'previousSibling',
        get: function previousSibling() {
            return getPrivateProp(this, 'previousSibling');
        }
    });
    addObjProp(Node.prototype, {
        name: 'nextSibling',
        get: function nextSibling() {
            return getPrivateProp(this, 'nextSibling');
        }
    });
    addObjProp(Node.prototype, {
        name: 'nodeValue',
        get: function nodeValue() {
            return getPrivateProp(this, 'nodeValue');
        },
        set: function nodeValue(value) {
            return setPrivateProp(this, 'nodeValue', value);
        }
    });
    addObjProp(Node.prototype, {
        name: 'textContent',
        get: function textContent() {
            let textContent = getPrivateProp(this, 'textContent');
            const originNode = getOriginObj(this);
            if(originNode instanceof HTMLFormElement){
                textContent = queryFormProp(this,'textContent')
            }
            return textContent;
        },
        set: function textContent(value) {
            return setPrivateProp(this, 'textContent', value);
        }
    });
    addObjProp(Node.prototype, {
        name: 'ELEMENT_NODE',
        value: Node.ELEMENT_NODE,
        writable: false,
        configurable: false
    });
    addObjProp(Node.prototype, {
        name: 'ATTRIBUTE_NODE',
        value: Node.ATTRIBUTE_NODE,
        writable: false,
        configurable: false
    });
    addObjProp(Node.prototype, {
        name: 'TEXT_NODE',
        value: Node.TEXT_NODE,
        writable: false,
        configurable: false
    });
    addObjProp(Node.prototype, {
        name: 'CDATA_SECTION_NODE',
        value: Node.CDATA_SECTION_NODE,
        writable: false,
        configurable: false
    });
    addObjProp(Node.prototype, {
        name: 'ENTITY_REFERENCE_NODE',
        value: Node.ENTITY_REFERENCE_NODE,
        writable: false,
        configurable: false
    });
    addObjProp(Node.prototype, {
        name: 'ENTITY_NODE',
        value: Node.ENTITY_NODE,
        writable: false,
        configurable: false
    });
    addObjProp(Node.prototype, {
        name: 'PROCESSING_INSTRUCTION_NODE',
        value: Node.PROCESSING_INSTRUCTION_NODE,
        writable: false,
        configurable: false
    });
    addObjProp(Node.prototype, {
        name: 'COMMENT_NODE',
        value: Node.COMMENT_NODE,
        writable: false,
        configurable: false
    });
    addObjProp(Node.prototype, {
        name: 'DOCUMENT_NODE',
        value: Node.DOCUMENT_NODE,
        writable: false,
        configurable: false
    });
    addObjProp(Node.prototype, {
        name: 'DOCUMENT_TYPE_NODE',
        value: Node.DOCUMENT_TYPE_NODE,
        writable: false,
        configurable: false
    });
    addObjProp(Node.prototype, {
        name: 'DOCUMENT_FRAGMENT_NODE',
        value: Node.DOCUMENT_FRAGMENT_NODE,
        writable: false,
        configurable: false
    });
    addObjProp(Node.prototype, {
        name: 'NOTATION_NODE',
        value: Node.NOTATION_NODE,
        writable: false,
        configurable: false
    });
    addObjProp(Node.prototype, {
        name: 'DOCUMENT_POSITION_DISCONNECTED',
        value: Node.DOCUMENT_POSITION_DISCONNECTED,
        writable: false,
        configurable: false
    });
    addObjProp(Node.prototype, {
        name: 'DOCUMENT_POSITION_PRECEDING',
        value: Node.DOCUMENT_POSITION_PRECEDING,
        writable: false,
        configurable: false
    });
    addObjProp(Node.prototype, {
        name: 'DOCUMENT_POSITION_FOLLOWING',
        value: Node.DOCUMENT_POSITION_FOLLOWING,
        writable: false,
        configurable: false
    });
    addObjProp(Node.prototype, {
        name: 'DOCUMENT_POSITION_CONTAINS',
        value: Node.DOCUMENT_POSITION_CONTAINS,
        writable: false,
        configurable: false
    });
    addObjProp(Node.prototype, {
        name: 'DOCUMENT_POSITION_CONTAINED_BY',
        value: Node.DOCUMENT_POSITION_CONTAINED_BY,
        writable: false,
        configurable: false
    });
    addObjProp(Node.prototype, {
        name: 'DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC',
        value: Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC,
        writable: false,
        configurable: false
    });
    addObjProp(Node.prototype, {name: 'appendChild'});
    addObjProp(Node.prototype, {name: 'cloneNode'});
    addObjProp(Node.prototype, {name: 'compareDocumentPosition'});
    addObjProp(Node.prototype, {
        name: 'contains',
        value: function contains(node){
            if (!node) return false;
            const originObj = getOriginObj(this);
            const originNode = getOriginObj(node);
            if (originNode === originObj) return true;
            return originObj.contains(originNode.parentNode);
        }
    });
    addObjProp(Node.prototype, {name: 'getRootNode'});
    addObjProp(Node.prototype, {
        name: 'hasChildNodes',
        valueOf: function hasChildNodes(node){
            let children = getPrivateProp(this, 'childNodes');
            return false;
        }
    });
    addObjProp(Node.prototype, {
        name: 'insertBefore',
        value: function insertBefore(newNode, childNode){
            let children = getPrivateProp(this, 'childNodes');
            if (childNode){
                const insert = getPrivateProp(children, 'insert');
                insert(newNode, childNode)
            }else{
                const addChildren = getPrivateProp(children, 'push');
                addChildren(newNode)
            }
            return newNode;
        }
    });
    addObjProp(Node.prototype, {name: 'isDefaultNamespace'});
    addObjProp(Node.prototype, {name: 'isEqualNode'});
    addObjProp(Node.prototype, {name: 'isSameNode'});
    addObjProp(Node.prototype, {name: 'lookupNamespaceURI'});
    addObjProp(Node.prototype, {name: 'lookupPrefix'});
    addObjProp(Node.prototype, {name: 'normalize'});
    addObjProp(Node.prototype, {name: 'removeChild'});
    addObjProp(Node.prototype, {name: 'replaceChild'});
}, EventTarget);

module.exports = Node;