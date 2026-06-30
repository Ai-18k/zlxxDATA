const {updateFunToString} = require("../../utility.js");
const queryElementsByTagName = require("../../CommonApi/fun/getElementsByTagName.js");
const Element = require("../api/Element.js");

function loadGetElementsByTagName(){
    function getElementsByTagName(tagName){
        return queryElementsByTagName(this,tagName);
    }
    Element.prototype.getElementsByTagName = updateFunToString(getElementsByTagName);
}

module.exports = loadGetElementsByTagName;