
Function.prototype.__constructor_back = Function.prototype.constructor;
Function.prototype.constructor = function() {
    if(arguments && typeof arguments[0]==='string'){
        if("debugger"===arguments[0]){
            return
        }
    }
    return Function.prototype.__constructor_back.apply(this, arguments);
}



var _constructor = constructor;
Function.prototype.constructor = function(s) {
    if(s == "debugger"){
        console.log(s);
        return null;
    }
    return _constructor(s);
}



var _Function = Function;
Function = function(s) {
    if(s == "debugger"){
        console.log(s);
        return null;
    }
    return _Function(s);
}
console.log('222')



XMLHttpRequest.prototype.open=function(){
    console.log(arguments);
    debugger
    return XMLHttpRequest.prototype.open.apply(this, arguments);
}