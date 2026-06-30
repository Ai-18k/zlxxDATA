const loadAppendChild = require("./fun/appendChild.js");
const loadRemoveChild = require("./fun/removeChild.js");
const queryFormProp = require("./fun/queryFormProp.js");
const updateUrl = require("./fun/updateUrl.js");
const getElementsByTagName = require("./fun/getElementsByTagName.js");
const getSrc = require("./fun/getSrc.js");

module.exports = {
    loadAppendChild,
    loadRemoveChild,
    queryFormProp,
    updateUrl,
    queryElementsByTagName: getElementsByTagName,
    getSrc
}