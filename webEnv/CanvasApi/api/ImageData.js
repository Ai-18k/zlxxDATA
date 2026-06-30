const {
    setFunctionPrototype,
    getPrivateProp,
    setPrivateProp,
    addObjProp
} = require("../../utility.js");


function ImageData(width, height) {
    setPrivateProp(this, 'width', width);
    setPrivateProp(this, 'height', height);
    setPrivateProp(this, 'colorSpace', 'srgb');
}

setFunctionPrototype(ImageData, () => {
    addObjProp(ImageData.prototype, {
        name: 'width',
        get: function width() {
            return getPrivateProp(this, 'width');
        }
    });
    addObjProp(ImageData.prototype, {
        name: 'height',
        get: function height() {
            return getPrivateProp(this, 'height');
        }
    });
    addObjProp(ImageData.prototype, {
        name: 'colorSpace',
        get: function colorSpace() {
            return getPrivateProp(this, 'colorSpace');
        }
    });
    addObjProp(ImageData.prototype, {
        name: 'data',
        get: function data() {
            return new Uint8ClampedArray(64)
        }
    })
})

module.exports = ImageData;