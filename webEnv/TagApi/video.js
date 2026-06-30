const {
    addObjProp,
    setPrivateProp,
    getPrivateProp,
    setFunctionPrototype
} = require("../utility.js");
const HTMLMediaElement = require("./media.js");
const initHTML = require("../HTML/fun/initHtml.js");

/**
 * @constructor HTMLVideoElement Video构造函数
 * @param {object} options 配置项
 * @param {object} options[prop] HTMLElement下的所有属性都可配置
 * */
function HTMLVideoElement(options= undefined) {
    if (options) {
        let newOptions = {
            nodeName: 'VIDEO',
            nodeType: 1,
            tagName: 'VIDEO'
        }
        if(typeof options === 'string') {
            newOptions.vmDom = options;
        }else{
            newOptions = {...newOptions, ...options};
        }
        initHTML(this, newOptions);
    }
}

setFunctionPrototype(HTMLVideoElement, ()=>{
    addObjProp(HTMLVideoElement.prototype,{
        name: 'width',
        get: function width() {
            return getPrivateProp(this, 'width');
        },
        set: function width(value) {
            return setPrivateProp(this, 'width', value);
        }
    });
    addObjProp(HTMLVideoElement.prototype,{
        name: 'height',
        get: function height() {
            return getPrivateProp(this, 'height');
        },
        set: function height(value) {
            return setPrivateProp(this, 'height', value);
        }
    });
    addObjProp(HTMLVideoElement.prototype,{
        name: 'videoWidth',
        get: function videoWidth() {
            return getPrivateProp(this, 'videoWidth');
        }
    });
    addObjProp(HTMLVideoElement.prototype,{
        name: 'videoHeight',
        get: function videoHeight() {
            return getPrivateProp(this, 'videoHeight');
        }
    });
    addObjProp(HTMLVideoElement.prototype,{
        name: 'poster',
        get: function poster() {
            return getPrivateProp(this, 'poster');
        },
        set: function poster(value) {
            return setPrivateProp(this, 'poster', value);
        }
    });
    addObjProp(HTMLVideoElement.prototype,{
        name: 'webkitDecodedFrameCount',
        get: function webkitDecodedFrameCount() {
            return getPrivateProp(this, 'webkitDecodedFrameCount');
        }
    });
    addObjProp(HTMLVideoElement.prototype,{
        name: 'webkitDroppedFrameCount',
        get: function webkitDroppedFrameCount() {
            return getPrivateProp(this, 'webkitDroppedFrameCount');
        }
    });
    addObjProp(HTMLVideoElement.prototype,{
        name: 'playsInline',
        get: function playsInline() {
            return getPrivateProp(this, 'playsInline');
        },
        set: function playsInline(value) {
            return setPrivateProp(this, 'playsInline', value);
        }
    });
    addObjProp(HTMLVideoElement.prototype,{
        name: 'onenterpictureinpicture',
        get: function onenterpictureinpicture() {
            return getPrivateProp(this, 'onenterpictureinpicture');
        },
        set: function onenterpictureinpicture(value) {
            return setPrivateProp(this, 'onenterpictureinpicture', value);
        }
    });
    addObjProp(HTMLVideoElement.prototype,{
        name: 'onleavepictureinpicture',
        get: function onleavepictureinpicture() {
            return getPrivateProp(this, 'onleavepictureinpicture');
        },
        set: function onleavepictureinpicture(value) {
            return setPrivateProp(this, 'onleavepictureinpicture', value);
        }
    });
    addObjProp(HTMLVideoElement.prototype,{
        name: 'disablePictureInPicture',
        get: function disablePictureInPicture() {
            return getPrivateProp(this, 'disablePictureInPicture');
        },
        set: function disablePictureInPicture(value) {
            return setPrivateProp(this, 'disablePictureInPicture', value);
        }
    });
    addObjProp(HTMLVideoElement.prototype,{name: 'cancelVideoFrameCallback'});
    addObjProp(HTMLVideoElement.prototype,{name: 'getVideoPlaybackQuality'});
    addObjProp(HTMLVideoElement.prototype,{name: 'requestPictureInPicture'});
    addObjProp(HTMLVideoElement.prototype,{name: 'requestVideoFrameCallback'});
}, HTMLMediaElement);

module.exports = HTMLVideoElement;