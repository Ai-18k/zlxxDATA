const {
    addObjProp,
    updateFunToString
} = require("../utility.js");

/**
 * @method createChrome 创建chrome
 @param {Boolean} options.hasChromeApp chrome中是否包含app属性
 * */
function createChrome(options = {}) {
    const chrome = {};

    addObjProp(chrome, {
        name: 'loadTimes',
        value: updateFunToString(function () {
            return {};
        })
    });
    addObjProp(chrome, {
        name: 'csi',
        value: updateFunToString(function () {
            return {};
        })
    });

    const hasChromeApp = typeof options.hasChromeApp === 'boolean' ? options.hasChromeApp : true;
    if (hasChromeApp) {
        const app = {};
        addObjProp(app, {
            name: 'isInstalled',
            value: false
        });
        addObjProp(app, {
            name: 'getDetails',
            value: updateFunToString(() => {
            }, 'getDetails')
        });
        addObjProp(app, {
            name: 'getIsInstalled',
            value: updateFunToString(() => {
                return chrome.app.isInstalled;
            }, 'getIsInstalled')
        });
        addObjProp(app, {
            name: 'installState',
            value: updateFunToString(() => {
            }, 'installState')
        });
        addObjProp(app, {
            name: 'runningState',
            value: updateFunToString(() => {
                return 'cannot_run';
            }, 'runningState')
        });
        addObjProp(app, {
            name: 'InstallState',
            value: {"DISABLED": "disabled", "INSTALLED": "installed", "NOT_INSTALLED": "not_installed"}
        });
        addObjProp(app, {
            name: 'RunningState',
            value: {"CANNOT_RUN": "cannot_run", "READY_TO_RUN": "ready_to_run", "RUNNING": "running"}
        });

        addObjProp(chrome, {
            name: 'app',
            value: app
        });
    }

    return chrome;
}

createChrome()

module.exports = createChrome;