const {
    getPrivateProp,
    setPrivateProp,
    setFunctionPrototype,
    addObjProp
} = require("../utility.js");
const HTMLElement = require("../HTML/api/HTMLElement.js");
const initHTML = require("../HTML/fun/initHtml.js");

/**
 * @constructor HTMLInputElement Div构造函数
 * @param {object} options 配置项
 * @param {object} options[prop] HTMLElement下的所有属性都可配置
 * */
function HTMLInputElement(options= undefined) {
    if (options) {
        let newOptions = {
            nodeName: 'INPUT',
            nodeType: 1,
            tagName: 'INPUT'
        }
        if(typeof options === 'string') {
            newOptions.vmDom = options;
        }else{
            newOptions = {...newOptions, ...options};
        }
        initHTML(this, newOptions);
    }
}

setFunctionPrototype(HTMLInputElement, () => {
    addObjProp(HTMLInputElement.prototype, {
        name: 'accept',
        get: function accept() {
            return getPrivateProp(this, 'accept')
        },
        set: function accept(value) {
            return setPrivateProp(this, 'accept', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'alt',
        get: function alt() {
            return getPrivateProp(this, 'alt')
        },
        set: function alt(value) {
            return setPrivateProp(this, 'alt', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'autocomplete',
        get: function autocomplete() {
            return getPrivateProp(this, 'autocomplete')
        },
        set: function autocomplete(value) {
            return setPrivateProp(this, 'autocomplete', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'defaultChecked',
        get: function defaultChecked() {
            return getPrivateProp(this, 'defaultChecked')
        },
        set: function defaultChecked(value) {
            return setPrivateProp(this, 'defaultChecked', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'checked',
        get: function checked() {
            return getPrivateProp(this, 'checked')
        },
        set: function checked(value) {
            return setPrivateProp(this, 'checked', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'dirName',
        get: function dirName() {
            return getPrivateProp(this, 'dirName')
        },
        set: function dirName(value) {
            return setPrivateProp(this, 'dirName', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'disabled',
        get: function disabled() {
            return getPrivateProp(this, 'disabled')
        },
        set: function disabled(value) {
            return setPrivateProp(this, 'disabled', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'form',
        get: function form() {
            return getPrivateProp(this, 'form')
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'files',
        get: function files() {
            return getPrivateProp(this, 'files')
        },
        set: function files(value) {
            return setPrivateProp(this, 'files', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'formAction',
        get: function formAction() {
            return getPrivateProp(this, 'formAction')
        },
        set: function formAction(value) {
            return setPrivateProp(this, 'formAction', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'formEnctype',
        get: function formEnctype() {
            return getPrivateProp(this, 'formEnctype')
        },
        set: function formEnctype(value) {
            return setPrivateProp(this, 'formEnctype', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'formMethod',
        get: function formMethod() {
            return getPrivateProp(this, 'formMethod')
        },
        set: function formMethod(value) {
            return setPrivateProp(this, 'formMethod', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'formNoValidate',
        get: function formNoValidate() {
            return getPrivateProp(this, 'formNoValidate')
        },
        set: function formNoValidate(value) {
            return setPrivateProp(this, 'formNoValidate', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'formTarget',
        get: function formTarget() {
            return getPrivateProp(this, 'formTarget')
        },
        set: function formTarget(value) {
            return setPrivateProp(this, 'formTarget', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'height',
        get: function height() {
            return getPrivateProp(this, 'height')
        },
        set: function height(value) {
            return setPrivateProp(this, 'height', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'indeterminate',
        get: function indeterminate() {
            return getPrivateProp(this, 'indeterminate')
        },
        set: function indeterminate(value) {
            return setPrivateProp(this, 'indeterminate', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'list',
        get: function list() {
            return getPrivateProp(this, 'list')
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'max',
        get: function max() {
            return getPrivateProp(this, 'max')
        },
        set: function max(value) {
            return setPrivateProp(this, 'max', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'maxLength',
        get: function maxLength() {
            return getPrivateProp(this, 'maxLength')
        },
        set: function maxLength(value) {
            return setPrivateProp(this, 'maxLength', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'min',
        get: function min() {
            return getPrivateProp(this, 'min')
        },
        set: function min(value) {
            return setPrivateProp(this, 'min', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'minLength',
        get: function minLength() {
            return getPrivateProp(this, 'minLength')
        },
        set: function minLength(value) {
            return setPrivateProp(this, 'minLength', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'multiple',
        get: function multiple() {
            return getPrivateProp(this, 'multiple')
        },
        set: function multiple(value) {
            return setPrivateProp(this, 'multiple', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'name',
        get: function name() {
            return getPrivateProp(this, 'name')
        },
        set: function name(value) {
            //更新attributes
            const attributes = getPrivateProp(this, 'attributes');
            attributes.setNamedItem('name', value);
            return setPrivateProp(this, 'name', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'pattern',
        get: function pattern() {
            return getPrivateProp(this, 'pattern')
        },
        set: function pattern(value) {
            return setPrivateProp(this, 'pattern', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'placeholder',
        get: function placeholder() {
            return getPrivateProp(this, 'placeholder')
        },
        set: function placeholder(value) {
            return setPrivateProp(this, 'placeholder', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'readOnly',
        get: function readOnly() {
            return getPrivateProp(this, 'readOnly')
        },
        set: function readOnly(value) {
            return setPrivateProp(this, 'readOnly', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'required',
        get: function required() {
            return getPrivateProp(this, 'required')
        },
        set: function required(value) {
            return setPrivateProp(this, 'required', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'size',
        get: function size() {
            return getPrivateProp(this, 'size')
        },
        set: function size(value) {
            return setPrivateProp(this, 'size', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'src',
        get: function src() {
            return getPrivateProp(this, 'src')
        },
        set: function src(value) {
            return setPrivateProp(this, 'src', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'step',
        get: function step() {
            return getPrivateProp(this, 'step')
        },
        set: function step(value) {
            return setPrivateProp(this, 'step', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'type',
        get: function type() {
            return getPrivateProp(this, 'type')
        },
        set: function type(value) {
            return setPrivateProp(this, 'type', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'defaultValue',
        get: function defaultValue() {
            return getPrivateProp(this, 'defaultValue')
        },
        set: function defaultValue(value) {
            return setPrivateProp(this, 'defaultValue', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'value',
        get: function value() {
            return getPrivateProp(this, 'value')
        },
        set: function value(value) {
            return setPrivateProp(this, 'value', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'valueAsDate',
        get: function valueAsDate() {
            return getPrivateProp(this, 'valueAsDate')
        },
        set: function valueAsDate(value) {
            return setPrivateProp(this, 'valueAsDate', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'valueAsNumber',
        get: function valueAsNumber() {
            return getPrivateProp(this, 'valueAsNumber')
        },
        set: function valueAsNumber(value) {
            return setPrivateProp(this, 'valueAsNumber', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'width',
        get: function width() {
            return getPrivateProp(this, 'width')
        },
        set: function width(value) {
            return setPrivateProp(this, 'width', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'willValidate',
        get: function willValidate() {
            return getPrivateProp(this, 'willValidate')
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'validity',
        get: function validity() {
            return getPrivateProp(this, 'validity')
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'validationMessage',
        get: function validationMessage() {
            return getPrivateProp(this, 'validationMessage')
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'labels',
        get: function labels() {
            return getPrivateProp(this, 'labels')
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'selectionStart',
        get: function selectionStart() {
            return getPrivateProp(this, 'selectionStart')
        },
        set: function selectionStart(value) {
            return setPrivateProp(this, 'selectionStart', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'selectionEnd',
        get: function selectionEnd() {
            return getPrivateProp(this, 'selectionEnd')
        },
        set: function selectionEnd(value) {
            return setPrivateProp(this, 'selectionEnd', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'selectionDirection',
        get: function selectionDirection() {
            return getPrivateProp(this, 'selectionDirection')
        },
        set: function selectionDirection(value) {
            return setPrivateProp(this, 'selectionDirection', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'align',
        get: function align() {
            return getPrivateProp(this, 'align')
        },
        set: function align(value) {
            return setPrivateProp(this, 'align', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'useMap',
        get: function useMap() {
            return getPrivateProp(this, 'useMap')
        },
        set: function useMap(value) {
            return setPrivateProp(this, 'useMap', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'webkitdirectory',
        get: function webkitdirectory() {
            return getPrivateProp(this, 'webkitdirectory')
        },
        set: function webkitdirectory(value) {
            return setPrivateProp(this, 'webkitdirectory', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'incremental',
        get: function incremental() {
            return getPrivateProp(this, 'incremental')
        },
        set: function incremental(value) {
            return setPrivateProp(this, 'incremental', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'popoverTargetElement',
        get: function popoverTargetElement() {
            return getPrivateProp(this, 'popoverTargetElement')
        },
        set: function popoverTargetElement(value) {
            return setPrivateProp(this, 'popoverTargetElement', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {
        name: 'popoverTargetAction',
        get: function popoverTargetAction() {
            return getPrivateProp(this, 'popoverTargetAction')
        },
        set: function popoverTargetAction(value) {
            return setPrivateProp(this, 'popoverTargetAction', value)
        }
    });
    addObjProp(HTMLInputElement.prototype, {name: 'checkValidity'});
    addObjProp(HTMLInputElement.prototype, {name: 'reportValidity'});
    addObjProp(HTMLInputElement.prototype, {name: 'select'});
    addObjProp(HTMLInputElement.prototype, {name: 'setCustomValidity'});
    addObjProp(HTMLInputElement.prototype, {name: 'setRangeText'});
    addObjProp(HTMLInputElement.prototype, {name: 'setSelectionRange'});
    addObjProp(HTMLInputElement.prototype, {name: 'showPicker'});
    addObjProp(HTMLInputElement.prototype, {name: 'stepDown'});
    addObjProp(HTMLInputElement.prototype, {name: 'stepUp'});
    addObjProp(HTMLInputElement.prototype, {
        name: 'webkitEntries',
        get: function webkitEntries() {
            return getPrivateProp(this, 'webkitEntries')
        }
    });
}, HTMLElement);

module.exports = HTMLInputElement;