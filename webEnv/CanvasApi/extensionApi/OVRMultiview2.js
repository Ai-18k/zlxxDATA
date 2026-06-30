const {setFunctionPrototype,addObjProp} = require("../../utility.js");

function OVRMultiview2() {
}

setFunctionPrototype(OVRMultiview2,()=>{
    addObjProp(OVRMultiview2.prototype,{
        name: 'FRAMEBUFFER_ATTACHMENT_TEXTURE_NUM_VIEWS_OVR',
        value: 38448,
        configurable: false,
        writable: false
    });
    addObjProp(OVRMultiview2.prototype,{
        name: 'FRAMEBUFFER_ATTACHMENT_TEXTURE_BASE_VIEW_INDEX_OVR',
        value: 38450,
        configurable: false,
        writable: false
    });
    addObjProp(OVRMultiview2.prototype,{
        name: 'MAX_VIEWS_OVR',
        value: 38449,
        configurable: false,
        writable: false
    });
    addObjProp(OVRMultiview2.prototype,{
        name: 'FRAMEBUFFER_INCOMPLETE_VIEW_TARGETS_OVR',
        value: 38451,
        configurable: false,
        writable: false
    });
    addObjProp(OVRMultiview2.prototype,{name: 'framebufferTextureMultiviewOVR'});
});

module.exports = OVRMultiview2;