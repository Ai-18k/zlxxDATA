const {
    envOption,
    getPrivateProp,
    updateFunToString,
    setPrivateProp,
    chalkLog,
    getOriginObj
} = require("../../utility.js");
const Node = require("../api/Node.js");

function loadAppendChild() {
    function removeChild(tag) {
        const objTagName = getPrivateProp(this, 'tagName');
        const removeTagName = getPrivateProp(tag, 'tagName');
        chalkLog('red', `${objTagName}中removeChild接受的值是：${removeTagName.toLowerCase()}`);

        setPrivateProp(tag, 'parentNode', null);

        setPrivateProp(tag , 'parentElement', null);
        const childNodes = getPrivateProp(this, 'childNodes');
        const deleteChildNodes = getPrivateProp(childNodes, 'delete');
        deleteChildNodes(tag);

        const children = getPrivateProp(this, 'children');
        const deleteChildren = getPrivateProp(children, 'delete');
        deleteChildren(tag);

        /**
         处理removeChild代理时日志输出异常的问题：
         由于标签下的removeChild相等，如：document.removeChild === head.removeChild，
         如果代码开始声明变量const rem = document.removeChild，此时removeChild的symbolFullName为document.removeChild
         后续代码又使用head.removeChild移除元素，此时removeChild的symbolFullName就变为head.removeChild
         然后，再使用rem移除元素，此时removeChild的symbolFullName会不一致，导致日志输出错误为head.removeChild，
         而此行代码则是更新symbolFullName使其与调用的对象保持一致
         * **/
        const symbolFullName = getPrivateProp(this, envOption.symbolFullName);
        if(symbolFullName) setPrivateProp(removeChild, envOption.symbolFullName, `${symbolFullName}.removeChild`);
        return tag;
    }

    Node.prototype.removeChild = updateFunToString(removeChild);
}

module.exports = loadAppendChild;