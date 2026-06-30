const MediaQueryList = require("../api/MediaQueryList.js");
const {setPrivateProp} = require("../../utility.js");

function matchMedia(media) {
    const mediaQueryList = new MediaQueryList();
    const matches = {
        '(any-pointer:fine)': true,
        '(any-pointer:coarse)': false,
        '(any-pointer:none)': false,
        '(any-pointer)': true,
        '(any-hover:hover)': true,
        '(any-hover:on-demand)': false,
        '(any-hover:none)': false,
        '(any-hover)': true,
        '(color-gamut:srgb)': true,
        '(color-gamut:p3)': false,
        '(color-gamut:rec2020)': false,
        '(color-gamut)': true
    }
    setPrivateProp(mediaQueryList, 'media', media);
    setPrivateProp(mediaQueryList, 'matches', matches[media.replace(/\s/g, "")]);
    return mediaQueryList;
}

module.exports = matchMedia;