/**
 * ------------------------------------------------------------------
 * Part 1: 核心环境设置 (V8引擎技巧与原型链伪装)
 * ------------------------------------------------------------------
 */

// 引入Node.js核心模块，用于创建无法被 typeof 检测到的特殊对象
const v8 = require('v8');
const vm = require('vm');
v8.setFlagsFromString('--allow-natives-syntax');
const undetectable = vm.runInThisContext("%GetUndetectable()");
v8.setFlagsFromString('--no-allow-natives-syntax');

is_proxy_log=false

// w_log=console.log
w_log=function (){}


!(function (){

  set_toString = function (obj,s){
    Object.defineProperties(obj,{
      [Symbol.toStringTag]:{
        value:s,
        configurable:true
      }
    })
  }
})();

!function () {
  const MyGetOwnPropertySymbols = Object.getOwnPropertySymbols;

  Object.getOwnPropertySymbols = function getOwnPropertySymbols() {
    const result = MyGetOwnPropertySymbols.apply(this, arguments);
    for (let i = 0; i < result.length; i++) {
      if (result[i].toString().indexOf("myToString") != -1) return [];
    }
    return result;
  };

  const $toString = Function.toString;
  const myFunction_toString_symbol = Symbol(
    "myToString(".concat("", ")_", Math.random() + "").toString(36)
  );
  const myToString = function () {
    return (
      (typeof this === "function" && this[myFunction_toString_symbol]) ||
      $toString.call(this)
    );
  };
  function set_native(func, key, value) {
    Object.defineProperty(func, key, {
      enumerable: false,
      configurable: true,
      writable: true,
      value: value,
    });
  }

  //先删除所有函数的toString方法
  delete Function.prototype.toString;
  //在重定义一个所有函数公用的toString方法
  set_native(Function.prototype, "toString", myToString);
  set_native(
    Function.prototype.toString,
    myFunction_toString_symbol,
    "function toString() { [native code] }"
  );
  set_native(
    Object.getOwnPropertySymbols,
    myFunction_toString_symbol,
    `function getOwnPropertySymbols() { [native code] }`
  );
  globalThis.func_set_native = (func) => {
    set_native(
      func,
      myFunction_toString_symbol,
      `function ${func.name || ""}() { [native code] }`
    );
  };
  globalThis.func_set_native_Div = (func, name) => {
    set_native(
      func,
      myFunction_toString_symbol,
      `function ${name || ""}() { [native code] }`
    );
  };
}.bind(this)();
function watch(obj, name) {
  return new Proxy(obj, {
    get(target, p, receiver) {
      // 过滤没用的信息，不进行打印

        let val = Reflect.get(...arguments);
        // if (!val && val!==null){
        if (is_proxy_log){
            if (p==='window' || p==='frames' || p==='self' || p==='top' || p==='parent'){
                w_log(`取值:`, name, ".", p, ` => window的值`);
            }
            else if (p==='document'){
                    w_log(`取值:`, name, ".", p, ` => document的值`)
            }
            else if (p==='navigator'){
                    w_log(`取值:`, name, ".", p, ` => navigator的值`)
            }
            else if (p==='$_ts'){
                    w_log(`取值:`, name, ".", p, ` => ts的值`)
            }
            else{
                   w_log(`取值:`, name, ".", p, ` =>`, val);

            }
        }

        return val;

    },

    set(target, p, value, receiver) {
      if (p === "mythis" || p === "myThis") {
        return Reflect.set(...arguments);
      }
      let val = Reflect.get(...arguments);
      w_log(`设置值:${name}.${p}, ${val} => ${value}`);

      return Reflect.set(...arguments);
    },

    has(target, propKey) {
      //拦截propKey in proxy的操作，返回一个布尔值。
      const temp = Reflect.has(target, propKey);
      w_log(name,` -> has `,propKey);
      return temp;
    },
    deleteProperty(target, propKey) {
      //拦截delete proxy[propKey]的操作，返回一个布尔值。
      const temp = Reflect.deleteProperty(target, propKey);
      w_log(name,` deleteProperty`,propKey);
      return temp;
    },
    ownKeys(target) {
      //拦截Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而Object.keys()的返回结果仅包括目标对象自身的可遍历属性。
      let temp = Reflect.ownKeys(target);
      if (name==='document'){
          w_log('document 修改返回值')
          return [
            "location",
            "cookie",
            "referrer"
        ]
      }
      if (name==="window"){
          w_log('修改 window 的 ownKeys 值')
          debugger;
          return ["Object","Function","Array","Number","parseFloat","parseInt","Infinity","NaN","undefined","Boolean","String","Symbol","Date","Promise","RegExp","Error","AggregateError","EvalError","RangeError","ReferenceError","SyntaxError","TypeError","URIError","globalThis","JSON","Math","Intl","ArrayBuffer","Atomics","Uint8Array","Int8Array","Uint16Array","Int16Array","Uint32Array","Int32Array","BigUint64Array","BigInt64Array","Uint8ClampedArray","Float32Array","Float64Array","DataView","Map","BigInt","Set","WeakMap","WeakSet","Proxy","Reflect","FinalizationRegistry","WeakRef","decodeURI","decodeURIComponent","encodeURI","encodeURIComponent","escape","unescape","eval","isFinite","isNaN","console","Option","Image","Audio","webkitURL","webkitRTCPeerConnection","webkitMediaStream","WebKitMutationObserver","WebKitCSSMatrix","XSLTProcessor","XPathResult","XPathExpression","XPathEvaluator","XMLSerializer","XMLHttpRequestUpload","XMLHttpRequestEventTarget","XMLHttpRequest","XMLDocument","WritableStreamDefaultWriter","WritableStreamDefaultController","WritableStream","Worker","WindowControlsOverlayGeometryChangeEvent","WindowControlsOverlay","Window","WheelEvent","WebSocket","WebGLVertexArrayObject","WebGLUniformLocation","WebGLTransformFeedback","WebGLTexture","WebGLSync","WebGLShaderPrecisionFormat","WebGLShader","WebGLSampler","WebGLRenderingContext","WebGLRenderbuffer","WebGLQuery","WebGLProgram","WebGLObject","WebGLFramebuffer","WebGLContextEvent","WebGLBuffer","WebGLActiveInfo","WebGL2RenderingContext","WaveShaperNode","VisualViewport","VisibilityStateEntry","VirtualKeyboardGeometryChangeEvent","ViewTransitionTypeSet","ViewTransition","ViewTimeline","VideoPlaybackQuality","VideoFrame","VideoColorSpace","ValidityState","VTTCue","UserActivation","URLSearchParams","URLPattern","URL","UIEvent","TrustedTypePolicyFactory","TrustedTypePolicy","TrustedScriptURL","TrustedScript","TrustedHTML","TreeWalker","TransitionEvent","TransformStreamDefaultController","TransformStream","TrackEvent","TouchList","TouchEvent","Touch","ToggleEvent","TimeRanges","TextUpdateEvent","TextTrackList","TextTrackCueList","TextTrackCue","TextTrack","TextMetrics","TextFormatUpdateEvent","TextFormat","TextEvent","TextEncoderStream","TextEncoder","TextDecoderStream","TextDecoder","Text","TaskSignal","TaskPriorityChangeEvent","TaskController","TaskAttributionTiming","SyncManager","SubmitEvent","StyleSheetList","StyleSheet","StylePropertyMapReadOnly","StylePropertyMap","StorageEvent","Storage","StereoPannerNode","StaticRange","SourceBufferList","SourceBuffer","ShadowRoot","Selection","SecurityPolicyViolationEvent","ScrollTimeline","ScriptProcessorNode","ScreenOrientation","Screen","Scheduling","Scheduler","SVGViewElement","SVGUseElement","SVGUnitTypes","SVGTransformList","SVGTransform","SVGTitleElement","SVGTextPositioningElement","SVGTextPathElement","SVGTextElement","SVGTextContentElement","SVGTSpanElement","SVGSymbolElement","SVGSwitchElement","SVGStyleElement","SVGStringList","SVGStopElement","SVGSetElement","SVGScriptElement","SVGSVGElement","SVGRectElement","SVGRect","SVGRadialGradientElement","SVGPreserveAspectRatio","SVGPolylineElement","SVGPolygonElement","SVGPointList","SVGPoint","SVGPatternElement","SVGPathElement","SVGNumberList","SVGNumber","SVGMetadataElement","SVGMatrix","SVGMaskElement","SVGMarkerElement","SVGMPathElement","SVGLinearGradientElement","SVGLineElement","SVGLengthList","SVGLength","SVGImageElement","SVGGraphicsElement","SVGGradientElement","SVGGeometryElement","SVGGElement","SVGForeignObjectElement","SVGFilterElement","SVGFETurbulenceElement","SVGFETileElement","SVGFESpotLightElement","SVGFESpecularLightingElement","SVGFEPointLightElement","SVGFEOffsetElement","SVGFEMorphologyElement","SVGFEMergeNodeElement","SVGFEMergeElement","SVGFEImageElement","SVGFEGaussianBlurElement","SVGFEFuncRElement","SVGFEFuncGElement","SVGFEFuncBElement","SVGFEFuncAElement","SVGFEFloodElement","SVGFEDropShadowElement","SVGFEDistantLightElement","SVGFEDisplacementMapElement","SVGFEDiffuseLightingElement","SVGFEConvolveMatrixElement","SVGFECompositeElement","SVGFEComponentTransferElement","SVGFEColorMatrixElement","SVGFEBlendElement","SVGEllipseElement","SVGElement","SVGDescElement","SVGDefsElement","SVGComponentTransferFunctionElement","SVGClipPathElement","SVGCircleElement","SVGAnimationElement","SVGAnimatedTransformList","SVGAnimatedString","SVGAnimatedRect","SVGAnimatedPreserveAspectRatio","SVGAnimatedNumberList","SVGAnimatedNumber","SVGAnimatedLengthList","SVGAnimatedLength","SVGAnimatedInteger","SVGAnimatedEnumeration","SVGAnimatedBoolean","SVGAnimatedAngle","SVGAnimateTransformElement","SVGAnimateMotionElement","SVGAnimateElement","SVGAngle","SVGAElement","Response","ResizeObserverSize","ResizeObserverEntry","ResizeObserver","Request","ReportingObserver","ReportBody","ReadableStreamDefaultReader","ReadableStreamDefaultController","ReadableStreamBYOBRequest","ReadableStreamBYOBReader","ReadableStream","ReadableByteStreamController","Range","RadioNodeList","RTCTrackEvent","RTCStatsReport","RTCSessionDescription","RTCSctpTransport","RTCRtpTransceiver","RTCRtpSender","RTCRtpReceiver","RTCPeerConnectionIceEvent","RTCPeerConnectionIceErrorEvent","RTCPeerConnection","RTCIceTransport","RTCIceCandidate","RTCErrorEvent","RTCError","RTCEncodedVideoFrame","RTCEncodedAudioFrame","RTCDtlsTransport","RTCDataChannelEvent","RTCDTMFToneChangeEvent","RTCDTMFSender","RTCCertificate","PromiseRejectionEvent","ProgressEvent","Profiler","ProcessingInstruction","PopStateEvent","PointerEvent","PluginArray","Plugin","PictureInPictureWindow","PictureInPictureEvent","PeriodicWave","PerformanceTiming","PerformanceServerTiming","PerformanceScriptTiming","PerformanceResourceTiming","PerformancePaintTiming","PerformanceObserverEntryList","PerformanceObserver","PerformanceNavigationTiming","PerformanceNavigation","PerformanceMeasure","PerformanceMark","PerformanceLongTaskTiming","PerformanceLongAnimationFrameTiming","PerformanceEventTiming","PerformanceEntry","PerformanceElementTiming","Performance","Path2D","PannerNode","PageTransitionEvent","OverconstrainedError","OscillatorNode","OffscreenCanvasRenderingContext2D","OffscreenCanvas","OfflineAudioContext","OfflineAudioCompletionEvent","NodeList","NodeIterator","NodeFilter","Node","NetworkInformation","NavigatorUAData","Navigator","NavigationTransition","NavigationHistoryEntry","NavigationDestination","NavigationCurrentEntryChangeEvent","NavigationActivation","Navigation","NavigateEvent","NamedNodeMap","MutationRecord","MutationObserver","MouseEvent","MimeTypeArray","MimeType","MessagePort","MessageEvent","MessageChannel","MediaStreamTrackVideoStats","MediaStreamTrackProcessor","MediaStreamTrackGenerator","MediaStreamTrackEvent","MediaStreamTrackAudioStats","MediaStreamTrack","MediaStreamEvent","MediaStreamAudioSourceNode","MediaStreamAudioDestinationNode","MediaStream","MediaSourceHandle","MediaSource","MediaRecorder","MediaQueryListEvent","MediaQueryList","MediaList","MediaError","MediaEncryptedEvent","MediaElementAudioSourceNode","MediaCapabilities","MathMLElement","Location","LayoutShiftAttribution","LayoutShift","LargestContentfulPaint","KeyframeEffect","KeyboardEvent","IntersectionObserverEntry","IntersectionObserver","InputEvent","InputDeviceInfo","InputDeviceCapabilities","Ink","ImageData","ImageCapture","ImageBitmapRenderingContext","ImageBitmap","IdleDeadline","IIRFilterNode","IDBVersionChangeEvent","IDBTransaction","IDBRequest","IDBOpenDBRequest","IDBObjectStore","IDBKeyRange","IDBIndex","IDBFactory","IDBDatabase","IDBCursorWithValue","IDBCursor","History","HighlightRegistry","Highlight","Headers","HashChangeEvent","HTMLVideoElement","HTMLUnknownElement","HTMLUListElement","HTMLTrackElement","HTMLTitleElement","HTMLTimeElement","HTMLTextAreaElement","HTMLTemplateElement","HTMLTableSectionElement","HTMLTableRowElement","HTMLTableElement","HTMLTableColElement","HTMLTableCellElement","HTMLTableCaptionElement","HTMLStyleElement","HTMLSpanElement","HTMLSourceElement","HTMLSlotElement","HTMLSelectElement","HTMLScriptElement","HTMLQuoteElement","HTMLProgressElement","HTMLPreElement","HTMLPictureElement","HTMLParamElement","HTMLParagraphElement","HTMLOutputElement","HTMLOptionsCollection","HTMLOptionElement","HTMLOptGroupElement","HTMLObjectElement","HTMLOListElement","HTMLModElement","HTMLMeterElement","HTMLMetaElement","HTMLMenuElement","HTMLMediaElement","HTMLMarqueeElement","HTMLMapElement","HTMLLinkElement","HTMLLegendElement","HTMLLabelElement","HTMLLIElement","HTMLInputElement","HTMLImageElement","HTMLIFrameElement","HTMLHtmlElement","HTMLHeadingElement","HTMLHeadElement","HTMLHRElement","HTMLFrameSetElement","HTMLFrameElement","HTMLFormElement","HTMLFormControlsCollection","HTMLFontElement","HTMLFieldSetElement","HTMLEmbedElement","HTMLElement","HTMLDocument","HTMLDivElement","HTMLDirectoryElement","HTMLDialogElement","HTMLDetailsElement","HTMLDataListElement","HTMLDataElement","HTMLDListElement","HTMLCollection","HTMLCanvasElement","HTMLButtonElement","HTMLBodyElement","HTMLBaseElement","HTMLBRElement","HTMLAudioElement","HTMLAreaElement","HTMLAnchorElement","HTMLAllCollection","GeolocationPositionError","GeolocationPosition","GeolocationCoordinates","Geolocation","GamepadHapticActuator","GamepadEvent","GamepadButton","Gamepad","GainNode","FormDataEvent","FormData","FontFaceSetLoadEvent","FontFace","FocusEvent","FileReader","FileList","File","FeaturePolicy","External","EventTarget","EventSource","EventCounts","Event","ErrorEvent","EncodedVideoChunk","EncodedAudioChunk","ElementInternals","Element","EditContext","DynamicsCompressorNode","DragEvent","DocumentType","DocumentTimeline","DocumentFragment","Document","DelegatedInkTrailPresenter","DelayNode","DecompressionStream","DataTransferItemList","DataTransferItem","DataTransfer","DOMTokenList","DOMStringMap","DOMStringList","DOMRectReadOnly","DOMRectList","DOMRect","DOMQuad","DOMPointReadOnly","DOMPoint","DOMParser","DOMMatrixReadOnly","DOMMatrix","DOMImplementation","DOMException","DOMError","CustomStateSet","CustomEvent","CustomElementRegistry","Crypto","CountQueuingStrategy","ConvolverNode","ContentVisibilityAutoStateChangeEvent","ConstantSourceNode","CompressionStream","CompositionEvent","Comment","CloseWatcher","CloseEvent","ClipboardEvent","CharacterData","CharacterBoundsUpdateEvent","ChannelSplitterNode","ChannelMergerNode","CanvasRenderingContext2D","CanvasPattern","CanvasGradient","CanvasCaptureMediaStreamTrack","CSSVariableReferenceValue","CSSUnparsedValue","CSSUnitValue","CSSTranslate","CSSTransition","CSSTransformValue","CSSTransformComponent","CSSSupportsRule","CSSStyleValue","CSSStyleSheet","CSSStyleRule","CSSStyleDeclaration","CSSStartingStyleRule","CSSSkewY","CSSSkewX","CSSSkew","CSSScopeRule","CSSScale","CSSRuleList","CSSRule","CSSRotate","CSSPropertyRule","CSSPositionValue","CSSPositionTryRule","CSSPositionTryDescriptors","CSSPerspective","CSSPageRule","CSSNumericValue","CSSNumericArray","CSSNestedDeclarations","CSSNamespaceRule","CSSMediaRule","CSSMatrixComponent","CSSMathValue","CSSMathSum","CSSMathProduct","CSSMathNegate","CSSMathMin","CSSMathMax","CSSMathInvert","CSSMathClamp","CSSLayerStatementRule","CSSLayerBlockRule","CSSKeywordValue","CSSKeyframesRule","CSSKeyframeRule","CSSImportRule","CSSImageValue","CSSGroupingRule","CSSFontPaletteValuesRule","CSSFontFaceRule","CSSCounterStyleRule","CSSContainerRule","CSSConditionRule","CSSAnimation","CSS","CSPViolationReportBody","CDATASection","ByteLengthQueuingStrategy","BrowserCaptureMediaStreamTrack","BroadcastChannel","BlobEvent","Blob","BiquadFilterNode","BeforeUnloadEvent","BeforeInstallPromptEvent","BaseAudioContext","BarProp","AudioWorkletNode","AudioSinkInfo","AudioScheduledSourceNode","AudioProcessingEvent","AudioParamMap","AudioParam","AudioNode","AudioListener","AudioDestinationNode","AudioData","AudioContext","AudioBufferSourceNode","AudioBuffer","Attr","AnimationTimeline","AnimationPlaybackEvent","AnimationEvent","AnimationEffect","Animation","AnalyserNode","AbstractRange","AbortSignal","AbortController","window","self","document","name","location","customElements","history","navigation","locationbar","menubar","personalbar","scrollbars","statusbar","toolbar","status","closed","frames","length","top","opener","parent","frameElement","navigator","origin","external","screen","innerWidth","innerHeight","scrollX","pageXOffset","scrollY","pageYOffset","visualViewport","screenX","screenY","outerWidth","outerHeight","devicePixelRatio","event","clientInformation","offscreenBuffering","screenLeft","screenTop","styleMedia","onsearch","trustedTypes","performance","onappinstalled","onbeforeinstallprompt","crypto","indexedDB","sessionStorage","localStorage","onbeforexrselect","onabort","onbeforeinput","onbeforematch","onbeforetoggle","onblur","oncancel","oncanplay","oncanplaythrough","onchange","onclick","onclose","oncontentvisibilityautostatechange","oncontextlost","oncontextmenu","oncontextrestored","oncuechange","ondblclick","ondrag","ondragend","ondragenter","ondragleave","ondragover","ondragstart","ondrop","ondurationchange","onemptied","onended","onerror","onfocus","onformdata","oninput","oninvalid","onkeydown","onkeypress","onkeyup","onload","onloadeddata","onloadedmetadata","onloadstart","onmousedown","onmouseenter","onmouseleave","onmousemove","onmouseout","onmouseover","onmouseup","onmousewheel","onpause","onplay","onplaying","onprogress","onratechange","onreset","onresize","onscroll","onsecuritypolicyviolation","onseeked","onseeking","onselect","onslotchange","onstalled","onsubmit","onsuspend","ontimeupdate","ontoggle","onvolumechange","onwaiting","onwebkitanimationend","onwebkitanimationiteration","onwebkitanimationstart","onwebkittransitionend","onwheel","onauxclick","ongotpointercapture","onlostpointercapture","onpointerdown","onpointermove","onpointerrawupdate","onpointerup","onpointercancel","onpointerover","onpointerout","onpointerenter","onpointerleave","onselectstart","onselectionchange","onanimationend","onanimationiteration","onanimationstart","ontransitionrun","ontransitionstart","ontransitionend","ontransitioncancel","onafterprint","onbeforeprint","onbeforeunload","onhashchange","onlanguagechange","onmessage","onmessageerror","onoffline","ononline","onpagehide","onpageshow","onpopstate","onrejectionhandled","onstorage","onunhandledrejection","onunload","isSecureContext","crossOriginIsolated","scheduler","alert","atob","blur","btoa","cancelAnimationFrame","cancelIdleCallback","captureEvents","clearInterval","clearTimeout","close","confirm","createImageBitmap","fetch","find","focus","getComputedStyle","getSelection","matchMedia","moveBy","moveTo","open","postMessage","print","prompt","queueMicrotask","releaseEvents","reportError","requestAnimationFrame","requestIdleCallback","resizeBy","resizeTo","scroll","scrollBy","scrollTo","setInterval","setTimeout","stop","structuredClone","webkitCancelAnimationFrame","webkitRequestAnimationFrame","Iterator","SuppressedError","DisposableStack","AsyncDisposableStack","Float16Array","chrome","WebAssembly","launchQueue","FragmentDirective","LaunchParams","LaunchQueue","NotRestoredReasonDetails","NotRestoredReasons","originAgentCluster","onpageswap","onpagereveal","credentialless","fence","speechSynthesis","oncommand","onscrollend","onscrollsnapchange","onscrollsnapchanging","BackgroundFetchManager","BackgroundFetchRecord","BackgroundFetchRegistration","BluetoothUUID","CSSFontFeatureValuesRule","CSSMarginRule","CSSViewTransitionRule","CaretPosition","ChapterInformation","CommandEvent","CropTarget","DocumentPictureInPictureEvent","Fence","FencedFrameConfig","HTMLFencedFrameElement","HTMLSelectedContentElement","MediaMetadata","MediaSession","Notification","Observable","Subscriber","PageRevealEvent","PageSwapEvent","PeriodicSyncManager","PermissionStatus","Permissions","PushManager","PushSubscription","PushSubscriptionOptions","RTCDataChannel","RemotePlayback","RestrictionTarget","SharedStorage","SharedStorageWorklet","SharedStorageAppendMethod","SharedStorageClearMethod","SharedStorageDeleteMethod","SharedStorageModifierMethod","SharedStorageSetMethod","SharedWorker","SnapEvent","SpeechSynthesis","SpeechSynthesisErrorEvent","SpeechSynthesisEvent","SpeechSynthesisUtterance","SpeechSynthesisVoice","WebSocketError","WebSocketStream","webkitSpeechGrammar","webkitSpeechGrammarList","webkitSpeechRecognition","webkitSpeechRecognitionError","webkitSpeechRecognitionEvent","webkitRequestFileSystem","webkitResolveLocalFileSystemURL","$_ts","$_4164f4f","_$fp","_$jx","_$aH","dir","dirxml","profile","profileEnd","clear","table","keys","values","debug","undebug","monitor","unmonitor","inspect","copy","queryObjects","$_","$0","$1","$2","$3","$4","getEventListeners","getAccessibleName","getAccessibleRole","monitorEvents","unmonitorEvents","$","$$","$x"]
      }
        w_log(name,` -> ownKeys `,temp);
      return temp;
    },
    getOwnPropertyDescriptor(target, propKey) {
      //拦截Object.getOwnPropertyDescriptor(proxy, propKey)，返回属性的描述对象。
      const temp = Reflect.getOwnPropertyDescriptor(target, propKey);
      return temp;
    },
    defineProperty(target, propKey, propDesc) {
      //拦截Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)，返回一个布尔值。

      const temp = Reflect.defineProperty(target, propKey, propDesc);
        // w_log('检测了 defineProperty',target+'',propKey,propDesc,temp)
      return temp;
    },
    preventExtensions(target) {
      //拦截Object.preventExtensions(proxy)，返回一个布尔值。
      const temp = Reflect.preventExtensions(target);
      return temp;
    },
    getPrototypeOf(target) {
      //拦截Object.getPrototypeOf(proxy)，返回一个对象。
      const temp = Reflect.getPrototypeOf(target);
        // w_log('getPrototypeOf===>',target,temp)
      return temp;
    },
    isExtensible(target) {
      //拦截Object.isExtensible(proxy)，返回一个布尔值。
      const temp = Reflect.isExtensible(target);
      return temp;
    },
    setPrototypeOf(target, proto) {
      //拦截Object.setPrototypeOf(proxy, proto)，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
      const temp = Reflect.setPrototypeOf(target, proto);
      return temp;
    },
    apply(target, object, args) {
      //拦截 Proxy 实例作为函数调用的操作，比如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)。
      const temp = Reflect.apply(target, object, args);
      return temp;
    },
    construct(target, args) {
      //拦截 Proxy 实例作为构造函数调用的操作，比如new proxy(...args)。
      const temp = Reflect.construct(target, args);
      return temp;
    },
  });
}

