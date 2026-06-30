const {
    addObjProp,
    ArrayPrototype,
    setFunctionPrototype,
    initArray,
    setPrivateProp,
    getPrivateProp
} = require("../../utility.js");
const MimeType = require("./MimeType.js");

function Plugin(options){
    let plugins = [];
    if (options){
        setPrivateProp(this, 'name', options.name || '');
        if (options.mimeTypes) {
            options.mimeTypes.forEach((item) => {
                const mimeType = new MimeType({
                    description: item.description,
                    suffixes: item.suffixes,
                    type: item.type,
                });
                setPrivateProp(mimeType, 'enabledPlugin', this);
                plugins.push(mimeType);
                addObjProp(this, {
                    name: item.type,
                    enumerable: false,
                    writable: false,
                    value: mimeType
                });
            });
        }
    }
    ArrayPrototype(this, plugins);
}

setFunctionPrototype(Plugin, () => {
    addObjProp(Plugin.prototype, {
        name: 'name',
        get: function name() {
            return getPrivateProp(this, 'name');
        }
    });
    addObjProp(Plugin.prototype, {
        name: 'filename',
        get: function filename() {
            return getPrivateProp(this, 'filename');
        }
    });
    addObjProp(Plugin.prototype, {
        name: 'description',
        get: function description() {
            return getPrivateProp(this, 'description');
        }
    });
    addObjProp(Plugin.prototype, {name: 'length'});
    addObjProp(Plugin.prototype, {
        name: 'item',
        value: function item(key) {
            return this[key];
        }
    });
    addObjProp(Plugin.prototype, {
        name: 'namedItem',
        value: function namedItem(id) {
            //查询id
            // return this[key];
        }
    });
});

initArray(Plugin.prototype);


module.exports = Plugin;