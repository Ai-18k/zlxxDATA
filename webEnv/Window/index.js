const {
    envOption,
    CreateGenerate,
    addObjProp,
    getPrivateProp,
    setPrivateProp,
    chalkLog,
    createError,
    originObject,
    originMath
} = require("../utility.js");
const {
    Navigator, BatteryManager, Plugin,
    MimeType, MimeTypeArray, PluginArray,
    NetworkInformation, LockManager
} = require("../Navigator/api");
const {
    Window, EventTarget, NodeList, Node,
    RadioNodeList, History, Request, XMLHttpRequest,
    XMLHttpRequestEventTarget, DOMStringList, Event,
    URL, URLSearchParams, MutationObserver, MutationRecord,
    Screen, ScreenOrientation, Location, Storage,
    EventCounts, Worker, VisualViewport
} = require("../CommonApi/api");
const {
    Performance,
    PerformanceTiming,
    PerformanceNavigation,
    PerformanceObserver
} = require("../PerformanceApi/api");
const {
    IDBCursor, IDBCursorWithValue, IDBDatabase,
    IDBFactory, IDBIndex, IDBObjectStore, IDBOpenDBRequest,
    IDBRequest, IDBTransaction, IDBVersionChangeEvent
} = require("../IndexedDB/api");
const {
    HTMLCollection, HTMLAllCollection, Document,
    DocumentType, HTMLDocument, XPathExpression,
    DocumentTimeline, AnimationTimeline, DOMImplementation,
    XMLDocument
} = require("../Document/api");
const {
    Element, HTMLElement, styleProp,
    CSSStyleDeclaration, CSSNumericValue, CSSStyleValue,
    CSSUnitValue, StylePropertyMap, NamedNodeMap,
} = require("../HTML/api");
const {
    Text,
    CharacterData
} = require("../TextApi");
const {
    CanvasRenderingContext2D, WebGLRenderingContext, WebGLObject,
    WebGLBuffer, WebGLProgram, WebGLShader,
    WebGLUniformLocation, ImageData, WebGL2RenderingContext,
    WebGLShaderPrecisionFormat, TextMetrics
} = require("../CanvasApi");
const {
    HTMLHtmlElement, HTMLHeadElement, HTMLMetaElement, HTMLScriptElement,
    HTMLBodyElement, HTMLDivElement, HTMLAnchorElement, HTMLFormElement,
    HTMLInputElement, HTMLCanvasElement, HTMLMediaElement, HTMLAudioElement,
    HTMLVideoElement, HTMLIFrameElement
} = require("../TagApi");
const {Blob, File, webkitRequestFileSystem} = require("../FileSystem");
const {MediaQueryList, matchMedia} = require("../Media");
const {WebSocket} = require("../WebSocket");
const createStorage = require("./storage.js");
const createLocation = require("./location.js");
const {createNavigator, setNavigatorMimeTypes} = require("./navigator.js");
const createDocument = require("./document.js");
const createChrome = require("./chrome.js");
const createIndexedDB = require("./indexedDB.js");
const createScreen = require("./screen.js");
const oldGlobal = global;
envOption.dev = true;

/**
 * @method createWindow 创建window对象
 * @param {Object} options 配置项
 * @param {Array} options[mimeTypesOptions] 需要设置的Navigator.mimeTypes属性
 * @param {Boolean} options[mimeTypesOptions].enabledPluginAlike enabledPlugin属性是否一致
 * @param {Array} options[mimeTypesOptions].mimeTypes 需要设置的mimeTypes属
 * @param {Boolean} options[hasChromeApp] chrome中是否包含app属性
 * **/
