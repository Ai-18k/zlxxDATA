const {getOriginObj} = require("../../utility.js");

function getSrc(src){
    if (src && !/^(http|https):\/\/.*/.test(src)){
        const originLocation = getOriginObj(location);
        const origin = originLocation.origin;
        src =src.at(-1) !== '/' ? origin +src : `${origin}/${src}`;
    }
    return src;
}

module.exports = getSrc;