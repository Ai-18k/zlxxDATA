const {
    setPrivateProp,
    getPrivateProp,
    setFunctionPrototype,
    addObjProp,
    getOriginObj,
    originObject
} = require("../utility.js");
const NodeList = require("../CommonApi/api/NodeList.js");
const CharacterData = require("./CharacterData.js");

function Text(options = undefined) {
    if(options){
        const originLocation = getOriginObj(location);
        setPrivateProp(this, 'tagName', '#text');
        setPrivateProp(this, 'nodeName', '#text');
        setPrivateProp(this, 'nodeType', 3);
        setPrivateProp(this, 'baseURI', originLocation.href);
        setPrivateProp(this, 'childNodes', new NodeList([]));
        setPrivateProp(this, 'isConnected', false);
        setPrivateProp(this, 'data', '');
        setPrivateProp(this, 'wholeText', options.data || '');
        setPrivateProp(this, 'nodeValue', options.data || '');

        if(options.parentNode) setPrivateProp(this, 'parentElement', options.parentElement);
        if(options.nextSibling) setPrivateProp(this, 'nextElementSibling', options.nextSibling);
        if(options.previousSibling) setPrivateProp(this, 'previousElementSibling', options.previousSibling);

        originObject.keys(options).forEach((propName)=>{
            setPrivateProp(this, propName, options[propName]);
        })

    }
}

setFunctionPrototype(Text, () => {
    addObjProp(Text.prototype, {
        name: 'wholeText',
        get: function wholeText() {
            return getPrivateProp(this, 'wholeText') || '';
        }
    });
    addObjProp(Text.prototype, {
        name: 'assignedSlot',
        get: function assignedSlot() {
            return getPrivateProp(this, 'assignedSlot');
        }
    });
    addObjProp(Text.prototype, {name: 'splitTex'});
}, CharacterData);

module.exports = Text;