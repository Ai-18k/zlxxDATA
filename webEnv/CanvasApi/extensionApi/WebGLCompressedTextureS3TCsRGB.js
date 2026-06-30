const {setFunctionPrototype,addObjProp} = require("../../utility.js");

function WebGLCompressedTextureS3TCsRGB() {
}

setFunctionPrototype(WebGLCompressedTextureS3TCsRGB, () => {
    addObjProp(WebGLCompressedTextureS3TCsRGB.prototype, {
        name: 'COMPRESSED_SRGB_S3TC_DXT1_EXT',
        value: 35916,
        configurable: false,
        writable: false
    });
    addObjProp(WebGLCompressedTextureS3TCsRGB.prototype, {
        name: 'COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT',
        value: 35917,
        configurable: false,
        writable: false
    });
    addObjProp(WebGLCompressedTextureS3TCsRGB.prototype, {
        name: 'COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT',
        value: 35918,
        configurable: false,
        writable: false
    });
    addObjProp(WebGLCompressedTextureS3TCsRGB.prototype, {
        value: 35919,
        configurable: false,
        writable: false
    });
})

module.exports = WebGLCompressedTextureS3TCsRGB;