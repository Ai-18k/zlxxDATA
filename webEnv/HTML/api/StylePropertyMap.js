const {
    getPrivateProp,
    setPrivateProp,
    setFunctionPrototype,
    addObjProp,
    originObject
} = require("../../utility.js");
const StylePropertyMapReadOnly = require("./StylePropertyMapReadOnly.js");

function StylePropertyMap(style = undefined) {
    if (style || style === '') {
        const styleList = style.replace(/!important/g, '').split(';');
        setPrivateProp(this, 'styleList', styleList);
        setPrivateProp(this, 'size', styleList.length || 0);
    }
}

setFunctionPrototype(StylePropertyMap, () => {
    addObjProp(StylePropertyMap.prototype, {name: 'append'});
    addObjProp(StylePropertyMap.prototype, {
        name: 'clear',
        value: function clear() {
            const tag = getPrivateProp(this, 'tag');
            const tagStyle = getPrivateProp(tag, 'style');
            originObject.keys(tagStyle).forEach((styleName) => {
                if (/\d+/.test(styleName)) {
                    delete tagStyle[styleName];
                } else {
                    tagStyle [styleName] = '';
                }
            });
            setPrivateProp(tag, 'style', tagStyle);
        }
    });
    addObjProp(StylePropertyMap.prototype, {name: 'delete'});
    addObjProp(StylePropertyMap.prototype, {name: 'set'});
}, StylePropertyMapReadOnly);

module.exports = StylePropertyMap