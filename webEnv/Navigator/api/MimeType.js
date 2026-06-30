const {
    setFunctionPrototype,
    addObjProp,
    setPrivateProp,
    getPrivateProp,
    originObject
} = require("../../utility.js");

function MimeType(options = undefined) {
    if (options) {
        originObject.keys(options).forEach((key) => {
            setPrivateProp(this, key, options[key]);
        });
    }
}

setFunctionPrototype(MimeType, () => {
    addObjProp(MimeType.prototype, {
        name: 'type',
        get: function type() {
            return getPrivateProp(this, 'type');
        }
    });
    addObjProp(MimeType.prototype, {
        name: 'suffixes',
        get: function suffixes() {
            return getPrivateProp(this, 'suffixes');
        }
    });
    addObjProp(MimeType.prototype, {
        name: 'description',
        get: function description() {
            return getPrivateProp(this, 'description');
        }
    });
    addObjProp(MimeType.prototype, {
        name: 'enabledPlugin',
        get: function enabledPlugin() {
            return getPrivateProp(this, 'enabledPlugin');
        }
    });
});


module.exports = MimeType;