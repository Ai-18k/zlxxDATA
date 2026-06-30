const {
    getPrivateProp,
    updateFunToString,
    chalkLog
} = require("../../utility.js");
const Element = require("../api/Element.js");

function loadGetAttribute(){
    function getAttribute(attr) {
        const objTagName = getPrivateProp(this,'tagName');
        const attrVal = this[attr];
        chalkLog('red',`${objTagName}中getAttribute接受的值是：${attr} == ${attrVal}`);
        return attrVal;
    }
    Element.prototype.getAttribute = updateFunToString(getAttribute);
}

module.exports = loadGetAttribute;