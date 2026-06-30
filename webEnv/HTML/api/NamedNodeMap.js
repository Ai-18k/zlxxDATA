const {
    addObjProp,
    initArray,
    setFunctionPrototype,
    setPrivateProp,
    getOriginObj
} = require("../../utility.js");
const Attr = require("./Attr.js")
const NodeList = require("../../CommonApi/api/NodeList.js");

function NamedNodeMap() {
}

setFunctionPrototype(NamedNodeMap, () => {
    addObjProp(NamedNodeMap.prototype, {name: 'length'});
    addObjProp(NamedNodeMap.prototype, {name: 'getNamedItem'});
    addObjProp(NamedNodeMap.prototype, {name: 'getNamedItemNS'});
    addObjProp(NamedNodeMap.prototype, {
        name: 'item',
        value: function item(key) {
            return this[key];
        }
    });
    addObjProp(NamedNodeMap.prototype, {name: 'removeNamedItem'});
    addObjProp(NamedNodeMap.prototype, {name: 'removeNamedItemNS'});
    addObjProp(NamedNodeMap.prototype, {
        name: 'setNamedItem',
        value: function setNamedItem(name, value = undefined) {
            const attr = new Attr();
            const originLocation = getOriginObj(location);
            setPrivateProp(attr, 'baseURI', originLocation.href);
            setPrivateProp(attr, 'ownerDocument', document);
            setPrivateProp(attr, 'ownerElement', this);
            setPrivateProp(attr, 'name', name,);
            setPrivateProp(attr, 'localName', name,);
            setPrivateProp(attr, 'nodeName', name,);
            setPrivateProp(attr, 'nodeType', 2);
            setPrivateProp(attr, 'nodeValue', value);
            setPrivateProp(attr, 'value', value);
            setPrivateProp(attr, 'textContent', value);
            setPrivateProp(attr, 'childNodes', new NodeList());
            setPrivateProp(attr, 'isConnected', false);
            setPrivateProp(attr, 'specified', true);

            this[this.length] = attr;
            addObjProp(this, {
                name: name,
                value: attr,
                writable: false,
                enumerable: false,
                configurable: true
            })
        }
    });
    addObjProp(NamedNodeMap.prototype, {name: 'setNamedItemNS'});
});
initArray(NamedNodeMap.prototype);

module.exports = NamedNodeMap;