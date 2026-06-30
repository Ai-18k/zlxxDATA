const {getPrivateProp, getOriginObj,envOption} = require("../../utility.js");

function getDBInfo(obj) {
    const dbs = getPrivateProp(indexedDB, 'dbs');
    let databaseName = getPrivateProp(obj, 'databaseName');
    let version = getPrivateProp(obj, 'version');
    const transaction = getPrivateProp(obj, 'transaction');
    const originObj = getOriginObj(obj);
    if(originObj instanceof IDBDatabase) {
        databaseName = getPrivateProp(obj, 'name');
    }
    const db = dbs[databaseName];

    return {
        dbs,
        databaseName,
        transaction,
        version,
        db: dbs[databaseName],
        oldVersion: db.oldVersion,
    }
}

module.exports = getDBInfo;