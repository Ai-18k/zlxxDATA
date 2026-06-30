const {
    getPrivateProp,
    setPrivateProp,
    setFunctionPrototype,
    addObjProp
} = require("../utility.js");
const HTMLElement = require("../HTML/api/HTMLElement.js");
const initHTML = require("../HTML/fun/initHtml.js");
const staticProp = [
    ["NETWORK_EMPTY", 0],
    ["NETWORK_IDLE", 1],
    ["NETWORK_LOADING", 2],
    ["NETWORK_NO_SOURCE", 3],
    ["HAVE_NOTHING", 0],
    ["HAVE_METADATA", 1],
    ["HAVE_CURRENT_DATA", 2],
    ["HAVE_FUTURE_DATA", 3],
    ["HAVE_ENOUGH_DATA", 4]
];

/**
 * @constructor HTMLMediaElement Media构造函数
 * @param {object} options 配置项
 * @param {object} options[prop] HTMLElement下的所有属性都可配置
 * */
function HTMLMediaElement(options = undefined) {
    if (options) {
        let newOptions = {
            nodeName: 'MEDIA',
            nodeType: 1,
            tagName: 'MEDIA'
        }
        if(typeof options === 'string') {
            newOptions.vmDom = options;
        }else{
            newOptions = {...newOptions, ...options};
        }
        initHTML(this, newOptions);
    }
}

staticProp.forEach(function (item) {
    addObjProp(HTMLMediaElement, {
        name: item[0],
        value: item[1],
        configurable: false,
        writable: false
    })
});

