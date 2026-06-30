const {
    addObjProp,
    setFunctionPrototype,
    setPrivateProp,
    createError
} = require("../../utility.js");
const HTMLDocument = require("./HTMLDocument.js");
const DocumentType = require("./DocumentType.js");
const XMLDocument = require("./DocumentType.js");

function DOMImplementation(){}

setFunctionPrototype(DOMImplementation,()=>{
    addObjProp(DOMImplementation.prototype,{
        name: "createDocument",
        value: function createDocument(namespaceURI, tagName, documentType=null){
            return new XMLDocument({
                tagName: tagName,
                doctype:  documentType
            });
        }
    });
    addObjProp(DOMImplementation.prototype,{
        name: "createDocumentType",
        value: function createDocumentType(tagName, publicId, systemId){
            if (!tagName) throw createError("Failed to execute 'createDocumentType' on 'DOMImplementation': The qualified name provided is empty.","InvalidCharacterError");
            const documentDoctype = new DocumentType();
            setPrivateProp(documentDoctype, 'name', tagName);
            setPrivateProp(documentDoctype, 'publicId', publicId || '');
            setPrivateProp(documentDoctype, 'systemId', systemId || '');
            return documentDoctype
        }
    });
    addObjProp(DOMImplementation.prototype,{
        name: "createHTMLDocument",
        value: function createHTMLDocument(title=''){
            return new HTMLDocument({title});
        }
    });
    addObjProp(DOMImplementation.prototype,{
        name: "hasFeature",
        value: function hasFeature(feature='', version=''){
            return true;
        }
    });
});

module.exports = DOMImplementation;