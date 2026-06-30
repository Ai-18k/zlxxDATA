const {
    setFunctionPrototype,
    getPrivateProp,
    setPrivateProp,
    addObjProp
} = require("../../utility.js");
const EventTarget = require("./EventTarget.js");

function VisualViewport(){}
setFunctionPrototype(VisualViewport,()=>{
    addObjProp(VisualViewport.prototype,{
        name:'offsetLeft',
        get: function offsetLeft(){
            return getPrivateProp(this, 'offsetLeft')
        }
    });
    addObjProp(VisualViewport.prototype,{
        name:'offsetTop',
        get: function offsetTop(){
            return getPrivateProp(this, 'offsetTop')
        }
    });
    addObjProp(VisualViewport.prototype,{
        name:'pageLeft',
        get: function pageLeft(){
            return getPrivateProp(this, 'pageLeft')
        }
    });
    addObjProp(VisualViewport.prototype,{
        name:'pageTop',
        get: function pageTop(){
            return getPrivateProp(this, 'pageTop')
        }
    });
    addObjProp(VisualViewport.prototype,{
        name:'width',
        get: function width(){
            return getPrivateProp(this, 'width')
        }
    });
    addObjProp(VisualViewport.prototype,{
        name:'height',
        get: function height(){
            return getPrivateProp(this, 'height')
        }
    });
    addObjProp(VisualViewport.prototype,{
        name:'scale',
        get: function scale(){
            return getPrivateProp(this, 'scale')
        }
    });
    addObjProp(VisualViewport.prototype,{
        name:'onresize',
        get: function onresize(){
            return getPrivateProp(this, 'onresize')
        },
        set: function onresize(value){
            return setPrivateProp(this, 'onresize', value)
        }
    });
    addObjProp(VisualViewport.prototype,{
        name:'onscroll',
        get: function onscroll(){
            return getPrivateProp(this, 'onscroll')
        },
        set: function onscroll(value){
            return setPrivateProp(this, 'onscroll', value)
        }
    });
    addObjProp(VisualViewport.prototype,{
        name:'onscrollend',
        get: function onscrollend(){
            return getPrivateProp(this, 'onscrollend')
        },
        set: function onscrollend(value){
            return setPrivateProp(this, 'onscrollend', value)
        }
    });
},EventTarget)

module.exports= VisualViewport;