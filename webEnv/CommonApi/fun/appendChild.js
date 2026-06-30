const {
    envOption,
    getPrivateProp,
    updateFunToString,
    chalkLog,
    setPrivateProp,
    getOriginObj
} = require("../../utility.js");
const Node = require("../api/Node.js");

function loadAppendChild() {
    function appendChild(tag) {
        const originTag = getOriginObj(this);
        const originAppendTag = getOriginObj(tag);
        const objTagName = getPrivateProp(this,'tagName');
        const appendTagName = getPrivateProp(tag, 'tagName');
        chalkLog('red',`${objTagName}中appendChild接受的值是：${appendTagName.toLowerCase()}`);
        setPrivateProp(tag, 'parentNode', this);
        setPrivateProp(tag , 'parentElement', this);

        const childNodes = getPrivateProp(this, 'childNodes');
        const addChildNodes = getPrivateProp(childNodes, 'push');
        addChildNodes(tag);

        const children = getPrivateProp(this, 'children');
        const addChildren = getPrivateProp(children, 'push');
        addChildren(tag);

        if(originAppendTag instanceof HTMLInputElement && originTag instanceof HTMLFormElement){
            setPrivateProp(tag, 'form', this);
        }

        /**
         处理appendChild代理时日志输出异常的问题：
         由于标签下的appendChild相等，如：document.appendChild === head.appendChild，
         如果代码开始声明变量const rem = document.appendChild，此时appendChild的symbolFullName为document.appendChild
         后续代码又使用head.appendChild移除元素，此时appendChild的symbolFullName就变为head.appendChild
         然后，再使用rem移除元素，此时appendChild的symbolFullName会不一致，导致日志输出错误为head.appendChild，
         而此行代码则是更新symbolFullName使其与调用的对象保持一致
         * **/
        const symbolFullName = getPrivateProp(this, envOption.symbolFullName);
        if(symbolFullName) setPrivateProp(appendChild, envOption.symbolFullName, `${symbolFullName}.appendChild`);

        return tag
    }


    Node.prototype.appendChild = updateFunToString(appendChild);
}

module.exports = loadAppendChild;