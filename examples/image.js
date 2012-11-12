var rtf = require('../lib/rtf'),
    fs  = require('fs'),
    ImageElement = require('../lib/elements/image');

var myDoc = new rtf();

myDoc.elements.push(new ImageElement('examples/dog.jpg'));

myDoc.createDocument(
    function(err, output){
        //console.log(output); //that's a little much to output to the console
        fs.writeFile('image.rtf', output, function (err) {
          if (err) return console.log(err);
        });
    }
);