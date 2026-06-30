const {createError} = require("../../utility.js");

function getParameter(type) {
    if (!(this instanceof WebGLRenderingContext) && !(this instanceof WebGL2RenderingContext)) {
        throw createError("Illegal invocation", "TypeError");
    }
    const parameter = {
        3379: 16384,
        3410: 8,
        3411: 8,
        3412: 8,
        3413: 8,
        3414: 24,
        3415: 0,
        3386: new Int32Array([32767, 32767]),
        7936: 'WebKit',
        7937: 'WebKit WebGL',
        7938: 'WebGL 2.0 (OpenGL ES 3.0 Chromium)',
        33901: new Float32Array([1, 1024]),
        33902: new Float32Array([1, 1]),
        34047: 16,
        34076: 16384,
        34024: 16384,
        34921: 16,
        34930: 16,
        35661: 32,
        35660: 16,
        35724: 'WebGL GLSL ES 3.00 (OpenGL ES GLSL ES 3.0 Chromium)',
        36347: 4096,
        36348: 30,
        36349: 1024,
        37445: 'Google Inc. (Intel)',
        37446: 'ANGLE (Intel, Intel(R) HD Graphics 620 (0x00005916) Direct3D11 vs_5_0 ps_5_0, D3D11)'
    }
    return parameter[type];
}

module.exports = getParameter;