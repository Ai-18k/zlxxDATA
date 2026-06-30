const {
    getPrivateProp,
    setPrivateProp,
    setFunctionPrototype,
    addObjProp,
    originArray,
    originSet
} = require("../../utility.js");
const {updateFunToString} = require("../../utility.js");

function URLSearchParams(search) {
    if (search) {
        const searchList = search.split('&');
        setPrivateProp(this, 'searchList', searchList);
        setPrivateProp(this, 'size', searchList.length || 0);
    }
}

setFunctionPrototype(URLSearchParams, () => {
    addObjProp(URLSearchParams.prototype, {
        name: 'size',
        get: function size() {
            return getPrivateProp(this, 'size');
        }
    });
    addObjProp(URLSearchParams.prototype, {
        name: 'append',
        value: function append(name, value) {
            const searchList = getPrivateProp(this, 'searchList');
            searchList.push(`${name}=${value}`)
        }
    });
    addObjProp(URLSearchParams.prototype, {
        name: 'delete',
        value: updateFunToString(function (name, value = undefined) {
            const searchList = getPrivateProp(this, 'searchList');
            for (let i = 0; i < searchList.length; i++) {
                const item = searchList[i];
                const itemValue = item.split('=')[1];
                if (item.indexOf(`${name}=`) === 0) {
                    if (value === undefined || itemValue === value.toString()) {
                        searchList[i] = '';
                    }
                }
            }
            setPrivateProp(this, 'searchList', searchList.filter((item) => item !== ''));
        }, 'delete')
    });
    addObjProp(URLSearchParams.prototype, {
        name: 'get',
        value: function get(name) {
            const searchList = getPrivateProp(this, 'searchList');
            let value = '';
            for (let i = 0; i < searchList.length; i++) {
                const item = searchList[i];
                if (item.indexOf(`${name}=`) === 0) {
                    value = item.split('=')[1];
                    break;
                }
            }
            return value;
        }
    });
    addObjProp(URLSearchParams.prototype, {
        name: 'getAll',
        value: function getAll(name) {
            const searchList = getPrivateProp(this, 'searchList');
            let valueList = [];
            for (let i = 0; i < searchList.length; i++) {
                const item = searchList[i];
                if (item.indexOf(`${name}=`) === 0) {
                    valueList.push(item.split('=')[1])
                }
            }
            return valueList;
        }
    });
    addObjProp(URLSearchParams.prototype, {
        name: 'has',
        value: function has(name) {
            const searchList = getPrivateProp(this, 'searchList');
            let exitName = false;
            for (let i = 0; i < searchList.length; i++) {
                const item = searchList[i];
                if (item.indexOf(`${name}=`) === 0) {
                    exitName = true;
                    break;
                }
            }
            return exitName
        }
    });
    addObjProp(URLSearchParams.prototype, {
        name: 'set',
        value: function set(name, value) {
            const searchList = getPrivateProp(this, 'searchList');
            for (let i = 0; i < searchList.length; i++) {
                const item = searchList[i];
                if (item.indexOf(`${name}=`) === 0) {
                    searchList[i] = `${name}=${value}`;
                }
            }
            setPrivateProp(this, 'searchList', originArray.from(new originSet(searchList)));
        }
    });
    addObjProp(URLSearchParams.prototype, {
        name: 'sort',
        value: function sort() {}
    });
    addObjProp(URLSearchParams.prototype, {
        name: 'toString',
        value: function toString() {
            const searchList = getPrivateProp(this, 'searchList');
            return searchList.join('&');
        }
    });
    addObjProp(URLSearchParams.prototype, {
        name: 'entries',
        value: function entries() {
            const searchList = getPrivateProp(this, 'searchList');
            let index = 0;

            return {
                next: () => {
                    return {
                        value: searchList[index++]?.split('='),
                        done: index > searchList.length
                    };
                }
            };
        }
    });
    addObjProp(URLSearchParams.prototype, {
        name: 'forEach',
        value: function forEach(callback) {
            const searchList = getPrivateProp(this, 'searchList');
            for (let i = 0; i < searchList.length; i++) {
                const itemList = searchList[i].split('=');
                callback(itemList[1], itemList[0], this);
            }
        }
    });
    addObjProp(URLSearchParams.prototype, {
        name: 'keys',
        value: function keys() {
            const searchList = getPrivateProp(this, 'searchList');
            let index = 0;

            return {
                next: () => {
                    return {
                        value: searchList[index++]?.split('=')[0],
                        done: index > searchList.length
                    };
                }
            };
        }
    });
    addObjProp(URLSearchParams.prototype, {
        name: 'values',
        value: function values() {
            const searchList = getPrivateProp(this, 'searchList');
            let index = 0;

            return {
                next: () => {
                    return {
                        value: searchList[index++]?.split('=')[1],
                        done: index > searchList.length
                    };
                }
            };
        }
    });
});

addObjProp(URLSearchParams.prototype, {
    name: Symbol.iterator,
    value: function entries() {
    },
    enumerable: false
});

module.exports = URLSearchParams;