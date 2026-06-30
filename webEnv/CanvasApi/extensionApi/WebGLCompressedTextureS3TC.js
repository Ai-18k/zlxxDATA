const {setFunctionPrototype,addObjProp} = require("../../utility.js");

function WebGLCompressedTextureS3TC() {
}

setFunctionPrototype(WebGLCompressedTextureS3TC, () => {
    addObjProp(WebGLCompressedTextureS3TC.prototype, {
        name: 'COMPRESSED_RGB_S3TC_DXT1_EXT',
        value: 33776,
        configurable: false,
        writable: false
    });
    addObjProp(WebGLCompressedTextureS3TC.prototype, {
        name: 'COMPRESSED_RGBA_S3TC_DXT1_EXT',
        value: 33777,
        configurable: false,
        writable: false
    });
    addObjProp(WebGLCompressedTextureS3TC.prototype, {
        name: 'COMPRESSED_RGBA_S3TC_DXT3_EXT',
        value: 33778,
        configurable: false,
        writable: false
    });
    addObjProp(WebGLCompressedTextureS3TC.prototype, {
        name: 'COMPRESSED_RGBA_S3TC_DXT5_EXT',
        value: 33779,
        configurable: false,
        writable: false
    });
})

module.exports = WebGLCompressedTextureS3TC;