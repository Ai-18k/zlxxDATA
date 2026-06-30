const {
    getPrivateProp,
    setPrivateProp,
    setFunctionPrototype,
    addObjProp
} = require("../../utility.js");
const {getStyleName} = require("../fun/dealWithStyle.js");
const CSSStyleValue = require("./CSSStyleValue.js");
const CSSUnitValue = require("./CSSUnitValue.js");

function getQueryResult(obj, styleName) {
    const tag = getPrivateProp(obj, 'tag');
    const tagStyle = getPrivateProp(tag, 'style');
    let value = tagStyle[getStyleName(styleName)];
    if (/px|rpx|rem|em|vh|vw|vmax|vmin|ch|ex|cm|mm|in|pt|pc$/.test(value)) {
        const cssUnitValue = new CSSUnitValue(value, styleName);
        const unit = value.match(/px|rpx|rem|em|vh|vw|vmax|vmin|ch|ex|cm|mm|in|pt|pc$/)[0];
        setPrivateProp(cssUnitValue, 'unit', unit);
        setPrivateProp(cssUnitValue, 'value', value);
        return cssUnitValue;
    } else {
        const cssStyleValue = new CSSStyleValue(value);
        setPrivateProp(cssStyleValue, 'value', value);
        return cssStyleValue;
    }
}

function StylePropertyMapReadOnly() {
}

setFunctionPrototype(StylePropertyMapReadOnly, () => {
    addObjProp(StylePropertyMapReadOnly.prototype, {
        name: 'size',
        get: function size() {
            return getPrivateProp(this, 'size');
        }
    });
    addObjProp(StylePropertyMapReadOnly.prototype, {
        name: 'get',
        value: function get(name) {
            return getQueryResult(this, name);
        }
    });
    addObjProp(StylePropertyMapReadOnly.prototype, {
        name: 'getAll',
        value: function getAll(name) {
            return [getQueryResult(this, name)];
        }
    });
    addObjProp(StylePropertyMapReadOnly.prototype, {
        name: 'has',
        value: function has(name) {
            name = getStyleName(name);
            const tag = getPrivateProp(this, 'tag');
            const tagStyle = getPrivateProp(tag, 'style');

            return !!tagStyle[name];
        }
    });
    addObjProp(StylePropertyMapReadOnly.prototype, {
        name: 'entries',
        value: function entries() {
            const styleList = getPrivateProp(this, 'styleList');
            let index = 0;
            const itemList = styleList[index++]?.split(':');
            const value = [itemList[0], [getQueryResult(this, itemList[0])]]
            return {
                next: () => {
                    return {
                        value: value,
                        done: index > styleList.length
                    };
                }
            };
        }
    });
    addObjProp(StylePropertyMapReadOnly.prototype, {
        name: 'forEach',
        value: function forEach(callback) {
            const styleList = getPrivateProp(this, 'styleList');
            for (let i = 0; i < styleList.length; i++) {
                const itemList = styleList[i].split(':');
                const name = itemList[0];
                callback([getQueryResult(this, name)], name, this);
            }
        }
    });
    addObjProp(StylePropertyMapReadOnly.prototype, {
        name: 'keys',
        value: function keys() {
            const styleList = getPrivateProp(this, 'styleList');
            let index = 0;
            return {
                next: () => {
                    return {
                        value: styleList[index++]?.split(':')[0],
                        done: index > styleList.length
                    };
                }
            };
        }
    });
    addObjProp(StylePropertyMapReadOnly.prototype, {
        name: 'values',
        value: function values() {
            const styleList = getPrivateProp(this, 'styleList');
            let index = 0;
            const itemList = styleList[index++]?.split(':');
            const value = [getQueryResult(this, itemList[0])]

            return {
                next: () => {
                    return {
                        value: value,
                        done: index > styleList.length
                    };
                }
            };
        }
    });
});

addObjProp(StylePropertyMapReadOnly.prototype, {
    name: Symbol.iterator,
    value: function entries() {
    },
    enumerable: false
});

module.exports = StylePropertyMapReadOnly;