window = globalThis;


__filename=undefined;
__dirname=undefined;
ActiveXObject=undefined;
window.name=''



// 伪装 window 的类型，使其通过 Object.prototype.toString.call(window) 检测
function Window(){};
window.Window = Window;
window.__proto__ = Window.prototype;
Object.defineProperties(window, {
    [Symbol.toStringTag]: {
        value: 'Window',
        configurable: true
    }
});

// 伪装 document 的类型和原型链
function Document(){}
function HTMLDocument(){}
Object.setPrototypeOf(HTMLDocument.prototype, Document.prototype);
document = new HTMLDocument();

// 将 require 放在这里，因为它可能需要 window 和 document
require("./content"); // 假设这个文件定义了全局变量 content

/**
 * ------------------------------------------------------------------
 * Part 2: 模拟的DOM元素对象池
 * ------------------------------------------------------------------
 */



// 模拟页面上的 meta 标签
const meta1 = {
    content: content, // 使用 content.js 中定义的变量
    r: 'm',
    getAttribute: function(tag){
        if (tag === 'r') return 'm';
        w_log("meta1 => getAttribute", tag);
    },
    parentNode:{ removeChild: function() {} }
};


script0={
    parentElement:watch({
        removeChild:function (ele) {
            w_log('getElementsByTagName.script.0.parentElement.removeChild:',ele)
            // process.exit(0)
            return ele
        },
    },'getElementsByTagName.script.0.parentElement'),
    getAttribute:function getAttribute (e) {
        if (e==='r'){
            return 'm'
        }
        w_log('getElementsByTagName.script.0.getAttribute')
        process.exit(0)
    },
    src:'',
    innerText:"",
}

