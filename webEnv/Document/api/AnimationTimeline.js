const {
    addObjProp,
    getPrivateProp,
    setFunctionPrototype
} = require("../../utility.js");

function AnimationTimeline(){}

setFunctionPrototype(AnimationTimeline, () => {
    addObjProp(AnimationTimeline.prototype, {
        name: 'currentTime',
        get: function currentTime(){
            return getPrivateProp(this, 'currentTime');
        }
    });
    addObjProp(AnimationTimeline.prototype, {
        name: 'duration',
        get: function type(){
            return getPrivateProp(this, 'duration');
        }
    });
});

module.exports = AnimationTimeline;
