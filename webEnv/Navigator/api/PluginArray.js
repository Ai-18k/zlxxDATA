const {
    setFunctionPrototype,
    addObjProp,
    initArray,
    ArrayPrototype,
    setPrivateProp
} = require("../../utility.js");
const Plugin = require("./Plugin.js");

function PluginArray(plugins= undefined){
    let pluginArray = [];
    if (plugins) {
        plugins.forEach((item) => {
            if(item instanceof Plugin){
                pluginArray.push(item);
            }else if(item.mimeTypes){
                let plugin = new Plugin({
                    enabledPluginAlike: item.enabledPluginAlike,
                    name: item.name,
                    mimeTypes: item.mimeTypes
                });
                setPrivateProp(plugin, 'filename', item.filename || '');
                setPrivateProp(plugin, 'description', item.description || '');
                setPrivateProp(plugin, 'name', item.name || '');
                pluginArray.push(plugin);
                addObjProp(this, {
                    name: item.name,
                    enumerable: false,
                    writable: false,
                    value: plugin
                });
            }
        });
    }
    ArrayPrototype(this, pluginArray);
}

setFunctionPrototype(PluginArray, () => {
    addObjProp(PluginArray.prototype, {name: 'length'});
    addObjProp(PluginArray.prototype, {
        name: 'item',
        value: function item(key) {
            return this[key];
        }
    });
    addObjProp(PluginArray.prototype, {
        name: 'namedItem',
        value: function namedItem(id) {
            //查询id
            // return this[key];
        }
    });
    addObjProp(PluginArray.prototype, {
        name: 'refresh',
        value: function refresh(id) {
        }
    });
});

initArray(PluginArray.prototype);

module.exports = PluginArray;