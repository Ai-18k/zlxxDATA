const {
    getPrivateProp,
    setPrivateProp,
    setFunctionPrototype,
    addObjProp,
    chalkLog
} = require("../../utility.js");


function TextMetrics() {
}

setFunctionPrototype(TextMetrics, () => {
    addObjProp(TextMetrics.prototype, {
        name: 'width',
        get: function width() {
            return getPrivateProp(this, 'width')
        }
    });
    addObjProp(TextMetrics.prototype, {
        name: 'actualBoundingBoxLeft',
        get: function actualBoundingBoxLeft() {
            return getPrivateProp(this, 'actualBoundingBoxLeft')
        }
    });
    addObjProp(TextMetrics.prototype, {
        name: 'actualBoundingBoxRight',
        get: function actualBoundingBoxRight() {
            return getPrivateProp(this, 'actualBoundingBoxRight')
        }
    });
    addObjProp(TextMetrics.prototype, {
        name: 'fontBoundingBoxAscent',
        get: function fontBoundingBoxAscent() {
            return getPrivateProp(this, 'fontBoundingBoxAscent')
        }
    });
    addObjProp(TextMetrics.prototype, {
        name: 'fontBoundingBoxDescent',
        get: function fontBoundingBoxDescent() {
            return getPrivateProp(this, 'fontBoundingBoxDescent')
        }
    });
    addObjProp(TextMetrics.prototype, {
        name: 'actualBoundingBoxAscent',
        get: function actualBoundingBoxAscent() {
            return getPrivateProp(this, 'actualBoundingBoxAscent')
        }
    });
    addObjProp(TextMetrics.prototype, {
        name: 'actualBoundingBoxDescent',
        get: function actualBoundingBoxDescent() {
            return getPrivateProp(this, 'actualBoundingBoxDescent')
        }
    });
    addObjProp(TextMetrics.prototype, {
        name: 'hangingBaseline',
        get: function hangingBaseline() {
            return getPrivateProp(this, 'hangingBaseline')
        }
    });
    addObjProp(TextMetrics.prototype, {
        name: 'alphabeticBaseline',
        get: function alphabeticBaseline() {
            return getPrivateProp(this, 'alphabeticBaseline')
        }
    });
    addObjProp(TextMetrics.prototype, {
        name: 'ideographicBaseline',
        get: function ideographicBaseline() {
            return getPrivateProp(this, 'ideographicBaseline')
        }
    });
});

module.exports = TextMetrics;