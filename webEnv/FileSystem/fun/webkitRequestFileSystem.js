const {
    setPrivateProp,
    chalkLog,
    getPrivateProp
} = require("../../utility.js");

function webkitRequestFileSystem(type, size, successCallback, errorCallback = undefined) {
    const tagName = getPrivateProp(this, 'tagName');
    chalkLog('red', `${tagName}的webkitRequestFileSystem已收集，可使用getPrivateProp(obj, "events")查看相关配置，obj为收集的对象。调用回调函数时需使用call(window,arg1,...)否则this指向有问题`);
    setPrivateProp(this,'webkitRequestFileSystem' ,{
        type,
        size,
        successCallback,
        errorCallback
    })
}

module.exports = webkitRequestFileSystem;