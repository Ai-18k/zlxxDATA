const {setFunctionPrototype,addObjProp} = require("../../utility.js");

function EXTClipControl() {
}

setFunctionPrototype(EXTClipControl,()=>{
    addObjProp(EXTClipControl.prototype,{
        name: 'LOWER_LEFT_EXT',
        value: 36001,
        configurable: false,
        writable: false
    });
    addObjProp(EXTClipControl.prototype,{
        name: 'UPPER_LEFT_EXT',
        value: 36002,
        configurable: false,
        writable: false
    });
    addObjProp(EXTClipControl.prototype,{
        name: 'UPPER_LEFT_EXT',
        value: 36002,
        configurable: false,
        writable: false
    });
    addObjProp(EXTClipControl.prototype,{
        name: 'NEGATIVE_ONE_TO_ONE_EXT',
        value: 37726,
        configurable: false,
        writable: false
    });
    addObjProp(EXTClipControl.prototype,{
        name: 'ZERO_TO_ONE_EXT',
        value: 37727,
        configurable: false,
        writable: false
    });
    addObjProp(EXTClipControl.prototype,{
        name: 'CLIP_ORIGIN_EXT',
        value: 37724,
        configurable: false,
        writable: false
    });
    addObjProp(EXTClipControl.prototype,{
        name: 'CLIP_DEPTH_MODE_EXT',
        value: 37725,
        configurable: false,
        writable: false
    });
    addObjProp(EXTClipControl.prototype,{name: 'clipControlEXT'});
})

module.exports = EXTClipControl;