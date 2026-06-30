const {
    setFunctionPrototype,
    addObjProp
} = require("../../utility.js");

function DeprecatedStorageQuota() {
}

setFunctionPrototype(DeprecatedStorageQuota, () => {
    addObjProp(DeprecatedStorageQuota.prototype, {
        name: 'queryUsageAndQuota'
    });
    addObjProp(DeprecatedStorageQuota.prototype, {
        name: 'requestQuota'
    });
});

delete DeprecatedStorageQuota.prototype['constructor'];

module.exports = DeprecatedStorageQuota;
