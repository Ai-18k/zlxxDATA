const {
    setFunctionPrototype,
    addObjProp,
    getPrivateProp,
    setPrivateProp,
    getOriginObj,
    originArray,
    chalkLog
} = require("../../utility.js");
const queryFormProp = require("../../CommonApi/fun/queryFormProp.js");
const Node = require("../../CommonApi/api/Node.js");

function Element() {
}

setFunctionPrototype(Element, () => {
    addObjProp(Element.prototype, {
        name: 'namespaceURI',
        get: function namespaceURI() {
            return getPrivateProp(this, 'namespaceURI') || 'http://www.w3.org/1999/xhtml';
        }
    });
    addObjProp(Element.prototype, {
        name: 'prefix',
        get: function prefix() {
            return getPrivateProp(this, 'prefix');
        }
    });
    addObjProp(Element.prototype, {
        name: 'localName',
        get: function localName() {
            const tagName = getPrivateProp(this,'tagName');
            return tagName.toLowerCase();
        }
    });
    addObjProp(Element.prototype, {
        name: 'tagName',
        get: function tagName() {
            return getPrivateProp(this, 'tagName');
        }
    });
    addObjProp(Element.prototype, {
        name: 'id',
        get: function id() {
            let id = getPrivateProp(this, 'id');
            const originTag = getOriginObj(this);
            if (originTag instanceof HTMLFormElement) {
                id = queryFormProp(this, 'id');
            }
            return id;
        },
        set: function id(value) {
            //更新attributes
            const attributes = getPrivateProp(this, 'attributes');
            attributes.setNamedItem('id',value);
            return setPrivateProp(this, 'id', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'className',
        get: function className() {
            return getPrivateProp(this, 'className');
        },
        set: function className(value) {
            return setPrivateProp(this, 'className', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'classList',
        get: function classList() {
            return getPrivateProp(this, 'classList');
        },
        set: function classList(value) {
            return setPrivateProp(this, 'classList', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'slot',
        get: function slot() {
            return getPrivateProp(this, 'slot');
        },
        set: function slot(value) {
            return setPrivateProp(this, 'slot', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'attributes',
        get: function attributes() {
            return getPrivateProp(this, 'attributes');
        }
    });
    addObjProp(Element.prototype, {
        name: 'shadowRoot',
        get: function shadowRoot() {
            return getPrivateProp(this, 'shadowRoot');
        }
    });
    addObjProp(Element.prototype, {
        name: 'part',
        get: function part() {
            return getPrivateProp(this, 'part');
        },
        set: function part(value) {
            return setPrivateProp(this, 'part', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'assignedSlot',
        get: function assignedSlot() {
            return getPrivateProp(this, 'assignedSlot');
        }
    });
    addObjProp(Element.prototype, {
        name: 'innerHTML',
        get: function innerHTML() {
            return getPrivateProp(this, 'innerHTML');
        },
        set: function innerHTML(value) {
            return setPrivateProp(this, 'innerHTML', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'outerHTML',
        get: function outerHTML() {
            return getPrivateProp(this, 'outerHTML');
        },
        set: function outerHTML(value) {
            return setPrivateProp(this, 'outerHTML', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'scrollTop',
        get: function scrollTop() {
            return getPrivateProp(this, 'scrollTop');
        },
        set: function scrollTop(value) {
            return setPrivateProp(this, 'scrollTop', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'scrollLeft',
        get: function scrollLeft() {
            return getPrivateProp(this, 'scrollLeft');
        },
        set: function scrollLeft(value) {
            return setPrivateProp(this, 'scrollLeft', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'scrollWidth',
        get: function scrollWidth() {
            return getPrivateProp(this, 'scrollWidth');
        }
    });
    addObjProp(Element.prototype, {
        name: 'scrollHeight',
        get: function scrollHeight() {
            return getPrivateProp(this, 'scrollHeight');
        }
    });
    addObjProp(Element.prototype, {
        name: 'clientTop',
        get: function clientTop() {
            return getPrivateProp(this, 'clientTop');
        }
    });
    addObjProp(Element.prototype, {
        name: 'clientLeft',
        get: function clientLeft() {
            return getPrivateProp(this, 'clientLeft');
        }
    });
    addObjProp(Element.prototype, {
        name: 'clientWidth',
        get: function clientWidth() {
            return getPrivateProp(this, 'clientWidth');
        }
    });
    addObjProp(Element.prototype, {
        name: 'clientHeight',
        get: function clientHeight() {
            return getPrivateProp(this, 'clientHeight');
        }
    });
    addObjProp(Element.prototype, {
        name: 'onbeforecopy',
        get: function onbeforecopy() {
            return getPrivateProp(this, 'onbeforecopy');
        },
        set: function onbeforecopy(value) {
            return setPrivateProp(this, 'onbeforecopy', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'onbeforecut',
        get: function onbeforecut() {
            return getPrivateProp(this, 'onbeforecut');
        },
        set: function onbeforecut(value) {
            return setPrivateProp(this, 'onbeforecut', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'onbeforepaste',
        get: function onbeforepaste() {
            return getPrivateProp(this, 'onbeforepaste');
        },
        set: function onbeforepaste(value) {
            return setPrivateProp(this, 'onbeforepaste', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'onsearch',
        get: function onsearch() {
            return getPrivateProp(this, 'onsearch');
        },
        set: function onsearch(value) {
            return setPrivateProp(this, 'onsearch', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'elementTiming',
        get: function elementTiming() {
            return getPrivateProp(this, 'elementTiming');
        },
        set: function elementTiming(value) {
            return setPrivateProp(this, 'elementTiming', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'onfullscreenchange',
        get: function onfullscreenchange() {
            return getPrivateProp(this, 'onfullscreenchange');
        },
        set: function onfullscreenchange(value) {
            return setPrivateProp(this, 'onfullscreenchange', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'onfullscreenerror',
        get: function onfullscreenerror() {
            return getPrivateProp(this, 'onfullscreenerror');
        },
        set: function onfullscreenerror(value) {
            return setPrivateProp(this, 'onfullscreenerror', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'onwebkitfullscreenchange',
        get: function onwebkitfullscreenchange() {
            return getPrivateProp(this, 'onwebkitfullscreenchange');
        },
        set: function onwebkitfullscreenchange(value) {
            return setPrivateProp(this, 'onwebkitfullscreenchange', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'onwebkitfullscreenerro',
        get: function onwebkitfullscreenerro() {
            return getPrivateProp(this, 'onwebkitfullscreenerro');
        },
        set: function onwebkitfullscreenerro(value) {
            return setPrivateProp(this, 'onwebkitfullscreenerro', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'role',
        get: function role() {
            return getPrivateProp(this, 'role');
        },
        set: function role(value) {
            return setPrivateProp(this, 'role', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaAtomic',
        get: function ariaAtomic() {
            return getPrivateProp(this, 'ariaAtomic');
        },
        set: function ariaAtomic(value) {
            return setPrivateProp(this, 'ariaAtomic', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaAutoComplete',
        get: function ariaAutoComplete() {
            return getPrivateProp(this, 'ariaAutoComplete');
        },
        set: function ariaAutoComplete(value) {
            return setPrivateProp(this, 'ariaAutoComplete', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaBusy',
        get: function ariaBusy() {
            return getPrivateProp(this, 'ariaBusy');
        },
        set: function ariaBusy(value) {
            return setPrivateProp(this, 'ariaBusy', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaBrailleLabel',
        get: function ariaBrailleLabel() {
            return getPrivateProp(this, 'ariaBrailleLabel');
        },
        set: function ariaBrailleLabel(value) {
            return setPrivateProp(this, 'ariaBrailleLabel', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaBrailleRoleDescription',
        get: function ariaBrailleRoleDescription() {
            return getPrivateProp(this, 'ariaBrailleRoleDescription');
        },
        set: function ariaBrailleRoleDescription(value) {
            return setPrivateProp(this, 'ariaBrailleRoleDescription', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaChecked',
        get: function ariaChecked() {
            return getPrivateProp(this, 'ariaChecked');
        },
        set: function ariaChecked(value) {
            return setPrivateProp(this, 'ariaChecked', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaColCount',
        get: function ariaColCount() {
            return getPrivateProp(this, 'ariaColCount');
        },
        set: function ariaColCount(value) {
            return setPrivateProp(this, 'ariaColCount', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaColIndex',
        get: function ariaColIndex() {
            return getPrivateProp(this, 'ariaColIndex');
        },
        set: function ariaColIndex(value) {
            return setPrivateProp(this, 'ariaColIndex', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaColSpan',
        get: function ariaColSpan() {
            return getPrivateProp(this, 'ariaColSpan');
        },
        set: function ariaColSpan(value) {
            return setPrivateProp(this, 'ariaColSpan', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaCurrent',
        get: function ariaCurrent() {
            return getPrivateProp(this, 'ariaCurrent');
        },
        set: function ariaCurrent(value) {
            return setPrivateProp(this, 'ariaCurrent', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaDescription',
        get: function ariaDescription() {
            return getPrivateProp(this, 'ariaDescription');
        },
        set: function ariaDescription(value) {
            return setPrivateProp(this, 'ariaDescription', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaDisabled',
        get: function ariaDisabled() {
            return getPrivateProp(this, 'ariaDisabled');
        },
        set: function ariaDisabled(value) {
            return setPrivateProp(this, 'ariaDisabled', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaExpanded',
        get: function ariaExpanded() {
            return getPrivateProp(this, 'ariaExpanded');
        },
        set: function ariaExpanded(value) {
            return setPrivateProp(this, 'ariaExpanded', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaHasPopup',
        get: function ariaHasPopup() {
            return getPrivateProp(this, 'ariaHasPopup');
        },
        set: function ariaHasPopup(value) {
            return setPrivateProp(this, 'ariaHasPopup', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaHidden',
        get: function ariaHidden() {
            return getPrivateProp(this, 'ariaHidden');
        },
        set: function ariaHidden(value) {
            return setPrivateProp(this, 'ariaHidden', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaInvalid',
        get: function ariaInvalid() {
            return getPrivateProp(this, 'ariaInvalid');
        },
        set: function ariaInvalid(value) {
            return setPrivateProp(this, 'ariaInvalid', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaKeyShortcuts',
        get: function ariaKeyShortcuts() {
            return getPrivateProp(this, 'ariaKeyShortcuts');
        },
        set: function ariaKeyShortcuts(value) {
            return setPrivateProp(this, 'ariaKeyShortcuts', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaLabel',
        get: function ariaLabel() {
            return getPrivateProp(this, 'ariaLabel');
        },
        set: function ariaLabel(value) {
            return setPrivateProp(this, 'ariaLabel', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaLeve',
        get: function ariaLeve() {
            return getPrivateProp(this, 'ariaLeve');
        },
        set: function ariaLeve(value) {
            return setPrivateProp(this, 'ariaLeve', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaLive',
        get: function ariaLive() {
            return getPrivateProp(this, 'ariaLive');
        },
        set: function ariaLive(value) {
            return setPrivateProp(this, 'ariaLive', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaModal',
        get: function ariaModal() {
            return getPrivateProp(this, 'ariaModal');
        },
        set: function ariaModal(value) {
            return setPrivateProp(this, 'ariaModal', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaMultiLine',
        get: function ariaMultiLine() {
            return getPrivateProp(this, 'ariaMultiLine');
        },
        set: function ariaMultiLine(value) {
            return setPrivateProp(this, 'ariaMultiLine', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaMultiSelectable',
        get: function ariaMultiSelectable() {
            return getPrivateProp(this, 'ariaMultiSelectable');
        },
        set: function ariaMultiSelectable(value) {
            return setPrivateProp(this, 'ariaMultiSelectable', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaOrientation',
        get: function ariaOrientation() {
            return getPrivateProp(this, 'ariaOrientation');
        },
        set: function ariaOrientation(value) {
            return setPrivateProp(this, 'ariaOrientation', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaPlaceholder',
        get: function ariaPlaceholder() {
            return getPrivateProp(this, 'ariaPlaceholder');
        },
        set: function ariaPlaceholder(value) {
            return setPrivateProp(this, 'ariaPlaceholder', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaPosInSet',
        get: function ariaPosInSet() {
            return getPrivateProp(this, 'ariaPosInSet');
        },
        set: function ariaPosInSet(value) {
            return setPrivateProp(this, 'ariaPosInSet', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaPressed',
        get: function ariaPressed() {
            return getPrivateProp(this, 'ariaPressed');
        },
        set: function ariaPressed(value) {
            return setPrivateProp(this, 'ariaPressed', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaReadOnly',
        get: function ariaReadOnly() {
            return getPrivateProp(this, 'ariaReadOnly');
        },
        set: function ariaReadOnly(value) {
            return setPrivateProp(this, 'ariaReadOnly', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaRelevant',
        get: function ariaRelevant() {
            return getPrivateProp(this, 'ariaRelevant');
        },
        set: function ariaRelevant(value) {
            return setPrivateProp(this, 'ariaRelevant', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaRequired',
        get: function ariaRequired() {
            return getPrivateProp(this, 'ariaRequired');
        },
        set: function ariaRequired(value) {
            return setPrivateProp(this, 'ariaRequired', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaRoleDescription',
        get: function ariaRoleDescription() {
            return getPrivateProp(this, 'ariaRoleDescription');
        },
        set: function ariaRoleDescription(value) {
            return setPrivateProp(this, 'ariaRoleDescription', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaRowCount',
        get: function ariaRowCount() {
            return getPrivateProp(this, 'ariaRowCount');
        },
        set: function ariaRowCount(value) {
            return setPrivateProp(this, 'ariaRowCount', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaRowIndex',
        get: function ariaRowIndex() {
            return getPrivateProp(this, 'ariaRowIndex');
        },
        set: function ariaRowIndex(value) {
            return setPrivateProp(this, 'ariaRowIndex', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaRowSpan',
        get: function ariaRowSpan() {
            return getPrivateProp(this, 'ariaRowSpan');
        },
        set: function ariaRowSpan(value) {
            return setPrivateProp(this, 'ariaRowSpan', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaSelected',
        get: function ariaSelected() {
            return getPrivateProp(this, 'ariaSelected');
        },
        set: function ariaSelected(value) {
            return setPrivateProp(this, 'ariaSelected', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaSetSize',
        get: function ariaSetSize() {
            return getPrivateProp(this, 'ariaSetSize');
        },
        set: function ariaSetSize(value) {
            return setPrivateProp(this, 'ariaSetSize', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaSor',
        get: function ariaSor() {
            return getPrivateProp(this, 'ariaSor');
        },
        set: function ariaSor(value) {
            return setPrivateProp(this, 'ariaSor', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaValueMax',
        get: function ariaValueMax() {
            return getPrivateProp(this, 'ariaValueMax');
        },
        set: function ariaValueMax(value) {
            return setPrivateProp(this, 'ariaValueMax', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaValueMin',
        get: function ariaValueMin() {
            return getPrivateProp(this, 'ariaValueMin');
        },
        set: function ariaValueMin(value) {
            return setPrivateProp(this, 'ariaValueMin', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaValueNow',
        get: function ariaValueNow() {
            return getPrivateProp(this, 'ariaValueNow');
        },
        set: function ariaValueNow(value) {
            return setPrivateProp(this, 'ariaValueNow', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaValueText',
        get: function ariaValueText() {
            return getPrivateProp(this, 'ariaValueText');
        },
        set: function ariaValueText(value) {
            return setPrivateProp(this, 'ariaValueText', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'children',
        get: function children() {
            return getPrivateProp(this, 'children');
        }
    });
    addObjProp(Element.prototype, {
        name: 'firstElementChild',
        get: function firstElementChild() {
            const children = getPrivateProp(this, 'children');
            return children[0];
        }
    });
    addObjProp(Element.prototype, {
        name: 'lastElementChild',
        get: function lastElementChild() {
            const children = getPrivateProp(this, 'children');
            return children[children.length - 1];
        }
    });
    addObjProp(Element.prototype, {
        name: 'childElementCount',
        get: function childElementCount() {
            const children = getPrivateProp(this, 'children');
            return children.length;
        }
    });
    addObjProp(Element.prototype, {
        name: 'previousElementSibling',
        get: function previousElementSibling() {
            return getPrivateProp(this, 'previousElementSibling');
        }
    });
    addObjProp(Element.prototype, {
        name: 'nextElementSibling',
        get: function nextElementSibling() {
            return getPrivateProp(this, 'nextElementSibling');
        }
    });
    addObjProp(Element.prototype, {name: 'after'});
    addObjProp(Element.prototype, {name: 'animate'});
    addObjProp(Element.prototype, {name: 'append'});
    addObjProp(Element.prototype, {name: 'attachShadow'});
    addObjProp(Element.prototype, {name: 'befor'});
    addObjProp(Element.prototype, {name: 'checkVisibility'});
    addObjProp(Element.prototype, {name: 'closest'});
    addObjProp(Element.prototype, {name: 'computedStyleMap'});
    addObjProp(Element.prototype, {name: 'getAnimations'});
    addObjProp(Element.prototype, {name: 'getAttribute'});
    addObjProp(Element.prototype, {name: 'getAttributeNS'});
    addObjProp(Element.prototype, {name: 'getAttributeNames'});
    addObjProp(Element.prototype, {name: 'getAttributeNode'});
    addObjProp(Element.prototype, {name: 'getAttributeNodeNS'});
    addObjProp(Element.prototype, {name: 'getBoundingClientRect'});
    addObjProp(Element.prototype, {name: 'getClientRects'});
    addObjProp(Element.prototype, {name: 'getElementsByClassName'});
    addObjProp(Element.prototype, {name: 'getElementsByTagName'});
    addObjProp(Element.prototype, {name: 'getElementsByTagNameNS'});
    addObjProp(Element.prototype, {name: 'getHTML'});
    addObjProp(Element.prototype, {name: 'hasAttribute'});
    addObjProp(Element.prototype, {name: 'hasAttributeNS'});
    addObjProp(Element.prototype, {name: 'hasAttributes'});
    addObjProp(Element.prototype, {name: 'hasPointerCapture'});
    addObjProp(Element.prototype, {name: 'insertAdjacentElement'});
    addObjProp(Element.prototype, {name: 'insertAdjacentHTM'});
    addObjProp(Element.prototype, {name: 'insertAdjacentText'});
    addObjProp(Element.prototype, {name: 'matches'});
    addObjProp(Element.prototype, {name: 'prepend'});
    addObjProp(Element.prototype, {
        name: 'querySelector',
        value: function querySelector(tagName){
            const objTagName = getPrivateProp(this, 'tagName');
            let result = null;
            let children = getPrivateProp(this, 'children');
            (function dfs(nodes) {
                originArray.from(nodes).forEach((node) => {
                    const nodeTagName = getPrivateProp(node, 'tagName');
                    const nodeChildren = getPrivateProp(node, 'children');
                    if (nodeTagName === tagName.toUpperCase()) {
                        result = node;
                    }
                    if (!node && nodeChildren?.length > 0) {
                        dfs(node.children);
                    }
                })
            })(children);
            chalkLog('red', `${objTagName}中querySelector接受的值是：${tagName} === ${result}，length === ${result.length}`);
            return result;
        }
    });
    addObjProp(Element.prototype, {name: 'querySelectorAll'});
    addObjProp(Element.prototype, {name: 'releasePointerCapture'});
    addObjProp(Element.prototype, {name: 'remove'});
    addObjProp(Element.prototype, {name: 'removeAttribute'});
    addObjProp(Element.prototype, {name: 'removeAttributeNS'});
    addObjProp(Element.prototype, {name: 'removeAttributeNode'});
    addObjProp(Element.prototype, {name: 'replaceChildren'});
    addObjProp(Element.prototype, {name: 'replaceWith'});
    addObjProp(Element.prototype, {name: 'requestFullscreen'});
    addObjProp(Element.prototype, {name: 'requestPointerLock'});
    addObjProp(Element.prototype, {name: 'scroll'});
    addObjProp(Element.prototype, {name: 'scrollBy'});
    addObjProp(Element.prototype, {name: 'scrollIntoView'});
    addObjProp(Element.prototype, {name: 'scrollIntoViewIfNeeded'});
    addObjProp(Element.prototype, {name: 'scrollTo'});
    addObjProp(Element.prototype, {
        name: 'setAttribute',
        value: function setAttribute(name, value) {
            const originTag = getOriginObj(this);
            if(originTag instanceof HTMLAnchorElement) {
                originTag[name] = value;
            }else{
                setPrivateProp(this, name, value);
            }
        }
    });
    addObjProp(Element.prototype, {name: 'setAttributeNS'});
    addObjProp(Element.prototype, {name: 'setAttributeNode'});
    addObjProp(Element.prototype, {name: 'setAttributeNodeNS'});
    addObjProp(Element.prototype, {name: 'setHTMLUnsafe'});
    addObjProp(Element.prototype, {name: 'setPointerCapture'});
    addObjProp(Element.prototype, {name: 'toggleAttribute'});
    addObjProp(Element.prototype, {name: 'webkitMatchesSelector'});
    addObjProp(Element.prototype, {name: 'webkitRequestFullScreen'});
    addObjProp(Element.prototype, {
        name: 'currentCSSZoom',
        get: function currentCSSZoom() {
            return getPrivateProp(this, 'currentCSSZoom');
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaColIndexText',
        get: function ariaColIndexText() {
            return getPrivateProp(this, 'ariaColIndexText');
        },
        set: function ariaColIndexText(value) {
            return setPrivateProp(this, 'ariaColIndexText', value);
        }
    });
    addObjProp(Element.prototype, {
        name: 'ariaRowIndexText',
        get: function ariaRowIndexText() {
            return getPrivateProp(this, 'ariaRowIndexText');
        },
        set: function ariaRowIndexText(value) {
            return setPrivateProp(this, 'ariaRowIndexText', value);
        }
    });
}, Node);

addObjProp(Element.prototype, {
    name: Symbol.unscopables,
    value: {
        "after": true,
        "append": true,
        "before": true,
        "prepend": true,
        "remove": true,
        "replaceChildren": true,
        "replaceWith": true,
        "slot": true
    },
    enumerable: false,
    writable: false
});

module.exports = Element;