const {
    setFunctionPrototype,
    addObjProp,
    getPrivateProp,
    setPrivateProp
} = require("../../utility.js");
const {getStyleName} = require("../fun/dealWithStyle.js");
const styleProp = {
    enumProp: ["accentColor", "additiveSymbols", "alignContent", "alignItems", "alignSelf", "alignmentBaseline", "all", "anchorName", "anchorScope", "animation", "animationComposition", "animationDelay", "animationDirection", "animationDuration", "animationFillMode", "animationIterationCount", "animationName", "animationPlayState", "animationRange", "animationRangeEnd", "animationRangeStart", "animationTimeline", "animationTimingFunction", "appRegion", "appearance", "ascentOverride", "aspectRatio", "backdropFilter", "backfaceVisibility", "background", "backgroundAttachment", "backgroundBlendMode", "backgroundClip", "backgroundColor", "backgroundImage", "backgroundOrigin", "backgroundPosition", "backgroundPositionX", "backgroundPositionY", "backgroundRepeat", "backgroundSize", "basePalette", "baselineShift", "baselineSource", "blockSize", "border", "borderBlock", "borderBlockColor", "borderBlockEnd", "borderBlockEndColor", "borderBlockEndStyle", "borderBlockEndWidth", "borderBlockStart", "borderBlockStartColor", "borderBlockStartStyle", "borderBlockStartWidth", "borderBlockStyle", "borderBlockWidth", "borderBottom", "borderBottomColor", "borderBottomLeftRadius", "borderBottomRightRadius", "borderBottomStyle", "borderBottomWidth", "borderCollapse", "borderColor", "borderEndEndRadius", "borderEndStartRadius", "borderImage", "borderImageOutset", "borderImageRepeat", "borderImageSlice", "borderImageSource", "borderImageWidth", "borderInline", "borderInlineColor", "borderInlineEnd", "borderInlineEndColor", "borderInlineEndStyle", "borderInlineEndWidth", "borderInlineStart", "borderInlineStartColor", "borderInlineStartStyle", "borderInlineStartWidth", "borderInlineStyle", "borderInlineWidth", "borderLeft", "borderLeftColor", "borderLeftStyle", "borderLeftWidth", "borderRadius", "borderRight", "borderRightColor", "borderRightStyle", "borderRightWidth", "borderSpacing", "borderStartEndRadius", "borderStartStartRadius", "borderStyle", "borderTop", "borderTopColor", "borderTopLeftRadius", "borderTopRightRadius", "borderTopStyle", "borderTopWidth", "borderWidth", "bottom", "boxDecorationBreak", "boxShadow", "boxSizing", "breakAfter", "breakBefore", "breakInside", "bufferedRendering", "captionSide", "caretColor", "clear", "clip", "clipPath", "clipRule", "color", "colorInterpolation", "colorInterpolationFilters", "colorRendering", "colorScheme", "columnCount", "columnFill", "columnGap", "columnRule", "columnRuleColor", "columnRuleStyle", "columnRuleWidth", "columnSpan", "columnWidth", "columns", "contain", "containIntrinsicBlockSize", "containIntrinsicHeight", "containIntrinsicInlineSize", "containIntrinsicSize", "containIntrinsicWidth", "container", "containerName", "containerType", "content", "contentVisibility", "counterIncrement", "counterReset", "counterSet", "cursor", "cx", "cy", "d", "descentOverride", "direction", "display", "dominantBaseline", "emptyCells", "fallback", "fieldSizing", "fill", "fillOpacity", "fillRule", "filter", "flex", "flexBasis", "flexDirection", "flexFlow", "flexGrow", "flexShrink", "flexWrap", "float", "floodColor", "floodOpacity", "font", "fontDisplay", "fontFamily", "fontFeatureSettings", "fontKerning", "fontOpticalSizing", "fontPalette", "fontSize", "fontSizeAdjust", "fontStretch", "fontStyle", "fontSynthesis", "fontSynthesisSmallCaps", "fontSynthesisStyle", "fontSynthesisWeight", "fontVariant", "fontVariantAlternates", "fontVariantCaps", "fontVariantEastAsian", "fontVariantEmoji", "fontVariantLigatures", "fontVariantNumeric", "fontVariantPosition", "fontVariationSettings", "fontWeight", "forcedColorAdjust", "gap", "grid", "gridArea", "gridAutoColumns", "gridAutoFlow", "gridAutoRows", "gridColumn", "gridColumnEnd", "gridColumnGap", "gridColumnStart", "gridGap", "gridRow", "gridRowEnd", "gridRowGap", "gridRowStart", "gridTemplate", "gridTemplateAreas", "gridTemplateColumns", "gridTemplateRows", "height", "hyphenateCharacter", "hyphenateLimitChars", "hyphens", "imageOrientation", "imageRendering", "inherits", "initialLetter", "initialValue", "inlineSize", "inset", "insetBlock", "insetBlockEnd", "insetBlockStart", "insetInline", "insetInlineEnd", "insetInlineStart", "interpolateSize", "isolation", "justifyContent", "justifyItems", "justifySelf", "left", "letterSpacing", "lightingColor", "lineBreak", "lineGapOverride", "lineHeight", "listStyle", "listStyleImage", "listStylePosition", "listStyleType", "margin", "marginBlock", "marginBlockEnd", "marginBlockStart", "marginBottom", "marginInline", "marginInlineEnd", "marginInlineStart", "marginLeft", "marginRight", "marginTop", "marker", "markerEnd", "markerMid", "markerStart", "mask", "maskClip", "maskComposite", "maskImage", "maskMode", "maskOrigin", "maskPosition", "maskRepeat", "maskSize", "maskType", "mathDepth", "mathShift", "mathStyle", "maxBlockSize", "maxHeight", "maxInlineSize", "maxWidth", "minBlockSize", "minHeight", "minInlineSize", "minWidth", "mixBlendMode", "navigation", "negative", "objectFit", "objectPosition", "objectViewBox", "offset", "offsetAnchor", "offsetDistance", "offsetPath", "offsetPosition", "offsetRotate", "opacity", "order", "orphans", "outline", "outlineColor", "outlineOffset", "outlineStyle", "outlineWidth", "overflow", "overflowAnchor", "overflowClipMargin", "overflowWrap", "overflowX", "overflowY", "overlay", "overrideColors", "overscrollBehavior", "overscrollBehaviorBlock", "overscrollBehaviorInline", "overscrollBehaviorX", "overscrollBehaviorY", "pad", "padding", "paddingBlock", "paddingBlockEnd", "paddingBlockStart", "paddingBottom", "paddingInline", "paddingInlineEnd", "paddingInlineStart", "paddingLeft", "paddingRight", "paddingTop", "page", "pageBreakAfter", "pageBreakBefore", "pageBreakInside", "pageOrientation", "paintOrder", "perspective", "perspectiveOrigin", "placeContent", "placeItems", "placeSelf", "pointerEvents", "position", "positionAnchor", "positionArea", "positionTry", "positionTryFallbacks", "positionTryOrder", "positionVisibility", "prefix", "quotes", "r", "range", "resize", "right", "rotate", "rowGap", "rubyAlign", "rubyPosition", "rx", "ry", "scale", "scrollBehavior", "scrollMargin", "scrollMarginBlock", "scrollMarginBlockEnd", "scrollMarginBlockStart", "scrollMarginBottom", "scrollMarginInline", "scrollMarginInlineEnd", "scrollMarginInlineStart", "scrollMarginLeft", "scrollMarginRight", "scrollMarginTop", "scrollPadding", "scrollPaddingBlock", "scrollPaddingBlockEnd", "scrollPaddingBlockStart", "scrollPaddingBottom", "scrollPaddingInline", "scrollPaddingInlineEnd", "scrollPaddingInlineStart", "scrollPaddingLeft", "scrollPaddingRight", "scrollPaddingTop", "scrollSnapAlign", "scrollSnapStop", "scrollSnapType", "scrollTimeline", "scrollTimelineAxis", "scrollTimelineName", "scrollbarColor", "scrollbarGutter", "scrollbarWidth", "shapeImageThreshold", "shapeMargin", "shapeOutside", "shapeRendering", "size", "sizeAdjust", "speak", "speakAs", "src", "stopColor", "stopOpacity", "stroke", "strokeDasharray", "strokeDashoffset", "strokeLinecap", "strokeLinejoin", "strokeMiterlimit", "strokeOpacity", "strokeWidth", "suffix", "symbols", "syntax", "system", "tabSize", "tableLayout", "textAlign", "textAlignLast", "textAnchor", "textCombineUpright", "textDecoration", "textDecorationColor", "textDecorationLine", "textDecorationSkipInk", "textDecorationStyle", "textDecorationThickness", "textEmphasis", "textEmphasisColor", "textEmphasisPosition", "textEmphasisStyle", "textIndent", "textOrientation", "textOverflow", "textRendering", "textShadow", "textSizeAdjust", "textSpacingTrim", "textTransform", "textUnderlineOffset", "textUnderlinePosition", "textWrap", "textWrapMode", "textWrapStyle", "timelineScope", "top", "touchAction", "transform", "transformBox", "transformOrigin", "transformStyle", "transition", "transitionBehavior", "transitionDelay", "transitionDuration", "transitionProperty", "transitionTimingFunction", "translate", "types", "unicodeBidi", "unicodeRange", "userSelect", "vectorEffect", "verticalAlign", "viewTimeline", "viewTimelineAxis", "viewTimelineInset", "viewTimelineName", "viewTransitionClass", "viewTransitionName", "visibility", "webkitAlignContent", "webkitAlignItems", "webkitAlignSelf", "webkitAnimation", "webkitAnimationDelay", "webkitAnimationDirection", "webkitAnimationDuration", "webkitAnimationFillMode", "webkitAnimationIterationCount", "webkitAnimationName", "webkitAnimationPlayState", "webkitAnimationTimingFunction", "webkitAppRegion", "webkitAppearance", "webkitBackfaceVisibility", "webkitBackgroundClip", "webkitBackgroundOrigin", "webkitBackgroundSize", "webkitBorderAfter", "webkitBorderAfterColor", "webkitBorderAfterStyle", "webkitBorderAfterWidth", "webkitBorderBefore", "webkitBorderBeforeColor", "webkitBorderBeforeStyle", "webkitBorderBeforeWidth", "webkitBorderBottomLeftRadius", "webkitBorderBottomRightRadius", "webkitBorderEnd", "webkitBorderEndColor", "webkitBorderEndStyle", "webkitBorderEndWidth", "webkitBorderHorizontalSpacing", "webkitBorderImage", "webkitBorderRadius", "webkitBorderStart", "webkitBorderStartColor", "webkitBorderStartStyle", "webkitBorderStartWidth", "webkitBorderTopLeftRadius", "webkitBorderTopRightRadius", "webkitBorderVerticalSpacing", "webkitBoxAlign", "webkitBoxDecorationBreak", "webkitBoxDirection", "webkitBoxFlex", "webkitBoxOrdinalGroup", "webkitBoxOrient", "webkitBoxPack", "webkitBoxReflect", "webkitBoxShadow", "webkitBoxSizing", "webkitClipPath", "webkitColumnBreakAfter", "webkitColumnBreakBefore", "webkitColumnBreakInside", "webkitColumnCount", "webkitColumnGap", "webkitColumnRule", "webkitColumnRuleColor", "webkitColumnRuleStyle", "webkitColumnRuleWidth", "webkitColumnSpan", "webkitColumnWidth", "webkitColumns", "webkitFilter", "webkitFlex", "webkitFlexBasis", "webkitFlexDirection", "webkitFlexFlow", "webkitFlexGrow", "webkitFlexShrink", "webkitFlexWrap", "webkitFontFeatureSettings", "webkitFontSmoothing", "webkitHyphenateCharacter", "webkitJustifyContent", "webkitLineBreak", "webkitLineClamp", "webkitLocale", "webkitLogicalHeight", "webkitLogicalWidth", "webkitMarginAfter", "webkitMarginBefore", "webkitMarginEnd", "webkitMarginStart", "webkitMask", "webkitMaskBoxImage", "webkitMaskBoxImageOutset", "webkitMaskBoxImageRepeat", "webkitMaskBoxImageSlice", "webkitMaskBoxImageSource", "webkitMaskBoxImageWidth", "webkitMaskClip", "webkitMaskComposite", "webkitMaskImage", "webkitMaskOrigin", "webkitMaskPosition", "webkitMaskPositionX", "webkitMaskPositionY", "webkitMaskRepeat", "webkitMaskSize", "webkitMaxLogicalHeight", "webkitMaxLogicalWidth", "webkitMinLogicalHeight", "webkitMinLogicalWidth", "webkitOpacity", "webkitOrder", "webkitPaddingAfter", "webkitPaddingBefore", "webkitPaddingEnd", "webkitPaddingStart", "webkitPerspective", "webkitPerspectiveOrigin", "webkitPerspectiveOriginX", "webkitPerspectiveOriginY", "webkitPrintColorAdjust", "webkitRtlOrdering", "webkitRubyPosition", "webkitShapeImageThreshold", "webkitShapeMargin", "webkitShapeOutside", "webkitTapHighlightColor", "webkitTextCombine", "webkitTextDecorationsInEffect", "webkitTextEmphasis", "webkitTextEmphasisColor", "webkitTextEmphasisPosition", "webkitTextEmphasisStyle", "webkitTextFillColor", "webkitTextOrientation", "webkitTextSecurity", "webkitTextSizeAdjust", "webkitTextStroke", "webkitTextStrokeColor", "webkitTextStrokeWidth", "webkitTransform", "webkitTransformOrigin", "webkitTransformOriginX", "webkitTransformOriginY", "webkitTransformOriginZ", "webkitTransformStyle", "webkitTransition", "webkitTransitionDelay", "webkitTransitionDuration", "webkitTransitionProperty", "webkitTransitionTimingFunction", "webkitUserDrag", "webkitUserModify", "webkitUserSelect", "webkitWritingMode", "whiteSpace", "whiteSpaceCollapse", "widows", "width", "willChange", "wordBreak", "wordSpacing", "wordWrap", "writingMode", "x", "y", "zIndex", "zoom"],
    notEnumProp: ["epubCaptionSide", "epubTextCombine", "epubTextEmphasis", "epubTextEmphasisColor", "epubTextEmphasisStyle", "epubTextOrientation", "epubTextTransform", "epubWordBreak", "epubWritingMode"]
}