function createWindow(options = {}) {
    const document = createDocument();
    const location = createLocation();
    const navigator = createNavigator(options.mimeTypesOptions);
    const chrome = createChrome({
        hasChromeApp: options.hasChromeApp
    });
    const indexedDB = createIndexedDB();
    const screen = createScreen();
    const {localStorage, sessionStorage} = createStorage();
    const performanceObj = new Performance();
    const history = new History();

    const visualViewport = new VisualViewport();
    setPrivateProp(visualViewport,'height',590);
    setPrivateProp(visualViewport,'width',1349);
    setPrivateProp(visualViewport,'scale',1);
    setPrivateProp(visualViewport,'pageTop',132);
    setPrivateProp(visualViewport,'pageLeft',0);
    setPrivateProp(visualViewport,'offsetTop',0);
    setPrivateProp(visualViewport,'offsetLeft',0);

    const cryptoDesc = Object.getOwnPropertyDescriptor(oldGlobal, 'crypto');
    const globalQueueMicrotask = queueMicrotask;
    const globalStructuredClone = structuredClone;
    const globalAtob = atob;
    const globalBtoa = btoa;
    const globalFetch = fetch;

    //定时器标识符，setTimeout、setInterval调用后会返回一个标识符，重写定时器时用于返回标识符
    let timerMark = 0;

    let window = {};
    try {
        window = global;
    } catch (e) {
        window = {}
    }
    window.__proto__ = Window.prototype;
    window.__proto__.__proto__ = {
        [Symbol.toStringTag]: 'WindowProperties'
    };
    window.__proto__.__proto__.__proto__ = EventTarget.prototype;
    addObjProp(window, {
        name: Symbol.toStringTag,
        value: 'Window',
        enumerable: false,
        writable: false
    });

    //删除window中没有的key
    delete window[Symbol.toStringTag];
    delete window.__filename;
    delete window.__dirname;
    delete window.clearImmediate;
    delete window.setImmediate;
    delete window.Buffer;
    delete window.SharedArrayBuffer;
    delete window.global;
    //以下属性都会重写
    delete window.clearInterval;
    delete window.clearTimeout;
    delete window.setInterval;
    delete window.setTimeout;
    delete window.queueMicrotask;
    delete window.structuredClone;
    delete window.atob;
    delete window.btoa;
    delete window.performance;
    delete window.fetch;
    delete window.crypto;

    setPrivateProp(window, 'window', window);

    addObjProp(window, {
        name: 'Object',
        value: Object,
        enumerable: false
    });
    addObjProp(window, {
        name: 'Function',
        value: Function,
        enumerable: false
    });
    addObjProp(window, {
        name: 'Array',
        value: Array,
        enumerable: false
    });
    addObjProp(window, {
        name: 'Number',
        value: Number,
        enumerable: false
    });
    addObjProp(window, {
        name: 'parseFloat',
        value: parseFloat,
        enumerable: false
    });
    addObjProp(window, {
        name: 'parseInt',
        value: parseInt,
        enumerable: false
    });
    addObjProp(window, {
        name: 'Infinity',
        value: Infinity,
        writable: false,
        configurable: false,
        enumerable: false
    });
    addObjProp(window, {
        name: 'NaN',
        value: NaN,
        writable: false,
        configurable: false,
        enumerable: false
    });
    addObjProp(window, {
        name: 'undefined',
        value: undefined,
        writable: false,
        configurable: false,
        enumerable: false
    });
    addObjProp(window, {
        name: 'Boolean',
        value: Boolean,
        enumerable: false
    });
    addObjProp(window, {
        name: 'String',
        value: String,
        enumerable: false
    });
    addObjProp(window, {
        name: 'Symbol',
        value: Symbol,
        enumerable: false
    });
    addObjProp(window, {
        name: 'Date',
        value: Date,
        enumerable: false
    });
    addObjProp(window, {
        name: 'Promise',
        value: Promise,
        enumerable: false
    });
    addObjProp(window, {
        name: 'RegExp',
        value: RegExp,
        enumerable: false
    });
    addObjProp(window, {
        name: 'Error',
        value: Error,
        enumerable: false
    });
    addObjProp(window, {
        name: 'AggregateError',
        value: AggregateError,
        enumerable: false
    });
    addObjProp(window, {
        name: 'EvalError',
        value: EvalError,
        enumerable: false
    });
    addObjProp(window, {
        name: 'RangeError',
        value: RangeError,
        enumerable: false
    });
    addObjProp(window, {
        name: 'ReferenceError',
        value: ReferenceError,
        enumerable: false
    });
    addObjProp(window, {
        name: 'SyntaxError',
        value: SyntaxError,
        enumerable: false
    });
    addObjProp(window, {
        name: 'TypeError',
        value: TypeError,
        enumerable: false
    });
    addObjProp(window, {
        name: 'URIError',
        value: URIError,
        enumerable: false
    });
    addObjProp(window, {
        name: 'globalThis',
        value: globalThis,
        enumerable: false
    });
    addObjProp(window, {
        name: 'JSON',
        value: JSON,
        enumerable: false
    });
    addObjProp(window, {
        name: 'Math',
        value: Math,
        enumerable: false
    });
    addObjProp(window, {
        name: 'Intl',
        value: Intl,
        enumerable: false
    });
    addObjProp(window, {
        name: 'ArrayBuffer',
        value: ArrayBuffer,
        enumerable: false
    });
    addObjProp(window, {
        name: 'Atomics',
        value: Atomics,
        enumerable: false
    });
    addObjProp(window, {
        name: 'Uint8Array',
        value: Uint8Array,
        enumerable: false
    });
    addObjProp(window, {
        name: 'Int8Array',
        value: Int8Array,
        enumerable: false
    });
    addObjProp(window, {
        name: 'Uint16Array',
        value: Uint16Array,
        enumerable: false
    });
    addObjProp(window, {
        name: 'Int16Array',
        value: Int16Array,
        enumerable: false
    });
    addObjProp(window, {
        name: 'Uint32Array',
        value: Uint32Array,
        enumerable: false
    });
    addObjProp(window, {
        name: 'Int32Array',
        value: Int32Array,
        enumerable: false
    });
    addObjProp(window, {
        name: 'Float32Array',
        value: Float32Array,
        enumerable: false
    });
    addObjProp(window, {
        name: 'Float64Array',
        value: Float64Array,
        enumerable: false
    });
    addObjProp(window, {
        name: 'Uint8ClampedArray',
        value: Uint8ClampedArray,
        enumerable: false
    });
    addObjProp(window, {
        name: 'BigUint64Array',
        value: BigUint64Array,
        enumerable: false
    });
    addObjProp(window, {
        name: 'BigInt64Array',
        value: BigInt64Array,
        enumerable: false
    });
    addObjProp(window, {
        name: 'DataView',
        value: DataView,
        enumerable: false
    });
    addObjProp(window, {
        name: 'Map',
        value: Map,
        enumerable: false
    });
    addObjProp(window, {
        name: 'BigInt',
        value: BigInt,
        enumerable: false
    });
    addObjProp(window, {
        name: 'Set',
        value: Set,
        enumerable: false
    });
    addObjProp(window, {
        name: 'WeakMap',
        value: WeakMap,
        enumerable: false
    });
    addObjProp(window, {
        name: 'WeakSet',
        value: WeakSet,
        enumerable: false
    });
    addObjProp(window, {
        name: 'Proxy',
        value: Proxy,
        enumerable: false
    });
    addObjProp(window, {
        name: 'Reflect',
        value: Reflect,
        enumerable: false
    });
    addObjProp(window, {
        name: 'FinalizationRegistry',
        value: FinalizationRegistry,
        enumerable: false
    });
    addObjProp(window, {
        name: 'WeakRef',
        value: WeakRef,
        enumerable: false
    });
    addObjProp(window, {
        name: 'decodeURI',
        value: decodeURI,
        enumerable: false
    });
    addObjProp(window, {
        name: 'decodeURIComponent',
        value: decodeURIComponent,
        enumerable: false
    });
    addObjProp(window, {
        name: 'encodeURI',
        value: encodeURI,
        enumerable: false
    });
    addObjProp(window, {
        name: 'encodeURIComponent',
        value: encodeURIComponent,
        enumerable: false
    });
    addObjProp(window, {
        name: 'escape',
        value: escape,
        enumerable: false
    });
    addObjProp(window, {
        name: 'unescape',
        value: unescape,
        enumerable: false
    });
    addObjProp(window, {
        name: 'eval',
        value: eval,
        enumerable: false
    });
    addObjProp(window, {
        name: 'isFinite',
        value: isFinite,
        enumerable: false
    });
    addObjProp(window, {
        name: 'isNaN',
        value: isNaN,
        enumerable: false
    });
    addObjProp(window, {
        name: 'console',
        value: console,
        enumerable: false
    });
    addObjProp(window, {
        name: 'Option',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Image',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Audio',
        enumerable: false,
        value: HTMLAudioElement
    });
    addObjProp(window, {
        name: 'webkitURL',
        enumerable: false
    });
    addObjProp(window, {
        name: 'webkitRTCPeerConnection',
        enumerable: false
    });
    addObjProp(window, {
        name: 'webkitMediaStream',
        enumerable: false
    });
    addObjProp(window, {
        name: 'WebKitMutationObserver',
        enumerable: false
    });
    addObjProp(window, {
        name: 'WebKitCSSMatrix',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XSLTProcessor',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XPathResult',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XPathExpression',
        enumerable: false,
        value: XPathExpression
    });
    addObjProp(window, {
        name: 'XPathEvaluator',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XMLSerializer',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XMLHttpRequestUpload',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XMLHttpRequestEventTarget',
        enumerable: false,
        value: XMLHttpRequestEventTarget
    });
    addObjProp(window, {
        name: 'XMLHttpRequest',
        enumerable: false,
        value: XMLHttpRequest
    });
    addObjProp(window, {
        name: 'XMLDocument',
        enumerable: false,
        value: XMLDocument
    });
    addObjProp(window, {
        name: 'WritableStreamDefaultWriter',
        enumerable: false
    });
    addObjProp(window, {
        name: 'WritableStreamDefaultController',
        enumerable: false
    });
    addObjProp(window, {
        name: 'WritableStream',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Worker',
        enumerable: false,
        value: Worker
    });
    addObjProp(window, {
        name: 'WindowControlsOverlayGeometryChangeEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'WindowControlsOverlay',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Window',
        value: Window,
        enumerable: false
    });
    addObjProp(window, {
        name: 'WheelEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'WebSocket',
        value: WebSocket,
        enumerable: false
    });
    addObjProp(window, {
        name: 'WebGLVertexArrayObject',
        enumerable: false
    });
    addObjProp(window, {
        name: 'WebGLUniformLocation',
        value: WebGLUniformLocation,
        enumerable: false
    });
    addObjProp(window, {
        name: 'WebGLTransformFeedback',
        enumerable: false
    });
    addObjProp(window, {
        name: 'WebGLTexture',
        enumerable: false
    });
    addObjProp(window, {
        name: 'WebGLSync',
        enumerable: false
    });
    addObjProp(window, {
        name: 'WebGLShaderPrecisionFormat',
        enumerable: false,
        value: WebGLShaderPrecisionFormat
    });
    addObjProp(window, {
        name: 'WebGLShader',
        value: WebGLShader,
        enumerable: false
    });
    addObjProp(window, {
        name: 'WebGLSampler',
        enumerable: false
    });
    addObjProp(window, {
        name: 'WebGLRenderingContext',
        value: WebGLRenderingContext,
        enumerable: false
    });
    addObjProp(window, {
        name: 'WebGLRenderbuffer',
        enumerable: false
    });
    addObjProp(window, {
        name: 'WebGLQuery',
        enumerable: false
    });
    addObjProp(window, {
        name: 'WebGLProgram',
        value: WebGLProgram,
        enumerable: false
    });
    addObjProp(window, {
        name: 'WebGLObject',
        value: WebGLObject,
        enumerable: false
    });
    addObjProp(window, {
        name: 'WebGLFramebuffer',
        enumerable: false
    });
    addObjProp(window, {
        name: 'WebGLContextEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'WebGLBuffer',
        value: WebGLBuffer,
        enumerable: false
    });
    addObjProp(window, {
        name: 'WebGLActiveInfo',
        enumerable: false
    });
    addObjProp(window, {
        name: 'WebGL2RenderingContext',
        enumerable: false,
        value: WebGL2RenderingContext
    });
    addObjProp(window, {
        name: 'WaveShaperNode',
        enumerable: false
    });
    addObjProp(window, {
        name: 'VisualViewport',
        enumerable: false,
        value: VisualViewport
    });
    addObjProp(window, {
        name: 'VisibilityStateEntry',
        enumerable: false
    });
    addObjProp(window, {
        name: 'VirtualKeyboardGeometryChangeEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ViewTransition',
        enumerable: false
    });
    addObjProp(window, {
        name: 'VideoPlaybackQuality',
        enumerable: false
    });
    addObjProp(window, {
        name: 'VideoFrame',
        enumerable: false
    });
    addObjProp(window, {
        name: 'VideoColorSpace',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ValidityState',
        enumerable: false
    });
    addObjProp(window, {
        name: 'VTTCue',
        enumerable: false
    });
    addObjProp(window, {
        name: 'UserActivation',
        enumerable: false
    });
    addObjProp(window, {
        name: 'URLSearchParams',
        enumerable: false,
        value: URLSearchParams
    });
    addObjProp(window, {
        name: 'URLPattern',
        enumerable: false
    });
    addObjProp(window, {
        name: 'URL',
        enumerable: false,
        value: URL
    });
    addObjProp(window, {
        name: 'UIEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'TrustedTypePolicyFactory',
        enumerable: false
    });
    addObjProp(window, {
        name: 'TrustedTypePolicy',
        enumerable: false
    });
    addObjProp(window, {
        name: 'TrustedScriptURL',
        enumerable: false
    });
    addObjProp(window, {
        name: 'TrustedScript',
        enumerable: false
    });
    addObjProp(window, {
        name: 'TrustedHTML',
        enumerable: false
    });
    addObjProp(window, {
        name: 'TreeWalker',
        enumerable: false
    });
    addObjProp(window, {
        name: 'TransitionEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'TransformStreamDefaultController',
        enumerable: false
    });
    addObjProp(window, {
        name: 'TransformStream',
        enumerable: false
    });
    addObjProp(window, {
        name: 'TrackEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'TouchList',
        enumerable: false
    });
    addObjProp(window, {
        name: 'TouchEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Touch',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ToggleEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'TimeRanges',
        enumerable: false
    });
    addObjProp(window, {
        name: 'TextUpdateEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'TextTrackList',
        enumerable: false
    });
    addObjProp(window, {
        name: 'TextTrackCueList',
        enumerable: false
    });
    addObjProp(window, {
        name: 'TextTrackCue',
        enumerable: false
    });
    addObjProp(window, {
        name: 'TextTrack',
        enumerable: false
    });
    addObjProp(window, {
        name: 'TextMetrics',
        enumerable: false,
        value: TextMetrics
    });
    addObjProp(window, {
        name: 'TextFormatUpdateEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'TextFormat',
        enumerable: false
    });
    addObjProp(window, {
        name: 'TextEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'TextEncoderStream',
        enumerable: false
    });
    addObjProp(window, {
        name: 'TextEncoder',
        enumerable: false
    });
    addObjProp(window, {
        name: 'TextDecoderStream',
        enumerable: false
    });
    addObjProp(window, {
        name: 'TextDecoder',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Text',
        enumerable: false,
        value: Text
    });
    addObjProp(window, {
        name: 'TaskSignal',
        enumerable: false
    });
    addObjProp(window, {
        name: 'TaskPriorityChangeEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'TaskController',
        enumerable: false
    });
    addObjProp(window, {
        name: 'TaskAttributionTiming',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SyncManager',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SubmitEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'StyleSheetList',
        enumerable: false
    });
    addObjProp(window, {
        name: 'StyleSheet',
        enumerable: false
    });
    addObjProp(window, {
        name: 'StylePropertyMap',
        value: StylePropertyMap,
        enumerable: false
    });
    addObjProp(window, {
        name: 'StylePropertyMap',
        value: StylePropertyMap,
        enumerable: false
    });
    addObjProp(window, {
        name: 'StorageEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Storage',
        value: Storage,
        enumerable: false
    });
    addObjProp(window, {
        name: 'StereoPannerNode',
        enumerable: false
    });
    addObjProp(window, {
        name: 'StaticRange',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SourceBufferList',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SourceBuffer',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ShadowRoot',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Selection',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SecurityPolicyViolationEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ScriptProcessorNode',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ScreenOrientation',
        value: ScreenOrientation,
        enumerable: false
    });
    addObjProp(window, {
        name: 'Screen',
        value: Screen,
        enumerable: false
    });
    addObjProp(window, {
        name: 'Scheduling',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Scheduler',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGViewElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGUseElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGUnitTypes',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGTransformList',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGTransform',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGTitleElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGTextPositioningElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGTextPathElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGTextElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGTextContentElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGTSpanElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGSymbolElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGSwitchElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGStyleElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGStringList',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGStopElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGSetElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGScriptElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGSVGElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGRectElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGRect',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGRadialGradientElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGPreserveAspectRatio',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGPolylineElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGPolygonElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGPointList',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGPoint',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGPatternElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGPathElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGNumberList',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGNumber',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGMetadataElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGMatrix',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGMaskElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGMarkerElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGMPathElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGLinearGradientElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGLineElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGLengthList',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGLength',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGImageElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGGraphicsElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGGradientElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGGeometryElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGGElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGForeignObjectElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGFilterElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGFETurbulenceElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGFETileElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGFESpotLightElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGFESpecularLightingElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGFEPointLightElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGFEOffsetElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGFEMorphologyElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGFEMergeNodeElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGFEMergeElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGFEImageElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGFEGaussianBlurElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGFEFuncRElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGFEFuncGElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGFEFuncBElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGFEFuncAElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGFEFloodElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGFEDropShadowElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGFEDistantLightElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGFEDisplacementMapElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGFEDiffuseLightingElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGFEConvolveMatrixElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGFECompositeElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGFEComponentTransferElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGFEColorMatrixElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGFEBlendElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGEllipseElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGDescElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGDefsElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGComponentTransferFunctionElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGClipPathElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGCircleElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGAnimationElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGAnimatedTransformList',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGAnimatedString',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGAnimatedRect',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGAnimatedPreserveAspectRatio',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGAnimatedNumberList',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGAnimatedNumber',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGAnimatedLengthList',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGAnimatedLength',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGAnimatedInteger',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGAnimatedEnumeration',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGAnimatedBoolean',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGAnimatedAngle',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGAnimateTransformElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGAnimateMotionElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGAnimateElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGAngle',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SVGAElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Response',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ResizeObserverSize',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ResizeObserverEntry',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ResizeObserver',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Request',
        enumerable: false,
        value: Request
    });
    addObjProp(window, {
        name: 'ReportingObserver',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ReadableStreamDefaultReader',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ReadableStreamDefaultController',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ReadableStreamBYOBRequest',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ReadableStreamBYOBReader',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ReadableStream',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ReadableByteStreamController',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Range',
        enumerable: false
    });
    addObjProp(window, {
        name: 'RadioNodeList',
        enumerable: false,
        value: RadioNodeList
    });
    addObjProp(window, {
        name: 'RTCTrackEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'RTCStatsReport',
        enumerable: false
    });
    addObjProp(window, {
        name: 'RTCSessionDescription',
        enumerable: false
    });
    addObjProp(window, {
        name: 'RTCSctpTransport',
        enumerable: false
    });
    addObjProp(window, {
        name: 'RTCRtpTransceiver',
        enumerable: false
    });
    addObjProp(window, {
        name: 'RTCRtpSender',
        enumerable: false
    });
    addObjProp(window, {
        name: 'RTCRtpReceiver',
        enumerable: false
    });
    addObjProp(window, {
        name: 'RTCPeerConnectionIceEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'RTCPeerConnectionIceErrorEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'RTCPeerConnection',
        enumerable: false
    });
    addObjProp(window, {
        name: 'RTCIceTransport',
        enumerable: false
    });
    addObjProp(window, {
        name: 'RTCIceCandidate',
        enumerable: false
    });
    addObjProp(window, {
        name: 'RTCErrorEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'RTCError',
        enumerable: false
    });
    addObjProp(window, {
        name: 'RTCEncodedVideoFrame',
        enumerable: false
    });
    addObjProp(window, {
        name: 'RTCEncodedAudioFrame',
        enumerable: false
    });
    addObjProp(window, {
        name: 'RTCDtlsTransport',
        enumerable: false
    });
    addObjProp(window, {
        name: 'RTCDataChannelEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'RTCDTMFToneChangeEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'RTCDTMFSender',
        enumerable: false
    });
    addObjProp(window, {
        name: 'RTCCertificate',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PromiseRejectionEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ProgressEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Profiler',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ProcessingInstruction',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PopStateEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PointerEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PluginArray',
        enumerable: false,
        value: PluginArray
    });
    addObjProp(window, {
        name: 'Plugin',
        enumerable: false,
        value: Plugin
    });
    addObjProp(window, {
        name: 'PictureInPictureWindow',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PictureInPictureEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PeriodicWave',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PerformanceTiming',
        enumerable: false,
        value: PerformanceTiming
    });
    addObjProp(window, {
        name: 'PerformanceServerTiming',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PerformanceResourceTiming',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PerformancePaintTiming',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PerformanceObserverEntryList',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PerformanceObserver',
        enumerable: false,
        value: PerformanceObserver
    });
    addObjProp(window, {
        name: 'PerformanceNavigationTiming',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PerformanceNavigation',
        enumerable: false,
        value: PerformanceNavigation
    });
    addObjProp(window, {
        name: 'PerformanceMeasure',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PerformanceMark',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PerformanceLongTaskTiming',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PerformanceEventTiming',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PerformanceEntry',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PerformanceElementTiming',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Performance',
        enumerable: false,
        value: Performance
    });
    addObjProp(window, {
        name: 'Path2D',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PannerNode',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PageTransitionEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'OverconstrainedError',
        enumerable: false
    });
    addObjProp(window, {
        name: 'OscillatorNode',
        enumerable: false
    });
    addObjProp(window, {
        name: 'OffscreenCanvasRenderingContext2D',
        enumerable: false
    });
    addObjProp(window, {
        name: 'OffscreenCanvas',
        enumerable: false
    });
    addObjProp(window, {
        name: 'OfflineAudioContext',
        enumerable: false
    });
    addObjProp(window, {
        name: 'OfflineAudioCompletionEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'NodeList',
        value: NodeList,
        enumerable: false
    });
    addObjProp(window, {
        name: 'NodeIterator',
        enumerable: false
    });
    addObjProp(window, {
        name: 'NodeFilter',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Node',
        value: Node,
        enumerable: false
    });
    addObjProp(window, {
        name: 'NetworkInformation',
        enumerable: false,
        value: NetworkInformation
    });
    addObjProp(window, {
        name: 'NavigatorUAData',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Navigator',
        value: Navigator,
        enumerable: false
    });
    addObjProp(window, {
        name: 'NavigationTransition',
        enumerable: false
    });
    addObjProp(window, {
        name: 'NavigationHistoryEntry',
        enumerable: false
    });
    addObjProp(window, {
        name: 'NavigationDestination',
        enumerable: false
    });
    addObjProp(window, {
        name: 'NavigationCurrentEntryChangeEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Navigation',
        enumerable: false
    });
    addObjProp(window, {
        name: 'NavigateEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'NamedNodeMap',
        value: NamedNodeMap,
        enumerable: false
    });
    addObjProp(window, {
        name: 'MutationRecord',
        enumerable: false,
        value: MutationRecord
    });
    addObjProp(window, {
        name: 'MutationObserver',
        enumerable: false,
        value: MutationObserver
    });
    addObjProp(window, {
        name: 'MouseEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'MimeTypeArray',
        enumerable: false,
        value: MimeTypeArray
    });
    addObjProp(window, {
        name: 'MimeType',
        enumerable: false,
        value: MimeType
    });
    addObjProp(window, {
        name: 'MessagePort',
        value: MessagePort,
        enumerable: false
    });
    addObjProp(window, {
        name: 'MessageEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'MessageChannel',
        value: MessageChannel,
        enumerable: false
    });
    addObjProp(window, {
        name: 'MediaStreamTrackVideoStats',
        enumerable: false
    });
    addObjProp(window, {
        name: 'MediaStreamTrackProcessor',
        enumerable: false
    });
    addObjProp(window, {
        name: 'MediaStreamTrackGenerator',
        enumerable: false
    });
    addObjProp(window, {
        name: 'MediaStreamTrackEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'MediaStreamTrackAudioStats',
        enumerable: false
    });
    addObjProp(window, {
        name: 'MediaStreamTrack',
        enumerable: false
    });
    addObjProp(window, {
        name: 'MediaStreamEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'MediaStreamAudioSourceNode',
        enumerable: false
    });
    addObjProp(window, {
        name: 'MediaStreamAudioDestinationNode',
        enumerable: false
    });
    addObjProp(window, {
        name: 'MediaStream',
        enumerable: false
    });
    addObjProp(window, {
        name: 'MediaSourceHandle',
        enumerable: false
    });
    addObjProp(window, {
        name: 'MediaSource',
        enumerable: false
    });
    addObjProp(window, {
        name: 'MediaRecorder',
        enumerable: false
    });
    addObjProp(window, {
        name: 'MediaQueryListEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'MediaQueryList',
        value: MediaQueryList,
        enumerable: false
    });
    addObjProp(window, {
        name: 'MediaList',
        enumerable: false
    });
    addObjProp(window, {
        name: 'MediaError',
        enumerable: false
    });
    addObjProp(window, {
        name: 'MediaEncryptedEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'MediaElementAudioSourceNode',
        enumerable: false
    });
    addObjProp(window, {
        name: 'MediaCapabilities',
        enumerable: false
    });
    addObjProp(window, {
        name: 'MathMLElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Location',
        value: Location,
        enumerable: false
    });
    addObjProp(window, {
        name: 'LayoutShiftAttribution',
        enumerable: false
    });
    addObjProp(window, {
        name: 'LayoutShift',
        enumerable: false
    });
    addObjProp(window, {
        name: 'LargestContentfulPaint',
        enumerable: false
    });
    addObjProp(window, {
        name: 'KeyframeEffect',
        enumerable: false
    });
    addObjProp(window, {
        name: 'KeyboardEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'IntersectionObserverEntry',
        enumerable: false
    });
    addObjProp(window, {
        name: 'IntersectionObserver',
        enumerable: false
    });
    addObjProp(window, {
        name: 'InputEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'InputDeviceInfo',
        enumerable: false
    });
    addObjProp(window, {
        name: 'InputDeviceCapabilities',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Ink',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ImageData',
        enumerable: false,
        value: ImageData
    });
    addObjProp(window, {
        name: 'ImageCapture',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ImageBitmapRenderingContext',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ImageBitmap',
        enumerable: false
    });
    addObjProp(window, {
        name: 'IdleDeadline',
        enumerable: false
    });
    addObjProp(window, {
        name: 'IIRFilterNode',
        enumerable: false
    });
    addObjProp(window, {
        name: 'IDBVersionChangeEvent',
        enumerable: false,
        value: IDBVersionChangeEvent
    });
    addObjProp(window, {
        name: 'IDBTransaction',
        enumerable: false,
        value: IDBTransaction
    });
    addObjProp(window, {
        name: 'IDBRequest',
        enumerable: false,
        value: IDBRequest
    });
    addObjProp(window, {
        name: 'IDBOpenDBRequest',
        enumerable: false,
        value: IDBOpenDBRequest
    });
    addObjProp(window, {
        name: 'IDBObjectStore',
        enumerable: false,
        value: IDBObjectStore
    });
    addObjProp(window, {
        name: 'IDBKeyRange',
        enumerable: false
    });
    addObjProp(window, {
        name: 'IDBIndex',
        enumerable: false,
        value: IDBIndex
    });
    addObjProp(window, {
        name: 'IDBFactory',
        enumerable: false,
        value: IDBFactory
    });
    addObjProp(window, {
        name: 'IDBDatabase',
        enumerable: false,
        value: IDBDatabase
    });
    addObjProp(window, {
        name: 'IDBCursorWithValue',
        enumerable: false,
        value: IDBCursorWithValue
    });
    addObjProp(window, {
        name: 'IDBCursor',
        enumerable: false,
        value: IDBCursor
    });
    addObjProp(window, {
        name: 'History',
        value: History,
        enumerable: false
    });
    addObjProp(window, {
        name: 'HighlightRegistry',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Highlight',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Headers',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HashChangeEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLVideoElement',
        value: HTMLVideoElement,
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLUnknownElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLUListElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLTrackElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLTitleElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLTimeElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLTextAreaElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLTemplateElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLTableSectionElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLTableRowElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLTableElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLTableColElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLTableCellElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLTableCaptionElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLStyleElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLSpanElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLSourceElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLSlotElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLSelectElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLScriptElement',
        value: HTMLScriptElement,
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLQuoteElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLProgressElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLPreElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLPictureElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLParamElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLParagraphElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLOutputElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLOptionsCollection',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLOptionElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLOptGroupElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLObjectElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLOListElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLModElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLMeterElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLMetaElement',
        value: HTMLMetaElement,
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLMenuElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLMediaElement',
        value: HTMLMediaElement,
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLMarqueeElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLMapElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLLinkElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLLegendElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLLabelElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLLIElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLInputElement',
        enumerable: false,
        value: HTMLInputElement
    });
    addObjProp(window, {
        name: 'HTMLImageElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLIFrameElement',
        enumerable: false,
        value: HTMLIFrameElement
    });
    addObjProp(window, {
        name: 'HTMLHtmlElement',
        value: HTMLHtmlElement,
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLHeadingElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLHeadElement',
        value: HTMLHeadElement,
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLHRElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLFrameSetElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLFrameElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLFormElement',
        enumerable: false,
        value: HTMLFormElement
    });
    addObjProp(window, {
        name: 'HTMLFormControlsCollection',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLFontElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLFieldSetElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLEmbedElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLElement',
        value: HTMLElement,
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLDocument',
        value: HTMLDocument,
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLDivElement',
        value: HTMLDivElement,
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLDirectoryElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLDialogElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLDetailsElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLDataListElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLDataElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLDListElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLCollection',
        value: HTMLCollection,
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLCanvasElement',
        value: HTMLCanvasElement,
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLButtonElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLBodyElement',
        value: HTMLBodyElement,
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLBaseElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLBRElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLAudioElement',
        value: HTMLAudioElement,
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLAreaElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLAnchorElement',
        enumerable: false,
        value: HTMLAnchorElement
    });
    addObjProp(window, {
        name: 'HTMLAllCollection',
        value: HTMLAllCollection,
        enumerable: false
    });
    addObjProp(window, {
        name: 'GeolocationPositionError',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GeolocationPosition',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GeolocationCoordinates',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Geolocation',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GamepadHapticActuator',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GamepadEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GamepadButton',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Gamepad',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GainNode',
        enumerable: false
    });
    addObjProp(window, {
        name: 'FormDataEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'FormData',
        enumerable: false
    });
    addObjProp(window, {
        name: 'FontFaceSetLoadEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'FontFace',
        enumerable: false
    });
    addObjProp(window, {
        name: 'FocusEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'FileReader',
        enumerable: false
    });
    addObjProp(window, {
        name: 'FileList',
        enumerable: false
    });
    addObjProp(window, {
        name: 'File',
        enumerable: false,
        value: File
    });
    addObjProp(window, {
        name: 'FeaturePolicy',
        enumerable: false
    });
    addObjProp(window, {
        name: 'External',
        enumerable: false
    });
    addObjProp(window, {
        name: 'EventTarget',
        value: EventTarget,
        enumerable: false
    });
    addObjProp(window, {
        name: 'EventSource',
        enumerable: false
    });
    addObjProp(window, {
        name: 'EventCounts',
        enumerable: false,
        value: EventCounts
    });
    addObjProp(window, {
        name: 'Event',
        enumerable: false,
        value: Event
    });
    addObjProp(window, {
        name: 'ErrorEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'EncodedVideoChunk',
        enumerable: false
    });
    addObjProp(window, {
        name: 'EncodedAudioChunk',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ElementInternals',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Element',
        value: Element,
        enumerable: false
    });
    addObjProp(window, {
        name: 'EditContext',
        enumerable: false
    });
    addObjProp(window, {
        name: 'DynamicsCompressorNode',
        enumerable: false
    });
    addObjProp(window, {
        name: 'DragEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'DocumentType',
        value: DocumentType,
        enumerable: false
    });
    addObjProp(window, {
        name: 'DocumentTimeline',
        enumerable: false,
        value: DocumentTimeline
    });
    addObjProp(window, {
        name: 'DocumentFragment',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Document',
        value: Document,
        enumerable: false
    });
    addObjProp(window, {
        name: 'DelegatedInkTrailPresenter',
        enumerable: false
    });
    addObjProp(window, {
        name: 'DelayNode',
        enumerable: false
    });
    addObjProp(window, {
        name: 'DecompressionStream',
        enumerable: false
    });
    addObjProp(window, {
        name: 'DataTransferItemList',
        enumerable: false
    });
    addObjProp(window, {
        name: 'DataTransferItem',
        enumerable: false
    });
    addObjProp(window, {
        name: 'DataTransfer',
        enumerable: false
    });
    addObjProp(window, {
        name: 'DOMTokenList',
        enumerable: false
    });
    addObjProp(window, {
        name: 'DOMStringMap',
        enumerable: false
    });
    addObjProp(window, {
        name: 'DOMStringList',
        enumerable: false,
        value: DOMStringList
    });
    addObjProp(window, {
        name: 'DOMRectReadOnly',
        enumerable: false
    });
    addObjProp(window, {
        name: 'DOMRectList',
        enumerable: false
    });
    addObjProp(window, {
        name: 'DOMRect',
        enumerable: false
    });
    addObjProp(window, {
        name: 'DOMQuad',
        enumerable: false
    });
    addObjProp(window, {
        name: 'DOMPointReadOnly',
        enumerable: false
    });
    addObjProp(window, {
        name: 'DOMPoint',
        enumerable: false
    });
    addObjProp(window, {
        name: 'DOMParser',
        enumerable: false
    });
    addObjProp(window, {
        name: 'DOMMatrixReadOnly',
        enumerable: false
    });
    addObjProp(window, {
        name: 'DOMMatrix',
        enumerable: false
    });
    addObjProp(window, {
        name: 'DOMImplementation',
        enumerable: false,
        value: DOMImplementation
    });
    addObjProp(window, {
        name: 'DOMException',
        enumerable: false
    });
    addObjProp(window, {
        name: 'DOMError',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CustomStateSet',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CustomEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CustomElementRegistry',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Crypto',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CountQueuingStrategy',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ConvolverNode',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ContentVisibilityAutoStateChangeEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ConstantSourceNode',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CompressionStream',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CompositionEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Comment',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CloseWatcher',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CloseEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ClipboardEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CharacterData',
        enumerable: false,
        value: CharacterData
    });
    addObjProp(window, {
        name: 'CharacterBoundsUpdateEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ChannelSplitterNode',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ChannelMergerNode',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CanvasRenderingContext2D',
        value: CanvasRenderingContext2D,
        enumerable: false
    });
    addObjProp(window, {
        name: 'CanvasPattern',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CanvasGradient',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CanvasCaptureMediaStreamTrack',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSVariableReferenceValue',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSUnparsedValue',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSUnitValue',
        value: CSSUnitValue,
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSTranslate',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSTransition',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSTransformValue',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSTransformComponent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSSupportsRule',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSStyleValue',
        value: CSSStyleValue,
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSStyleSheet',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSStyleRule',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSStyleDeclaration',
        enumerable: false,
        value: CSSStyleDeclaration
    });
    addObjProp(window, {
        name: 'CSSStartingStyleRule',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSSkewY',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSSkewX',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSSkew',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSScopeRule',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSScale',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSRuleList',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSRule',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSRotate',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSPropertyRule',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSPositionValue',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSPositionTryRule',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSPositionTryDescriptors',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSPerspective',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSPageRule',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSNumericValue',
        value: CSSNumericValue,
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSNumericArray',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSNamespaceRule',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSMediaRule',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSMatrixComponent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSMathValue',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSMathSum',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSMathProduct',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSMathNegate',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSMathMin',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSMathMax',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSMathInvert',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSMathClamp',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSLayerStatementRule',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSLayerBlockRule',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSKeywordValue',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSKeyframesRule',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSKeyframeRule',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSImportRule',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSImageValue',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSGroupingRule',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSFontPaletteValuesRule',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSFontFaceRule',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSCounterStyleRule',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSContainerRule',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSConditionRule',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSAnimation',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSS',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CDATASection',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ByteLengthQueuingStrategy',
        enumerable: false
    });
    addObjProp(window, {
        name: 'BrowserCaptureMediaStreamTrack',
        enumerable: false
    });
    addObjProp(window, {
        name: 'BroadcastChannel',
        enumerable: false
    });
    addObjProp(window, {
        name: 'BlobEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Blob',
        enumerable: false,
        value: Blob
    });
    addObjProp(window, {
        name: 'BiquadFilterNode',
        enumerable: false
    });
    addObjProp(window, {
        name: 'BeforeUnloadEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'BeforeInstallPromptEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'BaseAudioContext',
        enumerable: false
    });
    addObjProp(window, {
        name: 'BarProp',
        enumerable: false
    });
    addObjProp(window, {
        name: 'AudioWorkletNode',
        enumerable: false
    });
    addObjProp(window, {
        name: 'AudioSinkInfo',
        enumerable: false
    });
    addObjProp(window, {
        name: 'AudioScheduledSourceNode',
        enumerable: false
    });
    addObjProp(window, {
        name: 'AudioProcessingEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'AudioParamMap',
        enumerable: false
    });
    addObjProp(window, {
        name: 'AudioParam',
        enumerable: false
    });
    addObjProp(window, {
        name: 'AudioNode',
        enumerable: false
    });
    addObjProp(window, {
        name: 'AudioListener',
        enumerable: false
    });
    addObjProp(window, {
        name: 'AudioDestinationNode',
        enumerable: false
    });
    addObjProp(window, {
        name: 'AudioData',
        enumerable: false
    });
    addObjProp(window, {
        name: 'AudioContext',
        enumerable: false
    });
    addObjProp(window, {
        name: 'AudioBufferSourceNode',
        enumerable: false
    });
    addObjProp(window, {
        name: 'AudioBuffer',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Attr',
        enumerable: false
    });
    addObjProp(window, {
        name: 'AnimationTimeline',
        enumerable: false,
        value: AnimationTimeline
    });
    addObjProp(window, {
        name: 'AnimationPlaybackEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'AnimationEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'AnimationEffect',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Animation',
        enumerable: false
    });
    addObjProp(window, {
        name: 'AnalyserNode',
        enumerable: false
    });
    addObjProp(window, {
        name: 'AbstractRange',
        enumerable: false
    });
    addObjProp(window, {
        name: 'AbortSignal',
        enumerable: false
    });
    addObjProp(window, {
        name: 'AbortController',
        enumerable: false
    });
    addObjProp(window, {
        name: 'window',
        get: function window() {
            if (!(this instanceof Window)) {
                throw createError("Illegal invocation", "TypeError");
            }
            return getPrivateProp(this, 'window');
        },
        configurable: false
    });
    addObjProp(window, {
        name: 'self',
        get: function self() {
            return getPrivateProp(this, 'self');
        },
        set: function self(value) {
            return setPrivateProp(this, 'self', value);
        }
    });
    addObjProp(window, {
        name: 'document',
        get: function document() {
            return getPrivateProp(this, 'document');
        },
        configurable: false
    });
    addObjProp(window, {
        name: 'name',
        get: function name() {
            return getPrivateProp(this, 'name') || '';
        },
        set: function name(value) {
            return setPrivateProp(this, 'name', value);
        }
    });
    addObjProp(window, {
        name: 'location',
        get: function location() {
            return getPrivateProp(this, 'location');
        },
        set: function location(value) {
            return setPrivateProp(this, 'location', value);
        },
        configurable: false
    });
    addObjProp(window, {
        name: 'customElements',
        get: function customElements() {
            return getPrivateProp(this, 'customElements');
        }
    });
    addObjProp(window, {
        name: 'history',
        get: function history() {
            return getPrivateProp(this, 'history');
        }
    });
    addObjProp(window, {
        name: 'navigation',
        get: function navigation() {
            return getPrivateProp(this, 'navigation');
        },
        set: function navigation(value) {
            return setPrivateProp(this, 'navigation', value);
        }
    });
    addObjProp(window, {
        name: 'locationbar',
        get: function locationbar() {
            return getPrivateProp(this, 'locationbar');
        },
        set: function locationbar(value) {
            return setPrivateProp(this, 'locationbar', value);
        }
    });
    addObjProp(window, {
        name: 'menubar',
        get: function menubar() {
            return getPrivateProp(this, 'menubar');
        },
        set: function menubar(value) {
            return setPrivateProp(this, 'menubar', value);
        }
    });
    addObjProp(window, {
        name: 'personalbar',
        get: function personalbar() {
            return getPrivateProp(this, 'personalbar');
        },
        set: function personalbar(value) {
            return setPrivateProp(this, 'personalbar', value);
        }
    });
    addObjProp(window, {
        name: 'scrollbars',
        get: function scrollbars() {
            return getPrivateProp(this, 'scrollbars');
        },
        set: function scrollbars(value) {
            return setPrivateProp(this, 'scrollbars', value);
        }
    });
    addObjProp(window, {
        name: 'statusbar',
        get: function statusbar() {
            return getPrivateProp(this, 'statusbar');
        },
        set: function statusbar(value) {
            return setPrivateProp(this, 'statusbar', value);
        }
    });
    addObjProp(window, {
        name: 'toolbar',
        get: function toolbar() {
            return getPrivateProp(this, 'toolbar');
        },
        set: function toolbar(value) {
            return setPrivateProp(this, 'toolbar', value);
        }
    });
    addObjProp(window, {
        name: 'status',
        get: function status() {
            return getPrivateProp(this, 'status');
        },
        set: function status(value) {
            return setPrivateProp(this, 'status', value);
        }
    });
    addObjProp(window, {
        name: 'closed',
        get: function closed() {
            return getPrivateProp(this, 'closed');
        }
    });
    addObjProp(window, {
        name: 'frames',
        get: function frames() {
            return getPrivateProp(this, 'frames');
        },
        set: function frames(value) {
            return setPrivateProp(this, 'frames', value);
        }
    });
    addObjProp(window, {
        name: 'length',
        get: function length() {
            return getPrivateProp(this, 'length');
        },
        set: function length(value) {
            return setPrivateProp(this, 'length', value);
        }
    });
    addObjProp(window, {
        name: 'top',
        get: function top() {
            return getPrivateProp(this, 'top');
        },
        configurable: false
    });
    addObjProp(window, {
        name: 'opener',
        get: function opener() {
            return getPrivateProp(this, 'opener');
        },
        set: function opener(value) {
            return setPrivateProp(this, 'opener', value);
        }
    });
    addObjProp(window, {
        name: 'parent',
        get: function parent() {
            return getPrivateProp(this, 'parent');
        },
        set: function parent(value) {
            return setPrivateProp(this, 'parent', value);
        }
    });
    addObjProp(window, {
        name: 'frameElement',
        get: function frameElement() {
            return getPrivateProp(this, 'frameElement');
        }
    });
    addObjProp(window, {
        name: 'navigator',
        get: function navigator() {
            return getPrivateProp(this, 'navigator');
        }
    });
    addObjProp(window, {
        name: 'origin',
        get: function origin() {
            return getPrivateProp(this, 'origin');
        },
        set: function origin(value) {
            return setPrivateProp(this, 'origin', value);
        }
    });
    addObjProp(window, {
        name: 'external',
        get: function external() {
            return getPrivateProp(this, 'external');
        },
        set: function external(value) {
            return setPrivateProp(this, 'external', value);
        }
    });
    addObjProp(window, {
        name: 'screen',
        get: function screen() {
            return getPrivateProp(this, 'screen');
        },
        set: function screen(value) {
            return setPrivateProp(this, 'screen', value);
        }
    });
    addObjProp(window, {
        name: 'innerWidth',
        get: function innerWidth() {
            return getPrivateProp(this, 'innerWidth');
        },
        set: function innerWidth(value) {
            return setPrivateProp(this, 'innerWidth', value);
        }
    });
    addObjProp(window, {
        name: 'innerHeight',
        get: function innerHeight() {
            return getPrivateProp(this, 'innerHeight');
        },
        set: function innerHeight(value) {
            return setPrivateProp(this, 'innerHeight', value);
        }
    });
    addObjProp(window, {
        name: 'scrollX',
        get: function scrollX() {
            return getPrivateProp(this, 'scrollX');
        },
        set: function scrollX(value) {
            return setPrivateProp(this, 'scrollX', value);
        }
    });
    addObjProp(window, {
        name: 'pageXOffset',
        get: function pageXOffset() {
            return getPrivateProp(this, 'pageXOffset');
        },
        set: function pageXOffset(value) {
            return setPrivateProp(this, 'pageXOffset', value);
        }
    });
    addObjProp(window, {
        name: 'scrollY',
        get: function scrollY() {
            return getPrivateProp(this, 'scrollY');
        },
        set: function scrollY(value) {
            return setPrivateProp(this, 'scrollY', value);
        }
    });
    addObjProp(window, {
        name: 'pageYOffset',
        get: function pageYOffset() {
            return getPrivateProp(this, 'pageYOffset');
        },
        set: function pageYOffset(value) {
            return setPrivateProp(this, 'pageYOffset', value);
        }
    });
    addObjProp(window, {
        name: 'visualViewport',
        get: function visualViewport() {
            return getPrivateProp(this, 'visualViewport');
        },
        set: function visualViewport(value) {
            return setPrivateProp(this, 'visualViewport', value);
        }
    });
    addObjProp(window, {
        name: 'screenX',
        get: function screenX() {
            return getPrivateProp(this, 'screenX');
        },
        set: function screenX(value) {
            return setPrivateProp(this, 'screenX', value);
        }
    });
    addObjProp(window, {
        name: 'screenY',
        get: function screenY() {
            return getPrivateProp(this, 'screenY');
        },
        set: function screenY(value) {
            return setPrivateProp(this, 'screenY', value);
        }
    });
    addObjProp(window, {
        name: 'outerWidth',
        get: function outerWidth() {
            return getPrivateProp(this, 'outerWidth');
        },
        set: function outerWidth(value) {
            return setPrivateProp(this, 'outerWidth', value);
        }
    });
    addObjProp(window, {
        name: 'outerHeight',
        get: function outerHeight() {
            return getPrivateProp(this, 'outerHeight');
        },
        set: function outerHeight(value) {
            return setPrivateProp(this, 'outerHeight', value);
        }
    });
    addObjProp(window, {
        name: 'devicePixelRatio',
        get: function devicePixelRatio() {
            return getPrivateProp(this, 'devicePixelRatio');
        },
        set: function devicePixelRatio(value) {
            return setPrivateProp(this, 'devicePixelRatio', value);
        }
    });
    addObjProp(window, {
        name: 'event',
        get: function event() {
            return getPrivateProp(this, 'event');
        },
        set: function event(value) {
            return setPrivateProp(this, 'event', value);
        }
    });
    addObjProp(window, {
        name: 'clientInformation',
        get: function clientInformation() {
            return getPrivateProp(this, 'clientInformation');
        },
        set: function clientInformation(value) {
            return setPrivateProp(this, 'clientInformation', value);
        }
    });
    addObjProp(window, {
        name: 'offscreenBuffering',
        get: function offscreenBuffering() {
            return getPrivateProp(this, 'offscreenBuffering');
        },
        set: function offscreenBuffering(value) {
            return setPrivateProp(this, 'offscreenBuffering', value);
        },
        enumerable: false
    });
    addObjProp(window, {
        name: 'screenLeft',
        get: function screenLeft() {
            return getPrivateProp(this, 'screenLeft');
        },
        set: function screenLeft(value) {
            return setPrivateProp(this, 'screenLeft', value);
        }
    });
    addObjProp(window, {
        name: 'screenTop',
        get: function screenTop() {
            return getPrivateProp(this, 'screenTop');
        },
        set: function screenTop(value) {
            return setPrivateProp(this, 'screenTop', value);
        }
    });
    addObjProp(window, {
        name: 'styleMedia',
        get: function styleMedia() {
            return getPrivateProp(this, 'styleMedia');
        }
    });
    addObjProp(window, {
        name: 'onsearch',
        get: function onsearch() {
            return getPrivateProp(this, 'onsearch');
        },
        set: function onsearch(value) {
            return setPrivateProp(this, 'onsearch', value);
        }
    });
    addObjProp(window, {
        name: 'isSecureContext',
        get: function isSecureContext() {
            return getPrivateProp(this, 'isSecureContext');
        }
    });
    addObjProp(window, {
        name: 'trustedTypes',
        get: function trustedTypes() {
            return getPrivateProp(this, 'trustedTypes');
        }
    });
    addObjProp(window, {
        name: 'performance',
        get: function performance() {
            return getPrivateProp(this, 'performance');
        },
        set: function performance(value) {
            return setPrivateProp(this, 'performance', value);
        }
    });
    addObjProp(window, {
        name: 'onappinstalled',
        get: function onappinstalled() {
            return getPrivateProp(this, 'onappinstalled');
        },
        set: function onappinstalled(value) {
            return setPrivateProp(this, 'onappinstalled', value);
        }
    });
    addObjProp(window, {
        name: 'onbeforeinstallprompt',
        get: function onbeforeinstallprompt() {
            return getPrivateProp(this, 'onbeforeinstallprompt');
        },
        set: function onbeforeinstallprompt(value) {
            return setPrivateProp(this, 'onbeforeinstallprompt', value);
        }
    });
    addObjProp(window, {
        name: 'crypto',
        get: function crypto() {
            return cryptoDesc.get(...arguments);
        }
    });
    addObjProp(window, {
        name: 'indexedDB',
        get: function indexedDB() {
            return getPrivateProp(this, 'indexedDB');
        }
    });
    addObjProp(window, {
        name: 'sessionStorage',
        get: function sessionStorage() {
            return getPrivateProp(this, 'sessionStorage');
        }
    });
    addObjProp(window, {
        name: 'localStorage',
        get: function localStorage() {
            return getPrivateProp(this, 'localStorage');
        }
    });
    addObjProp(window, {
        name: 'onbeforexrselect',
        get: function onbeforexrselect() {
            return getPrivateProp(this, 'onbeforexrselect');
        },
        set: function onbeforexrselect(value) {
            return setPrivateProp(this, 'onbeforexrselect', value);
        }
    });
    addObjProp(window, {
        name: 'onabort',
        get: function onabort() {
            return getPrivateProp(this, 'onabort');
        },
        set: function onabort(value) {
            return setPrivateProp(this, 'onabort', value);
        }
    });
    addObjProp(window, {
        name: 'onbeforeinput',
        get: function onbeforeinput() {
            return getPrivateProp(this, 'onbeforeinput');
        },
        set: function onbeforeinput(value) {
            return setPrivateProp(this, 'onbeforeinput', value);
        }
    });
    addObjProp(window, {
        name: 'onbeforematch',
        get: function onbeforematch() {
            return getPrivateProp(this, 'onbeforematch');
        },
        set: function onbeforematch(value) {
            return setPrivateProp(this, 'onbeforematch', value);
        }
    });
    addObjProp(window, {
        name: 'onbeforetoggle',
        get: function onbeforetoggle() {
            return getPrivateProp(this, 'onbeforetoggle');
        },
        set: function onbeforetoggle(value) {
            return setPrivateProp(this, 'onbeforetoggle', value);
        }
    });
    addObjProp(window, {
        name: 'onblur',
        get: function onblur() {
            return getPrivateProp(this, 'onblur');
        },
        set: function onblur(value) {
            return setPrivateProp(this, 'onblur', value);
        }
    });
    addObjProp(window, {
        name: 'oncancel',
        get: function oncancel() {
            return getPrivateProp(this, 'oncancel');
        },
        set: function oncancel(value) {
            return setPrivateProp(this, 'oncancel', value);
        }
    });
    addObjProp(window, {
        name: 'oncanplay',
        get: function oncanplay() {
            return getPrivateProp(this, 'oncanplay');
        },
        set: function oncanplay(value) {
            return setPrivateProp(this, 'oncanplay', value);
        }
    });
    addObjProp(window, {
        name: 'oncanplaythrough',
        get: function oncanplaythrough() {
            return getPrivateProp(this, 'oncanplaythrough');
        },
        set: function oncanplaythrough(value) {
            return setPrivateProp(this, 'oncanplaythrough', value);
        }
    });
    addObjProp(window, {
        name: 'onchange',
        get: function onchange() {
            return getPrivateProp(this, 'onchange');
        },
        set: function onchange(value) {
            return setPrivateProp(this, 'onchange', value);
        }
    });
    addObjProp(window, {
        name: 'onclick',
        get: function onclick() {
            return getPrivateProp(this, 'onclick');
        },
        set: function onclick(value) {
            return setPrivateProp(this, 'onclick', value);
        }
    });
    addObjProp(window, {
        name: 'onclose',
        get: function onclose() {
            return getPrivateProp(this, 'onclose');
        },
        set: function onclose(value) {
            return setPrivateProp(this, 'onclose', value);
        }
    });
    addObjProp(window, {
        name: 'oncontentvisibilityautostatechange',
        get: function oncontentvisibilityautostatechange() {
            return getPrivateProp(this, 'oncontentvisibilityautostatechange');
        },
        set: function oncontentvisibilityautostatechange(value) {
            return setPrivateProp(this, 'oncontentvisibilityautostatechange', value);
        }
    });
    addObjProp(window, {
        name: 'oncontextlost',
        get: function oncontextlost() {
            return getPrivateProp(this, 'oncontextlost');
        },
        set: function oncontextlost(value) {
            return setPrivateProp(this, 'oncontextlost', value);
        }
    });
    addObjProp(window, {
        name: 'oncontextmenu',
        get: function oncontextmenu() {
            return getPrivateProp(this, 'oncontextmenu');
        },
        set: function oncontextmenu(value) {
            return setPrivateProp(this, 'oncontextmenu', value);
        }
    });
    addObjProp(window, {
        name: 'oncontextrestored',
        get: function oncontextrestored() {
            return getPrivateProp(this, 'oncontextrestored');
        },
        set: function oncontextrestored(value) {
            return setPrivateProp(this, 'oncontextrestored', value);
        }
    });
    addObjProp(window, {
        name: 'oncuechange',
        get: function oncuechange() {
            return getPrivateProp(this, 'oncuechange');
        },
        set: function oncuechange(value) {
            return setPrivateProp(this, 'oncuechange', value);
        }
    });
    addObjProp(window, {
        name: 'ondblclick',
        get: function ondblclick() {
            return getPrivateProp(this, 'ondblclick');
        },
        set: function ondblclick(value) {
            return setPrivateProp(this, 'ondblclick', value);
        }
    });
    addObjProp(window, {
        name: 'ondrag',
        get: function ondrag() {
            return getPrivateProp(this, 'ondrag');
        },
        set: function ondrag(value) {
            return setPrivateProp(this, 'ondrag', value);
        }
    });
    addObjProp(window, {
        name: 'ondragend',
        get: function ondragend() {
            return getPrivateProp(this, 'ondragend');
        },
        set: function ondragend(value) {
            return setPrivateProp(this, 'ondragend', value);
        }
    });
    addObjProp(window, {
        name: 'ondragenter',
        get: function ondragenter() {
            return getPrivateProp(this, 'ondragenter');
        },
        set: function ondragenter(value) {
            return setPrivateProp(this, 'ondragenter', value);
        }
    });
    addObjProp(window, {
        name: 'ondragleave',
        get: function ondragleave() {
            return getPrivateProp(this, 'ondragleave');
        },
        set: function ondragleave(value) {
            return setPrivateProp(this, 'ondragleave', value);
        }
    });
    addObjProp(window, {
        name: 'ondragover',
        get: function ondragover() {
            return getPrivateProp(this, 'ondragover');
        },
        set: function ondragover(value) {
            return setPrivateProp(this, 'ondragover', value);
        }
    });
    addObjProp(window, {
        name: 'ondragstart',
        get: function ondragstart() {
            return getPrivateProp(this, 'ondragstart');
        },
        set: function ondragstart(value) {
            return setPrivateProp(this, 'ondragstart', value);
        }
    });
    addObjProp(window, {
        name: 'ondrop',
        get: function ondrop() {
            return getPrivateProp(this, 'ondrop');
        },
        set: function ondrop(value) {
            return setPrivateProp(this, 'ondrop', value);
        }
    });
    addObjProp(window, {
        name: 'ondurationchange',
        get: function ondurationchange() {
            return getPrivateProp(this, 'ondurationchange');
        },
        set: function ondurationchange(value) {
            return setPrivateProp(this, 'ondurationchange', value);
        }
    });
    addObjProp(window, {
        name: 'onemptied',
        get: function onemptied() {
            return getPrivateProp(this, 'onemptied');
        },
        set: function onemptied(value) {
            return setPrivateProp(this, 'onemptied', value);
        }
    });
    addObjProp(window, {
        name: 'onended',
        get: function onended() {
            return getPrivateProp(this, 'onended');
        },
        set: function onended(value) {
            return setPrivateProp(this, 'onended', value);
        }
    });
    addObjProp(window, {
        name: 'onerror',
        get: function onerror() {
            return getPrivateProp(this, 'onerror');
        },
        set: function onerror(value) {
            return setPrivateProp(this, 'onerror', value);
        }
    });
    addObjProp(window, {
        name: 'onfocus',
        get: function onfocus() {
            return getPrivateProp(this, 'onfocus');
        },
        set: function onfocus(value) {
            return setPrivateProp(this, 'onfocus', value);
        }
    });
    addObjProp(window, {
        name: 'onformdata',
        get: function onformdata() {
            return getPrivateProp(this, 'onformdata');
        },
        set: function onformdata(value) {
            return setPrivateProp(this, 'onformdata', value);
        }
    });
    addObjProp(window, {
        name: 'oninput',
        get: function oninput() {
            return getPrivateProp(this, 'oninput');
        },
        set: function oninput(value) {
            return setPrivateProp(this, 'oninput', value);
        }
    });
    addObjProp(window, {
        name: 'oninvalid',
        get: function oninvalid() {
            return getPrivateProp(this, 'oninvalid');
        },
        set: function oninvalid(value) {
            return setPrivateProp(this, 'oninvalid', value);
        }
    });
    addObjProp(window, {
        name: 'onkeydown',
        get: function onkeydown() {
            return getPrivateProp(this, 'onkeydown');
        },
        set: function onkeydown(value) {
            return setPrivateProp(this, 'onkeydown', value);
        }
    });
    addObjProp(window, {
        name: 'onkeypress',
        get: function onkeypress() {
            return getPrivateProp(this, 'onkeypress');
        },
        set: function onkeypress(value) {
            return setPrivateProp(this, 'onkeypress', value);
        }
    });
    addObjProp(window, {
        name: 'onkeyup',
        get: function onkeyup() {
            return getPrivateProp(this, 'onkeyup');
        },
        set: function onkeyup(value) {
            return setPrivateProp(this, 'onkeyup', value);
        }
    });
    addObjProp(window, {
        name: 'onload',
        get: function onload() {
            return getPrivateProp(this, 'onload');
        },
        set: function onload(value) {
            return setPrivateProp(this, 'onload', value);
        }
    });
    addObjProp(window, {
        name: 'onloadeddata',
        get: function onloadeddata() {
            return getPrivateProp(this, 'onloadeddata');
        },
        set: function onloadeddata(value) {
            return setPrivateProp(this, 'onloadeddata', value);
        }
    });
    addObjProp(window, {
        name: 'onloadedmetadata',
        get: function onloadedmetadata() {
            return getPrivateProp(this, 'onloadedmetadata');
        },
        set: function onloadedmetadata(value) {
            return setPrivateProp(this, 'onloadedmetadata', value);
        }
    });
    addObjProp(window, {
        name: 'onloadstart',
        get: function onloadstart() {
            return getPrivateProp(this, 'onloadstart');
        },
        set: function onloadstart(value) {
            return setPrivateProp(this, 'onloadstart', value);
        }
    });
    addObjProp(window, {
        name: 'onmousedown',
        get: function onmousedown() {
            return getPrivateProp(this, 'onmousedown');
        },
        set: function onmousedown(value) {
            return setPrivateProp(this, 'onmousedown', value);
        }
    });
    addObjProp(window, {
        name: 'onmouseenter',
        get: function onmouseenter() {
            return getPrivateProp(this, 'onmouseenter');
        },
        set: function onmouseenter(value) {
            return setPrivateProp(this, 'onmouseenter', value);
        }
    });
    addObjProp(window, {
        name: 'onmouseleave',
        get: function onmouseleave() {
            return getPrivateProp(this, 'onmouseleave');
        },
        set: function onmouseleave(value) {
            return setPrivateProp(this, 'onmouseleave', value);
        }
    });
    addObjProp(window, {
        name: 'onmousemove',
        get: function onmousemove() {
            return getPrivateProp(this, 'onmousemove');
        },
        set: function onmousemove(value) {
            return setPrivateProp(this, 'onmousemove', value);
        }
    });
    addObjProp(window, {
        name: 'onmouseout',
        get: function onmouseout() {
            return getPrivateProp(this, 'onmouseout');
        },
        set: function onmouseout(value) {
            return setPrivateProp(this, 'onmouseout', value);
        }
    });
    addObjProp(window, {
        name: 'onmouseover',
        get: function onmouseover() {
            return getPrivateProp(this, 'onmouseover');
        },
        set: function onmouseover(value) {
            return setPrivateProp(this, 'onmouseover', value);
        }
    });
    addObjProp(window, {
        name: 'onmouseup',
        get: function onmouseup() {
            return getPrivateProp(this, 'onmouseup');
        },
        set: function onmouseup(value) {
            return setPrivateProp(this, 'onmouseup', value);
        }
    });
    addObjProp(window, {
        name: 'onmousewheel',
        get: function onmousewheel() {
            return getPrivateProp(this, 'onmousewheel');
        },
        set: function onmousewheel(value) {
            return setPrivateProp(this, 'onmousewheel', value);
        }
    });
    addObjProp(window, {
        name: 'onpause',
        get: function onpause() {
            return getPrivateProp(this, 'onpause');
        },
        set: function onpause(value) {
            return setPrivateProp(this, 'onpause', value);
        }
    });
    addObjProp(window, {
        name: 'onplay',
        get: function onplay() {
            return getPrivateProp(this, 'onplay');
        },
        set: function onplay(value) {
            return setPrivateProp(this, 'onplay', value);
        }
    });
    addObjProp(window, {
        name: 'onplaying',
        get: function onplaying() {
            return getPrivateProp(this, 'onplaying');
        },
        set: function onplaying(value) {
            return setPrivateProp(this, 'onplaying', value);
        }
    });
    addObjProp(window, {
        name: 'onprogress',
        get: function onprogress() {
            return getPrivateProp(this, 'onprogress');
        },
        set: function onprogress(value) {
            return setPrivateProp(this, 'onprogress', value);
        }
    });
    addObjProp(window, {
        name: 'onratechange',
        get: function onratechange() {
            return getPrivateProp(this, 'onratechange');
        },
        set: function onratechange(value) {
            return setPrivateProp(this, 'onratechange', value);
        }
    });
    addObjProp(window, {
        name: 'onreset',
        get: function onreset() {
            return getPrivateProp(this, 'onreset');
        },
        set: function onreset(value) {
            return setPrivateProp(this, 'onreset', value);
        }
    });
    addObjProp(window, {
        name: 'onresize',
        get: function onresize() {
            return getPrivateProp(this, 'onresize');
        },
        set: function onresize(value) {
            return setPrivateProp(this, 'onresize', value);
        }
    });
    addObjProp(window, {
        name: 'onscroll',
        get: function onscroll() {
            return getPrivateProp(this, 'onscroll');
        },
        set: function onscroll(value) {
            return setPrivateProp(this, 'onscroll', value);
        }
    });
    addObjProp(window, {
        name: 'onsecuritypolicyviolation',
        get: function onsecuritypolicyviolation() {
            return getPrivateProp(this, 'onsecuritypolicyviolation');
        },
        set: function onsecuritypolicyviolation(value) {
            return setPrivateProp(this, 'onsecuritypolicyviolation', value);
        }
    });
    addObjProp(window, {
        name: 'onseeked',
        get: function onseeked() {
            return getPrivateProp(this, 'onseeked');
        },
        set: function onseeked(value) {
            return setPrivateProp(this, 'onseeked', value);
        }
    });
    addObjProp(window, {
        name: 'onseeking',
        get: function onseeking() {
            return getPrivateProp(this, 'onseeking');
        },
        set: function onseeking(value) {
            return setPrivateProp(this, 'onseeking', value);
        }
    });
    addObjProp(window, {
        name: 'onselect',
        get: function onselect() {
            return getPrivateProp(this, 'onselect');
        },
        set: function onselect(value) {
            return setPrivateProp(this, 'onselect', value);
        }
    });
    addObjProp(window, {
        name: 'onslotchange',
        get: function onslotchange() {
            return getPrivateProp(this, 'onslotchange');
        },
        set: function onslotchange(value) {
            return setPrivateProp(this, 'onslotchange', value);
        }
    });
    addObjProp(window, {
        name: 'onstalled',
        get: function onstalled() {
            return getPrivateProp(this, 'onstalled');
        },
        set: function onstalled(value) {
            return setPrivateProp(this, 'onstalled', value);
        }
    });
    addObjProp(window, {
        name: 'onsubmit',
        get: function onsubmit() {
            return getPrivateProp(this, 'onsubmit');
        },
        set: function onsubmit(value) {
            return setPrivateProp(this, 'onsubmit', value);
        }
    });
    addObjProp(window, {
        name: 'onsuspend',
        get: function onsuspend() {
            return getPrivateProp(this, 'onsuspend');
        },
        set: function onsuspend(value) {
            return setPrivateProp(this, 'onsuspend', value);
        }
    });
    addObjProp(window, {
        name: 'ontimeupdate',
        get: function ontimeupdate() {
            return getPrivateProp(this, 'ontimeupdate');
        },
        set: function ontimeupdate(value) {
            return setPrivateProp(this, 'ontimeupdate', value);
        }
    });
    addObjProp(window, {
        name: 'ontoggle',
        get: function ontoggle() {
            return getPrivateProp(this, 'ontoggle');
        },
        set: function ontoggle(value) {
            return setPrivateProp(this, 'ontoggle', value);
        }
    });
    addObjProp(window, {
        name: 'onvolumechange',
        get: function onvolumechange() {
            return getPrivateProp(this, 'onvolumechange');
        },
        set: function onvolumechange(value) {
            return setPrivateProp(this, 'onvolumechange', value);
        }
    });
    addObjProp(window, {
        name: 'onwaiting',
        get: function onwaiting() {
            return getPrivateProp(this, 'onwaiting');
        },
        set: function onwaiting(value) {
            return setPrivateProp(this, 'onwaiting', value);
        }
    });
    addObjProp(window, {
        name: 'onwebkitanimationend',
        get: function onwebkitanimationend() {
            return getPrivateProp(this, 'onwebkitanimationend');
        },
        set: function onwebkitanimationend(value) {
            return setPrivateProp(this, 'onwebkitanimationend', value);
        }
    });
    addObjProp(window, {
        name: 'onwebkitanimationiteration',
        get: function onwebkitanimationiteration() {
            return getPrivateProp(this, 'onwebkitanimationiteration');
        },
        set: function onwebkitanimationiteration(value) {
            return setPrivateProp(this, 'onwebkitanimationiteration', value);
        }
    });
    addObjProp(window, {
        name: 'onwebkitanimationstart',
        get: function onwebkitanimationstart() {
            return getPrivateProp(this, 'onwebkitanimationstart');
        },
        set: function onwebkitanimationstart(value) {
            return setPrivateProp(this, 'onwebkitanimationstart', value);
        }
    });
    addObjProp(window, {
        name: 'onwebkittransitionend',
        get: function onwebkittransitionend() {
            return getPrivateProp(this, 'onwebkittransitionend');
        },
        set: function onwebkittransitionend(value) {
            return setPrivateProp(this, 'onwebkittransitionend', value);
        }
    });
    addObjProp(window, {
        name: 'onwheel',
        get: function onwheel() {
            return getPrivateProp(this, 'onwheel');
        },
        set: function onwheel(value) {
            return setPrivateProp(this, 'onwheel', value);
        }
    });
    addObjProp(window, {
        name: 'onauxclick',
        get: function onauxclick() {
            return getPrivateProp(this, 'onauxclick');
        },
        set: function onauxclick(value) {
            return setPrivateProp(this, 'onauxclick', value);
        }
    });
    addObjProp(window, {
        name: 'ongotpointercapture',
        get: function ongotpointercapture() {
            return getPrivateProp(this, 'ongotpointercapture');
        },
        set: function ongotpointercapture(value) {
            return setPrivateProp(this, 'ongotpointercapture', value);
        }
    });
    addObjProp(window, {
        name: 'onlostpointercapture',
        get: function onlostpointercapture() {
            return getPrivateProp(this, 'onlostpointercapture');
        },
        set: function onlostpointercapture(value) {
            return setPrivateProp(this, 'onlostpointercapture', value);
        }
    });
    addObjProp(window, {
        name: 'onpointerdown',
        get: function onpointerdown() {
            return getPrivateProp(this, 'onpointerdown');
        },
        set: function onpointerdown(value) {
            return setPrivateProp(this, 'onpointerdown', value);
        }
    });
    addObjProp(window, {
        name: 'onpointermove',
        get: function onpointermove() {
            return getPrivateProp(this, 'onpointermove');
        },
        set: function onpointermove(value) {
            return setPrivateProp(this, 'onpointermove', value);
        }
    });
    addObjProp(window, {
        name: 'onpointerrawupdate',
        get: function onpointerrawupdate() {
            return getPrivateProp(this, 'onpointerrawupdate');
        },
        set: function onpointerrawupdate(value) {
            return setPrivateProp(this, 'onpointerrawupdate', value);
        }
    });
    addObjProp(window, {
        name: 'onpointerup',
        get: function onpointerup() {
            return getPrivateProp(this, 'onpointerup');
        },
        set: function onpointerup(value) {
            return setPrivateProp(this, 'onpointerup', value);
        }
    });
    addObjProp(window, {
        name: 'onpointercancel',
        get: function onpointercancel() {
            return getPrivateProp(this, 'onpointercancel');
        },
        set: function onpointercancel(value) {
            return setPrivateProp(this, 'onpointercancel', value);
        }
    });
    addObjProp(window, {
        name: 'onpointerover',
        get: function onpointerover() {
            return getPrivateProp(this, 'onpointerover');
        },
        set: function onpointerover(value) {
            return setPrivateProp(this, 'onpointerover', value);
        }
    });
    addObjProp(window, {
        name: 'onpointerout',
        get: function onpointerout() {
            return getPrivateProp(this, 'onpointerout');
        },
        set: function onpointerout(value) {
            return setPrivateProp(this, 'onpointerout', value);
        }
    });
    addObjProp(window, {
        name: 'onpointerenter',
        get: function onpointerenter() {
            return getPrivateProp(this, 'onpointerenter');
        },
        set: function onpointerenter(value) {
            return setPrivateProp(this, 'onpointerenter', value);
        }
    });
    addObjProp(window, {
        name: 'onpointerleave',
        get: function onpointerleave() {
            return getPrivateProp(this, 'onpointerleave');
        },
        set: function onpointerleave(value) {
            return setPrivateProp(this, 'onpointerleave', value);
        }
    });
    addObjProp(window, {
        name: 'onselectstart',
        get: function onselectstart() {
            return getPrivateProp(this, 'onselectstart');
        },
        set: function onselectstart(value) {
            return setPrivateProp(this, 'onselectstart', value);
        }
    });
    addObjProp(window, {
        name: 'onselectionchange',
        get: function onselectionchange() {
            return getPrivateProp(this, 'onselectionchange');
        },
        set: function onselectionchange(value) {
            return setPrivateProp(this, 'onselectionchange', value);
        }
    });
    addObjProp(window, {
        name: 'onanimationend',
        get: function onanimationend() {
            return getPrivateProp(this, 'onanimationend');
        },
        set: function onanimationend(value) {
            return setPrivateProp(this, 'onanimationend', value);
        }
    });
    addObjProp(window, {
        name: 'onanimationiteration',
        get: function onanimationiteration() {
            return getPrivateProp(this, 'onanimationiteration');
        },
        set: function onanimationiteration(value) {
            return setPrivateProp(this, 'onanimationiteration', value);
        }
    });
    addObjProp(window, {
        name: 'onanimationstart',
        get: function onanimationstart() {
            return getPrivateProp(this, 'onanimationstart');
        },
        set: function onanimationstart(value) {
            return setPrivateProp(this, 'onanimationstart', value);
        }
    });
    addObjProp(window, {
        name: 'ontransitionrun',
        get: function ontransitionrun() {
            return getPrivateProp(this, 'ontransitionrun');
        },
        set: function ontransitionrun(value) {
            return setPrivateProp(this, 'ontransitionrun', value);
        }
    });
    addObjProp(window, {
        name: 'ontransitionstart',
        get: function ontransitionstart() {
            return getPrivateProp(this, 'ontransitionstart');
        },
        set: function ontransitionstart(value) {
            return setPrivateProp(this, 'ontransitionstart', value);
        }
    });
    addObjProp(window, {
        name: 'ontransitionend',
        get: function ontransitionend() {
            return getPrivateProp(this, 'ontransitionend');
        },
        set: function ontransitionend(value) {
            return setPrivateProp(this, 'ontransitionend', value);
        }
    });
    addObjProp(window, {
        name: 'ontransitioncancel',
        get: function ontransitioncancel() {
            return getPrivateProp(this, 'ontransitioncancel');
        },
        set: function ontransitioncancel(value) {
            return setPrivateProp(this, 'ontransitioncancel', value);
        }
    });
    addObjProp(window, {
        name: 'onafterprint',
        get: function onafterprint() {
            return getPrivateProp(this, 'onafterprint');
        },
        set: function onafterprint(value) {
            return setPrivateProp(this, 'onafterprint', value);
        }
    });
    addObjProp(window, {
        name: 'onbeforeprint',
        get: function onbeforeprint() {
            return getPrivateProp(this, 'onbeforeprint');
        },
        set: function onbeforeprint(value) {
            return setPrivateProp(this, 'onbeforeprint', value);
        }
    });
    addObjProp(window, {
        name: 'onbeforeunload',
        get: function onbeforeunload() {
            return getPrivateProp(this, 'onbeforeunload');
        },
        set: function onbeforeunload(value) {
            return setPrivateProp(this, 'onbeforeunload', value);
        }
    });
    addObjProp(window, {
        name: 'onhashchange',
        get: function onhashchange() {
            return getPrivateProp(this, 'onhashchange');
        },
        set: function onhashchange(value) {
            return setPrivateProp(this, 'onhashchange', value);
        }
    });
    addObjProp(window, {
        name: 'onlanguagechange',
        get: function onlanguagechange() {
            return getPrivateProp(this, 'onlanguagechange');
        },
        set: function onlanguagechange(value) {
            return setPrivateProp(this, 'onlanguagechange', value);
        }
    });
    addObjProp(window, {
        name: 'onmessage',
        get: function onmessage() {
            return getPrivateProp(this, 'onmessage');
        },
        set: function onmessage(value) {
            return setPrivateProp(this, 'onmessage', value);
        }
    });
    addObjProp(window, {
        name: 'onmessageerror',
        get: function onmessageerror() {
            return getPrivateProp(this, 'onmessageerror');
        },
        set: function onmessageerror(value) {
            return setPrivateProp(this, 'onmessageerror', value);
        }
    });
    addObjProp(window, {
        name: 'onoffline',
        get: function onoffline() {
            return getPrivateProp(this, 'onoffline');
        },
        set: function onoffline(value) {
            return setPrivateProp(this, 'onoffline', value);
        }
    });
    addObjProp(window, {
        name: 'ononline',
        get: function ononline() {
            return getPrivateProp(this, 'ononline');
        },
        set: function ononline(value) {
            return setPrivateProp(this, 'ononline', value);
        }
    });
    addObjProp(window, {
        name: 'onpagehide',
        get: function onpagehide() {
            return getPrivateProp(this, 'onpagehide');
        },
        set: function onpagehide(value) {
            return setPrivateProp(this, 'onpagehide', value);
        }
    });
    addObjProp(window, {
        name: 'onpageshow',
        get: function onpageshow() {
            return getPrivateProp(this, 'onpageshow');
        },
        set: function onpageshow(value) {
            return setPrivateProp(this, 'onpageshow', value);
        }
    });
    addObjProp(window, {
        name: 'onpopstate',
        get: function onpopstate() {
            return getPrivateProp(this, 'onpopstate');
        },
        set: function onpopstate(value) {
            return setPrivateProp(this, 'onpopstate', value);
        }
    });
    addObjProp(window, {
        name: 'onrejectionhandled',
        get: function onrejectionhandled() {
            return getPrivateProp(this, 'onrejectionhandled');
        },
        set: function onrejectionhandled(value) {
            return setPrivateProp(this, 'onrejectionhandled', value);
        }
    });
    addObjProp(window, {
        name: 'onstorage',
        get: function onstorage() {
            return getPrivateProp(this, 'onstorage');
        },
        set: function onstorage(value) {
            return setPrivateProp(this, 'onstorage', value);
        }
    });
    addObjProp(window, {
        name: 'onunhandledrejection',
        get: function onunhandledrejection() {
            return getPrivateProp(this, 'onunhandledrejection');
        },
        set: function onunhandledrejection(value) {
            return setPrivateProp(this, 'onunhandledrejection', value);
        }
    });
    addObjProp(window, {
        name: 'onunload',
        get: function onunload() {
            return getPrivateProp(this, 'onunload');
        },
        set: function onunload(value) {
            return setPrivateProp(this, 'onunload', value);
        }
    });
    addObjProp(window, {
        name: 'crossOriginIsolated',
        get: function crossOriginIsolated() {
            return getPrivateProp(this, 'crossOriginIsolated');
        }
    });
    addObjProp(window, {
        name: 'scheduler',
        get: function scheduler() {
            return getPrivateProp(this, 'scheduler');
        },
        set: function scheduler(value) {
            return setPrivateProp(this, 'scheduler', value);
        }
    });
    addObjProp(window, {name: 'alert'});
    addObjProp(window, {
        name: 'atob',
        value: function atob(str) {
            return globalAtob(...arguments);
        }
    });
    addObjProp(window, {name: 'blur'});
    addObjProp(window, {
        name: 'btoa',
        value: function btoa(str) {
            return globalBtoa(...arguments);
        }
    });
    addObjProp(window, {name: 'cancelAnimationFrame'});
    addObjProp(window, {name: 'cancelIdleCallback'});
    addObjProp(window, {name: 'captureEvents'});
    addObjProp(window, {
        name: 'clearInterval',
        value: function clearInterval() {
        }
    });
    addObjProp(window, {
        name: 'clearTimeout',
        value: function clearTimeout() {
        }
    });
    addObjProp(window, {name: 'close'});
    addObjProp(window, {name: 'confirm'});
    addObjProp(window, {name: 'createImageBitmap'});
    addObjProp(window, {
        name: 'fetch',
        value: function fetch() {
            return globalFetch(...arguments)
        }
    });
    addObjProp(window, {name: 'find'});
    addObjProp(window, {name: 'focus'});
    addObjProp(window, {name: 'getComputedStyle'});
    addObjProp(window, {name: 'getSelection'});
    addObjProp(window, {
        name: 'matchMedia',
        value: matchMedia
    });
    addObjProp(window, {name: 'moveBy'});
    addObjProp(window, {name: 'moveTo'});
    addObjProp(window, {
        name: 'open',
        value: function open() {
        }
    });
    addObjProp(window, {name: 'postMessage'});
    addObjProp(window, {name: 'print'});
    addObjProp(window, {name: 'prompt'});
    addObjProp(window, {
        name: 'queueMicrotask',
        value: function queueMicrotask(callback) {
            globalQueueMicrotask(...arguments);
        }
    });
    addObjProp(window, {name: 'releaseEvents'});
    addObjProp(window, {name: 'reportError'});
    addObjProp(window, {name: 'requestAnimationFrame'});
    addObjProp(window, {name: 'requestIdleCallback'});
    addObjProp(window, {name: 'resizeBy'});
    addObjProp(window, {name: 'resizeTo'});
    addObjProp(window, {name: 'scroll'});
    addObjProp(window, {name: 'scrollBy'});
    addObjProp(window, {name: 'scrollTo'});
    addObjProp(window, {
        name: 'setInterval',
        value: function setInterval(callback, time) {
            const intervalGenerate = getPrivateProp(this, 'intervalGenerate');
            intervalGenerate.push(callback);
            chalkLog('red', `setInterval回调函数${callback.name}已收集，可使用getPrivateProp(window, "intervalGenerate")查看相关回调函数`);
            timerMark += originMath.floor(originMath.random() * 40) + 10;
            return timerMark;//返回定时器标识符
        }
    });
    addObjProp(window, {
        name: 'setTimeout',
        value: function setTimeout(callback, time) {
            const timeoutGenerate = getPrivateProp(this, 'timeoutGenerate');
            timeoutGenerate.push(callback);
            chalkLog('red', `setTimeout回调函数${callback.name}已收集，可使用getPrivateProp(window, "timeoutGenerate")查看相关回调函数`);
            timerMark += originMath.floor(originMath.random() * 40) + 10;
            return timerMark;//返回定时器标识符
        }
    });
    addObjProp(window, {name: 'stop'});
    addObjProp(window, {
        name: 'structuredClone',
        value: function structuredClone(obj) {
            return globalStructuredClone(...arguments);
        }
    });
    addObjProp(window, {name: 'webkitCancelAnimationFrame'});
    addObjProp(window, {name: 'webkitRequestAnimationFrame'});
    addObjProp(window, {
        name: 'Iterator',
        enumerable: false
    });
    addObjProp(window, {
        name: 'chrome',
        value: chrome
    });
    addObjProp(window, {
        name: 'WebAssembly',
        value: WebAssembly,
        enumerable: false
    });
    addObjProp(window, {
        name: 'caches',
        get: function caches() {
            return getPrivateProp(this, 'caches');
        }
    });
    addObjProp(window, {
        name: 'cookieStore',
        get: function cookieStore() {
            return getPrivateProp(this, 'cookieStore');
        }
    });
    addObjProp(window, {
        name: 'ondevicemotion',
        get: function ondevicemotion() {
            return getPrivateProp(this, 'ondevicemotion');
        },
        set: function ondevicemotion(value) {
            return setPrivateProp(this, 'ondevicemotion', value);
        }
    });
    addObjProp(window, {
        name: 'ondeviceorientation',
        get: function ondeviceorientation() {
            return getPrivateProp(this, 'ondeviceorientation');
        },
        set: function ondeviceorientation(value) {
            return setPrivateProp(this, 'ondeviceorientation', value);
        }
    });
    addObjProp(window, {
        name: 'ondeviceorientationabsolute',
        get: function ondeviceorientationabsolute() {
            return getPrivateProp(this, 'ondeviceorientationabsolute');
        },
        set: function ondeviceorientationabsolute(value) {
            return setPrivateProp(this, 'ondeviceorientationabsolute', value);
        }
    });
    addObjProp(window, {
        name: 'launchQueue',
        get: function launchQueue() {
            return getPrivateProp(this, 'launchQueue');
        }
    });
    addObjProp(window, {
        name: 'sharedStorage',
        get: function sharedStorage() {
            return getPrivateProp(this, 'sharedStorage');
        }
    });
    addObjProp(window, {
        name: 'documentPictureInPicture',
        get: function documentPictureInPicture() {
            return getPrivateProp(this, 'documentPictureInPicture');
        }
    });
    addObjProp(window, {
        name: 'AbsoluteOrientationSensor',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Accelerometer',
        enumerable: false
    });
    addObjProp(window, {
        name: 'AudioDecoder',
        enumerable: false
    });
    addObjProp(window, {
        name: 'AudioEncoder',
        enumerable: false
    });
    addObjProp(window, {
        name: 'AudioWorklet',
        enumerable: false
    });
    addObjProp(window, {
        name: 'BatteryManager',
        enumerable: false,
        value: BatteryManager
    });
    addObjProp(window, {
        name: 'Cache',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CacheStorage',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Clipboard',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ClipboardItem',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CookieChangeEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CookieStore',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CookieStoreManager',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Credential',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CredentialsContainer',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CryptoKey',
        enumerable: false
    });
    addObjProp(window, {
        name: 'DeviceMotionEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'DeviceMotionEventAcceleration',
        enumerable: false
    });
    addObjProp(window, {
        name: 'DeviceMotionEventRotationRate',
        enumerable: false
    });
    addObjProp(window, {
        name: 'DeviceOrientationEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'FederatedCredential',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GPU',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GPUAdapter',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GPUAdapterInfo',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GPUBindGroup',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GPUBindGroupLayout',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GPUBuffer',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GPUBufferUsage',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GPUCanvasContext',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GPUColorWrite',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GPUCommandBuffer',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GPUCommandEncoder',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GPUCompilationInfo',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GPUCompilationMessage',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GPUComputePassEncoder',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GPUComputePipeline',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GPUDevice',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GPUDeviceLostInfo',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GPUError',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GPUExternalTexture',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GPUInternalError',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GPUMapMode',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GPUOutOfMemoryError',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GPUPipelineError',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GPUPipelineLayout',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GPUQuerySet',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GPUQueue',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GPURenderBundle',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GPURenderBundleEncoder',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GPURenderPassEncoder',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GPURenderPipeline',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GPUSampler',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GPUShaderModule',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GPUShaderStage',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GPUSupportedFeatures',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GPUSupportedLimits',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GPUTexture',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GPUTextureUsage',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GPUTextureView',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GPUUncapturedErrorEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GPUValidationError',
        enumerable: false
    });
    addObjProp(window, {
        name: 'GravitySensor',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Gyroscope',
        enumerable: false
    });
    addObjProp(window, {
        name: 'IdleDetector',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ImageDecoder',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ImageTrack',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ImageTrackList',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Keyboard',
        enumerable: false
    });
    addObjProp(window, {
        name: 'KeyboardLayoutMap',
        enumerable: false
    });
    addObjProp(window, {
        name: 'LinearAccelerationSensor',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Lock',
        enumerable: false
    });
    addObjProp(window, {
        name: 'LockManager',
        value: LockManager,
        enumerable: false
    });
    addObjProp(window, {
        name: 'MIDIAccess',
        enumerable: false
    });
    addObjProp(window, {
        name: 'MIDIConnectionEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'MIDIInput',
        enumerable: false
    });
    addObjProp(window, {
        name: 'MIDIInputMap',
        enumerable: false
    });
    addObjProp(window, {
        name: 'MIDIMessageEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'MIDIOutput',
        enumerable: false
    });
    addObjProp(window, {
        name: 'MIDIOutputMap',
        enumerable: false
    });
    addObjProp(window, {
        name: 'MIDIPort',
        enumerable: false
    });
    addObjProp(window, {
        name: 'MediaDeviceInfo',
        enumerable: false
    });
    addObjProp(window, {
        name: 'MediaDevices',
        enumerable: false
    });
    addObjProp(window, {
        name: 'MediaKeyMessageEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'MediaKeySession',
        enumerable: false
    });
    addObjProp(window, {
        name: 'MediaKeyStatusMap',
        enumerable: false
    });
    addObjProp(window, {
        name: 'MediaKeySystemAccess',
        enumerable: false
    });
    addObjProp(window, {
        name: 'MediaKeys',
        enumerable: false
    });
    addObjProp(window, {
        name: 'NavigationPreloadManager',
        enumerable: false
    });
    addObjProp(window, {
        name: 'NavigatorManagedData',
        enumerable: false
    });
    addObjProp(window, {
        name: 'OrientationSensor',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PasswordCredential',
        enumerable: false
    });
    addObjProp(window, {
        name: 'RelativeOrientationSensor',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ScreenDetailed',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ScreenDetails',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Sensor',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SensorErrorEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ServiceWorker',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ServiceWorkerContainer',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ServiceWorkerRegistration',
        enumerable: false
    });
    addObjProp(window, {
        name: 'StorageManager',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SubtleCrypto',
        enumerable: false
    });
    addObjProp(window, {
        name: 'VideoDecoder',
        enumerable: false
    });
    addObjProp(window, {
        name: 'VideoEncoder',
        enumerable: false
    });
    addObjProp(window, {
        name: 'VirtualKeyboard',
        enumerable: false
    });
    addObjProp(window, {
        name: 'WGSLLanguageFeatures',
        enumerable: false
    });
    addObjProp(window, {
        name: 'WebTransport',
        enumerable: false
    });
    addObjProp(window, {
        name: 'WebTransportBidirectionalStream',
        enumerable: false
    });
    addObjProp(window, {
        name: 'WebTransportDatagramDuplexStream',
        enumerable: false
    });
    addObjProp(window, {
        name: 'WebTransportError',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Worklet',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XRDOMOverlayState',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XRLayer',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XRWebGLBinding',
        enumerable: false
    });
    addObjProp(window, {
        name: 'AuthenticatorAssertionResponse',
        enumerable: false
    });
    addObjProp(window, {
        name: 'AuthenticatorAttestationResponse',
        enumerable: false
    });
    addObjProp(window, {
        name: 'AuthenticatorResponse',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PublicKeyCredential',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Bluetooth',
        enumerable: false
    });
    addObjProp(window, {
        name: 'BluetoothCharacteristicProperties',
        enumerable: false
    });
    addObjProp(window, {
        name: 'BluetoothDevice',
        enumerable: false
    });
    addObjProp(window, {
        name: 'BluetoothRemoteGATTCharacteristic',
        enumerable: false
    });
    addObjProp(window, {
        name: 'BluetoothRemoteGATTDescriptor',
        enumerable: false
    });
    addObjProp(window, {
        name: 'BluetoothRemoteGATTServer',
        enumerable: false
    });
    addObjProp(window, {
        name: 'BluetoothRemoteGATTService',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CaptureController',
        enumerable: false
    });
    addObjProp(window, {
        name: 'DocumentPictureInPicture',
        enumerable: false
    });
    addObjProp(window, {
        name: 'EyeDropper',
        enumerable: false
    });
    addObjProp(window, {
        name: 'FileSystemDirectoryHandle',
        enumerable: false
    });
    addObjProp(window, {
        name: 'FileSystemFileHandle',
        enumerable: false
    });
    addObjProp(window, {
        name: 'FileSystemHandle',
        enumerable: false
    });
    addObjProp(window, {
        name: 'FileSystemWritableFileStream',
        enumerable: false
    });
    addObjProp(window, {
        name: 'FontData',
        enumerable: false
    });
    addObjProp(window, {
        name: 'FragmentDirective',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HID',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HIDConnectionEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HIDDevice',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HIDInputReportEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'IdentityCredential',
        enumerable: false
    });
    addObjProp(window, {
        name: 'IdentityProvider',
        enumerable: false
    });
    addObjProp(window, {
        name: 'IdentityCredentialError',
        enumerable: false
    });
    addObjProp(window, {
        name: 'LaunchParams',
        enumerable: false
    });
    addObjProp(window, {
        name: 'LaunchQueue',
        enumerable: false
    });
    addObjProp(window, {
        name: 'NavigatorLogin',
        enumerable: false
    });
    addObjProp(window, {
        name: 'NotRestoredReasonDetails',
        enumerable: false
    });
    addObjProp(window, {
        name: 'NotRestoredReasons',
        enumerable: false
    });
    addObjProp(window, {
        name: 'OTPCredential',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PaymentAddress',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PaymentRequest',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PaymentRequestUpdateEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PaymentResponse',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PaymentManager',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PaymentMethodChangeEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Presentation',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PresentationAvailability',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PresentationConnection',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PresentationConnectionAvailableEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PresentationConnectionCloseEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PresentationConnectionList',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PresentationReceiver',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PresentationRequest',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PressureObserver',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PressureRecord',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ProtectedAudience',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Serial',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SerialPort',
        enumerable: false
    });
    addObjProp(window, {
        name: 'StorageBucket',
        enumerable: false
    });
    addObjProp(window, {
        name: 'StorageBucketManager',
        enumerable: false
    });
    addObjProp(window, {
        name: 'USB',
        enumerable: false
    });
    addObjProp(window, {
        name: 'USBAlternateInterface',
        enumerable: false
    });
    addObjProp(window, {
        name: 'USBConfiguration',
        enumerable: false
    });
    addObjProp(window, {
        name: 'USBConnectionEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'USBDevice',
        enumerable: false
    });
    addObjProp(window, {
        name: 'USBEndpoint',
        enumerable: false
    });
    addObjProp(window, {
        name: 'USBInTransferResult',
        enumerable: false
    });
    addObjProp(window, {
        name: 'USBInterface',
        enumerable: false
    });
    addObjProp(window, {
        name: 'USBIsochronousInTransferPacket',
        enumerable: false
    });
    addObjProp(window, {
        name: 'USBIsochronousInTransferResult',
        enumerable: false
    });
    addObjProp(window, {
        name: 'USBIsochronousOutTransferPacket',
        enumerable: false
    });
    addObjProp(window, {
        name: 'USBIsochronousOutTransferResult',
        enumerable: false
    });
    addObjProp(window, {
        name: 'USBOutTransferResult',
        enumerable: false
    });
    addObjProp(window, {
        name: 'WakeLock',
        enumerable: false
    });
    addObjProp(window, {
        name: 'WakeLockSentinel',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XRAnchor',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XRAnchorSet',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XRBoundedReferenceSpace',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XRCPUDepthInformation',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XRCamera',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XRDepthInformation',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XRFrame',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XRHitTestResult',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XRHitTestSource',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XRInputSource',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XRInputSourceArray',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XRInputSourceEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XRInputSourcesChangeEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XRLightEstimate',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XRLightProbe',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XRPose',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XRRay',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XRReferenceSpace',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XRReferenceSpaceEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XRRenderState',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XRRigidTransform',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XRSession',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XRSessionEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XRSpace',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XRSystem',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XRTransientInputHitTestResult',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XRTransientInputHitTestSource',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XRView',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XRViewerPose',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XRViewport',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XRWebGLDepthInformation',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XRWebGLLayer',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XRHand',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XRJointPose',
        enumerable: false
    });
    addObjProp(window, {
        name: 'XRJointSpace',
        enumerable: false
    });
    addObjProp(window, {name: 'getScreenDetails'});
    addObjProp(window, {name: 'queryLocalFonts'});
    addObjProp(window, {name: 'showDirectoryPicker'});
    addObjProp(window, {name: 'showOpenFilePicker'});
    addObjProp(window, {name: 'showSaveFilePicker'});
    addObjProp(window, {
        name: 'originAgentCluster',
        get: function originAgentCluster() {
            return getPrivateProp(this, 'originAgentCluster');
        }
    });
    addObjProp(window, {
        name: 'onpageswap',
        get: function onpageswap() {
            return getPrivateProp(this, 'onpageswap');
        },
        set: function onpageswap(value) {
            return setPrivateProp(this, 'onpageswap', value);
        }
    });
    addObjProp(window, {
        name: 'onpagereveal',
        get: function onpagereveal() {
            return getPrivateProp(this, 'onpagereveal');
        },
        set: function onpagereveal(value) {
            return setPrivateProp(this, 'onpagereveal', value);
        }
    });
    addObjProp(window, {
        name: 'credentialless',
        get: function credentialless() {
            return getPrivateProp(this, 'credentialless');
        }
    });
    addObjProp(window, {
        name: 'fence',
        get: function fence() {
            return getPrivateProp(this, 'fence');
        }
    });
    addObjProp(window, {
        name: 'speechSynthesis',
        get: function speechSynthesis() {
            return getPrivateProp(this, 'speechSynthesis');
        }
    });
    addObjProp(window, {
        name: 'onscrollend',
        get: function onscrollend() {
            return getPrivateProp(this, 'onscrollend');
        },
        set: function onscrollend(value) {
            return setPrivateProp(this, 'onscrollend', value);
        }
    });
    addObjProp(window, {
        name: 'onscrollsnapchange',
        get: function onscrollsnapchange() {
            return getPrivateProp(this, 'onscrollsnapchange');
        },
        set: function onscrollsnapchange(value) {
            return setPrivateProp(this, 'onscrollsnapchange', value);
        }
    });
    addObjProp(window, {
        name: 'onscrollsnapchanging',
        get: function onscrollsnapchanging() {
            return getPrivateProp(this, 'onscrollsnapchanging');
        },
        set: function onscrollsnapchanging(value) {
            return setPrivateProp(this, 'onscrollsnapchanging', value);
        }
    });
    addObjProp(window, {
        name: 'BackgroundFetchManager',
        enumerable: false
    });
    addObjProp(window, {
        name: 'BackgroundFetchRecord',
        enumerable: false
    });
    addObjProp(window, {
        name: 'BackgroundFetchRegistration',
        enumerable: false
    });
    addObjProp(window, {
        name: 'BluetoothUUID',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSMarginRule',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSNestedDeclarations',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CSSViewTransitionRule',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CaretPosition',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ChapterInformation',
        enumerable: false
    });
    addObjProp(window, {
        name: 'CropTarget',
        enumerable: false
    });
    addObjProp(window, {
        name: 'DocumentPictureInPictureEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Fence',
        enumerable: false
    });
    addObjProp(window, {
        name: 'FencedFrameConfig',
        enumerable: false
    });
    addObjProp(window, {
        name: 'HTMLFencedFrameElement',
        enumerable: false
    });
    addObjProp(window, {
        name: 'MediaMetadata',
        enumerable: false
    });
    addObjProp(window, {
        name: 'MediaSession',
        enumerable: false
    });
    addObjProp(window, {
        name: 'NavigationActivation',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Notification',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PageRevealEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PageSwapEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PerformanceLongAnimationFrameTiming',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PerformanceScriptTiming',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PeriodicSyncManager',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PermissionStatus',
        enumerable: false
    });
    addObjProp(window, {
        name: 'Permissions',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PushManager',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PushSubscription',
        enumerable: false
    });
    addObjProp(window, {
        name: 'PushSubscriptionOptions',
        enumerable: false
    });
    addObjProp(window, {
        name: 'RTCDataChannel',
        enumerable: false
    });
    addObjProp(window, {
        name: 'RemotePlayback',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ScrollTimeline',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ViewTimeline',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SharedStorage',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SharedStorageWorklet',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SharedWorker',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SnapEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SpeechSynthesis',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SpeechSynthesisErrorEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SpeechSynthesisEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SpeechSynthesisUtterance',
        enumerable: false
    });
    addObjProp(window, {
        name: 'SpeechSynthesisVoice',
        enumerable: false
    });
    addObjProp(window, {
        name: 'ViewTransitionTypeSet',
        enumerable: false
    });
    addObjProp(window, {
        name: 'WebSocketError',
        enumerable: false
    });
    addObjProp(window, {
        name: 'WebSocketStream',
        enumerable: false
    });
    addObjProp(window, {
        name: 'webkitSpeechGrammar',
        enumerable: false
    });
    addObjProp(window, {
        name: 'webkitSpeechGrammarList',
        enumerable: false
    });
    addObjProp(window, {
        name: 'webkitSpeechRecognition',
        enumerable: false
    });
    addObjProp(window, {
        name: 'webkitSpeechRecognitionError',
        enumerable: false
    });
    addObjProp(window, {
        name: 'webkitSpeechRecognitionEvent',
        enumerable: false
    });
    addObjProp(window, {
        name: 'webkitRequestFileSystem',
        value: webkitRequestFileSystem
    });
    addObjProp(window, {name: 'webkitResolveLocalFileSystemURL'});
    addObjProp(window, {
        name: 'dir',
        enumerable: false
    });
    addObjProp(window, {
        name: 'dirxml',
        enumerable: false
    });
    addObjProp(window, {
        name: 'profile',
        enumerable: false
    });
    addObjProp(window, {
        name: 'profileEnd',
        enumerable: false
    });
    addObjProp(window, {
        name: 'clear',
        enumerable: false
    });
    addObjProp(window, {
        name: 'table',
        enumerable: false
    });
    addObjProp(window, {
        name: 'keys',
        enumerable: false
    });
    addObjProp(window, {
        name: 'values',
        enumerable: false
    });
    addObjProp(window, {
        name: 'debug',
        enumerable: false
    });
    addObjProp(window, {
        name: 'undebug',
        enumerable: false
    });
    addObjProp(window, {
        name: 'monitor',
        enumerable: false
    });
    addObjProp(window, {
        name: 'unmonitor',
        enumerable: false
    });
    addObjProp(window, {
        name: 'inspect',
        enumerable: false
    });
    addObjProp(window, {
        name: 'copy',
        enumerable: false
    });
    addObjProp(window, {
        name: 'queryObjects',
        enumerable: false
    });
    addObjProp(window, {
        name: '$_',
        enumerable: false
    });
    addObjProp(window, {
        name: '$0',
        enumerable: false
    });
    addObjProp(window, {
        name: '$1',
        enumerable: false
    });
    addObjProp(window, {
        name: '$2',
        enumerable: false
    });
    addObjProp(window, {
        name: '$3',
        enumerable: false
    });
    addObjProp(window, {
        name: '$4',
        enumerable: false
    });
    addObjProp(window, {
        name: 'getEventListeners',
        enumerable: false
    });
    addObjProp(window, {
        name: 'getAccessibleName',
        enumerable: false
    });
    addObjProp(window, {
        name: 'getAccessibleRole',
        enumerable: false
    });
    addObjProp(window, {
        name: 'monitorEvents',
        enumerable: false
    });
    addObjProp(window, {
        name: 'unmonitorEvents',
        enumerable: false
    });
    addObjProp(window, {
        name: '$',
        enumerable: false
    });
    addObjProp(window, {
        name: '$$',
        enumerable: false
    });
    addObjProp(window, {
        name: '$x',
        enumerable: false
    });

    setPrivateProp(window, 'performance', performanceObj);
    setPrivateProp(window, 'top', window);
    setPrivateProp(window, 'self', window);
    setPrivateProp(window, 'parent', window);
    setPrivateProp(window, 'frames', window);
    setPrivateProp(window, 'navigator', navigator);
    setPrivateProp(window, 'clientInformation', navigator);
    setPrivateProp(window, 'location', location);
    setPrivateProp(window, 'screen', screen);
    setPrivateProp(window, 'history', history);
    setPrivateProp(window, 'localStorage', localStorage);
    setPrivateProp(window, 'sessionStorage', sessionStorage);
    setPrivateProp(window, 'indexedDB', indexedDB);
    setPrivateProp(window, 'document', document);
    setPrivateProp(window, 'visualViewport', visualViewport);
    setPrivateProp(window, 'screenX', 0);
    setPrivateProp(window, 'screenY', 0);
    setPrivateProp(window, 'outerWidth', 1366);
    setPrivateProp(window, 'outerHeight', 728);
    setPrivateProp(window, 'devicePixelRatio', 1);
    setPrivateProp(window, 'screenLeft', 0);
    setPrivateProp(window, 'screenTop', 0);
    setPrivateProp(window, 'innerWidth', 1366);
    setPrivateProp(window, 'innerHeight', 641);
    setPrivateProp(window, 'pageXOffset', 0);
    setPrivateProp(window, 'closed', false);
    setPrivateProp(window, 'isSecureContext', true);
    setPrivateProp(window, 'originAgentCluster', true);

    setPrivateProp(document, 'location', location);
    /**
     以下属性不属于window属性只是为了方便处理一些逻辑
     tagName：方便记录日志
     timeoutGenerate：收集timeout回调函数
     intervalGenerate：收集interval回调函数
     **/
    setPrivateProp(window, 'tagName', 'window');
    setPrivateProp(window, 'timeoutGenerate', new CreateGenerate());
    setPrivateProp(window, 'intervalGenerate', new CreateGenerate());

    return window;
}

