const {
    addObjProp,
    getPrivateProp,
    setFunctionPrototype
} = require("../../utility.js");

function Entry() {
}

setFunctionPrototype(Entry, () => {
    addObjProp(Entry.prototype, {
        name: 'isFile',
        get: function isFile(){
            return getPrivateProp(this, 'isFile');
        }
    });
    addObjProp(Entry.prototype, {
        name: 'isDirectory',
        get: function isDirectory(){
            return getPrivateProp(this, 'isDirectory')
        }
    });
    addObjProp(Entry.prototype, {
        name: 'name',
        get: function name(){
            return getPrivateProp(this, 'name');
        }
    });
    addObjProp(Entry.prototype, {
        name: 'fullPath',
        get: function fullPath(){
            return getPrivateProp(this, 'fullPath');
        }
    });
    addObjProp(Entry.prototype, {
        name: 'filesystem',
        get: function filesystem(){
            return getPrivateProp(this, 'filesystem');
        }
    });
    addObjProp(Entry.prototype, {name: 'copyTo'});
    addObjProp(Entry.prototype, {name: 'getMetadata'});
    addObjProp(Entry.prototype, {name: 'getParent'});
    addObjProp(Entry.prototype, {name: 'moveTo'});
    addObjProp(Entry.prototype, {name: 'remove'});
    addObjProp(Entry.prototype, {name: 'toURL'});
});

module.exports = Entry;