function CSSStyleDeclaration() {
    setPrivateProp(this, 'cssText', '');
    setPrivateProp(this, 'cssFloat', '');
    setPrivateProp(this, 'length', 0); //每次设置属性时长度会加1
    setPrivateProp(this, 'propOption', {}); //设置样式后的属性配置
}

setFunctionPrototype(CSSStyleDeclaration, () => {
    addObjProp(CSSStyleDeclaration.prototype, {
        name: 'cssText',
        get: function cssText() {
            return getPrivateProp(this, 'cssText');
        },
        set: function bcssText(value) {
            return setPrivateProp(this, 'cssText', value);
        }
    });
    addObjProp(CSSStyleDeclaration.prototype, {
        name: 'length',
        get: function length() {
            return getPrivateProp(this, 'length');
        }
    });
    addObjProp(CSSStyleDeclaration.prototype, {
        name: 'parentRule',
        get: function parentRule() {
            return getPrivateProp(this, 'parentRule');
        }
    });
    addObjProp(CSSStyleDeclaration.prototype, {
        name: 'cssFloat',
        get: function cssFloat() {
            return getPrivateProp(this, 'cssFloat');
        },
        set: function cssFloat(value) {
            return setPrivateProp(this, 'cssFloat', value);
        }
    });
    addObjProp(CSSStyleDeclaration.prototype, {
        name: 'getPropertyPriority',
        value: function getPropertyPriority(propName) {
            const originObj = getPrivateProp(this, 'originObj') || this;
            const propOption = getPrivateProp(originObj, 'propOption');
            const newPropName = getStyleName(propName)
            return newPropName ? propOption[newPropName].priority : '';
        }
    });
    addObjProp(CSSStyleDeclaration.prototype, {
        name: 'getPropertyValue',
        value: function getPropertyValue(propName) {
            const originObj = getPrivateProp(this, 'originObj') || this;
            const newPropName = getStyleName(propName);
            return newPropName ? originObj[newPropName] : '';
        }
    });
    addObjProp(CSSStyleDeclaration.prototype, {
        name: 'item',
        value: function item(index) {
            const originObj = getPrivateProp(this, 'originObj') || this;
            return originObj[index];
        }
    });
    addObjProp(CSSStyleDeclaration.prototype, {
        name: 'removeProperty',
        value: function removeProperty(propName) {
            const newPropName = getStyleName(propName);
            let removeValue = '';
            //isNaN(Number(propName)判断是否是数字，如果是数字则是设置样式时的属性下标，不做任何操作
            if (newPropName in this) {
                removeValue = this[newPropName];
                const propOption = getPrivateProp(this, 'propOption');
                const propIndex = propOption[newPropName].index;
                const priority = propOption[newPropName].priority

                //更新cssText
                let cssText = getPrivateProp(this, 'cssText');
                setPrivateProp(this, 'cssText', cssText.split(`${propName.toLowerCase()}: ${removeValue}${priority ? ' !important' : ''};`).join(''));

                //删除设置样式时的属性下标，删除配置，置空属性值
                const originObj = getPrivateProp(this, 'originObj') || this;
                delete originObj[propIndex];
                delete propOption[newPropName];
                originObj[newPropName] = '';
            }

            return removeValue;
        }
    });
    addObjProp(CSSStyleDeclaration.prototype, {
        name: 'setProperty',
        value: function setProperty(propName, value, priority) {
            const propOption = getPrivateProp(this, 'propOption');
            const originObj = getPrivateProp(this, 'originObj') || this;
            //属性值非存在，则设置样式属性下标、更新cssText、更新length
            if (!this[propName]) {
                let length = getPrivateProp(this, 'length');
                originObj[length] = propName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(); //每次设置样式，都需要设置样式属性下标
                propOption[propName] = {
                    index: length,
                    priority: priority === 'important' ? priority : ''
                }

                if (!priority || priority === 'important') {
                    //更新length
                    setPrivateProp(this, 'length', length + 1);
                }
            }
            if (!priority || priority === 'important') {
                originObj[propName] = value;
            }
        }
    });
})

module.exports = {
    styleProp,
    CSSStyleDeclaration
};