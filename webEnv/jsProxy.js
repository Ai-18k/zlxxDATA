const {
    envOption,
    setPrivateProp,
    getPrivateProp,
    slitStr,
    chalkLog,
    getOriginObj,
    addObjProp,
    originJSON,
    originEval
} = require("./utility.js");
const fs = require("fs");
const createObjStatic = {};

envOption.filtersProxyObj = ['$_ts', 'constructor', 'prototype'];

/**
 * @method getCreateObjFullName 获取函数执行成功后新对象全称
 * @param {Object} option 配置
 * @property {Object} option.propFullName 属性全称
 * @property {Boolean} option.[fun] 是否是函数调用成功返回的结果
 * @property {Array} option.[argArray] 参数数组
 * @property {String} objFullName
 * */
function getCreateObjFullName(option) {
    if (option.fun) {
        let objFullName = '';
        if (option.argArray?.length) {
            objFullName = `${option.propFullName}(`;
            option.argArray.forEach((el) => {
                el = getOriginObj(el);
                if (el instanceof Object) {
                    if (el instanceof Function) {
                        objFullName += `${el.toString().split('{')[0]},`;
                    } else if (el instanceof HTMLElement || el instanceof Text) {
                        objFullName += `${el.constructor.name},`;
                    } else if (!(el instanceof Window)){
                        objFullName += `${slitStr(originJSON.stringify(el))},`;
                    }
                } else {
                    objFullName += `"${el}",`
                }
            });
            objFullName = `${objFullName.slice(0, objFullName.length - 1).trim()})`;
        } else {
            objFullName = `${option.propFullName}()`;
        }
        return objFullName;
    } else {
        if (createObjStatic[option.propFullName]) {
            createObjStatic[option.propFullName]++;
        } else {
            createObjStatic[option.propFullName] = 0;
        }
        return createObjStatic[option.propFullName] ? `${option.propFullName}_${createObjStatic[option.propFullName]}` : option.propFullName;
    }
}

/**
 * @method outLog 输出日志
 * @param logOption { object } 日志配置
 * @property logOption.text 日志文本
 * @property logOption.type 日志类型fun、prop
 * */
function outLog(logOption) {
    if (envOption.log) {
        const colorOption = {
            apply: 'purple',
            get: 'lightGreen',
            set: 'green',
            construct: 'magenta',
            other: 'yellow',
        };
        chalkLog(colorOption[logOption.type], logOption.text);
    }
};

/**
 * @method getObjType 获取对象类型
 * @param obj { Object } 对象
 * @return { String } 对象类型
 * */
const getObjType = function (obj) {
    let type = `[object ${obj[Symbol.toStringTag]}]`;
    if (!obj[Symbol.toStringTag]) {
        type = `[object ${obj.constructor.name}]`;
    }
    return type;
};

/***
 * @method getEnv 获取环境
 * @param options {Object} 获取环境的配置
 * @property obj { Object } 获取环境的对象
 * @property name { String } 对象名称
 * @property filtersProps { Array } 对象过滤属性
 * */
