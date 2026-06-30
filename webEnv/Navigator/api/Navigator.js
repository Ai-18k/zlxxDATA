const {
    setFunctionPrototype,
    addObjProp,
    getPrivateProp,
    setPrivateProp,
    getAttrProto,
    originObject
} = require("../../utility.js");

function Navigator(options= undefined) {
    if (options) {
        originObject.keys(options).forEach((key) => {
            const rootProto = getAttrProto(this, key);
            if (rootProto.hasOwnProperty(key)) {
                const propDesc = originObject.getOwnPropertyDescriptor(rootProto, key);
                if (propDesc.get || options[key] instanceof Function) {
                    setPrivateProp(this, key, options[key]);
                } else {
                    throw new Error(`navigator下的${key}非函数`);
                }
            } else {
                this[key] = options[key];
            }
        });
    }
}

setFunctionPrototype(Navigator, () => {
    addObjProp(Navigator.prototype, {
        name: 'vendorSub',
        get: function vendorSub() {
            return getPrivateProp(this, 'vendorSub');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'productSub',
        get: function productSub() {
            return getPrivateProp(this, 'productSub');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'vendor',
        get: function vendor() {
            return getPrivateProp(this, 'vendor');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'maxTouchPoints',
        get: function maxTouchPoints() {
            return getPrivateProp(this, 'maxTouchPoints');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'scheduling',
        get: function scheduling() {
            return getPrivateProp(this, 'scheduling');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'userActivation',
        get: function userActivation() {
            return getPrivateProp(this, 'userActivation');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'doNotTrack',
        get: function doNotTrack() {
            return getPrivateProp(this, 'doNotTrack');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'geolocation',
        get: function geolocation() {
            return getPrivateProp(this, 'geolocation');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'connection',
        get: function connection() {
            return getPrivateProp(this, 'connection');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'plugins',
        get: function plugins() {
            return getPrivateProp(this, 'plugins');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'mimeTypes',
        get: function mimeTypes() {
            return getPrivateProp(this, 'mimeTypes');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'pdfViewerEnabled',
        get: function pdfViewerEnabled() {
            return true;
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'webkitTemporaryStorage',
        get: function webkitTemporaryStorage() {
            return getPrivateProp(this, 'webkitTemporaryStorage');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'webkitPersistentStorage',
        get: function webkitPersistentStorage() {
            return getPrivateProp(this, 'webkitPersistentStorage');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'windowControlsOverlay',
        get: function windowControlsOverlay() {
            return getPrivateProp(this, 'windowControlsOverlay');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'hardwareConcurrency',
        get: function hardwareConcurrency() {
            return 4;
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'cookieEnabled',
        get: function cookieEnabled() {
            return getPrivateProp(this, 'cookieEnabled');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'appCodeName',
        get: function appCodeName() {
            return getPrivateProp(this, 'appCodeName');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'appName',
        get: function appName() {
            return getPrivateProp(this, 'appName');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'appVersion',
        get: function appVersion() {
            return getPrivateProp(this, 'appVersion');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'platform',
        get: function platform() {
            return getPrivateProp(this, 'platform');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'product',
        get: function product() {
            return getPrivateProp(this, 'product');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'userAgent',
        get: function userAgent() {
            return getPrivateProp(this, 'userAgent');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'language',
        get: function language() {
            return getPrivateProp(this, 'language');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'languages',
        get: function languages() {
            return getPrivateProp(this, 'languages');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'onLine',
        get: function onLine() {
            return getPrivateProp(this, 'onLine');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'webdriver',
        get: function webdriver() {
            return getPrivateProp(this, 'webdriver');
        }
    });
    addObjProp(Navigator.prototype, {name: 'getGamepads'});
    addObjProp(Navigator.prototype, {name: 'javaEnabled'});
    addObjProp(Navigator.prototype, {name: 'sendBeacon'});
    addObjProp(Navigator.prototype, {
        name: 'vibrate',
        value: function vibrate(ms) {}
    });
    addObjProp(Navigator.prototype, {
        name: 'constructor',
        value: Navigator,
        enumerable: false
    });
    addObjProp(Navigator.prototype, {
        name: 'deprecatedRunAdAuctionEnforcesKAnonymity',
        get: function deprecatedRunAdAuctionEnforcesKAnonymity() {
            return getPrivateProp(this, 'deprecatedRunAdAuctionEnforcesKAnonymity');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'protectedAudience',
        get: function protectedAudience() {
            return getPrivateProp(this, 'protectedAudience');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'bluetooth',
        get: function bluetooth() {
            return getPrivateProp(this, 'bluetooth');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'storageBuckets',
        get: function storageBuckets() {
            return getPrivateProp(this, 'storageBuckets');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'clipboard',
        get: function clipboard() {
            return getPrivateProp(this, 'clipboard');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'credentials',
        get: function credentials() {
            return getPrivateProp(this, 'credentials');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'keyboard',
        get: function keyboard() {
            return getPrivateProp(this, 'keyboard');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'managed',
        get: function managed() {
            return getPrivateProp(this, 'managed');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'mediaDevices',
        get: function mediaDevices() {
            return getPrivateProp(this, 'mediaDevices');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'storage',
        get: function storage() {
            return getPrivateProp(this, 'storage');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'serviceWorker',
        get: function serviceWorker() {
            return getPrivateProp(this, 'serviceWorker');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'virtualKeyboard',
        get: function virtualKeyboard() {
            return getPrivateProp(this, 'virtualKeyboard');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'wakeLock',
        get: function wakeLock() {
            return getPrivateProp(this, 'wakeLock');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'deviceMemory',
        get: function deviceMemory() {
            return getPrivateProp(this, 'deviceMemory');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'userAgentData',
        get: function userAgentData() {
            return getPrivateProp(this, 'userAgentData');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'login',
        get: function login() {
            return getPrivateProp(this, 'login');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'ink',
        get: function ink() {
            return getPrivateProp(this, 'ink');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'mediaCapabilities',
        get: function mediaCapabilities() {
            return getPrivateProp(this, 'mediaCapabilities');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'devicePosture',
        get: function devicePosture() {
            return getPrivateProp(this, 'devicePosture');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'hid',
        get: function hid() {
            return getPrivateProp(this, 'hid');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'locks',
        get: function locks() {
            return getPrivateProp(this, 'locks');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'gpu',
        get: function gpu() {
            return getPrivateProp(this, 'gpu');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'mediaSession',
        get: function mediaSession() {
            return getPrivateProp(this, 'mediaSession');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'permissions',
        get: function permissions() {
            return getPrivateProp(this, 'permissions');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'presentation',
        get: function presentation() {
            return getPrivateProp(this, 'presentation');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'usb',
        get: function usb() {
            return getPrivateProp(this, 'usb');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'xr',
        get: function xr() {
            return getPrivateProp(this, 'xr');
        }
    });
    addObjProp(Navigator.prototype, {
        name: 'serial',
        get: function serial() {
            return getPrivateProp(this, 'serial');
        }
    });
    addObjProp(Navigator.prototype, {name: 'adAuctionComponents'});
    addObjProp(Navigator.prototype, {name: 'runAdAuction'});
    addObjProp(Navigator.prototype, {name: 'canLoadAdAuctionFencedFrame'});
    addObjProp(Navigator.prototype, {name: 'canShare'});
    addObjProp(Navigator.prototype, {name: 'share'});
    addObjProp(Navigator.prototype, {name: 'clearAppBadge'});
    addObjProp(Navigator.prototype, {
        name: 'getBattery',
        value: function getBattery() {
            return getPrivateProp(this, 'getBattery');
        }
    });
    addObjProp(Navigator.prototype, {name: 'getUserMedia'});
    addObjProp(Navigator.prototype, {name: 'requestMIDIAccess'});
    addObjProp(Navigator.prototype, {name: 'requestMediaKeySystemAcces'});
    addObjProp(Navigator.prototype, {name: 'setAppBadge'});
    addObjProp(Navigator.prototype, {name: 'webkitGetUserMedia'});
    addObjProp(Navigator.prototype, {name: 'clearOriginJoinedAdInterestGroups'});
    addObjProp(Navigator.prototype, {name: 'createAuctionNonce'});
    addObjProp(Navigator.prototype, {name: 'joinAdInterestGroup'});
    addObjProp(Navigator.prototype, {name: 'leaveAdInterestGroup'});
    addObjProp(Navigator.prototype, {name: 'leaveAdInterestGroup'});
    addObjProp(Navigator.prototype, {name: 'updateAdInterestGroups'});
    addObjProp(Navigator.prototype, {name: 'deprecatedReplaceInURN'});
    addObjProp(Navigator.prototype, {name: 'deprecatedURNToURL'});
    addObjProp(Navigator.prototype, {name: 'getInstalledRelatedApps'});
    addObjProp(Navigator.prototype, {name: 'getInterestGroupAdAuctionData'});
    addObjProp(Navigator.prototype, {name: 'registerProtocolHandler'});
    addObjProp(Navigator.prototype, {name: 'unregisterProtocolHandler'});
});

module.exports = Navigator;