setFunctionPrototype(HTMLMediaElement, () => {
    addObjProp(HTMLMediaElement.prototype, {
        name: 'error',
        get: function error() {
            return getPrivateProp(this, 'error')
        }
    });
    addObjProp(HTMLMediaElement.prototype, {
        name: 'currentSrc',
        get: function currentSrc() {
            return getPrivateProp(this, 'currentSrc')
        }
    });
    addObjProp(HTMLMediaElement.prototype, {
        name: 'crossOrigin',
        get: function crossOrigin() {
            return getPrivateProp(this, 'crossOrigin')
        },
        set: function crossOrigin(value) {
            return setPrivateProp(this, 'crossOrigin', value)
        }
    });
    addObjProp(HTMLMediaElement.prototype, {
        name: 'networkState',
        get: function networkState() {
            return getPrivateProp(this, 'networkState')
        }
    });
    addObjProp(HTMLMediaElement.prototype, {
        name: 'preload',
        get: function preload() {
            return getPrivateProp(this, 'preload')
        },
        set: function preload(value) {
            return setPrivateProp(this, 'preload', value)
        }
    });
    addObjProp(HTMLMediaElement.prototype, {
        name: 'buffered',
        get: function buffered() {
            return getPrivateProp(this, 'buffered')
        }
    });
    addObjProp(HTMLMediaElement.prototype, {
        name: 'readyState',
        get: function readyState() {
            return getPrivateProp(this, 'readyState')
        }
    });
    addObjProp(HTMLMediaElement.prototype, {
        name: 'buffered',
        get: function buffered() {
            return getPrivateProp(this, 'buffered')
        }
    });
    addObjProp(HTMLMediaElement.prototype, {
        name: 'currentTime',
        get: function currentTime() {
            return getPrivateProp(this, 'currentTime')
        },
        set: function currentTime(value) {
            return setPrivateProp(this, 'currentTime', value)
        }
    });
    addObjProp(HTMLMediaElement.prototype, {
        name: 'duration',
        get: function duration() {
            return getPrivateProp(this, 'duration')
        }
    });
    addObjProp(HTMLMediaElement.prototype, {
        name: 'paused',
        get: function paused() {
            return getPrivateProp(this, 'paused')
        }
    });
    addObjProp(HTMLMediaElement.prototype, {
        name: 'defaultPlaybackRate',
        get: function defaultPlaybackRate() {
            return getPrivateProp(this, 'defaultPlaybackRate')
        },
        set: function defaultPlaybackRate(value) {
            return setPrivateProp(this, 'defaultPlaybackRate', value)
        }
    });
    addObjProp(HTMLMediaElement.prototype, {
        name: 'playbackRate',
        get: function playbackRate() {
            return getPrivateProp(this, 'playbackRate')
        },
        set: function playbackRate(value) {
            return setPrivateProp(this, 'playbackRate', value)
        }
    });
    addObjProp(HTMLMediaElement.prototype, {
        name: 'played',
        get: function played() {
            return getPrivateProp(this, 'played')
        }
    });
    addObjProp(HTMLMediaElement.prototype, {
        name: 'seekable',
        get: function seekable() {
            return getPrivateProp(this, 'seekable')
        }
    });
    addObjProp(HTMLMediaElement.prototype, {
        name: 'ended',
        get: function ended() {
            return getPrivateProp(this, 'ended')
        }
    });
    addObjProp(HTMLMediaElement.prototype, {
        name: 'autoplay',
        get: function autoplay() {
            return getPrivateProp(this, 'autoplay')
        },
        set: function autoplay(value) {
            return setPrivateProp(this, 'autoplay', value)
        }
    });
    addObjProp(HTMLMediaElement.prototype, {
        name: 'loop',
        get: function loop() {
            return getPrivateProp(this, 'loop')
        },
        set: function loop(value) {
            return setPrivateProp(this, 'loop', value)
        }
    });
    addObjProp(HTMLMediaElement.prototype, {
        name: 'preservesPitch',
        get: function preservesPitch() {
            return getPrivateProp(this, 'preservesPitch')
        },
        set: function preservesPitch(value) {
            return setPrivateProp(this, 'preservesPitch', value)
        }
    });
    addObjProp(HTMLMediaElement.prototype, {
        name: 'controls',
        get: function controls() {
            return getPrivateProp(this, 'controls')
        },
        set: function controls(value) {
            return setPrivateProp(this, 'controls', value)
        }
    });
    addObjProp(HTMLMediaElement.prototype, {
        name: 'controlsList',
        get: function controlsList() {
            return getPrivateProp(this, 'controlsList')
        },
        set: function controlsList(value) {
            return setPrivateProp(this, 'controlsList', value)
        }
    });
    addObjProp(HTMLMediaElement.prototype, {
        name: 'volume',
        get: function volume() {
            return getPrivateProp(this, 'volume')
        },
        set: function volume(value) {
            return setPrivateProp(this, 'volume', value)
        }
    });
    addObjProp(HTMLMediaElement.prototype, {
        name: 'muted',
        get: function muted() {
            return getPrivateProp(this, 'muted')
        },
        set: function muted(value) {
            return setPrivateProp(this, 'muted', value)
        }
    });
    addObjProp(HTMLMediaElement.prototype, {
        name: 'defaultMuted',
        get: function defaultMuted() {
            return getPrivateProp(this, 'defaultMuted')
        },
        set: function defaultMuted(value) {
            return setPrivateProp(this, 'defaultMuted', value)
        }
    });
    addObjProp(HTMLMediaElement.prototype, {
        name: 'textTracks',
        get: function textTracks() {
            return getPrivateProp(this, 'textTracks')
        }
    });
    addObjProp(HTMLMediaElement.prototype, {
        name: 'webkitAudioDecodedByteCount',
        get: function webkitAudioDecodedByteCount() {
            return getPrivateProp(this, 'webkitAudioDecodedByteCount')
        }
    });
    addObjProp(HTMLMediaElement.prototype, {
        name: 'webkitVideoDecodedByteCount',
        get: function webkitVideoDecodedByteCount() {
            return getPrivateProp(this, 'webkitVideoDecodedByteCount')
        }
    });
    addObjProp(HTMLMediaElement.prototype, {
        name: 'onencrypted',
        get: function onencrypted() {
            return getPrivateProp(this, 'onencrypted')
        },
        set: function onencrypted(value) {
            return setPrivateProp(this, 'onencrypted', value)
        }
    });
    addObjProp(HTMLMediaElement.prototype, {
        name: 'onwaitingforkey',
        get: function onwaitingforkey() {
            return getPrivateProp(this, 'onwaitingforkey')
        },
        set: function onwaitingforkey(value) {
            return setPrivateProp(this, 'onwaitingforkey', value)
        }
    });
    addObjProp(HTMLMediaElement.prototype, {
        name: 'srcObject',
        get: function srcObject() {
            return getPrivateProp(this, 'srcObject')
        },
        set: function srcObject(value) {
            return setPrivateProp(this, 'srcObject', value)
        }
    });
    staticProp.forEach(function (item) {
        addObjProp(HTMLMediaElement.prototype, {
            name: item[0],
            value: item[1],
            configurable: false,
            writable: false
        })
    });
    addObjProp(HTMLMediaElement.prototype, {name: 'addTextTrack'});
    addObjProp(HTMLMediaElement.prototype, {
        name: 'canPlayType',
        value: function canPlayType(type, mediaType = undefined) {
            let playType = '';
            if (type){
                type = type.at(-1) !== ';' ? `${type};` : type;
                // type = mediaType? `${type},${mediaType}`: type;
                type = type.replace(/\s/g, "");
                if ([
                    'audio/ogg;codecs="vorbis";', 'audio/wav;codecs="1";', 'audio/mpeg;',
                    'video/mp4;codecs="avc1.42E01E";', 'video/webm;codecs="vp8,vorbis";',
                    'video/mp4;codecs="avc1.4D401E";'
                ].includes(type)) {
                    playType = 'probably';
                } else if ([
                    'audio/x-m4a;audio/aac;',
                    'audio/mp4', 'video/mp4',
                    'audio/x-m4a;'
                ].includes(type)) {
                    playType = 'maybe';
                }
            }
            return playType;
        }
    });
    addObjProp(HTMLMediaElement.prototype, {name: 'captureStream'});
    addObjProp(HTMLMediaElement.prototype, {name: 'load'});
    addObjProp(HTMLMediaElement.prototype, {name: 'pause'});
    addObjProp(HTMLMediaElement.prototype, {name: 'play'});
    addObjProp(HTMLMediaElement.prototype, {
        name: 'sinkId',
        get: function sinkId() {
            return getPrivateProp(this, 'sinkId')
        }
    });
    addObjProp(HTMLMediaElement.prototype, {
        name: 'remote',
        get: function remote() {
            return getPrivateProp(this, 'remote')
        }
    });
    addObjProp(HTMLMediaElement.prototype, {
        name: 'disableRemotePlayback',
        get: function disableRemotePlayback() {
            return getPrivateProp(this, 'disableRemotePlayback')
        },
        set: function disableRemotePlayback(value) {
            return setPrivateProp(this, 'disableRemotePlayback', value)
        }
    });
    addObjProp(HTMLMediaElement.prototype, {name: 'setSinkId'});
    addObjProp(HTMLMediaElement.prototype, {
        name: 'constructor',
        value: HTMLMediaElement,
        enumerable: false
    });
    addObjProp(HTMLMediaElement.prototype, {
        name: 'mediaKeys',
        get: function mediaKeys() {
            return getPrivateProp(this, 'mediaKeys')
        }
    });
    addObjProp(HTMLMediaElement.prototype, {name: 'setMediaKeys'});
}, HTMLElement);

module.exports = HTMLMediaElement;