function getEnv(options) {
    let originObj = getOriginObj(options.obj);
    //eval中如果代码中包含this，代理时this指向时全局而不是当前对象，故不代理eval
    if(originObj === originEval) return  originObj;
    if((!(originObj instanceof Function)) && /^window.+/.test(options.name)){
        options.name = options.name.replace('window.', '');
    }
    if(originObj instanceof Window) options.name = 'window';
    const handler = {
        /**
         * @method get 代理get，每次获取对象属性时都会调用
         * @param target { Object } 对象
         * @param prop { String} 获取的属性名
         * @param receiver { Object } 接收者对象
         * */
        get: function (target, prop, receiver) {
            if(envOption.debugProxyProp.includes(prop))debugger;
            const originObj = getOriginObj(receiver);
            let result = Reflect.get(target, prop, originObj);
            let symbolFullName = getPrivateProp(target, envOption.symbolFullName);
            if (typeof prop === 'symbol' || envOption.filtersProxyObj.includes(prop)) return result;
            const originResult = getOriginObj(result);
            const logOption = {
                type: 'get',
                text: ''
            };
            if (originResult instanceof Object) {
                if (!(originResult instanceof Function) || (originResult instanceof Function && prop !== 'call')) {
                    const type = getObjType(originResult);
                    if (originResult instanceof Function && originResult.name !== prop) {
                        logOption.text = `{ get|obj：[${symbolFullName}] -> prop：[${prop.toString()}]，type：[${type}]，funName：[${originResult.name}] }`;
                    } else {
                        logOption.text = `{ get|obj：[${symbolFullName}] -> prop：[${prop.toString()}]，type：[${type}] }`;
                    }
                    //HTMLAllCollection为document.all对象，因为document.all即是undefined又是object所以不做代理
                    if(!(result instanceof HTMLAllCollection)){
                        const newObjFullName = !isNaN(Number(prop)) ? `${symbolFullName}[${prop}]` : `${symbolFullName}.${prop}`;
                        result = getEnv({
                            obj: result,
                            name: newObjFullName
                        });
                    }
                }
            } else if (typeof originResult === 'symbol') {
                logOption.text = `{ get|obj：[${symbolFullName}] -> prop：[${prop.toString()}]，value：[${slitStr(originResult.toString())}] }`;
            } else {
                let valueLength = originResult && originResult.length;
                logOption.text = `{ get|obj：[${symbolFullName}] -> prop：[${prop.toString()}]，value：[${slitStr(originResult)}]，length：[${valueLength}] }`;
            }
            outLog(logOption);
            return result;
        },
        /**
         * @method set 代理set，每次设置对象时调用
         * @param target { Object } 对象
         * @param prop { String } 设置的属性名
         * @param value { Object } 设置属性的value值
         * @param receiver { Object } 接收者对象
         * */
        set: function (target, prop, value, receiver) {
            if(envOption.debugProxyProp.includes(prop)) debugger;
            const originObj = getOriginObj(receiver);
            let result = Reflect.set(target, prop, value, originObj);
            let symbolFullName = getPrivateProp(target, envOption.symbolFullName);
            if (typeof prop === 'symbol' || envOption.filtersProxyObj.includes(prop)) return result;
            const originVal = getOriginObj(value);
            const logOption = {
                type: 'set',
                text: ''
            };
            if (originVal instanceof Object) {
                const type = getObjType(originVal);
                if (originVal instanceof Function) {
                    logOption.text = `{ set|obj：[${symbolFullName}] -> prop：[${prop.toString()}]，valueType：[${type}]，funName：[${originVal.name}] }`;
                } else {
                    logOption.text = `{ set|obj：[${symbolFullName}] -> prop：[${prop.toString()}]，valueType：[${type}] }`;
                }
            } else if (typeof originVal === 'symbol') {
                logOption.text = `{ set|obj：[${symbolFullName}] -> prop：[${prop.toString()}]，value：[${slitStr(originVal.toString())}] }`;
            } else {
                let valueLength = originVal && originVal.length;
                logOption.text = `{ set|obj：[${symbolFullName}] -> prop：[${prop.toString()}]，value：[${slitStr(originVal)}]，length：[${valueLength}] }`;
            }
            outLog(logOption);
            return result;
        },
        /**
         * @method apply 代理apply，每次调用都会触发
         * @param target { Function }  函数对象
         * @param obj { Function}  调用函数的this指针
         * @param argArray { Array }  参数列表
         * */
        apply: function (target, obj, argArray) {
            if(envOption.debugProxyProp.includes(target.name)) debugger;
            if(argArray.some((arg)=> envOption.debugProxyFunArg.includes(arg))) debugger;
            obj = getOriginObj(obj);
            let result = Reflect.apply(target, obj, argArray);
            let symbolFullName = getPrivateProp(target, envOption.symbolFullName);
            const originResult = getOriginObj(result);
            const logOption = {
                type: 'apply',
                text: ''
            };
            if (originResult instanceof Object) {
                const type = getObjType(originResult);
                logOption.text = `{ apply|function：[${symbolFullName}]，args：[${argArray}]，type：[${type}] }`;

                const newObjFullName = getCreateObjFullName({
                    propFullName: symbolFullName,
                    fun: true,
                    argArray: argArray
                });
                result = getEnv({
                    obj: result,
                    name: newObjFullName
                });
            } else if (typeof originResult === 'symbol') {
                logOption.text = `{ apply|function：[${symbolFullName}]，args：[${argArray}]，result：[${originResult.toString()}] }`;
            } else if (typeof originResult === "string") {
                logOption.text = `{ apply|function：[${symbolFullName}]，args：[${argArray}]，result：[${slitStr(originResult)}] }`;
            } else {
                logOption.text = `{ apply|function：[${symbolFullName}]，args：[${argArray}]，result：[${originResult}] }`;
            }
            outLog(logOption);
            return result;
        },
        /**
         * @method deleteProperty 代理deleteProperty，使用delete删除属性时触发
         * @param target { Object } 对象
         * @param prop { String } 删除的属性名
         * */
        deleteProperty: function (target, prop) {
            let result = Reflect.deleteProperty(target, prop);
            let symbolFullName = getPrivateProp(target, envOption.symbolFullName);
            if (typeof prop === 'symbol') return result;
            outLog({
                type: 'other',
                text: `{ deleteProperty|obj：[${symbolFullName}] -> prop：[${prop.toString()}]，value：[${result}] }`
            });
            return result;
        },
        /**
         * @method construct 代理construct，每次new创建实例时都会触发
         * @param target { Function }  函数对象
         * @param argArray { Array }  参数列表
         * @param newTarget { Function } 代理函数对象
         * */
        construct: function (target, argArray, newTarget) {
            if(envOption.debugProxyProp.includes(target.name)) debugger;
            let result = Reflect.construct(target, argArray, newTarget);
            let symbolFullName = getPrivateProp(target, envOption.symbolFullName);
            const resultName = result.constructor.name;
            const newObjFullName = getCreateObjFullName({
                propFullName: resultName,
                fun: true,
                argArray: argArray
            });
            result = getEnv({
                obj: result,
                name: newObjFullName
            });

            let type = `[object ${resultName}]`
            outLog({
                type: 'construct',
                text: `{ construct|function：[${symbolFullName}]，args：[${argArray}]，type：[${type}] }`
            });
            return result;
        },
        /**
         * @method has 代理has:，每次使用in操作符时都会触发
         * @param target { Object } 对象
         * @param prop { String }  对象属性
         * */
        has: function (target, prop) { // in 操作符
            let result = Reflect.has(target, prop);
            let symbolFullName = getPrivateProp(target, envOption.symbolFullName);
            outLog({
                type: 'other',
                text: `{ has|obj：[${symbolFullName}] -> prop：[${prop.toString()}]，result：[${result}] }`
            });
            return result;
        },
        // /**
        //  * @method ownKeys 代理ownKeys，获取对象自身的所有属性键时触发
        //  * @param target { Object } 对象
        //  * */
        // ownKeys: function (target) {
        //     let result = Reflect.ownKeys(target);
        //     return result;
        // },
        /**
         * @method getPrototypeOf 代理getPrototypeOf，获取对象的原型时触发
         * @param target { Object } 对象
         * */
        getPrototypeOf: function (target) {
            let result = Reflect.getPrototypeOf(target);
            let symbolFullName = getPrivateProp(target, envOption.symbolFullName);
            outLog({
                type: 'other',
                text: `{ getPrototypeOf|obj：[${symbolFullName}] -> result：[${result}] }`
            });
            return result;
        },
        /**
         * @method setPrototypeOf 代理setPrototypeOf，设置对象的原型时触发
         * @param target { Object } 对象
         * @param proto { Object } 原型对象
         * */
        setPrototypeOf: function (target, proto) {
            let result = Reflect.setPrototypeOf(target, proto);
            let symbolFullName = getPrivateProp(target, envOption.symbolFullName);
            outLog({
                type: 'other',
                text: `{ setPrototypeOf|obj：[${symbolFullName}] -> prototype：[${proto}]，result：[${result}] }`
            });
            return result;
        }
    };

    setPrivateProp(options.obj, envOption.symbolFullName, options.name);

    let symbolOriginObj = getPrivateProp(options.obj, envOption.symbolOriginObj);
    //如果options.obj下的envOption.symbolOriginObj存在说明，options.obj就是代理对象
    if (!symbolOriginObj){
        let proxyObj = getPrivateProp(options.obj, envOption.symbolProxyObj);
        if (!proxyObj) {
            proxyObj = new Proxy(options.obj, handler);
            setPrivateProp(options.obj, envOption.symbolProxyObj, proxyObj);
            setPrivateProp(proxyObj, envOption.symbolOriginObj, options.obj);
            const originWindow = getOriginObj(window);
            if (options.name === 'window' || options.name in originWindow) {
                setPrivateProp(window, options.name, proxyObj);
            }
        }
        return proxyObj;
    }else{
        return options.obj;
    }
}

if (envOption.log) { //配置是否将日志写到文件
    let fileName = `${process.cwd()}/${envOption.logFileName}.log`;
    let originConsoleLog = console.log;
    fs.writeFileSync(fileName, '');
    addObjProp(console, {
        name: 'log',
        value: function log() {
            let log = ''
            for (let i = 0; i < arguments.length; i++) {
                try {
                    let str = arguments[i].toString();
                    //取出打印颜色值中的日志字符
                    str = str.split('\u001b[0m')[0];
                    if (/^\u001b\[[0-9;]*m/g.test(str)) {
                        str = str.split(/^\u001b\[[0-9;]*m/g)[1];
                    }
                    log += `${str} `;
                } catch (e) {
                }
            }
            if (log) {
                log += '\n';
                fs.appendFileSync(fileName, log)
            }
            originConsoleLog(...arguments);
        }
    });
}

module.exports = getEnv;