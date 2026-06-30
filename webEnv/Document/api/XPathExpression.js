const {
    setFunctionPrototype,
    addObjProp
} = require("../../utility.js");

function XPathExpression(){}

setFunctionPrototype(XPathExpression,()=>{
    addObjProp(XPathExpression.prototype,{
        name: "evaluate",
        value: function evaluate() {}
    })
});

module.exports = XPathExpression;