script1={
    parentElement:watch({
        removeChild:function (ele) {
            w_log('getElementsByTagName.script.1.parentElement.removeChild:',ele)
            // process.exit(0)
            return ele
        },
    },'getElementsByTagName.script.1.parentElement'),
    src:'',
    getAttribute:function getAttribute (e) {
        if (e==='r'){
            return 'm'
        }
        w_log('getElementsByTagName.script.1.getAttribute')
        process.exit(0)
    }
}
// 模拟 div > i 结构
const i1 = { length: 0 };
const div1 = {
    getElementsByTagName: function (tag){
        if (tag === 'i') return i1;
        w_log("div1 => getElementsByTagName", tag);



    },

};

// 模拟 a 标签
const a1 = watch({
    port: '',
    search: '',
    hash: '',
    href: 'https://fj.189.cn/ic',
    protocol: 'https:',
    hostname: 'fj.189.cn',
    pathname: '/ic'
}, 'a1');

// 准备多个 input 对象，因为 createElement 每次调用都应返回新对象
const l_input = {}, l2_input = {}, l3_input = {};

// 准备 form 对象，并为其关键属性设置 getter/setter 钩子，用于调试和绕过检测
const form1 = {};
let form_action_storage = '';
Object.defineProperty(form1, 'action', {
    get() {
        w_log('HOOK: form.action 被读取, 返回第一个input对象');
        return l_input;
    },
    set(v) {
        w_log('HOOK: form.action 被设置为 ->', v);
        form_action_storage = v;
    }
});
Object.defineProperty(form1, 'textContent', {
    get() {
        w_log('HOOK: form.textContent 被读取, 返回第二个input对象');
        return l2_input;
    },
    set(v) {
        w_log('HOOK: form.textContent 被设置为 ->', v);
    }
});

