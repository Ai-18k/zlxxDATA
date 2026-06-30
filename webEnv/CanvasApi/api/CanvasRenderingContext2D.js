const {
    getPrivateProp,
    setPrivateProp,
    setFunctionPrototype,
    addObjProp,
    chalkLog,
    getFunctionCallCount
} = require("../../utility.js");
const ImageData = require("./ImageData.js");
//函数执行次数，用于生成setPrivateProp的name
const funCallNu = {
    measureText: {}
};

function CanvasRenderingContext2D() {
}

setFunctionPrototype(CanvasRenderingContext2D, () => {
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'canvas',
        get: function canvas() {
            return getPrivateProp(this, 'canvas');
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'globalAlpha',
        get: function globalAlpha() {
            return getPrivateProp(this, 'globalAlpha') || 1;
        },
        set: function globalAlpha(value) {
            return setPrivateProp(this, 'globalAlpha', value);
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'globalCompositeOperation',
        get: function globalCompositeOperation() {
            return getPrivateProp(this, 'globalCompositeOperation') || 'source-over';
        },
        set: function globalCompositeOperation(value) {
            return setPrivateProp(this, 'globalCompositeOperation', value);
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'filter',
        get: function filter() {
            return getPrivateProp(this, 'filter') || 'none';
        },
        set: function filter(value) {
            return setPrivateProp(this, 'filter', value);
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'imageSmoothingEnabled',
        get: function imageSmoothingEnabled() {
            return getPrivateProp(this, 'imageSmoothingEnabled') || true;
        },
        set: function imageSmoothingEnabled(value) {
            return setPrivateProp(this, 'imageSmoothingEnabled', value);
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'imageSmoothingQuality',
        get: function imageSmoothingQuality() {
            return getPrivateProp(this, 'imageSmoothingQuality') || 'low';
        },
        set: function imageSmoothingQuality(value) {
            return setPrivateProp(this, 'imageSmoothingQuality', value);
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'strokeStyle',
        get: function strokeStyle() {
            return getPrivateProp(this, 'strokeStyle') || '#000000';
        },
        set: function strokeStyle(value) {
            return setPrivateProp(this, 'strokeStyle', value);
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'fillStyle',
        get: function fillStyle() {
            return getPrivateProp(this, 'fillStyle') || '#000000';
        },
        set: function fillStyle(value) {
            return setPrivateProp(this, 'fillStyle', value);
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'shadowOffsetX',
        get: function shadowOffsetX() {
            return getPrivateProp(this, 'shadowOffsetX') || 0;
        },
        set: function shadowOffsetX(value) {
            return setPrivateProp(this, 'shadowOffsetX', value);
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'shadowOffsetY',
        get: function shadowOffsetY() {
            return getPrivateProp(this, 'shadowOffsetY') || 0;
        },
        set: function shadowOffsetY(value) {
            return setPrivateProp(this, 'shadowOffsetY', value);
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'shadowBlur',
        get: function shadowBlur() {
            return getPrivateProp(this, 'shadowBlur') || 0;
        },
        set: function shadowBlur(value) {
            return setPrivateProp(this, 'shadowBlur', value);
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'shadowColor',
        get: function shadowColor() {
            return getPrivateProp(this, 'shadowColor') || 'rgba(0, 0, 0, 0)';
        },
        set: function shadowColor(value) {
            return setPrivateProp(this, 'shadowColor', value);
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'lineWidth',
        get: function lineWidth() {
            return getPrivateProp(this, 'lineWidth') || 1;
        },
        set: function lineWidth(value) {
            return setPrivateProp(this, 'lineWidth', value);
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'lineCap',
        get: function lineCap() {
            return getPrivateProp(this, 'lineCap') || 'butt';
        },
        set: function lineCap(value) {
            return setPrivateProp(this, 'lineCap', value);
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'lineJoin',
        get: function lineJoin() {
            return getPrivateProp(this, 'lineJoin') || 'miter';
        },
        set: function lineJoin(value) {
            return setPrivateProp(this, 'lineJoin', value);
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'miterLimit',
        get: function miterLimit() {
            return getPrivateProp(this, 'miterLimit') || 10;
        },
        set: function miterLimit(value) {
            return setPrivateProp(this, 'miterLimit', value);
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'lineDashOffset',
        get: function lineDashOffset() {
            return getPrivateProp(this, 'lineDashOffset') || 0;
        },
        set: function lineDashOffset(value) {
            return setPrivateProp(this, 'lineDashOffset', value);
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'font',
        get: function font() {
            return getPrivateProp(this, 'font') || '10px sans-serif';
        },
        set: function font(value) {
            return setPrivateProp(this, 'font', value);
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'textAlign',
        get: function textAlign() {
            return getPrivateProp(this, 'textAlign') || 'start';
        },
        set: function textAlign(value) {
            return setPrivateProp(this, 'textAlign', value);
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'textBaseline',
        get: function textBaseline() {
            return getPrivateProp(this, 'textBaseline') || 'alphabetic';
        },
        set: function textBaseline(value) {
            return setPrivateProp(this, 'textBaseline', value);
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'direction',
        get: function direction() {
            return getPrivateProp(this, 'direction') || 'ltr';
        },
        set: function direction(value) {
            return setPrivateProp(this, 'direction', value);
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'fontKerning',
        get: function fontKerning() {
            return getPrivateProp(this, 'fontKerning') || 'auto';
        },
        set: function fontKerning(value) {
            return setPrivateProp(this, 'fontKerning', value);
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'fontStretch',
        get: function fontStretch() {
            return getPrivateProp(this, 'fontStretch') || 'normal';
        },
        set: function fontStretch(value) {
            return setPrivateProp(this, 'fontStretch', value);
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'fontVariantCaps',
        get: function fontVariantCaps() {
            return getPrivateProp(this, 'fontVariantCaps') || 'normal';
        },
        set: function fontVariantCaps(value) {
            return setPrivateProp(this, 'fontVariantCaps', value);
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'letterSpacing',
        get: function letterSpacing() {
            return getPrivateProp(this, 'letterSpacing') || '0px';
        },
        set: function letterSpacing(value) {
            return setPrivateProp(this, 'letterSpacing', value);
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'textRendering',
        get: function textRendering() {
            return getPrivateProp(this, 'textRendering') || 'auto';
        },
        set: function textRendering(value) {
            return setPrivateProp(this, 'textRendering', value);
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'wordSpacing',
        get: function wordSpacing() {
            return getPrivateProp(this, 'wordSpacing') || '0px';
        },
        set: function wordSpacing(value) {
            return setPrivateProp(this, 'wordSpacing', value);
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {name: 'clip'});
    addObjProp(CanvasRenderingContext2D.prototype, {name: 'createConicGradient'});
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'createImageData',
        value: function createImageData(width,height){
            return new ImageData(width, height);
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {name: 'createLinearGradient'});
    addObjProp(CanvasRenderingContext2D.prototype, {name: 'createPattern'});
    addObjProp(CanvasRenderingContext2D.prototype, {name: 'createRadialGradient'});
    addObjProp(CanvasRenderingContext2D.prototype, {name: 'drawFocusIfNeeded'});
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'drawImage',
        valueOf: function drawImage(img, x, y, width, height) {
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'fill',
        value: function file() {
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'fillText',
        value: function fillText(text, x, y) {
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {name: 'getContextAttributes'});
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'getImageData',
        value: function getImageData(x,y,width,height) {
            return new ImageData(width,height);
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {name: 'getLineDash'});
    addObjProp(CanvasRenderingContext2D.prototype, {name: 'getTransform'});
    addObjProp(CanvasRenderingContext2D.prototype, {name: 'isContextLost'});
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'isPointInPath',
        value: function isPointInPath(x, y, fillRule = "nonzero") {
            const canvas = getPrivateProp(this, 'canvas');
            const setName = `isPointInPath_${x}_${y}_${fillRule}`;
            chalkLog('red', `调用了canvas的isPointInPath，需要通过setPrivateProp(canvas,${setName})设置返回值`);
            return getPrivateProp(canvas, setName);
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'isPointInStroke',
        value: function isPointInStroke(x, y, fillRule = "nonzero") {
            const canvasContext = getPrivateProp(this, 'canvas');
            const setName = `isPointInStroke_${x}_${y}_${fillRule}`;
            chalkLog('red', `调用了canvas的isPointInStroke，需要通过setPrivateProp(canvas,${setName})设置返回值`);
            return getPrivateProp(canvasContext, setName);
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'measureText',
        value: function measureText(text){
            getFunctionCallCount(funCallNu.measureText,text);
            const canvasContext = getPrivateProp(this, 'canvas');
            const setName = `measureText_${text}_${funCallNu.measureText[text]}`;
            chalkLog('red', `调用了canvas的measureText，需要通过setPrivateProp(canvas,${setName})设置返回值`);
            return getPrivateProp(canvasContext, setName);
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'putImageData',
        value: function putImageData(imageData, dx, dy) {
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'reset',
        value: function reset() {
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'roundRect',
        value: function roundRect(x, y, width, height) {
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'save',
        value: function save() {
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'scale',
        value: function scale(xFactor, yFactor) {
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'setLineDash',
        value: function setLineDash(dashArray) {
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'setTransform',
        value: function setTransform(a, b, c, d, e, f) {
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'stroke',
        value: function stroke() {
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'strokeText',
        value: function strokeText(string, x, y) {
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'transform',
        value: function transform(a, b, c, d, e, f) {
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'translate',
        value: function translate(x, y) {
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'arc',
        value: function arc(x, y, radius, startAngle, endAngle) {
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'arcTo',
        value: function arcTo(x1, y1, x2, y2, radius) {
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'beginPath',
        value: function arcTo() {
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'bezierCurveTo',
        value: function bezierCurveTo(cP1X, cP1Y, cP2X, cP2Y, eX, eY) {
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'clearRect',
        value: function clearRect(x, y, width, height) {
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'closePath',
        value: function closePath() {
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'ellipse',
        value: function ellipse(x, y, rx, ry, rotation, startAngle, endAngle) {
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'fillRect',
        value: function fillRect(x, y, width, height) {
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'lineTo',
        value: function lineTo(x, y) {
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'moveTo',
        value: function moveTo(x, y) {
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'quadraticCurveTo',
        value: function quadraticCurveTo(cx1, cy1, x, y) {
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'rect',
        value: function rect(x, y, width, height) {
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'resetTransform',
        value: function resetTransform() {
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'restore',
        value: function restore() {
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'rotate',
        value: function rotate(angle) {
        }
    });
    addObjProp(CanvasRenderingContext2D.prototype, {
        name: 'strokeRect',
        value: function strokeRect(x, y, width, height) {
        }
    });
})

module.exports = CanvasRenderingContext2D;