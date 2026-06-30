const {setPrivateProp} = require("../../utility");
const WebGLShaderPrecisionFormat = require("../api/WebGLShaderPrecisionFormat");

function getShaderPrecisionFormat(shaderType, precisionType) {
    const name = `${shaderType},${precisionType}`;
    const webGLShaderPrecisionFormat = new WebGLShaderPrecisionFormat();
    let formatOption = {
        rangeMin: '',
        rangeMax: '',
        precision: ''
    };
    //数组中的数字应该与staticProp对应
    if([
        '35633,36338','35633,36337','35633,36336',
        '35632,36338','35632,36337','35632,36336',
    ].includes(name)){
        formatOption = {
            rangeMin: 127,
            rangeMax: 127,
            precision: 23
        };
    }else if([
        '35633,36341','35633,36340','35633,36339',
        '35632,36341','35632,36340','35632,36339',
    ].includes(name)){
        formatOption = {
            rangeMin: 31,
            rangeMax: 30,
            precision: 0
        };
    }
    setPrivateProp(webGLShaderPrecisionFormat,'rangeMin',formatOption.rangeMin);
    setPrivateProp(webGLShaderPrecisionFormat,'rangeMax',formatOption.rangeMax);
    setPrivateProp(webGLShaderPrecisionFormat,'precision',formatOption.precision);
    return webGLShaderPrecisionFormat;
}

module.exports = getShaderPrecisionFormat;