/**
 * ------------------------------------------------------------------
 * Part 3: 定义 Document.prototype 上的方法和属性
 * ------------------------------------------------------------------
 */
document.cookie = ''; // 初始化 cookie

// [关键] 伪装 document.all，使其 typeof 结果为 'undefined'
Object.defineProperty(Document.prototype, 'all', {
    configurable: true, enumerable: true,
    value: undetectable, writable: true,
});

// 伪装 document 的类型字符串
Object.defineProperty(Document.prototype, 'toString', {
    value: function() { return '[object HTMLDocument]'; },
});

// 模拟 createElement，使用计数器返回不同的 input 对象
let input_count = 0;
Document.prototype.createElement = function(tag) {
    w_log("document => createElement", tag);
    if (tag === 'div') return div1;
    if (tag === 'a') return a1;
    if (tag === 'form') return form1;
    if (tag === 'input') {
        input_count++;
        if (input_count === 1) return l_input;
        if (input_count === 2) return l2_input;
        return l3_input;
    }
    return {};
};
window.DOMParser  = function DOMParser  (){
    w_log("DOMParser",arguments)
}
// 模拟 getElementsByTagName，第一次调用返回 script 列表，之后返回空
let script_first_call = true;
Document.prototype.getElementsByTagName = function(tag) {
    w_log("document => getElementsByTagName", tag);
    if (tag === 'base') return { length: 0 };
    if (tag === 'meta') return [meta1];
    if (tag==='script'){
        debugger;
            return [
                script0,
                script1,
            ]
        }
    return [];
};

