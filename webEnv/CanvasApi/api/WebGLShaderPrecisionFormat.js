const {
    setFunctionPrototype,
    addObjProp,
    getPrivateProp
} = require("../../utility.js");

function WebGLShaderPrecisionFormat() {
}

setFunctionPrototype(WebGLShaderPrecisionFormat,()=>{
    addObjProp(WebGLShaderPrecisionFormat.prototype,{
        name: 'rangeMin',
        get: function rangeMin(){
            return getPrivateProp(this,'rangeMin');
        }
    });
    addObjProp(WebGLShaderPrecisionFormat.prototype,{
        name: 'rangeMax',
        get: function rangeMax (){
            return getPrivateProp(this,'rangeMax');
        }
    });
    addObjProp(WebGLShaderPrecisionFormat.prototype,{
        name: 'precision',
        get: function precision (){
            return getPrivateProp(this,'precision');
        }
    });
})

module.exports = WebGLShaderPrecisionFormat;