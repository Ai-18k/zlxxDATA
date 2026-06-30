const {
    getPrivateProp,
    addObjProp,
    setFunctionPrototype,
    setPrivateProp
} = require("../../utility.js");
const DirectoryEntry = require("./DirectoryEntry.js");


function DOMFileSystem() {}

setFunctionPrototype(DOMFileSystem, () => {
    addObjProp(DOMFileSystem.prototype, {
        name: 'name',
        get: function name() {
            return getPrivateProp(this, 'name');
        }
    });
    addObjProp(DOMFileSystem.prototype, {
        name: 'root',
        get: function root() {
            const isFile = getPrivateProp(this, 'isFile') || false;
            const isDirectory = getPrivateProp(this, 'isDirectory') || true;
            const entryName = getPrivateProp(this, 'entryName') || '';
            const fullPath = getPrivateProp(this, 'entryName') || '/';

            let directoryEntry = new DirectoryEntry();
            setPrivateProp(directoryEntry, 'isFile', isFile);
            setPrivateProp(directoryEntry, 'isDirectory', isDirectory);
            setPrivateProp(directoryEntry, 'name', entryName);
            setPrivateProp(directoryEntry, 'fullPath', fullPath);
            setPrivateProp(directoryEntry, 'filesystem', this);
            return directoryEntry;
        }
    });
});

module.exports = DOMFileSystem;