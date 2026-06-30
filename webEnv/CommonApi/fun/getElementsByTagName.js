const {
    getPrivateProp,
    chalkLog,
    envOption,
    originArray
} = require("../../utility.js");
const HTMLCollection = require("../../Document/api/HTMLCollection.js");

function getElementsByTagName(tag, tagName) {
    const objTagName = getPrivateProp(tag, 'tagName');
    let result = new HTMLCollection([]);
    let addResult = getPrivateProp(result, 'push');
    let children = getPrivateProp(tag, 'children');
    (function dfs(nodes) {
        originArray.from(nodes).forEach((node) => {
            const nodeTagName = getPrivateProp(node, 'tagName');
            const nodeChildren = getPrivateProp(node, 'children');
            if (nodeTagName === tagName.toUpperCase()) {
                addResult(node);
            }
            if (nodeChildren?.length > 0) {
                dfs(node.children);
            }
        })
    })(children);
    chalkLog('red', `${objTagName}中getElementsByTagName接受的值是：${tagName} === ${result}，length === ${result.length}`);
    /**
     如果envOption.getElementsByTagName存在，则只有在envOption.getElementsByTagName中的元素才会被返回
     envOption.getElementsByTagName会在loadFun配置中自动生成
     如果需要调试获取元素后的其他错误，则loadFun配置数组即可
     * */
    if (!envOption.getElementsByTagName || envOption.getElementsByTagName.includes(tagName.toLowerCase())) {
        return result;
    } else {
        chalkLog('red', '为了方便调试获取元素后的其他错误，只有在envOption.getElementsByTagName配置的元素才会被返回')
        return undefined;
    }
}

module.exports = getElementsByTagName;