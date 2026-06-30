const {
    addObjProp,
    setPrivateProp,
    ArrayPrototype,
    setFunctionPrototype,
    initArray
} = require("../../utility.js");
const Plugin = require("./Plugin.js");
const MimeType = require("./MimeType.js");

/**
 * @method MimeTypeArray MimeTypeArray构造函数
 * @param {Object} options 配置项
 * @param {Boolean} options.enabledPluginAlike enabledPlugin属性是否一致
 * @param {Array} options.mimeTypes MimeTypes数组
 * */
function MimeTypeArray(options) {
    let mimeTypeArray = []
    if (options && options.mimeTypes) {
        let plugin = {};
        if (options.enabledPluginAlike) {
            plugin = new Plugin({
                mimeTypes: options.mimeTypes
            });
            setPrivateProp(plugin, 'filename', options.mimeTypes[0].filename || '');
            setPrivateProp(plugin, 'description', options.mimeTypes[0].description || '');
            setPrivateProp(plugin, 'name', options.mimeTypes[0].name || '');
        }
        options.mimeTypes.forEach((item) => {
            if (!options.enabledPluginAlike) {
                plugin = new Plugin({
                    mimeTypes: options.mimeTypes
                });
                setPrivateProp(plugin, 'filename', item.filename || '');
                setPrivateProp(plugin, 'description', item.description || '');
                setPrivateProp(plugin, 'name', item.name || '');
            }

            const mimeType = new MimeType({
                description: item.description,
                suffixes: item.suffixes,
                type: item.type,
            });
            setPrivateProp(mimeType, 'enabledPlugin', plugin);
            mimeTypeArray.push(mimeType);
            addObjProp(this, {
                name: item.type,
                enumerable: false,
                writable: false,
                value: mimeType
            });
        });
    }
    ArrayPrototype(this, mimeTypeArray);
}

setFunctionPrototype(MimeTypeArray, () => {
    addObjProp(MimeTypeArray.prototype, {name: 'length'});
    addObjProp(MimeTypeArray.prototype, {
        name: 'item',
        value: function item(key) {
            return this[key];
        }
    });
    addObjProp(MimeTypeArray.prototype, {
        name: 'namedItem',
        value: function namedItem(id) {
            //查询id
            // return this[key];
        }
    });
});

initArray(MimeTypeArray.prototype);

module.exports = MimeTypeArray;