Document.prototype.getElementById = function(id) {
    w_log("document => getElementById", id);
    if (id === 'KrwhDtI7LTJG') return meta1;
    if (id === 'root-hammerhead-shadow-ui') return null; // 常见检测
    return null;
};

// 其他 document 属性和方法
Document.prototype.body = null;
Document.prototype.documentElement = {};
Document.prototype.visibilityState = 'visible';
Document.prototype.appendChild = function() {};
Document.prototype.removeChild = function() {};
Document.prototype.addEventListener = function() {};
Document.prototype.attachEvent = undefined; // IE 特有，通常为 undefined

/**
 * ------------------------------------------------------------------
 * Part 4: 定义 window 上的其他全局对象和属性
 * ------------------------------------------------------------------
 */

// [关键] 伪装 navigator.webdriver
function Navigator(){};
function webdriver_func() { return false; }
webdriver_func.toString = function() { return 'function webdriver() { [native code] }'; };
Object.defineProperty(Navigator.prototype, 'webdriver', {
    configurable: true, enumerable: true,
    get: webdriver_func
});
navigator = new Navigator();
Object.assign(navigator, {
    appCodeName: "Mozilla", appName: "Netscape",
    appVersion: "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
    cookieEnabled: true, deviceMemory: 8, language: "zh-CN", languages: ["zh-CN", "en", "zh"],
    onLine: true, platform: "Win32", product: "Gecko", productSub: '20030107',
    userAgent: "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
    vendor: "Google Inc.", vendorSub: "",maxTouchPoints:1,connection:watch({downlink:10,effectiveType:'4g',rtt:350,saveData:false},'connection'),

});

