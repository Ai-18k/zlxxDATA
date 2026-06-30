/**
 * @var envOption 全局环境配置
 * @property {Boolean} log 是否打印日志
 * @property {Boolean} dev 开发模式
 * @property {Symbol} symbolProxyObj 代理对象
 * @property {Symbol} symbolOriginObj 用于更改apply、construct行为内部this指向到原生对象,而非Proxy对象
 * @property {Symbol} symbolFullName 用于表示被创建的元素全称,方便在内存中通过此属性精准定位到来区别Func返回对象,在日志中凭此区分(用于proxy日志中的options.name)
 * @property {String} logFileName 日志文件
 * @property {Array} filtersProxyObj 某些对象需要单独代理，不能迭代代理，如：document、storage等
 * @property {Array} debugProxyProp 需要调试的属性
 * @property {Array} debugProxyFunArg 需要调试的函数参数
 * */
let envOption = {
    log: false,
    dev: true,
    symbolProxyObj: Symbol('proxyObj'),
    symbolOriginObj: Symbol('originObj'),
    symbolFullName: Symbol('fullName'),
    logFileName: 'getEnv',
    filtersProxyObj: [],
    debugProxyProp: [],
    debugProxyFunArg: []
}
const originObject = Object;

const privatePropMap = new WeakMap();

/**
 * @method setWeakMapProp 设置对象私有属性
 * @param {Object} obj 对象
 * @param {String || Symbol} prop 属性名
 * @param {Object} value 属性值
 * */
function setPrivateProp(obj, prop, value) {
    obj = getPrivateProp(obj, envOption.symbolOriginObj) || obj;
    if (privatePropMap.has(obj)) {
        privatePropMap.get(obj)[prop] = value;
    } else {
        privatePropMap.set(obj, {[prop]: value});
    }
    return true;
}

/**
 * @method getPrivateProp 获取对象私有属性
 * @param {Object} obj 对象
 * @param {String || Symbol} prop 属性名
 * @returns {Object}
 * */
function getPrivateProp(obj, prop) {
    try {
        if (typeof prop === 'symbol') {
            return privatePropMap.get(obj)[prop]
        } else {
            const newObj = privatePropMap.get(obj)[envOption.symbolOriginObj] || obj;
            return privatePropMap.get(newObj)[prop];
        }
    } catch (e) {
        return null;
    }
}

/**
 * @method getPrivateProp 获取源对象，非代理逻辑时对对象操作需使用源对象，否则代理日志会掺杂非代理日志
 * @param {Object} obj 对象
 * */
function getOriginObj(obj) {
    return getPrivateProp(obj, envOption.symbolOriginObj) || obj;
}

/**
 * @method updateFunToString 修改函数的toString
 * @param {Function} callback 需要修改的函数
 * @param {String} [extName] 需要添加的额外函数名
 * */

function updateFunToString(callback, extName) {
    let toStr = getPrivateProp(callback, 'toStr');
    if (!toStr) {
        toStr = `function ${callback.name}() { [native code] }`;
        if (callback.name && extName) {
            toStr = `function ${extName} ${callback.name}() { [native code] }`;
        } else if (extName) {
            toStr = `function ${extName}() { [native code] }`;
        }
        setPrivateProp(callback, 'toStr', toStr);
    }
    return callback;
}

const originToString = Function.prototype.toString;
originObject.defineProperty(Function.prototype, 'toString', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: updateFunToString(function toString() {
        let toStr = getPrivateProp(this, 'toStr');
        const originFunction = getOriginObj(this);
        return toStr || Reflect.apply(originToString, originFunction, arguments);
    })
});

/**
 * @method setFunctionPrototype 设置函数原型
 * @param {Function} fun 需要设置原型的函数
 * @param {Function} [callback] 回调函数，由于原型得属性是有一定顺序，而constructor、Symbol.toStringTag在最后，该回调函数方便加载其他原型属性
 * @param {Function} [prototypeFun] 需要继承的原型函数,如果不传默认继承Object
 * */
function setFunctionPrototype(fun, callback, prototypeFun) {
    fun = updateFunToString(fun);
    fun.prototype = new fun();
    fun.prototype.__proto__ = prototypeFun ? prototypeFun.prototype : originObject.prototype;
    if (callback) callback();
    //部分原型constructor属性不在最后
    if (!fun.prototype.hasOwnProperty('constructor')) {
        addObjProp(fun.prototype, {
            name: 'constructor',
            value: fun,
            enumerable: false
        });
    }
    //部分原型constructor属性不在最后
    addObjProp(fun.prototype, {
        name: Symbol.toStringTag,
        value: fun.name,
        enumerable: false,
        writable: false
    });
}

