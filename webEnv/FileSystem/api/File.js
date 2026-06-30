const {
    addObjProp,
    getPrivateProp,
    setFunctionPrototype
} = require("../../utility.js");
const Blob = require("./Blob.js");
const {setPrivateProp} = require("../../utility");

function File(fileParts, fileName) {
    setPrivateProp(this, 'name', fileName);
    setPrivateProp(this, 'type', '');
    setPrivateProp(this, 'webkitRelativePath', '');
    setPrivateProp(this, 'size', 0);

    const lastModifiedDate = new Date();
    setPrivateProp(this, 'lastModifiedDate', lastModifiedDate);
    setPrivateProp(this, 'lastModified', lastModifiedDate.getTime());
}

setFunctionPrototype(File, () => {
    addObjProp(File.prototype, {
        name: 'name',
        get: function name() {
            return getPrivateProp(this, 'name');
        }
    });
    addObjProp(File.prototype, {
        name: 'lastModified',
        get: function lastModifie() {
            return getPrivateProp(this, 'lastModified');
        }
    });
    addObjProp(File.prototype, {
        name: 'lastModifiedDate',
        get: function lastModifiedDate() {
            return getPrivateProp(this, 'lastModifiedDate');
        }
    });
    addObjProp(File.prototype, {
        name: 'webkitRelativePath',
        get: function webkitRelativePath() {
            return getPrivateProp(this, 'webkitRelativePath');
        }
    });
}, Blob);

module.exports = File;
