const faker = require("./build/Release/faker");
document = {};
document.all = faker.DocumentAll(['a','b']);

function HTMLAllCollection() {}

document.all.__proto__ = new HTMLAllCollection();

console.log("document.all：", document.all);
console.log("typeof document.all：", typeof document.all);
console.log("document.all==undefined：", document.all==undefined);
console.log("Object.getPrototypeOf(document.all)：", Object.getPrototypeOf(document.all).toString());
console.log("document.all.__proto__：", document.all.__proto__.toString());

