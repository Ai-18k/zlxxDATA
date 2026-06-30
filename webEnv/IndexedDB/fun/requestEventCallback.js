const {
    getPrivateProp,
    setPrivateProp,
    addObjProp,
    getOriginObj,
    originSetTimeout,
    originMath
} = require("../../utility.js");
const Event = require("../../CommonApi/api/Event.js");

function requestEventCallback(obj, callback, eventType) {

    let events = new Event();
    const openTimeStamp = getPrivateProp(obj, 'timeStamp');
    const timeStamp = originMath.random() * 2000 + 1000;
    setPrivateProp(events, 'type', 'success');
    setPrivateProp(events, 'currentTarget', obj);
    setPrivateProp(events, 'bubbles', false);
    setPrivateProp(events, 'cancelBubble', false);
    setPrivateProp(events, 'cancelable', false);
    setPrivateProp(events, 'composed', false);
    setPrivateProp(events, 'defaultPrevented', false);
    setPrivateProp(events, 'eventPhase', 2);
    setPrivateProp(events, 'srcElement', obj);
    setPrivateProp(events, 'target', obj);
    setPrivateProp(events, 'returnValue', true);
    setPrivateProp(events, 'timeStamp', openTimeStamp + timeStamp);

    addObjProp(events, {
        name: 'isTrusted',
        configurable: false,
        get: function isTrusted() {
            return true
        }
    });

    //模拟数据库打开成功时间
    originSetTimeout(() => {
        setPrivateProp(obj, 'readyState', 'done');

        const transaction = getPrivateProp(obj, 'transaction');
        const transactionError = getPrivateProp(transaction, 'error');
        const requestError = getPrivateProp(transaction, 'requestError');
        const originObj = getOriginObj(obj);
        if (transactionError || requestError) {
            setPrivateProp(obj, 'result', undefined);
            if(originObj instanceof IDBOpenDBRequest){
                setPrivateProp(obj, 'transaction', null);
                setPrivateProp(obj, 'source', null);
            }
            if (!requestError) {
                setPrivateProp(obj, 'error', transactionError);
                setPrivateProp(transaction, 'error', null);
            } else {
                setPrivateProp(obj, 'error', requestError);
            }
        }

        if (getPrivateProp(obj, 'error')) {
            if (eventType === 'error') callback(events);
            return;
        }

        if (!(originObj instanceof IDBOpenDBRequest)) {
            setPrivateProp(obj, 'result', getPrivateProp(obj, 'result'));
        } else {
            const database = getPrivateProp(obj, 'result');
            const objStore = getPrivateProp(database,'objStore');
            const indexes = getPrivateProp(objStore,'indexes');

            setPrivateProp(database, 'transaction', null);
            setPrivateProp(obj, 'transaction', null);
            /**
             当数据库存在时，连续打开数据库objStore、indexes不一定存在，
             indexes只会在数据库新建或者更新时createIndex中生成
             objStore只会在数据库新建或者更新时createObjectStore中生成
             * **/
            if(objStore) setPrivateProp(objStore, 'transaction', null);
            if(indexes && indexes.length > 0 ){
                indexes.forEach(index => {
                    setPrivateProp(index,'transaction', null);
                });
            }
        }
        if (eventType === 'success') callback(events);
    })
}

module.exports = requestEventCallback;