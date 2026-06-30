const {
    envOption,
    getPrivateProp,
    setPrivateProp,
    setFunctionPrototype,
    addObjProp,
    chalkLog,
    getOriginObj
} = require("../utility.js");
const CanvasRenderingContext2D = require("../CanvasApi/api/CanvasRenderingContext2D.js");
const WebGLRenderingContext = require("../CanvasApi/api/WebGLRenderingContext.js");
const WebGL2RenderingContext = require("../CanvasApi/api/WebGL2RenderingContext.js");
const HTMLElement = require("../HTML/api/HTMLElement.js");
const initHTML = require("../HTML/fun/initHtml.js");

/**
 * @constructor HTMLCanvasElement canvas构造函数
 * @param {object} options 配置项
 * @param {object} options[prop] HTMLElement下的所有属性都可配置
 * */
function HTMLCanvasElement(options = undefined) {
    if (options) {
        let newOptions = {
            nodeName: 'CANVAS',
            nodeType: 1,
            tagName: 'CANVAS'
        }
        if(typeof options === 'string') {
            newOptions.vmDom = options;
        }else{
            newOptions = {...newOptions, ...options};
        }
        initHTML(this, newOptions);
    }
}

setFunctionPrototype(HTMLCanvasElement, () => {
    addObjProp(HTMLCanvasElement.prototype, {
        name: 'width',
        get: function width() {
            return getPrivateProp(this, 'width')
        },
        set: function width(value) {
            return setPrivateProp(this, 'width', value)
        }
    });
    addObjProp(HTMLCanvasElement.prototype, {
        name: 'height',
        get: function height() {
            return getPrivateProp(this, 'height')
        },
        set: function height(value) {
            return setPrivateProp(this, 'height', value)
        }
    });
    addObjProp(HTMLCanvasElement.prototype, {name: 'captureStream'});
    addObjProp(HTMLCanvasElement.prototype, {
        name: 'getContext',
        value: function getContext(type) {
            let canvasContext = null;
            if (type === '2d') {
                canvasContext = new CanvasRenderingContext2D();
            }else if (type === 'webgl'){
                canvasContext = new WebGLRenderingContext();
            }else if (type === 'webgl2'){
                canvasContext = new WebGL2RenderingContext();
            }
            const originObj = getOriginObj(this);
            setPrivateProp(canvasContext, 'canvas', originObj);
            return canvasContext;
        }
    });
    addObjProp(HTMLCanvasElement.prototype, {
        name: 'toBlob',
        value: function toBlob() {
            chalkLog('red','调用了canvas的toBlob，需要通过setPrivateProp(canvas, "dataBlob")设置返回值');
            return getPrivateProp(this, 'dataBlob');
        }
    });
    addObjProp(HTMLCanvasElement.prototype, {
        name: 'toDataURL',
        value: function toDataURL() {
            chalkLog('red','调用了canvas的toDataURL，需要通过setPrivateProp(canvas, "dataURL")设置返回值');
            return getPrivateProp(this, 'dataURL');
        }
    });
    addObjProp(HTMLCanvasElement.prototype, {name: 'transferControlToOffscreen'});
}, HTMLElement);

module.exports = HTMLCanvasElement;