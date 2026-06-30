const {setPrivateProp} = require("../utility.js");
const {Storage} = require("../CommonApi/api");


function createStorage(){
    const localStorage = new Storage();
    setPrivateProp(localStorage, 'storageName', 'localStorage');

    const sessionStorage = new Storage();
    setPrivateProp(sessionStorage, 'storageName', 'sessionStorage');

    return {
        localStorage,
        sessionStorage
    }
}

module.exports =  createStorage;