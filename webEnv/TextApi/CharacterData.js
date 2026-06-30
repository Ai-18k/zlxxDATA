const {
    setPrivateProp,
    getPrivateProp,
    setFunctionPrototype,
    addObjProp
} = require("../utility.js");
const Node = require("../CommonApi/api/Node.js");

function CharacterData() {
}

setFunctionPrototype(CharacterData, () => {
    addObjProp(CharacterData.prototype, {
        name: 'data',
        get: function data() {
            return getPrivateProp(this, 'data');
        },
        set: function data(value) {
            return setPrivateProp(this, 'data', value);
        }
    });
    addObjProp(CharacterData.prototype, {
        name: 'length',
        get: function length() {
            const data = getPrivateProp(this, 'data');
            return data.length;
        }
    });
    addObjProp(CharacterData.prototype, {
        name: 'previousElementSibling',
        get: function previousElementSibling() {
            return getPrivateProp(this, 'previousElementSibling');
        }
    });
    addObjProp(CharacterData.prototype, {
        name: 'nextElementSibling',
        get: function nextElementSibling() {
            return getPrivateProp(this, 'nextElementSibling');
        }
    });
    addObjProp(CharacterData.prototype, {name: 'after'});
    addObjProp(CharacterData.prototype, {name: 'appendData'});
    addObjProp(CharacterData.prototype, {name: 'before'});
    addObjProp(CharacterData.prototype, {name: 'deleteData'});
    addObjProp(CharacterData.prototype, {name: 'insertData'});
    addObjProp(CharacterData.prototype, {name: 'remove'});
    addObjProp(CharacterData.prototype, {name: 'replaceData'});
    addObjProp(CharacterData.prototype, {name: 'replaceWith'});
    addObjProp(CharacterData.prototype, {name: 'substringData'});
}, Node);

module.exports = CharacterData;