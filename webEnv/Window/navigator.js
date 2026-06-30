const {
    setPrivateProp,
} = require("../utility.js");
const {
    Navigator,
    MimeTypeArray,
    PluginArray,
    NetworkInformation,
    DeprecatedStorageQuota,
    BatteryManager,
    LockManager
} = require("../Navigator/api");

/**
 * @method setNavigatorMimeTypes 设置NavigatorMimeTypes
 * @param {Object} navigatorObj navigator对象
 * @param {Object} options 配置项
 * @param {Boolean} options.enabledPluginAlike enabledPlugin属性是否一致
 * @param {Array} options.mimeTypes MimeTypes数组
 * */
function setNavigatorMimeTypes(navigatorObj, options) {
    const mimeTypes = new MimeTypeArray(options);
    setPrivateProp(navigatorObj, 'mimeTypes', mimeTypes);
    let plugins = {};
    if (options.enabledPluginAlike){
        plugins = new PluginArray([
            mimeTypes[0].enabledPlugin,
            {
                name: 'Chrome PDF Viewer',
                description: "Portable Document Format",
                filename: 'internal-pdf-viewer',
                mimeTypes: options.mimeTypes
            }, {
                name: 'Chromium PDF Viewer',
                description: "Portable Document Format",
                filename: 'internal-pdf-viewer',
                mimeTypes: options.mimeTypes
            }, {
                name: 'Microsoft Edge PDF Viewer',
                description: "Portable Document Format",
                filename: 'internal-pdf-viewer',
                mimeTypes: options.mimeTypes
            }, {
                name: 'WebKit built-in PDF',
                description: "Portable Document Format",
                filename: 'internal-pdf-viewer',
                mimeTypes: options.mimeTypes
            }
        ]);
    }else{
        const pluginsArr = [];
        options.mimeTypes.forEach((item)=>{
            pluginsArr.push({
                name: item.name,
                description: item.description,
                filename: item.filename,
                enabledPluginAlike: options.enabledPluginAlike,
                mimeTypes: [item]
            })
        });
        plugins = new PluginArray(pluginsArr);
    }
    setPrivateProp(navigatorObj, 'plugins', plugins);

}

/**
 * @method createNavigator 创建Navigator
 * @param {Object} options 配置项
 * @param {Boolean} options.enabledPluginAlike enabledPlugin属性是否一致
 * @param {Array} options.mimeTypes 需要设置的mimeTypes属性
 * **/
function createNavigator(options = {}) {
    const navigator = new Navigator({
        "vendorSub": "",
        "productSub": "20030107",
        "vendor": "Google Inc.",
        "maxTouchPoints": 0,
        "pdfViewerEnabled": true,
        "hardwareConcurrency": 4,
        "cookieEnabled": true,
        "appCodeName": "Mozilla",
        "appName": "Netscape",
        "appVersion": "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
        "platform": "Win32",
        "product": "Gecko",
        "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
        "language": "en",
        "languages": [
            "en",
            "zh-CN"
        ],
        "onLine": true,
        "webdriver": false,
        "deprecatedRunAdAuctionEnforcesKAnonymity": false,
        "deviceMemory": 8
    });

    //设置getBattery
    setPrivateProp(navigator, 'getBattery', new Promise((resolve, reject) => {
        resolve(new BatteryManager());
    }));

    //设置webkitPersistentStorage
    setPrivateProp(navigator, 'webkitPersistentStorage', new DeprecatedStorageQuota());

    //设置connection
    const connection = new NetworkInformation();
    setPrivateProp(connection, 'downlink', 10);
    setPrivateProp(connection, 'effectiveType', '4g');
    setPrivateProp(connection, 'rtt', 50);
    setPrivateProp(connection, 'saveData', false);
    setPrivateProp(navigator, 'connection', connection);

    const defaultMimeTypes = [{
        suffixes: "pdf",
        type: "application/pdf",
        description: "Portable Document Format",
        filename: 'internal-pdf-viewer',
        name: 'PDF Viewer'
    }, {
        suffixes: "pdf",
        type: "text/pdf",
        description: "Portable Document Format",
        filename: 'internal-pdf-viewer',
        name: 'PDF Viewer'
    }];
    //设置mimeTypes、plugins
    setNavigatorMimeTypes(navigator, {
        enabledPluginAlike: 'enabledPluginAlike' in options? options.enabledPluginAlike : true,
        mimeTypes: options.mimeTypes || defaultMimeTypes
    });

    setPrivateProp(navigator, 'locks', new LockManager());
    return navigator;
}

module.exports = {
    createNavigator,
    setNavigatorMimeTypes
};
