const {
    setFunctionPrototype,
    setPrivateProp,
    getPrivateProp,
    getOriginObj,
    originDate
} = require("../../utility.js");
const AnimationTimeline = require("./AnimationTimeline.js");

function DocumentTimeline(){
    const originPerformance = getOriginObj(performance)
    const timeOrigin = getPrivateProp(originPerformance,'timeOrigin')
    const currentTime = originDate.now();
    setPrivateProp(this,'currentTime', currentTime - timeOrigin);
}

setFunctionPrototype(DocumentTimeline, () => {}, AnimationTimeline);

module.exports = DocumentTimeline;