// location 对象
location = {
    "ancestorOrigins": {},
    "href": "https://fj.189.cn/ic",
    "origin": "https://fj.189.cn",
    "protocol": "https:",
    "host": "fj.189.cn",
    "hostname": "fj.189.cn",
    "port": "",
    "pathname": "/ic",
    "search": "",
    "hash": ""
};

// 其他全局 API
window.document = document;
window.navigator = navigator;
window.clientInformation = navigator;
window.location = location;
window.innerHeight=1279
window.innerWidth=2560
window.outerHeight=1400
window.outerWidth=2560



window.screen = { availHeight: 1392, availWidth: 2560, height: 1440, width: 2560, colorDepth: 24, pixelDepth: 24 };
window.history = { length: 2 };
window.chrome = watch({},'chrome');
window.fetch=function fetch(){
    w_log("fetch",arguments)
    debugger;
}



Storage = function Storage(){
    throw new TypeError("Illegal constructor");
};func_set_native(Storage);
Object.defineProperties(Storage.prototype, {
    [Symbol.toStringTag]: {
        value: "Storage",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////


Storage.prototype.clear = function clear(){
    debugger;
    let temp = Object.keys(this)
    for(var i = 0;i < temp.length;i++){
        delete this[temp[i]]
    }
};func_set_native(Storage.prototype.clear);

Storage.prototype.getItem = function getItem(k){
    w_log(arguments)
    // debugger;
    return this[k];
};func_set_native(Storage.prototype.getItem);

Storage.prototype.key = function key(index){
    w_log(arguments)
    // debugger;
    return Object.keys(this)[index];
};func_set_native(Storage.prototype.key);

Storage.prototype.removeItem = function removeItem(k){
    w_log(arguments)
    // debugger;
    delete this[k];
};func_set_native(Storage.prototype.removeItem);

Storage.prototype.setItem = function setItem(k,v){
    w_log(arguments)
    // debugger;
    this[k] = v;
};func_set_native(Storage.prototype.setItem);


//////可能会被检测
Storage.prototype.__defineGetter__('length', function length() {
    return Object.keys(this).length;
});


///////////////////////////////////////////////////////////////

localStorage = {};

///////////////////////////////////////////////////////////////
localStorage.__proto__ = Storage.prototype;

sessionStorage = {};
sessionStorage.__proto__ = Storage.prototype;

window.setTimeout = function() {};
window.setInterval = function() {};
window.addEventListener = function() {};
window.attachEvent = undefined;
window.MutationObserver = function() { return { observe: function() {} } };
window.devicePixelRatio=1;
XMLHttpRequest = function XMLHttpRequest(){};
Object.defineProperties(XMLHttpRequest.prototype, {
    [Symbol.toStringTag]: {
        value: "XMLHttpRequest",
        configurable: true
    }
});
///////////////////////////////////////////////////////////////
XMLHttpRequest.prototype.open = function open(method,url,async = true,user = '',password = ''){
    // debugger;
    w_log('XMLHttpRequest open==>',arguments)
    this.method = method;
    this.url = url;
    this.async = async;
    this.user = user;
    this.password = password;

};
func_set_native(XMLHttpRequest.prototype.open);
XMLHttpRequest.prototype.send = function send(body = null){
    w_log('send==>',arguments)
    this.body = body;
    // debugger;
};
func_set_native(XMLHttpRequest.prototype.send);
XMLHttpRequest.prototype.onload = function onload(){
    w_log('onload===>',arguments)
};
XMLHttpRequest.prototype.onreadystatechange = function onreadystatechange(){
    w_log('onreadystatechange==>',arguments)
};
window.XMLHttpRequest=XMLHttpRequest

window.Request=function Request(){
    w_log('Request==>',arguments)
}

window.indexedDB=watch({open:function (){}},'indexedDB')
performance=watch({
    now : function (){
        return 4809.79999999702+10
    }


},'performance');

window=watch( window, 'window')
window.top = window;
window.self = window;
navigator=watch( navigator, 'navigator')
document=watch( document, 'document')
location=watch( location, 'location')
screen=watch( screen, 'screen')






/**
 * ------------------------------------------------------------------
 * Part 5: 加载目标JS并执行
 * ------------------------------------------------------------------
 */

// 依次加载网站的JS文件
require("./ts.js");
require("./js1.js");

// 定义获取cookie的函数并执行
function get_cookie(){
    // return document.cookie.match(/l3KivyH2h0m6T=([^;]+)/);
    return document.cookie.match(/NOh8RTWx6K2dT=([^;]+)/);
}





console.log(get_cookie()[1])
console.log(get_cookie()[1].length)
