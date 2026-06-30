const {
    getPrivateProp,
    setPrivateProp,
    originMath
} = require("../../utility.js");

/**
 * @method createIDBRequest 创建IDBRequest请求对象
 * @param {object} transactionObj 具有transaction的对象
 * @param {object} options 配置项
 * @property {string} options.databaseName 数据库名称
 * @property {object} options.result 请求结果
 * @property {object} options[transactionError] 事务错误对象
 * @property {object} options[requestError] 请求错误对象
 * */
function createIDBRequest(transactionObj, options){
    const request = new IDBRequest(); //调用全局的IDBRequest，因存在模块的相互引入，只能调用全局
    const transaction = getPrivateProp(transactionObj, 'transaction');
    setPrivateProp(request, 'readyState', 'pending');
    setPrivateProp(request, 'source', transactionObj);
    setPrivateProp(request, 'transaction', transaction);
    setPrivateProp(request, 'result', options.result);
    setPrivateProp(request, 'databaseName', options.databaseName);
    setPrivateProp(transaction, 'error', options.transactionError);
    setPrivateProp(transaction, 'requestError', options.requestError);

    const timeStamp = originMath.random() * 2000 + 1000;
    setPrivateProp(request, 'timeStamp', timeStamp);

    return request
}

module.exports = createIDBRequest;