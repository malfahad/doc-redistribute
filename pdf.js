var map = []
var fs = require('fs');
var pdfjs = require('pdfjs-dist');
var p = 1;
var allrespath = require('../resultspath').allrespath;

var data = new Uint8Array(fs.readFileSync(allrespath+'/btech22.pdf'));


pdfjs.getDocument(data).then(function (pdfDocument) {
    for(var i=1;i<=pdfDocument.numPages;i++){
        pdfDocument.getPage(i).then(function (page) {
            //  console.log(page._buffer);
            page.getTextContent().then(function (textcontent) {

                var r= textcontent.items[8].str.replace(' ','');
                map.push(r);
                console.log(r+' --- index: '+p++);
            });
        })
    }
});