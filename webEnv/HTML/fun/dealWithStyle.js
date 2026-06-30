const {setPrivateProp, getPrivateProp} = require("../../utility.js");
const combinationStyle = {
    border: {
        0: ['borderLeftWidth', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth'],
        1: ['borderLeftStyle', 'borderTopStyle', 'borderRightStyle', 'borderBottomStyle'],
        2: ['borderLeftColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor'],
        other: ['borderImageSource','borderImageSlice','borderImageWidth','borderImageOutset','borderImageRepeat'],
        childStyle: ['borderWidth', 'borderStyle', 'borderColor','borderImage']
    }
}

//获取样式名称连字符命名(user-name)
function getStyleName(styleName) {
    if (/-[a-zA-Z]/.test(styleName)) {
        styleName = styleName.toLowerCase().replace(/-[a-zA-Z]/g, (g) => g[1].toUpperCase());
    } else {
        //判断是否是驼峰命名，如果是驼峰命名置空styleName
        styleName = /^[a-zA-Z]+([A-Z][a-z]*)+$/.test(styleName)? '':styleName.toLowerCase();
    }
    return styleName;
}

//连字符命名(user-name)转驼峰命名(userName)
function getHumpStyleName(styleName) {
    return styleName.toLowerCase().replace(/-[a-zA-Z]/g, (g)=>g[1].toUpperCase());;
}

//驼峰命名(userName)转连字符命名(user-name)
function getHyphenName(styleName) {
    return styleName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

//处理style
function dealWithStyle(styleStr, styleObj) {
    let styleList = [];  //处理后的style
    if (styleStr) {
        setPrivateProp(styleObj,'cssText', styleStr.at(-1) !== ';'? `${styleStr};` : styleStr);
        const styleArray = styleStr.split(';').sort((a, b) => b.includes('!important') ? -1 : 1);
        styleArray.forEach((el, index) => {
            if (el) {
                //value还存在其他校验，value不同的样式需匹配不同的值。如：颜色值，只能匹配颜色，不是颜色样式不会设置成功。因涉及太多，暂时只校验!value
                let [propName, value] = el.split(':');
                const styleName = getHumpStyleName(propName);//把样式名处理成驼峰命名
                if (styleName in styleObj) {
                    if (['border'].includes(styleName)) { //处理组合样式
                        const styleArr = value.split(' ');
                        styleArr.forEach((newValue, index) => {
                            const newStyleNameArr = combinationStyle[styleName][index];
                            newStyleNameArr.forEach((newStyleName)=>{
                                if (/^\w+!important$/.test(value.replace(/\s/g, ''))) {
                                    styleObj.setProperty(newStyleName, newValue.split('!important')[0].trim(), 'important');
                                } else {
                                    styleObj.setProperty(newStyleName, newValue.trim());
                                }
                                styleList.push(`${getHyphenName(newStyleName)}:${value}`);
                            })
                        });
                        //把childStyle样式加载到style对象
                        combinationStyle[styleName].childStyle.forEach((newStyleName, index) => {
                            const newValue = styleArr[index] || 'initial';
                            if (/^\w+!important$/.test(value.replace(/\s/g, ''))) {
                                styleObj.setProperty(newStyleName, newValue.split('!important')[0].trim(), 'important');
                            } else {
                                styleObj.setProperty(newStyleName, newValue.trim());
                            }
                        });
                        //把其他相关的样式加载到style对象
                        combinationStyle[styleName].other.forEach((newStyleName) => {
                            styleObj.setProperty(newStyleName, 'initial');
                            styleList.push(`${getHyphenName(newStyleName)}:initial`);
                        });
                    } else if (['borderWidth'].includes(styleName)) { //处理一个样式代表多个样式
                        const styleOption = {
                            borderWidth: combinationStyle.border[0],
                            borderStyle: combinationStyle.border[1],
                            borderColor: combinationStyle.border[2],
                        }
                        styleOption[styleName].forEach((newStyleName, index) => {
                            if (/^\w+!important$/.test(value.replace(/\s/g, ''))) {
                                styleObj.setProperty(newStyleName, value.split('!important')[0].trim(), 'important');
                            } else {
                                styleObj.setProperty(newStyleName, value.trim());
                            }
                            styleList.push(`${getHyphenName(newStyleName)}:${value}`);
                        });
                    }else{
                        styleList.push(`${propName.toLowerCase()}:${value}`);
                    }

                    if (/^\w+!important$/.test(value.replace(/\s/g, ''))) {
                        styleObj.setProperty(styleName, value.split('!important')[0].trim(), 'important');
                    } else {
                        styleObj.setProperty(styleName, value.trim());
                    }
                }
            }
        });
    }

    return styleList.join(';');
}

// //获取组合样式如：border、border-width，非组合样式返回该样式值
// function getStyle(styleName, styleObj){
//     styleName = getHumpStyleName(styleName);
//     const originObj = getPrivateProp(styleObj, 'originObj') || styleObj;
//     let styleStr = '';
//     if (['border'].includes(styleName)) { //处理组合样式
//         const combinationStyleValue = {};
//         let styleValues = [];
//         for (let key in combinationStyle[styleName]){
//             if(key !== 'other'){
//                 combinationStyle[styleName][key].forEach((newStyleName, index)=>{
//                     if(combinationStyleValue[key]){
//                         combinationStyleValue[key].push(originObj[newStyleName]);
//                     }else{
//                         combinationStyleValue[key] = [originObj[newStyleName]]
//                     }
//                     if(index === combinationStyle[styleName][key].length - 1 ){
//                         combinationStyleValue[key] = Array.from(new Set(combinationStyleValue[key]));
//                     }
//                 });
//             }
//         }
//         for (let key in combinationStyleValue){
//             if(combinationStyleValue.length>1){
//                 styleValues = [];
//                 break;
//             }else{
//                 styleValues.push(combinationStyleValue[key][0])
//             }
//         }
//         styleStr = styleValues.join(' ');
//     } else if (['borderWidth'].includes(styleName)) { //处理一个样式代表多个样式
//         const styleOption = {
//             borderWidth: combinationStyle.border[0],
//             borderStyle: combinationStyle.border[1],
//             borderColor: combinationStyle.border[2],
//         }
//         let styleValues = [];
//         styleOption[styleName].forEach((newStyleName, index) => {
//             styleValues.push(originObj[newStyleName]);
//             if(index === styleOption[styleName].length - 1 ){
//                 styleValues = Array.from(new Set(styleValues));
//             }
//         });
//         styleStr = styleValues[0];
//     }else{
//         styleStr = originObj[styleName];
//     }
//     return styleStr;
// }
//
// function getStylePriority(styleName, styleObj){
//     styleName = getHumpStyleName(styleName);
//     const originObj = getPrivateProp(styleObj, 'originObj') || styleObj;
//     const propOption = getPrivateProp(originObj, 'propOption');
//     let priority = '';
//     if (['border'].includes(styleName)) { //处理组合样式
//         const combinationStyleValue = {};
//         let styleValues = [];
//         for (let key in combinationStyle[styleName]){
//             if(key !== 'other'){
//                 combinationStyle[styleName][key].forEach((newStyleName, index)=>{
//                     if(combinationStyleValue[key]){
//                         combinationStyleValue[key].push(propOption[newStyleName].priority);
//                     }else{
//                         combinationStyleValue[key] = [propOption[newStyleName].priority]
//                     }
//                     if(index === combinationStyle[styleName][key].length - 1 ){
//                         combinationStyleValue[key] = Array.from(new Set(combinationStyleValue[key]));
//                     }
//                 });
//             }
//         }
//         for (let key in combinationStyleValue){
//             if(combinationStyleValue.length>1){
//                 priority = '';
//                 break;
//             }else{
//                 priority = combinationStyleValue[key][0];
//             }
//         }
//     } else if (['borderWidth'].includes(styleName)) { //处理一个样式代表多个样式
//         const styleOption = {
//             borderWidth: combinationStyle.border[0],
//             borderStyle: combinationStyle.border[1],
//             borderColor: combinationStyle.border[2],
//         }
//         let styleValues = [];
//         styleOption[styleName].forEach((newStyleName, index) => {
//             styleValues.push(propOption[newStyleName].priority);
//             if(index === styleOption[styleName].length - 1 ){
//                 styleValues = Array.from(new Set(styleValues));
//             }
//         });
//         priority = styleValues[0];
//     }else{
//         priority = propOption[styleName].priority;
//     }
//     return priority;
// }
module.exports = {
    getStyleName,
    dealWithStyle
};