createWindow();
// window = createWindow();

/**
 重写getOwnPropertyDescriptor，某些属性获取出的详情为undefined，但是ReReflect.ownKeys获取到
 该情况无法通过代码实现，所以重写getOwnPropertyDescriptor实现
 如：CSSStyleDeclaration中的epubTextCombin、epubTextCombine、epubTextCombine等属性
 * */
const propDesc = originObject.getOwnPropertyDescriptor(Object, 'getOwnPropertyDescriptor');
addObjProp(Object, {
    name: 'getOwnPropertyDescriptor',
    enumerable: false,
    value: function getOwnPropertyDescriptor(obj, prop) {
        const filterProp = {
            [CSSStyleDeclaration]: styleProp.notEnumProp
        };
        if (obj instanceof CSSStyleDeclaration && filterProp[CSSStyleDeclaration].includes(prop)) {
            return undefined;
        }
        return propDesc.value(obj, prop);
    }
});

module.exports = {
    createWindow: createWindow,
    setNavigatorMimeTypes: setNavigatorMimeTypes,
    TextMetrics: TextMetrics,
    Body: HTMLBodyElement,
    Meta: HTMLMetaElement,
    Script: HTMLScriptElement,
    Div: HTMLDivElement,
    A: HTMLAnchorElement,
    Form: HTMLFormElement,
    Input: HTMLInputElement,
    Canvas: HTMLCanvasElement,
    Media: HTMLMediaElement,
    Audio: HTMLAudioElement,
    Video: HTMLVideoElement,
    Text: Text,
    Iframe: HTMLIFrameElement
}