/**
 * @method addObjProp 添加对象属性
 * @param {Object} obj 需要添加属性的原型
 * @param {Object} propOption 需要添加的属性
 * @property {String} propOption.name 需要添加的属性名
 * @property {Function} [propOption.value] 需要添加的属性值
 * @property {Function} [propOption.get] 需要添加的get方法
 * @property {Function} [propOption.set] 需要添加的set方法
 * @property {Boolean} [propOption.writable] 需要添加的属性是否可写
 * @property {Boolean} [propOption.enumerable] 需要添加的属性是否可枚举
 * @property {Boolean} [propOption.configurable] 需要添加的属性是否可配置
 * */
function addObjProp(obj, propOption) {
    const options = {};
    if ('value' in propOption) {
        if (propOption.value instanceof Function) {
            options.value = updateFunToString(propOption.value);
        } else {
            options.value = propOption.value;
        }
        options.writable = 'writable' in propOption ? propOption.writable : true;
    } else if ('get' in propOption || 'set' in propOption) {
        options.get = undefined;
        options.set = undefined;
        if (propOption.get) {
            Object.defineProperty(propOption.get, 'name', {
                value: `get ${propOption.get.name}`,
                configurable: true,
                writable: false,
                enumerable: false
            });
            options.get = updateFunToString(propOption.get);
        }
        if (propOption.set) {
            Object.defineProperty(propOption.set, 'name', {
                value: `set ${propOption.set.name}`,
                configurable: true,
                writable: false,
                enumerable: false
            });
            options.set = updateFunToString(propOption.set, 'set');
        }
    } else {
        options.writable = 'writable' in propOption ? propOption.writable : true;
    }
    options.enumerable = 'enumerable' in propOption ? propOption.enumerable : true;
    options.configurable = 'configurable' in propOption ? propOption.configurable : true;
    originObject.defineProperty(obj, propOption.name, options);
}

/**
 * @method setSymbolIterator 设置对象Symbol.iterator
 * @param {Object} obj 需要设置Symbol.iterator的对象
 * @param {Boolean} isSet 是否需要设置Symbol.iterator属性，默认true
 * @return {Function} 返回values函数
 * */
function setSymbolIterator(obj, isSet = true) {
    function values() {
        let index = 0;

        return {
            next: () => {
                return {
                    value: this[index++],
                    done: index > this.length
                };
            }
        };
    }

    if (isSet) {
        addObjProp(obj, {
            name: Symbol.iterator,
            value: values,
            enumerable: false
        });
    }

    return values;
}

/**
 * @method ArrayPrototype 初始化数组原型
 * @param {Object} obj 需要初始化的对象
 * @param {Object} arr 需要初始化的对象
 * @description 有许多对象具有数组的特性,却不是数组,该方法用于构造数组
 * */
function ArrayPrototype(obj, arr) {
    if (arr) {
        arr.forEach((item, index) => {
            obj[index] = item;
        });
        setArrayPrivateProp(obj);
    }
}

/**
 * @method initArray 初始化数组,配合ArrayPrototype使用
 * @param {Object} obj 需要初始化的对象
 * @param {Boolean} hasIterator 是否需要添加Symbol.iterator属性
 * @description 大部分数组构造好后都具有length、Symbol.iteratorSHUXB等属性,该方法用于初始化这些属性
 * */
function initArray(obj, hasIterator = true) {
    addObjProp(obj, {
        name: 'length',
        get: updateFunToString(function length() {
            return originObject.keys(this).length;
        }, 'get'),
    });

    const values = setSymbolIterator(obj, hasIterator);

    if ('values' in obj) {
        addObjProp(obj, {
            name: 'values',
            value: values,
        });
    }
}

/**
 * @method setArrayPrivateProp 设置数组私有属性
 * @description 由于ArrayPrototype声明的数组可能不存在添加、删除等操作，设置添加、删除等操作私有属性，便于修改属性
 * @param {object} obj 数组对象
 * */
