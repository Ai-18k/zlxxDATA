const {createError} = require("../../utility");
const cheerio = require("cheerio");

/**
 * @method generateOptions
 * @description 生成标签的属性options配置项
 * @param {{nodeName: string, nodeType: number, tagName: string, vmDom?: string}} options 配置项
 * */
function generateOptions(options) {
    let newOptions = options;
    const lowerCaseTagName = newOptions.tagName.toLowerCase();
    let tagReg = new RegExp(`^<${lowerCaseTagName}(.+)/{0,1}>.*|<${lowerCaseTagName}(.+)>.*</${lowerCaseTagName}>$`,'g');

    if (newOptions.vmDom) {
        if(tagReg.test(newOptions.vmDom)){
            const $ = cheerio.load(newOptions.vmDom);
            delete newOptions.vmDom;
            const tabAttrs = $(lowerCaseTagName)[0].attribs;
            newOptions = {
                ...newOptions,
                ...tabAttrs
            }
        }else{
            throw createError(`options字符参数格式错误，格式：<${lowerCaseTagName} id="id"></${lowerCaseTagName}>`,'TypeError');
        }
    }

    return newOptions;
}


module.exports = generateOptions;