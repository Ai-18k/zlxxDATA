const {
    getPrivateProp,
    setPrivateProp,
    addObjProp,
    setArrayPrivateProp
} = require("../utility.js");
const faker = require("../NodePlugin/build/Release/faker");
const {
    HTMLDocument,
    HTMLAllCollection,
    DocumentTimeline,
    DOMImplementation
} = require("../Document/api");
const {
    HTMLHtmlElement,
    HTMLHeadElement
} = require("../TagApi");

function createDocument(){
    const head = new HTMLHeadElement({});
    const html = new HTMLHtmlElement({
        childNodes: [head],
        children: [head]
    });
    let document = new HTMLDocument({
        childNodes: [html],
        children: [html]
    });

    addObjProp(document,{
        name: 'location',
        get: function location(){
            return getPrivateProp(this, 'location');
        },
        set: function location(value) {
            return setPrivateProp(this, 'location', value)
        }
    });

    setPrivateProp(document, 'documentElement', html);
    setPrivateProp(document, 'scrollingElement', html);
    setPrivateProp(document, 'head', head);
    setPrivateProp(document, 'characterSet', 'UTF-8');
    setPrivateProp(document, 'hidden', false);
    setPrivateProp(document, 'timeline', new DocumentTimeline());
    setPrivateProp(document, 'implementation', new DOMImplementation());

    const documentAll = faker.DocumentAll([html, head]);
    documentAll.__proto__ = new HTMLAllCollection();
    setArrayPrivateProp(documentAll);
    setPrivateProp(document, 'all', documentAll);

    return document;
}


module.exports = createDocument;