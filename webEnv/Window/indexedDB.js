const IDBFactory = require("../IndexedDB/api/IDBFactory.js");

function createIndexedDB(){
    const indexedDB = new IDBFactory();
    return indexedDB;
}

module.exports = createIndexedDB;