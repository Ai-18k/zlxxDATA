const {
    getPrivateProp,
    setPrivateProp,
    setFunctionPrototype,
    addObjProp,
    chalkLog,
    getOriginObj
} = require("../../utility.js");

function MutationObserver(callback) {
    if (callback) {
        setPrivateProp(this, "callback", callback);
    }
}

setFunctionPrototype(MutationObserver, () => {
    addObjProp(MutationObserver.prototype, {name: "disconnect"});
    addObjProp(MutationObserver.prototype, {
        name: "observe",
        value: function observe(target, options) {
            const tagName = getPrivateProp(target, "tagName");
            chalkLog('red', `${tagName}已经进行MutationObserver监听，监听事件已收集，可使用getPrivateProp(tag, "observe")查看相关事件。调用回调函数时需使用call(obj,arg1,...)否则this指向有问题`);
            const originTag = getOriginObj(target);
            setPrivateProp(originTag, 'observe', {
                callback: getPrivateProp(this, "callback"),
                // options: options,
                obj: this
            })
        }
    });
    addObjProp(MutationObserver.prototype, {name: "takeRecords"});
});

module.exports = MutationObserver;