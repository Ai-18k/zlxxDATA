const Element = require("./Element.js");
const HTMLElement =require("./HTMLElement.js");
const {styleProp, CSSStyleDeclaration}  = require("./CSSStyleDeclaration.js");
const CSSNumericValue = require("./CSSNumericValue.js");
const CSSStyleValue = require("./CSSStyleValue.js");
const CSSUnitValue = require("./CSSUnitValue.js");
const StylePropertyMap = require("./StylePropertyMap.js");
const StylePropertyMapReadOnly = require("./StylePropertyMapReadOnly.js");
const NamedNodeMap = require("./NamedNodeMap.js");
const Attr = require("./Attr.js");

module.exports = {
    Element,
    HTMLElement,
    styleProp,
    CSSStyleDeclaration,
    CSSNumericValue,
    CSSStyleValue,
    CSSUnitValue,
    StylePropertyMap,
    StylePropertyMapReadOnly,
    NamedNodeMap,
    Attr
}