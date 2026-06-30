const {getPrivateProp, originArray} = require("../../utility.js");
const RadioNodeList = require("../api/RadioNodeList.js");

/**
 * @method queryFormProp 查询表单属性值
 * @param { object } formTag form标签
 * @param propName 表单属性名
 * @description 查询表单某个属性值时可能是从子元素中的name属性上查找出的集合，如：action，会存在以下三种情况
 1、form子元素中的表单元素name值无action，则返回form原本的属性值
 2、form子元素中的表单元素name值有action，则返回该元素
 3、form子元素中的表单元素name值有多个action，则返回元素集合对象RadioNodeList
 * */
function queryFormProp(formTag, propName) {
    let children = getPrivateProp(formTag, 'children');
    let propValueList = [];
    (function dfs(nodes) {
        originArray.from(nodes).forEach((node) => {
            const nodeTagName = getPrivateProp(node, 'tagName');
            const nodeTagId = getPrivateProp(node, 'id');
            const namePropValue = getPrivateProp(node, 'name');
            const nodeChildren = getPrivateProp(node, 'children');
            if (['INPUT', 'SELECT', 'FIELDSET', 'BUTTON', 'TEXTAREA', 'OUTPUT'].includes(nodeTagName) && [namePropValue, nodeTagId].includes(propName)) {
                propValueList.push(node);
            }
            if (nodeChildren?.length > 0) {
                dfs(node.children);
            }
        })
    })(children);

    let propValue = getPrivateProp(formTag, propName);
    if (propValueList.length > 0) {
        propValue = propValueList.length === 1 ? propValueList[0] : new RadioNodeList(propValueList);
    }
    return propValue;
}

module.exports = queryFormProp;