function setArrayPrivateProp(obj) {
    setPrivateProp(obj, 'push', (items) => {
        const originObj = getOriginObj(obj);
        items = Array.isArray(items) ? items : [items];
        items.forEach((item) => {
            originObj[originObj.length] = item;
        });
    });
    setPrivateProp(obj, 'delete', (item) => {
        const originObj = getOriginObj(obj);
        const originItem = getOriginObj(item);
        for (let i = 0; i < originObj.length; i++) {
            const node = getOriginObj(originObj[i]);
            if (node === originItem) {
                delete originObj[i];
                break;
            }
        }
    });
    setPrivateProp(obj, 'insert', (newItem, childItem) => {
        const originObj = getOriginObj(obj);
        const originItem = getOriginObj(childItem);
        let beforeItem = newItem, forNu = originObj.length;
        for (let i = 0; i <= forNu; i++) {
            const node = getOriginObj(originObj[i]);
            if (node === originItem) {
                originObj[i] = newItem;
                beforeItem = node;
                forNu++;
            } else if (beforeItem) {
                originObj[i] = beforeItem;
                beforeItem = node;
            }
        }
    });
}

/**
 * @method getAttrProto 获取属性原型
 * @param {Object} obj 需要获取属性的对象
 * @param {String} attrName 需要获取的属性名
 * */
function getAttrProto(obj, attrName) {
    let rootProto = null;
    let proto = obj;
    while (!rootProto) {
        if (!proto) break;
        if (originObject.keys(proto).indexOf(attrName) > -1) {
            rootProto = proto;
        } else {
            proto = proto.__proto__;
        }
    }
    return rootProto;
}

/**
 * @method chalkLog 打印带颜色的日志
 * @param {String} color 颜色
 * @param {String} text 需要打印的文本
 * */
function chalkLog(color, text) {
    if (text) {
        const colorOption = {
            red: '31m', //红色
            green: '38;2;0;140;94m', //绿色
            lightGreen: '38;2;80;166;37m',//浅绿色
            purple: '38;2;138;43;226m',//紫色
            yellow: '38;2;238;118;33m',//黄色
            magenta: '38;2;205;41;144m',//洋红
        };
        console.log(`\u001b[${colorOption[color]}${text}\u001b[0m`);
    }
}

/**
 * @method slitStr 字符串分割
 * @param {String} str 需要分割的字符串
 * */
function slitStr(str) {
    return str?.length > 50 ? str.replace(/\n/g, '').replace(/^(.{25}).*(.{25})$/g, "$1****$2") : str;
}

/**
 * @method CreateGenerate 创建生成器对象
 * */
function CreateGenerate() {
    this.items = [];
}

CreateGenerate.prototype.push = function (x) {
    this.items.push(x)
}
CreateGenerate.prototype.loadGenerate = function* (x) {
    for (let i = 0; i < this.items.length; i++) {
        yield this.items[i];
    }
}

/**
 * @method toJSON 某些对象的toJSON属性
 * */
function toJSONProp(obj, keys) {
    let originObj = getOriginObj(obj);
    let objJSON = {};
    keys.forEach((key) => {
        if (originObj[key] && !(originObj[key] instanceof Function)) {
            objJSON[key] = originObj[key];
        }
    })
    return objJSON;
}

/**
 * @method getFunctionCallCount 获取函数执行次数
 * @param {Object} funCallNu 函数执行次数配置
 * @param {String} prop
 * */
function getFunctionCallCount(funCallNu, prop) {
    if (prop in funCallNu) {
        funCallNu[prop]++;
    } else {
        funCallNu[prop] = 1;
    }
}

/**
 * @method createError 闯将错误
 * @param {String} text 错误文本
 * @param {String} name 错误名
 * */
function createError(text, name) {
    let error;
    switch (name) {
        case 'TypeError':
            error = new TypeError(text);
            break;
        default:
            error = new Error(text);
            error.name = name;
    }
    return error;
}

/**
 * @method createIllegalInvocationError 函数非法调用错误
 * @param {Object} obj 调用函数的对象
 * @param {Array} constructors 构造函数数组
 * */
function createIllegalInvocationError(obj, constructors) {
    for (let constructor of constructors) {
        if (!(obj instanceof constructor)) {
            throw createError("Illegal invocation", "TypeError");
        }
    }
}

module.exports = {
    CreateGenerate,
    toJSONProp,
    envOption,
    setPrivateProp,
    getPrivateProp,
    updateFunToString,
    setFunctionPrototype,
    addObjProp,
    ArrayPrototype,
    initArray,
    getAttrProto,
    chalkLog,
    slitStr,
    setSymbolIterator,
    getOriginObj,
    setArrayPrivateProp,
    getFunctionCallCount,
    createError,
    createIllegalInvocationError,
    //某些对象可能存在重写或者代理的情况，由于原生对象代理或者重写会影响对象使用
    originObject: Object,
    originSetTimeout: setTimeout,
    originMath: Math,
    originJSON: JSON,
    originParseInt: parseInt,
    originParseFloat: parseFloat,
    originDate: Date,
    originArray: Array,
    originSet: Set,
    originEval: eval
}