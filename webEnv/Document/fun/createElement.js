const {
    getPrivateProp,
    updateFunToString,
    chalkLog
} = require("../../utility.js");
const Document = require("../api/Document.js");

function loadCreateElement(){
    function createElement(tagName) {
        const objTagName = getPrivateProp(this,'tagName');
        const selfCreateElement = getPrivateProp(this,'createElement');
        if(!selfCreateElement){
            throw new Error(`${objTagName}中createElement不存在，请配置createElement`);
        }else{
            chalkLog('red',`${objTagName}中createElement接受的值是：${tagName}`);
            return selfCreateElement(tagName);
        }
    }
    Document.prototype.createElement = updateFunToString(createElement);
}

module.exports = loadCreateElement;