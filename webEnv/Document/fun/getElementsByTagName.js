const {updateFunToString} = require("../../utility.js");
const queryElementsByTagName = require("../../CommonApi/fun/getElementsByTagName.js");
const Document = require("../api/Document.js");

function loadGetElementsByTagName() {
    function getElementsByTagName(tagName) {
        return queryElementsByTagName(this, tagName);
    }

    Document.prototype.getElementsByTagName = updateFunToString(getElementsByTagName);
}

module.exports = loadGetElementsByTagName;