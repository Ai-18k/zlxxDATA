const {createError, getPrivateProp} = require("../../utility.js");
const getDBInfo = require("./getDBInfo.js");

function isTransactionExit(obj, funName) {
    const {dbs, db, transaction, databaseName} = getDBInfo(obj);
    if (!transaction) {
        if (['createIndex', 'deleteIndex'].includes(funName)) {
            throw createError("Failed to execute 'transaction' on 'IDBDatabase': One of the specified object stores was not found.", 'NotFoundError');
        } else if (['createObjectStore','deleteObjectStore'].includes(funName)) {
            throw createError(`Failed to execute '${funName}' on 'IDBDatabase': The database is not running a version change transaction.`, 'InvalidStateError');
        }else{
            throw createError(`Failed to execute '${funName}' on 'IDBObjectStore': The transaction has finished.`, 'TransactionInactiveError');
        }
    } else{

    }

    return {
        dbs,
        databaseName,
        transaction,
        db
    };
}

module.exports = isTransactionExit;