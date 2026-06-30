const {setFunctionPrototype,addObjProp} = require("../../utility.js");

function OESStandardDerivatives() {
}

setFunctionPrototype(OESStandardDerivatives, () => {
    addObjProp(OESStandardDerivatives.prototype, {
        name: 'FRAGMENT_SHADER_DERIVATIVE_HINT_OES',
        value: 35723,
        configurable: false,
        writable: false
    })
})

module.exports = OESStandardDerivatives;