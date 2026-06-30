const {
    getPrivateProp,
    updateFunToString,
    chalkLog,
    originArray
} = require("../../utility.js");
const Document = require("../api/Document.js");

function loadGetElementById(){
    function getElementById(id) {
        const objTagName = getPrivateProp(this,'tagName');
        let result = null;
        let children = getPrivateProp(this,'children');
        (function dfs(nodes) {
            originArray.from(nodes).forEach((node) => {
                const nodeID = getPrivateProp(node,'id');
                const nodeChildren = getPrivateProp(node,'children');
                if (nodeID === id) {
                    result = node;
                }else if (nodeChildren?.length > 0){
                    dfs(node.children);
                }
            })
        })(children);
        chalkLog('red',`${objTagName}中getElementById接受的值是：${id} === ${result}`);
        return result;
    }
    Document.prototype.getElementById = updateFunToString(getElementById);
}

module.exports = loadGetElementById;