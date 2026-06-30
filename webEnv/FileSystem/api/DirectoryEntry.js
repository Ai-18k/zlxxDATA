const {
    setFunctionPrototype,
    addObjProp
} = require("../../utility.js");

const Entry = require("./Entry.js");

function DirectoryEntry() {}

setFunctionPrototype(DirectoryEntry, () => {
    addObjProp(DirectoryEntry.prototype, {name: 'createReader'});
    addObjProp(DirectoryEntry.prototype, {name: 'getDirectory'});
    addObjProp(DirectoryEntry.prototype, {name: 'getFile'});
    addObjProp(DirectoryEntry.prototype, {name: 'removeRecursively'});
}, Entry);

module.exports = DirectoryEntry
